const memoryCache = {}

exports.get = function (key) {
  let objString
  if(memoryCache[key]){
    objString = memoryCache[key]
  }
  else{
    objString = wx.getStorageSync(key)
    memoryCache[key] = objString
  }
  if(objString){
    const obj = JSON.parse(objString)
    if(obj.deadline && Date.now() > obj.deadline){
      memoryCache[key] = undefined
      wx.removeStorage({key: key})
      return undefined
    }
    else{
      return obj.value
    }
  }
  else{
    return undefined
  }
}

exports.set = function (key, value, maxAge) {
  const obj = {
    value: value,
  }
  if(maxAge){
    obj.deadline = Date.now() + maxAge * 1000
  }
  const objString = JSON.stringify(obj)
  memoryCache[key] = objString
  wx.setStorage({
    key: key,
    data: objString
  })
  return value
}
