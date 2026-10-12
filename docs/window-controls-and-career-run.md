# Window Controls & Career Run

How the macOS-style window dots and the Career Run game on the "See you around." screen work, and where to change things.

| Feature | Files |
|---|---|
| Window state (shared) | `src/context/WindowContext.js` |
| Title bar with the three dots | `src/components/WindowBar.jsx` |
| Dock | `src/components/Dock.jsx` |
| "See you around." screen | `src/components/ClosedScreen.jsx` |
| Styles and animations | `src/styles/window.css` |
| Career Run game | `src/components/CareerRunner.jsx` (self-contained) |
| Wiring | `src/App.js`, `src/components/Aboutme.jsx`, `src/pages/Resume.jsx` |

---

## Part 1: Window controls (the red, yellow and green dots)

### What the user sees

| Action | Result |
|---|---|
| 🔴 Close | The window shrinks and fades. A "See you around." screen with the Career Run game takes its place, and a dock slides up from the bottom. |
| 🟡 Minimize | The window squashes and shrinks into the dock (a light "genie" effect). Your avatar sits in the dock with a "running" dot and bounces once. Click it to bring the window back. |
| 🟢 Fullscreen | The sidebar slides away, the window fills the screen, and the browser goes truly fullscreen where it's allowed. Click green again or press Esc to exit. |
| Double-click the title bar | Toggles fullscreen, like on a Mac. |
| Hover the dots | The ×, − and ⤢ symbols appear inside them. |
| Click any sidebar link | Brings the window back from any state. |

On screens 768px wide or less, the window bar is hidden, so none of this appears on phones.

### How it's built

All of the state lives in one React context, `WindowProvider`, which wraps the app inside the router (`App.js`). Any component can call `useWindow()` to get:

```js
{ state, close, minimize, restore, toggleFullscreen, panelProps }
```

`state` is one of:

```
open ──close──────▶ closing ──────▶ closed ────restore──▶ restoring ──▶ open
open ──minimize───▶ minimizing ───▶ minimized ─restore──▶ restoring ──▶ open
open ◀──toggleFullscreen──▶ fullscreen
```

The states ending in `-ing` are animations in progress. Each one plays a CSS animation on the window panel. When it ends, the panel's `onAnimationEnd` moves to the next state:

| Animation ends in | Next state |
|---|---|
| `minimizing` | `minimized` |
| `closing` | `closed` |
| `restoring` | `open` |

Because state only advances on `animationend`, timing lives entirely in CSS. Change an animation's duration in `window.css` and the JavaScript follows automatically.

### The panel

The window panel is `.main-about-me` on the home page and `.resume-container` on `/resume`. Each one spreads `panelProps` onto itself:

```jsx
const { panelProps: { windowClass, ref: panelRef, onAnimationEnd } } = useWindow();
<div className={`main-about-me ${windowClass}`} ref={panelRef} onAnimationEnd={onAnimationEnd}>
```

`windowClass` is `window-panel window-<state>`, for example `window-minimizing`. `window.css` attaches the behavior to those classes:

| Class | What it does |
|---|---|
| `.window-minimizing` | `genie-out` animation: squash to 75%×45%, then shrink to almost nothing |
| `.window-closing` | `window-close`: scale to 0.9 and fade out |
| `.window-restoring` | `genie-in`, the reverse of minimize |
| `.window-minimized`, `.window-closed` | `display: none`, so the empty page doesn't keep its scroll height |

**Aiming the shrink.** Before minimizing or closing, `aimPanelAt()` scrolls to the top. It then sets the panel's `transform-origin` to a point in the viewport: the dock's position for minimize, the screen center for close. That's why the window shrinks toward the dock instead of toward its own center.

### Fullscreen

The app wrapper gets a `shell-<state>` class (`App.js`). In fullscreen, `.shell-fullscreen .main-sidebar` collapses the sidebar to zero width and fades it out, and the panel takes the freed space.

