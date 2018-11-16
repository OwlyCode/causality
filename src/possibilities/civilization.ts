/* tslint:disable:max-classes-per-file */
import Possibility from "../core/Possibility";
import { an, ucfirst } from "../core/Utils";
import World from "../core/World";
import { generateCivilizationName } from "../generators/civilization";

class NewCiv extends Possibility {
    public readonly narrative = "civilization";
    public readonly score = "10";
    public readonly randomPattern = {
        biome: "Biome of the founded capital => pick(1): plains, desert, mountains, forests",
        ellapsedTime: "Ellapsed time in years => [50 to 100]",
        government: "Government => pick(1): Empire, Republic, Kingdom, Dominion, Collective",
        id: "Seed used for name generation => seed()",
    };

    public isPossible(world: World): boolean {
        const hasNotTooMuch = world.getFeatures(["civilization"]).length < 5;

        return hasNotTooMuch && ["ancient_times", "medieval"].includes(world.state.tech_level);
    }

    public alterWorld(world: World, values: {[key: string]: any}): World {
        const name = generateCivilizationName(values.id);

        return world
            .addFact(values.ellapsedTime, `
                A new civilization, the <b>${name} ${values.government}</b> appeared. After a long travel,
                they established their capital city in the ${values.biome}.
            `)
            .addFeature(`${name} ${values.government}`, ["civilization", values.government]);
    }
}

class WarStarts extends Possibility {
    public readonly narrative = "civilization";
    public readonly randomPattern = {
        ellapsedTime: "Ellapsed time in years => [50 to 100]",
        participants: "Civilizations at war, attacker in first position => pick_feature(2): civilization",
        reason: "Justification of war => pick(1): trade dispute, border dispute, discovered conspiracy",
    };

    public computeScore(world: World): number {
        if (world.hasFeature(["sentient", "warmonger"])) {
            return 10;
        }
        if (world.hasFeature(["sentient", "aggressive"])) {
            return 8;
        }
        if (world.hasFeature(["sentient", "pacifist"])) {
            return 4;
        }
        if (world.hasFeature(["sentient", "inoffensive"])) {
            return 2;
        }

        return 0;
    }

    public isPossible(world: World): boolean {
        return world.getFeatures(["civilization"]).length >= 2;
    }

    public alterWorld(world: World, values: {[key: string]: any}): World {
        const attackerName = values.participants[0].name;
        const defenderName = values.participants[1].name;

        return world
            .setState("war_balance", 0)
            .setState("war_battles", 0)
            .setState("war_attacker", attackerName)
            .setState("war_defender", defenderName)
            .addFact(values.ellapsedTime, `
                A war errupted when the <b>${attackerName}</b> attacked the
                <b>${defenderName}</b> about a ${values.reason}.
            `)
            .enterNarrative("war");
    }
}

class MedievalProgression extends Possibility {
    public readonly narrative = "civilization";
    public readonly score = "5";
    public readonly randomPattern = {
        dominantCivilization: "Dominant civilization => pick_feature(1): civilization",
        ellapsedTime: "Ellapsed time in years => [1000 to 2000]",
        mount: "Mount used | nullable => pick_feature(1): lifeform, walking, medium sized",
        rangedWeapon: "Main ranged weapon => pick(1): crossbows, bows, slings",
        weapon: "Main melee weapon => pick(1): swords, pikes, axes",
        world: "They think the world is => pick(1): flat, round, a dream, nearing its end, an illusion",
    };

    public isPossible(world: World): boolean {
        const hasOneCiv = world.getFeatures(["civilization"]).length > 0;

        return hasOneCiv && (world.state.tech_level === "ancient_times");
    }

    public alterWorld(world: World, values: {[key: string]: any}): World {
        let mount = "";

        if (values.mount) {
            const mountName = values.mount.name;
            mount = `The <b>${mountName}</b> is used as a mount.`;
        } else {
            mount = "They use wooden charriots as mount.";
        }

        const dominantCivilization = values.dominantCivilization.name;

        return world
            .setState("tech_level", "medieval")
            .addFact(values.ellapsedTime, `
                The main world civilizations progressed to medieval age.
                They mainly use ${values.weapon} and ${values.rangedWeapon}.
                ${mount} Their philosophers all came to the conclusion that
                the world is ${values.world}. The <b>${dominantCivilization}</b>
                is the most powerful civilization.
            `);
    }
}

