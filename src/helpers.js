import * as R from 'ramda';

export const assocMaybe = (k, v, data) => k ? R.assoc(k, v, data) : data;

const getResultFnAndArgs = (fnArr) => {
  const [resNameList, fnAndArgs] = R.splitWhen(item => typeof item === 'function', fnArr);
  const resName = R.head(resNameList);
  const fn = R.head(fnAndArgs);
  const argNames = R.tail(fnAndArgs);
  return {resName, fn, argNames};
};

export const parsePipeSegment = (pipeSegment) =>
  (Array.isArray(pipeSegment))
  ? getResultFnAndArgs(pipeSegment)
  : {resName: null, fn: pipeSegment, argNames: []};
