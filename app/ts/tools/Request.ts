
import * as URL from 'url';
import * as  fetch from 'node-fetch';

function get(url) {
    console.log('请求：' + url)
    let _url = URL.parse(url);
    return fetch(url, {
        headers: {
            'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36',
            'referer': _url.protocol + _url.host
        }
    })
}

const Request = {
    getJSON: (url) => {
        return get(url).then(res => {
            return res.json();
        })
    },
    getText: (url) => {
        return get(url).then(res => {
            return res.text();
        })
    }
}

export default Request;