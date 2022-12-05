const [PENDING, FULFILLED, REJECTED] = ['PENDING', 'FULFILLED', 'REJECTED']
const MyPromise =function(exector){
  this.state = PENDING
  this.value = undefined
  this.reason = undefined
  this.onFulfilledCallbacks = []
  this.onRejectedCallbacks = []
  const resolve = (value) => {
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
      if ((typeof x === 'object' && x !== null) || typeof x === 'function') {
      } else {
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
export {MyPromise}
