import { combineReducers } from 'redux';
//import {reducer as reduxAsyncConnect} from 'redux-async-connect';
import cardsInfo from './cardsInfo';
import connector from './connector';

export default combineReducers({
  cardsInfo,
  connector
});
