# Match Scores — Update Status

Last session: 2026-06-19 / 2026-06-20

## What was done

Scraped the tournament Facebook page (facebook.com/tournoidouera) using Playwright + DevTools console scripts + screenshot analysis to extract match results posted after June 10 (the last manual update date).

## Scores updated this session (8 matches)

| Match ID | Group | Round | Home | Away | Score | Source |
|----------|-------|-------|------|------|-------|--------|
| m16 | C | Journée 2 | Mustapha Brouchmo (t10) | Barça Rahmania (t12) | **6 - 3** | Facebook caption |
| m18 | C | Journée 3 | Mustapha Brouchmo (t10) | Aïn Naâdja (t11) | **3 - 0** | Facebook caption (forfeit — opponent absent) |
| m27 | E | Journée 2 | Khoukhda (t17) | Omar Pizzeria (t19) | **3 - 1** | Derived from standings table |
| m33 | F | Journée 2 | Saleh Kriar (t21) | La Plast (t23) | **4 - 3** | Facebook caption (partial, cut at "See more") |
| m39 | G | Journée 2 | AADL El Qadima (t25) | Atlético Madrid (t27) | **0 - 2** | Facebook caption |
| m51 | I | Journée 2 | El Marchi (t33) | El Bidaya (t35) | **1 - 6** | Facebook caption |
| m52 | I | Journée 2 | Zenigo (t36) | Milano (t34) | **6 - 6** | Facebook caption (draw) |
| m63 | K | Journée 2 | Turbo DZ (t41) | Madrasa El Qadima (t43) | **3 - 0** | Facebook caption |

## Still missing (need manual entry)

### Group A — Journées 2 & 3 (Jun 11, Jun 17)
- m3: Mohamed Chaouchi vs WR Performance
- m4: El Riyacha vs La Placette (Ancienne)
- m5: La Placette (Ancienne) vs WR Performance
- m6: El Riyacha vs Mohamed Chaouchi

### Group B — Journées 2 & 3 (Jun 11, Jun 17)
- m9: El Ghaouasa Essafra vs Aïn Eddezaïr
- m10: Équipe El Ikhwa vs Rosso Verdi
- m11: El Ghaouasa Essafra vs Rosso Verdi
- m12: Équipe El Ikhwa vs Aïn Eddezaïr

### Group C — Journées 2 & 3 (Jun 12, Jun 18) — partial
- m15: Coriace Baba Hassen vs Aïn Naâdja *(winner unknown)*
- m17: Coriace Baba Hassen vs Barça Rahmania *(winner unknown)*

### Group D — ⚠️ ALL JOURNÉES NEED REVIEW
- **m19 (J1): DB shows Liverpool 6-1 Hamza — BUT Facebook final standings show Liverpool with 0 pts and Hamza with 3 pts. This score is likely WRONG. Please verify.**
- m21 (J2): Liverpool Ouled Mendil vs Sassuolo — Sassuolo won (from standings), score unknown
- m22 (J2): Hamza Ouled Mendil vs Gdaouinia — Gdaouinia won (from standings), score unknown
- m23 (J3): Liverpool Ouled Mendil vs Gdaouinia — Gdaouinia won (from standings), score unknown
- m24 (J3): Hamza Ouled Mendil vs Sassuolo — Sassuolo won (from standings), score unknown

Final Group D standings from Facebook:
  - Sassuolo: 7 pts | Gdaouinia: 7 pts | Hamza: 3 pts | Liverpool: 0 pts

### Group E — Journées 2 & 3 — partial
- m28 (J2): La Nostra vs Marghna — drew (from standings), score unknown
- m29 (J3): Khoukhda vs Marghna — Khoukhda won, score unknown
- m30 (J3): La Nostra vs Omar Pizzeria — La Nostra won, score unknown

Final Group E standings from Facebook:
  - La Nostra: 7 pts | Khoukhda: 6 pts | Marghna: 4 pts | Omar Pizzeria: 0 pts

### Group F — Journées 2 & 3 — partial
- m34 (J2): El Harrach vs Fouad Soubeyrate — Fouad won, score unknown
- m35 (J3): Saleh Kriar vs Fouad Soubeyrate — Saleh Kriar won, score unknown
- m36 (J3): El Harrach vs La Plast — La Plast won, score unknown

Final Group F standings from Facebook:
  - Saleh Kriar: 6 pts | La Plast: 6 pts | Fouad Soubeyrate: 3 pts | El Harrach: 0 pts

### Group G — Journées 2 & 3
- m40 (J2): El Mahouni vs Mouhoub — score unknown
- m41 (J3): AADL El Qadima vs Mouhoub — scheduled Jun 20
- m42 (J3): El Mahouni vs Atlético Madrid — scheduled Jun 20

### Group H — Journées 2 & 3
- m45 (J2): Bouirek Snoubar vs Juventus Eddakakna — score unknown
- m46 (J2): Hamza LOTSS vs MCRB — score unknown
- m47 (J3): Bouirek Snoubar vs Hamza LOTSS — scheduled Jun 20
- m48 (J3): Juventus Eddakakna vs MCRB — scheduled Jun 20

### Group I — Journée 3
- m53 (J3): El Marchi vs Zenigo — scheduled Jun 21
- m54 (J3): El Bidaya vs Milano — scheduled Jun 21

### Group J — mostly cancelled
- Most matches already marked "cancelled" in DB due to team withdrawal dispute (Mourad Djibouti & Oussama Draria filed official protest). **Verify if any matches were actually played.**

### Group K — Journée 2 & 3 — partial
- m64 (J2): Oued Erremane vs Aston Villa — Oued Erremane won (~9-3 from standings math, **unconfirmed**)
- m65 (J3): Aston Villa vs Turbo DZ — scheduled Jun 22
- m66 (J3): Oued Erremane vs Madrasa El Qadima — scheduled Jun 22

### Group L — Journées 2 & 3
- m69 (J2): FC Street vs Haï El Madhbah — score unknown
- m70 (J2): Essarb El Azrak vs Tibi Mezoumbi — score unknown
- m71 (J3): Haï El Madhbah vs Tibi Mezoumbi — scheduled Jun 22
- m72 (J3): Essarb El Azrak vs FC Street — scheduled Jun 22

## How scores were extracted

Facebook posts the match results as **image graphics** (not plain text), so automated text extraction returns "-" for scores. The approach used:
1. Playwright browser → DevTools console JS → scroll + "See more" expansion → extract `div[dir="auto"]` text
2. Viewport screenshots (60 frames) while scrolling deep
3. ImageMagick crops at 2.5x zoom on caption areas
4. Manual reading of caption text and standings tables from screenshots

The scores in image graphics were not extractable — only text captions accompanying the photo posts were readable.

## Quickest way to finish next session

The fastest path: scroll the Facebook page, find each result post with "بنتيجة" in the caption, and type the scores here directly. Most of the remaining scores are for groups A, B, C, D, G, H, K, L.
