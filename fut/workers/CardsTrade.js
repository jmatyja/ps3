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
const CARDS_COUNT = 10;
let storeCurrentValue;

class _CardsTrade extends MarketLogin {
  constructor(config, store) {
    super('cardsTrade', store);
    this.config = config;
    this.actions = bindActionCreators(cardsTradeActions, this.store.dispatch);
  }

  tick() {
    return this.checkTradingCards()
      || !this.checkTradingCardsPrices()
      || !this.checkSearch();
  }

  checkTradingCards() {
    console.log(this.state )
    if(!this.state || !this.state.cards){
      this.actions.getCardsForAccount(this.id);
      return false;
    }
    if(this.state.cardsGetted == true && this.state.gettingCards == false && this.state.cards && this.state.cards.length == 0) {
      this.actions.addCardsFromCardsInfo(this.id, CARDS_COUNT);
      return false;
    }
    if(!this.state.cards || this.state.cards.length == 0) {
      return false;
    }
    return true;
  }

  checkTradingCardsPrices() {
    return false;
  }

  handleStoreChange() {
    this.state = this.store.getState();
    if(!this.state || !this.state.data){
      return;
    }
    let previousValue = storeCurrentValue;
    storeCurrentValue = this.state;
    //first search
    if(this.state.data && (!previousValue || !previousValue.data)) {
      this.actions.addAuctions(this.config, this.state.data);
    }
    if(previousValue && previousValue.data && previousValue.lastSearch != storeCurrentValue.lastSearch) {
      this.actions.addAuctions(this.config, this.state.data);
    }
  }

  checkSearch() {
    if(!this.state) {
      this.actions.search(this.accountId, {
        minb:this.config.minBuyNowSearch,
        num: CARDS_NUMBERS_PER_SEARCH,
        lev: SEARCH_CARD_LEV,
        type: SEARCH_CARD_TYPE,
        start: '0'
      });
      return false;
    }
    if(this.state.getting == false && moment().isAfter(moment(this.state.lastSearch).add(SEARCH_INTERVAL, 's'))) {
      this.actions.search(this.accountId, {
        minb:this.config.minBuyNowSearch,
        num: CARDS_NUMBERS_PER_SEARCH,
        lev: SEARCH_CARD_LEV,
        type: SEARCH_CARD_TYPE,
        start: this.state.startSearch > MAX_SEARCH_NUMBER ? 0 :  parseInt(this.state.startSearch) + CARDS_NUMBERS_PER_SEARCH -1
      });
      return false;
    }
    if(this.state.gettingError && this.state.searchAttempts > SEARCH_ATTEMPTS_WHEN_ERROR) {
      this.currentState.connector[this.accountId].loggedInd = false;
    }
    return true;
  }

}
const CardsTrade = _CardsTrade;
export default CardsTrade;
