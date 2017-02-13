import * as React from "react";

import { connect } from 'react-redux';
import A from '../components/SheelA';

import * as Logo from '../../img/subox.png';



class AboutDialog extends React.Component<{ dispatch: Function, show: boolean }, undefined> {
    componentDidMount() {

    }
    closeHander() {
        this.props.dispatch({
            type: 'dosth',
            do: {
                key: 'aboutDialogDisplay',
                value: false
            }
        })
    }
    render() {
        if (!this.props.show) {
            return null;
        } else {
            return (<div style={{ display: 'block' }} className="reveal-overlay">
                <div style={{ display: 'block' }} className="reveal" id="aboutDialog" data-reveal>
                    <p className="about-title">关于 Subox</p>
                    <div className="float-left">
                        <img src={Logo} alt="" />
                    </div>
                    <p>
                        Subox是一个以媒体资源文件为基础的字幕搜索软件。可根据设定的搜索目录和忽略路径索引所有可播放的资源文件，并且以文件名为基础索引字幕文件或者辅助搜索字幕文件并下载。
                    </p>
                    <p>
                        所有字幕数据通过 <A href="http://www.163sub.com/">163sub</A> 等服务网站获取。
                    </p>
                    <p>
                        Subox 是基于 <A href="https://nodejs.org/zh-cn/">Node.js</A>、<A href="http://electron.atom.io/">Electron</A> 开发的一款跨平台开源桌面软件。
                    </p>
                    <p>
                        开源地址 <A href="https://github.com/zqjimlove/subox">https://github.com/zqjimlove/subox</A>
                    </p>
                    <p className="about-title">关于作者</p>
                    <p>
                        身在大中国广州，职业码农，前端汉子。
                    </p>
                    <p>
                        博客：<A href="https://inwoo.me">https://inwoo.me</A><br />
                        联系邮箱：<A href="mailTo:zqjimlove@gmail.com">zqjimlove@gmail.com</A> <br />
                        Github：<A href="https://github.com/zqjimlove">https://github.com/zqjimlove</A>
                    </p>
                    <button onClick={this.closeHander.bind(this)} className="close-button" data-close aria-label="Close modal" type="button">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
            </div>);
        }

    }
}


function mapStateToProps(state) {
    return {
        show: state.common.aboutDialogDisplay
    }
}

export default connect(mapStateToProps)(AboutDialog);