import * as mysqlActions from '../models/mysql';

class _MysqlDbClient {
  constructor() {
    this.addAuctions = (config, data) => mysqlActions.addAuctions(config, data);
    this.getCardsForAccount = (id) => mysqlActions.getCardsForAccount(id);
  }
}
const MysqlDbClient = _MysqlDbClient;
export default MysqlDbClient;
