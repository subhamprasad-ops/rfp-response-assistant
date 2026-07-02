/**
 * Loads and parses the markdown knowledge base at server startup.
 *
 * Each .md file is expected to contain:
 *   # Document Title
 *   **Policy ID:** SEC-XXX-01   (or **Doc ID:** PROD-XXX-01)
 *   ...rest of the document body...
 *
 * Folder name under /data becomes the document's category, so you can add
 * a new category simply by creating a new folder — no code changes needed.
 */

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

  const titleMatch = raw.match(/^#\s+(.+)$/m);
  const idMatch = raw.match(/\*\*(?:Policy ID|Doc ID):\*\*\s*([A-Z0-9-]+)/i);

  const title = titleMatch ? titleMatch[1].trim() : titleCaseFromSlug(path.basename(filePath, ".md"));
  const id = idMatch ? idMatch[1].trim() : path.basename(filePath, ".md").toUpperCase();

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

  const categoryFolders = fs
    .readdirSync(DATA_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory());

  for (const folder of categoryFolders) {
    const categoryLabel = titleCaseFromSlug(folder.name);
    const folderPath = path.join(DATA_DIR, folder.name);

    const files = fs
      .readdirSync(folderPath)
      .filter((f) => f.endsWith(".md"));

    for (const file of files) {
      documents.push(parseDocument(path.join(folderPath, file), categoryLabel));
    }
  }

  return documents;
}

module.exports = { loadKnowledgeBase };
