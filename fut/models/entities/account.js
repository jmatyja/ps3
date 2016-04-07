import eaHash from 'ea-hash';
export default (sequelize, DataTypes) => {
  let Account = sequelize.define("Account", {
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    securityAnswer: {
      type: DataTypes.STRING,
      field: 'security_answer',
      get: function() {
        return eaHash(this.getDataValue('securityAnswer'))
      }
    },
    emailPassword: {
      type: DataTypes.STRING,
      field: 'email_password'
    },
    imapAddress: {
      type: DataTypes.STRING,
      field: 'imap_address'
    },
    platform: DataTypes.STRING,
    gameSku: {
      type: DataTypes.STRING,
      field: 'game_sku'
    },
    host: DataTypes.STRING,
    type: DataTypes.STRING,
    minBuyNowSearch: {
      type: DataTypes.INTEGER,
      field: 'min_buy_now_search'
    },
    serverName: {
      type: DataTypes.STRING,
      field: 'server_name'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      field: 'is_active'
    },
    startSearch: {
      type: DataTypes.INTEGER,
      field: 'start_search'
    },
    endSearch: {
      type: DataTypes.INTEGER,
      field: 'end_search'
    }
  }, {
    classMethods: {
      associate: function(entities) {
        Account.hasMany(entities.Auction, {as: 'Auctions', foreignKey: 'account_id'});
        Account.hasMany(entities.TradeCard, {as: 'TradeCards', foreignKey: 'account_id'});
      }
    },
    tableName: 'accounts'
  });

  return Account;
}