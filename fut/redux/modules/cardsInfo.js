const GET = 'collect-cards-info/GET';
const GET_SUCCESS = 'collect-cards-info/GET_SUCCESS';
const GET_FAIL = 'collect-cards-info/GET_FAIL';
const ADD_AUCTIONS = 'collect-cards-info/ADD_AUCTIONS';
const ADD_AUCTIONS_SUCCESS = 'collect-cards-info/ADD_AUCTIONS_SUCCESS';
const ADD_AUCTIONS_FAIL = 'collect-cards-info/ADD_AUCTIONS_FAIL';
const initialState = {
};

export default function cardsInfo(state = initialState, action = {}) {
  switch (action.type) {
    case GET:
      state[action.id] = {
        ...state[action.id],
        getting: true
      };
      return state;
    case GET_SUCCESS:
      state[action.id] = {
        ...state[action.id],
        getting: false,
        isgetted: true,
        data: action.result,
        lastSearch: new Date(),
        startSearch: action.startSearch,
        searchAttempts: 0,
        gettingError: null
      };
      return state;
    case GET_FAIL:
      state[action.id] = {
        ...state[action.id],
        getting: false,
        isgetted: false,
        gettingError: action.error,
        lastSearch: new Date(),
        startSearch: 0,
        searchAttempts: state[action.id].searchAttempts +1
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
    default:
      return state;
  }
}

export function search(id, urlQuery) {
  return {
    types: [GET, GET_SUCCESS, GET_FAIL],
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
