/** jQuery 扩展 $.animateCss
*   结合 animation.css 实现动画效果
*   参数说明：
*     animationName: animation.css 对应的 class
*     speed: animation.css 对应的 速度 class 默认 'fast'
*     callback: 动画完成后的回调，this 指向 当前对象
*
*   创建时间：2018-12-12 17:04:36
*   创建者： 汤井福
* */
$.fn.extend({
  animateCss: function(animationName,speed,callback) {
    if(typeof speed === 'function'){
      callback = speed;
      speed = 'fast';
    }else if(typeof speed === 'undefined'){
      speed = 'fast'
    }

    var animationEnd = (function(el) {
      var animations = {
        animation: 'animationend',
        OAnimation: 'oAnimationEnd',
        MozAnimation: 'mozAnimationEnd',
        WebkitAnimation: 'webkitAnimationEnd',
      };

      for (var t in animations) {
        if (el.style[t] !== undefined) {
          return animations[t];
        }
      }
    })(document.createElement('div'));

    this.addClass('animated ' + speed +' '+ animationName).one(animationEnd, function() {
      $(this).removeClass('animated '+ speed + ' ' + animationName);

      if (typeof callback === 'function') callback.call(this);
    });

    return this;
  },
});

/** 鼠标移入取消定时器 mouseTouchStop
*   参数说明：
*     $obj: 需要监听的 jQuery 对象
*     speed: 定时器执行时间 （可省略，默认值，2000）
*     callback: 需要执行的函数
*
*
*   创建时间：2018-12-22 17:04:36
*   创建者： 汤井福
* */

function mouseTouchStop($obj,speed,callback) {
  let timeId;
  if(typeof speed === 'function'){
    callback = speed;
    speed = 2000;
  }else if(typeof speed !== 'number'){
    speed = 2000;
  }

  timeId = timeoutFn();
  $obj.on('mouseenter',function () {
    clearTimeout(timeId);
  })
  $obj.on('mouseleave',function () {
    timeId = timeoutFn();
  })

  function timeoutFn() {
    return setTimeout(function () {
      if(typeof callback === 'function') callback.call($obj[0]);
    },speed);
  }
}


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



/** 页面加载 loading
*   页面进入时 调用 loadingAppend(text);
*     参数说明：
 *     text 表示要提示的内容 （可不填，有默认值）
 *   页面加载完成时 调用 loadingRemove();
 *   创建时间：2018-12-22 16:08:28
 *   创建者： 汤井福
* */

function loadingOpen(text) {
  let loadingHtml;
  if(!text) {
    loadingHtml = '<div class="ohui-loading-wrap"><div class="ohui-middle-box"><span class="loading-box">页面加载中…</span></div></div>';
  }else {
    loadingHtml = '<div class="ohui-loading-wrap"><div class="ohui-middle-box"><span class="loading-box">'+text+'…</span></div></div>'
  }
  $('body').append(loadingHtml);
}

function loadingClose() {
  $('.ohui-loading-wrap').remove();
}


/** 消息提示 message (指定时间自动消失)
 *  弹出 message , messageAppend
 *    参数说明：
 *      text: 需要提示的文字
 *      type: 提示框类型 [info（默认值）,success,error,warning,prompt,help]
 *  隐藏 message
 *    无需调用，自动执行
 *
 *   创建时间：2018-12-22 17:04:36
 *   创建者： 汤井福
 *
 * */
function messageOpen(text,type) {
  let htmlText = '';
  let classText = '';
  if(!text){
    text = '这是一条信息'
  }
  if (type && ('success,error,warning,prompt,help').split(',').indexOf(type) > -1) {
    classText = type
  }
  htmlText += '<div class="ohui-message"><span class="text-box '+ classText +'">'+ text +'</span></div>';
  let $messageBox = $(htmlText).appendTo($('body')).animateCss('fadeInDown');

  mouseTouchStop($messageBox.find('.text-box'),function () {
    messageClose($messageBox)
  })
}

function messageClose($obj){
  $obj.animateCss('fadeOutUp',function () {
    $(this).remove();
  })
}

/** 消息框 messageBox
 *   参数：
 *    title   弹出框的标题
 *    content 弹出框的内容
 *    callback() 回调函数
 *      this 指向弹出层body
 *
 *   创建时间：2018-12-12 17:04:36
 *   创建者： 汤井福
 * */
