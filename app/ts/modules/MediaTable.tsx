import * as React from "react";
import { connect } from 'react-redux'

import { searchSubTitle } from '../actions'

function natcmp(a, b) {
    var ra = a.match(/\D+|\d+/g);
    var rb = b.match(/\D+|\d+/g);
    var r = 0;

    while (!r && ra.length && rb.length) {
        var x = ra.shift(), y = rb.shift(),
            nx = parseInt(x), ny = parseInt(y);

        if (isNaN(nx) || isNaN(ny))
            r = x > y ? 1 : (x < y ? -1 : 0);
        else
            r = nx - ny;
    }
    return r || ra.length - rb.length;
}


class MediaTable extends React.Component<{ dispatch: Function, files: Array<MediaFileObject>, setting: any, filterWrods: string }, undefined> {

    clickDownloadHandler(mediaObj) {
        this.props.dispatch(searchSubTitle(mediaObj))
    }
    renderMediaFilesList() {
        let {mediaPath} = this.props.setting;
        let resultHtml = [];
        // console.log(this.props.files)
        let files = this.props.files.sort((a, b) => {
            if (a.subs.length === 0 || b.subs.length === 0) {
                return a.subs.length - b.subs.length;
            } else {
                return natcmp(a.name, b.name);
            }
        });

        files.forEach((mediaObj) => {
            let path = mediaObj.path.replace(mediaPath, '');
            if (this.props.filterWrods && path.toLowerCase().indexOf(this.props.filterWrods.toLowerCase()) < 0) {
                return true;
            }
            path = path.substr(0, path.indexOf(mediaObj.name));

            resultHtml.push(
                <tr key={mediaObj.name}>
                    <td>
                        <b>{mediaObj.name}</b>
                        <p className="media-table__path">所在路径：{path}</p>
                    </td>
                    <td>{(mediaObj.subs && mediaObj.subs.length) || <span style={{ color: '#cc4b37' }}>0</span>}</td>
                    <td>
                        <a onClick={() => { this.clickDownloadHandler(mediaObj) }} href="javascript:;">搜索</a>
                    </td>
                </tr>
            )
        })
        return resultHtml;
    }
    render() {
        return (
            <table className="hover">
                <thead>
                    <tr>
                        <th>视频名称</th>
                        <th width="60">字幕</th>
                        <th width="60">操作</th>
                    </tr>
                </thead>
                <tbody>
                    {this.renderMediaFilesList()}
                </tbody>
            </table>
        );
    }
}

function mapStateToProps(state) {
    return {
        files: state.common.files || [],
        setting: state.common.setting || {},
        filterWrods: state.common.mediaFilter
    }
}


export default connect(mapStateToProps)(MediaTable);