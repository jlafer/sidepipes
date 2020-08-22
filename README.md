# sidepipes

Some experimental HOFs for composing n-ary functions.

## Description

`sidepipe` is a higher order function (HOF) that enables left-to-right function composition with `n-ary` functions. Similar to the `pipe` abstraction, `sidepipe` returns a function pipeline or composition. `pipe` only allows the use of unary functions. This can make it difficult to incorporate many functions into a pipeline without resorting to advanced techniques like the use of State monads. However, `sidepipe` provides a concise, declarative syntax for specifying additional arguments to the one resulting from the previous function in the pipeline.

The function arguments to `sidepipe` can be any combination of regular (synchronous) functions or those that return a Promise. The result of executing the function created by calling `sidepipe` is a JavaScript Promise. So its output can be chained into `.then` for additional function calling and/or `.catch` for trapping errors generated during pipeline execution. If all of the function arguments are synchronous, you can use `sidepipeSync` which operates in a fully synchronous manner.

Each argument to `sidepipe` is either a (unary) function or an array consisting of a function, one or more additional argument names, and an optional result name (for use as an argument to a subsequent function).

A sidepipe argument has the following format:

`function` || [`(resultName)`, `function`, `argName`, ...]
```
const f = sidepipe(functionExpressions);

f(fnArgs).then(fnToConsumeResults);
```
## Installation

npm install --save sidepipes

## Functions

### sidepipe(functionExprs)
```
sidepipe :: [functionExpr] -> function
```
```javascript
  const fetchUser = (database, username) => {
    const data = [
      {id: 1, username: 'minnie', name: 'Minnie Mouse'},
      {id: 2, username: 'dduck', name: 'Donald Duck'}
    ];
    return Promise.resolve( data.find(user => user.username === username) );
  };
  const fetchPrefs = (database, user) => {
    const data = [
      {id: 1, outboundChannel: 'SMS'},
      {id: 2, outboundChannel: 'Phone'}
    ];
    return Promise.resolve( data.find(pref => pref.id === user.id) );
  };
  const formatGreeting = (user, prefs) => (
    {id: user.id, channel: prefs.outboundChannel, text: `Hi ${user.name}`}
  );
  const sendGreeting = (greeting) => Promise.resolve(
    // sendOutbound(greeting);
    `greeting sent to user ${greeting.id} over ${greeting.channel}`
  );

  const getAndGreetUser = sidepipe(
    ['user', fetchUser, 'db', 'username'],
    [fetchPrefs, 'db'],
    [formatGreeting, 'user'],
    sendGreeting
  );

  getAndGreetUser('db', 'minnie')
  .then(res => console.log(res))  // -> "greeting sent to user 1 over SMS"
```
### sidepipeSync(functionExprs)
```
sidepipeSync :: [functionExpr] -> function
```
```javascript
const fallPromo = {baseDiscount: 10, bStates: ['MA', 'AL', 'OH', 'KS', 'NV']};

const mickey = {
  firstName: 'Mickey', state: 'KS', nextProduct: 'WhizBang', discountAdjust: -5
};

const customerIncentive = (promo, customer) => {
  const {baseDiscount, bStates} = promo;
  const {nextProduct, discountAdjust} = customer;
  return {product: nextProduct, discount: baseDiscount + discountAdjust, bStates};
}

const abTest = (customer, incentive) => ({
  ...incentive,
  rationale: incentive.bStates.includes(customer.state)
    ? 'as a preferred customer'
    : 'because you work hard for your money'
});

const personalize = (customer, incentive) => (
  {...incentive, name: customer.firstName}
);

const format = (incentive) => {
  const {name, rationale, discount, product} = incentive;
  return `${name}, ${rationale}, take ${discount}% off your next ${product}!`
};

const makeAd = sidepipeSync(
  [customerIncentive, 'promo', 'cust'],
  [abTest, 'cust'],
  [personalize, 'cust'],
  format
);

makeAd(fallPromo, mickey);  // "Mickey, as a preferred customer, take 5% off your next WhizBang!"
```