const getResultFnAndArgs = (fnArr) => {
  const fnIdx = (typeof fnArr[1] === 'function') ? 1 : 0;
  const fFn = fnArr[fnIdx];
  const resName = (fnIdx === 1) ? fnArr[0] : null;
  const argNames = fnArr.slice(fnIdx+1);
  return {resName, fFn, argNames};
};

export const getFnComponents = (fn) => {
  //console.log('getFnComponents: parsing:', fn);
  let result;
  if (Array.isArray(fn)) {
    //console.log('getFnComponents: it is an array');
    result = getResultFnAndArgs(fn);
  }
  else {
    //console.log('getFnComponents: it is NOT an array');
    result = {resName: null, fFn: fn, argNames: []};
  }
  //console.log('getFnComponents: returning:', result);
  return result;
};

