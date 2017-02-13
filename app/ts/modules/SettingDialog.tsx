import { remote as electron } from 'electron';
import * as React from "react";
import { connect } from 'react-redux';
import { closeSettingDialogAction, changeSettingAction } from '../actions';
import Db from '../Db';
import A from '../components/SheelA';

class SettingDialog extends React.Component<{ show: boolean, dispatch: Function, setting: Setting }, Setting> {
    private isMediaPathChange: boolean = false;
    private ignoredRulesInput: HTMLInputElement;
    constructor() {
        super();
        this.state = {};
    }
    componentWillReceiveProps() {
        this.props.setting && this.setState(this.props.setting);
    }
    hideDialogHandler() {
        this.props.dispatch(closeSettingDialogAction())
    }
    saveSettingHandler() {
        Db.common.update({ _id: 'setting' }, { _id: 'setting', ...this.state }, { upsert: true }, (err) => {
            if (err) alert(`Save setting error:${err}`);
            else {
                this.props.dispatch(changeSettingAction(this.state))
                this.props.dispatch(closeSettingDialogAction())
                // if (this.isMediaPathChange) {
                //     this.props.dispatch(updateMediaFiles(MediaFind.find(this.state.mediaPath)))
                // }
            }
        });
    }
    selectMediaDirectoryHandler() {
        let {dialog, BrowserWindow} = electron;
        let mediaPath = dialog.showOpenDialog(BrowserWindow.getFocusedWindow(), {
            properties: ['openDirectory']
        });
        if (mediaPath && mediaPath.length > 0) {
            this.isMediaPathChange = true;
            this.setState({
                mediaPath: mediaPath[0]
            });
        }
    }
    ignoredRulesInputChangeHandler(...args) {
        this.setState({
            ignoredRules: this.ignoredRulesInput.value.toString()
        })
    }
    render() {
        let {mediaPath, ignoredRules} = this.state;
        return (
            <div style={{ display: this.props.show ? 'block' : 'none' }} className="reveal-overlay">
                <div style={{ display: this.props.show ? 'block' : 'none' }} className="reveal" id="settingDialog" data-reveal>
                    <div className="row">
                        <div className="medium-12 columns">
                            <div className="input-group">
                                <input className="input-group-field" type="text" placeholder="媒体目录" readOnly value={mediaPath || ''} />
                                <div className="input-group-button">
                                    <button type="button" className="button" onClick={this.selectMediaDirectoryHandler.bind(this)} >选择</button>
                                </div>
                            </div>
                            <p className="help-text">填写电影或剧集存放的绝对路径，软件将会检测目录下所有多媒体文件并匹配字幕</p>
                        </div>
                    </div>
                    <div className="row">
                        <div className="medium-12 columns">
                            <label htmlFor="ignoredRules">
                                文件忽略规则
                                 <input onChange={this.ignoredRulesInputChangeHandler.bind(this)} ref={(input) => { this.ignoredRulesInput = input }} type="text" id="ignoredRules" placeholder="文件忽略规则" value={ignoredRules || ''} />
                            </label>
                            <p className="help-text">
                                请查看<A href="https://github.com/isaacs/node-glob#glob-primer">文件过滤规则</A>，以半角字符“ | ”分割多个规则。
                            </p>
                        </div>
                    </div>
                    {/*<div className="row">
                        <div className="medium-12 columns">
                            <label>默认字幕服务
                                <select>
                                    <option value="163sub">163sub</option>
                                </select>
                            </label>
                        </div>
                    </div>*/}
                    <div className="row">
                        <div className="medium-12 columns text-center button-group">
                            <button onClick={this.hideDialogHandler.bind(this)} type="button" className="button alert">关闭</button>
                            <button onClick={this.saveSettingHandler.bind(this)} type="button" className="button">保存</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        show: state.common.settingDialogDisplay,
        setting: state.common.setting
    }
}

export default connect(mapStateToProps)(SettingDialog);

