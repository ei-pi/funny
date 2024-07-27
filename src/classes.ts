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
    build(): { readonly type: T, readonly variant: V; };
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

        return {
            type,
            variant
        };
    };

    return obj as Builder<UnitType, Variant.Normal>;
};
