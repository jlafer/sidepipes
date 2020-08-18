import * as R from 'ramda';
import {validate} from './validation';
import {getFnComponents} from './helpers';

const _sidepipe = (isAsync, fns) => {
  const FN_NAME = isAsync ? 'sidepipe' : 'sidepipeSync';
  const validation = validate(fns);
  if ('ERROR' in validation) {
    console.error(`${FN_NAME}: invalid arguments:`, validation.ERROR);
    return validation;
  }

  return (...args) => {
    //console.log(`${FN_NAME}: functions:`, fns);
    const fn1 = R.head(fns);
    const {argNames} = getFnComponents(fn1);
    const sideData = R.zipObj(argNames, args);
    const pipeData = args;
    const accum = {sideData, pipeData}
    return fns.reduce(
      (accum, fn, idx) => {
        const {sideData, pipeData} = accum;;
        //console.log(`${FN_NAME}: sideData:`, sideData);
        //console.log(`${FN_NAME}: pipeData:`, pipeData);
        const {resName, fFn, argNames} = getFnComponents(fn);
        const sideArgs = (idx == 0) ? [] : R.props(argNames, sideData);
        const allArgs = [...sideArgs, ...pipeData];
        //console.log(`${FN_NAME}: allArgs:`, allArgs);
        const result = isAsync
          ? Promise.all(allArgs).then(args => fFn(...args))
          : fFn.call(null, ...allArgs);
        //console.log(`${FN_NAME}: result:`, result);
        const latestData = {...sideData};
        if (resName)
          latestData[resName] = result;
        return {sideData: latestData, pipeData: [result]};
      },
      accum
    )['pipeData'][0];
  };
};

const IS_ASYNC = true;
const IS_SYNC = false;

export const sidepipe = (...fns) =>  _sidepipe(IS_ASYNC, fns);
export const sidepipeSync = (...fns) => _sidepipe(IS_SYNC, fns);
