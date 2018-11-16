import Feature from "../core/Feature";

export function pickToSelect(value: any, isMulti: boolean): any {
    if (isMulti) {
        if (Array.isArray(value)) {
            return value.map((v) => ({ label: v, value: v }));
        } else if (value) {
            return [{ label: value, value }];
        }

        return [];
    }

    if (Array.isArray(value)) {
        throw new Error("Unexpected array on non multiple select.");
    } else if (value) {
        return { label: value, value };
    }

    return { label: "none", value: null };
}

export function featureToSelect(value: any, isMulti: boolean): any {
    if (isMulti) {
        if (Array.isArray(value)) {
            return value.map((v: Feature) => ({ label: v.name, value: v }));
        } else if (value) {
            return [{ label: value.name, value }];
        }

        return [];
    }

    if (Array.isArray(value)) {
        throw new Error("Unexpected array on non multiple select.");
    } else if (value) {
        return { label: value.name, value };
    }

    return { label: "none", value: null };
}

export function selectToValue(value: any): any {
    if (value === undefined || value === null) {
        return null;
    }

    if (value.length === 0) {
        return null;
    }

    if (value.value !== undefined) {
        return value.value;
    }

    if (value.length === 1) {
        return value[0].value;
    }

    return value.map((v: any) => v.value);
}
