// ============================================================
//  KONFIGURATION
//  Grupper, alla matcher (i datumordning) och poängregler.
//  Sidorna byggs automatiskt utifrån detta.
// ============================================================

// --- Grupperna (12 grupper A–L, 4 lag i varje) ---
const GROUPS = {
  A: ["Mexiko", "Sydafrika", "Sydkorea", "Tjeckien"],
  B: ["Kanada", "Bosnien&Her", "Qatar", "Schweiz"],
  C: ["USA", "Paraguay", "Australien", "Turkiet"],
  D: ["Brasilien", "Marocko", "Haiti", "Skottland"],
  E: ["Tyskland", "Curaçao", "Elfenbenskusten", "Ecuador"],
  F: ["Nederländerna", "Japan", "Sverige", "Tunisien"],
  G: ["Spanien", "Kap Verde", "Saudiarabien", "Uruguay"],
  H: ["Belgien", "Egypten", "Iran", "Nya Zeeland"],
  I: ["Frankrike", "Senegal", "Irak", "Norge"],
  J: ["Argentina", "Algeriet", "Österrike", "Jordanien"],
  K: ["Portugal", "DR Kongo", "Uzbekistan", "Colombia"],
  L: ["England", "Kroatien", "Ghana", "Panama"],
};

// --- Poängregler ---
// Match: rätt 1X2 ger "outcome" poäng. ENDAST om 1X2 är rätt ges dessutom en
// resultatbonus = max(0, resultBonusMax - resultBonusPerGoal * total måldifferens).
// Ex (facit 2-1): tips 2-1 => 10+10=20, tips 3-1 => 10+8=18, tips 1-0 => 10+6=16, tips 0-1 => 0.
const SCORING = {
  outcome: 10,             // Rätt 1X2
  resultBonusMax: 10,      // Max bonus vid exakt resultat
  resultBonusPerGoal: 2,   // Avdrag per måls skillnad från facit
  groupPositionExact: 10,  // Rätt lag på exakt rätt placering i gruppen
};

// --- Specialfrågor (rättas mot facit.js) ---
// type "exact": ett svar, måste matcha exakt.
// type "set":   flera svar (slots st), poäng per lag som finns i facit-listan
//               (facit-listan = alla 4 lag i topp 4, inkl. vinnaren).
const SPECIAL_QUESTIONS = [
  { key: "winner",           label: "VM-Vinnare",       points: 100, type: "exact" },
  { key: "top4",             label: "Topp 4",           points: 60,  type: "set", slots: 3 },
  { key: "goldenBoot",       label: "Golden Boot",      points: 80,  type: "exact" },
  { key: "mostAssists",      label: "Flest Assist",     points: 70,  type: "exact" },
  { key: "mostGoalsCountry", label: "Flest Mål (Land)", points: 50,  type: "exact" },
  { key: "bestKeeper",       label: "Bäst Målvakt",     points: 60,  type: "exact" },
  { key: "firstGoal",        label: "Första målet",     points: 20,  type: "exact" },
];

