import * as R from 'ramda';
import {getFnComponents} from './helpers';

const makeError = (message, data) => ({'ERROR': {message, data}});

const nameNotInArgs = R.curry((accumArgs, argName) => ( ! R.includes(argName, accumArgs) ));
const notAFunctionOrString = item => ( ! ['string', 'function'].includes(typeof item) );

const validateFnArrDataTypes = (accum, fnArr) => {
  const fnIdx = fnArr.findIndex(item => typeof item === 'function');
  if (fnIdx == -1)
    return makeError('argument must contain a function', fnArr);
  if (fnIdx > 1)
    return makeError('argument must contain a function in 1st or 2nd position', fnArr);
  if (R.any(notAFunctionOrString, fnArr))
    return makeError('argument must contain a function and only strings', fnArr);
  const resName = (fnIdx === 1) ? fnArr[0] : null;
  const fFn = fnArr[fnIdx];
  const argNames = fnArr.slice(fnIdx+1);
  const accumFns = [...accum.fns, {resName, fFn, argNames}];
  return {fns: accumFns};
};

const validateArgsDefinedBeforeUse = (accum, fnArr) => {
  if (accum.ERROR)
    return accum;
  console.log('validateArgsDefinedBeforeUse: accum.args', accum.args);
  console.log('validateArgsDefinedBeforeUse: fnArr', fnArr);
  const undefinedArg = R.find(nameNotInArgs(accum.args), fnArr.argNames);
  console.log('validateArgsDefinedBeforeUse: undefinedArg', undefinedArg);
  if (undefinedArg)
    return makeError(`${undefinedArg} is used before defined`, fnArr);
  if (fnArr.resName) {
    const accumArgs = [...accum.args, fnArr.resName];
    return R.assoc('args', accumArgs, accum);
  }
  return accum;
};

const validateDataTypes = (accum, fn) => {
  if (accum.ERROR)
    return accum;
  if (typeof fn == 'function')
    return {fns: [...accum.fns, {resName: null, fFn: fn, argNames: []}]};
  if (Array.isArray(fn))
    return validateFnArrDataTypes(accum, fn);
  else
    return makeError('argument must be a function or array [ret, fn, args]:', fn);
};

export const validate = (fns) => {
  const typeValidation = R.reduce(validateDataTypes, {fns: []}, fns);
  if (typeValidation.ERROR)
    return typeValidation;
  const fn1 = R.head(typeValidation.fns);
  const initialArgs = fn1.argNames;
  console.log('validate: initialArgs:', initialArgs);
  return R.reduce(validateArgsDefinedBeforeUse, {args: initialArgs}, typeValidation.fns);
};
