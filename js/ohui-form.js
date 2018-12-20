/**
*   构造函数 -- ohui-select
*   描述：选择框（ohui 组件）
*   参数：
 *   selector: 选择器
 *   array: 选择的数组
 *   value: 默认选择的元素 (可选，默认是数组第一个元素)
 *   callback: 回调函数
*   作者：汤井福
*   创建时间：2018-12-4 18:21:06
*   修改时间：--
* */

function OhuiSelect(selector,array,value,callback) {
  this.$select = $(selector);
  this.init(array,value,callback);
}
OhuiSelect.prototype = {
  constructor: OhuiSelect,
  init: function (array,value,callback) {
    this.$input = this.$select.find('input');
    this.$icon = this.$select.find('.ohui-icon');
    if(typeof value === 'function'){
      callback = value;
      value = array[0].text;
    }
    if(typeof value === 'undefined'){
      value = array[0].text;
    }
    this.callback = callback;
    this.generateItems(array);
    this.bindEvents();
    this.autoSelect(value,array);
  },
  // 事件监听
  bindEvents: function () {
    let _this = this;

    // 按钮点击事件
    _this.$icon.on('click',function (e) {
      $('.ohui-select-box').removeClass('show');
      _this.$selectBox.addClass('show');
      _this.setFocus();
      e.stopPropagation();
    });

    // 选项选择事件
    _this.$select.find('.ohui-select-box').on('click','li',function (e) {
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
    });

    // 取消事件冒泡
    $(document).on('click',function (e) {
      _this.$selectBox.removeClass('show');
    })
  },
  // 生成下拉列表
  generateItems : function (items) {
    let itemsHtml = items.reduce(function (res,item) {
      console.log(item);
      return res += '<li data-id="'+item.id+'">'+item.text+'</li>';
    },'');

    this.$selectBox = $('<ul class="ohui-select-box">'+itemsHtml+'</ul>').appendTo(this.$select);
  },
  // 给input设置焦点
  setFocus: function () {
    let _this = this;
    _this.$input.focus();
  },
  autoSelect: function (value,array) {
    var _this = this;
    var index = _this.findIndexOfArrs(value,array);
    var $selectEl = _this.$select.find('.ohui-select-box li').eq(index);

    $selectEl.addClass('active');
    _this.$input.val($selectEl.text());
    this.$input.blur();
  },
  findIndexOfArrs: function (value,arr) {
    var resIndex = -1;
    arr.forEach(function (item,index) {
      if(resIndex > -1){
        return;
      }
      if(item.text === value){
        resIndex = index;
      }
    })

    return resIndex;
  }
}