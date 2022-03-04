import request from "./../utils/request";

// 获取轮播图数据
export function getBannerList() {
  return request({
    url: "/banner/list"
  });
}
// 添加轮播图数据
export function addBanner(params) {
  return request({
    url: "/banner/add",
    method: "POST",
    data: params
  });
}
// 删除轮播图数据
export function deleteBanner(params) {
  return request({
    url: "/banner/delete",
    // method: 'GET',
    data: params
  });
}
// 获取产品列表数据
export function getProList(params) {
  return request({
    url: "/pro/list",
    data: params
  });
}
// 获取产品分类数据
export function getCategoryList() {
  return request({
    url: "/pro/getCategory"
  });
}
// 获取产品搜索数据 category search
export function getSearchList(params) {
  return request({
    url: "/pro/searchPro",
    method: "POST",
    data: params
  });
}

// 修改商品是否 售卖 推荐 秒杀
// proid  type  flag
// type issale isseckill isrecommend
// flag true flase
export function updateFlag(params) {
  return request({
    url: "/pro/updateFlag",
    method: "POST",
    data: params
  });
}

// 获取秒杀数据
// type isseckill isrecommend
// flag  1   0
export function getSeckillData() {
  return request({
    url: "/pro/showdata",
    method: "POST",
    data: {
      type: "isseckill",
      flag: 1
    }
  });
}

// 获取推荐数据
// type  isrecommend
// flag  1   0
export function getRecommendData(params) {
  return request({
    url: "/pro/showdata",
    method: "POST",
    data: {
      type: "isrecommend",
      flag: 1
    }
  });
}

// 获取产品详情
export function getProDetail(params) {
  return request({
    url: "/pro/showdata",
    data: params
  });
}
