function DistrictPick(selector) {
  this.outer = $(selector);
  this.options = {
    defaultText : {
      province: '—— 省 ——',
      city: '—— 市 ——',
      area: '—— 区 ——'
    }
  };
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
  bindEvents: function () {
    this.provinceChange();
    this.cityChange();
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

    this.$province.find('.ohui-select-box').remove();
    new OhuiSelect(
      _this.$province,
      _this.formatDatas(_this.provinces,'id','name',_this.options.defaultText.province),
      function ($item) {
        var provinceId = $item.attr('data-id');
        var provinceName = $item.text();
        new OhuiSelect(
          _this.$city,
          _this.formatDatas(_this.cities[provinceId],'id','name',_this.options.defaultText.city),
          function ($item) {
            var cityId = $item.attr('data-id');
            var cityName = $item.text();
            new OhuiSelect(
              _this.$area,
              _this.formatDatas(_this.areas[cityId],'id','name',_this.options.defaultText.area),
              function ($item) {
                var areaId = $item.attr('data-id');
                var areaName = $item.text();
                console.log(provinceName,cityName,areaName);
              })
          })
    })



/*    this.$city.html('<option>'+this.options.defaultText.city+'</option>');
    this.$area.html('<option>'+this.options.defaultText.area+'</option>');*/
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
    var resMap = datas.map(function (item) {
      return {id:item[name],text:item[text]}
    });
    resMap.splice(0,0,{id: '',text:begin})

    return resMap;
  }
}