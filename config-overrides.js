// 参考配置连接：https://www.npmjs.com/package/customize-cra
const { override, addDecoratorsLegacy } = require("customize-cra");

module.exports = override(
  addDecoratorsLegacy() //配置装饰器模式
);
