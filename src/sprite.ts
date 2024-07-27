import type { Texture, Renderer, PointData, ColorSource } from "pixi.js";
import { PIXI } from "./pixi.js";

const { Assets, Sprite } = PIXI;

export const textures: Record<string, Texture> = {};

export const loadImage = (renderer: Renderer) => async(name: string, path: string): Promise<void> => {
    console.log(`Loading image ${location.origin}/${path}`);

    await new Promise<void>(async resolve => {
        const texture = await Assets.load<Texture>(path);
        renderer.prepare.upload(texture);
        textures[name] = texture;
        resolve();
    });
};

export class GameSprite extends Sprite {
    static getTexture(frame: string): Texture {
        if (!(frame in textures)) {
            console.warn(`Texture not found: "${frame}"`);
            return textures._missing_texture;
        }
        return textures[frame];
    }

    constructor(frame?: string) {
        super(frame ? GameSprite.getTexture(frame) : undefined);

        this.anchor.set(0.5);
        this.setPos(0, 0);
    }

    setFrame(frame: string): this {
        this.texture = GameSprite.getTexture(frame);
        return this;
    }

    setAnchor(anchor: PointData): this {
        this.anchor.copyFrom(anchor);
        return this;
    }

    setPos(x: number, y: number): this {
        this.position.set(x, y);
        return this;
    }

    setVPos(pos: PointData): this {
        this.position.set(pos.x, pos.y);
        return this;
    }

    setVisible(visible: boolean): this {
        this.visible = visible;
        return this;
    }

    setAngle(angle = 0): this {
        this.angle = angle;
        return this;
    }

    setRotation(rotation = 0): this {
        this.rotation = rotation;
        return this;
    }

    setScale(scale = 1): this {
        this.scale = { x: scale, y: scale };
        return this;
    }

    setTint(tint: ColorSource): this {
        this.tint = tint;
        return this;
    }

    setZIndex(zIndex: number): this {
        this.zIndex = zIndex;
        return this;
    }

    setAlpha(alpha: number): this {
        this.alpha = alpha;
        return this;
    }
}