import { remote as electron } from 'electron';
import * as path from 'path';

import * as nedb from 'nedb';

const userDataDir = electron.app.getPath('userData');

const Db = {
    common: new nedb({
        filename: path.join(userDataDir, 'common.db'),
        autoload:true
    })
};

export default Db;

