import MarketClient from './helpers/MarketClient';
import MysqlDbClient from './helpers/MysqlDbClient';
import createStore from './redux/create';
import CardsInfo from './workers/CardsInfo';
import CardsTrade from './workers/CardsTrade';
import Cards from './workers/Cards';
import {getAccounts} from './models/mysql';
import entities from './models/entities/index';

const TYPE_CARDS_INFO = 'cardsinfo';
const TYPE_CARDS_TRADE = 'cardstrade';
const TYPE_CARDS = 'cards';

const client = new MarketClient();
const mysqlClient = new MysqlDbClient();
const store = createStore(client, mysqlClient);

const runWorker = function(accountConfig, store) {
  switch(accountConfig.type) {
    case TYPE_CARDS_INFO:
      new CardsInfo(accountConfig, store).runTimer();
      break;
    case TYPE_CARDS_TRADE:
      new CardsTrade(accountConfig, store).runTimer();
      break;
    case TYPE_CARDS:
      new Cards(accountConfig, store).runTimer();
      break;
  }
}

// entities.sequelizee
//   .sync()
//   .then(() => console.log('synced'))
//   .catch(error => console.log(error));

getAccounts()
  .then(accounts => accounts.forEach(account => runWorker(account, store)))
  .catch(error => console.log(error));
