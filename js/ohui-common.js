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

