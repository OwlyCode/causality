import * as React from "react";
import ReactDOM from "react-dom";

export default class DebugLog extends React.Component <any, any> {
    constructor(props: any) {
        super(props);
    }

    public render() {
        return <p className="debug">{this.props.content}</p>;
    }
}
