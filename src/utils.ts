export function isConsonant(letter: string): boolean {
	return ['a', 'e', 'i', 'o', 'u'].includes(letter.toLowerCase());
}

export function an(word: string): string {
	return `${isConsonant(word[0]) ? 'an' : 'a'} ${word}`;
}

export function ucfirst(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
