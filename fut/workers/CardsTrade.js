import {setAuctions, addInBidCards} from '../redux/modules/cards';
import MarketLogin from './abstract/MarketLogin';
import * as cardsTradeActions from '../redux/modules/cardsTrade';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import marketConst from '../redux/modules/const/market';

//time intervals are in seconds
const SEARCH_INTERVAL = 15;
const CARDS_NUMBERS_PER_SEARCH = 50;
const SEARCH_CARD_LEV = 'gold';
const SEARCH_CARD_TYPE = 'player';
const SEARCH_ATTEMPTS_WHEN_ERROR = 3;
const BID_AUCTIONS_INTERVAL = 3;
const UPDATE_BID_AUCTIONS_INTERVAL = 3;

let storeCurrentValue = {};

class _CardsTrade extends MarketLogin {
  constructor(config, store) {
    super('cardsTrade', store);
    this.config = config;
    this.actions = bindActionCreators({...cardsTradeActions, setAuctions, addInBidCards}, this.store.dispatch);
  }

  get tradingCards() {
    if(this.currentState['cards']) {
      return this.currentState['cards'].tradingCards;
    } else {
      return [];
    }
  }

  get inBidCards() {
    if(this.currentState['cards']) {
      return this.currentState['cards'].inBidCards;
    } else {
      return [];
    }
  }

  tick() {

    return !this.checkLogin()
      || !this.checkSearch()
      || !this.checkAuctionsToBidAdded()
      || !this.checkWatchlist()
      || !this.checkForCardsToBuy()
      || !this.updateAuctionsToBid()
      || !this.checkBidAuctions();
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
    if(this.state.auctionsToBid && this.state.auctionsToBid.length > 0){
      console.log(this.state.auctionsToBid.length);
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
      return false;
    }
    return true;
  }

  checkAuctionsToBidAdded() {
    if(this.state.newAuctionsToBidAdded == true) {
      this.actions.addInBidCards(this.state.auctionsToBid);
    }
    return true;
  }

  checkWatchlist() {
    return true;
  }

  checkForCardsToBuy() {
    if(this.state.auctions && this.state.cardsSearchedAndNotProceeded) {
      this.actions.checkForCardsToBuy(this.id, this.state.auctions.auctionInfo, this.tradingCards, this.inBidCards);
    }
    return true;
  }

  updateAuctionsToBid() {
    if(this.state.marketState
      && this.state.marketState == marketConst.MARKET_STATE_SEARCH
      && this.state.auctionsToBid.length > 0
      && moment().isAfter(moment(this.state.lastUpdateBidAuctions).add(UPDATE_BID_AUCTIONS_INTERVAL, 'second'))
    ) {
      this.actions.updateAuctionsToBid(this.id, this.state.auctionsToBid);
      return false;
    }
    return true;
  }

  checkBidAuctions() {
    if(this.state.marketState
      && this.state.marketState == marketConst.MARKET_STATE_SEARCH
      && this.state.auctionsToBid.length > 0
      && R.find(auction => auction.bidState == "none" || auction.bidState == "outbid", this.state.auctionsToBid) != undefined
      && moment().isAfter(moment(this.state.lastBid).add(BID_AUCTIONS_INTERVAL, 'second'))
      ) {
      this.actions.searchBid(this.id, this.state.auctionsToBid);
      return false;
    }
    return true;
  }
}
const CardsTrade = _CardsTrade;
export default CardsTrade;
