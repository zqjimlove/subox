import * as React from "react";
import { connect } from 'react-redux'

import TopBar from './TopBar'
import SettingDialog from './SettingDialog'
import MediaTable from './MediaTable'
import DownloadDialog from './DownloadDialog';
import AboutDialog from './AboutDialog';
import Db from '../Db';

import { changeSettingAction } from '../actions'

// export interface HelloProps { compiler: string; framework: string; }

class Main extends React.Component<{ dispatch: Function }, undefined> {
    componentDidMount() {
        Db.common.findOne({ _id: 'setting' }, (err, doc) => {
            if (err) alert(`读取配置出错：${err}`);
            else if (doc) {
                delete doc._id;
                this.props.dispatch(changeSettingAction(doc));
            }
        })
    }
    render() {
        return (<div>
            <TopBar />
            <MediaTable />
            <SettingDialog />
            <DownloadDialog />
            <AboutDialog />
        </div>);
    }
}

export default connect()(Main)