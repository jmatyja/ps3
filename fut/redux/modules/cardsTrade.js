import {
  checkForAuctionsToBid,
  cardsPricesNotChangedToLower
} from '../../lib/cardsOperations';
import R from 'ramda';

const SEARCH = 'cards-trade/SEARCH';
const SEARCH_SUCCESS = 'cards-trade/SEARCH_SUCCESS';
const SEARCH_FAIL = 'cards-trade/SEARCH_FAIL';
const GET_CARDS = 'cards-trade/GET_CARDS';
const GET_CARDS_SUCCESS = 'cards-trade/GET_CARDS_SUCCESS';
const GET_CARDS_FAIL = 'cards-trade/GET_CARDS_FAIL';
const ADD_AUCTIONS = 'cards-trade/ADD_AUCTIONS';
const ADD_AUCTIONS_SUCCESS = 'cards-trade/ADD_AUCTIONS_SUCCESS';
const ADD_AUCTIONS_FAIL = 'cards-trade/ADD_AUCTIONS_FAIL';
const AUCTIONS_TO_BID = 'cards-trads/AUCTIONS_TO_BID';
const canBidCard = cardsPricesNotChangedToLower(60*60);
const initialState = {};

export default function cardsTrade(state = initialState, action = {}) {
  switch (action.type) {
    case SEARCH:
      state[action.id] = {
        ...state[action.id],
        searching: true,
        cardsSearchedAndNotProceeded: false
      };
      return state;
    case SEARCH_SUCCESS:
      state[action.id] = {
        ...state[action.id],
        searching: false,
        auctions: action.result,
        lastSearch: new Date(),
        searchAttempts: 0,
        searchingError: null,
        startSearch: action.startSearch,
        cardsSearchedAndNotProceeded: true
      };
      return state;
    case SEARCH_FAIL:
      state[action.id] = {
        ...state[action.id],
        searching: false,
        searchingError: action.error,
        lastSearch: new Date(),
        startSearch: 0,
        searchAttempts: state[action.id].searchAttempts ? ++ state[action.id].searchAttempts: 1,
        cardsSearchedAndNotProceeded: false
      };
      return state;
    case ADD_AUCTIONS:
      state[action.id] = {
        ...state[action.id],
        addingAuctions: true,
        addedAuctions: false
      };
      return state;
    case ADD_AUCTIONS_SUCCESS:
      state[action.id] = {
        ...state[action.id],
        addingAuctions: false,
        addedAuctions: true
      };
      return state;
    case ADD_AUCTIONS_FAIL:
      state[action.id] = {
        ...state[action.id],
        addingAuctions: false,
        addedAuctions: false,
        addingAuctionsError: action.error
      };
      return state;
    case AUCTIONS_TO_BID:
      state[action.id] = {
        ...state[action.id],
        cardsSearchedAndNotProceeded: false,
        auctionsToBid: action.auctionsToBid
      };
      return state;
    default:
      return state;
  }
}

export function search(id, urlQuery) {
  return {
    types: [SEARCH, SEARCH_SUCCESS, SEARCH_FAIL],
    promise: (client) => client.search(id, urlQuery),
    id: id,
    startSearch: urlQuery.start
  };
}

export function addAuctions(config, data) {
  return {
    types: [ADD_AUCTIONS, ADD_AUCTIONS_SUCCESS, ADD_AUCTIONS_FAIL],
    mysqlPromise: (client) => client.addAuctions(config, data),
    id: config.id
  };
}

export function checkForCardsToBuy(id, auctions, tradingCards, inBidCards) {
  return {
    type: AUCTIONS_TO_BID,
    id: id,
    auctionsToBid: checkForAuctionsToBid(
      auctions,
      tradingCards,
      R.both(
        canBidCard,
        auction => !R.find(card => card.tradeId == auction.tradeId, inBidCards)
      )
    )
  };
}


