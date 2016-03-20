import * as marketActions from '../market';
import connectToWebApp from '../connector';
import setMarketData from '../market';

class _MarketClient {
  constructor() {
    this.search = (id, urlQuery) => marketActions.search(id, urlQuery);
    this.connect = (config) => connectToWebApp(config);
    this.setMarketData = (serverData, config) => setMarketData(serverData, config);
  }
}
const MarketClient = _MarketClient;
export default MarketClient;
