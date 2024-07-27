import { UnitType, Variant } from "./classes";

export interface Unit {
    readonly health: number;
    readonly attack: number;
    readonly cooldown: number; // <- ms
    readonly speed: number;
}

export const SCHEMA: Readonly<Record<UnitType, Readonly<Record<Variant, Unit>>>> = Object.freeze({
    [UnitType.Tank]: {
        [Variant.Mini]: {
            health: 200,
            attack: 75,
            cooldown: 1000,
            speed: 25
        },
        [Variant.Normal]: {
            health: 265,
            attack: 80,
            cooldown: 1,
            speed: 15
        },
        [Variant.Super]: {
            health: 350,
            attack: 85,
            cooldown: 2000,
            speed: 10
        }
    },
    [UnitType.Archer]: {
        [Variant.Mini]: {
            health: 125,
            attack: 50,
            cooldown: 1000,
            speed: 35
        },
        [Variant.Normal]: {
            health: 150,
            attack: 75,
            cooldown: 1333,
            speed: 30
        },
        [Variant.Super]: {
            health: 175,
            attack: 110,
            cooldown: 2000,
            speed: 30
        }
    },
    [UnitType.Assassin]: {
        [Variant.Mini]: {
            health: 75,
            attack: 25,
            cooldown: 400,
            speed: 40
        },
        [Variant.Normal]: {
            health: 85,
            attack: 40,
            cooldown: 250,
            speed: 45
        },
        [Variant.Super]: {
            health: 100,
            attack: 50,
            cooldown: 250,
            speed: 50
        }
    }
});
