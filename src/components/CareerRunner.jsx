// src/components/CareerRunner.jsx
// Tiny endless runner (à la Chrome's offline dino) through Quang's career.
// Vanilla canvas, no assets: sprites are pixel strings and backgrounds are simple
// strokes, all rendered once to offscreen canvases, then blitted every frame.
import { useEffect, useRef } from 'react';

const LW = 600, LH = 200, GROUND = 184, S = 2, PLAYER_X = 40, AIR_GAP = 46, ITEM_Y = 96, BG_H = 140;
const BEST_KEY = 'careerRunnerBest';
const POINTS_PER_SEC = 18; // distance points; one phase = 400 ≈ 22s
const PHASE_LEN = 400, WAVE_AT = 310, ENDLESS_WAVE_EVERY = 540, ENDLESS_SEC_PER_YEAR = 5;
const FUTURE_YEAR = new Date().getFullYear() + 1;

// Each phase spans its real years (fractional), is faster than the last, and ends in a mini boss wave
const PHASES = [
    { name: 'School', role: 'CS Student @ Northeastern State', at: 0, y0: 2020.6, y1: 2023.4, accent: '#e8a33d', speed: 300, gap: [1.0, 1.8], fly: 0.18, wave: 'FINALS WEEK', item: ['A+ paper', 'A+ papers'], outfit: { pack: 1 } },
    { name: 'Tranquility Spa', role: 'Web Developer @ Tranquility Spa', at: 400, y0: 2023.4, y1: 2025, accent: '#2bb5a0', speed: 360, gap: [0.92, 1.65], fly: 0.24, wave: 'HOLIDAY RUSH', item: ['tip', 'tips'], outfit: { pack: 1, tall: 1, swept: 1 } },
    { name: 'American Fidelity', role: 'Software Dev Intern @ American Fidelity', at: 800, y0: 2025, y1: 2026.25, accent: '#e5484d', speed: 420, gap: [0.85, 1.5], fly: 0.3, wave: 'OPEN ENROLLMENT', item: ['claim', 'claims'], outfit: { tie: 1, tall: 1, swept: 1 } },
    { name: 'Paul Logistic', role: 'Full Stack Developer @ Paul Logistic', at: 1200, y0: 2026.25, accent: '#4d8dff', speed: 480, gap: [0.78, 1.35], fly: 0.34, wave: 'PROD OUTAGE', item: ['commit', 'commits'], outfit: { hoodie: 1, laptop: 1, tall: 1, swept: 1, glasses: 1 } },
];
const MILESTONES = [
    { year: 2023.25, text: '🎓 B.S. Computer Science, Summa Cum Laude', cap: 1 },
    { year: 2025.92, text: "🎓 Master's in Computer Science, Dec 2025" },
];

// Distance → in-game year. Fixed-length phases stretch their real years to fit; the last phase runs at 5s/year.
const yearAt = (d) => {
    let i = PHASES.length - 1;
    while (i > 0 && d < PHASES[i].at) i--;
    const P = PHASES[i], into = d - P.at;
    return P.y1 ? P.y0 + (P.y1 - P.y0) * Math.min(into / PHASE_LEN, 1) : P.y0 + into / (POINTS_PER_SEC * ENDLESS_SEC_PER_YEAR);
};

// Palette. 'o' = outline (page text color), 'a' = phase accent.
// Lowercase fills get an automatic 1px outline; UPPERCASE = same color, no outline.
const COLORS = { w: '#ececef', g: '#8e8e96', d: '#45454d', b: '#b8895a', r: '#e5484d', s: '#e8b991', e: '#1b1b1f', k: '#2b2b31', y: '#f2c94c', n: '#3fb950' };

// ---------- Obstacles: [isFlyer, frame rows...] ----------
const DRAWER = ['gggggggggggg', 'ggggwwwwgggg', 'gggggggggggg', 'gggddddddggg', 'gggggggggggg'];
const BUG = 4; // index of the bug in Paul Logistic's list (PROD OUTAGE spawns these)
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