function messageBoxOpen(title,content,callback) {
  var htmlText = '  <div class="ohui-popBox-bg">\n' +
    '    <div class="ohui-message-box">\n' +
    '      <div class="ohui-message-box-header">\n' +
    '        <span class="h2">{{title}}</span>\n' +
    '        <button class="close-btn" onclick="messageBoxClose(this)">\n' +
    '          <span class="ohui-icon ohui-icon-close" title="关闭"></span>\n' +
    '        </button>\n' +
    '      </div>\n' +
    '      <div class="ohui-message-box-body">{{content}}</div>\n' +
    '      <div class="ohui-message-box-footer">\n' +
    '        <div class="btn-box push-right">\n' +
    '          <button class="ohui-btn-default" id="messageBoxConfirmBtn">\n' +
    '            <span class="btn-text">确定</span>\n' +
    '            <span class="ohui-icon ohui-icon-ok"></span>\n' +
    '          </button>\n' +
    '          <button class="ohui-btn-default" onclick="messageBoxClose(this)">\n' +
    '            <span class="btn-text">取消</span>\n' +
    '            <span class="ohui-icon ohui-icon-cancel"></span>\n' +
    '          </button>\n' +
    '        </div>\n' +
    '      </div>\n' +
    '    </div>\n' +
    '  </div>';
  var options = {
    'title': title,
    'content': content
  }
  Object.keys(options).forEach(function (item) {
    htmlText = htmlText.replace('{{'+item+'}}',options[item]);
  })

  var $messageBoxObj = $(htmlText).appendTo($('body'));

  $('.ohui-message-box').animateCss('fadeInDown');

  $('#messageBoxConfirmBtn').on('click',function (e) {
    if(typeof callback === 'function'){
      callback.call($('.ohui-message-box-body')[0]);
    }
    messageBoxClose(this);
  })
}
function messageBoxClose(obj) {
  $('.ohui-message-box').animateCss('fadeOutUp',function () {
    $(obj).parents('.ohui-popBox-bg').remove();
  })
}


/** 文字提示 textTip
 *  鼠标移入显示文字提示
 *
 *   创建时间：2018-12-22 17:04:36
 *   创建者： 汤井福
 * */

