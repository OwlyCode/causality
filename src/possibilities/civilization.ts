import { World, Possibility, extractFeatureProperty } from '../core';
import { generateCivilizationName } from '../generator';
import { an, ucfirst } from '../utils';
import * as War from './war';

export class NewCiv extends Possibility {
    narrative = 'civilization';
    score = '10';
    canOccurOnce = false;
    outcomes = [WarStarts, MedievalProgression, Religion, AlienHarvest];
    randomPattern = {
        id: 'seed()',
        ellapsedTime: '[50 to 100]',
        government: 'pick(1): Empire, Republic, Kingdom, Dominion, Collective',
        biome: 'pick(1): plains, desert, mountains, forests'
    };

    isPossible(world: World): boolean {
        return world.getFeatures(['civilization']).length < 5 && ['ancient_times', 'medieval'].includes(world.getState('tech_level'));
    }

    alterWorld(world: World, values: {[key:string] : any}): void {
        const name = generateCivilizationName(values.id);
        world.addFact(values.ellapsedTime, `
            A new civilization, the <b>${name} ${values.government}</b> appeared. After a long travel,
            they established their capital city in the ${values.biome}.
        `);
        world.addFeature(['civilization', `name:${name} ${values.government}`, values.government]);
    }
}

export class WarStarts extends Possibility {
    narrative = 'civilization';
    canOccurOnce = false;
    randomPattern = {
        ellapsedTime: '[50 to 100]',
        participants: 'pick_feature(2): civilization',
        reason: 'pick(1): trade dispute, border dispute, discovered conspiracy'
    };
    outcomes = Object.values(War);

    computeScore(world: World): number {
        if (world.hasFeature(['sentient', 'warmonger'])) {
            return 10;
        }
        if (world.hasFeature(['sentient', 'aggressive'])) {
            return 8;
        }
        if (world.hasFeature(['sentient', 'pacifist'])) {
            return 4;
        }
        if (world.hasFeature(['sentient', 'inoffensive'])) {
            return 2;
        }

        return 0;
    }

    isPossible(world: World): boolean {
        return world.getFeatures(['civilization']).length > 2;
    }

    alterWorld(world: World, values: {[key:string] : any}): void {
        const attackerName = extractFeatureProperty(values.participants[0], 'name');
        const defenderName = extractFeatureProperty(values.participants[1], 'name');

        world.setState('war_balance', 0);
        world.setState('war_battles', 0);
        world.setState('war_attacker', attackerName);
        world.setState('war_defender', defenderName);

        world.addFact(values.ellapsedTime, `A war errupted when the <b>${attackerName}</b> attacked the <b>${defenderName}</b> about a ${values.reason}.`);
        world.enterNarrative('war');
    }
}

export class MedievalProgression extends Possibility {
    narrative = 'civilization';
    score = '5';
    randomPattern = {
        ellapsedTime: '[1000 to 2000]',
        weapon: 'pick(1): swords, pikes, axes',
        rangedWeapon: 'pick(1): crossbows, bows, slings',
        mount: 'pick_feature(1): lifeform, walking, medium sized',
        world: 'pick(1): flat, round, a dream, nearing its end, an illusion',
        dominantCivilization: 'pick_feature(1): civilization',
    };
    outcomes = [ IndustrialProgression ];

    isPossible(world: World): boolean {
        return world.getState('tech_level') === 'ancient_times';
    }

    alterWorld(world: World, values: {[key:string] : any}): void {
        let mount = '';
        if (values.mount) {
            const mountName = extractFeatureProperty(values.mount, 'name');
            mount = `The <b>${mountName}</b> is used as a mount.`;
        } else {
            mount = 'They use wooden charriots as mount.';
        }

        const dominantCivilization = extractFeatureProperty(values.dominantCivilization, 'name');

        world.setState('tech_level', 'medieval');
        world.addFact(values.ellapsedTime, `
            The main world civilizations progressed to medieval age.
            They mainly use ${values.weapon} and ${values.rangedWeapon}. ${mount} Their philosophers all came
            to the conclusion that the world is ${values.world}. The <b>${dominantCivilization}</b> is the most powerful civilization.
        `);
    }
}

export class IndustrialProgression extends Possibility {
    narrative = 'civilization';
    score = '5';
    randomPattern = {
        ellapsedTime: '[200 to 800]',
        dominantCivilization: 'pick_feature(1): civilization',
        production: 'pick(1): coal, textile, canned food, luxury goods',
        breakthrough: 'pick(1): general relativity, nuclear fission, electromagnetism theory',
    };
    outcomes = [ ModernProgression ];

    isPossible(world: World): boolean {
        return world.getState('tech_level') === 'medieval';
    }

    alterWorld(world: World, values: {[key:string] : any}): void {
        const dominantCivilization = extractFeatureProperty(values.dominantCivilization, 'name');

        world.setState('tech_level', 'industrial');
        world.addFact(values.ellapsedTime, `
            The main world civilizations progressed to industrial age. ${values.production} factories have
            become common and scientists are proud of their latest discovery: the ${values.breakthrough}.
            The <b>${dominantCivilization}</b> is leading the world to a more civilized era.
        `);
    }
}

export class ModernProgression extends Possibility {
    narrative = 'civilization';
    score = '5';
    randomPattern = {
        ellapsedTime: '[100 to 200]',
        dominantCivilization: 'pick_feature(1): civilization',
        communications: 'pick(1): mobile phones, public terminals, home computers',
        problems: 'pick(1): pollution, fake news, inequality, poverty, increasing disasters frequency',
    };
    outcomes = [ FuturisticProgression ];

    isPossible(world: World): boolean {
        return world.getState('tech_level') === 'industrial';
    }

