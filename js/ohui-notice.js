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