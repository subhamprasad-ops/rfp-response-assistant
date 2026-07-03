const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "..", "data");

function titleCaseFromSlug(slug) {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function parseDocument(filePath, category) {
  const raw = fs.readFileSync(filePath, "utf-8");

  // Gracefully handles missing markdown headers
  const titleMatch = raw.match(/^#\s+(.+)$/m);
  const idMatch = raw.match(/\*\*(?:Policy ID|Doc ID):\*\*\s*([A-Z0-9-]+)/i);

  const title = titleMatch ? titleMatch[1].trim() : titleCaseFromSlug(path.basename(filePath).replace(/\.(md|txt)$/, ""));
  const id = idMatch ? idMatch[1].trim() : path.basename(filePath).replace(/\.(md|txt)$/, "").toUpperCase();

  return {
    id,
    category,
    title,
    file: path.relative(DATA_DIR, filePath),
    content: raw.trim(),
  };
}

function loadKnowledgeBase() {
  const documents = [];

  // Prevents server crash if the data folder is completely missing
  if (!fs.existsSync(DATA_DIR)) {
    console.warn("Data directory not found. Starting with empty knowledge base.");
    return documents;
  }

  const entries = fs.readdirSync(DATA_DIR, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.isDirectory()) {
      // Logic for files inside subfolders
      const categoryLabel = titleCaseFromSlug(entry.name);
      const folderPath = path.join(DATA_DIR, entry.name);

      const files = fs
        .readdirSync(folderPath)
        .filter((f) => f.endsWith(".md") || f.endsWith(".txt")); // Accepts both extensions now!

      for (const file of files) {
        documents.push(parseDocument(path.join(folderPath, file), categoryLabel));
      }
    } else if (entry.isFile() && (entry.name.endsWith(".md") || entry.name.endsWith(".txt"))) {
      // Logic for files placed directly in the main data folder
      documents.push(parseDocument(path.join(DATA_DIR, entry.name), "General Travel"));
    }
  }

  return documents;
}

module.exports = { loadKnowledgeBase };