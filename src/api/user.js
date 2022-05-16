import request from "./../utils/request";

// 登录接口
export function loginFn(params) {
  return request({
    url: "/admin/login",
    method: "POST",
    data: params,
  });
}
// 修改管理员接口
export function updateAdmin(params) {
  return request({
    url: "/admin/update",
    method: "POST",
    data: params,
  });
}

// 删除管理员接口
export function deleteAdmin(params) {
  return request({
    url: "/admin/delete",
    method: "POST",
    data: params,
  });
}

// 注册接口
export function regFn(params) {
  return request({
    url: "/admin/register",
    method: "POST",
    data: params,
  });
}

export function upload(params) {
  return request({
    url: "/admin/upload",
    method: "POST",
    data: params,
  });
}

// 修改用户信息接口
export function editUser(params) {
  return request({
    url: "/admin/edit",
    method: "POST",
    data: params,
  });
}

// 修改用户信息接口
export function editAcess(params) {
  return request({
    url: "/admin/editAcess",
    method: "POST",
    data: params,
  });
}

// 添加管理员接口
export function addAdmin(params) {
  return request({
    url: "/admin/add",
    method: "POST",
    data: params,
  });
}

// 获取管理员列表接口
export function getAdminList() {
  return request({
    url: "/admin/list",
  });
}

// 获取管理员列表接口
export function getAdminData(params) {
  return request({
    url: "/admin/getAdminData",
    data: params,
    method: "POST",
  });
}

// 获取管理员列表接口
export function deleteData(params) {
  return request({
    url: "/admin/deleteData",
    method: "POST",
    data: params,
  });
}
// 获取行数据
export function getLineData(params) {
  return request({
    url: "/admin/getLineData",
    method: "POST",
    data: params,
  });
}
// 获取管理员列表接口
export function updateData(params) {
  return request({
    url: "/admin/updateData",
    method: "POST",
    data: params,
  });
}

// 获取管理员详情接口
export function getAdminDetail(params) {
  return request({
    url: "/admin/detail",
    data: params,
  });
}
