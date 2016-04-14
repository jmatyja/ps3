const SEARCH = 'cards-trade/SEARCH';
const SEARCH_SUCCESS = 'cards-trade/SEARCH_SUCCESS';
const SEARCH_FAIL = 'cards-trade/SEARCH_FAIL';
const GET_CARDS = 'cards-trade/GET_CARDS';
const GET_CARDS_SUCCESS = 'cards-trade/GET_CARDS_SUCCESS';
const GET_CARDS_FAIL = 'cards-trade/GET_CARDS_FAIL';
const ADD_AUCTIONS = 'cards-trade/ADD_AUCTIONS';
const ADD_AUCTIONS_SUCCESS = 'cards-trade/ADD_AUCTIONS_SUCCESS';
const ADD_AUCTIONS_FAIL = 'cards-trade/ADD_AUCTIONS_FAIL';
const CHECK_CARDS_TO_SEARCH = 'cards-trads/CHECK_CARDS_TO_SEARCH';

const MIN_CARDS_COUNT_TO_TRADE = 50;

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
        cards: action.result,
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
    case CHECK_CARDS_TO_SEARCH:
        state[action.id] = {
          ...state[action.id],
          cardsSearchedAndNotProceeded: false,
          auctionsToWin: action.auctionsToBid
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

export function checkForCardsToBuy(id, state, tradingCards) {
  return {
    type: CHECK_CARDS_TO_SEARCH,
    id: id,
    state: state,
    auctionsToBid: checkForAuctionsToBid(state, tradingCards)
  }
}

function checkForAuctionsToBid(state, tradingCards) {
  const filterFunction = card => {
    let tradingCard = tradingCards[card.assetId];
    if(undefined == tradingCard) {
      return false;
    }
    return tradingCard.allCount > MIN_CARDS_COUNT_TO_TRADE
  };
}

function getCardMaxBidPrice(tradingCard) {

}
