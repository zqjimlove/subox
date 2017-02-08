import { remote as electron } from 'electron';
import { updateMediaFiles } from '../actions'
import * as Path from 'path';
import * as fs from 'fs';
import * as assign from 'object-assign';

const chokidar = electron.require('chokidar');

const mediaExtReg = /(avi|wmv|asf|wmvhd|vob|mpg|mpeg|mp4|3gp|3g2|mkv|rm|rmvb|mov|qt|ogg|ogv|oga|mod)$/;
const subExtReg = /(\..*)?\.(sub|sst|son|srt|ssa|ass|smi|psb|pjs|stl|tts|vsf|zeg)$/;
const subMediaMathReg = /^(\..*)?$/;



export default class FileWatchService {
    public static store = void 0;
    public static singleWatcher: FileWatchService = void 0;
    public path;
    private watcher;
    private mediaFileMap;
    private subFilesArray = [];
    private dispatchTimer;
    private dispatchDely = 2000;
    constructor(path) {
        this.path = path;

        this.mediaFileMap = FileWatchService.store.getState().mediaFileMap || {};

        if (this.watcher) {
            this.watcher.stop();
        }

        this.watcher = electron.watcher = chokidar.watch(path, 'file, dir, glob, or array', {
            persistent: true
        });

        this.watcher
            .on('add', this.onAdded.bind(this))
            .on('unlink', this.onRemoved.bind(this))
        FileWatchService.singleWatcher = this;
    }
    private onRemoved(path) {
        if (mediaExtReg.test(path)) {
            this.removeMediaFiles(path)
        } else if (subExtReg.test(path)) {
            this.removeSubFiles(path)
        }
    }
    private onAdded(path) {
        if (mediaExtReg.test(path)) {
            this.addMediaFiles(path)
        } else if (subExtReg.test(path)) {
            this.addSubFiles(path)
        }

        // FileWatchService.store.dispatch(addMediaFiles(obj));
    }
    private removeMediaFiles(path) {
        let mediaName = Path.parse(path).name;
        delete this.mediaFileMap[mediaName];
        this.dispatch();
    }
    private removeSubFiles(path) {
        this.subFilesArray.splice(this.subFilesArray.indexOf(path), 1);
        this.dispatch();
    }
    private addMediaFiles(path) {
        let mediaName = Path.parse(path).name;
        let obj: MediaFileObject = {
            path: path,
            name: mediaName,
            subs: [],
            birthtime: +fs.statSync(path).birthtime
        }
        this.mediaFileMap[mediaName] = obj;
        this.dispatch();
    }
    private addSubFiles(path) {
        this.subFilesArray.push(path);
        this.dispatch();
    }
    private matchSubFileName(subName: string, mediaName: string) {
        subName = subName.trim();
        mediaName = mediaName.trim();
        if (subName.length >= mediaName.length && subName.indexOf(mediaName) === 0 && subMediaMathReg.test(subName.substr(mediaName.length))) {
            return true;
        } else {
            return false;
        }
    }
    private dispatch() {
        if (this.dispatchTimer) {
            clearTimeout(this.dispatchTimer);
        }
        this.dispatchTimer = setTimeout(() => {
            let result = [];
            let mediaFileMap = this.mediaFileMap;
            for (let mediaName in mediaFileMap) {
                mediaFileMap[mediaName].subs = [];
                this.subFilesArray.filter((subFilePath) => {
                    if (Path.dirname(subFilePath) !== Path.dirname(mediaFileMap[mediaName].path)) {
                        return true;
                    }
                    let subName = Path.parse(subFilePath).name;

                    if (this.matchSubFileName(subName, mediaName)) {
                        let subs = mediaFileMap[mediaName].subs;
                        subs.push(subFilePath);
                        mediaFileMap[mediaName].subs = subs;
                        return false;
                    }
                    return true;
                });
                result.push(mediaFileMap[mediaName]);
            }
            this.__doDispatch(result);
        }, this.dispatchDely);
    }
    private __doDispatch(mediaFileObjects) {
        FileWatchService.store.dispatch(updateMediaFiles(mediaFileObjects))
    }
    public stop() {
        this.watcher.close();
    }
}