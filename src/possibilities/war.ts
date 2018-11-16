/* tslint:disable:max-classes-per-file */
import Possibility from "../core/Possibility";
import World from "../core/World";

class Battle extends Possibility {
    public readonly narrative = "war";
    public readonly randomPattern = {
        attackerCasualties: "[10000 to 100000]",
        balanceChange: "[-2 to 2]",
        defenderCasualties: "[10000 to 100000]",
        ellapsedTime: "1",
    };
    public readonly canOccurOnce = false;
    public readonly score = "10";

    public isPossible(world: World): boolean {
        return (world.state.war_battles < 3) || world.state.war_balance === 0;
    }

    public alterWorld(world: World, values: {[key: string]: any}): World {
        const attackerName = world.state.war_attacker;
        const defenderName = world.state.war_defender;

        let evolution = "";

        if (values.balanceChange > 0) {
            evolution = `the <b>${attackerName}</b> won the battle.`;
        } else if (values.balanceChange < 0) {
            evolution = `the <b>${defenderName}</b> won the battle.`;
        } else {
            evolution = "the battle ended in a stalemate";
        }

        return world
            .setState("war_balance", world.state.war_balance + values.balanceChange)
            .setState("war_battles", world.state.war_battles + 1)
            .addFact(values.ellapsedTime, `
                A battle occured. During the fights, the <b>${attackerName}</b> lost
                ${values.attackerCasualties} soldiers and the <b>${defenderName}</b>
                lost ${values.defenderCasualties} and ${evolution}
            `);
    }
}

class NuclearEnd extends Possibility {
    public readonly narrative = "war";
    public readonly randomPattern = {
        ellapsedTime: "1",
    };
    public readonly score = "1";

    public isPossible(world: World): boolean {
        return ["modern", "futuristic"].includes(world.state.tech_level);
    }

    public alterWorld(world: World, values: {[key: string]: any}): World {
        const balance = world.state.war_balance;
        const attackerName = world.state.war_attacker;
        const defenderName = world.state.war_defender;

        const targetName = balance > 0 ? attackerName : defenderName;
        const nukerName = balance < 0 ? attackerName : defenderName;

        return world
            .conclude()
            .addFact(values.ellapsedTime, `
                In a desperate attempt to turn the tide of the war, the <b>${nukerName}</b> launched nuclear
                warheads on every major city of the <b>${targetName}</b>. The <b>${targetName}</b> retaliated quickly
                with their owns, turning the world into a cold sphere of snow and dust.
            `);
    }
}

class WarEnds extends Possibility {
    public readonly narrative = "war";
    public readonly randomPattern = {
        ellapsedTime: "1",
        outcome: "pick(1): annexation, extermination, submission, humiliation",
    };

    public computeScore(world: World): number {
        return Math.abs(world.state.war_balance) * 5;
    }

    public alterWorld(world: World, values: {[key: string]: any}): World {
        const balance = world.state.war_balance;
        const attackerName = world.state.war_attacker;
        const defenderName = world.state.war_defender;

        const winnerName = balance > 0 ? attackerName : defenderName;
        const looserName = defenderName === winnerName ? attackerName : defenderName;

        let outcome = "";

        let newWorld = world;

        switch (values.outcome) {
            case "annexation":
                outcome = `The <b>${winnerName}</b> annexated the <b>${looserName}</b>.`;
                break;
            case "extermination":
                outcome = `The <b>${winnerName}</b> exterminated the <b>${looserName}</b>.`;
                break;
            case "submission":
                outcome = `The <b>${winnerName}</b> made a puppet state of the <b>${looserName}</b>.`;
                break;
            case "humiliation":
                outcome = `The <b>${winnerName}</b> humiliated the <b>${looserName}</b>.`;
                break;
        }

        newWorld = newWorld
            .leaveNarrative()
            .enterNarrative("civilization")
            .addFact(0, `The war ends. ${outcome}`);

        if (["annexation", "extermination"].includes(values.outcome)) {
            newWorld = newWorld.removeFeatureByName(looserName);
        }

        return newWorld;
    }
}

const possibilities = {
    Battle,
    NuclearEnd,
    WarEnds,
};

export default possibilities;
