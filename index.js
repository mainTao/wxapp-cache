const memoryCache = {}
const prefix = 'wxapp-cache:'

/**
 * Get value from cache
 * @param key
 * @returns {*}
 */
exports.get = function (key) {
  let objString
  if (memoryCache[key]) {
    objString = memoryCache[key]
  }
  else {
    objString = wx.getStorageSync(prefix + key)
    memoryCache[key] = objString
  }
  if (objString) {
    const obj = JSON.parse(objString)
    if (obj.deadline && Date.now() > obj.deadline) {
      delete memoryCache[key]
      wx.removeStorage({key: prefix + key})
      return undefined
    }
    else {
      return obj.value
    }
  }
  else {
    return undefined
  }
}

/**
 * Set KV pair into cache
 * @param key
 * @param value
 * @param maxAge expire time in second
 * @returns {*}
 */
exports.set = function (key, value, maxAge) {
  const obj = {
    value: value
  }
  if (maxAge) {
    obj.deadline = Date.now() + maxAge * 1000
  }
  const objString = JSON.stringify(obj)
  memoryCache[key] = objString
  wx.setStorage({
    key: prefix + key,
    data: objString
  })
  return value
}

/**
 * Remove KV pair
 * @param key
 */
exports.remove = function (key) {
  delete memoryCache[key]
  wx.removeStorageSync(prefix + key)
}

/**
 * Clear everything in cache
 * @returns {Promise<[string , string , string]>}
 */
exports.clear = function () {
  let promiseList = []

  for (let key in memoryCache) {

    let pro = new Promise(function (resolve, reject) {
      wx.removeStorage({
        key: prefix + key,
        success: function () {
          delete memoryCache[key]
          resolve(key)
        },
        fail: function () {
          reject(key)
        }
      })
    })

    promiseList.push(pro)
  }

  return Promise.all(promiseList)
}