`toggleFullscreen` also calls the browser's real Fullscreen API (`document.documentElement.requestFullscreen()`) where it's supported. iOS Safari doesn't support it, so there only the layout change happens.

Two listeners keep the browser and the layout in sync:
- `fullscreenchange`: if the browser leaves fullscreen (Esc, F11, etc.), the window returns to `open`.
- `keydown` for Escape: covers browsers without the Fullscreen API.

### Dock and closed screen

- **`Dock.jsx`** is always rendered. It slides up with `.dock-visible` while the state is `minimizing`, `minimized`, `closing` or `closed`.
  - The first item is the "app" (your avatar). Clicking it calls `restore()`, and it shows a running dot while minimized.
  - The other items are plain links: GitHub, LinkedIn, Email and the Resume PDF download.
  - Hover labels come from each item's `data-label` attribute through CSS `::after`.
- **`ClosedScreen.jsx`** renders only when `state === 'closed'` (see `App.js`). It shows the "See you around." text, the **Reopen** and **Say hello** buttons, and `<CareerRunner />`.

### Navigation resets the window

`WindowProvider` watches `location.key` from React Router. Any navigation, such as clicking a sidebar link, plays `restoring` if the window was closed or minimized, and exits fullscreen if it was fullscreen.

### Accessibility

- The dots are real `<button>`s with `aria-label`s. The fullscreen button also has `aria-pressed`.
- The dock items can't be reached with Tab while the dock is hidden.
- With `prefers-reduced-motion`, animations shorten to 0.01s instead of being removed. They can't be removed, because state only advances on `animationend`.

### Common tweaks

| Want to... | Change |
|---|---|
| Speed up or slow down minimize | `.window-minimizing` / `@keyframes genie-out` in `window.css` |
| Move the dock | `.dock { bottom }` in `window.css`, plus `DOCK_OFFSET` in `WindowContext.js` so the shrink still aims at it |
| Add a dock shortcut | Add an entry to the `shortcuts` array in `Dock.jsx` |
| Change the closed-screen text | `ClosedScreen.jsx` |
| Add window controls to another page | Render `<WindowBar url="..." />` and spread `panelProps` onto that page's panel |

---

## Part 2: Career Run (the game)

An endless runner like Chrome's offline dinosaur game. Your pixel character runs through four career phases. It's vanilla JavaScript drawing on a single `<canvas>`: no libraries and no image or audio files. It's about 5 KB gzipped.

### How to play

| Input | Action |
|---|---|
| Space or ↑ | Start, jump, restart |
| ↓ (hold) | Duck. Holding ↓ in mid-air makes you fall faster. |
| Tap (phone) | Start, jump, restart |
| Swipe down (phone) | Duck |

The game starts on an idle screen and never autoplays. After a game over, restart is blocked for 400ms so a jump you were already pressing doesn't restart it instantly.

### Phases and pacing

Score goes up by a steady **18 points per second**, so each 400-point phase lasts about **22 seconds**.

| Phase | Starts at | Base speed | Accent | Outfit | Obstacles (ground / flying) |
|---|---|---|---|---|---|
| School | 0 | 300 | amber `#e8a33d` | backpack | books, backpack, test with a red F / paper airplane |
| Tranquility Spa | 400 | 360 | teal `#2bb5a0` | backpack + coffee | towel stack, massage table, oil bottle / steam puff |
| American Fidelity | 800 | 420 | red `#e5484d` | shirt + tie + coffee | filing cabinet, paper pile, coffee mug / claim form |
| Paul Logistic | 1200 | 480 | blue `#4d8dff` | hoodie + laptop + coffee | taped box, pallet, forklift / drone, bug |

