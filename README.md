## Subox

Subox是一个基于 [Electron](http://electron.atom.io/) 开发的以媒体资源文件为基础的字幕搜索桌面应用。可根据设定的搜索目录和忽略路径索引所有可播放的资源文件，并且以文件名为基础索引字幕文件或者辅助搜索字幕文件并下载。

所有字幕数据通过 [163sub](http://www.163sub.com/) 等服务网站获取。


![预览](http://77g16l.com1.z0.glb.clouddn.com/QQ20170213-144842.png)

## 下载

[点击跳转下载页面](https://github.com/zqjimlove/subox/releases)

## 开发提示

#启动Electron#

`npm start`

#实时编译#

`webpack --watch`

### 打包

`npm run build`

打包方案事采用了 [electron-builder](https://github.com/electron-userland/electron-builder) 的支持，现在已经集成了 `WINDOW` `MAC` 的方案。

可以通过修改 `electron.build.js` 中的逻辑实现个性化的打包方案。
