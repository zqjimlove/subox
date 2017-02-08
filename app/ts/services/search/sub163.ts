import { SearchServiceImpl } from '../SerachSubServiceInterface';
import { remote as electron } from 'electron';
import Request from '../../tools/Request';
import * as util from 'util';
import * as Promise from 'promise';



export default class sub163 extends SearchServiceImpl {
    SEARCH_API = 'http://www.163sub.com/search.ashx?q=%s&lastid=%s'
    DOWNLOAD_API = 'http://www.163sub.com/download/%s'
    private searchToken;
    protected searchFromServer(searchText: string) {
        let lastid = '';
        return this.searchSub(searchText, lastid).then(datas => {
            let result = datas.map((data) => {
                let lang = [];
                this.lang_list.map((ls) => {
                    if (data.otherName2.indexOf(ls) > -1) {
                        lang.push(ls);
                    }
                })
                let robj: SubTitleObj = {
                    id: data.ID,
                    cnName: data.cnName,
                    enName: data.enName,
                    lang: lang
                };
                return robj;
            })
            return result;
        })
    }

    protected searchSub(searchText, lastid, searchTimes = 0, isAbort = false) {
        return new Promise((res => {
            let result = [];
            this.searchToken = () => {
                isAbort = true;
                res(void 0)
            }
            Request.getJSON(util.format(this.SEARCH_API, encodeURI(searchText), lastid)).then(data => {
                if (isAbort) return;
                if (data['Count'] === 0 || data['Data'].length === 0) {
                    res([]);
                    return;
                }
                lastid = data['Data'][data['Data'].length - 1]['linkID'];
                if (data['Data'].length === 10 && searchTimes < 3) {
                    setTimeout(() => {
                        this.searchSub(searchText, lastid, ++searchTimes, isAbort).then((datas) => {
                            result = datas.concat(data['Data']);
                            res(result);
                        })
                    }, 300)
                } else {
                    result = result.concat(data['Data']);
                    res(result);
                }
            })
        }))
    }

    protected getDownloadLink(subTitleObj: SubTitleObj, mediaFileObj: MediaFileObject) {
        let id = subTitleObj.id
        return new Promise((res, rej) => {
            Request.getText(util.format(this.DOWNLOAD_API, id)).then((data) => {
                this.jsdom.env(data, (err, window) => {
                    res(window.document.querySelectorAll('.down_ink.download_link')[0].href);
                })
            })
        })
    }

    public abortSearch() {
        if (!this.searchToken) return;
        this.searchToken();
        this.searchToken = void 0;
    }
}