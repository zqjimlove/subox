
import * as fs from 'fs';
import * as Path from 'path';

const mediaExtReg = /(avi|wmv|asf|wmvhd|vob|mpg|mpeg|mp4|3gp|3g2|mkv|rm|rmvb|mov|qt|ogg|ogv|oga|mod)$/;
const subExtReg = /(sub|sst|son|srt|ssa|ass|smi|psb|pjs|stl|tts|vsf|zeg)$/;


function walkMediaFile(mediaFiles, subFiles, path) {
    var dirList = fs.readdirSync(path);
    dirList.forEach(function (item) {
        let filePath = Path.join(path, item)
        if (fs.statSync(filePath).isDirectory()) {
            walkMediaFile(mediaFiles, subFiles, filePath);
        } else if (mediaExtReg.test(filePath)) {
            let mediaName = Path.parse(filePath).name;
            mediaFiles[mediaName] = {
                path: filePath,
                name: mediaName
            };
        } else if (subExtReg.test(filePath)) {
            subFiles.push(filePath);
        }
    });
}

function matchSubFile(mediaFiles, subfiles: Array<string>) {
    let result = [];
    for (let mediaName in mediaFiles) {
        subfiles.filter((subFilePath) => {
            let subName = Path.parse(subFilePath).name;
            subName = subName.substr(0, subName.lastIndexOf('.'));
            if (subName === mediaName) {
                let subs = mediaFiles[mediaName].subs || [];
                subs.push(subFilePath);
                mediaFiles[mediaName].subs = subs;
                return false;
            }
            return true;
        });
        result.push(mediaFiles[mediaName]);
    }
    return result;
}

export default class MediaFind {
    static find = (path: string) => {
        let mediaFiles: any = {};
        let subfiles = [];
        walkMediaFile(mediaFiles, subfiles, path);
        return matchSubFile(mediaFiles, subfiles);;
    }
}