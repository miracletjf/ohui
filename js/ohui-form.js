/*
*   构造函数 -- ohui-select
*   描述：选择框（ohui 组件）
*   作者：汤井福
*   创建时间：2018-12-4 18:21:06
*   修改时间：--
* */

function OhuiSelect(selector,array,callback) {
  this.$select = $(selector);
  this.init(array,callback);
}
OhuiSelect.prototype = {
  constructor: OhuiSelect,
  init: function (array,callback) {
    this.$input = this.$select.find('input');
    this.$icon = this.$select.find('.ohui-icon');
    this.callback = callback;
    this.generateItems(array);
    this.bindEvents();
  },
  // 事件监听
  bindEvents: function () {
    let _this = this;

    // 按钮点击事件
    _this.$icon.on('click',function (e) {
      _this.$selectBox.toggleClass('show');
      _this.setFocus();
      e.stopPropagation();
    });

    // 选项选择事件
    _this.$select.on('click','.ohui-select-box li',function (e) {
      _this.$input.val($(this).text());
      _this.$selectBox.removeClass('show');
      _this.setFocus();
      $(this).addClass('active').siblings().removeClass('active');
      if(_this.callback && typeof _this.callback === 'function'){
        _this.callback($(this))
      }
      e.stopPropagation();
    });

    // input 点击事件
    _this.$input.on('click',function (e) {
      e.stopPropagation();
    })

    // 取消事件冒泡
    $(document).on('click',function (e) {
      _this.$selectBox.removeClass('show');
    })
  },
  // 生成下拉列表
  generateItems : function (items) {
    let itemsHtml = items.reduce(function (res,item) {
      return res += '<li>'+item+'</li>';
    },'');
    this.$selectBox = $('<ul class="ohui-select-box">'+itemsHtml+'</ul>>').appendTo(this.$select);
  },
  // 给input设置焦点
  setFocus: function () {
    let _this = this;
    _this.$input.focus();
  }
}