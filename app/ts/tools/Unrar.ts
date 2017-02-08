import { remote as electron } from 'electron';
import * as Path from 'path';
import * as fs from 'fs';

let unrarPath = Path.join(electron.app.getAppPath(), 'unrar', process.platform, process.arch, process.platform === 'win32' ? 'unrar.exe' : 'unrar')

const childProcess = electron.require('child_process');
const {spawn, spawnSync, execSync} = childProcess


export default class Unrar {
    static unrar(archive) {
        let basedir = Path.dirname(archive);
        let outdir = Path.join(basedir, Path.basename(archive, Path.extname(archive)));
        !fs.existsSync(outdir) && fs.mkdirSync(outdir);
        spawnSync(unrarPath, ['e', archive, outdir]);
        return outdir;
    }
}

// //spawn.sync(electron.app.path7zip, ['e', '"~/Downloads/ef39ca22-816c-4c64-affd-caf51084aa25.rar"', '-o'], { stdio: 'inherit' })
// var run = spawn(unrarPath, ['l', '/Users/inwoo/Downloads/ef39ca22-816c-4c64-affd-caf51084aa25.rar']);
// // console.log(run);
// run.stdout.on('data', (data) => {
//     console.log(data.toString())
// })
// run.stderr.on('data', (data) => {
//     console.log(`stderr: ${data}`);
// });
// run.on('close', (code) => {
//     console.log(`child process exited with code ${code}`);
// });