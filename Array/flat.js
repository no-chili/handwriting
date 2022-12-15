export default function flat(arr){
    let flatArr=[]
    arr.map(item=>{
      if(item instanceof Array){
        flatArr.push(...flat(item))
      }else{
        flatArr.push(item) 
      }
    })
    return flatArr
}
const arr=['1',[null,'3',[undefined]],'5']
const f = flat(arr)
console.log(f);
