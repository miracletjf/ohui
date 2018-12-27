;(function ($,window,document,undefined) {
  /**
  *   构造函数 -- ohui-select
  *   描述：选择框（ohui 组件）
  *   参数：
    *   ele  jq元素
    *   opt {
    *    array: [] 呆选择数组
    *    value: 默认选择的元素 (可选，默认是数组第一个元素)
    *    callback: 回调
    *   }
  *   selector: 选择器
  *
  *   创建时间：2018-12-4 18:21:06
  *   修改时间：--
  *   创建者：汤井福
   * */

  function OhuiSelect(ele,opt) {
    this.$select = ele;
    this.defaults = {
      array:[],
      value: '',
      callback: null
    };
    this.options = $.extend({},this.defaults,opt);
  }
  OhuiSelect.prototype = {
    constructor: OhuiSelect,
    init: function () {
      var _this = this;
      _this.$input = _this.$select.find('input');
      _this.$icon = _this.$select.find('.ohui-icon');
      _this.generateItems(_this.options.array);
      _this.bindEvents();
      _this.autoSelect(_this.options.value,_this.options.array);

      return _this.$select;
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
        if(_this.options.callback && typeof _this.options.callback === 'function'){
          _this.options.callback($(this))
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
      var resIndex = 0;
      arr.forEach(function (item,index) {
        if(resIndex > 0){
          return;
        }
        if(item.text === value){
          resIndex = index;
        }
      });

      return resIndex;
    }
  }

  /** jQ插件封装 -- ohuiSelect  选择框
   * */
  $.fn.ohuiSelect = function (options) {
    var ohuiSelect = new OhuiSelect(this,options);
    return ohuiSelect.init();
  }

})(jQuery,window,document);