// ---------- Collectibles (+50) per phase, the coffee power-up, and the grad cap ----------
const ITEMS = [
    ['wwwwwwwwww', 'wwrrwwwwww', 'wrwwrwwrww', 'wrrrrwrrrw', 'wrwwrwwrww', 'wrwwrwwwww', 'wwwwwwwwww', 'wGGGGGGGGw', 'wwwwwwwwww'], // A+ paper
    ['..dddddd..', '.wwwwwwww.', '.wwwwwwww.', '.waaaaaaw.', '.waaaaaaw.', '.wwwwwwww.', '.wwyyywyw.', '.wyyyyyyw.', '.wyyyyyyw.', '..wwwwww..'], // tip jar
    ['nnnnnnnnnnn', 'nwwwwwwwwwn', 'nwwwwwwwnwn', 'nwwwwwwnnwn', 'nwnwwwnnwwn', 'nwnnwnnwwwn', 'nwwnnnwwwwn', 'nwwwnwwwwwn', 'nnnnnnnnnnn'], // approved stamp
    ['.nnnnnnnn.', 'nnnnnnnnnn', 'nnnnnnnWnn', 'nnnnnnWWnn', 'nWnnnWWnnn', 'nWWnWWnnnn', 'nnWWWnnnnn', 'nnnWnnnnnn', '.nnnnnnnn.'], // ✅ commit
];
const COFFEE = ['.gggggg.', 'gggggggg', '.wwwwww.', '.wwwwww.', '.wbbbbw.', '.wbbbbw.', '.wwwwww.', '..wwww..'];
const CAP = ['.....dd.....', '..dddddddd..', 'dddddddddddd', '..dddddddda.', '...dddddd.a.', '...dddddd.a.'];

// ---------- Character: composed on a 32×32 grid ----------
// Run cycle facing right: stride, passing, opposite stride, opposite passing, then jump.
// Legs: [hipX, hipY, kneeX, kneeY, footX, footY]; arms swing opposite the legs. Hands: [x, y]
const POSES = [
    { back: [14, 22, 13, 26, 10, 27], front: [17, 22, 19, 26, 20, 29], handB: [21, 17], handF: [13, 19] }, // front leg planted ahead
    { back: [14, 22, 18, 25, 15, 27], front: [16, 22, 16, 26, 16, 29], handB: [16, 19], handF: [17, 20] }, // passing
    { back: [15, 22, 18, 26, 19, 29], front: [16, 22, 14, 26, 11, 27], handB: [12, 19], handF: [21, 17] }, // back leg planted ahead
    { back: [15, 22, 15, 26, 15, 29], front: [16, 22, 19, 25, 16, 27], handB: [15, 20], handF: [17, 20] }, // passing
    { back: [15, 22, 15, 25, 12, 27], front: [17, 22, 20, 24, 19, 27], handB: [11, 12], handF: [22, 11] }, // jump
];