function textTip() {
  var $textTipEles = $('[data-text-tip]');
  $textTipEles.on('mouseenter',function (index) {
    var _this = this;
    var text = $(_this).attr('data-text-tip');
    var html = '<span class="ohui-text-tip">'+text+'</span>';


    var $textTip =  $(html).appendTo($('body'))
      .css({
          left: $(_this).offset().left + 'px',
          top: $(_this).offset().top + 'px',
          marginLeft: function () {
            return -($(this).outerWidth() - $(_this).outerWidth())/2 + 'px';
          },
          marginTop: '-34px'
        })
      .animateCss('fadeIn');

    $(_this).on('mouseleave',function () {
      mouseTouchStop($textTip,1000,function () {
        $(this).animateCss('fadeOut',function () {
          $(this).remove();
        })
      })
    })
  })
}
$.fn.extend({
  /** tab 切换
   *  参数：
   *    callback(index) 回调函数
   *      this 指向当前点击的对象
   *      index 当前对象 下标
   *   创建时间：2018-12-4 18:21:06
   *   修改时间：--
   *   创建者：汤井福
   * */
  tabsChange: function (callback) {

    var $tabs = this;
    var $tabHead_children = $tabs.find('.ohui-tabs-head > li');
    var $tabBody_children = $tabs.find('.ohui-tabs-body > li');

    $tabHead_children.on('click',function (e) {
      var index = $(this).index();
      $(this).addClass('active').siblings().removeClass('active');
      $tabBody_children.eq(index).show().siblings().hide();
      if(typeof callback === 'function'){
        callback.call(this,index);
      }
    });

    $tabHead_children.eq(0).click();
  },
  
  /** bread crumbs 面包屑
   *  参数：
   *    options {
   *      separator 分隔符
   *      navs      菜单数组
   *        text    文字
   *        href    链接
   *    }
   *
   *   创建时间：2018-12-24 18:21:06
   *   修改时间：--
   *   创建者：汤井福
   * */
  breadCrumbs: function (options) {
    var html = '';
    var defOptions = {
      separator: '/',
      navs: []
    }
    options = $.extend({},defOptions,options);

    var template = '<span class="ohui-breadCrumbs-item {{active}}">\n' +
      '          <a class="text" href="{{href}}">{{text}}</a>\n' +
      '          <span class="separator">'+options.separator+'</span>\n' +
      '        </span>';

    html = options.navs.reduce(function (res,current) {
      var curHtml = template;
      ['active','href','text'].forEach(function (item,index) {
        if(!current[item] && item === 'href'){
          current[item] = '#'
        }else if (!current[item] && item === 'active'){
          if(current['href'] && current['href'] !== '#')
            current[item] = 'active';
          else
            current[item] = '';
        }
        curHtml = curHtml.replace('{{'+item+'}}',current[item]);
      });
      res += curHtml
      return res;
    },'');
    console.log(html)

    return this.append(html);
  }
});
;(function($,window,document,undefined){
  /** sideBar 编译
   *  编译json到 html
   * */
  function compileSideJson(datas) {
    var resHtml = '';
    resHtml += datas.reduce(function (res,item) {
      res += complateHtml('header',item);
      res += complateHtml('menus',item.menus);
      return res;
    },'');
    return '<div class="ohui-sidebar"><ul class="sidebar-menu">'+resHtml+'</ul></div>';
  }

  function complateHtml(type,obj) {
    var resHtml = '';
    switch (type) {
      case 'header':
        resHtml += '<li class="header">'+obj.title+'</li>';
        break;
      case 'menus':
        resHtml += obj.reduce(function (res,item) {
          if(item.children && item.children.length > 0 ) {
            res += complateHtml('submenu',item);
          }else {
            res += complateHtml('node',item)
          }
          return res;
        },'');
        break;
      case 'submenu':
        resHtml += '<li class="treeview"><a href="#">';
        if(obj.icon){
          resHtml += '<i class="fa fa-'+obj.icon+'"></i> <span>'+obj.name+'</span>';
        }else{
          resHtml += '<i class="fa fa-circle-o"></i> <span>'+obj.name+'</span>';
        }
        resHtml += '<i class="fa fa-angle-right pull-right"></i></a>';
        resHtml += '<ul class="treeview-menu">';
        resHtml += obj.children.reduce(function (res,item) {
          res += complateHtml('node',item);
          return res;
        },'');
        resHtml += '</ul></li>';
        break;
      case 'node':
        resHtml += '<li>';
        if(obj.url){
          resHtml += '<a href="'+obj.url+'">';
        }else {
          resHtml += '<a href="#">';
        }
        if(obj.icon){
          resHtml += '<i class="fa fa-'+obj.icon+'"></i>';
        }else {
          resHtml += '<i class="fa fa-circle-o"></i>';
        }
        resHtml += '<span>'+obj.name+'</span></a></li>';
        break;
    }
    return resHtml;
  }

  /**
   *  jQ 插件封装 --  侧边菜单生成
   *  参数：
   *    options{
   *      data            菜单数据
   *      animationSpeed  展开收起速度
   *      callback        回调
   *        内部 this 指向 当前点击的元素
   *    }
   *
   *   创建时间：2018-12-26 16:21:06
   *   修改时间：--
   *   创建者：汤井福
   * */


  $.fn.sidebarMenu = function (opt) {
    var defaults = {
      data: [],
      animationSpeed: 300
    };
    var options = $.extend({},defaults,opt);
    var $sideBar = $(compileSideJson(options.data)).appendTo(this);

    $sideBar.on('click', 'li a', function (e) {
      var $this = $(this);
      var checkElement = $this.next();
      if(checkElement.length){
        if (checkElement.is('.treeview-menu') && checkElement.is(':visible')) {
          checkElement.slideUp(options.animationSpeed, function () {
            checkElement.removeClass('menu-open');
          });
          checkElement.parent("li").removeClass("opened");
        }
        else if ((checkElement.is('.treeview-menu')) && (!checkElement.is(':visible'))) {
          var parent = $this.parents('ul').first();
          // var ul = parent.find('ul:visible').slideUp(options.animationSpeed);
          // ul.removeClass('menu-open');
          var parent_li = $this.parent("li");
          checkElement.slideDown(options.animationSpeed, function () {
            checkElement.addClass('menu-open');
          });
          parent_li.addClass('opened');
          // parent_li.siblings('li').removeClass('opened');
        }
        if (checkElement.is('.treeview-menu')) {
          e.preventDefault();
        }
      } else {
        var $li = $this.parent('li');
        var $ul = $li.parent('ul');

        if($ul.is('.sidebar-menu')){
          // $ul.find('ul:visible').slideUp(options.animationSpeed,function () {
          //   $(this).removeClass('menu-open');
          //   $(this).parent().removeClass('opened');
          // });
          $ul.find('.active').removeClass('active');
          $li.addClass('active');
        }else {
          $li.addClass('active').siblings().removeClass('active');
          $ul.parent('li').siblings('.active').removeClass('active');
          $ul.parent('li').siblings().find('.active').removeClass('active');
        }
      }

      if(options.callback && typeof options.callback === 'function'){
        options.callback.call(this)
      }
    });

    return this;
  }
})(jQuery,window,document);






