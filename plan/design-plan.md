# Design plan — Pictopia Photobooth

## 0. The subject's world
- **Vernacular:** binyag, debut/18th, kasal, "unli shots", soft copies, standee, magnetic, photo strip, layout, backdrop, props, "PM for rates", pavilion, resort.
- **Materials:** glossy 4x6 photo paper fresh from a dye-sub printer, magnetic print boards, standee frames, ring lights, backdrops, a box of printed props (hats, signs, glasses).
- **Setting:** resort pavilions and function halls in Tarlac and Pampanga, mostly afternoon and evening parties with a program (ceremony, cake, dinner, 18 roses, games, dancing).
- **Customer mood:** a parent or couple **organising a family celebration on a budget**. They are juggling caterer, stylist and venue, and want quick answers on price and date. Excited, a bit stretched, mostly on a phone.

## 1. Audience & primary job
The visitor is usually a mum, couple or debutante's family on a phone, comparing booth suppliers they found on Facebook. Their job is to **confirm their date is free and know the exact price**, then lock it in without messaging back and forth. The primary action on every page is **"Check my date"**, which opens the booking flow pre-filled with the date entered. The secondary action is **Call 0916 565 7183**.

## 2. Colour tokens (from the logo)
| Token | Hex | Role | Contrast |
|---|---|---|---|
| `espresso` | `#2E1B0E` | Text, the logo's outline colour, sticker borders | 16.9:1 on white; 13.6:1 on `booth-yellow` |
| `booth-yellow` | `#FFC72C` | Hero field, selected state, key highlights (never text on white) | — |
| `flash-orange` | `#F07C1B` | Fills and illustration only | 2.7:1, decorative only |
| `ember` | `#B4500A` | Orange-family text and links on white | 5.1:1 on white ✔ |
| `butter` | `#FFF1BF` | Alternate section ground, summary panels | espresso on butter 15.2:1 |
| `paper` | `#FFFFFF` | Base ground, print cards | — |

Deliberately avoided: a cream page with serif type, and dark mode with a single accent. The ground is white paper with **bands of booth yellow**, the way their logo sits on a sticker.

## 3. Type
- **Display: Fredoka (600/700)**, a rounded heavy face that echoes the "PICTOPIA" wordmark without copying it. Used for H1–H3, prices and step numbers. Sentence case only.
- **Body: Figtree (400/600)**, friendly and highly legible on small Android screens.
- Scale (mobile → desktop): H1 36→60, H2 28→40, H3 20→24, body 17, small 14. Body measure ≤ 68ch. Prices are set large in Fredoka with tabular figures.
- Spelling: Philippine English (US spelling: "color", "customize"). Filipino event words are used where customers use them (binyag, debut), always with English alongside.

## 4. Layout concept
The site is built from **prints**. Section content sits on white "photo paper" cards with an espresso outline and a hard offset shadow (sticker/print style, not a soft grey blur). This sticker treatment is used **only** on print previews and the primary CTA. Everything else is flat, so the prints stay special.

### Home — mobile (375)
```
┌─────────────────────────────┐
│ [logo]          [☰]  [Call] │
├─────────────────────────────┤ booth-yellow band
│  Unli photobooth for your   │
│  party in Tarlac & Pampanga │  H1
│  From ₱3,500 · 2 hrs unli   │
│  shots · we pause when your │
│  program starts             │
│  ┌──────────────┐┌────────┐ │
│  │ Event date ▾ ││Check ▸ │ │  date field + CTA
│  └──────────────┘└────────┘ │
│     [ illustrated booth +   │
│       strip popping out ]   │  SVG mascot camera prints a strip
├─────────────────────────────┤
│ Pick your print             │  3 tier cards, horizontal scroll
│ [1-shot ₱6,000][2-shot …]   │  each = drawn print preview
├─────────────────────────────┤
│ Booth hours, your way       │  SIGNATURE: timeline
│ |▓▓▓▓ON▓▓▓|░pause░|▓ON▓▓|   │
│ 4:00  5:00   6:00  7:00 8:00│
├─────────────────────────────┤
│ Every package includes  ✔×7 │
│ Events we cover (5 chips)   │
│ Recent events → Facebook    │
│ Where we go: Tarlac/Pampanga│
│ FAQ (4) · Contact strip     │
├─────────────────────────────┤
│ [ Check my date ]  sticky   │
└─────────────────────────────┘
```

