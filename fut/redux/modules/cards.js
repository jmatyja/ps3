import R from 'ramda';
import moment from 'moment';

const GET = 'card/GET';
const GET_SUCCESS = 'cards/GET_SUCCESS';
const GET_FAIL = 'cards/GET_FAIL';
const SET_TRADING_CARDS = 'cards/SET_TRADING_CARDS';
const UPDATE_TRADING_CARDS = 'cards/UPDATE_TRADING_CARDS';
const SET_AUCTIONS = 'cards/SET_AUCTIONS';
const OLD_CARDS_REMOVE_INTERVAL = 1; // minutes
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
        auctions: setAuctionsFromMarket(action.auctions, state.auctions)
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


function groupTradingCards(auctions) {
  const combine = (entry) => {
    return R.reduce((acc, card) => {
      acc.prices.push({buyNow: card[0].buyNow, count: card.length});
      return {
        ...acc,
        assetId: card[0].assetId
      };
    }, {assetId: false, prices: []}, entry);
  };

  const process = R.pipe(
    R.values,
    R.groupBy(R.prop('assetId')),
    R.values,
    R.map(R.groupBy(R.prop('buyNow'))),
    R.map(R.values),
    R.map(combine)
    );

  return process(auctions);
}
function setAuctionsFromMarket(newAuctions, currentAuctions) {
  if(newAuctions.length == 0) {
    return currentAuctions;
  }
  const setAuction = (acc, auction) => {
    acc[auction.tradeId] = {
      assetId: auction.itemData.assetId,
      buyNow: auction.buyNowPrice,
      addDate: new Date(),
      tradeId: auction.tradeId
    };
    return acc;
  };
  return R.reduce(setAuction, currentAuctions, newAuctions);
}
function setAuctionsFromDb(dbAuctions) {
  if(dbAuctions.length == 0) {
    return false;
  }
  const setAuction = (acc, auction ) => {
    acc[auction.tradeId] = {
      assetId: auction.assetId,
      buyNow: auction.buyNow,
      addDate: auction.addDate,
      tradeId: auction.tradeId
    };
    return acc;
  };

  return R.reduce(setAuction, {}, dbAuctions);
}

function removeOldAuctions(auctions) {

  const process = R.pipe(
    R.values,
    R.reduce((acc, auction) => {
      if(moment().isAfter(moment(auction.addDate).add(OLD_CARDS_REMOVE_INTERVAL, 'minute'))) {
        delete acc[auction.tradeId];
      }
      return acc;
    }, auctions)
  );
  return process(auctions);
}