// src/components/CareerRunner.jsx
// Tiny endless runner (à la Chrome's offline dino) through Quang's career.
// Vanilla canvas, no assets: sprites are pixel strings, rendered once to offscreen
// canvases at startup, then blitted with drawImage every frame.
import { useEffect, useRef } from 'react';

const LW = 600, LH = 200, GROUND = 184, S = 2, PLAYER_X = 40, AIR_GAP = 46;
const BEST_KEY = 'careerRunnerBest';
const POINTS_PER_SEC = 18; // ~22s per 400-point phase

// Each phase: faster base speed, tighter gaps, more flyers. Outfit changes with it.
const PHASES = [
    { name: 'School', at: 0, accent: '#e8a33d', speed: 300, gap: [1.0, 1.8], fly: 0.18, outfit: { pack: 1 } },
    { name: 'Tranquility Spa', at: 400, accent: '#2bb5a0', speed: 360, gap: [0.92, 1.65], fly: 0.24, outfit: { pack: 1, coffee: 1 } },
    { name: 'American Fidelity', at: 800, accent: '#e5484d', speed: 420, gap: [0.85, 1.5], fly: 0.3, outfit: { tie: 1, coffee: 1 } },
    { name: 'Paul Logistic', at: 1200, accent: '#4d8dff', speed: 480, gap: [0.78, 1.35], fly: 0.34, outfit: { hoodie: 1, laptop: 1, coffee: 1 } },
];

// Palette. 'o' = outline (page text color), 'a' = phase accent.
// Lowercase fills get an automatic 1px outline; UPPERCASE = same color, no outline.
const COLORS = { w: '#ececef', g: '#8e8e96', d: '#45454d', b: '#b8895a', r: '#e5484d', s: '#e8b991', e: '#1b1b1f', k: '#2b2b31' };

