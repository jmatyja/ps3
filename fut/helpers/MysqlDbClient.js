import * as mysqlActions from '../models/mysql';

class _MysqlDbClient {
  constructor() {
    this.addAuctions = (config, data) => mysqlActions.addAuctions(config, data);
    this.getCardsForAccount = (id) => mysqlActions.getCardsForAccount(id);
    this.getCardsFromCardsInfo = (id) => mysqlActions.getCardsFromCardsInfo(id, limit);
    this.getAuctions = (toDate) => mysqlActions.getAuctions(toDate);
  }
}
const MysqlDbClient = _MysqlDbClient;
export default MysqlDbClient;
