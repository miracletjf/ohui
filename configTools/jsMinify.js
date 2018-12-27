var fs = require('fs');
var uglify = require('uglify-js');

//js文件压缩方法
function fileConcat(flieIn, fileOut) {
  var flieIn=Array.isArray(flieIn)? flieIn : [flieIn];
  var result = flieIn.reduce(function (res,current) {
    return res += fs.readFileSync(current) + '\n';
  },'')
  fs.writeFileSync(fileOut, result, 'utf8');
}

//调用压缩js的方法
fileConcat(
  [
    '../js/ohui-common.js',
    '../js/ohui-form.js',
    '../js/ohui-notice.js',
    '../js/ohui-navigation.js',
    '../js/ohui-sidebar-menu.js',
    '../js/ohui-district-pick.js'
  ],
  '../js/onHonestUI.js'
);