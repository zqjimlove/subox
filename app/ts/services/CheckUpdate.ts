import { remote as electron } from 'electron';
import Request from '../tools/Request';
import { asarVersion } from '../../../package.json';
import * as Https from 'https';
import * as fs from 'fs';
import * as Promise from 'promise';
import * as Path from 'path';

import * as asar from 'asar';
// const asar = electron.require('asar');

const checkUrl = 'https://raw.githubusercontent.com/zqjimlove/subox/1.0.0/package.json';
const AppJSUrl = 'https://cdn.rawgit.com/zqjimlove/subox/1.0.0/app/App.js';
const AppJSPaht = Path.join(electron.app.getAppPath(), '../app.asar.unpacked/', '/app', '/App.js');
const curAsarVersion = parseInt(asarVersion.replace('.', ''))


export default class CheckUpdate {
    static check() {
        Request.getJSON(checkUrl).then((data) => {
            try {
                let lastAsarVersion = parseInt(data.asarVersion.replace('.', ''));
                if (lastAsarVersion > curAsarVersion) {
                    CheckUpdate.update();
                }
            } catch (err) {
                console.log(err)
            }
        }, (err) => {
            console.log(err);
        })
    }
    private static downloadJS() {
        // Request.getText(AppJSUrl).then(console.log.bind(console));
        return new Promise((res, rej) => {
            let path = Path.join(electron.app.getPath('temp'), 'App.js');

            var filews = fs.createWriteStream(path);
            var request = Https.get(AppJSUrl, function (response) {
                let totalLength = response.headers['content-length'];
                let curLength = 0;
                let isGetType = false;
                response.pipe(filews);
                filews.on('finish', () => {
                    filews.close();
                    res(path)
                })
            });
        })
    }
    private static update() {
        console.log('发现新的脚本，开始更新。')
        this.downloadJS().then((filepath) => {
            console.log('脚本下载完成，开始替换。')
            fs.createReadStream(filepath).pipe(fs.createWriteStream(AppJSPaht));

            let {dialog, BrowserWindow} = electron.remote;

            dialog.showMessageBox(BrowserWindow.getFocusedWindow(), {
                type: 'question',
                buttons: [
                    '重启', '暂时不重启'
                ],
                title: '有新的更新',
                content: 'Subox 更新了脚本，是否现在就重启？',
                cancelId: 1
            }, (res) => {
                if (res === 0) {
                    electron.BrowserWindow.getFocusedWindow().reload();
                }
            });
        }, alert.bind(window))
    }
}