- **Speed within a phase:** Each phase starts at its base speed and ramps up slightly (`+0.1` per point). Paul Logistic is endless and keeps ramping up to +220, so it tops out around 700.
- **Gaps:** Each phase has a `gap` range in seconds between obstacles, and the range gets tighter phase by phase. It's measured in time rather than pixels, so gaps stay fair as the speed rises.
- **Flying obstacles:** The chance of one (`fly`) goes up each phase. None appear in the first 60 points.
- **Phase change:** A `LEVEL UP: <PHASE>` banner shows for 1.2s, and the character's outfit changes.

All of these values are in the `PHASES` array at the top of `CareerRunner.jsx`.

### Code layout

```
CareerRunner.jsx
├── constants: canvas size, PHASES, COLORS
├── OBSTACLES: pixel-string sprites for each phase
├── POSES + charRows(): builds the 32×32 character for each pose and outfit
├── startGame(canvas): all game logic; returns a cleanup function
│   ├── render() / buildSprites(): pixel strings → cached offscreen canvases
│   ├── state (s), obstacle pool, start / jump / gameOver / spawn
│   ├── update(dt): physics, scoring, phases, spawning, collisions
│   ├── draw(): ground, obstacles, player, HUD, overlays
│   ├── loop: requestAnimationFrame, with pause and resume
│   ├── input: keyboard + pointer (touch)
│   └── sizing + visibility: ResizeObserver, IntersectionObserver, visibilitychange
└── <CareerRunner />: a canvas + useEffect(() => startGame(canvas), [])
```

The React component is only a shell. `useEffect` calls `startGame`, and the function `startGame` returns is React's cleanup, so unmounting (clicking **Reopen**) stops the loop and removes every listener and observer.

### Coordinates

The game works in a fixed **600 × 200 logical space**. The ground is at `y = 184`, and the player stands at `x = 40`. On resize, the canvas's backing store is set to `CSS width × devicePixelRatio` (capped at 2), and everything is drawn through one `setTransform(scale)`. That lets the game scale to any container width while all the gameplay numbers stay the same.

### Sprites

Every sprite is a grid of characters:

| Character | Color |
|---|---|
| `.` | transparent |
| `o` | outline: the page's text color, so it adapts to light and dark themes |
| `a` | the current phase's accent color |
| `w` `g` `d` `b` `r` `s` `e` `k` | white, gray, dark, wood/cardboard, red, skin, eye, shoe (see `COLORS`) |
| UPPERCASE (e.g. `G`, `O`) | same color as lowercase, but gets **no** automatic outline (used for steam wisps, propeller blur, straps) |

`render(rows, accent)` turns a grid into an image:

1. Pads the grid by 1 pixel.
2. **Adds the outline automatically:** any empty pixel next to a lowercase fill becomes `o`. This is why the arrays only describe fills and still get clean outlines.
3. Draws each horizontal run of the same color to a small offscreen `<canvas>` with one `fillRect`.
4. Records the sprite's opaque bounds (`x1`, `x2`, `y1`, `y2`), which are used for ground alignment and hitboxes.

`buildSprites()` builds everything once: 4 outfits × 6 character poses, plus every obstacle frame. It only runs again if the page's text color changes, for example on a theme switch. During play, every sprite is a single `drawImage` call, with `imageSmoothingEnabled = false` for crisp pixels at 2× scale.

### The character

`charRows(pose, outfit)` builds a 32×32 grid from simple parts instead of hand-drawing all 24 combinations:

- `head(x, y)`: spiky hair, face, brow, eye, nose, mouth
- `leg(...)` and `arm(...)`: 2-pixel-thick segments from hip to knee to foot, and from shoulder to hand
- `rect` / `put`: torso, pants, backpack, tie, hood, laptop, coffee cup

`POSES` holds hip, knee, foot and hand positions for the 4 run frames and the jump pose. Ducking is a separate crouched layout. The outfit flags (`pack`, `coffee`, `tie`, `hoodie`, `laptop`) decide which extras get drawn, in order from back to front. The run cycle advances at 12 frames per second.

### Physics

