// var packager = require('electron-packager')
// var path = require('path');
// packager({
//     name: 'Subox',
//     dir: __dirname,
//     all: false,
//     platform: "mas,win32",
//     arch: "all",
//     ignore: [
//         'build', 'app/ts', 'app/style', 'typings.json', 'tsconfig.json', 'webpack.config.js',
//         'app/App.js.map'
//     ],
//     out: path.join(__dirname, 'build'),
//     icon: path.join(__dirname, 'icons/icon'),
//     overwrite: true
// }, function done_callback(err, appPaths) {
//     console.error(err)
// });



var electronInstaller = require('electron-winstaller');
var resultPromise = electronInstaller.createWindowsInstaller({
    appDirectory: './build/Subox-win32-x64',
    outputDirectory: './build/installer/',
    authors: 'https://inwoo.me',
    exe: 'Subox.exe'
});

resultPromise.then(() => console.log("It worked!"), (e) => console.log(`No dice: ${e.message}`));