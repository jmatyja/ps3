import R from 'ramda';
import moment from 'moment';

const MIN_BUY_NOW_COUNT = 5;
const MAX_BUY_NOW_PRICES_COUNT = 3;
const OLD_CARDS_REMOVE_INTERVAL = 60; //minutes
const MIN_CARDS_COUNT_TO_TRADE = 50;
const MIN_PROFIT = 200;
const EA_TAX = 0.05;
const MAX_EXPIRES = 60;
export function getPriceStep(price, direction) {
  switch(direction)
  {
    case 'lower':
      switch(true) {
        case (price > 100000):
          return 1000;
        case (price > 50000):
          return 500;
        case (price > 10000):
          return 250;
        case (price > 1000):
          return 100;
        default:
          return 50;
      }
      break;
    case 'higher':
    default:
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


}
export function auctionPossibleBid(auction) {
  if(auction.currentBid == 0) {
    return auction.startingBid;
  } else {
    return auction.currentBid + getPriceStep(auction.currentBid, 'higher');
  }
}
export function checkForAuctionsToBid(auctions, tradingCards, canBidCard) {

  const filterFunction = auction => {
    if(undefined == tradingCards) {
      return false;
    }
    const tradingCard = R.find(card => card.assetId == auction.itemData.assetId, tradingCards);
    if(undefined == tradingCard) {
      return false;
    }
    const maxBidPrice = R.pipe(
      cardMaxBuyNowPrice,
      cardMaxBidPrice
      )(tradingCard);

    return tradingCard.allCount > MIN_CARDS_COUNT_TO_TRADE
      && canBidCard(auction, cardMaxBuyNowPrice(tradingCard))
      && tradingCard.allCount > MIN_CARDS_COUNT_TO_TRADE
      && maxBidPrice >= auctionPossibleBid(auction)
      && auction.expires <= MAX_EXPIRES
      && auction.tradeState == "active";
  };
  return R.pipe(
        R.filter(filterFunction),
        R.map(auction => {
          return {
            tradeId: auction.tradeId,
            assetId: auction.itemData.assetId,
            nextBidValue: auctionPossibleBid(auction),
            buyNowPrice: auction.buyNowPrice,
            currentBid: auction.currentBid,
            startingBid: auction.startingBid,
            expires: auction.expires,
            timestamp: auction.itemData.timestamp,
            bidState: auction.bidState
          };
        })
        )(auctions);
}

export function cardMaxBidPrice(buyNowPrice) {
  const buyNowWithoutTax = buyNowPrice * (1 - EA_TAX);
  const maxBuyPrice = buyNowWithoutTax - MIN_PROFIT;
  return R.until(R.lte(R.__, maxBuyPrice), price => price - getPriceStep(price, 'lower') )(buyNowPrice);
}

export function cardMaxBuyNowPrice(tradingCard) {
  return  R.pipe(
      R.prop('prices'),
      R.slice(0, MAX_BUY_NOW_PRICES_COUNT),
      R.either(R.find(R.propSatisfies(count => count >= MIN_BUY_NOW_COUNT, 'count')), R.last),
      R.prop('buyNow')
  )(tradingCard);
}

export function cardsPricesNotChangedToLower(_priceChangeToLowerInterval) {
  let cardsPricesChanges = {};
  const priceChangeToLowerInterval = _priceChangeToLowerInterval; //seconds
  return (auction, maxBidPrice) => {
    let assetId = auction.itemData.assetId;
    const lastCardPrice = cardsPricesChanges[assetId];

    if(undefined == lastCardPrice || maxBidPrice > lastCardPrice.maxBidPrice ) {
      cardsPricesChanges[assetId] = {
        maxBidPrice : maxBidPrice,
        isLower: false,
        dropPriceTime: false
      };
      return true;

    } else if(lastCardPrice.maxBidPrice == maxBidPrice   ) {
      if(false ==  lastCardPrice.isLower) {
        return true;
      } else if(true == lastCardPrice.isLower && moment().isAfter(moment(lastCardPrice.dropPriceTime).add(priceChangeToLowerInterval, 'second'))) {
        cardsPricesChanges[assetId] = {
          maxBidPrice: maxBidPrice,
          isLower: false,
          dropPriceTime: false
        };
        return true;
      } else {
        return false;
      }
    } else if(maxBidPrice < lastCardPrice.maxBidPrice ) {
      cardsPricesChanges[assetId] = {
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
  return process(auctions);
}

export function getAuctionsFromMarket(newAuctions, currentAuctions) {
  if(newAuctions.length == 0) {
    return currentAuctions;
  }
  if(false == currentAuctions){
    currentAuctions = {};
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

export function getAuctionsFromDb(dbAuctions) {
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