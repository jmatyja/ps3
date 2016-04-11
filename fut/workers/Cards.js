import State from './abstract/State';
import * as cardsActions from '../redux/modules/cards';
import { bindActionCreators } from 'redux';
import moment from 'moment';


let storeCurrentValue;
const OLD_CARDS_REMOVE_INTERVAL = 60; // minutes
const UPDATE_TRADE_CARDS_INTERVAL = 60;
class _Cards extends State {
  constructor(config, store) {
    super('cards');
    this.store = store;
    this.config = config;
    this.actions = bindActionCreators(cardsActions, this.store.dispatch);
    this.storeUnsubscribe = this.store.subscribe(this.handleStoreChange.bind(this));
  }

  get state() {
    if(null == this.currentState || null == this.stateConfigName) {
      return this.currentState;
    }
    if(undefined != this.currentState[this.stateConfigName]){
      return this.currentState[this.stateConfigName];
    }
    return null;
  }

  set state(newState) {
    this.currentState = newState;
  }
  tick() {
    return !this.updateCards();
  }

  handleStoreChange() {
    this.state = this.store.getState();
    if(!this.state || !this.state.data){
      return;
    }

    //let previousValue = storeCurrentValue;
    //storeCurrentValue = this.state;
    ////first search
    //if(this.state.data && (!previousValue || !previousValue.data)) {
    //  this.actions.addAuctions(this.config, this.state.data);
    //}
    //if(previousValue && previousValue.data && previousValue.lastSearch != storeCurrentValue.lastSearch) {
    //  this.actions.addAuctions(this.config, this.state.data);
    //}
  }

  updateCards() {

    if(!this.state || (!this.state.getted && !this.state.getting)) {
      this.actions.getAuctions(moment().subtract(OLD_CARDS_REMOVE_INTERVAL, 'minute').toDate());
      return false;
    }
    if(this.state.getted && this.state.auctions != false && this.state.firstGroupped == false) {
      this.actions.setTradingCards();
      return false;
    }
    if(this.state.lastUpdateTradeCards
      && moment().isAfter(moment(this.state.lastUpdateTradeCards).add(UPDATE_TRADE_CARDS_INTERVAL, 's'))) {
      this.actions.updateTradingCards(this.state.auctions);
      return false;
    }
    return true;
  }
}
const Cards = _Cards;
export default Cards;
