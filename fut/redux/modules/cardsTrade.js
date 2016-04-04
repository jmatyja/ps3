const SEARCH = 'cards-trade/SEARCH';
const SEARCH_SUCCESS = 'cards-trade/SEARCH_SUCCESS';
const SEARCH_FAIL = 'cards-trade/SEARCH_FAIL';
const GET_CARDS = 'cards-trade/GET_CARDS';
const GET_CARDS_SUCCESS = 'cards-trade/GET_CARDS_SUCCESS';
const GET_CARDS_FAIL = 'cards-trade/GET_CARDS_FAIL';
const ADD_CARDS = 'cards-trade/ADD_CARDS';
const ADD_CARDS_SUCCESS = 'cards-trade/ADD_CARDS_SUCCESS';
const ADD_CARDS_FAIL = 'cards-trade/ADD_CARDS_FAIL';

const initialState = {};

export default function cardsTrade(state = initialState, action = {}) {
  switch (action.type) {
    case SEARCH:
      state[action.id] = {
        ...state[action.id],
        searching: true
      };
      return state;
    case SEARCH_SUCCESS:
      state[action.id] = {
        ...state[action.id],
        searching: false,
        data: action.result,
        lastSearch: new Date(),
        searchAttempts: 0,
        searchingError: null
      };
      return state;
    case SEARCH_FAIL:
      state[action.id] = {
        ...state[action.id],
        searching: false,
        searchingError: action.error,
        lastSearch: new Date(),
        startSearch: 0,
        searchAttempts: state[action.id].searchAttempts +1
      };
      return state;
    case GET_CARDS:
      state[action.id] = {
        ...state[action.id],
        gettingCards: true,
        cardsGetted: false
      };
      return state;
    case GET_CARDS_SUCCESS:
      state[action.id] = {
        ...state[action.id],
        gettingCards: false,
        cards: action.result,
        gettingCardsError: false,
        cardsGetted: true
      };
      return state;
    case GET_CARDS_FAIL:
      state[action.id] = {
        ...state[action.id],
        gettingCards: false,
        gettingCardsError: action.error,
        cards: false,
        cardsGetted: false
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

export function getCardsForAccount(id) {
  return {
    types: [GET_CARDS, GET_CARDS_SUCCESS, GET_CARDS_FAIL],
    mysqlPromise: (client) => client.getCardsForAccount(id),
    id: id
  }
}

export function addCardsFromCardsInfo(id, limit) {
  return {
    types: [ADD_CARDS, ADD_CARDS_SUCCESS, ADD_CARDS_FAIL],
    mysqlPromise: (client) => client.getCardsFromCardsInfo(id, limit),
    id: id
  }
}