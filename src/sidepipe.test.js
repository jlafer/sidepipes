import * as R from 'ramda';
import {sidepipe, sidepipeSync} from './index'

const sum = R.curry((x, y) => x + y);
const increment = x => x + 1;

const pipeline = [ ['z', sum, 'x', 'y'], increment, [sum, 'x'] ];

test("sidepipe calculates correctly", () => {
  const myPipe = sidepipe(...pipeline);
  expect(myPipe(2, 3)).resolves.toEqual(8);
});

test("sidepipeSync calculates correctly", () => {
  const myPipe = sidepipeSync(
    ['z', sum, 'x', 'y'], increment, [sum, 'x']
  );
  expect(myPipe(2, 3)).toEqual(8);
});

