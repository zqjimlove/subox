process.env.NODE_ENV = 'production';

var webpack = require("webpack");
var webpackConfig = require('./webpack.config');
var path = require('path');
var Promise = require('Promise');



var builder = require("electron-builder")
var Platform = builder.Platform

function buildTypeScript() {
    return new Promise(function(res, rej) {
        webpack(webpackConfig, function(err, stats) {
            if (!err) res();
            else {
                console.error(err);
                rej()
            }
        })
    })
}

function packagerApp() {
    return new Promise(function(res, rej) {
        packager({
            name: 'Subox',
            dir: __dirname,
            all: false,
            platform: "mas,win32",
            arch: "all",
            ignore: [
                'build', 'app/ts', 'app/style', 'typings.json', 'tsconfig.json', 'webpack.config.js',
                'app/App.js.map'
            ],
            out: path.join(__dirname, 'build'),
            icon: path.join(__dirname, 'icons/icon'),
            overwrite: true
        }, function done_callback(err, appPaths) {
            if (!err) res();
            else {
                console.error(err);
                rej()
            }
        });
    })
}

var builderConfig = {
    appId: 'net.inwoo.subox',
    productName: 'Subox',
    npmRebuild: false,
    asarUnpack: ['**/app/App.js'],
    files: [
        '!**/app/{ts,img,style}',
        '!**/dist',
        '!**/{tsconfig,typings}.json',
        '!electron.build.js',
        '!webpack.config.js',
    ],
    mac: {

    },
    dmg: {
        contents: [{
                "x": 180,
                "y": 440
            },
            {
                "x": 415,
                "y": 440,
                "type": "link",
                "path": "/Applications"
            }
        ]
    },
    publish: {
        provider: 'github'
    },
    nsis: {
        oneClick: false,
        allowToChangeInstallationDirectory: true,
        artifactName: '${productName}_${version}_Setup.${ext}'
    }
};

function buildMac() {
    return builder.build({
        targets: Platform.MAC.createTarget(),
        config: builderConfig,
        x64: true,
        ia32: true
    });
}


function buildWin() {
    return builder.build({
        targets: Platform.WINDOWS.createTarget(),
        config: builderConfig,
        x64: true,
        ia32: true
    });
}

var logE = console.error.bind(console)
buildTypeScript().then(buildMac, logE).then(buildWin, logE).then(() => {}, logE);
// buildMac()