// ---------- Obstacles: [isFlyer, frame rows...] ----------
const DRAWER = ['gggggggggggg', 'ggggwwwwgggg', 'gggggggggggg', 'gggddddddggg', 'gggggggggggg'];
const OBSTACLES = [
    [ // School
        [0, ['...aaaaaaaaaaa..', '...aawwwwwaaaa..', '...aaaaaaaaaaa..', '.oooooooooooooo.', '.ggggggggggggg..', '.gggggwwwwwggg..', '.ggggggggggggg..', '.oooooooooooooo.', '..ddddddddddddd.', '..dddwwwwwddddd.', '..ddddddddddddd.']], // books
        [0, ['....OOOO....', '...O....O...', '..aaaaaaaa..', '.aaaaaaaaaa.', '.aaaaaaaaaa.', '.aaOOOOOOaa.', '.aaaaaaaaaa.', '.aawwwwwwaa.', '.aawwOOwwaa.', '.aawwwwwwaa.', '.aaaaaaaaaa.', '.aaaaaaaaaa.', '..aaaaaaaa..']], // backpack
        [0, ['wwwwwwwwwwww', 'wwwwwwwwwwww', 'wwrrrrrrwwww', 'wwrrwwwwwwww', 'wwrrrrrwwwww', 'wwrrwwwwwwww', 'wwrrwwwwwwww', 'wwwwwwwwwwww', 'wwGGGGGGGGww', 'wwwwwwwwwwww', 'wwGGGGGGGGww', 'wwwwwwwwwwww', 'wwGGGGGwwwww', 'wwwwwwwwwwww']], // test with a red F
        [1, ['.............ww', '..........wwwww', '.......wwwwwwgw', '....wwwwwwwgggw', '.wwwwwwwwwwwwww', '....gggggggggg.', '.........gggg..']], // paper airplane
    ],
    [ // Tranquility Spa
        [0, ['.wwwwwwwwwwwww.', 'wwwwwwwwwwwwwww', 'wwaaaaaaaaaaaaw', 'wwwwwwwwwwwwww.', 'ooooooooooooooo', 'aaaaaaaaaaaaaa.', 'aawwwwwwwwwwwwa', 'aaaaaaaaaaaaaa.', 'ooooooooooooooo', '.wwwwwwwwwwwww.', 'wwwwwwwwwwwwwww', 'wwaaaaaaaaaaaaw', 'wwwwwwwwwwwwww.']], // folded towels
        [0, ['aaaaaaaaaaaaaaaaaaaa....', 'aaaaaaaaaaaaaaaaaaaa....', 'aaaaaaaaaaaaaaaaaaaaaOOa', 'wwwwwwwwwwwwwwwwwwwwaaaa', '.gg..............gg.....', '.gg..............gg.....', '.gggg..........gggg.....', '.gg..gggggggggg..gg.....', '.gg..............gg.....', '.gg..............gg.....', '.gg..............gg.....']], // massage table
        [0, ['....dd....', '....dd....', '...wwww...', '..wwwwww..', '.aaaaaaaa.', '.awwwwwwa.', '.awwwawwa.', '.awwaaawa.', '.awwaaawa.', '.awwwwwwa.', '.aaaaaaaa.', '.aaaaaaaa.', '..aaaaaa..']], // oil bottle with a drop
        [1, ['...G....G....G..', '..G....G....G...', '...G....G....G..', '....ww...ww.....', '..wwwwwwwwwww...', '.wwwwwwwwwwwwww.', 'wwwwwwwwwwwwwwww', 'wwwwwwwwwwwwwwww', '.wwwggwwwwwggww.', '..wwwwwwwwwwww..']], // steam puff
    ],
    [ // American Fidelity
        [0, [...DRAWER, 'oooooooooooo', ...DRAWER, 'oooooooooooo', ...DRAWER, 'dddddddddddd']], // filing cabinet
        [0, ['...wwwwwwwwwwaa.', '...wwwwwwwwwwaa.', '..oooooooooooo..', '.wwwwwwwwwwww...', '.oooooooooooo...', '...wwwwwwwwwwww.', '...oooooooooooo.', '..wwwwwwwwwwww..', '..oooooooooooo..', '.wwwwwwwwwwwww..', '.ooooooooooooo..', '...wwwwwwwwwwww.']], // paper pile
        [0, ['...G...G....', '..G...G.....', '...G...G....', '............', 'wwwwwwwww...', 'wwwwwwwwwoo.', 'wwwwwwwww..o', 'waaaaaaaw..o', 'waaaaaaaw..o', 'wwwwwwwwwoo.', 'wwwwwwwww...', '.wwwwwww....']], // coffee mug
        [1, ['wwwwwwwwwwwwww', 'wGGGGGwwwwwwww', 'wwwwwwwwwwwwww', 'wGGGGGGGGGGGGw', 'wwwwwwwwwwwwww', 'wGGGGGGGGGGwww', 'wwwwwwwwwwwwww', 'wGGGGGGGwwaaww', 'wwwwwwwwwaaaaw', 'wwwwwwwwwwaaww']], // claim form
    ],
    [ // Paul Logistic
        [0, ['bbbbbbbwwbbbbbbb', 'bbbbbbbwwbbbbbbb', 'oooooooooooooooo', 'bbbbbbbwwbbbbbbb', 'bwwwwwbwwbbbbbbb', 'bwwdwwbwwbbbbbbb', 'bwdddwbwwbbbbbbb', 'bdddddbwwbbbbbbb', 'bwwdwwbwwbbbbbbb', 'bwwdwwbwwbbbbbbb', 'bwwwwwbwwbbbbbbb', 'bbbbbbbwwbbbbbbb', 'bbbbbbbwwbbbbbbb']], // taped box
        [0, ['bbbbbObbbbbObbbbbObbbbbb', 'bbDbbbbbbbbDbbbbbbbbbDbb', 'bbb........bb........bbb', 'bbb........bb........bbb', 'bbbbbbbbbbbbbbbbbbbbbbbb']], // wooden pallet
        [0, ['.....gg..ddddddddddddd....', '.....gg...d.........d.....', '.....gg...d.........d.....', '.....gg...d.........d.....', '.....gg...dd........d.....', '.....gg...d.d..kkk..d.aaaa', '.....gg...d.d..kkk..daaaaa', '.....gg...d....kkk..daaaaa', '.....gg.aaaaaaaaaaaaaaaaaa', '.....gg.aaaaaaaaaaaaaaaaaa', '.....gg.aawwwwwwwwwwwwaaaa', '.....gg.aaaaaaaaaaaaaaaaaa', 'ggggggg..kkkkk....kkkkk...', 'ggggggg..kkgkk....kkgkk...', '.........kkkkk....kkkkk...']], // forklift
        [1, ['GGGGGGG......GGGGGGG', '...dd..........dd...', '...dddddddddddddd...', '.......gggggg.......', '......ggggaagg......', '.......gggggg.......', '........d..d........', '.......dd..dd.......'],
            ['..GGGGG......GGGGG..', '...dd..........dd...', '...dddddddddddddd...', '.......gggggg.......', '......ggggaagg......', '.......gggggg.......', '........d..d........', '.......dd..dd.......']], // drone, 2 rotor frames
        [1, ['..O...O.........', '...O.O..........', '..dddd.aaaaaa...', '.ddedddaaaaaaaa.', '.ddddaaaOaaaOaaa', '.ddddaaaaaaaaaa.', '..dddaaaOaaaaa..', '....O.O..O.O.O..', '...O..O..O..O.O.']], // bug
    ],
];

