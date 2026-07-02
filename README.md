# RFP Response Assistant

A retrieval-augmented generation (RAG) tool that helps sales engineers answer RFP and security-questionnaire questions in seconds instead of hours.

Paste a client's question → the app retrieves the exact company policy or product spec that answers it → Claude drafts a professional, citation-backed response ready to paste into the RFP document.

![status](https://img.shields.io/badge/status-working_demo-brightgreen) ![node](https://img.shields.io/badge/node-%3E%3D18-informational) ![license](https://img.shields.io/badge/license-MIT-lightgrey)

## Why this exists

Enterprise sales teams lose thousands of hours re-answering the same security and product questions across every RFP, because the answers already exist — scattered across security policies, compliance docs, and product specs that no one has time to search through under deadline. This project demonstrates a small, fully working RAG pipeline that solves that: a searchable knowledge base plus an LLM that drafts grounded, source-cited answers instead of hallucinating them.

## How it works

```
 1. Startup           2. User submits a question         3. Response
 ┌───────────┐        ┌──────────────────────┐        ┌──────────────────┐
 │ /data/*.md│  parse  │ "Are you SOC 2       │  TF-IDF │ Top-K matching   │
 │ policies &│ ------> │  Type II certified?" │ ------> │ documents +      │
 │ specs     │         └──────────────────────┘  cosine │ similarity score │
 └───────────┘                                   sim.    └────────┬─────────┘
       │                                                          │
       ▼                                                          ▼
 TF-IDF index                                          Claude drafts a response
 built in memory                                        grounded ONLY in the
                                                          retrieved documents,
                                                          citing document IDs
```

1. **Ingest** — on server startup, every `.md` file under `/data` is parsed into a document (id, category, title, content).
2. **Index** — a TF-IDF vector is built for each document, with an inverse-document-frequency weighting computed across the whole corpus.
3. **Retrieve** — when a question comes in, it's vectorized the same way and compared to every document with cosine similarity. The top 3 matches are returned with a similarity score.
4. **Generate** — the matched documents are passed to Claude as grounding context, with an explicit instruction to answer only from that context and cite document IDs (e.g. `[SEC-ENC-01]`). If nothing relevant is found, it says so instead of guessing.

No vector database or embeddings API is required — TF-IDF is fast, free, dependency-light, and fully explainable for a knowledge base of this size. See [Extending this project](#extending-this-project) for how to swap in real embeddings.

## Tech stack

| Layer | Choice |
|---|---|
| Backend | Node.js, Express |
| Retrieval | Hand-rolled TF-IDF + cosine similarity (no external ML libs) |
| Generation | [Claude API](https://docs.claude.com) via `@anthropic-ai/sdk` |
| Frontend | Vanilla HTML/CSS/JS (no build step, no framework) |
| Knowledge base | Plain Markdown files |

## Project structure

```
rfp-response-assistant/
├── data/
│   ├── security-policies/       # source-of-truth security docs (.md)
│   └── product-specs/           # source-of-truth product docs (.md)
├── server/
│   ├── index.js                 # Express app + API routes
│   ├── knowledgeBase.js         # loads & parses markdown into documents
│   └── retrieval.js             # TF-IDF index + cosine similarity search
├── public/
│   ├── index.html               # frontend shell
│   ├── style.css
│   └── app.js                   # calls the backend API, renders results
├── .env.example
├── package.json
└── README.md
```

## Getting started

**Prerequisites:** Node.js 18+ and an [Anthropic API key](https://console.anthropic.com/settings/keys).

```bash
# 1. Clone and install
git clone https://github.com/<your-username>/rfp-response-assistant.git
cd rfp-response-assistant
npm install

# 2. Configure your API key
cp .env.example .env
# then open .env and paste in your ANTHROPIC_API_KEY

# 3. Run it
npm start
```

Open **http://localhost:3000** in your browser. Try one of the example question chips, or paste your own.

## API reference

| Endpoint | Method | Body | Description |
|---|---|---|---|
| `/api/documents` | GET | — | List all indexed documents (id, category, title) |
| `/api/search` | POST | `{ "question": string, "topK"?: number }` | Retrieval only — no LLM call. Returns matched documents + similarity scores |
| `/api/draft` | POST | `{ "question": string, "topK"?: number }` | Full RAG pipeline — retrieval + Claude-drafted, citation-backed response |

## Extending this project

- **Swap the knowledge base** — drop your own real company's `.md` files into `/data/<category-name>/`. The server auto-discovers new category folders and re-parses on restart; no code changes needed.
- **Real embeddings** — replace `server/retrieval.js` with a call to an embeddings API (Voyage, OpenAI) and a vector store (pgvector, Pinecone, Chroma) for better semantic matching on paraphrased questions, once the knowledge base grows beyond what keyword-based TF-IDF handles well.
- **Confidence routing** — if the top match score is below a threshold, flag the question for a human on the deal desk instead of drafting a possibly-ungrounded answer.
- **Batch mode** — accept a CSV/spreadsheet of an entire RFP and auto-draft every row, exporting back to a spreadsheet.
- **Persistence** — log every question + draft + sources to a database, so you can build a dataset of previously-answered RFP questions over time.

## License

MIT — use this however you'd like.
