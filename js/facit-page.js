// Renderar facit-sidan (det riktiga utfallet) med tabbar.
(function () {
  const main = document.getElementById("facit-main");

  // --- Panel: Resultat (alla 72 i datumordning) ---
  const rows = FIXTURES.map((fx) => {
    const facit = FACIT.matches?.[fx.id]?.score || "";
    const out = outcomeFromScore(facit) || "–";
    return `
      <tr>
        <td class="date-cell">${fx.date}</td>
        <td>${fx.home} – ${fx.away}</td>
        <td class="num">${out}</td>
        <td class="score-cell num">${facit || '<span class="tag pending">väntar</span>'}</td>
      </tr>`;
  }).join("");
  const matchPanel = `
    <div class="table-wrap">
      <table>
        <thead><tr>
          <th>Datum</th><th>Match</th><th class="num">1X2</th><th class="num">Resultat</th>
        </tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;

  // --- Panel: Sluttabeller ---
  let groupPanel = `<div class="group-grid">`;
  for (const g of Object.keys(GROUPS)) {
    const order = FACIT.groups?.[g] || [];
    const items =
      order.length === 0
        ? `<li class="empty">Ej avgjord</li>`
        : order.map((t) => `<li>${t}</li>`).join("");
    groupPanel += `
      <div class="group-block">
        <h3>Grupp ${g}</h3>
        <ol class="standings">${items}</ol>
      </div>`;
  }
  groupPanel += `</div>`;

  // --- Panel: Special ---
  const specialRows = SPECIAL_QUESTIONS.map((q) => {
    let ans;
    if (q.type === "set") {
      const arr = FACIT.special?.[q.key] || [];
      ans = arr.length ? arr.join("<br>") : `<span class="tag pending">väntar</span>`;
    } else {
      ans = FACIT.special?.[q.key] || `<span class="tag pending">väntar</span>`;
    }
    return `<li><span class="q">${q.label} (${q.points} p)</span><span>${ans}</span></li>`;
  }).join("");
  const specialPanel = `<ul class="special-list">${specialRows}</ul>`;

  main.innerHTML =
    `<h1>Facit</h1>
     <p class="subtitle">Det officiella utfallet. Allas tips poängsätts mot det här.</p>
     <div class="tabs">
       <button data-tab="resultat" class="active">Resultat</button>
       <button data-tab="tabeller">Sluttabeller</button>
       <button data-tab="special">Specialval</button>
     </div>
     <section class="tab-panel" data-panel="resultat">${matchPanel}</section>
     <section class="tab-panel" data-panel="tabeller" hidden>${groupPanel}</section>
     <section class="tab-panel" data-panel="special" hidden>${specialPanel}</section>`;

  const buttons = main.querySelectorAll(".tabs button");
  const panels = main.querySelectorAll(".tab-panel");
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.toggle("active", b === btn));
      panels.forEach((p) => (p.hidden = p.dataset.panel !== btn.dataset.tab));
    });
  });
})();
