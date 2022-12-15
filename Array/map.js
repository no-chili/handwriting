function map(arr,callback){
  const newArr=[]
  for (let index = 0; index < arr.length; index++) {
    const item = arr[index];
    newArr.push(callback(item,index,arr))
  }
  return newArr
}

const arr=[{name:1,age:2},{name:5,age:20},{name:9,age:78}]
console.log(map(arr,(item)=>{return item.name}));
