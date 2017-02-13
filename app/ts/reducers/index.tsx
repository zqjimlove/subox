import { combineReducers } from 'redux';
import * as assign from 'object-assign';

const common = (state = {}, action) => {
    switch (action.type) {
        case 'SETTING_DIALOG_DISPLAY':
            return assign({}, state, {
                settingDialogDisplay: action.display
            });
        case 'CHANGE_SETTING':
            return assign({}, state, {
                setting: action.setting
            });
        case 'UPDATE_MEDIA_FILES':
            return assign({}, state, {
                files: action.files
            });
        case 'SEARCH_SUBTITLE':
            return assign({}, state, {
                mediaFile: action.mediaFile,
                downloadDialogDisplay: true
            })
        case 'CLOSE_SEARCH_SUBTITLE':
            return assign({}, state, {
                mediaFile: void 0,
                downloadDialogDisplay: false
            })
        case 'MEDIA_FILTER':
            return assign({}, state, {
                mediaFilter: action.words
            })
        default:
            if (action.do && action.do.key) {
                let dosth = {};
                dosth[action.do.key] = action.do.value
                return assign({}, state, dosth);
            }
            return state;
    }
}

const AppReducers = combineReducers({
    common
})

export default AppReducers