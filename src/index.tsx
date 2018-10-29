import Random from './random';
import Fact from './core/fact';
import DebugEntry from './core/debug-entry';
import World from './core/world';
import { Generator } from './core';
import { formatYear } from './date';

import * as React from 'react';
import ReactDOM from 'react-dom';

import App from './ui/App';

import creationPossibilities from './possibilities/creation';
import evolutionPossibilities from './possibilities/evolution';
import civilizationPossibilities from './possibilities/civilization';
import warPossibilities from './possibilities/war';

const r = new Random();
let world = new World({ seed: r.generateSeed() });

world = world
    .enterNarrative('the_creation')
    .addPossibilities(creationPossibilities)
    .addPossibilities(evolutionPossibilities)
    .addPossibilities(civilizationPossibilities)
    .addPossibilities(warPossibilities);


const generator = new Generator();
const app = <App debug={false} world={world} generator={generator}/>;

ReactDOM.render(
  app,
  document.getElementById('root')
);