- **Jump:** Sets upward speed to `690`, with gravity of `2200` (`5200` while holding ↓, for a fast fall). That's about 0.63s in the air and a peak of about 108 logical pixels.
- **Duck:** Uses the crouched sprite, about 42px tall instead of about 64px.
- **Flying obstacles:** Their bottom edge sits `AIR_GAP = 46` above the ground. That's higher than the ducking player (so you can duck under) but low enough to hit a standing player. With good timing you can also jump over them, which keeps phones playable without ducking.
- **Frame time:** `dt` is capped at 50ms, so a hitch or a long frame can't push you through an obstacle.

### Obstacles and collisions

- **Object pool:** There's a fixed pool of 6 obstacle objects (`{ on, x, p, i }`). Spawning reuses an inactive slot, and nothing is allocated per frame.
- **Spawning:** `nextIn` counts down the distance to the next spawn. When it reaches 0, the game picks a random ground or flying type from the current phase and sets a new random gap.
- **Collisions:** Simple box overlap using each sprite's opaque bounds, shrunk a few pixels so near misses feel fair. Any hit calls `gameOver()`, which saves the best score, triggers a 0.25s screen shake (skipped with reduced motion), and shows "Made it to: <phase>".

### Performance

- The `requestAnimationFrame` loop **only runs while playing**, or during the short game-over shake. The idle and game-over screens are drawn once, and then the loop stops.
- It **pauses when the tab is hidden** (`visibilitychange`) and **when the canvas scrolls off screen** (`IntersectionObserver`, 20% visible). On resume, `last` resets so the first frame doesn't get a huge `dt`.
- Sprites are cached as images, the obstacle pool is reused, and the ground pebbles are computed with modulo arithmetic instead of being stored objects.

### Keyboard conflict with the Reopen button

The **Reopen** button is autofocused, so Space would normally activate it, because buttons fire on Space key-up. While the game is visible, the key listeners are registered in the capture phase and call `preventDefault()` on Space, ↑ and ↓ for both `keydown` and `keyup`. That stops the page from scrolling and keeps Space from activating the button. **Enter** still activates focused buttons. Keys typed into inputs and textareas are ignored.

### Theme, reduced motion and storage

- **Theme:** The canvas has CSS `color: var(--text)`. The game reads that computed color as the outline and text color, so it follows the site's theme. It also re-checks when the OS color scheme changes.
- **Reduced motion:** With `prefers-reduced-motion: reduce`, the game runs at 75% speed with no screen shake. This is read at the start of each run.
- **High score:** Stored in `localStorage` under the key `careerRunnerBest`. Every read and write is wrapped in try/catch, so the game still works in private windows or when storage is blocked; the best score just isn't saved.

### Common tweaks

| Want to... | Change |
|---|---|
| Make phases longer or shorter | `POINTS_PER_SEC`, or the `at` values in `PHASES` |
| Make it easier or harder | `speed`, `gap` and `fly` in `PHASES`; the ramp in `update()` |
| Change jump feel | `s.vy = 690` in `jump()` and the `2200` / `5200` gravity in `update()` |
| Add an obstacle | Add `[isFlyer, rows]` to that phase's list in `OBSTACLES`. Draw only fills; the outline is automatic. Add extra row arrays for animation frames, like the drone. |
| Change an outfit | The `outfit` flags in `PHASES`, and the matching drawing code in `charRows()` |
| Add a phase | Add an entry to `PHASES` and a matching obstacle list in `OBSTACLES` |
| Reset your high score | In the browser console: `localStorage.removeItem('careerRunnerBest')` |

### Testing tips

- **Preview sprites:** Temporarily expose `CHARS` and `KINDS` from `startGame` on `window`, then draw them large on a second canvas. That's how the sprites were checked during development.
- **Test later phases:** Temporarily lower the `at` thresholds, or skip `gameOver()`, to reach Paul Logistic quickly. Don't commit either change.
