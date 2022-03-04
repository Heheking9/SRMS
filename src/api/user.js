import request from "./../utils/request";

// 登录接口
export function loginFn(params) {
  return request({
    url: "/admin/login",
    method: "POST",
    data: params
  });
}
// 修改管理员接口
export function updateAdmin(params) {
  return request({
    url: "/admin/update",
    method: "POST",
    data: params
  });
}

// 删除管理员接口
export function deleteAdmin(params) {
  return request({
    url: "/admin/delete",
    method: "POST",
    data: params
  });
}

// 添加管理员接口
export function addAdmin(params) {
  return request({
    url: "/admin/add",
    method: "POST",
    data: params
  });
}

// 获取管理员列表接口
export function getAdminList() {
  return request({
    url: "/admin/list"
  });
}

// 获取管理员详情接口
export function getAdminDetail(params) {
  return request({
    url: "/admin/detail",
    data: params
  });
}
