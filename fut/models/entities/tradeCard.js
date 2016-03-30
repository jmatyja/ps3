export default (sequelize, DataTypes) => {
  let TradeCard = sequelize.define("TradeCard", {
    assetId: {
      type: DataTypes.STRING,
      field: 'asset_id'
    },
    platform: DataTypes.STRING,
    buyPrice: {
      type: DataTypes.INTEGER,
      field: 'buy_price'
    },
    sellPrice: {
      type: DataTypes.INTEGER,
      field: 'sell_price'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      field: 'is_active'
    },
    accountId: {
      type: DataTypes.INTEGER,
      field: 'account_id'
    }
  }, {
    classMethods: {
      associate: function(entities) {
        TradeCard.belongsTo(entities.Account, {foreignKey: 'account_id'});
      }
    },
    tableName: 'trade_cards'
  });

  return TradeCard;
}