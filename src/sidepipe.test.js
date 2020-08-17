import * as R from 'ramda';
import {sidepipe} from './index'

const sum = (x, y) => x + y;
const increment = x => x + 1;

const doubleP = x => Promise.resolve(x * 2);
const incrementP = x => Promise.resolve(x + 1);
const sumP = (x, y) => Promise.resolve(x + y);

test("sidepipe works with a single unary function that returns a promise", () => {
  const myPipe = sidepipe([doubleP, 'a']);
  expect(myPipe(21)).resolves.toEqual(42);
});

test("sidepipe works with a single n-ary function that returns a promise", () => {
  const myPipe = sidepipe([sumP, 'a', 'b']);
  expect(myPipe(21, 21)).resolves.toEqual(42);
});

const mixedPipe = [ ['z', sumP, 'x', 'y'], increment, [sumP, 'x'] ];
test("sidepipe calculates correctly with mix of promises and synchronous", () => {
  const myPipe = sidepipe(...mixedPipe);
  expect(myPipe(2, 3)).resolves.toEqual(8);
});

const fetchUser = (db, username) => Promise.resolve(
  {id: 1, username, name: R.toUpper(username)}
);
const fetchPrefs = (db, user) => Promise.resolve(
  {id: user.id, daytime: 'SMS', evenings: 'Phone'}
);
const contactUser = (user, prefs) => Promise.resolve(
  {id: user.id, channel: prefs.daytime, msg: `Hi ${user.name}`}
);

test("sidepipe calculates correctly with all promises", () => {
  const sendGreeting = sidepipe(
    ['user', fetchUser, 'db', 'username'],
    [fetchPrefs, 'db'],
    [contactUser, 'user']
  );
  expect(sendGreeting('db', 'jdoe')).resolves.toEqual({id: 1, channel: 'SMS', msg: 'Hi JDOE'});
});