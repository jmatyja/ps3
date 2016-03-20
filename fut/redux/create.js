import { createStore as _createStore, applyMiddleware } from 'redux';
import createMiddleware from './middleware/clientMiddleware';

export default function createStore(client, mysqlClient) {
  const middleware = [createMiddleware(client, mysqlClient)];
  let finalCreateStore = applyMiddleware(...middleware)(_createStore);
  const reducer = require('./modules/reducer');
  const store = finalCreateStore(reducer);
  return store;
}
