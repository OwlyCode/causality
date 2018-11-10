import World from "./World";

export default class Fact {
    public readonly id: string;
    public readonly content: string;
    public readonly year: number;
    public readonly world: World;

    constructor(id: string, content: string, year: number, world: World) {
        this.id = id;
        this.content = content;
        this.year = year;
        this.world = world;
    }
}
