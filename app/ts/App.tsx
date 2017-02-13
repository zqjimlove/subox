/// <reference path="./App.d.ts" />


import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from 'react-redux';

import reduxStore from './ReduxConfig';

import '../style/foundation.min.css';
import '../style/style.scss';

import Main from './modules/Main';
import FileWatch from './services/FileWatch';

import SetMenu from './Menu';

import CheckUpdate from './services/CheckUpdate';


CheckUpdate.check();
SetMenu(reduxStore);
FileWatch.store = reduxStore;

export default class App {
    static app() {
        ReactDOM.render(<Provider store={reduxStore}><Main /></Provider>, document.getElementById('App'));
    }
}
App.app();