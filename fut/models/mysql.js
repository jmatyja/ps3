import config from '../config';
import entities from '../models/entities/index';


export function getAccounts() {
  return entities.Account.findAll({where: {isActive: '1', serverName: config.serverName}});
}

export function getCardsForAccount(accountId) {
  return entities.TradeCard.findAll({where: {accountId: accountId}});
}

export function getCardsFromCardsInfo(id, limit) {

}
export function addAuctions(accountConfig, data) {

  if(data.auctionInfo.length == 0)
    return Promise.reject("Auction length 0");

  return entities.Auction.bulkCreate(data.auctionInfo.map(auction => { return {
    type: accountConfig.type,
    platform: accountConfig.platform,
    accountId: accountConfig.id,
    tradeId: auction.tradeId,
    cardId: auction.itemData.id,
    currentBid: auction.currentBid,
    buyNow: auction.buyNowPrice,
    expired: auction.expires,
    assetId: auction.itemData.assetId,
    startingBid:auction.startingBid,
    resourceId: auction.itemData.resourceId
  }}));
}

export function getAuctions(toDate) {
  return entities.Auction.findAll({where: {addDate: {$gt: toDate}}});
}