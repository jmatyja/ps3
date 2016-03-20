import mysql from 'mysql-promise';
import config from '../config';
const TYPE_AUCTION_INFO = '1';
const db = mysql();
if (!db.isConfigured()) {
  db.configure(config.db);
}

export function addAuctions(accountConfig, data) {

  if(data.auctionInfo.length == 0)
    return Promise.reject("Auction length 0");

  let insertData = data.auctionInfo.map(auction => { return [TYPE_AUCTION_INFO,
      accountConfig.platform,
      accountConfig.id,
      auction.tradeId,
      auction.itemData.id,
      auction.currentBid,
      auction.buyNowPrice,
      auction.expires,
      auction.itemData.assetId,
      auction.startingBid,
      auction.itemData.resourceId];
     });

  return db.query('INSERT INTO auctions (type, platform, account_id, trade_id, card_id, current_bid, buy_now, expired, asset_id, starting_bid, resource_id ) VALUES ?', [insertData]);
  //return Promise.resolve(data);
}