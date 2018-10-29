export default class DebugEntry {
    private content: string;
    private id: string;

    constructor(id: string, content: string) {
        this.id = id;
        this.content = content;
    }

    getId(): string {
        return this.id;
    }

    getContent(): string {
        return this.content;
    }
}
