/*
const compose = (...fns) =>
  (...args) => fns.reduceRight(
    (res, fn) => [fn.call(null, ...res)],
    args
  )[0];
*/

import * as R from 'ramda';

const getResultFnAndArgs = (fnArr) => {
  const fnIdx = (typeof fnArr[1] === 'function') ? 1 : 0;
  const fFn = fnArr[fnIdx];
  const resName = (fnIdx === 1) ? fnArr[0] : null;
  const argNames = fnArr.slice(fnIdx+1);
  return [resName, fFn, argNames];
};

const getFnComponents = (fn) => {
  console.log('getFnComponents: parsing:', fn);
  let result;
  if (Array.isArray(fn)) {
    console.log('getFnComponents: it is an array');
    result = getResultFnAndArgs(fn);
  }
  else {
    console.log('getFnComponents: it is NOT an array');
    result = [null, fn, []]
  }
  console.log('getFnComponents: returning:', result);
  return result;
};

export const sidepipe = (...fns) =>
  (...args) => {
    const fn1 = R.head(fns);
    const [resName, fFn, argNames] = getFnComponents(fn1);
    const sideData = R.zipObj(argNames, args);
    const input = [];
    const accum = {sideData, input}
    return fns.reduce(
      (accum, fn) => {
        const {sideData, input} = accum;;
        console.log('sidepipe: sideData:', sideData);
        console.log('sidepipe: input:', input);
        const [resName, fFn, argNames] = getFnComponents(fn);
        const sideArgs = R.props(argNames, sideData);
        const allArgs = [...sideArgs, ...input];
        console.log('sidepipe: allArgs:', allArgs);
        const result = fFn(...allArgs);
        console.log('sidepipe: result:', result);
        const latestData = {...sideData};
        if (resName)
          latestData[resName] = result;
        return {sideData: latestData, input: [result]};
      },
      accum
    )['input'][0];
  }