// --- Alla 72 gruppmatcher i DATUMORDNING (id, datum, grupp, hemma, borta) ---
const FIXTURES = [
  { id: "A1", date: "11/6", group: "A", home: "Mexiko", away: "Sydafrika" },
  { id: "A2", date: "12/6", group: "A", home: "Sydkorea", away: "Tjeckien" },
  { id: "B1", date: "12/6", group: "B", home: "Kanada", away: "Bosnien&Her" },
  { id: "C1", date: "13/6", group: "C", home: "USA", away: "Paraguay" },
  { id: "B2", date: "13/6", group: "B", home: "Qatar", away: "Schweiz" },
  { id: "D1", date: "14/6", group: "D", home: "Brasilien", away: "Marocko" },
  { id: "D2", date: "14/6", group: "D", home: "Haiti", away: "Skottland" },
  { id: "C2", date: "14/6", group: "C", home: "Australien", away: "Turkiet" },
  { id: "E1", date: "14/6", group: "E", home: "Tyskland", away: "Curaçao" },
  { id: "F1", date: "14/6", group: "F", home: "Nederländerna", away: "Japan" },
  { id: "E2", date: "15/6", group: "E", home: "Elfenbenskusten", away: "Ecuador" },
  { id: "F2", date: "15/6", group: "F", home: "Sverige", away: "Tunisien" },
  { id: "G1", date: "15/6", group: "G", home: "Spanien", away: "Kap Verde" },
  { id: "H1", date: "15/6", group: "H", home: "Belgien", away: "Egypten" },
  { id: "G2", date: "16/6", group: "G", home: "Saudiarabien", away: "Uruguay" },
  { id: "H2", date: "16/6", group: "H", home: "Iran", away: "Nya Zeeland" },
  { id: "I1", date: "16/6", group: "I", home: "Frankrike", away: "Senegal" },
  { id: "I2", date: "17/6", group: "I", home: "Irak", away: "Norge" },
  { id: "J1", date: "17/6", group: "J", home: "Argentina", away: "Algeriet" },
  { id: "J2", date: "17/6", group: "J", home: "Österrike", away: "Jordanien" },
  { id: "K1", date: "17/6", group: "K", home: "Portugal", away: "DR Kongo" },
  { id: "L1", date: "17/6", group: "L", home: "England", away: "Kroatien" },
  { id: "L2", date: "18/6", group: "L", home: "Ghana", away: "Panama" },
  { id: "K2", date: "18/6", group: "K", home: "Uzbekistan", away: "Colombia" },
  { id: "A3", date: "18/6", group: "A", home: "Tjeckien", away: "Sydafrika" },
  { id: "B3", date: "18/6", group: "B", home: "Schweiz", away: "Bosnien&Her" },
  { id: "B4", date: "19/6", group: "B", home: "Kanada", away: "Qatar" },
  { id: "A4", date: "19/6", group: "A", home: "Mexiko", away: "Sydkorea" },
  { id: "C3", date: "19/6", group: "C", home: "USA", away: "Australien" },
  { id: "D3", date: "20/6", group: "D", home: "Skottland", away: "Marocko" },
  { id: "D4", date: "20/6", group: "D", home: "Brasilien", away: "Haiti" },
  { id: "C4", date: "20/6", group: "C", home: "Turkiet", away: "Paraguay" },
  { id: "F3", date: "20/6", group: "F", home: "Nederländerna", away: "Sverige" },
  { id: "E3", date: "20/6", group: "E", home: "Tyskland", away: "Elfenbenskusten" },
  { id: "E4", date: "21/6", group: "E", home: "Ecuador", away: "Curaçao" },
  { id: "F4", date: "21/6", group: "F", home: "Tunisien", away: "Japan" },
  { id: "G3", date: "21/6", group: "G", home: "Spanien", away: "Saudiarabien" },
  { id: "H3", date: "21/6", group: "H", home: "Belgien", away: "Iran" },
  { id: "G4", date: "22/6", group: "G", home: "Uruguay", away: "Kap Verde" },
  { id: "H4", date: "22/6", group: "H", home: "Nya Zeeland", away: "Egypten" },
  { id: "J3", date: "22/6", group: "J", home: "Argentina", away: "Österrike" },
  { id: "I3", date: "22/6", group: "I", home: "Frankrike", away: "Irak" },
  { id: "I4", date: "23/6", group: "I", home: "Norge", away: "Senegal" },
  { id: "J4", date: "23/6", group: "J", home: "Jordanien", away: "Algeriet" },
  { id: "K3", date: "23/6", group: "K", home: "Portugal", away: "Uzbekistan" },
  { id: "L3", date: "23/6", group: "L", home: "England", away: "Ghana" },
  { id: "L4", date: "24/6", group: "L", home: "Panama", away: "Kroatien" },
  { id: "K4", date: "24/6", group: "K", home: "Colombia", away: "DR Kongo" },
  { id: "B5", date: "24/6", group: "B", home: "Schweiz", away: "Kanada" },
  { id: "B6", date: "24/6", group: "B", home: "Bosnien&Her", away: "Qatar" },
  { id: "D5", date: "25/6", group: "D", home: "Marocko", away: "Haiti" },
  { id: "D6", date: "25/6", group: "D", home: "Skottland", away: "Brasilien" },
  { id: "A5", date: "25/6", group: "A", home: "Sydafrika", away: "Sydkorea" },
  { id: "A6", date: "25/6", group: "A", home: "Tjeckien", away: "Mexiko" },
  { id: "E5", date: "25/6", group: "E", home: "Curaçao", away: "Elfenbenskusten" },
  { id: "E6", date: "25/6", group: "E", home: "Ecuador", away: "Tyskland" },
  { id: "F5", date: "26/6", group: "F", home: "Tunisien", away: "Nederländerna" },
  { id: "F6", date: "26/6", group: "F", home: "Japan", away: "Sverige" },
  { id: "C5", date: "26/6", group: "C", home: "Turkiet", away: "USA" },
  { id: "C6", date: "26/6", group: "C", home: "Paraguay", away: "Australien" },
  { id: "I5", date: "26/6", group: "I", home: "Norge", away: "Frankrike" },
  { id: "I6", date: "26/6", group: "I", home: "Senegal", away: "Irak" },
  { id: "G5", date: "27/6", group: "G", home: "Kap Verde", away: "Saudiarabien" },
  { id: "G6", date: "27/6", group: "G", home: "Uruguay", away: "Spanien" },
  { id: "H5", date: "27/6", group: "H", home: "Nya Zeeland", away: "Belgien" },
  { id: "H6", date: "27/6", group: "H", home: "Egypten", away: "Iran" },
  { id: "L5", date: "27/6", group: "L", home: "Panama", away: "England" },
  { id: "L6", date: "27/6", group: "L", home: "Kroatien", away: "Ghana" },
  { id: "K5", date: "28/6", group: "K", home: "Colombia", away: "Portugal" },
  { id: "K6", date: "28/6", group: "K", home: "DR Kongo", away: "Uzbekistan" },
  { id: "J5", date: "28/6", group: "J", home: "Algeriet", away: "Österrike" },
  { id: "J6", date: "28/6", group: "J", home: "Jordanien", away: "Argentina" },
];

