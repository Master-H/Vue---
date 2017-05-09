
// //存取
// export function saveToLocal(id,key,value){
//   //双下划綫表示私有的
//   let seller = localStorage._seller_;
//   if(!seller){
//     seller = {};
//     seller[id] = {};
//   }else{
//     //因为localStorage存储的是一个字符串
//     seller = JSON.parse(seller)
//     //因为可能第一次存的是A商家，现在是B商家
//     if(!seller[id]){
//       seller[id] = {};
//     }
//   }
//   seller[id][key] = value;
//   localStorage._seller_ = JSON.stringify(seller)
// }
// //读取
// export function loadFromLocal(id,key,def){
//   let seller = window.localStorage.__seller__;
//   if (!seller) {
//     return def;
//   }
//   seller = JSON.parse(seller)[id];
//   //取到seller了，但是没有这个ID的话
//   if (!seller) {
//     return def;
//   }
//   let ret = seller[key];
//   return ret || def;
// }
export function saveToLocal(id, key, value) {
  let seller = window.localStorage.__seller__;
  if (!seller) {
    seller = {};
    seller[id] = {};
  } else {
    seller = JSON.parse(seller);
    if (!seller[id]) {
      seller[id] = {};
    }
  }
  seller[id][key] = value;
  window.localStorage.__seller__ = JSON.stringify(seller);
};

export function loadFromLocal(id, key, def) {
  let seller = window.localStorage.__seller__;
  if (!seller) {
    return def;
  }
  seller = JSON.parse(seller)[id];
  if (!seller) {
    return def;
  }
  let ret = seller[key];
  return ret || def;
};
