// 权限树增加父级

const format = (Arr) => {
  Arr.forEach((it) => {
    let itArr = it.split("-");
    for (let i = itArr.length; i > 2; i--) {
      itArr.pop();
      Arr.push(itArr.join("-"));
    }
  });
  // 数组去重
  return Array.from(new Set(Arr));
};
export default format;