// o: outfit flags (pack, tie, hoodie, laptop) + growth tweaks (tall, swept hair, glasses)
function charRows(poseIdx, o) {
    const g = Array.from({ length: 32 }, () => Array(32).fill('.'));
    const put = (x, y, ch) => { if (x >= 0 && x < 32 && y >= 0 && y < 32) g[y][x] = ch; };
    const rect = (x, y, w, h, ch) => { for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) put(x + i, y + j, ch); };
    const seg = (x0, y0, x1, y1, ch, w = 2, ox = 0) => { // w-px-thick line, shifted by ox
        const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)) || 1;
        for (let i = 0; i <= n; i++) {
            const x = Math.round(x0 + (x1 - x0) * i / n), y = Math.round(y0 + (y1 - y0) * i / n);
            for (let k = 0; k < w; k++) put(x + ox + k, y, ch);
        }
    };
    // Two-tone legs: the far leg is darker so the pair reads clearly while running
    const leg = (l, front) => {
        const pants = front ? 'd' : 'k';
        seg(l[0], l[1], l[2], l[3], pants, 3, -1); seg(l[2], l[3], l[4], l[5], pants, 3, -1);
        rect(l[4] - 1, l[5], 4, 2, front ? 'w' : 'g'); // sneaker, toe forward
    };
    const longSleeves = o.hoodie || o.tie;
    const arm = (sx, sy, h, front) => {
        const sleeve = o.hoodie ? 'a' : 'w';
        if (front) { seg(sx, sy + 1, h[0], h[1], 'E', 4, -1); rect(h[0] - 1, h[1] - 1, 4, 4, 'E'); } // dark edge so it reads over the shirt
        seg(sx, sy, h[0], h[1], longSleeves ? sleeve : 's');
        if (!longSleeves) seg(sx, sy, Math.round((sx + h[0]) / 2), Math.round((sy + h[1]) / 2), sleeve); // short sleeve
        rect(h[0], h[1], 2, 2, 's');
    };
    const head = (x, y) => {
        rect(x, y, 10, 3, 'd'); rect(x, y + 3, 2, 4, 'd');
        if (o.swept) { rect(x + 4, y - 1, 5, 1, 'd'); put(x + 10, y + 1, 'd'); put(x + 8, y + 3, 'd'); put(x + 9, y + 3, 'd'); } // side-swept quiff + fringe
        else { put(x + 1, y - 1, 'd'); put(x + 4, y - 1, 'd'); put(x + 7, y - 1, 'd'); } // spiky
        rect(x + 2, y + 3, 8, 7, 's'); rect(x, y + 7, 2, 3, 's'); put(x + 10, y + 6, 's'); // face, jaw, nose
        if (!o.swept) { put(x + 7, y + 4, 'd'); put(x + 8, y + 4, 'd'); } // brow
        put(x + 7, y + 5, 'e'); put(x + 7, y + 6, 'e'); // eye
        put(x + 8, y + 8, 'e'); // mouth
        if (o.glasses) { rect(x + 6, y + 4, 4, 1, 'e'); rect(x + 6, y + 7, 4, 1, 'e'); put(x + 6, y + 5, 'e'); put(x + 6, y + 6, 'e'); put(x + 9, y + 5, 'e'); put(x + 9, y + 6, 'e'); rect(x + 3, y + 5, 3, 1, 'e'); }
    };
    const shirt = o.hoodie ? 'a' : 'w';
    const pack = o.hoodie ? 'g' : 'a';

    if (poseIdx === 5) { // duck: leaning forward, low
        leg([9, 24, 7, 27, 5, 29]);
        if (o.pack) rect(11, 15, 7, 4, pack);
        if (o.hoodie) rect(15, 16, 3, 3, 'a');
        rect(10, 19, 10, 5, shirt);
        if (o.tie) { put(18, 23, 'a'); put(19, 23, 'a'); }
        rect(8, 22, 4, 3, 'd');
        leg([11, 24, 14, 27, 15, 29], true);
        head(17, 12);
        if (o.laptop) rect(4, 21, 7, 2, 'g');
        arm(18, 20, [23, 25], true);
    } else {
        const P = POSES[poseIdx], U = o.tall ? 1 : 0; // "tall" lifts the upper body 1px
        if (!o.laptop) arm(14, 14 - U, P.handB);
        leg(P.back);
        if (o.pack) { rect(9, 13 - U, 4, 8, pack); put(10, 15 - U, 'O'); put(11, 15 - U, 'O'); }
        if (o.hoodie) rect(12, 11 - U, 3, 3, 'a'); // hood
        rect(13, 13 - U, 8, 8 + U, shirt);
        rect(13, 21, 8, 2, 'd'); // pants
        rect(16, 12 - U, 2, 1, 's'); // neck
        if (o.pack) { put(16, 13 - U, 'O'); put(16, 14 - U, 'O'); put(15, 15 - U, 'O'); put(15, 16 - U, 'O'); } // strap
        if (o.tie) { rect(15, 13 - U, 3, 1, 'a'); rect(15, 14 - U, 2, 5, 'a'); put(16, 19 - U, 'a'); }
        if (o.hoodie) { put(18, 14 - U, 'W'); put(18, 15 - U, 'W'); rect(15, 18 - U, 5, 1, 'O'); } // drawstring, pocket
        leg(P.front, true);
        head(12, 2 - U);
        if (o.laptop) { arm(15, 14 - U, [11, 15]); rect(8, 16, 8, 7, 'g'); put(11, 19, 'W'); put(12, 19, 'W'); } // laptop held at the side
        arm(18, 14 - U, P.handF, true);
    }
    return g.map(r => r.join(''));
}

