import mysql from 'mysql-promise';
import config from '../config';
import entities from '../models/entities/index';


export function getAccounts() {
  return entities.Account.findAll({where: {isActive: '1', serverName: config.serverName}});
}

export function getCardsForAccount(accountId) {
  return entities.TradeCard.findAll({where: {accountId: accountId}});
}

export function addAuctions(accountConfig, data) {

  if(data.auctionInfo.length == 0)
    return Promise.reject("Auction length 0");

  let insertData = data.auctionInfo.map(auction => { return [accountConfig.type,
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
}