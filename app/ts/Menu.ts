import { remote as electron } from 'electron';
const {app, Menu, MenuItem} = electron;
import { showSettingDialogAction } from './actions'

export default function SetMenu(store) {
    const template = [];

    if (process.platform === 'darwin') {
        template.push({
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
                    label: '推出 Subox',
                    role: 'close',
                    accelerator: 'CmdOrCtrl+Q',
                }
            ]
        })
    }

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu)
}