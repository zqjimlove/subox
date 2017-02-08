import Db from '../Db';
import FileWatch from '../services/FileWatch';

let filewatch: FileWatch;

export const showSettingDialogAction = () => {
    return {
        type: 'SETTING_DIALOG_DISPLAY',
        display: true
    }
}

export const closeSettingDialogAction = () => {
    return {
        type: 'SETTING_DIALOG_DISPLAY',
        display: false
    }
}

export const changeMediaPathAction = (setting) => {
    if (filewatch && filewatch.path !== setting.mediaPath) {
        filewatch.stop();
        filewatch = new FileWatch(setting.mediaPath);
    }

    if (!filewatch) {
        filewatch = new FileWatch(setting.mediaPath);
    }

    return {
        type: 'CHANGE_SETTING',
        setting: setting
    }
}

export const updateMediaFiles = (files) => {
    return {
        type: 'UPDATE_MEDIA_FILES',
        files: files
    }
}


export const searchSubTitle = (mediaFile) => {
    return {
        type: 'SEARCH_SUBTITLE',
        mediaFile: mediaFile
    }
}