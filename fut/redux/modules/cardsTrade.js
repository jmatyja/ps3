const GET = 'cards-trade/GET';
const GET_SUCCESS = 'cards-trade/GET_SUCCESS';
const GET_FAIL = 'cards-trade/GET_FAIL';

const initialState = {
};

export default function cardsTrade(state = initialState, action = {}) {
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
