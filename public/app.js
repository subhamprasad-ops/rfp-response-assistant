const questionEl = document.getElementById("question");
const charcount = document.getElementById("charcount");
const draftBtn = document.getElementById("draftBtn");
const statusLine = document.getElementById("statusLine");
const errorBox = document.getElementById("errorBox");
const resultsEl = document.getElementById("results");
const draftText = document.getElementById("draftText");
const sourceCards = document.getElementById("sourceCards");
const docGrid = document.getElementById("docGrid");
const kbBanner = document.getElementById("kb-count-banner");

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

// 1. Updated Knowledge Base Document Cards with Hover Magnification
async function loadDocuments() {
  try {
    const res = await fetch("/api/documents");
    const docs = await res.json();
    kbBanner.textContent = `Knowledge base: ${docs.length} documents indexed`;
    docGrid.innerHTML = docs
      .map(
        (d) => `
      <div class="group flex flex-col bg-slate-900/50 border border-slate-800 rounded-xl p-5 hover:bg-slate-800 hover:scale-105 hover:shadow-xl hover:shadow-indigo-500/10 hover:border-slate-600 transition-all duration-300 cursor-default">
        <div class="text-[10px] font-bold tracking-widest text-indigo-400 mb-2 uppercase">${escapeHtml(d.category)}</div>
        <div class="text-sm font-semibold text-slate-200 leading-snug mb-4">${escapeHtml(d.title)}</div>
        <div class="mt-auto inline-flex self-start px-2 py-1 bg-slate-950 rounded-md text-[10px] font-mono text-slate-500 border border-slate-800">${escapeHtml(d.id)}</div>
      </div>
    `
      )
      .join("");
  } catch (err) {
    kbBanner.textContent = "Knowledge base: unable to load";
  }
}
loadDocuments();

questionEl.addEventListener("input", () => {
  charcount.textContent = `${questionEl.value.length} characters`;
});

document.querySelectorAll(".chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    questionEl.value = chip.getAttribute("data-q");
    charcount.textContent = `${questionEl.value.length} characters`;
    questionEl.focus();
  });
});

// 2. Updated Retrieved Source Cards with sleek toggles and progress bars
function renderSources(matches) {
  sourceCards.innerHTML = matches
    .map((m, idx) => {
      const pct = Math.min(100, Math.round(m.score * 100));
      const cardId = `card-${idx}`;
      return `
      <div class="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden" id="${cardId}">
        <div class="p-4 flex flex-col gap-3">
          <div class="flex justify-between items-start gap-4">
            <div>
              <div class="text-[10px] font-mono font-semibold text-slate-500 uppercase tracking-widest mb-1.5">${escapeHtml(m.document.id)} &middot; ${escapeHtml(m.document.category)}</div>
              <div class="text-sm font-semibold text-slate-200 leading-snug">${escapeHtml(m.document.title)}</div>
            </div>
            <div class="inline-flex items-center px-2 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-bold text-indigo-400 tracking-wide whitespace-nowrap">
              Match ${pct}%
            </div>
          </div>
        </div>
        <div class="h-0.5 w-full bg-slate-800/50"><div class="h-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]" style="width:${pct}%"></div></div>
        <button class="w-full text-left px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider text-slate-500 hover:text-indigo-300 hover:bg-slate-800/50 transition-colors flex justify-between items-center" onclick="this.nextElementSibling.classList.toggle('hidden'); this.querySelector('span').classList.toggle('rotate-180');">
          Show full document text <span class="transition-transform duration-200 text-lg leading-none">&#9662;</span>
        </button>
        <div class="hidden p-4 text-xs text-slate-300 leading-relaxed font-mono bg-slate-950/50 border-t border-slate-800/80 whitespace-pre-wrap">${escapeHtml(m.document.content)}</div>
      </div>
    `;
    })
    .join("");
}

draftBtn.addEventListener("click", async () => {
  const question = questionEl.value.trim();
  errorBox.style.display = "none";

  if (!question) {
    errorBox.textContent = "Paste a client question first.";
    errorBox.style.display = "block";
    return;
  }

  draftBtn.disabled = true;
  statusLine.style.display = "flex";
  // 3. Upgraded the loading state to use a modern spinning SVG ring
  statusLine.innerHTML = `<svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-indigo-400 inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Retrieving context and drafting...`;
  resultsEl.style.display = "none";

  try {
    const res = await fetch("/api/draft", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, topK: 3 }),
    });
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || `Request failed (status ${res.status})`);
    }

    if (!data.matches || data.matches.length === 0) {
      errorBox.textContent =
        data.message ||
        "No matching policy or spec found in the knowledge base for this question.";
      errorBox.style.display = "block";
      return;
    }

    renderSources(data.matches);
    draftText.textContent = data.draft;
    resultsEl.style.display = "block";
  } catch (err) {
    errorBox.textContent = `Something went wrong: ${err.message}`;
    errorBox.style.display = "block";
  } finally {
    statusLine.style.display = "none";
    draftBtn.disabled = false;
  }
});

document.getElementById("copyBtn").addEventListener("click", () => {
  navigator.clipboard.writeText(draftText.textContent).then(() => {
    const btn = document.getElementById("copyBtn");
    const original = btn.textContent;
    btn.textContent = "Copied ✓";
    btn.classList.add("bg-indigo-600", "text-white", "border-indigo-600");
    btn.classList.remove("bg-slate-800", "text-slate-200", "border-slate-700");
    
    setTimeout(() => {
      btn.textContent = original;
      btn.classList.remove("bg-indigo-600", "text-white", "border-indigo-600");
      btn.classList.add("bg-slate-800", "text-slate-200", "border-slate-700");
    }, 2000);
  });
});