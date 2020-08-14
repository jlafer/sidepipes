import * as R from 'ramda';
import {sidepipe} from './index'

const sum = R.curry((x, y) => x + y);
const increment = x => x + 1;

test("sidepipe returns obj with Content-Type", () => {
  const myPipe = sidepipe(
    ['z', sum, 'x', 'y'],
    increment,
    [sum, 'x']
  );

  myPipe(2, 3);
  expect(myPipe(2, 3)).toEqual(8);
});

