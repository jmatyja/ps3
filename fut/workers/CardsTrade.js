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

let storeCurrentValue = {};

class _CardsTrade extends MarketLogin {
  constructor(config, store) {
    super('cardsTrade', store);
    this.config = config;
    this.actions = bindActionCreators({...cardsTradeActions, setAuctions}, this.store.dispatch);
  }

  get tradingCards() {
    if(this.currentState['cards']) {
      return this.currentState['cards'].tradingCards;
    } else {
      return [];
    }
  }

  tick() {

    return !this.checkLogin()
      || !this.checkSearch()
      || !this.checkForCardsToBuy();
  }

  handleStoreChange() {

    this.state = this.store.getState();
    if(!this.state || !this.state.auctions){
      return;
    }

    let previousValue = storeCurrentValue[this.id];
    storeCurrentValue[this.id] = this.state;
    //first search

    if(this.state.auctions && (!previousValue || !previousValue.auctions)) {
      this.actions.setAuctions(this.state.auctions.auctionInfo);
      this.actions.addAuctions(this.config, this.state.auctions);
    }
    if(previousValue && previousValue.auctions && previousValue.lastSearch != storeCurrentValue[this.id].lastSearch) {
      this.actions.setAuctions(this.state.auctions.auctionInfo);
      this.actions.addAuctions(this.config, this.state.auctions);
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

  checkForCardsToBuy() {
    if(this.state.auctionsToWin && this.state.cardsSearchedAndNotProceeded) {
      this.actions.checkForCardsToBuy(this.id, this.state.auctions.auctionInfo, this.tradingCards, [])
    }
  }
}
const CardsTrade = _CardsTrade;
export default CardsTrade;
