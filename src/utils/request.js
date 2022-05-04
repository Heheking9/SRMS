import axios from "axios";
// baseURL 会自动加到所有的请求之前
const ins = axios.create({
  // http://121.89.205.189/api/pro/list ==> /pro/list
  baseURL: "http://localhost:8888",
  timeout: 100000,
});

// 拦截器
ins.interceptors.request.use(
  (config) => {
    // 每次发请求时都会从localStorage拿到tooken并发送
    config.headers.common.token = localStorage.getItem("token") || "";
    return config;
  },
  (err) => Promise.reject(err)
);
ins.interceptors.response.use(
  (response) => {
    if (response.data.code === "10119") {
      // token失效 ***********************
      // 没有传递token 传了错误的token  传了正确的token但是过期了
      window.location.href = "/login";
    }
    return response;
  },
  (err) => Promise.reject(err)
);
// 封装requset请求，执行req函数，判断请求方式并发送请求，将获取的resp返回
function req(config) {
  const { url = "", method = "GET", data = {}, headers = {} } = config;
  switch (method.toUpperCase()) {
    case "GET":
      return ins.get(url, { params: data });
    case "POST":
      // 表单提交  application/x-www-form-url-encoded
      if (headers["content-type"] === "application/x-www-form-url-encoded") {
        // 转参数 URLSearchParams/第三方库qs
        const p = new URLSearchParams();
        for (const key in data) {
          p.append(key, data[key]);
        }
        return ins.post(url, p, { headers });
      }
      // 文件提交  multipart/form-data
      if (headers["content-type"] === "multipart/form-data") {
        const p = new FormData();
        for (const key in data) {
          p.append(key, data[key]);
        }
        return ins.post(url, p, { headers });
      }
      // 默认 application/json
      return ins.post(url, data);
    case "PUT":
      // 修改数据 --- 所有的数据的更新
      return ins.put(url, data);
    case "DELETE":
      // 删除数据
      return ins.delete(url, { data });
    case "PATCH":
      // 更新局部资源
      return ins.patch(url, data);
    default:
      return ins(config);
  }
}

export default req;
