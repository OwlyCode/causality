import seedrandom from 'seedrandom';

export default class Random {
    private rng: seedrandom.prng;

    constructor(seed?: string) {
        this.rng = seedrandom(seed);
    }

    between (min: number, max: number): number {
        return min + (Math.abs(this.rng.int32()) % (max - min + 1));
    }

    among (choices: any[] | string) {
        const values = Object.values(choices);

        return values[this.between(0, values.length - 1)];
    }

    generateSeed() {
        let seed = '';

        for(let i = 0; i < 16; i++) {
            seed += this.among("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789");
        }

        return seed;
    }
}
