import Random from './random';
import { Generator, World, Fact, DebugEntry } from './core';
import { UniverseBirth } from './possibilities/creation';
import { formatYear } from './date';

import * as React from 'react';
import ReactDOM from 'react-dom';

class App extends React.Component <any, any> {
    constructor (props: any) {
        super(props);

        this.state = {
            world: props.world,
            generator: props.generator,
            concluded: false,
        };
    }
    componentWillMount() {
        document.addEventListener("keydown", this.onClick.bind(this));
    }

    onClick() {
        const generator = this.state.generator.getNextEvent();

        if (generator === null) {
            this.setState({
                concluded: true,
            });
        } else {
            this.setState({
                generator
            });
        }

        setTimeout(() => {
            window.scrollTo(0,document.body.scrollHeight);
        }, 10);
    }

    restart() {
        window.location.reload(false);
    }

    getTimeline() {
        const timeline = this.state.world.getTimeline();

        return this.props.debug ? timeline : timeline.filter((item: DebugEntry | Fact) => item instanceof Fact);
    }

    render() {
        return <div>
            {this.getTimeline().map((item: DebugEntry | Fact) => {
                if (item instanceof DebugEntry) {
                    return <DebugLogItem key={item.getId()} content={item.getContent()}/>;
                } else {
                    return <Entry key={item.getId()} timeLabel={formatYear(item.getYear() - world.getAge())} content={item.getContent()}/>;
                }
            })}
            { this.state.concluded ? <p><span className="end">Nothing more to see !</span> <a href="#" onClick={this.restart}>(click here to restart)</a></p> : '' }
            { !this.state.concluded ? <a href="#" onClick={this.onClick.bind(this)}>Click here or press space to continue</a> : '' }
        </div>;
    }
}

class DebugLogItem extends React.Component <any, any> {
    constructor(props: any) {
        super(props);
    }

    render() {
        return <p className="debug">{this.props.content}</p>;
    }
}

class Entry extends React.Component <any, any> {
    constructor(props: any) {
        super(props);
    }

    render() {
        return <p dangerouslySetInnerHTML={{__html: `<b>${this.props.timeLabel}</b>: ${this.props.content}`}} />;
    }
}


const r = new Random();
const world = new World(r.generateSeed());
let g: Generator | null = (new Generator(world, [new UniverseBirth()])).getNextEvent();
let count = 0;
const app = <App debug={false} world={world} generator={g}/>;

ReactDOM.render(
  app,
  document.getElementById('root')
);
