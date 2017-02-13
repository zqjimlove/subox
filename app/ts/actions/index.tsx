import Db from '../Db';
import FileWatch from '../services/FileWatch';

let filewatch = FileWatch.singleWatcher;

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

export const changeSettingAction = (setting: Setting) => {
    if (filewatch && (filewatch.getPath() !== setting.mediaPath || filewatch.getIgnoredRules() !== setting.ignoredRules)) {
        filewatch.stop();
        filewatch = new FileWatch(setting.mediaPath, setting.ignoredRules);
    }

    if (!filewatch) {
        filewatch = new FileWatch(setting.mediaPath, setting.ignoredRules);
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

export const mediaFilterChange = (str) => {
    return {
        type: 'MEDIA_FILTER',
        words: str
    }
}