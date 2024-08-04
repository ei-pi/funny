import type { PointData } from "pixi.js";
import { makeUnit, UnitType, Variant, type Unit } from "./classes.js";
import { PIXI } from "./pixi.js";
import { GameSprite, loadImage } from "./sprite.js";

const app = new PIXI.Application();
await app.init({
    resizeTo: window,
    background: 0x559644,
    antialias: true,
    autoDensity: true,
    resolution: window.devicePixelRatio,
    hello: true,
    eventFeatures: {
        move: false,
        globalMove: false,
        wheel: false,
        click: true
    }
});
document.body.querySelector("p")?.replaceWith(app.canvas);

const MAP_WIDTH = app.screen.width;
const MAP_HEIGHT = app.screen.height;

const HALF_WIDTH = MAP_WIDTH / 2;
const HALF_HEIGHT = MAP_HEIGHT / 2;

const loader = loadImage(app.renderer);
const types = Object.keys(UnitType).filter(k => Number.isNaN(+k));
const variants = Object.keys(Variant).filter(k => Number.isNaN(+k));

for (
    const unit of types.flatMap(
        type => variants.map(variant => `${type.toLowerCase()}_${variant.toLowerCase()}`)
    )
) {
    await loader(unit, `./img/${unit}.png`);
}

for (let i = 0; i < 3; i++) {
    await loader(`grass_${i}`, `./img/grass_${i}.svg`);
}

function getRandom() {
    return makeUnit()
        .type(UnitType[types[~~(Math.random() * types.length)] as keyof typeof UnitType])
        .variant(Variant[variants[~~(Math.random() * variants.length)] as keyof typeof Variant])
        .build();
}

const randomSign = () => Math.random() > 0.5 ? 1 : -1;
const randomInCircle = (rad = 1) => {
    const ang = Math.random() * 2 * Math.PI;
    return {
        x: Math.cos(ang) * rad,
        y: Math.sin(ang) * rad
    } as PointData;
};

const grassContainer = new PIXI.Container();
const GRID_SIZE = 10;
const jitterRad = 1 / (GRID_SIZE - 1) * Math.min(HALF_WIDTH, HALF_HEIGHT);

grassContainer.addChild(
    ...Array.from(
        { length: GRID_SIZE },
        (_, i) => {
            const x = (i / (GRID_SIZE - 1)) * MAP_WIDTH - HALF_WIDTH;
            return Array.from(
                { length: GRID_SIZE },
                (_, j) => ({ x, y: (j / (GRID_SIZE - 1)) * MAP_HEIGHT - HALF_HEIGHT } satisfies PointData)
            );
        }
    ).flatMap(row =>
        row.map(
            point => {
                const jitter = randomInCircle(jitterRad);
                return (new GameSprite(`grass_${~~(Math.random() * 3)}`)
                    .setTint(0x417434)
                    .setScaleX(randomSign())).setVPos({ x: point.x + jitter.x, y: point.y + jitter.y });
            }
        )
    )
);
app.stage.addChild(grassContainer);

const units = new Set<Unit>();

let pos = {
    x: 0,
    y: 0
};

let zoom = 1;

const keys: Record<string, boolean> = {};

window.addEventListener("keydown", e => {
    keys[e.code] = true;
});

window.addEventListener("keyup", e => {
    keys[e.code] = false;
});

setInterval(() => {
    const unit = getRandom();
    units.add(unit);
    unit.vel = { x: Math.random() + 1, y: Math.random() + 1 };
    app.stage.addChild(
        unit.sprite
            .setPos(
                randomSign() * HALF_WIDTH * Math.random(),
                randomSign() * HALF_HEIGHT * Math.random()
            )
    );

    setTimeout(() => { unit.destroy(); }, Math.random() * 5000 + 10000);
}, 1000);

app.ticker.add(() => {
    const adjustFactor = 1.05;
    if (keys["KeyX"]) {
        zoom = 1;
    } else {
        const zoomIn = keys["KeyZ"] ?? false;
        const zoomOut = keys["KeyC"] ?? false;
        if (zoomIn !== zoomOut) {
            zoom *= zoomIn ? adjustFactor : 1 / adjustFactor;
        }
    }

    if (keys["KeyQ"]) {
        pos = { x: 0, y: 0 };
    } else {
        pos.x += (+(keys["KeyA"] ?? 0) - +(keys["KeyD"] ?? 0)) * 10 / zoom;
        pos.y += (+(keys["KeyW"] ?? 0) - +(keys["KeyS"] ?? 0)) * 10 / zoom;
    }

    app.stage.scale.set(zoom);

    app.stage.position = {
        x: pos.x * zoom + HALF_WIDTH,
        y: pos.y * zoom + HALF_HEIGHT
    };

    units.forEach(u => {
        if (u.destroyed) {
            units.delete(u);
            return;
        }

        u.update();

        if (Math.abs(u.pos.x) >= HALF_WIDTH) {
            u.pos.x = Math.sign(u.pos.x) * HALF_WIDTH;
            u.vel.x *= -1;
        }

        if (Math.abs(u.pos.y) >= HALF_HEIGHT) {
            u.pos.y = Math.sign(u.pos.y) * HALF_HEIGHT;
            u.vel.y *= -1;
        }
    });
});

app.render();

export { };
