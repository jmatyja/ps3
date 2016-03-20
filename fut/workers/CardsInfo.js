import Cards from './abstract/Cards';
import connectToWebApp from '../connector';
import setMarketData from '../market';
import * as cardsInfoActions from '../redux/modules/cardsInfo';
import * as connectorActions from '../redux/modules/connector';
import { bindActionCreators } from 'redux'
import moment from 'moment';

//time intervals are in seconds
const SEARCH_INTERVAL = 15;
const CARDS_NUMBERS_PER_SEARCH = 50;
const SEARCH_CARD_LEV = 'gold';
const SEARCH_CARD_TYPE = 'player';
const MAX_SEARCH_NUMBER = 5000;
const SEARCH_ATTEMPTS_WHEN_ERROR = 3;
let storeCurrentValue;

class _CardsInfo extends Cards {
  constructor(config, store) {
    super('cardsInfo');
    this.store = store;
    this.config = config;
    this.actions = bindActionCreators(cardsInfoActions, this.store.dispatch);
    this.connectorActions = bindActionCreators(connectorActions, this.store.dispatch);
    this.storeUnsubscribe = this.store.subscribe(this.handleStoreChange.bind(this));
  }

  get id() {
    return this.config.id;
  }

  tick() {
    return !this.checkLogin()
      || !this.checkSearch();
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
const CardsInfo = _CardsInfo;
export default CardsInfo;
