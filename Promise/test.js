import {MyPromise} from './promise.js'
const promise = new MyPromise((resolve,reject)=>{
  setTimeout(resolve,3000)
  // reject('no')
})
.then(res=>{
  return 1
})
.then(res=>{
  console.log(res)
})
setTimeout(()=>{
  console.log(promise);
},5000)
