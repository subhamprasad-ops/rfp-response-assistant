/**
 * Lightweight TF-IDF + cosine similarity retrieval engine.
 *
 * No external ML libraries or vector database required — this is intentional.
 * For a knowledge base of a few dozen to a few hundred documents, a plain
 * TF-IDF index is fast, dependency-free, and fully explainable (you can see
 * exactly why a document matched). Swap `buildIndex`/`search` for a real
 * embeddings + vector store (e.g. OpenAI/Voyage embeddings + pgvector or
 * Pinecone) if the knowledge base grows large or needs semantic matching
 * beyond keyword/term overlap.
 */

const STOPWORDS = new Set(
  ("a an the is are was were be been being do does did have has had will " +
    "would could should may might can this that these those of in on at to " +
    "for with as by from and or but if then so what which who whom your our " +
    "their its it we you they i he she").split(" ")
);

function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 1 && !STOPWORDS.has(t));
}

/**
 * Build a TF-IDF index over an array of documents.
 * @param {Array<{id: string, title: string, content: string}>} documents
 * @returns {object} index — pass this into `search`
 */
function buildIndex(documents) {
  const docTokens = documents.map((d) => tokenize(`${d.title} ${d.content}`));

  const df = {};
  docTokens.forEach((tokens) => {
    new Set(tokens).forEach((t) => {
      df[t] = (df[t] || 0) + 1;
    });
  });

  const N = documents.length;
  const idf = (term) => Math.log((N + 1) / ((df[term] || 0) + 1)) + 1;

  const vectorize = (tokens) => {
    const tf = {};
    tokens.forEach((t) => (tf[t] = (tf[t] || 0) + 1));
    const vec = {};
    let norm = 0;
    Object.keys(tf).forEach((t) => {
      const w = tf[t] * idf(t);
      vec[t] = w;
      norm += w * w;
    });
    return { vec, norm: Math.sqrt(norm) || 1 };
  };

  const docVectors = docTokens.map(vectorize);

  return { idf, vectorize, docVectors };
}

/**
 * Search the index for the top-K most relevant documents to a query.
 * @param {string} query
 * @param {object} index result of buildIndex()
 * @param {number} topK
 * @returns {Array<{index: number, score: number}>} sorted by score desc
 */
function search(query, index, topK = 3) {
  const qTokens = tokenize(query);
  const { vec: qVec, norm: qNorm } = index.vectorize(qTokens);

  const scores = index.docVectors.map((dv, i) => {
    let dot = 0;
    Object.keys(qVec).forEach((t) => {
      if (dv.vec[t]) dot += qVec[t] * dv.vec[t];
    });
    const sim = dot / (qNorm * dv.norm);
    return { index: i, score: sim };
  });

  return scores
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .filter((s) => s.score > 0);
}

module.exports = { tokenize, buildIndex, search };
