import { ObservablePoint, type PointData } from "pixi.js";
import { GameSprite } from "./sprite.js";

export enum UnitType {
    Tank,
    Archer,
    Assassin
}

export enum Variant {
    Mini,
    Normal,
    Super
}

type Builder<T extends UnitType, V extends Variant> = {
    type<T2 extends UnitType>(type: T2): Builder<T2, V>;
    variant<V2 extends Variant>(variant: V2): Builder<T, V2>;
    build(): Unit;
};

export const makeUnit = () => {
    let obj = {} as Builder<UnitType, Variant>;
    let type: UnitType | undefined;
    let variant = Variant.Normal;


    obj.type = <T extends UnitType>(_type: T) => {
        type = _type;
        return obj as Builder<T, Variant>;
    };

    obj.variant = <V extends Variant>(_variant: V) => {
        variant = _variant;
        return obj as Builder<UnitType, V>;
    };

    obj.build = () => {
        if (type === undefined) {
            throw new Error("Error creating unit: no type given");
        }

        return new Unit(type, variant);
    };

    return obj as Builder<UnitType, Variant.Normal>;
};

export class Unit {
    readonly sprite: GameSprite;

    private _pos: ObservablePoint;
    get pos(): ObservablePoint { return this._pos; }

    vel: PointData;

    private _destroyed = false;
    get destroyed() { return this._destroyed; }

    constructor(
        readonly type: UnitType,
        readonly variant: Variant,
        pos: PointData = { x: 0, y: 0 }
    ) {
        this.sprite = new GameSprite(`${UnitType[type].toLowerCase()}_${Variant[variant].toLowerCase()}`);
        this._pos = this.sprite._position;
        this.vel = { x: 0, y: 0 };
    }

    update() {
        this._pos.set(
            this._pos.x + this.vel.x,
            this._pos.y + this.vel.y
        );

        this.sprite.setVPos(this._pos);
    }

    destroy() {
        this._destroyed = true;
        this.sprite.destroy();
    }
}
