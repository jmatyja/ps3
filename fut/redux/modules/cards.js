import {
  cardMaxBidPrice,
  groupTradingCards,
  getAuctionsFromMarket,
  getAuctionsFromDb,
  removeOldAuctions
} from '../../lib/cardsOperations';
import R from 'ramda';
import moment from 'moment';

const GET = 'card/GET';
const GET_SUCCESS = 'cards/GET_SUCCESS';
const GET_FAIL = 'cards/GET_FAIL';
const SET_TRADING_CARDS = 'cards/SET_TRADING_CARDS';
const UPDATE_TRADING_CARDS = 'cards/UPDATE_TRADING_CARDS';
const SET_AUCTIONS = 'cards/SET_AUCTIONS';
const ADD_IN_BID_CARDS = 'cards/ADD_IN_BID_CARDS';
const UPDATE_IN_BID_CARDS = 'cards/UPDATE_IN_BID_CARDS';

const REMOVE_IN_BID_CARDS_INTERVAL = 60 * 10;
const initialState = {
  firstGroupped: false,
  auctions: {},
  lastUpdateAuctions: new Date(),
  inBidCards: [],
  lastInBidCardsUpdate: new Date()
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
    case ADD_IN_BID_CARDS:
      return {
        ...state,
        inBidCards: R.concat(state.inBidCards, action.auctions)
      };
    case UPDATE_IN_BID_CARDS:
      return {
        ...state,
        inBidCards: action.inBidCards,
        lastInBidCardsUpdate: new Date()
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

export function addInBidCards(auctions) {
  return {
    type: ADD_IN_BID_CARDS,
    auctions: auctions
  };
}

export function updateInBidCards(inBidCards) {
  return {
    type: UPDATE_IN_BID_CARDS,
    inBidCards: R.filter(
      card => moment().isAfter(moment(card.timestamp).add(REMOVE_IN_BID_CARDS_INTERVAL, 'second')),
      inBidCards
    )
  };
}

