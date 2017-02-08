import * as React from "react";

import { connect } from 'react-redux';

import { remote as electron } from 'electron';

const {shell} = electron;

export default class SheelA extends React.Component<{ href: string }, undefined> {
    render() {
        return (
            <a href="javascript:;" onClick={() => { shell.openExternal(this.props.href) }}>{this.props.children.toString()}</a>
        )
    }
}
