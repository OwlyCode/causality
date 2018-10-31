import World from "./World";

export default class Possibility {
    public readonly narrative: string | null = null;
    public readonly canOccurOnce: boolean = true;
    public readonly randomPattern: {[key: string]: string} = {};
    public readonly outcomes: any[] = [];
    public readonly score: null | string = null;

    public isPossible(world: World): boolean {
        return true;
    }

    public computeScore(world: World): number {
        return 0;
    }

    public alterWorld(world: World, values: {[key: string]: any}): World {
        return world;
    }
}
