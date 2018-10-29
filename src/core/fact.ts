export default class Fact {
    private content: string;
    private year: number;
    private id: string;

    constructor(id: string, content: string, year: number) {
        this.id = id;
        this.content = content;
        this.year = year;
    }

    getId(): string {
        return this.id;
    }

    getContent(): string {
        return this.content;
    }

    getYear(): number {
        return this.year;
    }
}
