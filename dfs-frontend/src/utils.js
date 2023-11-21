export const canCreateVersionId = (currentVersionId , newChar) => {
  if(newChar === '-'){
    if(currentVersionId.split('-').length === 3 && newChar === '-') return false;
    return true;
  }
  if('123456789'.indexOf(newChar) > -1) return true;
  return false;
}

const isNum = s => s.split('').every(i => '1234567890'.indexOf(i) > -1) && s!=='';

export const isPartialVersionId = (versionId) => {
  const versionIdArray = versionId.split('-');
  console.log({versionId, versionIdArray});
  if(versionIdArray.length === 1){
    if(versionIdArray[0] === '' || isNum(versionId)) return true;
  } else {
    if(versionIdArray.length === 2){
      if(isNum(versionIdArray[0]) && (versionIdArray[1] === '' || isNum(versionIdArray[1]))) return true;
    } else if(versionIdArray.length === 3){
      if(isNum(versionIdArray[0]) && isNum(versionIdArray[1]) && versionIdArray[2] === '') return true;
    }
  }
  return false;
}

export const isVersionId = (versionId) => {
  const versionIdArray = versionId.split('-');
  return versionIdArray.every(isNum);
}
