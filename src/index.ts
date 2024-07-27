import { makeUnit, UnitType, Variant, type Unit } from "./classes.js";
import { PIXI } from "./pixi.js";
import { loadImage } from "./sprite.js";

const app = new PIXI.Application();
await app.init({
    resizeTo: window,
    background: 0x000000,
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

const loader = loadImage(app.renderer);
const types = Object.keys(UnitType).filter(k => Number.isNaN(+k));
const variants = Object.keys(Variant).filter(k => Number.isNaN(+k));

for (const unit of types.flatMap(type => variants.map(variant => `${type.toLowerCase()}_${variant.toLowerCase()}`))) {
    await loader(unit, `./img/${unit}.png`);
}

function getRandom() {
    return makeUnit()
        .type(UnitType[types[~~(Math.random() * types.length)] as keyof typeof UnitType])
        .variant(Variant[variants[~~(Math.random() * variants.length)] as keyof typeof Variant])
        .build();
}

const units = new Set<Unit>();

setInterval(() => {
    const unit = getRandom();
    units.add(unit);
    unit.vel = { x: Math.random(), y: Math.random() };
    app.stage.addChild(
        unit.sprite
            .setPos(
                app.screen.width * Math.random(),
                app.screen.height * Math.random()
            )
    );

    setTimeout(() => { unit.destroy(); }, Math.random() * 5000 + 10000);
}, 1000);

app.ticker.add(() => {
    units.forEach(u => {
        if (u.destroyed) {
            units.delete(u);
            return;
        }

        u.update();

        if (u.pos.x <= 0) {
            u.pos.x = 0;
            u.vel.x *= -1;
        }

        if (u.pos.x >= app.screen.width) {
            u.pos.x = app.screen.width;
            u.vel.x *= -1;
        }

        if (u.pos.y <= 0) {
            u.pos.y = 0;
            u.vel.y *= -1;
        }

        if (u.pos.y >= app.screen.height) {
            u.pos.y = app.screen.height;
            u.vel.y *= -1;
        }
    });
});

app.render();

export { };
