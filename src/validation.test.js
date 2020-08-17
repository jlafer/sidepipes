import {sidepipe} from './index'

const sum = (x, y) => x + y;
const double = x => x * 2;
const increment = x => x + 1;

const validationError = {
  ERROR: {
    message: expect.any(String),
    data: expect.anything()
  }
};

test("sidepipe validation returns error on arg without a function", () => {
  const myPipe = sidepipe(42);
  expect(myPipe).toEqual(expect.objectContaining(validationError));
});
test("sidepipe validation returns error on function after more than one return value", () => {
  const myPipe = sidepipe(['a', 'b', sum, 'x', 'y']);
  expect(myPipe).toEqual(expect.objectContaining(validationError));
});
test("sidepipe validation returns error on arg that is not function nor string", () => {
  const myPipe = sidepipe(['a', sum, 'x', 'y', 42]);
  expect(myPipe).toEqual(expect.objectContaining(validationError));
});
test("sidepipe validation returns error on arg that is used before defined", () => {
  const myPipe = sidepipe(
    ['a', sum, 'x', 'y'],
    [sum, 'z']
  );
  expect(myPipe).toEqual(expect.objectContaining(validationError));
});
