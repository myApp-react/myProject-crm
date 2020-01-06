import pathToRegexp from 'path-to-regexp'
import { stringify } from 'qs'
import umiRouter from 'umi/router';
import { message } from 'antd'
// import { UploadFile } from 'antd/es/upload/interface';
export const getBase64 = (img: any, callback: any) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

export const pictureTypeaAndSize = (file: any) => {
  const isJPG = file.type === 'image/jpeg';
  const isJPEG = file.type === 'image/jpeg';
  const isGIF = file.type === 'image/gif';
  const isPNG = file.type === 'image/png';
  if (!(isJPG || isJPEG || isGIF || isPNG)) return false;
  const isLt2M = file.size / 1024 / 1024 < 1;
  if (!isLt2M) return false;
  return (isJPG || isJPEG || isGIF || isPNG) && isLt2M
}

export const checkImageWH = (file: any, width: number, height?: number) => {
  return new Promise(function(resolve, reject) {
    let filereader = new FileReader();
    filereader.onload = (e: any) => {
      let src = e.target.result;
      const image = new Image();
      image.onload = function() {
        const imageW = image.width,
              imageH = image.height;

        // 获取图片的宽高，并存放到file对象中
        // file.width = this.width;
        // file.height = this.height;

        // if(imageW <= width){
        //   resolve(true);
        // }else {
        //   message.error(`上传图片宽度最大为${width}PX`);
        //   reject()
        // }

        if(height){
          if(imageW === width && imageH === height){
            resolve(true);
          }else {
            message.error(`请选择宽度为${width}PX，高度为${height}PX的图片`);
            reject()
          }
        }else {
          if(imageW <= width){
            resolve(true);
          }else {
            message.error(`上传图片宽度最大为${width}PX`);
            reject()
          }
        }
        // if(this.width <= width){
        //   resolve();
        // }else {
        //   message.error(`上传图片宽度最大为${width}PX`);
        //   reject()
        // }
      };
      image.onerror = reject;
      image.src = src;
    };
    filereader.readAsDataURL(file);
  });
}

export const mergeDataByParam = (array: Array<any>, id: string, currentId: string, val: any) => {
  let result = [], ImagesArr = [], arr = {};
  const len = array.length;
  for (let i = 0; i < len; ++i ){
    if(array[i].Id === id){
      ImagesArr = [...array[i][currentId], val];
      console.log('ImagesArr', ImagesArr)
      arr = {
        ...array[i],
        [currentId]: ImagesArr
      }
      console.log('arr', arr)
      result.push(arr)
    }else {
      result.push(array[i])
    }
  }
  return result
}

export const changeValById = (array: Array<any>, currentArr: any, id: string, currentId: string, val: number) => {
  let result = [], arr = {};
  const len = array.length;
  for (let i = 0; i < len; ++i ){
    if(array[i].Id === id){
      if(currentId){
        arr = {
          ...array[i],
          [currentId]: val
        }
        result.push(arr)
      }
      if(currentArr) {
        result.push(currentArr)
      }
    }else {
      result.push(array[i])
    }
  }
  return result
}


export const handleRefresh = (newQuery: any, location: any) => {
  const { pathname, query } = location;
  umiRouter.replace({
    pathname,
    search: stringify(
      {
        ...query,
        ...newQuery,
      },
      { arrayFormat: 'repeat' }
    ),
  })
}
/**
 * Whether the path matches the regexp if the language prefix is ignored, https://github.com/pillarjs/path-to-regexp.
 * @param   {string|regexp|array}     regexp     Specify a string, array of strings, or a regular expression.
 * @param   {string}                  pathname   Specify the pathname to match.
 * @return  {array|null}              Return the result of the match or null.
 */
export function pathMatchRegexp(regexp: any, pathname: string) {
  // console.log(regexp);
  return pathToRegexp(regexp).exec(pathname)
}

/**
 * Query objects that specify keys and values in an array where all values are objects.
 * @param   {array}         array   An array where all values are objects, like [{key:1},{key:2}].
 * @param   {string}        key     The key of the object that needs to be queried.
 * @param   {string}        value   The value of the object that needs to be queried.
 * @return  {object|undefined}   Return frist object when query success.
 */
export function queryArray(array: Array<any>, key: string, value: string) {
  if (!Array.isArray(array)) {
    return
  }
  return array.find(_ => _[key] === value)
}

/**
 * In an array object, traverse all parent IDs based on the value of an object.
 * @param   {array}     array     The Array need to Converted.
 * @param   {string}    current   Specify the value of the object that needs to be queried. 指定需要查询的对象的值
 * @param   {string}    parentId  The alias of the parent ID of the object in the array. 数组中对象的父ID的别名
 * @param   {string}    id        The alias of the unique ID of the object in the array. 数组中对象的唯一ID的别名
 * @return  {array}    Return a key array.
 */
export function queryPathKeys(array: Array<any>, current: string, parentId: string, id: string = 'id') {

  const result = [current]
  const hashMap = new Map()
  array.forEach(item => hashMap.set(item[id], item))
  const getPath = (current: string) => {
    const currentParentId = hashMap.get(current)[parentId]
    if (currentParentId) {
      result.push(currentParentId)
      getPath(currentParentId)
    }
  }

  getPath(current)
  return result
}


/**
 * In an array of objects, specify an object that traverses the objects whose parent ID matches.
 * @param   {array}     array     The Array need to Converted.
 * @param   {string}    current   Specify the object that needs to be queried.
 * @param   {string}    parentId  The alias of the parent ID of the object in the array.
 * @param   {string}    id        The alias of the unique ID of the object in the array.
 * @return  {array}    Return a key array.
 */
export function queryAncestors(array: Array<any>, current: string, parentId: string, id: string = 'id') {
  const result = [current]
  const hashMap = new Map()
  array.forEach(item => hashMap.set(item[id], item))

  const getPath = (current: string) => {
    const currentParentId = hashMap.get(current[id])[parentId]
    if (currentParentId) {
      result.push(hashMap.get(currentParentId))
      getPath(hashMap.get(currentParentId))
    }
  }

  getPath(current)
  return result
}
