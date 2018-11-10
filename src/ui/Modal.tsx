import * as React from "react";
import ReactDOM from "react-dom";

export default class Modal extends React.Component <any, any> {
    constructor(props: any) {
        super(props);
    }

    public render() {
        const { onCancel, onApply, onUndo, show, children } = this.props;
        const showHideClassName = show ? "modal display-block" : "modal display-none";

        return (
        <div className={showHideClassName}>
            <section className="modal-main">
                {children}
                <div className="float-right">
                    { this.props.showUndo && <button className="button" onClick={onUndo}>Undo</button> }
                    &nbsp;
                    <button className="button" onClick={onCancel}>Cancel</button>
                    &nbsp;
                    { this.props.showApply && <button className="button" onClick={onApply}>Apply</button> }
                </div>
            </section>
        </div>
        );
    }
}
