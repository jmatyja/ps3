import {expect} from 'chai';
import {
  getPriceStep,
  cardMaxBidPrice,
  cardMaxBuyNowPrice,
  cardsPricesNotChangedToLower,
  checkForAuctionsToBid
} from '../cardsOperations';
import R from 'ramda';

const cardsPrices = cardsPricesNotChangedToLower(1);

describe('getPriceStep', () => {
  it('it should return 1000 when price above then 100000', () => {
    expect(getPriceStep(110000)).to.equal(1000);
  });
  it('should return 50 when price  1000', () => {
    expect(getPriceStep(1000, 'lower')).to.equal(50);
  });
  it('should return 100 when price = 1000', () => {
    expect(getPriceStep(1000, 'higher')).to.equal(100);
  });
});

describe('cardMaxBidPrice', () => {
  it('should return 9500 when price == 10250', () => {
    expect(cardMaxBidPrice(10250)).to.equal(9500);
  })
});

describe('cardMaxBuyNowPrice', () => {
  it('should return third buy now card if no buy now cards bigger then 5', () => {
    let tradingCard = {
      assetId: 0,
      allCount: 101,
      cadsWithBid: 0,
      prices: [
        {buyNow: 1000, count: 4},
        {buyNow: 1100, count: 4},
        {buyNow: 1200, count: 3},
        {buyNow: 1300, count: 2}
      ]
    };
    expect(cardMaxBuyNowPrice(tradingCard)).to.equal(tradingCard.prices[2].buyNow);
  });
  it('should return buy now price that count of cards bigger or equal then 5', () => {
    const tradingCard = {
      assetId: 0,
      allCount: 101,
      cadsWithBid: 0,
      prices: [
        {buyNow: 1000, count: 4},
        {buyNow: 1100, count: 5},
        {buyNow: 1200, count: 3},
        {buyNow: 1300, count: 2}
      ]
    };
    expect(cardMaxBuyNowPrice(tradingCard)).to.equal(tradingCard.prices[1].buyNow);
  });
});

describe('cardsPricesNotChangedToLower', () => {
  it('should return true if trading card first time checked', () => {
    expect(cardsPrices({itemData:{assetId: 0}}, 1000)).to.be.true;
  });
  it('should return false if trading card second time is lower', () => {
    expect(cardsPrices({itemData:{assetId: 0}}, 900)).to.be.false;
  });
});
describe('cardsPricesnotChangedToLower interval tests', () => {
  cardsPrices({itemData:{assetId: 1}}, 1000);
  cardsPrices({itemData:{assetId: 1}}, 900);
  it('should return false before price changed to lower interval', done => {
    setTimeout(function(){

      expect(cardsPrices({itemData:{assetId: 1}}, 900)).to.be.false;
      done();
    }, 500);
  });
  it('should return true after price changed to lower interval', done => {
    setTimeout(function(){
      expect(cardsPrices({itemData:{assetId: 1}}, 900)).to.be.true;
      done();
    }, 1500);
  });
});
describe('checkForAuctionsToBid', () => {
  const auctions = [
    {
      tradeId: 1, 
      currentBid: 0, 
      startingBid: 500, 
      buyNowPrice: 1100, 
      expires: 50,
      tradeState: 'active',
      itemData:{assetId: 1, timestamp: 1457995870}
    }
  ];
  const tradingCards = {1:
    {
      assetId: 1,
      allCount: 101,
      cadsWithBid: 0,
      prices: [
        {buyNow: 1000, count: 4},
        {buyNow: 1100, count: 5},
        {buyNow: 1200, count: 3},
        {buyNow: 1300, count: 2}
      ]
    }
  };
  it('should have length one for auction next bid 500', () => {
    expect(checkForAuctionsToBid(auctions, tradingCards, cardsPrices)).to.have.lengthOf(1);
  });
  it('should have length 0 for auction next bid 1000', () => {
    auctions[0] = {...auctions[0], currentBid: 950};
    expect(checkForAuctionsToBid(auctions, tradingCards, cardsPrices)).to.have.lengthOf(0);
  });
});
