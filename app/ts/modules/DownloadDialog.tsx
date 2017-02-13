import { remote as electron } from 'electron';
import * as React from "react";
import { connect } from 'react-redux';
import Db from '../Db';
import * as assign from 'object-assign';
import * as Path from 'path';
import SearchSubService from '../services/SearchSubService';

import Loading from '../components/Loading';

class DownloadDialog extends React.Component<{ show: boolean, dispatch: Function, mediaFile: MediaFileObject }, any> {
    private isMediaPathChange: boolean = false;
    private mediaName;
    private searchText;
    private searchInput: HTMLInputElement;
    constructor() {
        super();
        this.state = {};
    }
    mediaWillChange() {
        if (this.props.mediaFile && this.mediaName !== this.props.mediaFile.name) {
            this.mediaName = this.props.mediaFile.name;
            if (this.mediaName) {
                this.searchText = this.mediaName;
                SearchSubService.default.search(this.mediaName).then(datas => {
                    this.setState({
                        subs: datas
                    })
                });
            }

        }
    }
    closeHandler() {
        SearchSubService.default.abortSearch();
        this.props.dispatch({
            type: 'CLOSE_SEARCH_SUBTITLE'
        });
        this.setState({
            subs: void 0
        })
        this.searchInput.value = '';
        this.mediaName = void 0;
        this.searchText = void 0;
    }
    downloadHandler(subTitleObj) {
        let key = subTitleObj.cnName + '_' + subTitleObj.id;
        let donwloadState = {};
        SearchSubService.default.download(subTitleObj, this.props.mediaFile, (percent) => {
            donwloadState[key] = percent;
            this.setState({
                downloadStatus: assign({}, this.state.downloadStatus, donwloadState)
            });
        });

        donwloadState[key] = '开始下载';
        this.setState({
            downloadStatus: assign({}, this.state.downloadStatus, donwloadState)
        });
    }
    searchInputKeypressHandler(event) {
        if (event.keyCode === 13) {
            this.searchHanlder();
        }
    }
    searchHanlder() {
        let q = this.searchInput.value;
        if (q.trim().length > 0 && this.searchText !== q) {
            this.searchText = q;
            this.setState({
                subs: void 0
            })
            SearchSubService.default.search(this.searchText, true).then(datas => {
                this.setState({
                    subs: datas
                })
            });
        }
    }
    renderSubTable() {
        if (this.props.mediaFile && this.state.subs) {
            let result = [];
            let {downloadStatus} = this.state;
            this.state.subs.map((sub: SubTitleObj) => {
                // console.log(downloadStatus[sub.cnName + '_' + sub.id])
                result.push(
                    <tr key={sub.cnName + '_' + sub.id}>
                        <td>{sub.cnName}</td>
                        <td className="download-dialog-lables">
                            {sub.lang.map(l => {
                                return <span key={sub.id + '_' + l} className="label tiny-label">{l}</span>
                            })}
                        </td>
                        <td>
                            {(downloadStatus && downloadStatus[sub.cnName + '_' + sub.id]) ?
                                downloadStatus[sub.cnName + '_' + sub.id] : <a onClick={this.downloadHandler.bind(this, sub)} href="javascript:;">下载</a>
                            }
                        </td>
                    </tr>
                )
            });
            if (result.length > 0) {
                return (
                    <div className="download-dialog-table">
                        <table className="hover">
                            <thead>
                                <tr>
                                    <td>字幕名</td>
                                    <td width="120">标签</td>
                                    <td width="100">操作</td>
                                </tr>
                            </thead>
                            <tbody>
                                {result}
                            </tbody>
                        </table>
                    </div>
                )
            } else {
                return <div className="empty">暂时没找到该电影字幕，或者试试自定义搜索</div>
            }

        } else {
            return <Loading />;
        }
    }
    render() {
        this.mediaWillChange();
        let {mediaFile} = this.props;
        let parentDir = '';
        if (mediaFile) {
            parentDir = Path.dirname(mediaFile.path);
            parentDir = parentDir.substr(parentDir.lastIndexOf('/'))
        }

        return (
            <div style={{ display: this.props.show ? 'block' : 'none' }} className="reveal-overlay">
                <div style={{ display: this.props.show ? 'block' : 'none' }} className="reveal large" data-reveal>

                    <div className="top-bar download-dialog-header">
                        <div style={{ width: '40%' }} className="top-bar-left">
                            <div className="top-bar-title download-dialog-header_title">{mediaFile && mediaFile.name}</div>
                        </div>
                        <div className="top-bar-right">
                            <ul className="menu">
                                <li><input onKeyPress={(e) => { this.searchInputKeypressHandler(e.nativeEvent) }} ref={(searchInput) => { this.searchInput = searchInput }} type="search" placeholder="自定义搜索" /></li>
                                <li><button onClick={this.searchHanlder.bind(this)} type="button" className="button">搜索</button></li>
                                <li> <button onClick={this.closeHandler.bind(this)} type="button" className="button alert">关闭</button></li>
                            </ul>
                        </div>
                    </div>
                    {this.renderSubTable()}
                    <p className="download-dialog-status">
                        {this.state.subs ? `搜索到 ${this.state.subs.length} 条结果` : '努力搜索中'}
                        <span className="float-right">{parentDir}</span>
                    </p>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        show: state.common.downloadDialogDisplay,
        mediaFile: state.common.mediaFile
    }
}

export default connect(mapStateToProps)(DownloadDialog);