// ---------- Character: composed on a 32×32 grid ----------
// Legs: [hipX, hipY, kneeX, kneeY, footX, footY]; hands: [x, y]
const POSES = [
    { back: [15, 22, 13, 26, 10, 28], front: [18, 22, 20, 25, 22, 29], handB: [21, 18], handF: [12, 19] }, // run 1
    { back: [15, 22, 17, 25, 15, 27], front: [18, 22, 18, 26, 18, 29], handB: [17, 20], handF: [16, 20] }, // run 2
    { back: [15, 22, 20, 25, 22, 29], front: [18, 22, 14, 26, 11, 28], handB: [12, 19], handF: [21, 18] }, // run 3
    { back: [15, 22, 18, 26, 17, 29], front: [18, 22, 19, 25, 16, 27], handB: [16, 20], handF: [17, 20] }, // run 4
    { back: [15, 22, 15, 25, 12, 27], front: [18, 22, 21, 24, 19, 27], handB: [11, 12], handF: [22, 11] }, // jump
];

function charRows(poseIdx, o) {
    const g = Array.from({ length: 32 }, () => Array(32).fill('.'));
    const put = (x, y, ch) => { if (x >= 0 && x < 32 && y >= 0 && y < 32) g[y][x] = ch; };
    const rect = (x, y, w, h, ch) => { for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) put(x + i, y + j, ch); };
    const seg = (x0, y0, x1, y1, ch) => { // 2px-thick line
        const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)) || 1;
        for (let i = 0; i <= n; i++) {
            const x = Math.round(x0 + (x1 - x0) * i / n), y = Math.round(y0 + (y1 - y0) * i / n);
            put(x, y, ch); put(x + 1, y, ch);
        }
    };
    const leg = (l) => { seg(l[0], l[1], l[2], l[3], 'd'); seg(l[2], l[3], l[4], l[5], 'd'); rect(l[4] - 1, l[5], 4, 2, 'k'); };
    const arm = (sx, sy, h, ch) => { seg(sx, sy, h[0], h[1], ch); rect(h[0], h[1], 2, 2, 's'); };
    const head = (x, y) => {
        rect(x, y, 10, 3, 'd'); put(x + 1, y - 1, 'd'); put(x + 4, y - 1, 'd'); put(x + 7, y - 1, 'd'); // spiky hair
        rect(x, y + 3, 2, 4, 'd');
        rect(x + 2, y + 3, 8, 7, 's'); rect(x, y + 7, 2, 3, 's'); put(x + 10, y + 6, 's'); // face, jaw, nose
        put(x + 7, y + 4, 'd'); put(x + 8, y + 4, 'd'); // brow
        put(x + 7, y + 5, 'e'); put(x + 7, y + 6, 'e'); // eye
        put(x + 8, y + 8, 'e'); // mouth
    };
    const shirt = o.hoodie ? 'a' : 'w';
    const cup = (x, y) => { rect(x, y + 1, 3, 4, 'w'); rect(x, y, 3, 1, 'g'); put(x + 1, y + 3, 'a'); };

    if (poseIdx === 5) { // duck: leaning forward, low
        leg([9, 24, 7, 27, 5, 29]);
        if (o.pack) rect(11, 15, 7, 4, 'a');
        if (o.hoodie) rect(15, 16, 3, 3, 'a');
        rect(10, 19, 10, 5, shirt);
        if (o.tie) { put(18, 23, 'a'); put(19, 23, 'a'); }
        rect(8, 22, 4, 3, 'd');
        leg([11, 24, 14, 27, 15, 29]);
        head(17, 12);
        if (o.laptop) rect(4, 21, 7, 2, 'g');
        if (o.coffee) { arm(18, 20, [23, 25], shirt); cup(23, 20); } else arm(18, 20, [23, 25], shirt);
    } else {
        const P = POSES[poseIdx];
        if (!o.laptop) arm(14, 14, P.handB, shirt);
        leg(P.back);
        if (o.pack) { rect(9, 13, 4, 8, 'a'); put(10, 15, 'O'); put(11, 15, 'O'); }
        if (o.hoodie) rect(12, 11, 3, 3, 'a'); // hood
        rect(13, 13, 8, 8, shirt);
        rect(13, 21, 8, 2, 'd'); // pants
        rect(16, 12, 2, 1, 's'); // neck
        if (o.pack) { put(16, 13, 'O'); put(16, 14, 'O'); put(15, 15, 'O'); put(15, 16, 'O'); } // strap
        if (o.tie) { rect(15, 13, 3, 1, 'a'); rect(15, 14, 2, 5, 'a'); put(16, 19, 'a'); }
        if (o.hoodie) { put(18, 14, 'W'); put(18, 15, 'W'); rect(15, 18, 5, 1, 'O'); } // drawstring, pocket
        leg(P.front);
        head(12, 2);
        if (o.laptop) { arm(15, 14, [11, 15], shirt); rect(8, 16, 8, 7, 'g'); put(11, 19, 'W'); put(12, 19, 'W'); } // laptop held at the side
        if (o.coffee) { seg(18, 14, 19, 18, shirt); seg(19, 18, 22, 17, shirt); rect(22, 17, 2, 2, 's'); cup(22, 12); }
        else arm(18, 14, P.handF, shirt);
    }
    return g.map(r => r.join(''));
}

