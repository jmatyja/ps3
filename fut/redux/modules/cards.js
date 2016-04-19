
import {
  cardMaxBidPrice,
  cardsPricesChanges,
  groupTradingCards,
  getAuctionsFromMarket,
  getAuctionsFromDb,
  removeOldAuctions
} from '../lib/cardsOperations';

const GET = 'card/GET';
const GET_SUCCESS = 'cards/GET_SUCCESS';
const GET_FAIL = 'cards/GET_FAIL';
const SET_TRADING_CARDS = 'cards/SET_TRADING_CARDS';
const UPDATE_TRADING_CARDS = 'cards/UPDATE_TRADING_CARDS';
const SET_AUCTIONS = 'cards/SET_AUCTIONS';

const initialState = {
  firstGroupped: false,
  auctions: {},
  lastUpdateAuctions: new Date()
};

export default function cards(state = initialState, action = {}) {
  switch (action.type) {
    case GET:
      return {
        ...state,
        getting: true,
        getted: false,
        auctions: false
      };
    case GET_SUCCESS:
      return {
        ...state,
        getting: false,
        getted: true,
        auctions: getAuctionsFromDb(action.result)
      };
    case GET_FAIL:
      return {
        ...state,
        getting: false,
        getted: false,
        gettingError: action.error,
        auctions: false
      };
    case SET_TRADING_CARDS:
      return {
        ...state,
        tradingCards: groupTradingCards(state.auctions),
        firstGroupped: true,
        lastUpdateTradeCards: new Date()
      };

    case UPDATE_TRADING_CARDS:
      return {
        ...state,
        auctions: action.auctions,
        tradingCards: groupTradingCards(action.auctions),
        lastUpdateTradeCards: new Date()
      };
    case SET_AUCTIONS:
      return {
        ...state,
        auctions: getAuctionsFromMarket(action.auctions, state.auctions)
      };
    default:
      return state;
  }
}

export function getAuctions(toDate) {
  return {
    types: [GET, GET_SUCCESS, GET_FAIL],
    mysqlPromise: (client) => client.getAuctions(toDate)
  };
}

export function setTradingCards() {
  return {
    type: SET_TRADING_CARDS
  };
}

export function updateTradingCards(auctions) {
  return {
    type: UPDATE_TRADING_CARDS,
    auctions: removeOldAuctions(auctions)
  };
}

export function setAuctions(auctions) {
  return {
    type: SET_AUCTIONS,
    auctions: auctions
  };
}

