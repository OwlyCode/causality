export function extractFeatureProperty(feature: string[], property: string) {
    for (const item of feature) {
        if (item.startsWith(`${property}:`)) {
            return item.split(":")[1];
        }
    }

    return null;
}

export function isConsonant(letter: string): boolean {
    return ["a", "e", "i", "o", "u"].includes(letter.toLowerCase());
}

export function an(input: string): string {
    return `${isConsonant(input[0]) ? "an" : "a"} ${input}`;
}

export function ucfirst(input: string): string {
    return input.charAt(0).toUpperCase() + input.slice(1);
}
