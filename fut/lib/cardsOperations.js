import R from 'ramda';
import moment from 'moment';

const MIN_BUY_NOW_COUNT = 5;
const MAX_BUY_NOW_PRICES_COUNT = 3;
const OLD_CARDS_REMOVE_INTERVAL = 60; //minutes
const PRICE_CHANGE_TO_LOWER_INTERVAL = 60; //minutes
const MIN_CARDS_COUNT_TO_TRADE = 50;
const MIN_PROFIT = 200;
const EA_TAX = 5;

function getPriceStep(price) {
  switch(true) {
    case (price >= 100000):
      return 1000;
    case (price >= 50000):
      return 500;
    case (price >= 10000):
      return 250;
    case (price >= 1000):
      return 100;
    default:
      return 50;
  }
  
}
export function checkForAuctionsToBid(state, tradingCards) {
  const filterFunction = card => {
    const tradingCard = tradingCards[card.assetId];
    const maxBidPrice = R.pipe(
      cardMaxBuyNowPrice,
      cardMaxBidPrice
      )(tradingCard);
    const cardPossibleBid = card.currentBid + getPriceStep(card.currentBid);
    if(undefined == tradingCard) {
      return false;
    }
    return  tradingCard.allCount > MIN_CARDS_COUNT_TO_TRADE
      && cardsPricesNotChangedToLower(tradingCard, maxBidPrice)
      && maxBidPrice <= cardPossibleBid;
  };
}

export function cardMaxBidPrice(buyNowPrice) {
  const buyNowWithoutTax = buyNowPrice * (1 - EA_TAX);
  const maxBuyPrice = buyNowWithoutTax - MIN_PROFIT;
  //TODO:
  //sprawdzić dla wartości buyNow  10250
  R.until(R.lte(R.__, maxBuyPrice), R.subtract(R.__, getPriceStep(buyNowPrice)))(buyNowPrice)
}

export function cardMaxBuyNowPrice(tradingCard) {
  return  R.pipe(
      R.prop('prices'),
      R.slice(0, MAX_BUY_NOW_PRICES_COUNT),
      R.either(R.find(R.propSatisfies(count => count >= MIN_BUY_NOW_COUNT, 'count')), R.last),
      R.prop('buyNow')
  )(tradingCard);

}

export function cardsPricesNotChangedToLower(tradingCard, maxBidPrice) {
  let cardsPricesChanges = {};
  return (tradingCard, maxBidPricemaxBidValue) => {
    const lastCardPrice = cardsPricesChanges[tradingCard.assetId];
    
    if(undefined == lastCardPrice || maxBidPrice > lastCardPrice.maxBidPrice ) {
      cardsPricesChanges[tradingCard.assetId] = {
        maxBidPrice : maxBidPrice,
        isLower: false,
        dropPriceTime: false
      };
      return true;
   
    } else if(lastCardPrice.maxBidPrice == maxBidPrice   ) {
      if(false ==  lastCardPrice.isLower) {
        return true;
      } else if(true == lastCardPrice.isLower && moment().isAfter(moment(lastCardPrice.dropPriceTime).add(PRICE_CHANGE_TO_LOWER_INTERVAL, 'minute'))) {
        cardsPricesChanges[tradingCard.assetId] = {
          maxBidPrice: maxBidPrice,
          isLower: false,
          dropPriceTime: false
        };
      } else {
        return false;
      }
    } else if(maxBidPrice < lastCardPrice.maxBidPrice ) {
      cardsPricesChanges[tradingCard.assetId] = {
        maxBidPrice: maxBidPrice,
        isLower: true,
        dropPriceTime: new Date()
      };
      return false;
    }
  };
}

export function groupTradingCards(auctions) {
  const combine = (entry) => {
    return R.reduce((acc, cards) => {
      acc.prices.push({buyNow: R.head(cards).buyNow, count: cards.length});
      let cardsWithBid = R.filter(card => card.currentBid > 0, cards).length;
      return {
        ...acc,
        assetId: R.head(cards).assetId,
        allCount: acc.allCount? acc.allCount + cards.length: cards.length,
        cardsWithBid: acc.cardsWithBid ? acc.cardsWithBid + cardsWithBid: cardsWithBid
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
  let ret = process(auctions);
  //R.forEach(item => console.log(item), ret);
  return ret;
  //return process(auctions);
}

export function setAuctionsFromMarket(newAuctions, currentAuctions) {
  if(newAuctions.length == 0) {
    return currentAuctions;
  }
  const setAuction = (acc, auction) => {
    acc[auction.tradeId] = {
      assetId: auction.itemData.assetId,
      buyNow: auction.buyNowPrice,
      addDate: new Date(),
      tradeId: auction.tradeId,
      currentBid: auction.currentBid
    };
    return acc;
  };
  return R.reduce(setAuction, currentAuctions, newAuctions);
}

export function setAuctionsFromDb(dbAuctions) {
  if(dbAuctions.length == 0) {
    return false;
  }
  const setAuction = (acc, auction ) => {
    acc[auction.tradeId] = {
      assetId: auction.assetId,
      buyNow: auction.buyNow,
      addDate: auction.addDate,
      tradeId: auction.tradeId,
      currentBid: auction.currentBid
    };
    return acc;
  };

  return R.reduce(setAuction, {}, dbAuctions);
}

export function removeOldAuctions(auctions) {
  const process = R.pipe(
    R.values,
    R.reduce((acc, auction) => {
      if(moment().isAfter(moment(auction.addDate).add(OLD_CARDS_REMOVE_INTERVAL, 'minute'))) {
        delete acc[auction.tradeId];
      }
      return acc;
    }, auctions)
  );
  console.log(Object.keys(auctions).length);
  return process(auctions);
}