import Generator from "./core/Generator";
import Random from "./core/Random";
import World from "./core/World";
import App from "./ui/App";

import * as React from "react";
import ReactDOM from "react-dom";

import civilizationPossibilities from "./possibilities/civilization";
import creationPossibilities from "./possibilities/creation";
import evolutionPossibilities from "./possibilities/evolution";
import warPossibilities from "./possibilities/war";

const r = new Random();
const url = new URL(window.location.href);
const seed = url.searchParams.get("seed") || r.generateSeed();

let world = new World({ seed });

world = world
    .addDebugEntry(`World seed is ${seed}`)
    .enterNarrative("the_creation")
    .addPossibilities(creationPossibilities)
    .addPossibilities(evolutionPossibilities)
    .addPossibilities(civilizationPossibilities)
    .addPossibilities(warPossibilities);

const generator = new Generator();
const app = <App debug={false} seed={seed} world={world} generator={generator}/>;

ReactDOM.render(app, document.getElementById("root"));
