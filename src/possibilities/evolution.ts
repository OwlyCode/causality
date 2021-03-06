/* tslint:disable:max-classes-per-file */
import Possibility from "../core/Possibility";
import { an } from "../core/Utils";
import World from "../core/World";
import { generateAnimalName } from "../generators/animal";

class NewLifeform extends Possibility {
    public readonly narrative = "evolution";
    public readonly score = "10";
    public readonly randomPattern = {
        ellapsedTime: "Ellapsed time in millions of years => [100 to 1000]",
        id: "Seed used for name generation => seed()",
        lifeCycle: "Period of activity of the lifeform => pick(1): diurnal, nocturnal",
        locomotion: "Way of moving of the lifeform => pick(1): swimming, walking, flying",
        size: "Size of the lifeform => pick(1): tiny, small, medium sized, big, huge",
        skin: "Skin of the lifeform => pick(1): feathery, hairy, scaly, bald",
    };

    public isPossible(world: World): boolean {
        return world.getFeatures(["lifeform"]).length < 6;
    }

    public alterWorld(world: World, values: {[key: string]: any}): World {
        const name = generateAnimalName(values.id, values.size, values.skin, values.lifeCycle, values.locomotion);

        return world
            .addFact(values.ellapsedTime * 1000000, `
                The <b>${name}</b>, ${an(values.size)} ${values.locomotion} lifeform appeared.
                It is notable for its ${values.skin} enveloppe, with a mostly ${values.lifeCycle} activity.
            `)
            .addFeature(name, [
                "lifeform", "tier1", values.locomotion,
                values.lifeCycle, values.skin, values.size, values.id,
            ]);
    }
}

class SentientLifeform extends Possibility {
    public readonly narrative = "evolution";
    public readonly score = "1";
    public readonly randomPattern = {
        aggressivity: "Natural aggressivity => pick(1): warmonger, aggressive, pacifist, inoffensive",
        biome: "Favorite biome => pick(1): desert, forest, plains",
        ellapsedTime: "Ellapsed time in thousands of years => [500 to 1000]",
        faith: "Attitude toward religion => pick(1): zealous, devout, doubtful, agnostic",
        size: "Size in decimeters => [15 to 25]",
        special: "Notable attribute => pick(1): strength, generosity, hardworking mindset, traditions",
        type: "Main archetype => pick(1): mammal, insect, reptile",
    };

    public isPossible(world: World): boolean {
        return world.getFeatures(["lifeform"]).length > 5 && world.getFeatures(["lifeform", "walking"]).length > 0;
    }

    public alterWorld(world: World, values: {[key: string]: any}): World {
        return world
            .addFact(values.ellapsedTime * 1000, `
                A sentient specy emerged from the wild. They are ${values.type}s of approximatively
                ${values.size / 10}m at adult stage. Their tribes are scattered across the ${values.biome},
                which is their favorite habitat. They tend to view religion in ${an(values.faith)} way
                and to solve conflits in ${an(values.aggressivity)} manner and are notable for their ${values.special}.
            `)
            .addFeature("sentient", ["sentient", values.faith, values.aggressivity, values.special])
            .enterNarrative("civilization")
            .setState("tech_level", "ancient_times");
    }
}

class AsteroidImpact extends Possibility {
    public readonly narrative = "evolution";
    public readonly score = "2";
    public readonly randomPattern = {
        ellapsedTime: "Ellapsed time in thousands of years => [0 to 1000]",
        extinctLifeform: "Lifeform that goes extinct => pick_feature(1): lifeform",
    };

    public isPossible(world: World): boolean {
        return world.hasFeature(["lifeform"]);
    }

    public alterWorld(world: World, values: {[key: string]: any}): World {
        const lifeforms = world.getFeatures(["lifeform"]);
        const name = values.extinctLifeform.name;

        return world
            .addFact(values.ellapsedTime * 1000, `
                An asteroid crashed. Following huge changes in its ecosystem,
                the <b>${name}</b> went extinct.`)
            .removeFeatureByName(values.extinctLifeform.name);
    }
}

const possibilities = {
    AsteroidImpact,
    NewLifeform,
    SentientLifeform,
};

export default possibilities;
