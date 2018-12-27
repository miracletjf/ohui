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


