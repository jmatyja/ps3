import {setAuctions} from '../redux/modules/cards';
import MarketLogin from './abstract/MarketLogin';
import * as cardsTradeActions from '../redux/modules/cardsTrade';
import { bindActionCreators } from 'redux';
import moment from 'moment';

//time intervals are in seconds
const SEARCH_INTERVAL = 15;
const CARDS_NUMBERS_PER_SEARCH = 50;
const SEARCH_CARD_LEV = 'gold';
const SEARCH_CARD_TYPE = 'player';
const SEARCH_ATTEMPTS_WHEN_ERROR = 3;
const MAX_SEARCH_NUMBER = 5000;

let storeCurrentValue = {};

class _CardsTrade extends MarketLogin {
  constructor(config, store) {
    super('cardsTrade', store);
    this.config = config;
    this.actions = bindActionCreators({...cardsTradeActions, setAuctions}, this.store.dispatch);
  }

  tick() {

    return !this.checkLogin() || !this.checkSearch();
  }

  handleStoreChange() {

    this.state = this.store.getState();
    if(!this.state || !this.state.cards){
      return;
    }

    let previousValue = storeCurrentValue[this.id];
    storeCurrentValue[this.id] = this.state;
    //first search

    if(this.state.cards && (!previousValue || !previousValue.cards)) {
      this.actions.setAuctions(this.state.cards.auctionInfo);
      this.actions.addAuctions(this.config, this.state.cards);
    }
    if(previousValue && previousValue.cards && previousValue.lastSearch != storeCurrentValue[this.id].lastSearch) {
      this.actions.setAuctions(this.state.cards.auctionInfo);
      this.actions.addAuctions(this.config, this.state.cards);
    }
  }

  checkSearch() {
    if(!this.state) {
      this.actions.search(this.id, {
        num: CARDS_NUMBERS_PER_SEARCH,
        lev: SEARCH_CARD_LEV,
        type: SEARCH_CARD_TYPE,
        start: this.config.startSearch
      });
      return false;
    }
    if(this.state.searching == false && moment().isAfter(moment(this.state.lastSearch).add(SEARCH_INTERVAL, 's'))) {
      this.actions.search(this.id, {
        num: CARDS_NUMBERS_PER_SEARCH,
        lev: SEARCH_CARD_LEV,
        type: SEARCH_CARD_TYPE,
        start: this.config.startSearch
      });
      return false;
    }
    if(this.state.gettingError && this.state.searchAttempts > SEARCH_ATTEMPTS_WHEN_ERROR) {
      this.currentState.connector[this.id].loggedInd = false;
    }
    return true;
  }

}
const CardsTrade = _CardsTrade;
export default CardsTrade;
