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
