import * as React from 'react';
import ReactDOM from 'react-dom';

import Fact from '../core/fact';
import DebugEntry from '../core/debug-entry';
import { formatYear } from '../date';

import DebugLog from './DebugLog';
import Entry from './Entry';

export default class App extends React.Component <any, any> {
    constructor (props: any) {
        super(props);

        this.state = {
            world: props.world,
            concluded: false,
        };
    }
    componentWillMount() {
        document.addEventListener("keydown", this.onClick.bind(this));
    }

    onClick() {
        const world = this.props.generator.generate(this.state.world);

        if (world.final) {
            this.setState({
                world,
                concluded: true,
            });
        } else {
            this.setState({ world });
        }

        setTimeout(() => {
            window.scrollTo(0,document.body.scrollHeight);
        }, 10);
    }

    restart() {
        window.location.reload(false);
    }

    getTimeline() {
        const timeline = this.state.world.timeline;

        return this.props.debug ? timeline : timeline.filter((item: DebugEntry | Fact) => item instanceof Fact);
    }

    render() {
        return <div>
            {this.getTimeline().map((item: DebugEntry | Fact) => {
                if (item instanceof DebugEntry) {
                    return <DebugLog key={item.getId()} content={item.getContent()}/>;
                } else {
                    return <Entry key={item.getId()} timeLabel={formatYear(item.getYear() - this.state.world.age)} content={item.getContent()}/>;
                }
            })}
            { this.state.concluded ? <p><span className="end">Nothing more to see !</span> <a href="#" onClick={this.restart}>(click here to restart)</a></p> : '' }
            { !this.state.concluded ? <a href="#" onClick={this.onClick.bind(this)}>Click here or press space to continue</a> : '' }
        </div>;
    }
}
