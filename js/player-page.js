// Renderar en spelares sida (spelare.html?id=...) med tabbar.
(function () {
  const main = document.getElementById("player-main");
  const id = new URLSearchParams(location.search).get("id");
  const player = PLAYERS.find((p) => p.id === id);

  if (!player) {
    main.innerHTML = `<h1>Spelare saknas</h1>
      <p class="empty">Hittade ingen spelare med id "<code>${id || ""}</code>".
      <a href="index.html">Tillbaka till leaderboard</a>.</p>`;
    return;
  }

  const s = scorePlayer(player);

  // --- Profil (alltid synlig) ---
  const profile = `
    <p><a href="index.html">← Leaderboard</a></p>
    <div class="profile">
      ${playerIcon(player, "big")}
      <div>
        <h1>${player.name}</h1>
        <div class="pts-pills">
          <span class="pill total">${s.total} p totalt</span>
          <span class="pill">Matcher: ${s.matchPoints}</span>
          <span class="pill">Grupper: ${s.groupPoints}</span>
          <span class="pill">Special: ${s.specialPoints}</span>
        </div>
      </div>
    </div>`;

  // --- Panel: Matcher (alla 72 i datumordning) ---
  const matchRows = FIXTURES.map((fx) => {
    const tip = player.matches?.[fx.id];
    const guessScore = tip?.score || "";
    const guessOut = tip?.outcome || outcomeFromScore(guessScore) || "–";
    const facit = FACIT.matches?.[fx.id]?.score || "";
    const res = scoreMatch(tip, facit);
    let tag;
    if (res.status === "score") tag = `<span class="tag score">+${res.points}</span>`;
    else if (res.status === "outcome") tag = `<span class="tag outcome">+${res.points}</span>`;
    else if (res.status === "miss" && facit) tag = `<span class="tag">0</span>`;
    else tag = `<span class="tag pending">–</span>`;
    const rowClass = res.status === "score" ? "r-score" : res.status === "outcome" ? "r-outcome" : "";
    return `
      <tr class="${rowClass}">
        <td class="date-cell">${fx.date}</td>
        <td>${fx.home} – ${fx.away}</td>
        <td class="num">${guessOut}</td>
        <td class="score-cell num">${guessScore || "–"}</td>
        <td class="num">${facit || "–"}</td>
        <td class="num">${tag}</td>
      </tr>`;
  }).join("");
  const matchPanel = `
    <div class="table-wrap">
      <table>
        <thead><tr>
          <th>Datum</th><th>Match</th>
          <th class="num">1X2</th><th class="num">Tips</th><th class="num">Facit</th><th class="num">P</th>
        </tr></thead>
        <tbody>${matchRows}</tbody>
      </table>
    </div>`;

  // --- Panel: Specialval ---
  const special = scoreSpecial(player.special, FACIT.special);
  const specialRows = special.details
    .map((d) => {
      if (d.type === "set") {
        const val =
          d.items.length === 0
            ? '<span class="empty">–</span>'
            : d.items
                .map((it) => {
                  let t = "";
                  if (it.status === "hit") t = `<span class="tag score">+${d.points}</span>`;
                  else if (it.status === "miss") t = `<span class="tag">0</span>`;
                  return `${it.value} ${t}`;
                })
                .join("<br>");
        return `<li><span class="q">${d.label}</span><span>${val}</span></li>`;
      }
      const val = d.guess || '<span class="empty">–</span>';
      let tag = "";
      if (d.status === "hit") tag = `<span class="tag score">+${d.points}</span>`;
      else if (d.status === "miss") tag = `<span class="tag">0</span>`;
      return `<li><span class="q">${d.label}</span><span>${val} ${tag}</span></li>`;
    })
    .join("");
  const specialPanel = `<ul class="special-list">${specialRows}</ul>`;

  // --- Panel: Gruppval ---
  let groupPanel = `<div class="group-grid">`;
  for (const g of Object.keys(GROUPS)) {
    const order = player.groups?.[g] || [];
    const facitOrder = FACIT.groups?.[g] || [];
    const items =
      order.length === 0
        ? `<li class="empty">Inget tips ifyllt</li>`
        : order
            .map((team, i) => {
              const hit = facitOrder[i] && facitOrder[i] === team;
              return `<li class="${hit ? "hit" : ""}">${team}${hit ? " ✓" : ""}</li>`;
            })
            .join("");
    const gs = scoreGroup(order, facitOrder);
    groupPanel += `
      <div class="group-block">
        <h3>Grupp ${g} ${gs.decided ? `<span class="tag score">+${gs.points}</span>` : ""}</h3>
        <ol class="standings">${items}</ol>
      </div>`;
  }
  groupPanel += `</div>`;

  // --- Tabbar ---
  main.innerHTML =
    profile +
    `<div class="tabs">
       <button data-tab="matcher" class="active">Matcher</button>
       <button data-tab="special">Specialval</button>
       <button data-tab="grupper">Gruppval</button>
     </div>
     <section class="tab-panel" data-panel="matcher">${matchPanel}</section>
     <section class="tab-panel" data-panel="special" hidden>${specialPanel}</section>
     <section class="tab-panel" data-panel="grupper" hidden>${groupPanel}</section>`;

  const buttons = main.querySelectorAll(".tabs button");
  const panels = main.querySelectorAll(".tab-panel");
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.toggle("active", b === btn));
      panels.forEach((p) => (p.hidden = p.dataset.panel !== btn.dataset.tab));
    });
  });
})();
