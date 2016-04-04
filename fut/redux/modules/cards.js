import R from 'ramda';

const GET = 'card/GET';
const GET_SUCCESS = 'cards/GET_SUCCESS';
const GET_FAIL = 'cards/GET_FAIL';
const SET_TRADING_CARDS = 'cards/SET_TRADING_CARDS';
const UPDATE_TRADING_CARDS = 'cards/UPDATE_TRADING_CARDS';
const initialState = {
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
        auctions: setAuctionsFromDb(action.result)
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
        lastUpdateTradeCards: new Date()
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

export function updateTradingCards() {
  return {
    type: UPDATE_TRADING_CARDS
  };
}
function getTradingCardsGroup(cards) {
  let groupCards = (tradingCardsGroup, card) => {

  };
  return R.reduce(groupCards, {}, cards);
}
function groupTradingCards(cards) {
  let groupAuction = (tradingCards, card) => {
    if(tradingCards.hasOwnProperty(card.assetId)) {
      tradingCards[card.assetId].cards.push(card);
    } else {
      tradingCards[card.assetId].cards = [card];
    }
    tradingCards[card.assetId].data = getTradingCardsGroup(tradingCards[card.assetId].cards);
  };
  return R.reduce(groupAuction, {}, cards)
}

function setAuctionsFromDb(dbAuctions) {
  let setAuction = (auctionsObj, auction ) => {
    auctionsObj[auction.tradeId] = {
      asset_id: auction.assetId,
      current_bid: auction.currentBid,
      buy_now: auction.buyNow
    };
    return auctionsObj;
  };

  return R.reduce(setAuction, {}, dbAuctions);
}