const [PENDING, FULFILLED, REJECTED] = ['PENDING', 'FULFILLED', 'REJECTED']
const MyPromise =function(exector){
  this.state = PENDING
  this.value = undefined
  this.reason = undefined
  this.onFulfilledCallbacks = []
  this.onRejectedCallbacks = []
  const resolve = (value) => {
    if (value instanceof MyPromise) {
        value.then(resolve, reject)
        return
    }
    if (this.state === PENDING) {
        this.state = FULFILLED
        this.value = value
        this.onFulfilledCallbacks.forEach((fn) => fn())
    }
  }
  const reject = (reason) => {
      if (this.state === PENDING) {
          this.state = REJECTED
          this.reason = reason
          this.onRejectedCallbacks.forEach((fn) => fn())
      }
  }
  try {
      exector(resolve, reject)
  } catch (e) {
      reject(e)
  }
  this.then =(onFulfilled, onRejected)=>{
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : (value) => value
    onRejected = typeof onRejected ==='function' ? onRejected :reason=>{throw reason}
    function resolvePromise(promise2, x, resolve, reject) {
      if (x === promise2) {
          return reject(new TypeError('Chaining cycle detected for promise #<MyPromise>'))
      }
      let called = false
      if ((typeof x === 'object' && x !== null) || typeof x === 'function') {
        let then = x.then
        try {
            if (typeof then === 'function') {
                then.call(
                    x,
                    (y) => {
                        if (called) return
                        called = true
                        resolvePromise(promise2, y, resolve, reject)
                    },
                    (r) => {
                        if (called) return
                        called = true
                        reject(r)
                    }
                )
            } else {
                resolve(x)
            }
        }  catch (e) {
            if (called) return
            called = true
            reject(e)
        }
      }  else {
          resolve(x)
      }
    }
    const promise2=new MyPromise((resolve,reject)=>{
      if (this.state === FULFILLED) {
          setTimeout(() => {
            try {
              let x = onFulfilled(this.value)
              resolvePromise(promise2, x, resolve, reject)
            } catch (e) {
                reject(e)
            }
          }, 0)
      }
      if (this.state === REJECTED) {
          setTimeout(() => {
            try {
              let x = onRejected(this.value)
              resolvePromise(promise2, x, resolve, reject)
            } catch (e) {
              reject(e)
            }
            
          }, 0)
      }
      if (this.state === PENDING) {
          this.onFulfilledCallbacks.push(() => {
            try {
                let x = onFulfilled(this.value)
                resolvePromise(promise2, x, resolve, reject)
            } catch (e) {
                reject(e)
            }
          })
          this.onRejectedCallbacks.push(() => {
            try {
                let x = onRejected(this.reason)
                resolvePromise(promise2, x, resolve, reject)
            } catch (e) {
                reject(e)
            }
          })
      }
    })
    return promise2
  }
}
//工具函数封装
function isIterable(value) {
  return value !== null && value !== undefined && typeof value[Symbol.iterator] === 'function'
}

function isPromise(x) {
  if ((typeof x === 'object' && x !== null) || typeof x == 'function') {
      let then = x.then
      return typeof then === 'function'
  }
  return false
}
// 静态方法模拟
MyPromise.prototype.resolve=(value)=>{
  return new MyPromise((resolve, reject)=>{
      resolve(value)
  })
}
MyPromise.prototype.reject=(reason)=>{
  return new MyPromise((resolve, reject)=>{
    reject(reason)
  })
}
MyPromise.prototype.all=(promiseArr)=>{
  // 返回一个新的promise，内部建一个数组存放已解决promise，当长度等于promiseArr后resolve出去
  let resArr = [],
      idx = 0
  if (!isIterable(promiseArr)) {
      let type = typeof promiseArr
      throw TypeError(`${type} is not a iterable (cannot read property Symbol(Symbol.iterator))
at Function.all (<anonymous>)`)
  }
  return new MyPromise((resolve, reject) => {
      promiseArr.map((promise, index) => {
          if (isPromise(promise)) {
              promise.then((res) => {
                  formatArr(res, index, resolve)
              }, reject)
          } else {
              formatArr(promise, index, resolve)
          }
      })
  })

  function formatArr(value, index, resolve) {
      resArr[index] = value
      // if(resArr.length ===promiseArr.length) 在某些时刻不正确，比如数组最后一项先执行完 数组就为[empty,empty,value]
      if (++idx === promiseArr.length) {
          resolve(resArr)
      }
  }
}
export {MyPromise}
