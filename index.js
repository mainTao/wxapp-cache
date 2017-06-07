const memoryCache = {}

exports.get = function (key) {
  let objString
  if(memoryCache[key]){
    objString = memoryCache[key]
  }
  else{
    objString = wx.getStorageSync(key)
  }
  if(objString){
    const obj = JSON.parse(objString)
    if(obj.deadline && Date.now() > obj.deadline){
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
