// Renderar leaderboard-sidan (index.html).
(function () {
  const board = buildLeaderboard();
  const tbody = document.querySelector("#leaderboard tbody");
  const cards = document.querySelector("#player-cards");

  // Standard tävlingsrankning: samma poäng delar placering, nästa hoppar fram
  // (t.ex. 1,1,3,3,3,3,7,7,9,10 — två 1:or => nästa är plats 3).
  let rank = 0;
  let prevTotal = null;
  board.forEach((row, i) => {
    if (row.total !== prevTotal) {
      rank = i + 1;
      prevTotal = row.total;
    }
    row.rank = rank;
  });

  tbody.innerHTML = board
    .map(
      (row) => {
        // Medalj/pall bara för placering 1–3 och när det finns poäng att tala om.
        const medal = row.total > 0 && row.rank <= 3 ? ` lb-medal-${row.rank}` : "";
        return `
      <tr class="lb-medal${medal}">
        <td class="lb-rank">${row.rank}</td>
        <td>
          <a href="spelare.html?id=${encodeURIComponent(row.player.id)}">
            ${playerIcon(row.player, "row")}${row.player.name}
          </a>
        </td>
        <td class="lb-gb">${row.player.special?.goldenBoot || "–"}</td>
        <td class="num hide-sm">${row.matchPoints}</td>
        <td class="num hide-sm">${row.groupPoints}</td>
        <td class="num hide-sm">${row.specialPoints}</td>
        <td class="num lb-total">${row.total}</td>
      </tr>`;
      }
    )
    .join("");

  cards.innerHTML = board
    .map(
      (row) => `
      <a class="card" href="spelare.html?id=${encodeURIComponent(row.player.id)}">
        <div class="av">${playerIcon(row.player, "card")}</div>
        <div class="nm">${row.player.name}</div>
        <div class="pts">${row.total} p</div>
      </a>`
    )
    .join("");
})();
