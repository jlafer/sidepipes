import * as R from 'ramda';
import {validate} from './validation';
import {assocMaybe, parsePipeSegment} from './helpers';

const getAllArgsForFn = (fluid, argNames, idx) => {
  const sideArgs = (idx == 0) ? [] : R.props(argNames, fluid.sideData);
  return R.concat(sideArgs, fluid.pipeData);
}

const accumulateResultIntoFluid = (fluid, resName, result) => {
  const newSideData = assocMaybe(resName, result, fluid.sideData);
  return {sideData: newSideData, pipeData: [result]};
};

const _sidepipe = (isAsync, fns) => {
  const FN_NAME = isAsync ? 'sidepipe' : 'sidepipeSync';
  const validation = validate(fns);
  if ('ERROR' in validation) {
    console.error(`${FN_NAME}: invalid arguments:`, validation.ERROR);
    return validation;
  }
  const fn1 = R.head(fns);
  const {argNames} = parsePipeSegment(fn1);

  return (...args) => {
    const initialSideData = R.zipObj(argNames, args);
    const fluid = {sideData: initialSideData, pipeData: args};
    return fns.reduce(
      (fluid, pipeSegment, idx) => {
        const {resName, fn, argNames} = parsePipeSegment(pipeSegment);
        const allArgs = getAllArgsForFn(fluid, argNames, idx);
        const result = isAsync
          ? Promise.all(allArgs).then(args => fn(...args))
          : fn.call(null, ...allArgs);
        return accumulateResultIntoFluid(fluid, resName, result);
      },
      fluid
    )['pipeData'][0];
  };
};

const IS_ASYNC = true;
const IS_SYNC = false;

export const sidepipe = (...fns) =>  _sidepipe(IS_ASYNC, fns);
export const sidepipeSync = (...fns) => _sidepipe(IS_SYNC, fns);
