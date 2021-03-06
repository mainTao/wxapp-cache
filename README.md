# wxapp-cache

A simple and reliable cache for wxapp client.

## Features

- L1 cache is in memory, for best performance
- L2 cache is wxStorage, all changes in the memory cache will also be written into wxStorage on device

The keys in wxStorage have prefix 'wxapp-cache:'.

## Usage

```javascript
const cache = require('wxapp-cache')

cache.set('userInfo', {id: 1234, name: 'Kate'})
cache.set('token', 'secretString', 3600) // will expire in one hour

cache.get('not exist') // undefined
cache.get('userInfo') // Object {id: 1234, name: 'Kate'}
cache.get('token') // String secretString

setTimeout(function () {
  cache.get('token') // undefined, because expire
}, 3600 * 1000)

cache.remove('userInfo')
cache.get('userInfo') // undefined, because removed

cache.clear() // return a promise
  .then(keys => {
    console.log(keys) // ["token"]
  })
```
