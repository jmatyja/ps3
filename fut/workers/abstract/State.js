import Timer from './Timer';

class State extends Timer {
  constructor(stateConfigName) {
    super();
    this.stateConfigName = stateConfigName;
  }

  get state() {
    if(null == this.currentState || null == this.stateConfigName || undefined == this.config.id) {
      return this.currentState;
    }
    if(undefined != this.currentState[this.stateConfigName] && undefined != this.config.id){
      return this.currentState[this.stateConfigName][this.config.id];
    }
    return null;
  }

  set state(newState) {
    this.currentState = newState;
  }

  get accountId() {
    return this.config.id;
  }
}
export default State;

