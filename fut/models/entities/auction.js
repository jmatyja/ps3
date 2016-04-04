export default (sequelize, DataTypes) => {
  let Auction = sequelize.define("Auction", {
    type: DataTypes.STRING,
    platform: DataTypes.STRING,
    accountId: {
      type: DataTypes.INTEGER,
      field: 'account_id'
    },
    tradeId: {
      type: DataTypes.STRING,
      field: 'trade_id'
    },
    cardId: {
      type: DataTypes.STRING,
      field: 'card_id'
    },
    currentBid: {
      type: DataTypes.INTEGER,
      field: 'current_bid'
    },
    buyNow: {
      type: DataTypes.INTEGER,
      field: 'buy_now'
    },
    expired: DataTypes.INTEGER,
    assetId: {
      type: DataTypes.INTEGER,
      field: 'asset_id'
    },
    startingBid: {
      type: DataTypes.INTEGER,
      field: 'starting_bid'
    },
    resourceId: {
      type: DataTypes.INTEGER,
      field: 'resource_id'
    },
    addDate: {
      type: DataTypes.TIME,
      field: 'add_date'
    }
  }, {
    classMethods: {
      associate: function(entities) {
        Auction.belongsTo(entities.Account, {foreignKey: 'account_id'});
      }
    },
    tableName: 'auctions'
  });

  return Auction;
}