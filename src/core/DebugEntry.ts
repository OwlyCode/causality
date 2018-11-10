export default class DebugEntry {
    public readonly content: string;
    public readonly id: string;

    constructor(id: string, content: string) {
        this.id = id;
        this.content = content;
    }
}
