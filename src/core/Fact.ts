export default class Fact {
    private content: string;
    private year: number;
    private id: string;

    constructor(id: string, content: string, year: number) {
        this.id = id;
        this.content = content;
        this.year = year;
    }

    public getId(): string {
        return this.id;
    }

    public getContent(): string {
        return this.content;
    }

    public getYear(): number {
        return this.year;
    }
}
