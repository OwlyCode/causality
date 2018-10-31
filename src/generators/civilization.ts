import Random from "../core/Random";
import { ucfirst } from "../core/Utils";

export function generateCivilizationName(seed: string): string {
    const r = new Random(seed);
    let name = "";

    for (let i = 0; i < 3; i++) {
        name += r.among("bcdfghjklmnpqrstvwxz");
        name += r.among(["a", "e", "i", "o", "u", "au", "oo", "au"]);
    }

    return ucfirst(name);
}
