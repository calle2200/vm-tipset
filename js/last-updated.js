// Visar när facit senast uppdaterades (utifrån filens Last-Modified-header).
// Uppdateras automatiskt när facit.js ändras/publiceras – inget manuellt behövs.
(function () {
  const el = document.getElementById("last-updated");
  const bar = document.getElementById("update-bar");
  if (!el) return;

  function hide() { if (bar) bar.style.display = "none"; }

  function fmt(d) {
    const diff = Math.floor((Date.now() - d.getTime()) / 1000);
    let rel;
    if (diff < 0) rel = "nyss";
    else if (diff < 60) rel = "nyss";
    else if (diff < 3600) { const m = Math.floor(diff / 60); rel = `för ${m} min sedan`; }
    else if (diff < 86400) { const h = Math.floor(diff / 3600); rel = `för ${h} tim sedan`; }
    else { const dd = Math.floor(diff / 86400); rel = `för ${dd} ${dd === 1 ? "dag" : "dagar"} sedan`; }
    const abs =
      d.toLocaleDateString("sv-SE", { day: "numeric", month: "short" }) +
      " " +
      d.toLocaleTimeString("sv-SE", { hour: "2-digit", minute: "2-digit" });
    return `${rel} · ${abs}`;
  }

  fetch("js/facit.js?_=" + Date.now(), { method: "HEAD", cache: "no-store" })
    .then((r) => {
      const lm = r.headers.get("Last-Modified");
      if (!lm) return hide();
      const d = new Date(lm);
      if (isNaN(d.getTime())) return hide();
      el.textContent = fmt(d);
      el.title = d.toLocaleString("sv-SE");
    })
    .catch(hide);
})();
