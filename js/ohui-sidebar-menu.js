;(function($,window,document,undefined){
  /** sideBar 编译
   *  编译json到 html
   * */
  function compileSideJson(options) {
    var datas = options.data;
    var resHtml = '';
    resHtml += datas.reduce(function (res,item) {
      res += complateHtml('header',item);
      res += complateHtml('menus',item.childs);
      return res;
    },'');
    return '<div class="ohui-sidebar"><ul class="sidebar-menu">'+resHtml+'</ul></div>';
  }

  function complateHtml(type,obj) {
    var resHtml = '';
    switch (type) {
      case 'header':
        resHtml += '<li class="header">'+obj.name+'</li>';
        break;
      case 'menus':
        resHtml += obj.reduce(function (res,item) {
          if(item.childs && item.childs.length > 0 ) {
            res += complateHtml('submenu',item);
          }else {
            res += complateHtml('node',item)
          }
          return res;
        },'');
        break;
      case 'submenu':
        resHtml += '<li class="treeview"><a href="#">';
        if(obj.menuImage){
          resHtml += '<i class="fa fa-'+obj.menuImage+'"></i> <span>'+obj.name+'</span>';
        }else{
          resHtml += '<i class="fa fa-folder-o"></i> <span>'+obj.name+'</span>';
        }
        resHtml += '<i class="fa fa-angle-right pull-right"></i></a>';
        resHtml += '<ul class="treeview-menu">';
        resHtml += obj.childs.reduce(function (res,item) {
          res += complateHtml('node',item);
          return res;
        },'');
        resHtml += '</ul></li>';
        break;
      case 'node':
        resHtml += '<li>';
        if(obj.action){
          resHtml += '<a href="'+obj.action+'">';
        }else {
          resHtml += '<a href="#">';
        }
        if(obj.menuImage){
          resHtml += '<i class="fa fa-'+obj.menuImage+'"></i>';
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
    var $sideBar = $(compileSideJson(options)).appendTo(this);

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
        e.preventDefault();
        options.callback.call(this)
      }
    });

    ;(function firstClick() {
      var $parentNode = $sideBar.find('li a').first();
      $parentNode.click();
      if($parentNode.attr('href') && $parentNode.attr('href') === '#'){
        var $node = $parentNode.parent().find('li a').first();
        if($node.attr('href') && $node.attr('href') !== '#'){
          $node.click();
        }
      }
    })();

    return this;
  }
})(jQuery,window,document);





