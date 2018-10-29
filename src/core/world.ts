import Fact from './fact';
import DebugEntry from './debug-entry';
import Random from '../random';
import { Possibility } from '../core';

export default class World {
    public readonly seed: string;
    public readonly timeline: Array<Fact|DebugEntry>;
    public readonly state: {[key:string] : any};
    public readonly narrative: string | null;
    public readonly features: string[][];
    public readonly age: number;
    public readonly random: Random;
    public readonly possibilities: {[key:string] : typeof Possibility};
    public readonly final: boolean;

    constructor(source: any) {
        this.timeline = source.timeline || [];
        this.possibilities = source.possibilities || [];
        this.state = source.state || {};
        this.features = source.features || [];
        this.narrative = source.narrative || null;
        this.age = source.age || 0;
        this.final = source.final || false;
        this.seed = source.seed || '';

        this.random = new Random(this.seed);
    }

    addPossibilities(possibilities: {[key:string] : typeof Possibility}): World {
        return this.mutate({
            possibilities: Object.assign({}, this.possibilities, possibilities),
        });
    }

    get availablePossibilities(): Possibility[] {
        if (this.final) {
            return [];
        }

        let possibilities = Object.values(this.possibilities).map(n => new n());

        if (this.narrative) {
            possibilities = possibilities.filter(possibility => possibility.narrative === this.narrative);
        } else {
            possibilities = possibilities.filter(possibility => possibility.narrative === null);
        }

        possibilities = possibilities.filter(possibility => possibility.isPossible(this));

        console.log(possibilities);

        return possibilities;
    }

    addFact(ellapsedYears: number, content: string): World {
        const age = this.age + ellapsedYears;
        const timeline: Array<Fact|DebugEntry> = this.timeline.slice(0);
        timeline.push(new Fact(this.random.generateSeed(), content, this.age));

        return this.mutate({ age, timeline });
    }

    addDebugEntry(content: string): World {
        const timeline: Array<Fact|DebugEntry> = this.timeline.slice(0);
        timeline.push(new DebugEntry(this.random.generateSeed(), content));

        return this.mutate({ timeline });
    }

    setState(name: string, value: any): World {
        this.addDebugEntry(`Set state ${name} to ${value}`);
        const state = Object.assign({}, this.state, {
            [name]: value,
        });

        return this.mutate({ state });
    }

    addFeature(feature: string[]): World {
        this.addDebugEntry(`Added feature ${JSON.stringify(feature)}`);
        console.log(this.features);
        const features = this.features.slice(0);
        console.log(features);
        features.push(feature);

        return this.mutate({ features });
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

    removeFeature(selector: string[]): World {
        this.addDebugEntry(`Removed features matching ${JSON.stringify(selector)}`);

        const features = this.features.filter(feature => !selector.every(item => feature.includes(item)));

        return this.mutate({ features });
    }

    hasFeature(selector: string[]) {
        for (const feature of this.features) {
            if (selector.every(item => feature.includes(item))) {
                return true;
            }
        }

        return false;
    }

    enterNarrative(narrative: string): World {
        this.addDebugEntry(`Entered narrative "${narrative}"`);

        return this.mutate({ narrative });
    }

    leaveNarrative(): World {
        this.addDebugEntry(`Left narrative "${this.narrative}"`);

        return this.mutate({ narrative: null });
    }

    conclude(): World {
        return this.mutate({ final: true });
    }

    getSource(): any {
        return {
            seed: this.random.generateSeed(),
            timeline: this.timeline,
            state: this.state,
            features: this.features,
            narrative: this.narrative,
            age: this.age,
            possibilities: this.possibilities,
            final: this.final,
        }
    }

    mutate(override: any): World {
        return new World(Object.assign({}, this.getSource(), override));
    }
}
