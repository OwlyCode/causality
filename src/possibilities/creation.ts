/* tslint:disable:max-classes-per-file */
import Possibility from "../core/Possibility";
import { an } from "../core/Utils";
import World from "../core/World";

class UniverseBirth extends Possibility {
    public readonly score = "10";
    public readonly narrative = "the_creation";

    public isPossible(world: World): boolean {
        return !world.state.universe_born;
    }

    public alterWorld(world: World, values: {[key: string]: any}): World {
        return world
            .addFact(0, "The universe is born.")
            .setState("universe_born", true)
            .enterNarrative("the_creation");
    }
}

class GalaxyBirth extends Possibility {
    public readonly score = "10";
    public readonly narrative = "the_creation";
    public readonly randomPattern = {
        ellapsedTime: "[1000000000 to 2000000000]",
    };

    public isPossible(world: World): boolean {
        return world.state.universe_born && !world.state.galaxy_born;
    }

    public alterWorld(world: World, values: {[key: string]: any}): World {
        return world
            .setState("galaxy_born", true)
            .addFact(values.ellapsedTime, "The galaxy formed.");
    }
}

class PlanetBirth extends Possibility {
    public readonly score = "10";
    public readonly narrative = "the_creation";
    public readonly randomPattern = {
        ellapsedTime: "[2000000000 to 10000000000]",
    };

    public isPossible(world: World): boolean {
        return world.state.galaxy_born && !world.state.planet_born;
    }

    public alterWorld(world: World, values: {[key: string]: any}): World {
        return world
            .setState("planet_born", true)
            .addFact(values.ellapsedTime, "The protoplanet formed.");
    }
}

class MassiveImpact extends Possibility {
    public readonly score = "10";
    public readonly narrative = "the_creation";
    public readonly randomPattern = {
        ellapsedTime: "[1000000 to 10000000000]",
        moonsColors: "pick([1 to 3]): blue, red, green, white, dark gray, yellow, orange",
    };

    public isPossible(world: World): boolean {
        return world.state.planet_born && !world.state.massive_impact;
    }

    public alterWorld(world: World, values: {[key: string]: any}): World {
        let newWorld = world;
        newWorld.setState("massive_impact", true);

        if (typeof values.moonsColors === "string") {
            return newWorld
                .addFact(values.ellapsedTime, `
                    A massive impact occured with a protoplanet, ejecting matter into outer space.
                    The ejected matter slowly aggregated to form ${an(values.moonsColors)} moon.
                `)
                .addFeature(["moon", "first", "only", values.moonsColors[0]]);
        }

        const moons = [];
        for (let i = 0; i < values.moonsColors.length; i++) {
            const positions = ["first", "second", "third"];
            const feature = ["moon", positions[i], values.moonsColors[i]];

            moons.push(`<p>The ${positions[i]} moon is ${values.moonsColors[i]}.</p>`);
            newWorld = newWorld.addFeature(feature);
        }

        return newWorld.addFact(values.ellapsedTime, `
            A massive impact occured with a protoplanet, ejecting matter into outer space.
            The ejected matter slowly aggregated to form ${values.moonsColors.length} moons.
            ${moons.join(" ")}
        `);
    }
}

class PlanetCreation extends Possibility {
    public readonly narrative = "the_creation";
    public readonly score = "10";
    public readonly randomPattern = {
        atmosphereMainGaz: "pick(1): nitrogen, helium, carbon dioxyde",
        atmosphereThickness: "pick(1): thick, thin",
        ellapsedTime: "[1000000000 to 3000000000]",
        waterCoverage: "[40 to 90]",
    };

    public isPossible(world: World): boolean {
        return world.state.planet_born && !world.state.planet_solidified;
    }

    public alterWorld(world: World, values: {[key: string]: any}): World {
        return world
            .setState("planet_solidified", true)
            .addFact(values.ellapsedTime, `
                The planet slowy cools into a small telluric world. What once was huge
                lakes of lava is now a dark solid crust. It is covered with ${values.waterCoverage}%
                of water with a ${values.atmosphereThickness} atmosphere mainly constituted of
                ${values.atmosphereMainGaz} with some other rare gazes.
            `);
    }
}

class Panspermia extends Possibility {
    public readonly narrative = "the_creation";
    public readonly score = "3";
    public readonly randomPattern = {
        ellapsedTime: "[1000000000 to 2000000000]",
    };

    public isPossible(world: World): boolean {
        return world.state.planet_solidified;
    }

    public alterWorld(world: World, values: {[key: string]: any}): World {
        return world
            .enterNarrative("evolution")
            .addFact(values.ellapsedTime, "A comet with some bacteria crashed.")
            .addFeature(["life", "comet"]);
    }
}

class AlienIntervention extends Possibility {
    public readonly narrative = "the_creation";
    public readonly score = "3";
    public readonly randomPattern = {
        ellapsedTime: "[1000000000 to 2000000000]",
    };

    public isPossible(world: World): boolean {
        return world.state.planet_solidified;
    }

    public alterWorld(world: World, values: {[key: string]: any}): World {
        return world
            .enterNarrative("evolution")
            .addFact(values.ellapsedTime, "An alien ship deposited some bacteria.")
            .addFeature(["life", "alien"]);
    }
}

class ChemicalInterraction extends Possibility {
    public readonly narrative = "the_creation";
    public readonly score = "3";
    public readonly randomPattern = {
        ellapsedTime: "[1000000000 to 2000000000]",
    };

    public isPossible(world: World): boolean {
        return world.state.planet_solidified;
    }

    public alterWorld(world: World, values: {[key: string]: any}): World {
        return world
            .enterNarrative("evolution")
            .addFact(values.ellapsedTime, "Following some random chemical interractions, life appeared.")
            .addFeature(["life", "chemical"]);
    }
}

const possibilities = {
    AlienIntervention,
    ChemicalInterraction,
    GalaxyBirth,
    MassiveImpact,
    Panspermia,
    PlanetBirth,
    PlanetCreation,
    UniverseBirth,
};

export default possibilities;
