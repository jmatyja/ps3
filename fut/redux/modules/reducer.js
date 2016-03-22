import { combineReducers } from 'redux';
//import {reducer as reduxAsyncConnect} from 'redux-async-connect';
import cardsInfo from './cardsInfo';
import cardsTrade from './cardsTrade';
import connector from './connector';

export default combineReducers({
  cardsInfo,
  cardsTrade,
  connector
});
