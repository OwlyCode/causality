import * as React from "react";
import ReactDOM from "react-dom";
import posed, { PoseGroup } from "react-pose";
import Select from "react-select";

import DebugEntry from "../core/DebugEntry";
import Fact from "../core/Fact";
import Parser from "../core/Parser";
import Possibility from "../core/Possibility";
import Random from "../core/Random";
import World from "../core/World";
import FormGenerator from "../ui/FormGenerator";
import DebugLog from "./DebugLog";
import Entry from "./Entry";
import Modal from "./Modal";

const Box = posed.div({
  enter: { opacity: 1, transition: { duration: 300 } },
  exit: { opacity: 0, transition: { duration: 300 } },
});

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
        return "now";
    }

    return `${absoluteYear} years ${suffix}`;
}

export default class App extends React.Component <any, any> {
    constructor(props: any) {
        super(props);

        this.state = {
            concluded: false,
            edit: false,
            editedPossibility: null,
            editedWorld: null,
            seed: props.seed,
            valid: false,
            world: props.world,
        };
    }

    public componentWillMount() {
        document.addEventListener("keydown", (event: any) => {
            if (event.keyCode === 32) {
                this.onClick();
            }
        });
    }

    public onClick() {
        if (this.state.concluded || this.state.edit) {
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

    public edit(fact: Fact) {
        const { lastPossibility, lastValues } = fact.world;

        this.setState({
            edit: true,
            editedPossibility: lastPossibility,
            editedWorld: fact.world,
            formValues: lastValues,
            valid: this.isValid(lastPossibility, lastValues),
        });
    }

    public cancelEdit() {
        this.setState({ edit: false });
    }

    public undoChange() {
        const world = this.props.generator.generate(this.state.editedWorld.mutate({ final: false }).manuallyAlter(false));

        this.setState({
            concluded: world.final,
            edit: false,
            world,
        });
    }

    public applyEdit() {
        let newWorld = this.state.editedWorld;
        const possibility = this.state.editedPossibility;

        const nextSeedGen = new Random(btoa(newWorld.seed + JSON.stringify(this.state.formValues)));

        newWorld = newWorld.lastWorld;
        newWorld = newWorld.mutate({ final: false });
        newWorld = newWorld.setLastPossibility(possibility);
        newWorld = newWorld.setLastWorld(newWorld);
        newWorld = newWorld.setLastValues(this.state.formValues);
        newWorld = newWorld.manuallyAlter();
        newWorld = possibility.alterWorld(newWorld, this.state.formValues);
        newWorld = newWorld.manuallyAlter(false);

        this.setState({
            concluded: newWorld.final,
            edit: false,
            world: newWorld,
        });
    }

    public render() {
        return <div>
            <Modal
                show={this.state.edit}
                showApply={this.state.valid}
                showUndo={this.state.editedWorld && this.state.editedWorld.manuallyAltered}
                onUndo={this.undoChange.bind(this)}
                onCancel={this.cancelEdit.bind(this)}
                onApply={this.applyEdit.bind(this)}
            >
                {this.renderForm(this.state.editedWorld)}
            </Modal>
            <fieldset>
                <label>Seed :</label> <input onChange={this.changeSeed.bind(this)} type="text" defaultValue={this.state.seed} />
            </fieldset>
            <PoseGroup>
            {this.getTimeline().map((item: DebugEntry | Fact) => {
                if (item instanceof DebugEntry) {
                    return <Box key={item.id}>
                        <DebugLog key={item.id} content={item.content}/>
                    </Box>;
                } else {
                    return <Box key={item.id}>
                        <Entry onEdit={() => this.edit(item)} key={item.id} timeLabel={formatYear(item.year - this.state.world.age)} content={item.content} fact={item}/>
                    </Box>;
                }
            })}
            </PoseGroup>
            { this.state.concluded ? <p><span className="end">Nothing more to see !</span> <a href="#" onClick={this.restart}>(click here to restart)</a></p> : "" }
            { !this.state.concluded ? <a href="#" onClick={this.onClick.bind(this)}>Click here or press space to continue</a> : "" }
        </div>;
    }

    private isValid(possibility: Possibility, formValues: any): boolean {
        const results = [];

        for (const key in possibility.randomPattern) {
            results.push(Parser.validateValue(
                formValues[key],
                possibility.randomPattern[key],
            ));
        }


        return results.every((r) => !!r);
    }

    private changeSeed(event: any) {
        const seed = event.target.value;
        const world = this.state.world.reboot(seed);

        this.setState({
            concluded: world.final,
            seed,
            world,
        });
    }

    private selectValue(name: string, value: any) {
        const formValues = Object.assign({}, this.state.formValues, {[name]: value});

        this.setState({ formValues, valid: this.isValid(this.state.editedPossibility, formValues) });
    }

    private changeEvent(value: any) {
        this.setState({
            editedPossibility: value.value,
            valid: this.isValid(value.value, this.state.formValues),
        });
    }

    private renderForm(world: World) {
        if (!world) {
            return "";
        }

        const { editedPossibility } = this.state;
        const forms = [];

        forms.push(<div key="event-picker">
            <label>Event</label>
            <Select
                defaultValue={{ value: editedPossibility, label: editedPossibility.name}}
                className="select"
                isSearchable={false}
                onChange={this.changeEvent.bind(this)}
                options={world.lastWorld.availablePossibilities.map((possibility) => ({ value: possibility, label: possibility.name }))} />
        </div>);

        for (const name in editedPossibility.randomPattern) {
            forms.push(FormGenerator.expressionToForm(
                name,
                editedPossibility.randomPattern[name],
                this.state.formValues[name],
                world,
                this.selectValue.bind(this),
            ));
        }

        return <div key={world.seed}>
            <fieldset>
                { forms }
            </fieldset>
        </div>;
    }
}