// ---------- Parallax backgrounds: one faint 600×140 tile per phase ----------
function drawBackground(b, pi) {
    const ln = (x0, y0, x1, y1) => { b.beginPath(); b.moveTo(x0, y0); b.lineTo(x1, y1); b.stroke(); };
    const ell = (x, y, rx, ry, rot, fill) => { b.beginPath(); b.ellipse(x, y, rx, ry, rot, 0, 7); if (fill) b.fill(); else b.stroke(); };
    if (pi === 0) { // School: building, flagpole, lockers
        b.strokeRect(40, 50, 220, 90);
        b.beginPath(); b.moveTo(30, 50); b.lineTo(150, 14); b.lineTo(270, 50); b.closePath(); b.stroke();
        ell(150, 36, 7, 7, 0);
        for (let r = 0; r < 2; r++) for (let i = 0; i < 5; i++) if (r === 0 || i !== 2) b.strokeRect(56 + i * 40, 62 + r * 34, 22, 22);
        b.strokeRect(138, 100, 24, 40);
        ln(300, 140, 300, 8); b.fillRect(302, 10, 30, 18);
        for (let i = 0; i < 8; i++) {
            const x = 360 + i * 26;
            b.strokeRect(x, 66, 24, 74); b.fillRect(x + 4, 72, 16, 2); b.fillRect(x + 4, 77, 16, 2); b.fillRect(x + 17, 100, 3, 8);
        }
    } else if (pi === 1) { // Spa: lotus sign, plants, candles
        b.fillRect(70, 90, 4, 50); b.fillRect(146, 90, 4, 50); b.strokeRect(56, 44, 108, 48);
        ell(110, 66, 6, 14, 0); ell(97, 71, 5, 12, -0.7); ell(123, 71, 5, 12, 0.7); ln(92, 82, 128, 82);
        for (const x of [250, 470]) {
            b.beginPath(); b.moveTo(x - 14, 140); b.lineTo(x + 14, 140); b.lineTo(x + 18, 112); b.lineTo(x - 18, 112); b.closePath(); b.stroke();
            ell(x, 88, 6, 22, 0); ell(x - 14, 94, 5, 18, -0.6); ell(x + 14, 94, 5, 18, 0.6);
        }
        for (const [x, h] of [[340, 24], [360, 34], [380, 18], [560, 28]]) { b.strokeRect(x, 140 - h, 12, h); ell(x + 6, 132 - h, 3, 6, 0, 1); }
    } else if (pi === 2) { // American Fidelity: window wall, cubicles
        for (let i = 0; i < 6; i++) { const x = 18 + i * 96; b.strokeRect(x, 8, 80, 58); ln(x + 40, 8, x + 40, 66); ln(x, 37, x + 80, 37); }
        for (let i = 0; i < 5; i++) {
            const x = 20 + i * 116;
            b.strokeRect(x + 30, 80, 30, 18); b.fillRect(x + 43, 98, 4, 4);
            b.strokeRect(x, 102, 104, 38); b.fillRect(x, 99, 104, 3);
        }
    } else { // Paul Logistic: racks, dock doors, truck
        for (const x of [20, 120, 220]) b.fillRect(x, 20, 4, 120);
        for (const y of [56, 98]) b.fillRect(20, y, 204, 3);
        for (const [x, y, w, h] of [[32, 36, 30, 20], [70, 42, 26, 14], [130, 30, 36, 26], [178, 40, 30, 16], [40, 78, 34, 20], [140, 82, 40, 16], [90, 120, 40, 20]]) b.strokeRect(x, y, w, h);
        for (const x of [252, 342]) {
            b.strokeRect(x, 50, 74, 90);
            for (let k = 0; k < 8; k++) ln(x, 60 + k * 10, x + 74, 60 + k * 10);
            b.fillRect(x - 6, 118, 4, 16); b.fillRect(x + 76, 118, 4, 16);
        }
        b.strokeRect(440, 64, 100, 62);
        b.beginPath(); b.moveTo(540, 126); b.lineTo(540, 86); b.lineTo(566, 86); b.lineTo(584, 106); b.lineTo(584, 126); b.stroke();
        b.strokeRect(548, 92, 16, 12);
        for (const x of [466, 510, 566]) ell(x, 130, 8, 8, 0);
    }
}

