
import { applyMiddleware, createStore } from 'redux';
import thunkMiddleware from 'redux-thunk'
import * as createLogger from 'redux-logger';


import reducers from './reducers';

let logger = createLogger();

let store;
store = process.env.ELECTRON_ENV === 'development' ? createStore(reducers, applyMiddleware(thunkMiddleware, logger)) :
    createStore(reducers);

export default store;