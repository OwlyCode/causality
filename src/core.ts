import Random from './random';
import { parseExpression } from './parser';
import { uniqWith } from 'lodash';

export function extractFeatureProperty(feature: string[], property: string) {
    for(const item of feature) {
        if (item.startsWith(`${property}:`)) {
            return item.split(':')[1];
        }
    }

    return null;
}

export class Fact {
    private content: string;
    private year: number;
    private id: string;

    constructor(id: string, content: string, year: number) {
        this.id = id;
        this.content = content;
        this.year = year;
    }

    getId(): string {
        return this.id;
    }

    getContent(): string {
        return this.content;
    }

    getYear(): number {
        return this.year;
    }
}

export class DebugEntry {
    private content: string;
    private id: string;

    constructor(id: string, content: string) {
        this.id = id;
        this.content = content;
    }

    getId(): string {
        return this.id;
    }

    getContent(): string {
        return this.content;
    }
}

export class World {
    private timeline: Array<Fact|DebugEntry>;
    private state: {[key:string] : any};
    private narrative: string | null;
    private features: string[][];
    private age: number;
    private seed: string;
    private random: Random;

    constructor(seed: string) {
        this.timeline = [];
        this.state = {};
        this.features = [];
        this.narrative = null;
        this.age = 0;
        this.seed = seed;
        this.random = new Random(seed);
    }

    getRandom(): Random {
        return this.random;
    }

    getAge(): number {
        return this.age;
    }

    addFact(ellapsedYears: number, content: string) {
        this.age += ellapsedYears;
        this.timeline.push(new Fact(this.random.generateSeed(), content, this.age));
    }

    addDebugEntry(content: string) {
        this.timeline.push(new DebugEntry(this.random.generateSeed(), content));
    }

    getTimeline(): Array<Fact|DebugEntry> {
        return this.timeline;
    }

    setState(name: string, value: any): void {
        this.addDebugEntry(`Set state ${name} to ${value}`);
        this.state[name] = value;
    }

    getState(name: string): any {
        return this.state[name];
    }

    addFeature(feature: string[]) {
        this.addDebugEntry(`Added feature ${JSON.stringify(feature)}`);

        this.features.push(feature);
    }

    getFeatures(selector: string[]) {
        const result = [];

        for (const feature of this.features) {
            if (selector.every(item => feature.includes(item))) {
                result.push(feature);
            }
        }

        return result;
    }

    removeFeature(selector: string[]) {
        this.addDebugEntry(`Removed features matching ${JSON.stringify(selector)}`);

        this.features = this.features.filter(feature => !selector.every(item => feature.includes(item)));
    }

    hasFeature(selector: string[]) {
        for (const feature of this.features) {
            if (selector.every(item => feature.includes(item))) {
                return true;
            }
        }

        return false;
    }

    enterNarrative(narrative: string) {
        this.addDebugEntry(`Entered narrative "${narrative}"`);

        this.narrative = narrative;
    }

    leaveNarrative() {
        this.addDebugEntry(`Left narrative "${this.narrative}"`);

        this.narrative = null;
    }

    getNarrative(): string | null {
        return this.narrative;
    }
}

export class Generator {
    private possibilities: Possibility[];
    private world: World;

    constructor(world: World, possibilities: Possibility[]) {
        this.possibilities = possibilities;
        this.world = world;
    }

    getNextEvent(): Generator|null {
        if (!this.possibilities.length) {
            return null;
        }

        const weightTable = [];
        let weight = 0;

        for (const possibility of this.possibilities) {
            weight += possibility.score !== null ? parseExpression(possibility.score, this.world) : possibility.computeScore(this.world);
            weightTable.push({ possibility, weight });
        }

        const randomWeight = this.world.getRandom().between(0, weight);
        let winningPossibility = this.possibilities[0];

        for (const item of weightTable) {
            if (randomWeight < item.weight) {
                winningPossibility = item.possibility;
                break;
            }
        }

        const innerDescription: {[key:string] : string} = winningPossibility.randomPattern;
        const values: {[key:string] : any} = {};

        for (const varName in innerDescription) {
            values[varName] = parseExpression(innerDescription[varName], this.world);
            this.world.addDebugEntry(`Set ${varName} to ${JSON.stringify(values[varName])}`);
        }

        winningPossibility.alterWorld(this.world, values);

        let possibilities = this.possibilities;
        const narrative = this.world.getNarrative();

        if (winningPossibility.canOccurOnce) {
            possibilities = possibilities.filter(possibility => possibility != winningPossibility);
        }

        if (narrative) {
            possibilities = possibilities.filter(possibility => possibility.narrative === narrative);
        } else {
            possibilities = possibilities.filter(possibility => possibility.narrative === null);
        }

        const outcomes = winningPossibility.outcomes.map(classType => new classType());

        const newPossibilities = uniqWith(possibilities.concat(...outcomes), (a, b) => {
            return a.constructor.name === b.constructor.name;
        });

        const possibles = newPossibilities.filter(possibility => possibility.isPossible(this.world));

        return new Generator(this.world, possibles);
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

    alterWorld(world: World, values: {[key:string] : any}): void {
    }
}
