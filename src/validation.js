import * as R from 'ramda';
import {parsePipeSegment} from './helpers';

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
  const fnComponents = parsePipeSegment(fnArr);
  return {fns: [...accum.fns, fnComponents]};
};

const validateArgsDefinedBeforeUse = (accum, fnComponents) => {
  if (accum.ERROR)
    return accum;
  const {resName, fn, argNames} = fnComponents;
  const undefinedArg = R.find(nameNotInArgs(accum.args), argNames);
  if (undefinedArg)
    return makeError(`"${undefinedArg}" is used before being defined`, fnComponents);
  if (resName) {
    if (accum.args.includes(resName))
      return makeError(`function result "${resName}" was previously named`, fnComponents);
    const accumArgs = [...accum.args, resName];
    return R.assoc('args', accumArgs, accum);
  }
  return accum;
};

const validateDataTypes = (accum, pipeSegment) => {
  if (accum.ERROR)
    return accum;
  if (typeof pipeSegment == 'function') {
    const fnComponents = parsePipeSegment(pipeSegment);
    return {fns: [...accum.fns, fnComponents]};
  }
  if (Array.isArray(pipeSegment))
    return validateFnArrDataTypes(accum, pipeSegment);
  else
    return makeError('argument must be a function or array [res, fn, args]:', pipeSegment);
};

export const validate = (fns) => {
  const typeValidation = R.reduce(validateDataTypes, {fns: []}, fns);
  if (typeValidation.ERROR)
    return typeValidation;
  const fn1 = R.head(typeValidation.fns);
  const initialArgs = fn1.argNames;
  return R.reduce(validateArgsDefinedBeforeUse, {args: initialArgs}, typeValidation.fns);
};