;(function ($,window,document,undefined) {
  /**
   *  构造函数 -- DistrictPick
   *  描述：行政区划选择（ohui 组件）
   *  参数：
   *    ele jq对象
   *    opt {
   *      defaultText: {  默认每个选项的头元素
   *        province  默认省开头
   *        city      默认市开头
   *        area      默认区开头
   *      }
   *    callback(province,city,area)   回调函数
   *      内部 this 指向 当前区的对象
   *      province  省
   *      city      市
   *      area      区
   *    }
   *
   *   创建时间：2018-12-22 17:04:36
   *   创建者： 汤井福
   * */
  function DistrictPick(ele,opt) {
    this.outer = ele;
    this.defaults = {
      defaultText : {
        province: '—— 省 ——',
        city: '—— 市 ——',
        area: '—— 区 ——'
      }
    };
    this.options = $.extend({},this.defaults,opt);
    this.init();
  }

  DistrictPick.prototype = {
    constructor: DistrictPick,
    init: function () {
      let $selects = this.outer.find('label.ohui-input-box');

      this.$province =  $selects.eq(0);
      this.$city = $selects.eq(1);
      this.$area = $selects.eq(2);

      this.provinces = this.getJsonDatas('../json/districtPick/province.json');
      this.cities = this.getJsonDatas('../json/districtPick/city.json');
      this.areas = this.getJsonDatas('../json/districtPick/area.json');
      this.initOptions();
      /*    this.appendOptions(this.$province,this.provinces,this.options.defaultText.province);

          this.bindEvents();*/
    },
    getJsonDatas: function (url) {
      let res;
      $.ajax({
        async: false,
        url: url,
        success: function (data) {
          res = data;
        }
      });
      return res;
    },
    initOptions: function () {
      var _this = this;

      _this.addSelects(
        _this.$province,
        _this.provinces,
        _this.options.defaultText.province,
        function ($currentPro) {
          var provinceId = $currentPro.attr('data-id');
          var provinceName = $currentPro.text();
          _this.addSelects(
            _this.$city,
            _this.cities[provinceId],
            _this.options.defaultText.city,
            function ($currentCity) {
              var cityId = $currentCity.attr('data-id');
              var cityName = $currentCity.text();
              _this.addSelects(
                _this.$area,
                _this.areas[cityId],
                _this.options.defaultText.area,
                function ($currentArea) {
                  var areaId = $currentArea.attr('data-id');
                  var areaName = $currentArea.text();
                  if(typeof _this.options.callback === 'function'){
                    _this.options.callback.call($currentArea,provinceName,cityName,areaName);
                  }
                }
              );
            });
          _this.addSelects(_this.$area, [], _this.options.defaultText.area);
        });
      _this.addSelects(
        _this.$city,
        [],
        _this.options.defaultText.city
      );
      _this.addSelects(
        _this.$area,
        [],
        _this.options.defaultText.area
      )
      /*    this.$city.html('<option>'+this.options.defaultText.city+'</option>');
          this.$area.html('<option>'+this.options.defaultText.area+'</option>');*/
    },
    addSelects: function ($object,arrays,defaultTExt,callback) {
      var _this = this;
      $object.find('.ohui-select-box').remove();
      $object.ohuiSelect({
        array: _this.formatDatas(arrays,'id','name',defaultTExt),
        callback: callback
      })
    },
    resetOptions: function($obj,text) {
      $obj.html('<option>'+text+'</option>');
    },
    appendOptions: function($obj,options,text) {
      let optionsHtml = options.reduce(
        function (res,item){
          res += '<option value="'+item.id+'">'+item.name+'</option>';
          return res;
        }, '<option data-default>'+text+'</option>');
      $obj.html(optionsHtml);
    },
    provinceChange : function () {
      let _this = this;
      _this.$province.on('change',function (e) {
        let provinceId = $(this).val();
        _this.appendOptions(_this.$city,_this.cities[provinceId],_this.options.defaultText.city);
        _this.resetOptions(_this.$area,_this.options.defaultText.area);
      })
    },
    cityChange: function () {
      let _this = this;
      _this.$city.on('change',function () {
        let cityId = $(this).val();
        _this.appendOptions(_this.$area,_this.areas[cityId],_this.options.defaultText.area);
      })
    },
    formatDatas: function (datas,name,text,begin) {
      var resMap;
      if(datas){
        resMap = datas.map(function (item) {
          return {id:item[name],text:item[text]}
        });
      }else {
        resMap = [];
      }
      resMap.splice(0,0,{id: '',text:begin})

      return resMap;
    }
  }

  /** jQ插件封装
   *  ohuiDistrickPick  区域选择
   * */
  $.fn.ohuiDistrictPick = function (options) {
    var ohuiDestrictPick = new DistrictPick(this,options);
    return ohuiDestrictPick.init();
  }
})(jQuery,window,document);



