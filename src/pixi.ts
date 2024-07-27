// @ts-expect-error womp womp
export const PIXI: typeof import("pixi.js") = await import("./lib/pixi.min.js");
PIXI.extensions.add(PIXI.PrepareSystem);