function startGame(canvas) {
    const c = canvas.getContext('2d');
    const reducedMq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    let ink = '', scale = 1;
    let CHARS = [], KINDS = [];

    // Render pixel rows to an offscreen canvas, adding an auto outline. Returns
    // the image plus the opaque bounds (in logical px) for alignment and hitboxes.
    const render = (rows, acc) => {
        const w = Math.max(...rows.map(r => r.length)) + 2, h = rows.length + 2;
        const g = Array.from({ length: h }, (_, y) => Array.from({ length: w }, (_, x) => (rows[y - 1] && rows[y - 1][x - 1]) || '.'));
        const src = (ch) => ch && ch >= 'a' && ch <= 'z' && ch !== 'o';
        const out = g.map((row, y) => row.map((ch, x) => (ch === '.' && (src(g[y - 1]?.[x]) || src(g[y + 1]?.[x]) || src(row[x - 1]) || src(row[x + 1])) ? 'o' : ch)));
        const cv = document.createElement('canvas');
        cv.width = w; cv.height = h;
        const x2d = cv.getContext('2d');
        let x1 = w, y1 = h, xm = 0, ym = 0;
        out.forEach((row, y) => {
            for (let x = 0; x < w;) {
                const ch = row[x];
                let n = 1;
                while (row[x + n] === ch) n++;
                if (ch !== '.') {
                    const l = ch.toLowerCase();
                    x2d.fillStyle = l === 'o' ? ink : l === 'a' ? acc : COLORS[l];
                    x2d.fillRect(x, y, n, 1);
                    x1 = Math.min(x1, x); xm = Math.max(xm, x + n); y1 = Math.min(y1, y); ym = Math.max(ym, y + 1);
                }
                x += n;
            }
        });
        return { img: cv, w: w * S, h: h * S, x1: x1 * S, x2: xm * S, y1: y1 * S, y2: ym * S };
    };

    // Build every sprite once (and again only if the theme's text color changes)
    const buildSprites = () => {
        CHARS = PHASES.map(p => [0, 1, 2, 3, 4, 5].map(i => render(charRows(i, p.outfit), p.accent)));
        KINDS = OBSTACLES.map((list, pi) => list.map(([air, ...frames]) => {
            const imgs = frames.map(f => render(f, PHASES[pi].accent));
            return { air, imgs, ...imgs[0] };
        }));
    };

    // ---------- State ----------
    const pool = Array.from({ length: 6 }, () => ({ on: false, x: 0, p: 0, i: 0 }));
    const kindsByType = () => KINDS.map(list => ({
        air: list.map((k, i) => (k.air ? i : -1)).filter(i => i >= 0),
        ground: list.map((k, i) => (k.air ? -1 : i)).filter(i => i >= 0),
    }));
    let SPLIT = [];
    const s = {
        mode: 'idle', score: 0, best: 0, pi: 0, speed: 0, nextIn: 0, t: 0, groundOff: 0,
        h: 0, vy: 0, air: false, down: false, banner: 0, shake: 0, overAt: 0, reduced: false,
    };
    try { s.best = +localStorage.getItem(BEST_KEY) || 0; } catch (e) { /* storage unavailable */ }

    let raf = 0, last = 0, visible = true;

    const start = () => {
        pool.forEach(o => { o.on = false; });
        Object.assign(s, { mode: 'running', score: 0, pi: 0, nextIn: 300, t: 0, h: 0, vy: 0, air: false, banner: 0, shake: 0, reduced: reducedMq.matches });
        resume();
    };

    const jump = () => {
        if (s.mode !== 'running') {
            if (s.mode === 'idle' || performance.now() - s.overAt > 400) start();
            return;
        }
        if (!s.air) { s.vy = 690; s.air = true; }
    };

    const gameOver = () => {
        s.mode = 'over';
        s.overAt = performance.now();
        s.shake = s.reduced ? 0 : 0.25;
        const sc = s.score | 0;
        if (sc > s.best) {
            s.best = sc;
            try { localStorage.setItem(BEST_KEY, String(sc)); } catch (e) { /* ignore */ }
        }
    };

    const spawn = () => {
        const o = pool.find(p => !p.on);
        if (!o) return 0;
        const wantAir = s.score > 60 && Math.random() < PHASES[s.pi].fly;
        const list = wantAir ? SPLIT[s.pi].air : SPLIT[s.pi].ground;
        o.p = s.pi;
        o.i = list[(Math.random() * list.length) | 0];
        o.x = LW + 10;
        o.on = true;
        return KINDS[o.p][o.i].x2;
    };

    const playerSprite = () => {
        const set = CHARS[s.pi];
        if (s.mode === 'running' && s.down && !s.air) return set[5];
        if (s.air) return set[4];
        return s.mode === 'running' ? set[((s.t * 12) | 0) % 4] : set[1];
    };

    // ---------- Update ----------
    const update = (dt) => {
        if (s.shake > 0) s.shake -= dt;
        if (s.mode !== 'running') return;
        s.t += dt;
        s.score += dt * POINTS_PER_SEC;
        while (s.pi < PHASES.length - 1 && s.score >= PHASES[s.pi + 1].at) { s.pi++; s.banner = 1.2; }
        if (s.banner > 0) s.banner -= dt;

        // Bump at each phase, ramp gently within it; the last phase keeps ramping
        const P = PHASES[s.pi], into = s.score - P.at;
        const ramp = s.pi === PHASES.length - 1 ? Math.min(into * 0.08, 220) : into * 0.1;
        s.speed = (P.speed + ramp) * (s.reduced ? 0.75 : 1);
        s.groundOff = (s.groundOff + s.speed * dt) % LW;

        if (s.air) { // pressing down mid-air drops faster
            s.h += s.vy * dt;
            s.vy -= (s.down ? 5200 : 2200) * dt;
            if (s.h <= 0) { s.h = 0; s.vy = 0; s.air = false; }
        }

        s.nextIn -= s.speed * dt;
        if (s.nextIn <= 0) {
            const g = P.gap;
            s.nextIn = spawn() + s.speed * (g[0] + Math.random() * (g[1] - g[0]));
        }

        // Forgiving hitboxes from each sprite's opaque bounds
        const sp = playerSprite();
        const py = GROUND - s.h - sp.y2;
        const px1 = PLAYER_X + sp.x1 + 8, px2 = PLAYER_X + sp.x2 - 10, py1 = py + sp.y1 + 6, py2 = py + sp.y2 - 2;

        for (const o of pool) {
            if (!o.on) continue;
            const k = KINDS[o.p][o.i];
            o.x -= s.speed * dt;
            if (o.x + k.x2 < -10) { o.on = false; continue; }
            const oy = (k.air ? GROUND - AIR_GAP : GROUND) - k.y2;
            if (o.x + k.x1 + 3 < px2 && o.x + k.x2 - 3 > px1 && oy + k.y1 + 3 < py2 && oy + k.y2 - 2 > py1) {
                gameOver();
                break;
            }
        }
    };

    // ---------- Draw ----------
    const pad = n => String(n | 0).padStart(5, '0');
    const text = (str, x, y, col, size = 13, align = 'center', weight = 600) => {
        c.font = `${weight} ${size}px ui-monospace, SFMono-Regular, Menlo, monospace`;
        c.textAlign = align;
        c.fillStyle = col;
        c.fillText(str, x, y);
    };
    const blit = (sp, x, baseline) => c.drawImage(sp.img, Math.round(x), Math.round(baseline - sp.y2), sp.w, sp.h);

    const draw = () => {
        const acc = PHASES[s.pi].accent;
        c.setTransform(scale, 0, 0, scale, 0, 0);
        c.imageSmoothingEnabled = false;
        c.clearRect(0, 0, LW, LH);
        if (s.shake > 0) c.translate((Math.random() - 0.5) * 6, (Math.random() - 0.5) * 4);

        // Ground with scrolling pebbles
        c.fillStyle = ink;
        c.fillRect(0, GROUND, LW, 1.5);
        for (let i = 0; i < 16; i++) {
            let gx = (i * 113 + 37 - s.groundOff) % LW;
            if (gx < 0) gx += LW;
            c.fillRect(gx, GROUND + 5 + (i * 7) % 10, 2 + (i % 3) * 2, 1.5);
        }

        for (const o of pool) {
            if (!o.on) continue;
            const k = KINDS[o.p][o.i];
            const frame = k.imgs.length > 1 ? k.imgs[((s.t * 20) | 0) % k.imgs.length] : k;
            blit(frame, o.x, k.air ? GROUND - AIR_GAP : GROUND);
        }
        blit(playerSprite(), PLAYER_X, GROUND - s.h);

        // HUD
        text(PHASES[s.pi].name.toUpperCase(), 8, 18, acc, 12, 'left');
        text(`HI ${pad(s.best)}  ${pad(s.score)}`, LW - 8, 18, ink, 13, 'right');

        if (s.banner > 0 && s.mode === 'running') {
            c.globalAlpha = Math.min(1, s.banner * 3);
            text(`LEVEL UP: ${PHASES[s.pi].name.toUpperCase()}`, LW / 2, 62, acc, 16, 'center', 700);
            c.globalAlpha = 1;
        }

        if (s.mode === 'idle') {
            text('CAREER RUN', LW / 2, 58, ink, 18, 'center', 700);
            text(coarse ? 'Tap to start' : 'Press Space or tap to start', LW / 2, 82, ink, 13, 'center', 400);
            text(coarse ? 'tap: jump · swipe down: duck' : '↑ / Space: jump · ↓: duck', LW / 2, 102, ink, 11, 'center', 400);
        } else if (s.mode === 'over') {
            text('GAME OVER', LW / 2, 56, ink, 18, 'center', 700);
            text(`Made it to: ${PHASES[s.pi].name}`, LW / 2, 80, acc, 13);
            text(coarse ? 'Tap to restart' : 'Press Space or tap to restart', LW / 2, 100, ink, 12, 'center', 400);
        }
    };

    // ---------- Loop: only runs while playing (or shaking), visible and on-screen ----------
    const frame = (now) => {
        raf = 0;
        if (!CHARS.length) return; // canvas not laid out yet
        const dt = last ? Math.min((now - last) / 1000, 0.05) : 0;
        last = now;
        update(dt);
        draw();
        if ((s.mode === 'running' || s.shake > 0) && visible && !document.hidden) raf = requestAnimationFrame(frame);
    };
    function resume() {
        if (!raf && visible && !document.hidden) { last = 0; raf = requestAnimationFrame(frame); }
    }
    const pause = () => { cancelAnimationFrame(raf); raf = 0; };

    // ---------- Input ----------
    const KEYS = { Space: 1, ArrowUp: 1, ArrowDown: 1 };
    const onKeyDown = (e) => {
        if (!visible || !KEYS[e.code] || /INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return;
        e.preventDefault(); // no page scroll, and no "click" on a focused button
        if (e.code === 'ArrowDown') { s.down = true; return; }
        if (!e.repeat) jump();
    };
    const onKeyUp = (e) => {
        if (!visible || !KEYS[e.code]) return;
        e.preventDefault(); // buttons activate on Space keyup
        if (e.code === 'ArrowDown') s.down = false;
    };

    // Touch: tap = jump, swipe down = duck (decided on release so a swipe doesn't also jump)
    let touchY = null, swiped = false;
    const onPointerDown = (e) => {
        e.preventDefault();
        if (e.pointerType === 'touch' && s.mode === 'running') {
            touchY = e.clientY; swiped = false;
            canvas.setPointerCapture(e.pointerId);
        } else jump();
    };
    const onPointerMove = (e) => {
        if (touchY !== null && e.clientY - touchY > 18) { swiped = true; s.down = true; }
    };
    const onPointerUp = () => {
        if (touchY === null) return;
        if (!swiped) jump();
        touchY = null; s.down = false;
    };

    // ---------- Sizing & visibility ----------
    const resize = () => {
        const w = canvas.clientWidth;
        if (!w) return;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round((w * LH / LW) * dpr);
        scale = canvas.width / LW;
        const color = getComputedStyle(canvas).color; // follows the page's text color in light or dark themes
        if (color !== ink) { ink = color; buildSprites(); SPLIT = kindsByType(); }
        draw();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        if (visible && s.mode === 'running') resume(); else if (!visible) pause();
    }, { threshold: 0.2 });
    io.observe(canvas);
    const onVisibility = () => { if (document.hidden) pause(); else if (s.mode === 'running') resume(); };
    const onScheme = () => resize();
    const schemeMq = window.matchMedia('(prefers-color-scheme: dark)');

    window.addEventListener('keydown', onKeyDown, true);
    window.addEventListener('keyup', onKeyUp, true);
    document.addEventListener('visibilitychange', onVisibility);
    schemeMq.addEventListener('change', onScheme);
    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('pointercancel', onPointerUp);
    resize();

    return () => {
        pause();
        ro.disconnect();
        io.disconnect();
        window.removeEventListener('keydown', onKeyDown, true);
        window.removeEventListener('keyup', onKeyUp, true);
        document.removeEventListener('visibilitychange', onVisibility);
        schemeMq.removeEventListener('change', onScheme);
        canvas.removeEventListener('pointerdown', onPointerDown);
        canvas.removeEventListener('pointermove', onPointerMove);
        canvas.removeEventListener('pointerup', onPointerUp);
        canvas.removeEventListener('pointercancel', onPointerUp);
    };
}

const canvasStyle = {
    display: 'block',
    width: '100%',
    maxWidth: 640,
    aspectRatio: `${LW} / ${LH}`,
    marginTop: 40,
    color: 'var(--text, CanvasText)',
    touchAction: 'none',
    cursor: 'pointer',
    userSelect: 'none',
    imageRendering: 'pixelated',
};

function CareerRunner() {
    const canvasRef = useRef(null);
    useEffect(() => startGame(canvasRef.current), []);
    return (
        <canvas
            ref={canvasRef}
            style={canvasStyle}
            role="img"
            aria-label="Career Run: an endless runner game through Quang's career. Press Space or Up to jump, Down to duck, or tap to jump."
        />
    );
}

export default CareerRunner;
