const MIN_BUY_NOW_COUNT = 5;
const MAX_BUY_NOW_PRICES_COUNT = 3;

export function cardMaxBidPrice(tradingCard) {
  return  R.pipe(
      R.prop('prices'),
      R.slice(0, MAX_BUY_NOW_PRICES_COUNT),
      R.either(R.find(R.propSatisfies(count => count >= MIN_BUY_NOW_COUNT, 'count')), R.last),
      R.prop('buyNow')
  )(tradingCard);

}