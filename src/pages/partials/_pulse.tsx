import { VNode } from '@cycle/dom';

export function pulse(): VNode {
    return (
        <div className="pulse">
            <div className="pulse-bar"/>
            <div className="pulse-bar"/>
            <div className="pulse-bar"/>
            <div className="pulse-bar"/>
        </div>
    );
}