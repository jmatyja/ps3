import * as mysqlActions from '../models/mysql';

class _MysqlDbClient {
  constructor() {
    this.addAuctions = (config, data) => mysqlActions.addAuctions(config, data);
  }
}
const MysqlDbClient = _MysqlDbClient;
export default MysqlDbClient;
