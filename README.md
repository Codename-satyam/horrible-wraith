# The Birthday Canvas

A hand-drawn, pencil-sketch birthday experience (React + Vite). Everything is drawn in SVG/CSS: no stock images, no emoji illustrations.

    npm install
    npm run dev       # develop
    npm run build     # production build in dist/
    npm test          # 11 tests: welcome, wake-up, pinboard, book, quiz branches, cake, finale
    npm run check     # validates quiz graph + memories + config

## Personalise (no component code needed)
| File | What it holds |
|---|---|
| `public/images/photo-01.jpg ...` | your photographs (missing ones show a pencil placeholder) |
| `src/data/memories.js` | ONE record per photo: caption, pinboard `quote`, book `title` / `story` / `date` / `annotation`, `rotation`, `shape`, opening-canvas placement |
| `src/data/birthday.js` | all wording, recipient name, the 5 featured ids, candle count (1-12), wish / final / closing text, finale page |
| `src/data/quiz.js` | questions, answers, branching (`next`), reactions, endings. Run `npm run check` after editing |
| `src/data/capybara.js` | everything Capy says, per event |

The five opening photos are the ids in `birthday.featuredMemoryIds`. The pinboard shows every memory; the photo book has a page for every memory.

## Structure
`components/` canvas (background, welcome, nav, finale) · flowers (MountainLily, LilyCluster, LilyBackground) · pinboard · photobook · quiz · cake · capybara (provider + hook + art) · shared. Styles are in `styles/`.

## Notes
- Reduced-motion users get an instant draw, a quick cross-fade instead of the watercolor spread, and no idle loops.
- The microphone is only requested after an explicit "Allow microphone" click, is never recorded or stored, and the button always works.
- Fonts (Reenie Beanie, Lora, Nunito Sans) load from Google Fonts with sensible fallbacks.

## Page curl and cake decorating

- **Photo book:** the page is cut into 10 strips that bend as it turns (CSS 3D, no library). Drag a page with a finger or mouse, or use the arrows / arrow keys. Tweak `SLICES` in `PageLeaf.jsx`, the bend (`-5.5deg`) and the speed (`TURN_MS`, `.95s`) in `PhotoBook.jsx` and `boards.css`. With reduced motion on, pages simply swap.
- **Decorating:** before the wish, she drags stickers from a tray onto the cake (or presses one and it finds a spot). Drag a sticker off the cake to remove it. Stickers are saved on her device. Add your own kinds in `src/lib/decor.js` (`KINDS`) and `StickerArt` in `src/components/cake/CakeDecor.jsx`.
"# horrible-wraith" 
