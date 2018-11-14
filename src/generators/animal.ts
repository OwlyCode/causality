import Random from "../core/Random";

export function generateAnimalName(
    seed: string,
    size: string,
    skin: string,
    cycle: string,
    locomotion: string,
): string {
    const r = new Random(seed);

    const names: { [key: string]: { [key: string]: string[] } } = {
        /* tslint:disable:object-literal-sort-keys */
        flying: {
            "tiny": ["Mosquito", "Bee", "Wasp", "Fly", "Hummingbird"],
            "small": ["Pidgin", "Bat", "Sparrow", "Woodpecker"],
            "medium sized": ["Owl", "Harrier", "Pelican", "Osprey"],
            "big": ["Penguin", "Ostrich", "Eagle", "Heron"],
            "huge": ["Dragon", "Emperor", "Sky-king"], // No real world animals to put here :D
        },
        swimming: {
            "tiny": ["Fish", "Frog", "Shrimp", "Starfish"],
            "small": ["Fish", "Turtle", "Crab", "Jellyfish"],
            "medium sized": ["Shark", "Dolphin", "Squid"],
            "big": ["Orca", "Squid", "Crocodile"],
            "huge": ["Whale", "Monster", "Kraken"],
        },
        walking: {
            "tiny": ["Ant", "Mantis", "Scarab", "Beetle", "Spider"],
            "small": ["Cat", "Mouse", "Rat", "Squirrel", "Dog"],
            "medium sized": ["Cow", "Horse", "Pig", "Lion", "Tiger", "Ape"],
            "big": ["Elephant", "Girafe", "Rhinoceros", "Hippopotamus"],
            "huge": ["Tyranosaurus", "Giant", "Dreadnoughtus", "Mammoth"],
        },
        /* tslint:enable */
    };

    const adjectives: { [key: string]: string[] } = {
        bald: ["Skinny", "Naked", "Hairless", "Smooth", "Bald", "Unclothed"],
        diurnal: ["Day", "Sun"],
        feathery: ["Feathered", "Swift", "Fluffy", "Soft", "Windy"],
        hairy: ["Sweat", "Fleecy", "Woolly", "Fuzzy", "Shaggy", "Hairy", "Downy", "Furry", "Velvety"],
        nocturnal: ["Night", "Dark"],
        scaly: ["Scaly", "Shining", "Pointy", "Tough", "Solid", "Spiky"],
    };

    const sources = adjectives[skin].concat(adjectives[cycle]);

    const source = r.among(sources);

    return `${source} ${r.among(names[locomotion][size])}`;
}
