import * as R from 'ramda';

const getResultFnAndArgs = (fnArr) => {
  const fnIdx = R.findIndex(item => typeof item === 'function', fnArr);
  const fFn = fnArr[fnIdx];
  const resName = (fnIdx === 1) ? fnArr[0] : null;
  const argNames = fnArr.slice(fnIdx+1);
  return {resName, fFn, argNames};
};

export const getFnComponents = (fn) =>
  (Array.isArray(fn))
  ? getResultFnAndArgs(fn)
  : {resName: null, fFn: fn, argNames: []};
