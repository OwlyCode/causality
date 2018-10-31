export default class DebugEntry {
    private content: string;
    private id: string;

    constructor(id: string, content: string) {
        this.id = id;
        this.content = content;
    }

    public getId(): string {
        return this.id;
    }

    public getContent(): string {
        return this.content;
    }
}
