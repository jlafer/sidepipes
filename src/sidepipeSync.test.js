import * as R from 'ramda';
import {sidepipeSync} from './index'

const sum = (x, y) => x + y;
const double = x => x * 2;
const increment = x => x + 1;

test("sidepipeSync works with a single unary function", () => {
  const myPipe = sidepipeSync([double, 'a']);
  expect(myPipe(21)).toEqual(42);
});

test("sidepipeSync works with a single n-ary function", () => {
  const myPipe = sidepipeSync([sum, 'a', 'b']);
  expect(myPipe(21, 21)).toEqual(42);
});

test("sidepipeSync works with a single function in array without named arguments", () => {
  const myPipe = sidepipeSync([sum]);
  expect(myPipe(21, 21)).toEqual(42);
});

test("sidepipeSync works with a single function without named arguments", () => {
  const myPipe = sidepipeSync(sum);
  expect(myPipe(21, 21)).toEqual(42);
});

test("sidepipeSync works with a pipeline without named arguments", () => {
  const myPipe = sidepipeSync(
    ['sum', sum],
    double,
    increment,
    [sum, 'sum']
  );
  expect(myPipe(21, 21)).toEqual(127);
});

const pipeline = [ ['z', sum, 'x', 'y'], increment, [sum, 'x'] ];

test("sidepipeSync calculates correctly", () => {
  const myPipe = sidepipeSync(...pipeline);
  expect(myPipe(2, 3)).toEqual(8);
});

/* const _addFullName = (user) => {
  const {first, last} = user;
  const fullName = `${first} ${last}`;
  return R.mergeRight(user, {fullName});
}

const assocWith = R.curry((key, fn, args, obj) => {
  const props = R.props(args, obj);
  const value = fn(...props);
  return R.mergeRight(obj, {[key]: value});
});

const setFullName = assocWith(
  'fullName',
  (first, last) => `${first} ${last}`,
  ['first', 'last']
); */
const _setFullName = R.converge(
  R.assoc('fullName'),
  [u => `${u.first} ${u.last}`, R.identity]
);

const assocWith = (key, fn) => R.converge(
  R.assoc(key),
  [fn, R.identity]
);
const setFullName = assocWith('fullName', u => `${u.first} ${u.last}`);

const formatPhone = num => num.replace(/([0-9]{3})([0-9]{3})([0-9]{4})/, '($1)$2-$3');
const formatPhoneNum = R.over(R.lensProp('phoneNum'), formatPhone);

const minnie = {first: 'Minnie', last: 'Mouse', phoneNum: '8005551212'};
const expectedMinnie = {first: 'Minnie', last: 'Mouse', fullName: 'Minnie Mouse', phoneNum: '(800)555-1212'};

test("sidepipeSync calculates correctly", () => {
  const myPipe = sidepipeSync(
    setFullName,
    formatPhoneNum
  );
  expect(myPipe(minnie)).toEqual(expectedMinnie);
});

const fallPromo = {
  baseDiscount: 10, bStates: ['MA', 'AL', 'OH', 'KS', 'NV']
};
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

const expectedAd = 'Mickey, as a preferred customer, take 5% off your next WhizBang!';

test("sidepipeSync calculates correctly", () => {
  const makeAd = sidepipeSync(
    [customerIncentive, 'promo', 'cust'],
    [abTest, 'cust'],
    [personalize, 'cust'],
    format
  );
  expect(makeAd(fallPromo, mickey)).toEqual(expectedAd);
});
