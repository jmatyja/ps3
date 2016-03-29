import eaHash from 'ea-hash';
import MarketClient from './helpers/MarketClient';
import MysqlDbClient from './helpers/MysqlDbClient';
import createStore from './redux/create';
import CardsInfo from './workers/CardsInfo';

const TYPE_CARDS_INFO = 'cardsinfo';
let accountConfig = {
  email: 'psjmone@gmail.com',
  password: 'Klebuzsek2',
  answerHash: eaHash('jagiella'),
  emailPassword: 'Klebuzsek2',
  imapAddress: 'imap.gmail.com',
  platform: 'ps3',
  gameSku: 'FFA16PS3',
  host: 'utas.s2.fut.ea.com',
  type: 'cardsinfo',
  id: 'firstaccount',
  minBuyNowSearch: 1000
};
const client = new MarketClient();
const mysqlClient = new MysqlDbClient();
const store = createStore(client, mysqlClient);

switch(accountConfig.type) {
  case TYPE_CARDS_INFO:
    new CardsInfo(accountConfig, store).runTimer();
    break;
}

//connectToWebApp(config)
//  .then(serverData => console.log(serverData))
//  .catch(error =>{ console.log('error:'); console.log(error)});

//setMarketData({phishingToken: 'phishingToken', sid: 'sid'}, config);




//function handleChange() {
//  console.log(store.getState());
//}
//
//let unsubscribe = store.subscribe(handleChange);
//let {search} = bindActionCreators(cardsInfoActions, store.dispatch);
//
//search('firstaccount', {test: 'test'});

