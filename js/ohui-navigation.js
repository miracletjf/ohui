$.fn.extend({
  /** tab 切换
   *  参数：
   *    callback(index) 回调函数
   *      this 指向当前点击的对象
   *      index 当前对象 下标
   * */
  tabsChange: function (callback) {
    console.log(this);
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
  }
});