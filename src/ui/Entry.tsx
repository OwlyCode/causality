import * as React from "react";
import ReactDOM from "react-dom";

export default class Entry extends React.Component <any, any> {
    constructor(props: any) {
        super(props);

        this.state = {
            hovered: false,
        };
    }

    public onMouseEnter() {
        this.setState({ hovered: true });
    }

    public onMouseLeave() {
        this.setState({ hovered: false });
    }

    public render() {
        return <div onClick={this.props.onEdit} onMouseEnter={this.onMouseEnter.bind(this)} onMouseLeave={this.onMouseLeave.bind(this)} className={`fact ${this.props.fact.world.manuallyAltered ? "manually-altered" : ""}`}>
            <b>{this.props.timeLabel}</b>:&nbsp;
            <span dangerouslySetInnerHTML={{__html: this.props.content}}></span>
            { this.state.hovered && <i className="eva eva-edit-outline"></i> }
        </div>;
    }
}
