$.fn.extend({
  sidebarMenu : function () {
    var menu = this;
    var animationSpeed = 300;
    $(menu).on('click', 'li a', function (e) {
      var $this = $(this);
      var checkElement = $this.next();
      if(checkElement.length){
        if (checkElement.is('.treeview-menu') && checkElement.is(':visible')) {
          checkElement.slideUp(animationSpeed, function () {
            checkElement.removeClass('menu-open');
          });
          checkElement.parent("li").removeClass("opened");
        }
        else if ((checkElement.is('.treeview-menu')) && (!checkElement.is(':visible'))) {
          var parent = $this.parents('ul').first();
          var ul = parent.find('ul:visible').slideUp(animationSpeed);
          ul.removeClass('menu-open');
          var parent_li = $this.parent("li");
          checkElement.slideDown(animationSpeed, function () {
            checkElement.addClass('menu-open');
          });
            parent_li.addClass('opened').siblings('li').removeClass('opened');
        }
      if (checkElement.is('.treeview-menu')) {
          e.preventDefault();
        }
      } else {
        var $li = $this.parent('li');
        var $ul = $li.parent('ul');

        if($ul.is('.sidebar-menu')){
          $ul.find('ul:visible').slideUp(animationSpeed,function () {
            $(this).removeClass('menu-open');
            $(this).parent().removeClass('opened');
          });
          $ul.find('.active').removeClass('active');
          $li.addClass('active');
        }else {
          $li.addClass('active').siblings().removeClass('active');
          $ul.parent('li').siblings('.active').removeClass('active');
          $ul.parent('li').siblings().find('.active').removeClass('active');
        }
      }
    });
  }
});

/**
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
        if(item.children) {
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
