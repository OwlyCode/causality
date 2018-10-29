import World from './core/world';

export function parseExpression(expr: string, world: World): any {
    const trimed = expr.trim();
    const random = world.random;

    if (trimed.indexOf('[') === 0) {
        const start = trimed.indexOf('[') + 1;
        const end = trimed.indexOf(']');
        const part = trimed.substring(start, end);
        const args = part.split(' to ').map(s => Number(s));

        return random.between(args[0], args[1]);
    } else if (trimed.startsWith('pick(')) {
        const argsStart = trimed.indexOf('(') + 1;
        const argsEnd = trimed.indexOf(')');
        const argsValue = parseExpression(trimed.substring(argsStart, argsEnd), world);
        let resultsValue = trimed.substring(argsEnd + 2).split(',').map(s => s.trim());
        const results = [];

        for (let i=0; i < argsValue; i++) {
            const result = random.among(resultsValue);
            resultsValue = resultsValue.filter(value => value !== result);
            results.push(result);
        }

        return argsValue === 1 ? results[0] : results;
    } else if (trimed.startsWith('pick_feature(')) {
        const argsStart = trimed.indexOf('(') + 1;
        const argsEnd = trimed.indexOf(')');
        const argsValue = parseExpression(trimed.substring(argsStart, argsEnd), world);
        const selector = trimed.substring(argsEnd + 2).split(',').map(s => s.trim());
        let features = world.getFeatures(selector);
        const results = [];

        for (let i=0; i < argsValue; i++) {
            const result = random.among(features);
            features = features.filter(value => value !== result);
            results.push(result);
        }

        return argsValue === 1 ? results[0] : results;
    } else if (trimed === 'seed()') {
        return random.generateSeed();
    } else {
        return !isNaN(Number(expr)) ? Number(expr) : expr;
    }
}
