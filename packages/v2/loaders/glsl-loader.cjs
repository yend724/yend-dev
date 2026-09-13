// GLSLを文字列として読み込む。JSON化することで改行や引用符を保持する。
module.exports = function glslLoader(source) {
  return `export default ${JSON.stringify(source)};`;
};
