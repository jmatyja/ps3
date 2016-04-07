import co from 'co';
import rp from 'request-promise';
import FileCookieStore from './lib/filestore';
import url from 'url';
import util from 'util';
import moment from 'moment';

let jar;
const TIMEOUT = 20000;
const SEARCH_PATH = "ut/game/fifa16/transfermarket";
const PROTOCOL = "https";
const BID_PATH = "ut/game/fifa16/trade/%s/bid";
const WATCHLIST_PATH = "ut/game/fifa16/watchlist";
const ITEM_PATH = "ut/game/fifa16/item";
const AUCTIONHOUSE_PATH = "ut/game/fifa16/auctionhouse";
const PURCHASED_PATH = "ut/game/fifa16/purchased/items";
const TRADE_PILE_PATH = "ut/game/fifa16/tradepile";
const TRADE_PILE_REMOVE_PATH = "ut/game/fifa16/trade/%s";

const AUCTION_DURATION = 3600;
let _config = {};
let _serverData = {};
let defaultHeaders = {
  'Accept': 'application/json',
    'Accept-Encoding': null,
    'Accept-Language': 'en-US,en;q=0.8',
    'Connection': 'keep-alive',
    'Content-Type': 'application/json',
    //'Host': _serverData.host,
    'Origin': 'https://www.easports.com',
    'Referer': 'https://www.easports.com/iframe/fut16/bundles/futweb/web/flash/FifaUltimateTeam.swf?cl=154151',
    'X-Requested-With' : 'ShockwaveFlash/17.0.0.169',
    'X-UT-Embed-Error' : true,
    //'X-UT-PHISHING-TOKEN': _serverData.phishingToken,
    //'X-UT-SID': _serverData.sid,
    'User-Agent': 'Mozilla/6.0 (Windows NT 6.1; WOW64; rv:29.0) Gecko/20100101 Firefox/29.0'
};
let defaultOptions = {
  timeout: TIMEOUT,
  method: 'POST',
  //jar: _j,
  followAllRedirects :true,
  json: true
}
export default function setMarketData(serverData, config) {
  _config[config.id] = config;
  _serverData[config.id] = serverData;
  jar = rp.jar(new FileCookieStore('./fut/cookies/'+config.email+'.json'));
  defaultHeaders[config.id] = Object.assign({}, defaultHeaders);
  defaultOptions[config.id] = Object.assign({}, defaultOptions);
  Object.assign(defaultHeaders[config.id], {'Host': config.host, 'X-UT-PHISHING-TOKEN': serverData.phishingToken, 'X-UT-SID': serverData.sid});
  Object.assign(defaultOptions[config.id], {jar: jar});
  return Promise.resolve(true);
}

export function search(id, urlQuery) {
  const urlString = url.format({
    host: _config[id].host,
    protocol: PROTOCOL,
    pathname: SEARCH_PATH,
    query: urlQuery
  });
  //const url = 'http://localhost:3000/2page.json';
  console.log(urlString);
  return get(id, urlString);
 }

export function bid(bidValue, tradeId) {
  const path = util.format(BID_PATH, tradeId);
  const urlString = url.format({
    host: _config.host,
    protocol: PROTOCOL,
    pathname: path
  });
  //return put(urlString, {bid: bidValue});
}

export function watchlist() {
  const urlString = url.format({
    host: _config.host,
    protocol: PROTOCOL,
    pathname: WATCHLIST_PATH
  });
  //return get(urlString);
}

export function watchlistRemove(tradeId) {
  const urlString = url.format({
    host: _config.host,
    protocol: PROTOCOL,
    pathname: WATCHLIST_PATH,
    query: {tradeId: tradeId}
  });
  //return delete(urlString);
}

export function moveToTrade(cardId, tradeId) {
  const urlString = url.format({
    host: _config.host,
    protocol: PROTOCOL,
    pathname: ITEM_PATH
  });
  const bodyData = tradeId == undefined ?
    util.format('{"itemData":[{"pile":"trade","id":"%s"}]}', cardId) :
    util.format('{"itemData":[{"tradeId":"%s","pile":"trade","id":"%s"}]}', tradeId, cardId);
  //return put(urlString, bodyData);
}

export function listOnMarket(cardId, buyNowPrice) {
  const urlString = url.format({
    host: _config.host,
    protocol: PROTOCOL,
    pathname: AUCTIONHOUSE_PATH
  });
  const data = {
    buyNowPrice: buyNowPrice,
    itemData: {id: cardId},
    duration: AUCTION_DURATION,
    startingBid: getStartingBid(buyNowPrice)
  };
  //return put(urlString, data);
}

export function purchasedItems() {
  const urlString = url.format({
    host: _config.host,
    protocol: PROTOCOL,
    pathname: PURCHASED_PATH
  });
  //return get(urlString);
}

export function tradePile() {
  const urlString = url.format({
    host: _config.host,
    protocol: PROTOCOL,
    pathname: TRADE_PILE_PATH
  });
  //return get(urlString);
}

export function tradePileRemove(tradeId) {
  const path = util.format(TRADE_PILE_REMOVE_PATH, tradeId);
  const urlString = url.format({
    host: _config.host,
    protocol: PROTOCOL,
    pathname: path
  });
  //return del(urlString);
}

export function getStartingBid(buyNowPrice) {
  switch(true){
    case (buyNowPrice > 100000):
          return buyNowPrice - 1000;
    case (buyNowPrice > 50000):
          return buyNowPrice - 500;
    case (buyNowPrice > 10000):
          return buyNowPrice - 250;
    case (buyNowPrice > 1000):
          return buyNowPrice - 100;
    default:
          return buyNowPrice - 50;
  }
}

export function get(id, url) {
  let headers = Object.assign({}, defaultHeaders[id], {'X-HTTP-Method-Override': 'GET'});
  let options = Object.assign({}, defaultOptions[id], {uri: url, headers: headers});
  return rp(options);
  //return Promise.resolve({get: 'datajsonabc'});
}

export function put(url, data) {
  let headers = Object.assign({}, defaultHeaders, {'X-HTTP-Method-Override': 'PUT'});
  let options = Object.assign({}, defaultOptions, {uri: url, body: typeof data === "object" ? JSON.stringify(data): data, headers: headers});
  return rp(options);
}

function del(url) {
  let headers = Object.assign({}, defaultHeaders, {'X-HTTP-Method-Override': 'DELETE'});
  let options = Object.assign({}, defaultOptions, {uri: url, headers: headers});
  return rp(options);
}
