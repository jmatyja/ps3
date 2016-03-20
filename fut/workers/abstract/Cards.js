import State from './State';
import moment from 'moment';

//time intervals are in seconds
const LOGIN_ATTEMPT_INTERVAL = 60;


class _Cards extends State {
  constructor(stateConfigName) {
    super(stateConfigName);
  }

  get id() {
    return this.config.id;
  }

  checkLogin() {
    if(!this.currentState){
      this.connectorActions.login(this.config);
    }
    if( !this.currentState.connector || !this.currentState.connector[this.accountId] || this.currentState.connector[this.accountId].loggingIn){
      return false;
    }

    if(!this.currentState.connector[this.accountId].loggedInd) {
      if(this.currentState.connector[this.accountId].lastAttempt && moment().isAfter(moment(this.currentState.connector[this.accountId].lastAttempt).add(LOGIN_ATTEMPT_INTERVAL, 's'))){
        return false;
      }
      console.log('login');
      this.connectorActions.login(this.config);
      return false;
    }
    if(this.currentState.connector[this.accountId].loggedInd && !this.currentState.connector[this.accountId].marketDataIsSet) {
      this.connectorActions.setMarketData(this.currentState.connector[this.accountId].serverData, this.config);
      return false;
    }
    return true;
  }
}
const Cards = _Cards;
export default Cards;
