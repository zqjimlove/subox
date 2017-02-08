import * as React from "react";
import { Link, Button, Colors } from "react-foundation";
import { connect } from 'react-redux'

import { showSettingDialogAction } from '../actions'

import { Setting } from './SettingDialog';

class TopBar extends React.Component<{ dispatch: Function, setting: Setting }, undefined> {
    showSetingDialogHandler() {
        this.props.dispatch(showSettingDialogAction());
    }
    render() {
        return (
            <div id="topBar">
                <div className="top-bar">
                    <div className="top-bar-left">
                        <div className="top-bar-title top-bar_title">
                            Subox
                        </div>
                        {/*<ul className="menu" data-dropdown-menu>
                            <li className="menu-text">SubTitle</li>
                        </ul>*/}
                    </div>
                    <div className="top-bar-right">
                        <ul className="menu">
                            <li>
                                <Button onClick={() => { this.showSetingDialogHandler() }}>设置</Button>
                            </li>
                        </ul>
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