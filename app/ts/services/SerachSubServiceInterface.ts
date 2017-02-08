import * as Promise from 'promise';
import Unrar from '../tools/Unrar';
import { remote as electron } from 'electron';
import * as Path from 'path';
import * as Http from 'http';
import * as fs from 'fs';
import * as fileType from 'file-type';
import * as unzip from 'unzip';
// import * as RarArchive from 'rarjs';

const jsdom = electron.require('jsdom')
const AdmZip = electron.require('adm-zip')

const subfile_exts = [".srt", ".sub", ".smi", ".ssa", ".ass"];

export interface SearchServiceInterface {
    search(name, isCustromName);
    download(subTitleObj, mediaFileObj, percentCallBack);
}


function getExt(fileName) {
    let tempFileNameArray = Path.basename(fileName).split('.');
    if (tempFileNameArray.length < 3) {
        return Path.extname(fileName);
    } else {
        return '.' + tempFileNameArray.slice(tempFileNameArray.length - 2).join('.');
    }
}


export abstract class SearchServiceImpl implements SearchServiceInterface {
    private getWordRegx = /(\b[A-Z][a-z\-_']+\b)[\.\s]?/g;
    protected lang_list = ['双语', '简体', '繁体', '英文'];
    protected download_path = Path.join(electron.app.getPath('temp'), 'temp_subtitle_download');
    protected jsdom = jsdom;

    public search(name, isCustromName: boolean = false): Promise {
        if (!name) {
            return []
        }
        if (!isCustromName) {
            let keywords = [];
            this.getWordRegx.lastIndex = 0;
            let keyword;
            let matchs;
            while (matchs = this.getWordRegx.exec(name)) {
                keyword = matchs[1]
                keywords.push(keyword);
            }
            let searchText = keywords.slice(0, 2).join(' ');
            return this.searchFromServer(searchText);
        } else {
            return this.searchFromServer(name);
        }

    }
    public download(subTitleObj, mediaFileObj, percentCallBack) {
        this.getDownloadLink(subTitleObj, mediaFileObj).then((link) => {
            return this.downloadFile(subTitleObj.id, link, percentCallBack);
        }).then((downloadObj) => {
            let {type, filePath} = downloadObj;
            if (type) {
                if (type.ext === 'zip') {
                    console.log('unzip')
                    percentCallBack('解压中')
                    this.unzipFile(filePath, mediaFileObj).then(() => {
                        percentCallBack('下载完成')
                    })
                }
                if (type.ext === 'rar') {
                    console.log('unrar')
                    percentCallBack('解压中')
                    this.unrarFile(filePath, mediaFileObj).then(() => {
                        percentCallBack('下载完成')
                    })
                }
            } else {
                fs.createReadStream(filePath).pipe(fs.createWriteStream(Path.join(Path.dirname(mediaFileObj.path), mediaFileObj.name + getExt(filePath))));
                percentCallBack('下载完成')
            }
        });
    }
    private unzipFile(filePath, mediaFileObj) {
        return new Promise((res, rej) => {
            var zip = new AdmZip(filePath);
            var zipEntries = zip.getEntries(); // an array of ZipEntry records

            zipEntries.forEach(function (zipEntry) {
                var fileName = zipEntry.entryName;
                if (subfile_exts.indexOf(Path.extname(fileName)) > -1)
                    fs.writeFile(Path.join(Path.dirname(mediaFileObj.path), mediaFileObj.name + getExt(fileName)), zip.readFile(zipEntry), (err) => {
                        err && console.error(err)
                    })
            });
            res()
        })
    }
    private unrarFile(filePath, mediaFileObj) {
        return new Promise((res, rej) => {
            let outdir = Unrar.unrar(filePath);
            let files = fs.readdirSync(outdir);
            files.forEach((file) => {
                let path = Path.join(outdir, file);
                let stat = fs.lstatSync(path);
                if (stat.isFile() && subfile_exts.indexOf(Path.extname(file)) > -1) {
                    fs.createReadStream(path).pipe(fs.createWriteStream(Path.join(Path.dirname(mediaFileObj.path), mediaFileObj.name + getExt(file))));
                }
            })
            res()
        })
    }
    private downloadFile(id, link, percentCallBack) {
        return new Promise((res, rej) => {
            try {
                let type;
                !fs.existsSync(this.download_path) && fs.mkdirSync(this.download_path);
                let filename = Path.basename(link);
                let filePath = Path.join(this.download_path, filename);
                var filews = fs.createWriteStream(filePath);
                var request = Http.get(link, function (response) {
                    let totalLength = response.headers['content-length'];
                    let curLength = 0;
                    let isGetType = false;
                    response.pipe(filews);
                    response.on('data', (chunk) => {
                        if (!isGetType) {
                            type = fileType(chunk);
                            isGetType = true;
                        }
                        curLength += chunk.length;
                        if (totalLength) {
                            percentCallBack(Math.floor(curLength / totalLength * 100) + '%')
                        } else {
                            percentCallBack('已下：' + Math.floor(curLength / 1024) + 'k')
                        }

                    })
                    filews.on('finish', () => {
                        filews.close();
                        res({
                            filePath: filePath, type: type
                        })
                    })
                });
            } catch (e) {
                console.error(e);
                rej(e);
            }
        })
    }
    protected abstract getDownloadLink(subTitleObj: SubTitleObj, mediaFileObj: MediaFileObject);
    protected abstract searchFromServer(searchText): Promise;
    public abstract abortSearch();
}
