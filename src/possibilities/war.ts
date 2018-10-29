import World from '../core/world';
import { Possibility, extractFeatureProperty } from '../core';
import { generateCivilizationName } from '../generator';

class Battle extends Possibility {
    narrative = 'war';
    randomPattern = {
        ellapsedTime: '1',
        balanceChange: '[-2 to 2]',
        attackerCasualties: '[10000 to 100000]',
        defenderCasualties: '[10000 to 100000]',
    };
    canOccurOnce = false;
    score = '10';

    isPossible(world: World): boolean {
        return world.state['war_battles'] < 3;
    }

    alterWorld(world: World, values: {[key:string] : any}): World {
        const attackerName = world.state['war_attacker'];
        const defenderName = world.state['war_defender'];

        let evolution = '';

        if (values.balanceChange > 0) {
            evolution = `the <b>${attackerName}</b> won the battle.`;
        } else if (values.balanceChange < 0) {
            evolution = `the <b>${defenderName}</b> won the battle.`;
        } else {
            evolution = 'the battle ended in a stalemate';
        }

        return world
            .setState('war_balance', world.state['war_balance'] + values.balanceChange)
            .setState('war_battles', world.state['war_battles'] + 1)
            .addFact(values.ellapsedTime, `
                A battle occured. During the fights, the <b>${attackerName}</b> lost ${values.attackerCasualties} soldiers and the <b>${defenderName}</b>
                lost ${values.defenderCasualties} and ${evolution}
            `);
    }
}

class NuclearEnd extends Possibility {
    narrative = 'war';
    randomPattern = {
        ellapsedTime: '1',
    };
    score = '1';

    isPossible(world: World): boolean {
        return ['modern', 'futuristic'].includes(world.state['tech_level']);
    }

    alterWorld(world: World, values: {[key:string] : any}): World {
        const balance = world.state['war_balance'];
        const attackerName = world.state['war_attacker'];
        const defenderName = world.state['war_defender'];

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
    narrative = 'war';
    randomPattern = {
        ellapsedTime: '1',
        outcome: 'pick(1): annexation, extermination, submission, humiliation',
    };

    computeScore(world: World): number {
        return Math.abs(world.state['war_balance']) * 5;
    }

    isPossible(world: World): boolean {
        return (world.getFeatures(['civilization']).length > 2);
    }

    alterWorld(world: World, values: {[key:string] : any}): World {
        const balance = world.state['war_balance'];
        const attackerName = world.state['war_attacker'];
        const defenderName = world.state['war_defender'];

        const winnerName = balance > 0 ? attackerName : defenderName;
        const looserName = defenderName === winnerName ? attackerName : defenderName;

        let outcome = '';

        let newWorld = world;

        switch (values.outcome) {
            case 'annexation':
                outcome = `The <b>${winnerName}</b> annexated the <b>${looserName}</b>.`;
                newWorld = newWorld.removeFeature([`name:${looserName}`]);
                break;
            case 'extermination':
                outcome = `The <b>${winnerName}</b> exterminated the <b>${looserName}</b>.`;
                newWorld = newWorld.removeFeature([`name:${looserName}`]);
                break;
            case 'submission':
                outcome = `The <b>${winnerName}</b> made a puppet state of the <b>${looserName}</b>.`;
                break;
            case 'humiliation':
                outcome = `The <b>${winnerName}</b> humiliated the <b>${looserName}</b>.`;
                break;
        }

        return newWorld
            .leaveNarrative()
            .enterNarrative('civilization')
            .addFact(0, `The war ends. ${outcome}`);
    }
}

const possibilities = {
    Battle,
    NuclearEnd,
    WarEnds,
}

export default possibilities;
