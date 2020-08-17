import * as R from 'ramda';
import {validate} from './validation';
import {getFnComponents} from './helpers';

const _sidepipe = (isAsync, fns) => {
  const FN_NAME = isAsync ? 'sidepipe' : 'sidepipeSync';
  const validation = validate(fns);
  if ('ERROR' in validation) {
    console.error(`${FN_NAME}: invalid input:`, validation.ERROR);
    return validation;
  }

  return (...args) => {
    //console.log('sidepipe: functions:', fns);
    const fn1 = R.head(fns);
    const [_resName, _fFn, argNames] = getFnComponents(fn1);
    const sideData = R.zipObj(argNames, args);
    const input = [];
    const accum = {sideData, input}
    return fns.reduce(
      (accum, fn) => {
        const {sideData, input} = accum;;
        //console.log('sidepipe: sideData:', sideData);
        //console.log('sidepipe: input:', input);
        const [resName, fFn, argNames] = getFnComponents(fn);
        const sideArgs = R.props(argNames, sideData);
        const allArgs = [...sideArgs, ...input];
        //console.log('sidepipe: allArgs:', allArgs);
        const result = isAsync
          ? Promise.all(allArgs).then(args => fFn(...args))
          : fFn.call(null, ...allArgs);
        //console.log('sidepipe: result:', result);
        const latestData = {...sideData};
        if (resName)
          latestData[resName] = result;
        return {sideData: latestData, input: [result]};
      },
      accum
    )['input'][0];
  };
};

const IS_ASYNC = true;
const IS_SYNC = false;

export const sidepipe = (...fns) =>  _sidepipe(IS_ASYNC, fns);

export const sidepipeSync = (...fns) => _sidepipe(IS_SYNC, fns);
