import * as React from "react";
import { connect } from 'react-redux'
import * as _ from 'underscore';

import { showSettingDialogAction, mediaFilterChange } from '../actions'

import * as setImage from '../../img/set.png';

class TopBar extends React.Component<{ dispatch: Function, setting: Setting }, undefined> {
    private filterInput: HTMLInputElement;
    constructor() {
        super();
        this.changeFilterInputHandler = _.debounce(this.changeFilterInputHandler.bind(this), 400);
    }
    showSetingDialogHandler() {
        this.props.dispatch(showSettingDialogAction());
    }
    changeFilterInputHandler() {
        this.props.dispatch(mediaFilterChange(this.filterInput.value));
    }
    render() {
        return (
            <div id="topBar">
                <div className="top-bar row">
                    <div className="columns small-4 top-bar_columns top-bar_title">
                        Subox
                    </div>
                    <div className="columns small-8 top-bar_columns text-right">
                        <div className="button-group" style={{ margin: 0 }}>
                            <input ref={(input) => { this.filterInput = input }} onChange={this.changeFilterInputHandler.bind(this)} placeholder="快速检索" type="text" className="top-bar_search" />
                            <a href="javascript:;" onClick={this.showSetingDialogHandler.bind(this)} className="">
                                <img className="top-bar_setting_icon" src={setImage} alt="" />
                            </a>
                        </div>
                    </div>
                </div>
                <div className="media-path">
                    当前检索目录：{this.props.setting.mediaPath || '未设置'}
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        setting: state.common.setting || {}
    }
}


export default connect(mapStateToProps)(TopBar);