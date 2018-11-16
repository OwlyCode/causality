export default class Feature {
    public readonly name: string;
    public readonly content: string[];

    constructor(name: string, content: string[]) {
        this.name = name;
        this.content = content;
    }

    public toString(): string {
        return `${this.name} ${this.content.join(" ")}`;
    }
}
