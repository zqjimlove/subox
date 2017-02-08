
import { applyMiddleware, createStore } from 'redux';
import thunkMiddleware from 'redux-thunk'
import * as createLogger from 'redux-logger';


import reducers from './reducers';

let logger = createLogger();
let store = createStore(reducers,
    applyMiddleware(thunkMiddleware, logger));

export default store;