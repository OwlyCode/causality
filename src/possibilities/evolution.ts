import { World, Possibility, Fact, extractFeatureProperty } from '../core';
import { generateAnimalName } from '../generator';
import { an } from '../utils';
import { NewCiv } from './civilization';

export class NewLifeform extends Possibility {
    narrative = 'evolution';
    canOccurOnce = false;
    score = '10';
    randomPattern = {
        ellapsedTime: '[100000000 to 1000000000]',
        locomotion: 'pick(1): swimming, walking, flying',
        lifeCycle: 'pick(1): diurnal, nocturnal',
        skin: 'pick(1): feathery, hairy, scaly, bald',
        size: 'pick(1): tiny, small, medium sized, big, huge',
    };
    outcomes = [ SentientLifeform, AsteroidImpact ];

    isPossible(world: World): boolean {
        return world.getFeatures(['lifeform']).length < 6;
    }

    alterWorld(world: World, values: {[key:string] : any}): void {
        const name = generateAnimalName(values.id, values.size, values.skin, values.lifeCycle, values.locomotion);

        world.addFact(values.ellapsedTime, `
            The <b>${name}</b>, ${an(values.size)} ${values.locomotion} lifeform appeared.
            It is notable for its ${values.skin} enveloppe, with a mostly ${values.lifeCycle} activity.
        `);
        world.addFeature(['lifeform', 'tier1', `name:${name}`, values.locomotion, values.lifeCycle, values.skin, values.size, values.id]);
    }
}

export class SentientLifeform extends Possibility {
    narrative = 'evolution';
    canOccurOnce = true;
    score = '1';
    randomPattern = {
        size: '[15 to 25]',
        type: 'pick(1): mammal, insect, reptile',
        biome: 'pick(1): desert, forest, plains',
        traits: 'pick(3): intelligent, nimble, strong, generous, hardworkers, devious',
        faith: 'pick(1): zealous, devout, doubtful, agnostic',
        aggressivity: 'pick(1): warmonger, aggressive, pacifist, inoffensive',
        special: 'pick(1): strength, generosity, hardworking mindset, traditions',
        ellapsedTime: '[500000 to 1000000]',
    };
    outcomes = [ NewCiv ];

    isPossible(world: World): boolean {
        return world.getFeatures(['lifeform']).length > 5 && world.getFeatures(['lifeform', 'walking']).length > 0;
    }

    alterWorld(world: World, values: {[key:string] : any}): void {
        world.addFact(values.ellapsedTime, `
            A sentient specy emerged from the wild. They are ${values.type}s of approximatively ${values.size/10}m at adult stage.
            Their tribes are scattered across the ${values.biome}, which is their favorite habitat.
            They tend to view religion in ${an(values.faith)} way and to solve conflits in ${an(values.aggressivity)} manner
            and are notable for their ${values.special}.
        `);
        world.addFeature(['sentient', values.faith, values.aggressivity, values.special]);
        world.leaveNarrative();
        world.enterNarrative('civilization');
        world.setState('tech_level', 'ancient_times');
    }
}

export class AsteroidImpact extends Possibility {
    narrative = 'evolution';
    score = '2';
    randomPattern = {
        ellapsedTime: '[0 to 1000000]',
    };
    outcomes = [ NewLifeform ];

    isPossible(world: World): boolean {
        return world.hasFeature(['lifeform']);
    }

    alterWorld(world: World, values: {[key:string] : any}): void {
        const lifeforms = world.getFeatures(['lifeform']);
        const extinctLifeform = world.getRandom().among(lifeforms);
        const name = extractFeatureProperty(extinctLifeform, 'name');

        world.addFact(values.ellapsedTime, `An asteroid crashed. Following huge changes in its ecosystem, the <b>${name}</b> went extinct.`);
        world.removeFeature(extinctLifeform);
    }
}
