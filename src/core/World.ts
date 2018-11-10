import DebugEntry from "./DebugEntry";
import Fact from "./Fact";
import Possibility from "./Possibility";

export default class World {
    public readonly seed: string;
    public readonly timeline: Array<Fact|DebugEntry>;
    public readonly state: {[key: string]: any};
    public readonly narrative: string | null;
    public readonly features: string[][];
    public readonly age: number;
    public readonly possibilities: {[key: string]: typeof Possibility};
    public readonly final: boolean;
    public readonly lastPossibility: Possibility;
    public readonly lastWorld: World;
    public readonly lastValues: {[key: string]: any};
    public readonly manuallyAltered: boolean;

    constructor(source: any) {
        this.timeline = source.timeline || [];
        this.possibilities = source.possibilities || [];
        this.state = source.state || {};
        this.features = source.features || [];
        this.narrative = source.narrative || null;
        this.age = source.age || 0;
        this.final = source.final || false;
        this.seed = source.seed || "";
        this.lastPossibility = source.lastPossibility || null;
        this.lastValues = source.lastValues || {};
        this.lastWorld = source.lastWorld || {};
        this.manuallyAltered = source.manuallyAltered || false;
    }

    public reboot(seed: string): World {
        return this.mutate({
            age: 0,
            features: [],
            final: false,
            lastPossibility: null,
            lastValues: {},
            manuallyAltered: false,
            narrative: "the_creation",
            seed,
            state: {},
            timeline: [],
        });
    }

    public addPossibilities(possibilities: {[key: string]: typeof Possibility}): World {
        return this.mutate({
            possibilities: Object.assign({}, this.possibilities, possibilities),
        });
    }

    get availablePossibilities(): Possibility[] {
        if (this.final) {
            return [];
        }

        let possibilities = Object.keys(this.possibilities).map((key) => {
            return new this.possibilities[key](key);
        });

        if (this.narrative) {
            possibilities = possibilities.filter((possibility) => possibility.narrative === this.narrative);
        } else {
            possibilities = possibilities.filter((possibility) => possibility.narrative === null);
        }

        possibilities = possibilities.filter((possibility) => possibility.isPossible(this));

        return possibilities;
    }

    public addFact(ellapsedYears: number, content: string): World {
        const age = this.age + ellapsedYears;
        const timeline: Array<Fact|DebugEntry> = this.timeline.slice(0);
        timeline.push(new Fact(String(this.timeline.length), content, this.age, this));

        return this.mutate({ age, timeline });
    }

    public addDebugEntry(content: string): World {
        const timeline: Array<Fact|DebugEntry> = this.timeline.slice(0);
        timeline.push(new DebugEntry(String(this.timeline.length), content));

        return this.mutate({ timeline });
    }

    public setState(name: string, value: any): World {
        this.addDebugEntry(`Set state ${name} to ${value}`);
        const state = Object.assign({}, this.state, {
            [name]: value,
        });

        return this.mutate({ state });
    }

    public addFeature(feature: string[]): World {
        this.addDebugEntry(`Added feature ${JSON.stringify(feature)}`);
        const features = this.features.slice(0);
        features.push(feature);

        return this.mutate({ features });
    }

    public getFeatures(selector: string[]) {
        const result = [];

        for (const feature of this.features) {
            if (selector.every((item) => feature.includes(item))) {
                result.push(feature);
            }
        }

        return result;
    }

    public removeFeature(selector: string[]): World {
        this.addDebugEntry(`Removed features matching ${JSON.stringify(selector)}`);

        const features = this.features.filter((feature) => !selector.every((item) => feature.includes(item)));

        return this.mutate({ features });
    }

    public hasFeature(selector: string[]) {
        for (const feature of this.features) {
            if (selector.every((item) => feature.includes(item))) {
                return true;
            }
        }

        return false;
    }

    public enterNarrative(narrative: string): World {
        this.addDebugEntry(`Entered narrative "${narrative}"`);

        return this.mutate({ narrative });
    }

    public leaveNarrative(): World {
        this.addDebugEntry(`Left narrative "${this.narrative}"`);

        return this.mutate({ narrative: null });
    }

    public conclude(): World {
        return this.mutate({ final: true });
    }

    public manuallyAlter(manuallyAltered: boolean = true): World {
        return this.mutate({ manuallyAltered });
    }

    public setLastPossibility(lastPossibility: Possibility): World {
        return this.mutate({ lastPossibility });
    }

    public setLastValues(lastValues: {[key: string]: any}): World {
        return this.mutate({ lastValues });
    }

    public setLastWorld(lastWorld: {[key: string]: any}): World {
        return this.mutate({ lastWorld });
    }

    public getSource(): any {
        return {
            age: this.age,
            features: this.features,
            final: this.final,
            lastPossibility: this.lastPossibility,
            lastValues: this.lastValues,
            lastWorld: this.lastWorld,
            manuallyAltered: this.manuallyAltered,
            narrative: this.narrative,
            possibilities: this.possibilities,
            seed: this.seed,
            state: this.state,
            timeline: this.timeline,
        };
    }

    public mutate(override: any): World {
        return new World(Object.assign({}, this.getSource(), override));
    }
}
