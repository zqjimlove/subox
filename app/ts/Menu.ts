import { remote as electron } from 'electron';
const {app, Menu, MenuItem} = electron;
import { showSettingDialogAction } from './actions'

export default function SetMenu(store) {
    const template = [];


    template.push({
        label: '编辑',
        submenu: [
            { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
            { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" }
        ]
    });


    if (process.platform === 'darwin') {
        template.unshift({
            label: app.getName(),
            submenu: [
                {
                    label: '关于 Subox',
                    // role: 'about',
                    click() {
                        store.dispatch({
                            type: 'dosth',
                            do: {
                                key: 'aboutDialogDisplay',
                                value: true
                            }
                        })
                    }
                },
                {
                    type: 'separator'
                },
                {
                    label: '设置',
                    role: 'setting',
                    click() {
                        store.dispatch(showSettingDialogAction())
                    }
                },
                {
                    type: 'separator'
                },
                {
                    label: '退出 Subox',
                    role: 'close',
                    accelerator: 'CmdOrCtrl+Q',
                }
            ]
        })
    } else {
        template.push({
            label: '选项',
            submenu: [
                {
                    label: '设置',
                    role: 'setting',
                    click() {
                        store.dispatch(showSettingDialogAction())
                    }
                }
            ]
        })
        template.push({
            label: '帮助',
            submenu: [
                {
                    label: '关于 Subox',
                    // role: 'about',
                    click() {
                        store.dispatch({
                            type: 'dosth',
                            do: {
                                key: 'aboutDialogDisplay',
                                value: true
                            }
                        })
                    }
                }
            ]
        });
    }

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu)
}