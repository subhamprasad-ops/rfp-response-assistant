require("dotenv").config();

const express = require("express");
const path = require("path");
// 1. Swapped the Anthropic SDK out for the Google Gen AI SDK
const { GoogleGenAI } = require("@google/genai");

const { loadKnowledgeBase } = require("./knowledgeBase");
const { buildIndex, search } = require("./retrieval");

const PORT = process.env.PORT || 3000;
// 2. Swapped model variable to use Gemini 2.5 Flash as default
const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));

// --- Build the RAG index once at startup ---
const documents = loadKnowledgeBase();
const index = buildIndex(documents);
console.log(`Knowledge base loaded: ${documents.length} documents indexed.`);

// 3. Initialized the Gemini Client setup
let ai = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
} else {
  console.warn(
    "GEMINI_API_KEY is not set. /api/draft will return an error until it is configured in .env."
  );
}

// --- Routes ---

// List all indexed documents (for the "browse knowledge base" panel)
app.get("/api/documents", (req, res) => {
  res.json(
    documents.map((d) => ({ id: d.id, category: d.category, title: d.title }))
  );
});

// Retrieval only — no LLM call. Useful for debugging / evaluating the
// retriever independently of generation quality.
app.post("/api/search", (req, res) => {
  const { question, topK = 3 } = req.body || {};
  if (!question || !question.trim()) {
    return res.status(400).json({ error: "`question` is required." });
  }

  const matches = search(question, index, topK).map((m) => ({
    score: m.score,
    document: documents[m.index],
  }));

  res.json({ matches });
});

// Full RAG pipeline: retrieve relevant documents, then ask Gemini to draft
// a grounded response citing the matched policy/spec IDs.
app.post("/api/draft", async (req, res) => {
  const { question, topK = 3 } = req.body || {};
  if (!question || !question.trim()) {
    return res.status(400).json({ error: "`question` is required." });
  }

  const matches = search(question, index, topK).map((m) => ({
    score: m.score,
    document: documents[m.index],
  }));

  if (matches.length === 0) {
    return res.json({
      matches: [],
      draft: null,
      message:
        "No matching policy or spec was found in the knowledge base for this question.",
    });
  }

  // 4. Checking for Gemini Key instead of Anthropic
  if (!ai) {
    return res.status(500).json({
      error:
        "Server is not configured with a GEMINI_API_KEY. Open your .env file and add your key.",
      matches,
    });
  }

  const context = matches
    .map((m) => `[${m.document.id}] ${m.document.title}\n${m.document.content}`)
    .join("\n\n---\n\n");

  const prompt = `You are a sales engineer drafting a response to a question from a client's RFP or security questionnaire. Use ONLY the internal documentation provided below. Write clear, confident, professional business prose (no headers, 2-5 sentences typically). Cite the relevant document ID in brackets at the end of a sentence when you state a specific fact, e.g. "...encrypted using AES-256 [SEC-ENC-01]." If the provided context does not fully answer the question, say so plainly rather than guessing.

CLIENT QUESTION:
"""${question}"""

RELEVANT INTERNAL DOCUMENTATION:
"""${context}"""

Write only the response text, ready to paste into the RFP document. Do not include a preamble.`;

  try {
    // 5. Updated to use the correct Google Gen AI generateContent method
    const response = await ai.models.generateContent({
      model: MODEL,
      contents: prompt,
    });

    const draft = response.text;

    res.json({ matches, draft });
  } catch (err) {
    console.error("Gemini API error:", err);
    res.status(502).json({
      error: `Draft generation failed: ${err.message}`,
      matches,
    });
  }
});

// Fallback route to manually serve the main webpage if static serving skips it
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`RFP Response Assistant running at http://localhost:${PORT}`);
});