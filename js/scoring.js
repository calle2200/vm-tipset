// ============================================================
//  POÄNGBERÄKNING + UI-HJÄLP
//  Delade hjälpfunktioner som används av alla sidor.
// ============================================================

// Spelarikon: flagga för laget spelaren tippat vinna VM, annars emoji.
// variant: "row" (leaderboard) | "card" | "big" (profil).
function playerIcon(player, variant) {
  variant = variant || "row";
  const flagCls = { row: "flag-icon", card: "flag-icon flag-icon-card", big: "flag-icon flag-icon-big" }[variant];
  const emojiCls = { row: "avatar", card: "av", big: "big-av" }[variant];
  const emoji = player.avatar || "⚽";
  const team = player.special && player.special.winner;
  const slug = team && typeof TEAM_SLUG !== "undefined" ? TEAM_SLUG[team] : null;
  if (slug) {
    return `<img class="${flagCls}" src="assets/images/${slug}.png" alt="${team}"
      title="Tippad vinnare: ${team}" data-emoji="${emoji}" data-cls="${emojiCls}"
      onerror="flagFallback(this)">`;
  }
  return `<span class="${emojiCls}">${emoji}</span>`;
}

// Om flaggbilden saknas: byt ut mot emoji-ikonen.
function flagFallback(img) {
  const span = document.createElement("span");
  span.className = img.getAttribute("data-cls") || "avatar";
  span.textContent = img.getAttribute("data-emoji") || "⚽";
  img.replaceWith(span);
}

// Räknar ut 1X2 utifrån ett resultat ("2-1" -> "1", "1-1" -> "X", "0-2" -> "2").
function outcomeFromScore(score) {
  if (!score || !score.includes("-")) return null;
  const [h, a] = score.split("-").map((n) => parseInt(n, 10));
  if (Number.isNaN(h) || Number.isNaN(a)) return null;
  if (h > a) return "1";
  if (h < a) return "2";
  return "X";
}

// Poäng för en enskild match. playerTip = { outcome?, score? }.
// 1X2-valet (outcome) avgör 10-poängen; saknas det härleds det ur resultatet.
// Resultatbonus (max..0) ges bara om spelaren angett ett exakt resultat.
// Returnerar { points, status, bonus } där status = "score" | "outcome" | "miss" | "pending".
function scoreMatch(playerTip, facitScore) {
  if (!facitScore) return { points: 0, status: "pending" };

  const tip = playerTip || {};
  const pScore = tip.score || "";
  const pOutcome = tip.outcome || outcomeFromScore(pScore); // explicit 1X2 har företräde
  if (!pOutcome) return { points: 0, status: "miss" };

  const fo = outcomeFromScore(facitScore);
  if (fo === null || pOutcome !== fo) {
    return { points: 0, status: "miss" };
  }

  // Rätt 1X2. Bonus bara om spelaren faktiskt angett ett resultat.
  let bonus = 0;
  let exact = false;
  if (pScore) {
    const [ph, pa] = pScore.split("-").map((n) => parseInt(n, 10));
    const [fh, fa] = facitScore.split("-").map((n) => parseInt(n, 10));
    const diff = Math.abs(ph - fh) + Math.abs(pa - fa);
    bonus = Math.max(0, SCORING.resultBonusMax - SCORING.resultBonusPerGoal * diff);
    exact = diff === 0;
  }
  return {
    points: SCORING.outcome + bonus,
    status: exact ? "score" : "outcome",
    bonus,
  };
}

// Poäng för en grupp: rätt lag på exakt rätt placering.
function scoreGroup(playerOrder, facitOrder) {
  if (!facitOrder || facitOrder.length === 0) return { points: 0, hits: 0, decided: false };
  if (!playerOrder || playerOrder.length === 0) return { points: 0, hits: 0, decided: true };
  let hits = 0;
  for (let i = 0; i < facitOrder.length; i++) {
    if (playerOrder[i] && playerOrder[i] === facitOrder[i]) hits++;
  }
  return { points: hits * SCORING.groupPositionExact, hits, decided: true };
}

// Poäng för specialfrågorna (hanterar både "exact" och "set").
function scoreSpecial(playerSpecial, facitSpecial) {
  let points = 0;
  const details = [];
  for (const q of SPECIAL_QUESTIONS) {
    if (q.type === "set") {
      const guesses = playerSpecial?.[q.key] || [];
      const answers = facitSpecial?.[q.key] || [];
      const decided = answers.length > 0;
      const items = guesses.filter(Boolean).map((g) => {
        const hit = decided && answers.includes(g);
        if (hit) points += q.points;
        return { value: g, status: decided ? (hit ? "hit" : "miss") : "pending" };
      });
      details.push({ ...q, items, decided });
    } else {
      const guess = playerSpecial?.[q.key] || "";
      const answer = facitSpecial?.[q.key] || "";
      let status = "pending";
      if (answer) status = guess && guess === answer ? "hit" : "miss";
      if (status === "hit") points += q.points;
      details.push({ ...q, guess, answer, status });
    }
  }
  return { points, details };
}

// Total poäng för en spelare, uppdelat på kategorier.
function scorePlayer(player) {
  let matchPoints = 0;
  for (const fx of FIXTURES) {
    const guess = player.matches?.[fx.id];
    const answer = FACIT.matches?.[fx.id]?.score || "";
    matchPoints += scoreMatch(guess, answer).points;
  }

  let groupPoints = 0;
  for (const g of Object.keys(GROUPS)) {
    groupPoints += scoreGroup(player.groups?.[g], FACIT.groups?.[g]).points;
  }

  const special = scoreSpecial(player.special, FACIT.special);

  return {
    matchPoints,
    groupPoints,
    specialPoints: special.points,
    total: matchPoints + groupPoints + special.points,
  };
}

// Bygger en sorterad leaderboard.
function buildLeaderboard() {
  return PLAYERS.map((p) => ({ player: p, ...scorePlayer(p) }))
    .sort((a, b) => b.total - a.total);
}
