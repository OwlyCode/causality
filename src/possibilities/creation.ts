import { World, Possibility, Fact } from '../core';
import { an } from '../utils';
import { NewLifeform } from './evolution';

export class UniverseBirth extends Possibility {
    score = '10';
    outcomes = [ GalaxyBirth ];

    alterWorld(world: World, values: {[key:string] : any}): void {
        world.addFact(0, 'The universe is born.');
        world.enterNarrative('the_creation');
    }
}

export class GalaxyBirth extends Possibility {
    score = '10';
    outcomes = [ PlanetBirth ];

    randomPattern = {
        ellapsedTime: '[1000000000 to 2000000000]',
    };

    alterWorld(world: World, values: {[key:string] : any}): void {
        world.addFact(values.ellapsedTime, 'The galaxy formed.');
    }
}

export class PlanetBirth extends Possibility {
    score = '10';
    outcomes = [ PlanetCreation, MassiveImpact ];

    randomPattern = {
        ellapsedTime: '[2000000000 to 10000000000]',
    };

    alterWorld(world: World, values: {[key:string] : any}): void {
        world.addFact(values.ellapsedTime, 'The protoplanet formed.');
    }
}

class MassiveImpact extends Possibility {
    narrative = 'the_creation';
    score = '10';
    randomPattern = {
        moonsColors: 'pick([1 to 3]): blue, red, green, white, dark gray, yellow, orange',
        ellapsedTime: '[1000000 to 10000000000]',
    };

    alterWorld(world: World, values: {[key:string] : any}): void {
        if (typeof values.moonsColors === 'string') {
            world.addFact(values.ellapsedTime, `
                A massive impact occured with a protoplanet, ejecting matter into outer space.
                The ejected matter slowly aggregated to form ${an(values.moonsColors)} moon.
            `);
            const feature = ['moon', 'first', 'only', values.moonsColors[0]];

            return;
        }

        const moons = [];
        for (let i=0; i < values.moonsColors.length; i++) {
            const positions = ['first', 'second', 'third'];
            const feature = ['moon', positions[i], values.moonsColors[i]];

            moons.push(`<p>The ${positions[i]} moon is ${values.moonsColors[i]}.</p>`);
            world.addFeature(feature);
        }

        world.addFact(values.ellapsedTime, `
            A massive impact occured with a protoplanet, ejecting matter into outer space.
            The ejected matter slowly aggregated to form ${values.moonsColors.length} moons.
            ${moons.join(' ')}
        `);
    }
}

class PlanetCreation extends Possibility {
    narrative = 'the_creation';
    score = '10';
    outcomes = [AlienIntervention, ChemicalInterraction, Panspermia];

    randomPattern = {
        atmosphereMainGaz: 'pick(1): nitrogen, helium, carbon dioxyde',
        atmosphereThickness: 'pick(1): thick, thin',
        waterCoverage: '[40 to 90]',
        ellapsedTime: '[1000000000 to 3000000000]',
    };

    alterWorld(world: World, values: {[key:string] : any}): void {
        world.addFact(values.ellapsedTime, `
            The planet slowy cools into a small telluric world. What once was huge lakes of lava is now a dark solid crust.
            It is covered with ${values.waterCoverage}% of water with a
            ${values.atmosphereThickness} atmosphere mainly constituted of
            ${values.atmosphereMainGaz} with some other rare gazes.
        `);
        world.leaveNarrative();
    }
}

export class Panspermia extends Possibility {
    score = '3';
    randomPattern = {
        ellapsedTime: '[1000000000 to 2000000000]',
    };
    outcomes = [NewLifeform];

    alterWorld(world: World, values: {[key:string] : any}): void {
        world.enterNarrative('evolution');
        world.addFact(values.ellapsedTime, 'A comet with some bacteria crashed.');
        world.addFeature(['life', 'comet']);
    }
}

export class AlienIntervention extends Possibility {
    score = '3';
    randomPattern = {
        ellapsedTime: '[1000000000 to 2000000000]',
    };
    outcomes = [NewLifeform];

    alterWorld(world: World, values: {[key:string] : any}): void {
        world.enterNarrative('evolution');
        world.addFact(values.ellapsedTime, 'An alien ship deposited some bacteria.');
        world.addFeature(['life', 'alien']);
    }
}

export class ChemicalInterraction extends Possibility {
    score = '3';
    randomPattern = {
        ellapsedTime: '[1000000000 to 2000000000]',
    };
    outcomes = [NewLifeform];

    alterWorld(world: World, values: {[key:string] : any}): void {
        world.enterNarrative('evolution');
        world.addFact(values.ellapsedTime, 'Following some random chemical interractions, life appeared.');
        world.addFeature(['life', 'chemical']);
    }
}
