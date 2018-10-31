/* tslint:disable:max-classes-per-file */
import Possibility from "../core/Possibility";
import { extractFeatureProperty } from "../core/Utils";
import { an } from "../core/Utils";
import World from "../core/World";
import { generateAnimalName } from "../generators/animal";

class NewLifeform extends Possibility {
    public readonly narrative = "evolution";
    public readonly canOccurOnce = false;
    public readonly score = "10";
    public readonly randomPattern = {
        ellapsedTime: "[100000000 to 1000000000]",
        lifeCycle: "pick(1): diurnal, nocturnal",
        locomotion: "pick(1): swimming, walking, flying",
        size: "pick(1): tiny, small, medium sized, big, huge",
        skin: "pick(1): feathery, hairy, scaly, bald",
    };

    public isPossible(world: World): boolean {
        return world.getFeatures(["lifeform"]).length < 6;
    }

    public alterWorld(world: World, values: {[key: string]: any}): World {
        const name = generateAnimalName(values.id, values.size, values.skin, values.lifeCycle, values.locomotion);

        return world
            .addFact(values.ellapsedTime, `
                The <b>${name}</b>, ${an(values.size)} ${values.locomotion} lifeform appeared.
                It is notable for its ${values.skin} enveloppe, with a mostly ${values.lifeCycle} activity.
            `)
            .addFeature([
                "lifeform", "tier1", `name:${name}`, values.locomotion,
                values.lifeCycle, values.skin, values.size, values.id,
            ]);
    }
}

class SentientLifeform extends Possibility {
    public readonly narrative = "evolution";
    public readonly canOccurOnce = true;
    public readonly score = "1";
    public readonly randomPattern = {
        aggressivity: "pick(1): warmonger, aggressive, pacifist, inoffensive",
        biome: "pick(1): desert, forest, plains",
        ellapsedTime: "[500000 to 1000000]",
        faith: "pick(1): zealous, devout, doubtful, agnostic",
        size: "[15 to 25]",
        special: "pick(1): strength, generosity, hardworking mindset, traditions",
        traits: "pick(3): intelligent, nimble, strong, generous, hardworkers, devious",
        type: "pick(1): mammal, insect, reptile",
    };

    public isPossible(world: World): boolean {
        return world.getFeatures(["lifeform"]).length > 5 && world.getFeatures(["lifeform", "walking"]).length > 0;
    }

    public alterWorld(world: World, values: {[key: string]: any}): World {
        return world
            .addFact(values.ellapsedTime, `
                A sentient specy emerged from the wild. They are ${values.type}s of approximatively
                ${values.size / 10}m at adult stage. Their tribes are scattered across the ${values.biome},
                which is their favorite habitat. They tend to view religion in ${an(values.faith)} way
                and to solve conflits in ${an(values.aggressivity)} manner and are notable for their ${values.special}.
            `)
            .addFeature(["sentient", values.faith, values.aggressivity, values.special])
            .enterNarrative("civilization")
            .setState("tech_level", "ancient_times");
    }
}

class AsteroidImpact extends Possibility {
    public readonly narrative = "evolution";
    public readonly score = "2";
    public readonly randomPattern = {
        ellapsedTime: "[0 to 1000000]",
    };

    public isPossible(world: World): boolean {
        return world.hasFeature(["lifeform"]);
    }

    public alterWorld(world: World, values: {[key: string]: any}): World {
        const lifeforms = world.getFeatures(["lifeform"]);
        const extinctLifeform = world.random.among(lifeforms);
        const name = extractFeatureProperty(extinctLifeform, "name");

        return world
            .addFact(values.ellapsedTime, `
                An asteroid crashed. Following huge changes in its ecosystem,
                the <b>${name}</b> went extinct.`)
            .removeFeature(extinctLifeform);
    }
}

const possibilities = {
    AsteroidImpact,
    NewLifeform,
    SentientLifeform,
};

export default possibilities;