    alterWorld(world: World, values: {[key:string] : any}): void {
        const dominantCivilization = extractFeatureProperty(values.dominantCivilization, 'name');

        world.setState('tech_level', 'modern');
        world.addFact(values.ellapsedTime, `
            The main world civilizations progressed to modern age. People now frequently spend vast amount of
            time on ${values.communications}. ${ucfirst(values.problems)} has now become the #1 world issue.
            The <b>${dominantCivilization}</b> has the strongest economy and is dominating the world.
        `);
    }
}

export class FuturisticProgression extends Possibility {
    narrative = 'civilization';
    score = '5';
    randomPattern = {
        ellapsedTime: '[100 to 200]',
        dominantCivilization: 'pick_feature(1): civilization',
        transportation: 'pick(1): teleporter, flying cars, personal planes, underground tubes',
        powerSource: 'pick(1): nuclear fusion plants, vast solar panel fields, huge hydroelectric dams',
    };
    outcomes = [ DeepSpaceProgression ];

    isPossible(world: World): boolean {
        return world.getState('tech_level') === 'modern';
    }

    alterWorld(world: World, values: {[key:string] : any}): void {
        const dominantCivilization = extractFeatureProperty(values.dominantCivilization, 'name');

        world.setState('tech_level', 'futuristic');
        world.addFact(values.ellapsedTime, `
            The main world civilizations progressed to futuristic age. Most people can now travel all around the world
            using ${values.transportation}.
            Using its ${values.powerSource}, the <b>${dominantCivilization}</b> is the number one civilization as other
            world nations are struggling to find sustainable power sources.
        `);
    }
}

export class DeepSpaceProgression extends Possibility {
    narrative = 'civilization';
    score = '5';
    randomPattern = {
        ellapsedTime: '[100 to 200]',
        dominantCivilization: 'pick_feature(1): civilization',
        wonder: 'pick(1): space elevator, asteroid station, orbital shipyard, vast amount of high tech SSTO vehicles'
    };
    outcomes = [ SpaceEnd ];

    isPossible(world: World): boolean {
        return world.getState('tech_level') === 'futuristic';
    }

    alterWorld(world: World, values: {[key:string] : any}): void {
        const dominantCivilization = extractFeatureProperty(values.dominantCivilization, 'name');

        world.setState('tech_level', 'deep_space');
        world.addFact(values.ellapsedTime, `
            The main world civilizations progressed to a deep space technology level.
             The <b>${dominantCivilization}</b> built ${an(values.wonder)}, making it the most advanced civilization
             this planet has ever seen.
        `);
    }
}

export class Religion extends Possibility {
    narrative = 'civilization';
    score = '10';
    canOccurOnce = false;
    randomPattern = {
        ellapsedTime: '[50 to 100]',
        totem: 'pick_feature(1): lifeform',
        prayerTime: 'pick(1): at noon, at dusk, in the morning, at night',
        adjective: 'pick(1): Holy, Great, Sacred, Venerable',
        adopter: 'pick_feature(1): civilization',
    };

    isPossible(world: World): boolean {
        return (world.getFeatures(['religion']).length < 3) && (world.getFeatures(['sentient', 'agnostic']).length === 0);
    }

    alterWorld(world: World, values: {[key:string] : any}): void {
        const totemName = extractFeatureProperty(values.totem, 'name');
        const adopterName = extractFeatureProperty(values.adopter, 'name');

        const text = [
            `A new religion was founded around the cult of the <b>${totemName}</b>. Their followers gather ${values.prayerTime} to pray.
            It claims that the world was created by the ${values.adjective} <b>${totemName}</b>. It is quickly spreading among the population
            of the <b>${adopterName}</b>`,

            `A small sect based on the cult of the <b>${totemName}</b> growed into a religion. Their followers that once secretly gathered
            ${values.prayerTime} to pray are now actively preaching in the streets the glorious story of the ${values.adjective} <b>${totemName}</b>.
            It seems the majority of <b>${adopterName}</b> will adopt the newly founded religion.`,

            `A prophet that preached the cult of the ${values.adjective} <b>${totemName}</b> died. What once was a local belief has grown into a new religion.`,

            `Ancient writings about the cult of the ${values.adjective} <b>${totemName}</b> were discovered. Soon, people started to follow its sayings and a lot
            of temples are being built in every major city of the <b>${adopterName}</b>.`,
        ];

        world.addFact(values.ellapsedTime, world.getRandom().among(text));
        world.addFeature(['religion']);
    }
}

export class SpaceEnd extends Possibility {
    narrative = 'civilization';
    score = '1000';
    randomPattern = {
        ellapsedTime: '[50 to 100]',
    };

    isPossible(world: World): boolean {
        return world.getState('tech_level') === 'deep_space';
    }

    alterWorld(world: World, values: {[key:string] : any}): void {
        world.enterNarrative('end');
        world.addFact(values.ellapsedTime, `
            The world nations became so advanced that they turned their eyes to the star, launching massive amounts of colony
            ships in every direction. They made it to a point that even the destruction of their homeworld wouldn't mean the end.
        `);
    }
}

export class AlienHarvest extends Possibility {
    narrative = 'civilization';
    score = '2';
    randomPattern = {
        ellapsedTime: '[50 to 100]',
    };

    isPossible(world: World): boolean {
        return world.hasFeature(['life', 'alien']);
    }

    alterWorld(world: World, values: {[key:string] : any}): void {
        if (world.getState('tech_level') === 'futuristic') {
            world.addFact(values.ellapsedTime, 'The alien ship came back and attempted to harvest the planet.');
        } else {
            world.enterNarrative('end');
            world.addFact(values.ellapsedTime, 'The alien ship came back and harvested the planet.');
        }
    }
}