### Home — desktop (1440, 12-col, 1200 max)
```
┌────────────────────────────────────────────────────────────┐
│ logo   Packages  Pause time  FAQ  Contact   0916…  [Check] │
├──────────────────────────────┬─────────────────────────────┤
│ H1 (cols 1–6)                │  mascot booth SVG printing a │
│ subline, ₱3,500, date+CTA    │  photo strip (cols 7–12)     │
├──────────────────────────────┴─────────────────────────────┤
│  Pick your print: 3 print cards in a row, centred          │
├────────────────────────────────────────────────────────────┤
│  Timeline full-width, presets as tabs: Wedding|Debut|Binyag│
├───────────────┬────────────────────────────────────────────┤
│ Includes list │ Events we cover / recent events            │
└───────────────┴────────────────────────────────────────────┘
```
Alignment: headings and body are left-aligned on a shared left edge. Only the print cards are centred, because they are objects on a table.

### Booking flow
```
mobile                               desktop
┌───────────────────────┐   ┌───────────────────────────┬──────────────┐
│ Step 2 of 5 ━━━░░░    │   │ ① Event ② Print ③ Hours   │ Your booking │
│ Pick your print       │   │ ④ Details ⑤ Review        │ Sept 26 Sat  │
│ ( ) 1-shot  ₱6,000    │   │                           │ 3-shot 4x6   │
│ (•) 3/4-shot ₱3,500   │   │  step content             │ Magnetic +1k │
│ Booth: Mirror/Trad.   │   │                           │ Extra hr +1k │
│ Display: Standee/Mag. │   │                           │ ──────────── │
│                       │   │                           │ ₱5,500       │
├───────────────────────┤   │ [Back]          [Next ▸]  │ + travel fee │
│ ₱3,500 ▴ details      │   └───────────────────────────┴──────────────┘
│ [Back]   [Next: Hours]│
└───────────────────────┘
```
Steps:
1. **Event** — type, date (calendar), start time, venue + town/province.
2. **Print & setup** — layout tier (1-shot incl. Polaroid / 2-shot / 3–4-shot incl. photo strip), orientation, display (standee included or magnetic +₱1,000), backdrop (sequin or plain; blue, pink, gray, white). Traditional booth only (A1.12). Props are picked by Pictopia to suit the event (A1.14).
3. **Hours** — the planner.
4. **Details** — name, mobile, optional email, Facebook name, notes.
5. **Review** → "Send booking request" → confirmation shows "Booking request sent".

## 5. Signature element — the booth-hours planner
A horizontal 4-hour track from the event start time. The customer places **two operating hours** as yellow "ON" blocks with a 1–2 hour **pause** between them (hatched), and labels the pause with their program ("Program & dinner", "18 roses", "Mass"). Presets fill it in per event type. Adding an extra operating hour extends the track and adds ₱1,000 to the live total.

**Why it fits:** pause time is the one thing the owners say competitors don't offer (A1.6), and right now it's invisible. The planner makes it something customers can try for themselves, and it matches how Filipino parties actually run, with the program in the middle.

The one orchestrated motion moment: on first load, the hero mascot "prints" a photo strip (slides out of the slot once, about 900 ms). It is disabled under `prefers-reduced-motion`. All other motion is user-triggered (block dragging, layout selection).

## 6. Self-review — "would I make this for any photobooth?"
- **Palette:** taken directly from their logo. ✔ Specific.
- **Hero "unli shots + price":** generic for the category at first. **Revised:** the subline now leads with the pause benefit ("we pause when your program starts"), and the hero CTA is a date field, because date is the real first question.
- **Print-preview cards:** any booth could use them. **Revised:** they are tied to their *actual* pricing logic (fewer shots per print = bigger photos = higher price, A1.3), with the price on the print itself, so they explain the pricing that is unusual to them.
- **Gallery:** a generic booth site would lead with a photo gallery. **Revised:** they have no cleared photos and lots of dated albums, so it's a dated **Recent events** list linking to the albums. This is honest, specific and shows how busy they are.
- **Events we cover:** revised from generic "weddings/birthdays/corporate" to their actual mix: binyag + 1st birthday combos, debuts, weddings, church and corporate anniversaries.
- **Removed accessory:** a confetti background pattern behind the hero. The splash marks from the logo are enough.
