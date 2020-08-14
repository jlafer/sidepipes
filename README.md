# sidepipes

An experimental HOF for composing n-ary functions.

## Installation

npm install --save jlafer-sidepipes

## Functions

### sidepipe(functionExprs)
```
sidepipe :: [functionExpr] -> function
```
```javascript
  const sum = R.curry((x, y) => x + y);
  const increment = x => x + 1;

  sidepipe(
    ['z', sum, 'x', 'y'],
    increment,
    [sum, 'x']
  );

  myPipe(2, 3); // 8
```
