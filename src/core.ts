import Random from './random';
import { parseExpression } from './parser';
import { uniqWith } from 'lodash';
import Fact from './core/fact';
import DebugEntry from './core/debug-entry';
import World from './core/world';

export function extractFeatureProperty(feature: string[], property: string) {
    for(const item of feature) {
        if (item.startsWith(`${property}:`)) {
            return item.split(':')[1];
        }
    }

    return null;
}

export class Generator {
    constructor() {
    }

    generate (world: World): World {
        let newWorld = world;

        const weightTable = [];
        let weight = 0;

        for (const possibility of newWorld.availablePossibilities) {
            weight += possibility.score !== null ? parseExpression(possibility.score, newWorld) : possibility.computeScore(newWorld);
            weightTable.push({ possibility, weight });
        }


        const randomWeight = newWorld.random.between(0, weight);
        console.log(weightTable, randomWeight);
        let winningPossibility = null;

        for (const item of weightTable) {
            if (randomWeight < item.weight) {
                winningPossibility = item.possibility;
                break;
            }
        }

        if (!winningPossibility) {
            return newWorld;
        }

        const innerDescription: {[key:string] : string} = winningPossibility.randomPattern;
        const values: {[key:string] : any} = {};

        for (const varName in innerDescription) {
            values[varName] = parseExpression(innerDescription[varName], newWorld);
            newWorld = newWorld.addDebugEntry(`Set ${varName} to ${JSON.stringify(values[varName])}`);
        }

        newWorld = winningPossibility.alterWorld(newWorld, values);

        return newWorld;
    }
}

export class Possibility {
    public readonly narrative: string | null = null;
    public readonly canOccurOnce: boolean = true;
    public readonly randomPattern: {[key:string] : string} = {};
    public readonly outcomes: any[] = [];
    public readonly score: null | string = null;

    isPossible(world: World): boolean {
        return true;
    }

    computeScore(world: World): number {
        return 0;
    }

    alterWorld(world: World, values: {[key:string] : any}): World {
        return world;
    }
}
