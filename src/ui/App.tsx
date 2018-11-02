import * as React from "react";
import ReactDOM from "react-dom";

import DebugEntry from "../core/DebugEntry";
import Fact from "../core/Fact";
import DebugLog from "./DebugLog";
import Entry from "./Entry";

function formatYear(year: number): string {
    let suffix = "";
    const absoluteYear = Math.abs(year);

    if (year < 0) {
        suffix = " ago";
    }

    if (absoluteYear >= 1000000000) {
        return `${Math.round(absoluteYear / 10000000) / 100} billions years ${suffix}`;
    }

    if (absoluteYear >= 1000000) {
        return `${Math.round(absoluteYear / 10000) / 100} millions years ${suffix}`;
    }

    if (absoluteYear >= 1000) {
        return `${Math.round(absoluteYear / 10) / 100} thousands years ${suffix}`;
    }

    if (year === 0) {
        return 'now';
    }

    return `${absoluteYear} years ${suffix}`;
}

export default class App extends React.Component <any, any> {
    constructor(props: any) {
        super(props);

        this.state = {
            concluded: false,
            world: props.world,
        };
    }

    public componentWillMount() {
        document.addEventListener("keydown", this.onClick.bind(this));
    }

    public onClick() {
        if (this.state.concluded) {
            return;
        }

        const world = this.props.generator.generate(this.state.world);

        if (world.final) {
            this.setState({
                concluded: true,
                world,
            });
        } else {
            this.setState({ world });
        }

        setTimeout(() => {
            window.scrollTo(0, document.body.scrollHeight);
        }, 10);
    }

    public restart() {
        window.location.reload(false);
    }

    public getTimeline() {
        const timeline = this.state.world.timeline;

        return this.props.debug ? timeline : timeline.filter((item: DebugEntry | Fact) => item instanceof Fact);
    }

    public render() {
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
