/**
 * @type {import('@vue/cli-service').ProjectOptions}
 */
const host = "0.0.0.0";
const port = 4000;

module.exports = {
  lintOnSave: "default",
  devServer: {
    disableHostCheck: true,
    host,
    port
  },
  publicPath: "/"
};
