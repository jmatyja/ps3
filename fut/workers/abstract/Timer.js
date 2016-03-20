
class Timer {
  constructor() {
    this.interval = 1000;
  }
  runTimer() {
    this.timer = setInterval(() => {
      this.tick();
    }, this.interval);
  }
  stopTimer() {
    clearInterval(this.timer);
  }
}
export default Timer;

