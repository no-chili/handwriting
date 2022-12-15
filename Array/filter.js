function filter(arr,callback){
  let newArr=[]
  for (let index = 0; index < arr.length; index++) {
    let item=arr[index]
    callback(item,index,arr)?newArr.push(item):null
  }
  return newArr
}

console.log(filter([1,2,3,4,5],(item)=>{return item<3}));