class IndustrialProgression extends Possibility {
    public readonly narrative = "civilization";
    public readonly score = "5";
    public readonly randomPattern = {
        breakthrough: "Main scientific breakthrough => pick(1): general relativity, nuclear fission, electromagnetism theory",
        dominantCivilization: "Dominant Civilization => pick_feature(1): civilization",
        ellapsedTime: "Ellapsed time in years => [200 to 800]",
        production: "Resource that is the most produced => pick(1): coal, textile, canned food, luxury goods",
    };

    public isPossible(world: World): boolean {
        return world.state.tech_level === "medieval";
    }

    public alterWorld(world: World, values: {[key: string]: any}): World {
        const dominantCivilization = values.dominantCivilization.name;

        return world
            .setState("tech_level", "industrial")
            .addFact(values.ellapsedTime, `
                The main world civilizations progressed to industrial age. ${values.production} factories have
                become common and scientists are proud of their latest discovery: the ${values.breakthrough}.
                The <b>${dominantCivilization}</b> is leading the world to a more civilized era.
            `);
    }
}

class ModernProgression extends Possibility {
    public readonly narrative = "civilization";
    public readonly score = "5";
    public readonly randomPattern = {
        communications: "Main communication device => pick(1): mobile phones, public terminals, home computers",
        dominantCivilization: "Dominant Civilization => pick_feature(1): civilization",
        ellapsedTime: "Ellapsed time in years => [100 to 200]",
        problems: "World #1 issue => pick(1): pollution, fake news, inequality, poverty, increasing disasters frequency",
    };

    public isPossible(world: World): boolean {
        return world.state.tech_level === "industrial";
    }

    public alterWorld(world: World, values: {[key: string]: any}): World {
        const dominantCivilization = values.dominantCivilization.name;

        return world
            .setState("tech_level", "modern")
            .addFact(values.ellapsedTime, `
                The main world civilizations progressed to modern age. People now frequently spend vast amount of
                time on ${values.communications}. ${ucfirst(values.problems)} has now become the #1 world issue.
                The <b>${dominantCivilization}</b> has the strongest economy and is dominating the world.
            `);
    }
}

class FuturisticProgression extends Possibility {
    public readonly narrative = "civilization";
    public readonly score = "5";
    public readonly randomPattern = {
        dominantCivilization: "Dominant Civilization => pick_feature(1): civilization",
        ellapsedTime: "Ellapsed time in years => [100 to 200]",
        powerSource: "Main power source => pick(1): nuclear fusion plants, vast solar panel fields, huge hydroelectric dams",
        transportation: "Most popular transportation system => pick(1): teleporter, flying cars, personal planes, underground tubes",
    };

    public isPossible(world: World): boolean {
        return world.state.tech_level === "modern";
    }

    public alterWorld(world: World, values: {[key: string]: any}): World {
        const dominantCivilization = values.dominantCivilization.name;

        return world
            .setState("tech_level", "futuristic")
            .addFact(values.ellapsedTime, `
                The main world civilizations progressed to futuristic age. Most
                people can now travel all around the world using ${values.transportation}.
                Using its ${values.powerSource}, the <b>${dominantCivilization}</b>
                is the number one civilization as other world nations are struggling
                to find sustainable power sources.
            `);
    }
}

class DeepSpaceProgression extends Possibility {
    public readonly narrative = "civilization";
    public readonly score = "5";
    public readonly randomPattern = {
        dominantCivilization: "Dominant civilization => pick_feature(1): civilization",
        ellapsedTime: "Ellapsed time in years => [100 to 200]",
        wonder: "Space wonder => pick(1): space elevator, asteroid station, orbital shipyard, vast amount of high tech SSTO vehicles",
    };

    public isPossible(world: World): boolean {
        return world.state.tech_level === "futuristic";
    }

