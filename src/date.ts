export function formatYear(year: number): string {
    let suffix = '';
    const absoluteYear = Math.abs(year);

    if (year < 0) {
        suffix = ' ago';
    }

    if (absoluteYear >= 1000000000) {
        return `${Math.round(absoluteYear / 10000000) / 100} billions years ${suffix}`;
    }

    if (absoluteYear >= 1000000) {
        return `${Math.round(absoluteYear / 10000) / 100} millions years ${suffix}`;
    }

    if (absoluteYear >= 1000) {
        return `${Math.round(absoluteYear / 10) / 100} thousands years ${suffix}`;
    }

    if (year === 0) {
        return 'now';
    }

    return `${absoluteYear} years ${suffix}`;
}
