const LOGIN = 'connector/LOGIN';
const LOGIN_SUCCESS = 'collect-cards-info/LOGIN_SUCCESS';
const LOGIN_FAIL = 'collect-cards-info/LOGIN_FAIL';
const SERVER_DATA = 'collect-cards-info/SERVER_DATA';
const SERVER_DATA_SUCCESS = 'collect-cards-info/SERVER_SUCCESS';
const SERVER_DATA_FAIL = 'collect-cards-info/SERVER_FAIL';
const initialState = {
};

export default function connector(state = initialState, action = {}) {
  switch (action.type) {
    case LOGIN:
      state[action.id] = {
        ...state[action.id],
        loggingIn: true,
        marketDataIsSet: false
      };
      return state;
    case LOGIN_SUCCESS:
      state[action.id] =  {
        ...state[action.id],
        loggingIn: false,
        loggedInd: true,
        serverData: action.result,
        lastAttempt: new Date(),
        marketDataIsSet: false

      };
      return state;
    case LOGIN_FAIL:
      state[action.id] = {
        ...state[action.id],
        loggingIn: false,
        loggedInd: false,
        error: action.error,
        lastAttempt: new Date(),
        marketDataIsSet: false
      };
      return state;
    case SERVER_DATA:
        state[action.id] = {
          ...state[action.id],
          marketDataIsSetting: true
        }
        return state;
    case SERVER_DATA_SUCCESS:
      state[action.id] = {
        ...state[action.id],
        marketDataIsSetting: false,
        marketDataIsSet: true
      }
      return state;
    case SERVER_DATA_FAIL:
      state[action.id] = {
        ...state[action.id],
        marketDataIsSetting: false,
        marketDataIsSet: false
      }
      return state;
    default:
      return state;
  }
}


export function login(config) {
  return {
    types: [LOGIN, LOGIN_SUCCESS, LOGIN_FAIL],
    promise: (client) => client.connect(config),
    id: config.id
  };
}

export function setMarketData(serverData, config) {
  return {
    types: [SERVER_DATA, SERVER_DATA_SUCCESS, SERVER_DATA_FAIL],
    serverData: serverData,
    id: config.id,
    promise: (client) => client.setMarketData(serverData, config)
  }
}
