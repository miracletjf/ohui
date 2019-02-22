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

    return this.append(html);
  }
});