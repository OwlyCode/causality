import { World, Possibility, extractFeatureProperty } from '../core';
import { generateCivilizationName } from '../generator';
import * as Civilization from './civilization';

export class Battle extends Possibility {
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
        return world.getState('war_battles') < 3;
    }

    alterWorld(world: World, values: {[key:string] : any}): void {
        world.setState('war_balance', world.getState('war_balance') + values.balanceChange);
        world.setState('war_battles', world.getState('war_battles') + 1);
        const attackerName = world.getState('war_attacker');
        const defenderName = world.getState('war_defender');

        let evolution = '';

        if (values.balanceChange > 0) {
            evolution = `the <b>${attackerName}</b> won the battle.`;
        } else if (values.balanceChange < 0) {
            evolution = `the <b>${defenderName}</b> won the battle.`;
        } else {
            evolution = 'the battle ended in a stalemate';
        }

        world.addFact(values.ellapsedTime, `
            A battle occured. During the fights, the <b>${attackerName}</b> lost ${values.attackerCasualties} soldiers and the <b>${defenderName}</b>
            lost ${values.defenderCasualties} and ${evolution}
        `);
    }
}

export class NuclearEnd extends Possibility {
    narrative = 'war';
    randomPattern = {
        ellapsedTime: '1',
    };
    score = '1';

    isPossible(world: World): boolean {
        return ['modern', 'futuristic'].includes(world.getState('tech_level'));
    }

    alterWorld(world: World, values: {[key:string] : any}): void {
        world.leaveNarrative();
        world.enterNarrative('the_end');

        const balance = world.getState('war_balance');
        const attackerName = world.getState('war_attacker');
        const defenderName = world.getState('war_defender');

        const targetName = balance > 0 ? attackerName : defenderName;
        const nukerName = balance < 0 ? attackerName : defenderName;

        world.addFact(values.ellapsedTime, `
            In a desperate attempt to turn the tide of the war, the <b>${nukerName}</b> launched nuclear
            warheads on every major city of the <b>${targetName}</b>. The <b>${targetName}</b> retaliated quickly
            with their owns, turning the world into a cold sphere of snow and dust.
        `);
    }
}

export class WarEnds extends Possibility {
    narrative = 'war';
    randomPattern = {
        ellapsedTime: '1',
        outcome: 'pick(1): annexation, extermination, submission, humiliation',
    };

    outcomes = Object.values(Civilization);

    computeScore(world: World): number {
        return Math.abs(world.getState('war_balance')) * 5;
    }

    isPossible(world: World): boolean {
        return (world.getFeatures(['civilization']).length > 2);
    }

    alterWorld(world: World, values: {[key:string] : any}): void {
        world.leaveNarrative();
        world.enterNarrative('civilization');

        const balance = world.getState('war_balance');
        const attackerName = world.getState('war_attacker');
        const defenderName = world.getState('war_defender');

        const winnerName = balance > 0 ? attackerName : defenderName;
        const looserName = defenderName === winnerName ? attackerName : defenderName;

        let outcome = '';

        switch (values.outcome) {
            case 'annexation':
                outcome = `The <b>${winnerName}</b> annexated the <b>${looserName}</b>.`;
                world.removeFeature([`name:${looserName}`]);
                break;
            case 'extermination':
                outcome = `The <b>${winnerName}</b> exterminated the <b>${looserName}</b>.`;
                world.removeFeature([`name:${looserName}`]);
                break;
            case 'submission':
                outcome = `The <b>${winnerName}</b> made a puppet state of the <b>${looserName}</b>.`;
                break;
            case 'humiliation':
                outcome = `The <b>${winnerName}</b> humiliated the <b>${looserName}</b>.`;
                break;
        }

        world.addFact(0, `The war ends. ${outcome}`);
    }
}
