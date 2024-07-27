// @ts-expect-error womp womp
const PIXI: typeof import("pixi.js") = await import("./lib/pixi.min.js");

const app = new PIXI.Application();
await app.init({
    resizeTo: window,
    background: 0x000000,
    antialias: true,
    autoDensity: true,
    preferWebGLVersion: 2,
    preference: "webgpu",
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

export {}