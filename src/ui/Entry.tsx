import * as React from 'react';
import ReactDOM from 'react-dom';

export default class Entry extends React.Component <any, any> {
    constructor(props: any) {
        super(props);
    }

    render() {
        return <p dangerouslySetInnerHTML={{__html: `<b>${this.props.timeLabel}</b>: ${this.props.content}`}} />;
    }
}