function startGame(canvas) {
    const c = canvas.getContext('2d');
    const reducedMq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    let ink = '', scale = 1, nightGrad = null, redGrad = null;
    let CHARS = [], KINDS = [], SPLIT = [], ITEM_IMG = [], COFFEE_IMG = null, CAP_IMG = null, BGS = [];

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

    // Build every sprite and background once (and again only if the theme's text color changes)
    const buildSprites = () => {
        CHARS = [0, 1].map(skin => PHASES.map(p => {
            const o = skin ? { ...p.outfit, hoodie: 1, tie: 0 } : p.outfit; // easter-egg hoodie skin
            return [0, 1, 2, 3, 4, 5].map(i => render(charRows(i, o), p.accent));
        }));
        KINDS = OBSTACLES.map((list, pi) => list.map(([air, ...frames]) => {
            const imgs = frames.map(f => render(f, PHASES[pi].accent));
            return { air, imgs, ...imgs[0] };
        }));
        SPLIT = KINDS.map(list => ({
            air: list.map((k, i) => (k.air ? i : -1)).filter(i => i >= 0),
            ground: list.map((k, i) => (k.air ? -1 : i)).filter(i => i >= 0),
        }));
        ITEM_IMG = ITEMS.map((rows, pi) => render(rows, PHASES[pi].accent));
        COFFEE_IMG = render(COFFEE, '#fff');
        CAP_IMG = render(CAP, PHASES[0].accent);
        BGS = PHASES.map((p, pi) => {
            const cv = document.createElement('canvas');
            cv.width = LW * 2; cv.height = BG_H * 2;
            const b = cv.getContext('2d');
            b.scale(2, 2);
            b.strokeStyle = ink; b.fillStyle = ink; b.lineWidth = 2; b.lineJoin = 'round';
            drawBackground(b, pi);
            return cv;
        });
    };

    // ---------- State & pools (all reused, nothing allocated per frame) ----------
    const pool = Array.from({ length: 6 }, () => ({ on: false, x: 0, p: 0, i: 0, safe: false }));
    const items = Array.from({ length: 4 }, () => ({ on: false, x: 0, p: 0, coffee: false }));
    const pops = Array.from({ length: 4 }, () => ({ t: 0, x: 0, y: 0, text: '', col: '' }));
    const cap = { on: false, x: 0, y: 0, vx: 0, vy: 0 };
    const s = {
        mode: 'idle', dist: 0, bonus: 0, score: 0, best: 0, year: PHASES[0].y0, pi: 0, speed: 0, t: 0,
        nextIn: 0, itemIn: 0, coffeeAt: 0, groundOff: 0, bgOff: 0, bgPrev: 0, bgFade: 1,
        h: 0, vy: 0, air: false, down: false, shake: 0, overAt: 0, reduced: false, wave: false,
        boost: 0, shield: false, flash: 0, mi: 0, future: false, queue: [], banner: '', bannerCol: '', bannerT: 0,
        got: [0, 0, 0, 0], skin: 0, holdT: 0, hoodieNext: false, newBest: false, summary: '',
    };
    try { s.best = +localStorage.getItem(BEST_KEY) || 0; } catch (e) { /* storage unavailable */ }

    let raf = 0, last = 0, visible = true;

    const start = () => {
        pool.forEach(o => { o.on = false; });
        items.forEach(o => { o.on = false; });
        pops.forEach(p => { p.t = 0; });
        cap.on = false;
        s.queue.length = 0;
        s.got.fill(0);
        Object.assign(s, {
            mode: 'running', dist: 0, bonus: 0, score: 0, year: PHASES[0].y0, pi: 0, t: 0, nextIn: 300, itemIn: 900,
            coffeeAt: 60 + Math.random() * 220, bgPrev: 0, bgFade: 1, h: 0, vy: 0, air: false, shake: 0, wave: false,
            boost: 0, shield: false, flash: 0, mi: 0, future: false, banner: '', bannerT: 0, newBest: false,
            skin: s.hoodieNext ? 1 : 0, hoodieNext: false, holdT: 0, reduced: reducedMq.matches,
        });
        resume();
    };

    const jump = () => {
        if (s.mode !== 'running') {
            if (s.mode === 'idle' || performance.now() - s.overAt > 400) start();
            return;
        }
        if (!s.air) { s.vy = 690; s.air = true; }
    };

    const announce = (text, col) => s.queue.push(text, col);
    const popup = (text, x, y, col) => {
        const p = pops.find(q => q.t <= 0) || pops[0];
        Object.assign(p, { t: 0.7, x, y, text, col });
    };

    const gameOver = () => {
        s.mode = 'over';
        s.overAt = performance.now();
        s.shake = s.reduced ? 0 : 0.25;
        const sc = s.score | 0;
        if (sc > s.best) {
            s.best = sc; s.newBest = true;
            try { localStorage.setItem(BEST_KEY, String(sc)); } catch (e) { /* ignore */ }
        }
        s.summary = PHASES.slice(0, s.pi + 1).map((p, i) => `${s.got[i]} ${p.item[s.got[i] === 1 ? 0 : 1]}`).join(' · ');
    };

    const spawn = () => {
        const o = pool.find(p => !p.on);
        if (!o) return 0;
        const P = PHASES[s.pi];
        const outage = s.wave && s.pi === PHASES.length - 1;
        const wantAir = s.dist > 60 && Math.random() < (outage ? 0.65 : P.fly + (s.wave ? 0.15 : 0));
        const list = wantAir ? SPLIT[s.pi].air : SPLIT[s.pi].ground;
        o.p = s.pi;
        o.i = outage && wantAir ? BUG : list[(Math.random() * list.length) | 0];
        o.x = LW + 10;
        o.on = true; o.safe = false;
        return KINDS[o.p][o.i].x2;
    };

    const spawnItem = (coffee) => {
        const it = items.find(q => !q.on);
        if (!it) return;
        Object.assign(it, { on: true, x: LW + 20, p: s.pi, coffee });
    };

    const playerSprite = () => {
        const set = CHARS[s.mode === 'idle' && s.hoodieNext ? 1 : s.skin][s.pi];
        if (s.mode === 'running' && s.down && !s.air) return set[5];
        if (s.air) return set[4];
        return s.mode === 'running' ? set[((s.t * 12) | 0) % 4] : set[1];
    };

    const hit = (ax1, ax2, ay1, ay2, bx1, bx2, by1, by2) => ax1 < bx2 && ax2 > bx1 && ay1 < by2 && ay2 > by1;

    // ---------- Update ----------
    const update = (dt) => {
        if (s.shake > 0) s.shake -= dt;
        if (s.mode === 'idle') { // easter egg: hold Down for 3s on the start screen
            if (s.down && !s.hoodieNext) { s.holdT += dt; if (s.holdT >= 3) s.hoodieNext = true; } else s.holdT = 0;
            return;
        }
        if (s.mode !== 'running') return;
        s.t += dt;
        s.dist += dt * POINTS_PER_SEC;
        s.score = s.dist + s.bonus;

        while (s.pi < PHASES.length - 1 && s.dist >= PHASES[s.pi + 1].at) {
            s.bgPrev = s.pi; s.bgFade = 0; s.pi++;
            announce(`Joined ${PHASES[s.pi].name}`, PHASES[s.pi].accent);
            s.coffeeAt = s.pi === PHASES.length - 1 ? s.dist + 60 + Math.random() * 220 : PHASES[s.pi].at + 60 + Math.random() * 220;
        }
        if (s.bgFade < 1) s.bgFade = Math.min(1, s.bgFade + dt);

        // Timeline milestones (queued so they never overlap)
        s.year = yearAt(s.dist);
        while (s.mi < MILESTONES.length && s.year >= MILESTONES[s.mi].year) {
            const m = MILESTONES[s.mi++];
            announce(m.text, PHASES[s.pi].accent);
            if (m.cap && !s.reduced) Object.assign(cap, { on: true, x: PLAYER_X + 26, y: GROUND - s.h - 66, vx: 300, vy: -400 });
        }
        if (!s.future && s.year >= FUTURE_YEAR) { s.future = true; announce('The future: ???', ''); }
        if (s.bannerT > 0) s.bannerT -= dt;
        if (s.bannerT <= 0 && s.queue.length) { s.banner = s.queue.shift(); s.bannerCol = s.queue.shift(); s.bannerT = 1.5; }

        // Mini boss wave: the last ~5s of each phase, then every ~30s in endless mode
        const P = PHASES[s.pi], into = s.dist - P.at, endless = s.pi === PHASES.length - 1;
        s.wave = endless ? into % ENDLESS_WAVE_EVERY >= ENDLESS_WAVE_EVERY - 90 : into >= WAVE_AT;

        if (s.boost > 0) { s.boost -= dt; if (s.boost <= 0) s.shield = false; }
        if (s.flash > 0) s.flash -= dt;

        // Bump at each phase, ramp gently within it; the last phase keeps ramping
        const ramp = endless ? Math.min(into * 0.08, 220) : into * 0.1;
        s.speed = (P.speed + ramp) * (s.wave ? 1.12 : 1) * (s.boost > 0 ? 1.3 : 1) * (s.reduced ? 0.75 : 1);
        s.groundOff = (s.groundOff + s.speed * dt) % LW;
        s.bgOff = (s.bgOff + s.speed * 0.3 * dt) % LW;

        if (s.air) { // pressing down mid-air drops faster
            s.h += s.vy * dt;
            s.vy -= (s.down ? 5200 : 2200) * dt;
            if (s.h <= 0) { s.h = 0; s.vy = 0; s.air = false; }
        }

        s.nextIn -= s.speed * dt;
        if (s.nextIn <= 0) {
            const g0 = s.wave ? 0.72 : P.gap[0], g1 = s.wave ? 1.0 : P.gap[1];
            s.nextIn = spawn() + s.speed * (g0 + Math.random() * (g1 - g0));
        }
        s.itemIn -= s.speed * dt;
        if (s.itemIn <= 0) { spawnItem(false); s.itemIn = s.speed * (2.2 + Math.random() * 1.8); }
        if (s.dist >= s.coffeeAt) { spawnItem(true); s.coffeeAt = endless ? s.dist + 380 + Math.random() * 160 : Infinity; }

        // Forgiving hitboxes from each sprite's opaque bounds
        const sp = playerSprite();
        const py = GROUND - s.h - sp.y2;
        const px1 = PLAYER_X + sp.x1 + 8, px2 = PLAYER_X + sp.x2 - 10, py1 = py + sp.y1 + 6, py2 = py + sp.y2 - 2;

        for (const it of items) {
            if (!it.on) continue;
            const im = it.coffee ? COFFEE_IMG : ITEM_IMG[it.p];
            it.x -= s.speed * dt;
            if (it.x + im.x2 < -10) { it.on = false; continue; }
            const iy = GROUND - ITEM_Y - im.y2;
            if (hit(px1 - 4, px2 + 4, py1, py2, it.x + im.x1, it.x + im.x2, iy + im.y1, iy + im.y2)) {
                it.on = false;
                if (it.coffee) { s.boost = 3; s.shield = true; popup('☕ BOOST', it.x, iy, PHASES[s.pi].accent); }
                else { s.bonus += 50; s.got[it.p]++; popup('+50', it.x, iy, PHASES[it.p].accent); }
            }
        }

        for (const o of pool) {
            if (!o.on) continue;
            const k = KINDS[o.p][o.i];
            o.x -= s.speed * dt;
            if (o.x + k.x2 < -10) { o.on = false; continue; }
            if (o.safe) continue;
            const oy = (k.air ? GROUND - AIR_GAP : GROUND) - k.y2;
            if (hit(px1, px2, py1, py2, o.x + k.x1 + 3, o.x + k.x2 - 3, oy + k.y1 + 3, oy + k.y2 - 2)) {
                if (s.shield) { s.shield = false; o.safe = true; s.flash = 0.4; continue; } // coffee absorbs one hit
                gameOver();
                break;
            }
        }

        for (const p of pops) if (p.t > 0) { p.t -= dt; p.y -= 40 * dt; }
        if (cap.on) {
            cap.x += cap.vx * dt; cap.y += cap.vy * dt; cap.vy += 520 * dt;
            if (cap.y > LH + 20 || cap.x > LW + 20) cap.on = false;
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
    const drawBg = (img, alpha) => {
        c.globalAlpha = alpha;
        const x = -s.bgOff, y = GROUND - BG_H;
        c.drawImage(img, x, y, LW, BG_H);
        c.drawImage(img, x + LW, y, LW, BG_H);
    };
    const roundRect = (x, y, w, h, r) => {
        c.beginPath();
        if (c.roundRect) c.roundRect(x, y, w, h, r); else c.rect(x, y, w, h);
    };

    const drawCard = () => { // game over: a tiny résumé
        const P = PHASES[s.pi], w = 372, h = 156, x = (LW - w) / 2, y = 28, L = x + 22;
        const paper = '#f6f6f7', inkDark = '#1b1b1f', muted = '#6e6e73';
        c.globalAlpha = 0.35; c.fillStyle = '#000'; roundRect(x + 3, y + 4, w, h, 8); c.fill();
        c.globalAlpha = 1; c.fillStyle = paper; roundRect(x, y, w, h, 8); c.fill();
        c.fillStyle = P.accent; c.fillRect(x, y + 12, 4, h - 24);
        text(`Quang · ${Math.floor(s.year)}`, L, y + 28, inkDark, 16, 'left', 700);
        if (s.newBest) text('NEW BEST', x + w - 18, y + 27, P.accent, 10, 'right', 700);
        c.fillStyle = '#d4d4d8'; c.fillRect(L, y + 37, w - 44, 1);
        text('EXPERIENCE', L, y + 54, muted, 9, 'left', 700);
        text(P.role, L, y + 69, inkDark, 12, 'left', 600);
        text('COLLECTED', L, y + 89, muted, 9, 'left', 700);
        text(s.summary, L, y + 104, inkDark, 11, 'left', 400);
        text(`Score ${pad(s.score)}  ·  Best ${pad(s.best)}`, L, y + 123, inkDark, 11, 'left', 600);
        text(coarse ? 'Tap to run it back' : 'Press Space or tap to run it back', x + w / 2, y + 145, muted, 11, 'center', 400);
    };

    const draw = () => {
        const P = PHASES[s.pi], acc = P.accent, running = s.mode === 'running';
        c.setTransform(scale, 0, 0, scale, 0, 0);
        c.clearRect(0, 0, LW, LH);
        if (s.shake > 0) c.translate((Math.random() - 0.5) * 6, (Math.random() - 0.5) * 4);

        // Faint parallax background, cross-fading between phases
        c.imageSmoothingEnabled = true;
        drawBg(BGS[s.pi], 0.13 * s.bgFade);
        if (s.bgFade < 1) drawBg(BGS[s.bgPrev], 0.13 * (1 - s.bgFade));

        // Day/night once per in-game year, red tint during PROD OUTAGE (static with reduced motion)
        if (!s.reduced && s.mode !== 'idle') {
            const night = (1 - Math.cos((s.year % 1) * Math.PI * 2)) / 2;
            c.globalAlpha = night * 0.9; c.fillStyle = nightGrad; c.fillRect(0, 0, LW, LH);
        }
        if (s.wave && s.pi === PHASES.length - 1 && s.mode !== 'idle') {
            c.globalAlpha = s.reduced ? 0.8 : 0.65 + Math.sin(s.t * 5) * 0.25;
            c.fillStyle = redGrad; c.fillRect(0, 0, LW, LH);
        }
        c.globalAlpha = 1;
        c.imageSmoothingEnabled = false;

        // Ground with scrolling pebbles
        c.fillStyle = ink;
        c.fillRect(0, GROUND, LW, 1.5);
        for (let i = 0; i < 16; i++) {
            let gx = (i * 113 + 37 - s.groundOff) % LW;
            if (gx < 0) gx += LW;
            c.fillRect(gx, GROUND + 5 + (i * 7) % 10, 2 + (i % 3) * 2, 1.5);
        }

        const bob = s.reduced ? 0 : Math.sin(s.t * 6) * 2;
        for (const it of items) if (it.on) blit(it.coffee ? COFFEE_IMG : ITEM_IMG[it.p], it.x, GROUND - ITEM_Y + bob);
        for (const o of pool) {
            if (!o.on) continue;
            const k = KINDS[o.p][o.i];
            const frame = k.imgs.length > 1 ? k.imgs[((s.t * 20) | 0) % k.imgs.length] : k;
            blit(frame, o.x, k.air ? GROUND - AIR_GAP : GROUND);
        }

        // Player (blinks after the coffee shield absorbs a hit; ring while shielded)
        if (!(s.flash > 0 && ((s.t * 20) | 0) % 2)) blit(playerSprite(), PLAYER_X, GROUND - s.h);
        if (s.shield && running) {
            c.globalAlpha = 0.45; c.strokeStyle = acc; c.lineWidth = 2;
            c.beginPath(); c.arc(PLAYER_X + 34, GROUND - s.h - 34, 38, 0, 7); c.stroke();
            c.globalAlpha = 1;
        }
        if (cap.on) blit(CAP_IMG, cap.x, cap.y);
        for (const p of pops) {
            if (p.t <= 0) continue;
            c.globalAlpha = Math.min(1, p.t * 2);
            text(p.text, p.x + 12, p.y, p.col, 11, 'center', 700);
        }
        c.globalAlpha = 1;

        // HUD: big year + phase on the left, small score on the right
        text(String(Math.floor(s.year)), 8, 24, ink, 20, 'left', 700);
        text(P.name.toUpperCase(), 66, 22, acc, 11, 'left');
        if (s.boost > 0 && running) text(`☕ ${s.boost.toFixed(1)}s`, 8, 42, acc, 11, 'left');
        text(`HI ${pad(s.best)}  ${pad(s.score)}`, LW - 8, 18, ink, 11, 'right', 500);

        if (running && s.bannerT > 0) {
            c.globalAlpha = Math.min(1, s.bannerT * 4, (1.5 - s.bannerT) * 6);
            text(s.banner, LW / 2, 62, s.bannerCol || ink, 14, 'center', 700);
            c.globalAlpha = 1;
        }
        if (running && s.wave) text(`⚠ ${P.wave}`, LW / 2, 40, '#e5484d', 13, 'center', 700);

        if (s.mode === 'idle') {
            text('CAREER RUN', LW / 2, 58, ink, 18, 'center', 700);
            text(coarse ? 'Tap to start' : 'Press Space or tap to start', LW / 2, 82, ink, 13, 'center', 400);
            text(coarse ? 'tap: jump · swipe down: duck' : '↑ / Space: jump · ↓: duck', LW / 2, 102, ink, 11, 'center', 400);
            if (s.hoodieNext) text('🧥 HOODIE UNLOCKED', LW / 2, 124, acc, 12, 'center', 700);
            else if (s.holdT > 0) { c.fillStyle = acc; c.fillRect(LW / 2 - 40, 118, 80 * Math.min(s.holdT / 3, 1), 3); }
        } else if (s.mode === 'over') {
            drawCard();
        }
    };

    // ---------- Loop: only runs while something moves, the tab is visible and the canvas is on-screen ----------
    const needsLoop = () => s.mode === 'running' || s.shake > 0 || (s.mode === 'idle' && s.down && !s.hoodieNext);
    const frame = (now) => {
        raf = 0;
        if (!CHARS.length) return; // canvas not laid out yet
        const dt = last ? Math.min((now - last) / 1000, 0.05) : 0;
        last = now;
        update(dt);
        draw();
        if (needsLoop() && visible && !document.hidden) raf = requestAnimationFrame(frame);
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
        if (e.code === 'ArrowDown') {
            s.down = true;
            if (s.mode === 'idle' && !s.hoodieNext) resume();
            return;
        }
        if (!e.repeat) jump();
    };
    const onKeyUp = (e) => {
        if (!visible || !KEYS[e.code]) return;
        e.preventDefault(); // buttons activate on Space keyup
        if (e.code === 'ArrowDown') {
            s.down = false;
            if (s.mode === 'idle') { s.holdT = 0; draw(); }
        }
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
        if (color !== ink) { ink = color; buildSprites(); }
        // Soft-edged full-width tints (gradients are reused every frame)
        const band = (col) => {
            const g = c.createLinearGradient(0, 0, LW, 0);
            g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(0.12, col); g.addColorStop(0.88, col); g.addColorStop(1, 'rgba(0,0,0,0)');
            return g;
        };
        nightGrad = band('rgba(60, 80, 190, 0.12)');
        redGrad = band('rgba(229, 72, 77, 0.10)');
        draw();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        if (visible && needsLoop()) resume(); else if (!visible) pause();
    }, { threshold: 0.2 });
    io.observe(canvas);
    const onVisibility = () => { if (document.hidden) pause(); else if (needsLoop()) resume(); };
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
            aria-label="Career Run: an endless runner game through Quang's career, from 2020 to today. Press Space or Up to jump, Down to duck, or tap to jump."
        />
    );
}

export default CareerRunner;
