import State from './State';
import moment from 'moment';
import * as connectorActions from '../../redux/modules/connector';
import { bindActionCreators } from 'redux'
//time intervals are in seconds
const LOGIN_ATTEMPT_INTERVAL = 60;


class _MarketLogin extends State {
  constructor(stateConfigName, store) {
    super(stateConfigName);
    this.store = store;
    this.connectorActions = bindActionCreators(connectorActions, this.store.dispatch);
    this.storeUnsubscribe = this.store.subscribe(this.handleStoreChange.bind(this));
  }

  get id() {
    return this.config.id;
  }

  checkLogin() {

    if(!this.currentState || !this.currentState.connector || !this.currentState.connector[this.id]){
      this.connectorActions.login(this.config);
    }
    if( !this.currentState.connector || !this.currentState.connector[this.id] || this.currentState.connector[this.id].loggingIn){
      return false;
    }

    if(!this.currentState.connector[this.id].loggedInd) {
      if(this.currentState.connector[this.id].lastAttempt && moment().isAfter(moment(this.currentState.connector[this.id].lastAttempt).add(LOGIN_ATTEMPT_INTERVAL, 's'))){
        return false;
      }
      this.connectorActions.login(this.config);
      return false;
    }
    if(this.currentState.connector[this.id].loggedInd && !this.currentState.connector[this.id].marketDataIsSet) {
      this.connectorActions.setMarketData(this.currentState.connector[this.id].serverData, this.config);
      return false;
    }
    return true;
  }
}
const MarketLogin = _MarketLogin;
export default MarketLogin;