    public alterWorld(world: World, values: {[key: string]: any}): World {
        const dominantCivilization = values.dominantCivilization.name;

        return world
            .setState("tech_level", "deep_space")
            .addFact(values.ellapsedTime, `
                The main world civilizations progressed to a deep space technology level.
                The <b>${dominantCivilization}</b> built ${an(values.wonder)}, making it the most advanced civilization
                this planet has ever seen.
            `);
    }
}

class Religion extends Possibility {
    public readonly narrative = "civilization";
    public readonly score = "10";
    public readonly randomPattern = {
        adjective: "Adjective used to describe the god => pick(1): Holy, Great, Sacred, Venerable",
        adopter: "Civilization founding the religion => pick_feature(1): civilization",
        ellapsedTime: "Ellapsed time in years => [50 to 100]",
        prayerTime: "Time at which prayers occur => pick(1): at noon, at dusk, in the morning, at night",
        text: "Event text variant => [0 to 3]",
        totem: "Lifeform that represents the god => pick_feature(1): lifeform",
    };

    public isPossible(world: World): boolean {
        const hasNotTooMuch = world.getFeatures(["religion"]).length < 3;
        const isNotAgnostic = world.getFeatures(["sentient", "agnostic"]).length === 0;
        const hasOneCiv = world.getFeatures(["civilization"]).length > 0;

        return hasNotTooMuch && isNotAgnostic && hasOneCiv;
    }

    public alterWorld(world: World, values: {[key: string]: any}): World {
        const totemName = values.totem.name;
        const adopterName = values.adopter.name;

        const text = [
            `A new religion was founded around the cult of the <b>${totemName}</b>.
            Their followers gather ${values.prayerTime} to pray. It claims that the world
            was created by the ${values.adjective} <b>${totemName}</b>. It is quickly
            spreading among the population of the <b>${adopterName}</b>`,

            `A small sect based on the cult of the <b>${totemName}</b> growed into a religion.
            Their followers that once secretly gathered ${values.prayerTime} to pray are now
            actively preaching in the streets the glorious story of the ${values.adjective} <b>${totemName}</b>.
            It seems the majority of <b>${adopterName}</b> will adopt the newly founded religion.`,

            `A prophet that preached the cult of the ${values.adjective} <b>${totemName}</b>
            died. What once was a local belief has grown into a new religion.`,

            `Ancient writings about the cult of the ${values.adjective} <b>${totemName}</b>
            were discovered. Soon, people started to follow its sayings and a lot of temples
            are being built in every major city of the <b>${adopterName}</b>.`,
        ];

        return world
            .addFact(values.ellapsedTime, text[values.text])
            .addFeature("religion", ["religion"]);
    }
}

class SpaceEnd extends Possibility {
    public readonly narrative = "civilization";
    public readonly score = "1000";
    public readonly randomPattern = {
        ellapsedTime: "Ellapsed time in years => [50 to 100]",
    };

    public isPossible(world: World): boolean {
        return world.state.tech_level === "deep_space";
    }

    public alterWorld(world: World, values: {[key: string]: any}): World {
        return world
            .conclude()
            .addFact(values.ellapsedTime, `
                The world nations became so advanced that they turned their eyes to the star,
                launching massive amounts of colony ships in every direction. They made it to
                a point that even the destruction of their homeworld wouldn't mean the end.
            `);
    }
}

class AlienHarvest extends Possibility {
    public readonly narrative = "civilization";
    public readonly score = "2";
    public readonly randomPattern = {
        ellapsedTime: "Ellapsed time in years => [50 to 100]",
    };

    public isPossible(world: World): boolean {
        return world.hasFeature(["life", "alien"]);
    }

    public alterWorld(world: World, values: {[key: string]: any}): World {
        if (world.state.tech_level === "futuristic") {
            return world.addFact(values.ellapsedTime, "The alien ship came back and attempted to harvest the planet.");
        } else {
            return world
                .conclude()
                .addFact(values.ellapsedTime, "The alien ship came back and harvested the planet.");
        }
    }
}

const possibilities = {
    AlienHarvest,
    DeepSpaceProgression,
    FuturisticProgression,
    IndustrialProgression,
    MedievalProgression,
    ModernProgression,
    NewCiv,
    Religion,
    SpaceEnd,
    WarStarts,
};

export default possibilities;
