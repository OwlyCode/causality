import Random from "./Random";
import World from "./World";

export default class Parser {
    public static parseExpression(rootExpr: string, world: World): any {
        // They use as mount | nullable =>
        const root = rootExpr.trim().split("=>");
        const expr = (root[1] || root[0]).trim();
        const random = new Random(world.seed + expr);

        if (expr.indexOf("[") === 0) {
            const start = expr.indexOf("[") + 1;
            const end = expr.indexOf("]");
            const part = expr.substring(start, end);
            const args = part.split(" to ").map((s) => Number(s));

            return random.between(args[0], args[1]);
        } else if (expr.startsWith("pick(")) {
            const argsStart = expr.indexOf("(") + 1;
            const argsEnd = expr.indexOf(")");
            const argsValue = Parser.parseExpression(expr.substring(argsStart, argsEnd), world);
            let resultsValue = expr.substring(argsEnd + 2).split(",").map((s) => s.trim());
            const results = [];

            for (let i = 0; i < argsValue; i++) {
                const result = random.among(resultsValue);
                resultsValue = resultsValue.filter((value) => value !== result);
                results.push(result);
            }

            return argsValue === 1 ? results[0] : results;
        } else if (expr.startsWith("pick_feature(")) {
            const argsStart = expr.indexOf("(") + 1;
            const argsEnd = expr.indexOf(")");
            const argsValue = Parser.parseExpression(expr.substring(argsStart, argsEnd), world);
            const selector = expr.substring(argsEnd + 2).split(",").map((s) => s.trim());
            let features = world.getFeatures(selector);
            const results = [];

            for (let i = 0; i < argsValue; i++) {
                const result = random.among(features);
                features = features.filter((value) => value !== result);
                results.push(result);
            }

            return argsValue === 1 ? results[0] : results;
        } else if (expr === "seed()") {
            return random.generateSeed();
        } else {
            return !isNaN(Number(expr)) ? Number(expr) : expr;
        }
    }

    public static parsePickArgs(expr: string): any {
        const trimed = expr.trim();

        if (trimed.indexOf("[") === 0) {
            const start = trimed.indexOf("[") + 1;
            const end = trimed.indexOf("]");
            const part = trimed.substring(start, end);
            const args = part.split(" to ").map((s) => Number(s));

            return {min: args[0], max: args[1]};
        }

        if (!isNaN(Number(expr))) {
            return Number(expr);
        }

        throw new Error("Unrecognized arg.");
    }

    public static validateValue(value: any, rootExpr: string): boolean {
        const trimed = rootExpr.trim();

        const root = rootExpr.split("=>");
        const meta = root[0].trim().split("|");
        const options = (meta[1] || "").trim().split(",");
        const expr = (root[1] || root[0]).trim();

        if (options.includes("nullable") && value === null) {
            return true;
        }

        if (trimed.indexOf("[") === 0) {
            const start = trimed.indexOf("[") + 1;
            const end = trimed.indexOf("]");
            const part = trimed.substring(start, end);
            const args = part.split(" to ").map((s) => Number(s));

            return value >= args[0] && value <= args[1];
        } else if (trimed.startsWith("pick(")) {
            const argsStart = trimed.indexOf("(") + 1;
            const argsEnd = trimed.indexOf(")");
            const argsValue = Parser.parsePickArgs(trimed.substring(argsStart, argsEnd));

            if (typeof argsValue === "number") { // exact amount
                if (Array.isArray(value)) {
                    return value.length === argsValue;
                } else {
                    return argsValue === 1 && !!value;
                }
            } else { // range
                if (Array.isArray(value)) {
                    return value.length >= argsValue.min && value.length <= argsValue.max;
                } else {
                     return 1 >= argsValue.min;
                }
            }

            throw Error("Unhandled validation case");
        } else if (trimed.startsWith("pick_feature(")) {
            const argsStart = trimed.indexOf("(") + 1;
            const argsEnd = trimed.indexOf(")");
            const argsValue = Parser.parsePickArgs(trimed.substring(argsStart, argsEnd));

            if (typeof argsValue === "number") { // exact amount
                if (Array.isArray(value)) {
                    return value.length === argsValue;
                } else {
                    return argsValue === 1 && !!value;
                }
            } else { // range
                if (Array.isArray(value)) {
                    return value.length >= argsValue.min && value.length <= argsValue.max;
                } else {
                     return 1 >= argsValue.min;
                }
            }
        }

        return true;
    }
}