// Lag -> filnamn för flagga i assets/images/<slug>.png
// Lägg en bild med rätt slug så används den automatiskt som spelarikon.
const TEAM_SLUG = {
  "Mexiko": "mexico", "Sydafrika": "south-africa", "Sydkorea": "south-korea", "Tjeckien": "czechia",
  "Kanada": "canada", "Bosnien&Her": "bosnia", "Qatar": "qatar", "Schweiz": "switzerland",
  "USA": "usa", "Paraguay": "paraguay", "Australien": "australia", "Turkiet": "turkey",
  "Brasilien": "brazil", "Marocko": "morocco", "Haiti": "haiti", "Skottland": "scotland",
  "Tyskland": "germany", "Curaçao": "curacao", "Elfenbenskusten": "ivory-coast", "Ecuador": "ecuador",
  "Nederländerna": "netherlands", "Japan": "japan", "Sverige": "sweden", "Tunisien": "tunisia",
  "Spanien": "spain", "Kap Verde": "cape-verde", "Saudiarabien": "saudi-arabia", "Uruguay": "uruguay",
  "Belgien": "belgium", "Egypten": "egypt", "Iran": "iran", "Nya Zeeland": "new-zealand",
  "Frankrike": "france", "Senegal": "senegal", "Irak": "iraq", "Norge": "norway",
  "Argentina": "argentina", "Algeriet": "algeria", "Österrike": "austria", "Jordanien": "jordan",
  "Portugal": "portugal", "DR Kongo": "dr-congo", "Uzbekistan": "uzbekistan", "Colombia": "colombia",
  "England": "england", "Kroatien": "croatia", "Ghana": "ghana", "Panama": "panama",
};
