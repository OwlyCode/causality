import Parser from "./Parser";
import Random from "./Random";
import World from "./World";

export default class Generator {
    public generate(world: World): World {
        let newWorld = world;

        const weightTable = [];
        let weight = 0;

        for (const possibility of newWorld.availablePossibilities) {
            const score = possibility.score !== null
                ? Parser.parseExpression(possibility.score, newWorld)
                : possibility.computeScore(newWorld);
            weight += score;
            weightTable.push({ possibility, score, weight });
        }

        const random = new Random(world.seed);
        const randomWeight = random.between(0, weight);
        let winningPossibility = null;

        for (const item of weightTable) {
            const score = Math.round(10000 * item.score / weight) / 100;
            newWorld = newWorld.addDebugEntry(`Probability of ${item.possibility.name} : ${score}%`);

            if ((randomWeight <= item.weight) && !winningPossibility) {
                winningPossibility = item.possibility;
            }
        }

        if (!winningPossibility) {
            newWorld = newWorld.addDebugEntry(`No possibility was selected.`);

            return newWorld;
        }

        newWorld = newWorld.addDebugEntry(`${winningPossibility.name} was selected.`);

        const innerDescription: {[key: string]: string} = winningPossibility.randomPattern;
        const values: {[key: string]: any} = {};

        for (const varName of Object.keys(innerDescription)) {
            values[varName] = Parser.parseExpression(innerDescription[varName], newWorld);
            newWorld = newWorld.addDebugEntry(`Set ${varName} to ${JSON.stringify(values[varName])}`);
        }

        newWorld = newWorld.setLastWorld(newWorld);
        newWorld = newWorld.setLastPossibility(winningPossibility);
        newWorld = newWorld.setLastValues(values);

        const nextSeedGen = new Random(btoa(newWorld.seed + JSON.stringify(values)));
        newWorld = newWorld.mutate({
            seed: nextSeedGen.generateSeed(),
        });

        newWorld = winningPossibility.alterWorld(newWorld, values);

        return newWorld;
    }
}
