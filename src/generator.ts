import Random from './random';
import { ucfirst } from './utils';

export function generateCivilizationName(seed: string): string {
    const r = new Random(seed);
    let name = '';

    for (let i = 0; i < 3; i++) {
        name += r.among('bcdfghjklmnpqrstvwxz');
        name += r.among(['a', 'e', 'i', 'o', 'u', 'au', 'oo', 'au']);
    }

    return ucfirst(name);
}

export function generateAnimalName(seed: string, size: string, skin: string, cycle: string, locomotion: string): string {
    const r = new Random(seed);

    const names: { [key:string]: { [key:string]: string[] } } = {
        swimming: {
            'tiny': ['Fish', 'Frog', 'Shrimp', 'Starfish'],
            'small': ['Fish', 'Turtle', 'Crab', 'Jellyfish'],
            'medium sized': ['Shark', 'Dolphin', 'Squid'],
            'big': ['Orca', 'Squid', 'Crocodile'],
            'huge': ['Whale', 'Monster', 'Kraken'],
        },
        walking: {
            'tiny': ['Ant', 'Mantis', 'Scarab', 'Beetle', 'Spider'],
            'small': ['Cat', 'Mouse', 'Rat', 'Squirrel', 'Dog'],
            'medium sized': ['Cow', 'Horse', 'Pig', 'Lion', 'Tiger', 'Ape'],
            'big': ['Elephant', 'Girafe', 'Rhinoceros', 'Hippopotamus'],
            'huge': ['Tyranosaurus', 'Giant', 'Dreadnoughtus', 'Mammoth'],
        },
        flying: {
            'tiny': ['Mosquito', 'Bee', 'Wasp', 'Fly', 'Hummingbird'],
            'small': ['Pidgin', 'Bat', 'Sparrow', 'Woodpecker'],
            'medium sized': ['Owl', 'Harrier', 'Pelican', 'Osprey'],
            'big': ['Penguin', 'Ostrich', 'Eagle', 'Heron'],
            'huge': ['Dragon', 'Emperor', 'Sky-king'], // No real world animals to put here :D
        },
    };

    const adjectives: { [key:string]: string[] } = {
        feathery: ['Feathered', 'Swift', 'Fluffy', 'Soft', 'Windy'],
        hairy: ['Sweat', 'Fleecy', 'Woolly', 'Fuzzy', 'Shaggy', 'Hairy', 'Downy', 'Furry', 'Velvety'],
        scaly: ['Scaly', 'Shining', 'Pointy', 'Tough', 'Solid', 'Spiky'],
        bald: ['Skinny', 'Naked', 'Hairless', 'Smooth', 'Bald', 'Unclothed'],
        diurnal: ['Day', 'Sun'],
        nocturnal: ['Night', 'Dark'],
    };

    const sources = adjectives[skin].concat(adjectives[cycle]);

    const source = r.among(sources);

    return `${source} ${r.among(names[locomotion][size])}`;
}
