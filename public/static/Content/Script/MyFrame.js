//import { PassThrough } from "stream";
//import { parse } from "path";

//import * as circle from '/Config.js';

var myconfig = {
  PageSize: 20,
  PageIndex: 1,
  Sort: "create_time desc",
  count: 0,
  elem: "#mytable",
  pageElem: "#mytablePage",
  selectColor: "#fffabb",
  elemClass: "table align-center table-hover",
  // HOST: "https://localhost:44379",
  // FileSystemHost: "https://localhost:44375",
  // ToolsHost: "https://localhost:44385",
  //HOST: "http://api.mysite.com/",
  FileSystemHost: "http://fsapi.mysite.com/",
  HOST: "http://api.linmoli.cn",
  FileSystemHost: "http://fsapi.linmoli.cn",
  // HOST: "http://localhost:8089",
  // FileSystemHost: "http://localhost:8090",
  EmailSystemHost: "",
}
var $baseAjax = $.ajax;
var tableDatas = [];
var optionList = {};
var selectRowId;
var selectRowData;
var _click;
var _clickTimer = '';

//弹出遮罩提示层
function ShowLoad (str, shadeType) {
  var loadId = "";
  var shadeStyle = [0.3, '#000'];
  if (shadeType == 1) { shadeStyle = [0.3, '#000']; }
  else if (shadeType == 2) { shadeStyle = [1, '#fff']; }
  if (!str) { str = "正在加载"; }
  loadId = layer.load(2, {
    skin: 'align-center',
    area: ['auto', '80px'],
    shade: shadeStyle, //0.3透明度的白色背景
    content: '<div style="position:absolute;bottom:0px;font-size:20px;width:' + str.length * 20 + 'px;margin-left:calc(100% - ' + str.length * 10 + 'px);">' + str + '</div>'
  });
  return loadId;
}

function deleteCookie (name) {
  var exp = new Date();
  exp.setTime(exp.getTime() - 1);
  document.cookie = name + "=v;expires=" + exp.toUTCString();
}

function initFun (id) {
  this.myconfig = myconfig;
  this.elem = id;
  this.table = _table;
  this.options = function (newOptions) {
    $.extend(this.options, newOptions);
    this.table(this.options);
  }
  this.getData = function (rowid) { return _GetTableData(this.elem, rowid); }
  this.getSelRowid = function () {
    var tableStr = (this.elem).substr(1);
    if (!optionList[tableStr].multiple) {
      return _GetSelectRowId();
    } else {
      return _GetMultipleRowid(this.elem);
    }
  }
  this.onclick = function (e, fun) {
    if ($.type(fun) == null || $.type(fun) == "undefined") {
      return tableClick(e);
    } else {
      tableClick(e);
      return fun(selectRowId, selectRowData);
    }
  }
  this.ondbclick = function (e, fun) {
    if ($.type(fun) == null || $.type(fun) == "undefined") {
      return tableClick(e);
    } else {
      tableClick(e);
      return fun(selectRowId, selectRowData);
    }
  }
  this.target = function (type) {
    var tableStr = (this.elem).substr(1);
    if (type == "reload") {
      this.table(optionList[tableStr]);
    }
  }
  this.setParamAndLoad = function (setparma) {
    if (!setparma) {
      this.target("reload");
      return;
    }
    var tableStr = (this.elem).substr(1);
    optionList[tableStr].data = setparma;
    this.table(optionList[tableStr]);
  }
  this.LoadPagin = function (pageSize, pageIndex, maxIndex) {
    if (pageIndex > maxIndex) {
      _alert("已经是最后一页了哦", "warning");
      return;
    }
    if (pageIndex == 0) {
      _alert("已经是第一页了哦", "warning");
      return;
    }
    var tableStr = (this.elem).substr(1);
    optionList[tableStr].PageSize = pageSize;
    optionList[tableStr].PageIndex = pageIndex;
    this.table(optionList[tableStr]);
  }
}

var _frame = function (id) {
  return new initFun(id);
}
$.request = function (name) {
  var allUrl = window.location.href;
  var indexq = allUrl.indexOf('?');
  if (indexq == -1) {
    return "";
  }
  var resString = "";
  var url = allUrl.substr(0, indexq);
  var params = allUrl.substr(indexq + 1);
  var param = {};
  var paramArr = params.split('&');
  $.each(paramArr, function (i, item) {
    var tempindex = item.indexOf('=');
    if (item.substr(0, tempindex) == name) {
      resString = item.substr(tempindex + 1);
      return;
    }
  });
  return resString;
}
$(function () {
  var _ajax = $.ajax;
  var loadId = "";
  $.ajax = function (options) {
    if (!options.type) {
      options.type = 'post';
    }
    if (!options.shadeType) {
      options.shadeType = 2;
    }
    if (!options.shadeStr) {
      options.shadeStr = '正在加载';
    }
    if (!!options._CORS || !!options.CORS) {
      if (!options.dataType) {
        options.dataType = 'jsonp';
      }
      if (!options.jsonp) {
        options.jsonp = 'callback';
      }
      if (!options.scriptCharset) {
        options.scriptCharset = 'utf-8';
      }
      if (!options.jsonpCallback) {
        options.jsonpCallback = 'jsonpCallback';
      }
      if (!options.xhrFields) {
        options.crossDomain = true;
        options.xhrFields = {
          withCredentials: true
        }
      }
    }
    if (!options.beforeSend) {
      options.beforeSend = function () {
        loadId = ShowLoad(options.shadeStr, options.shadeType);
      }
    }
    if (!options.complete) {
      options.complete = function () {
        layer.close(loadId);
      }
    }
    var userSuccess = null;
    var userError = null;
    if (options.success != null && options.success != undefined) {
      userSuccess = options.success;
    }
    if (options.error != null && options.error != undefined) {
      userError = options.error;
    }
    options.success = function (data, state, XMLHttpRequest) {
      if (XMLHttpRequest.status > 210 && XMLHttpRequest.status < 240) {
        _alert(JSON.parse(XMLHttpRequest.responseText).msg, "warnning");
      } else if (XMLHttpRequest.status > 240) {
        _alert(JSON.parse(XMLHttpRequest.responseText).msg, "error");
        if (userError != null) {
          userError(JSON.parse(XMLHttpRequest.responseText).msg);
        }
      } else {
        if (!!data.modelType) {
          if (data.modelType == "json") {
            userSuccess(data);
            return;
          } else if (data.modelType == "string") {
            data.model = JSON.parse(data.model);
            userSuccess(data);
            return;
          }
        }
        userSuccess(data);
      }
    }
    if (options.error == null || options.error == undefined) {
      options.error = function (XMLHttpRequest, msg, e) {
        if (XMLHttpRequest.status % 100 > 10) {
          top.layer.open({
            title: "提示",
            content: XMLHttpRequest.responseText
          });
        } else {
          if (XMLHttpRequest.status == 250) {
            _alert(XMLHttpRequest.responseText, "error");
          } else {
            _alert("网络连接错误，请刷新页面！", "error");
          }
        }
      }
    }
    if (!!options.loaded) {
      options.complete = options.loaded;
      delete options.loaded;
    }
    if (!options.host) {
      options.url = myconfig.HOST + options.url;
    } else {
      options.url = options.host + options.url;
    }
    _ajax(options);
  }
  $.SubmitForm = function (options) {
    var param = {};
    var fun = function (data) { }
    if (options.data != null && options.data != undefined) {
      param = options.data;
    }
    if (options.success != null && options.success != undefined) {
      fun = options.success;
    }
    if (!options.CORS && !options._CORS) {
      options.CORS = false;
    } else {

      options.CORS = true;
    }
    if (!options.shadeType) {
      options.shadeType = 1;
    }
    if (!options.shadeStr) {
      options.shadeStr = '正在提交...';
    }
    //options.type = "POST";
    //options.dataType = "json";
    //options.iframe = true;
    //options.host = true;
    //options.success = function (res) {
    //    fun(res);
    //    if ((!!res.msg) && (!!window.name) && iframe) {
    //        top.layer.msg(res.msg);
    //        var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
    //        parent.layer.close(index); //再执行关闭   
    //    }
    //}
    //$.ajax(options);
    $.ajax({
      url: options.url,
      data: options.data,
      type: "POST",
      dataType: "json",
      _CORS: options.CORS,
      iframe: true,
      host: options.host,
      shadeType: options.shadeType,
      shadeStr: options.shadeStr,
      success: function (res) {
        fun(res);
        if ((!!res.msg) && (!!window.name) && iframe) {
          top.layer.msg(res.msg);
          var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
          parent.layer.close(index); //再执行关闭   
        }
      }
    }, 1);
  }
  /// 文件下载方法，默认POST
  /// url:请求的路径 （必填）
  /// param:请求附带的参数 (可选，JSON格式)
  /// saveName:保存的文件名（可选）
  /// type:请求的类型，默认POST
  $.DownloadFile = function (url, param, saveName, type) {
    if (!url) {
      _alert("下载路径无效！", "error");
      return false;
    }
    if (!type) {
      type = "POST";
    }
    var params = "";
    if (!!param) {
      for (var key in param) {
        if (!!params.length) {
          params += "&";
        }
        params += key + "=" + param[key];
      }
      params = encodeURI(params);
    }
    var xmlHttp = new XMLHttpRequest(); //创建xmlHTTP请求对象
    xmlHttp.responseType = 'blob';
    xmlHttp.onreadystatechange = function () { //当请求状态改变时触发此事件
      if (xmlHttp.readyState == 4 && xmlHttp.status == 200) { //请求成功后
        if (typeof window.chrome !== 'undefined') {
          // Chrome version
          var link = document.createElement('a');
          link.href = window.URL.createObjectURL(xmlHttp.response);
          link.download = saveName;
          link.click();
        } else if (typeof window.navigator.msSaveBlob !== 'undefined') {
          // IE version
          var blob = new Blob([xmlHttp.response], { type: 'application/force-download' });
          window.navigator.msSaveBlob(blob, saveName);
        } else {
          // Firefox version
          var file = new File([xmlHttp.response], saveName, { type: 'application/force-download' });
          window.open(URL.createObjectURL(file));
        }
      } else if (xmlHttp.readyState == 4 && xmlHttp.status > 210 && xmlHttp.status < 240) {
        _alert(JSON.parse(xmlHttp.responseText).msg, "warnning");
      } else if (xmlHttp.readyState == 4 && xmlHttp.status > 240 && xmlHttp.status < 300) {
        _alert(JSON.parse(xmlHttp.responseText).msg, "error");
      } else if (xmlHttp.readyState == 4 && xmlHttp.status == 403) {
        _alert("权限不足！", "error");
      } else if (xmlHttp.readyState == 4 && xmlHttp.status == 404) {
        _alert("下载路径无效！", "error");
      } else if (xmlHttp.readyState == 4) {
        _alert("网络连接错误，请刷新页面！", "error");
      }
    }
    xmlHttp.open(type, url + "?" + params, true);
    xmlHttp.send();
  }
});
$(function () {
  //$("body").append("<input type='hidden' name='asd' id='asd' value=''>")
  //_frame.table = _table;
  //_frame.getData = function (domId, Rowid) { return _GetTableData(domId, Rowid); }
  //_frame.getSelRow = function () { return _GetSelectRowId();} 
})
//自定义弹出提示
var _alert = function (msg, type, fc) {
  var t = -1;
  switch (type) {
    case 2:
    case "error": t = 2; break;
    case 1:
    case "ok":
    case "success": t = 1; break;
    case 0:
    case "warning": t = 0; break;
    case 3:
    case "quantion": t = 3; break;
    case 4:
    case "lock": t = 4; break;
    case 5:
    case "fail": t = 5; break;
    case 6:
    case "win": t = 6; break;
    default: t = -1; break;
  }
  top.layer.alert(msg, { icon: t }, function (index) {
    if (!!fc) {
      fc();
    }
    layer.close(index);
  });
}

var _table = function (options) {
  if (options.elem == null || options.elem == undefined) {
    options.elem = this.elem;
  }
  options = SetOptions(options);
  var tableStr = (options.elem).substr(1);
  var html = "";
  var columns = options.columns;
  var htmlHead = "";
  var htmlTBody = "";
  //表格头部渲染
  var columnAlign = "";
  if (options.thAlign != null && options.thAlign != undefined) {
    columnAlign = "text-align:" + options.thAlign + ";text-align-last:" + options.thAlign + ";";
  }
  htmlHead += "<thead><tr>";
  if (options.multiple) {
    htmlHead += "<th style='width:40px;'></th>";
  }
  htmlHead += "<th style='width:40px;max-width:120px;'></th>";
  var lastThWidth = -1;
  if (!$(options.elem).css("width")) { return false; }
  var tableWidth = parseInt($(options.elem).css("width").substr(0, $(options.elem).css("width").length - 2));
  var thWidthCount = 0;
  $.each(columns, function (i, item) {
    if (item.index == null || item.index == undefined) {
      return;
    }
    if (item.name == null || item.name == undefined) {
      item.name = item.index;
    }
    if (item.hidden == null || item.hidden == undefined) {
      item.hidden = false;
    }
    var hiddenCode = "";
    var columnWidth = "";
    if (item.hidden) {
      hiddenCode = "display:none;";
    }
    if (item.width != null && item.width != undefined) {
      if ($.type(item.width) == "number") {
        thWidthCount += item.width;
        columnWidth = "width:" + item.width + "px;";
      }
      else if ($.type(item.width) == "string") {
        thWidthCount += parseInt(item.substr(0, item.length - 2));
        columnWidth = "width:" + item.width + ";";
      }
    }
    htmlHead += "<th  style='" + columnWidth + hiddenCode + columnAlign + "'>" + item.name + "</th>";
  });
  lastThWidth = tableWidth - thWidthCount;
  if (lastThWidth > 0) {
    htmlHead += "<th style='" + lastThWidth + "px'></th>";
  }
  htmlHead += "</tr></thead>";
  var listData = [];
  //数据获取
  $.ajax({
    host: options.host,
    url: options.url,
    type: options.type,
    dataType: 'json',
    CORS: options.CORS,
    data: options.data,
    shadeType: 2,
    shadeStr: '正在加载...',
    success: function (res) {
      var page = {};
      var data;
      if (res.pagins == undefined) {
        data = res.model;
      } else {
        page = res.pagins;
        data = res.model;
      }
      htmlTBody += "<tbody>";
      if (options.dataType == "json") {
      } else {
        data = JSON.parse(data);
      }
      if (data == null || data == undefined || data.length == 0) {
        _alert("找不到相关数据", "warning");
        $(options.elem).html(htmlHead);
        return;
      }
      $.each(data, function (i, item) {  //遍历每行数据
        htmlTBody += "<tr id='_frame_tr_" + (i + 1) + "'>";  //添加行标
        $.each(columns, function (ci, citem) {  //遍历表头单元格
          if (citem.hidden == null || citem.hidden == undefined) {
            citem.hidden = false;
          }
          var columnWidth = "";
          var columnAlign = "";
          var columnClass = "";
          if (citem.width != null && citem.width != undefined) {
            if ($.type(citem.width) == "number") {
              thWidthCount += citem.width;
              columnWidth = "width:" + citem.width + "px;";
            }
            else if ($.type(citem.width) == "string") {
              thWidthCount += parseInt(citem.substr(0, citem.length - 2));
              columnWidth = "width:" + citem.width + ";";
            }
          }
          if (citem.align != null && citem.align != undefined) {
            columnAlign = "text-align:" + citem.align + ";text-align-last:" + citem.align + ";";
          }
          if (citem.class != null && citem.class != undefined) {
            columnClass = "class='" + citem.class + "'";
          }
          var onclickParam = "";
          var hiddenCode = "";
          if (citem.hidden) {
            hiddenCode = "display:none;";
          }
          if (options.selectRow == null || options.selectRow == undefined) {
            onclickParam = "";
          } else {
            onclickParam = "," + options.selectRow;
          }
          if (ci == 0) {  //每行先添加行标顺序
            if (options.multiple) {
              htmlTBody += "<th style='width:40px;'><input name='_frame_" + tableStr + "_multiple' type='checkbox' value='" + (i + 1) + "' disabled='disabled' class='checkbox-disabled' ></th>";
            }
            htmlTBody += "<td id='_frameRowid_" + (i + 1) + "' name='_frameRowid' class='W80th'>" + (i + 1) + "</td>";
          }
          if (citem.format == null || citem.format == undefined) {//无格式化
            if (item[citem.index] == null || item[citem.index] == undefined) { //如果在该行中不存在表头中的索引，则不添加数据
              htmlTBody += "<td " + columnClass + " id='_frame_" + citem.index + "_" + (i + 1) + "' name='_frame_" + citem.index + "_" + (i + 1) + "' style='" + columnWidth + hiddenCode + columnAlign + "'></td>";
            } else {  //
              htmlTBody += "<td " + columnClass + " id='_frame_" + citem.index + "_" + (i + 1) + "' name='_frame_" + citem.index + "_" + (i + 1) + "' style='" + columnWidth + hiddenCode + columnAlign + "'>" + item[citem.index] + "</td>";//添加数据，item[citem.index],citem.index为列索引
            }
          } else {
            if ($.type(citem.format) == "function") {
              //format(rowid,rowdata) 
              var rowData = item;
              var UnitContent = citem.format((i + 1), rowData);
              htmlTBody += "<td " + columnClass + " id='_frame_" + citem.index + "_" + (i + 1) + "' name='_frame_" + citem.index + "_" + (i + 1) + "' style='" + columnWidth + hiddenCode + columnAlign + "'>" + UnitContent + "</td>";
            } else if ($.type(citem.format) == "string") {
              switch (citem.format) {
                case "text":
                case "string": htmlTBody += "<td " + columnClass + " id='_frame_" + citem.index + "_" + (i + 1) + "' name='_frame_" + citem.index + "_" + (i + 1) + "' style='" + columnWidth + hiddenCode + columnAlign + "'>" + item[citem.index] + "</td>"; break;
                case "number": htmlTBody += "<td " + columnClass + " id='_frame_" + citem.index + "_" + (i + 1) + "' name='_frame_" + citem.index + "_" + (i + 1) + "' style='" + columnWidth + hiddenCode + columnAlign + "'>" + (item[citem.index] == '' || item[citem.index] == null ? 0 : parseFloat(item[citem.index])) + "</td>"; break;
                case "money": htmlTBody += "<td " + columnClass + " id='_frame_" + citem.index + "_" + (i + 1) + "' name='_frame_" + citem.index + "_" + (i + 1) + "' style='" + columnWidth + hiddenCode + columnAlign + "'>" + GetToFixed(item[citem.index], 2) + "</td>"; break;
                case "date": htmlTBody += "<td " + columnClass + " id='_frame_" + citem.index + "_" + (i + 1) + "' name='_frame_" + citem.index + "_" + (i + 1) + "' style='" + columnWidth + hiddenCode + columnAlign + "'>" + formatTime(item[citem.index], "yyyy-MM-dd") + "</td>"; break;
                case "datetime": htmlTBody += "<td " + columnClass + " id='_frame_" + citem.index + "_" + (i + 1) + "' name='_frame_" + citem.index + "_" + (i + 1) + "' style='" + columnWidth + hiddenCode + columnAlign + "'>" + formatTime(item[citem.index], "yyyy-MM-dd HH:mm:ss") + "</td>"; break;
                default:
                  if ((citem.format).substr(0, 5) == "json:") {//json数据格式，根据值进行匹配显示，例：json:{"0","男","1":"女","2":"未知"}
                    var jj = (citem.format).substr(5);
                    htmlTBody += "<td " + columnClass + " id='_frame_" + citem.index + "_" + (i + 1) + "' name='_frame_" + citem.index + "_" + (i + 1) + "' style='" + columnWidth + hiddenCode + columnAlign + "'>" + ColumnFormatJson(item[citem.index], jj) + "</td>";
                  } else if ((citem.format).substr(0, 5) == "date:") { //自定义时间格式,例：date:yy-MM-dd
                    var tt = (citem.format).substr(5);
                    htmlTBody += "<td " + columnClass + " id='_frame_" + citem.index + "_" + (i + 1) + "' name='_frame_" + citem.index + "_" + (i + 1) + "' style='" + columnWidth + hiddenCode + columnAlign + "'>" + formatTime(item[citem.index], tt) + "</td>";
                  } else {
                    htmlTBody += "<td " + columnClass + " id='_frame_" + citem.index + "_" + (i + 1) + "' name='_frame_" + citem.index + "_" + (i + 1) + "' style='" + columnWidth + hiddenCode + columnAlign + "'>" + item[citem.index] + "</td>";
                  }
                  break;
              }
            }
          }
        });
        item.rowid = (i + 1);
        listData.push(item);
        htmlTBody += "</tr>";
      });
      htmlTBody += "</tbody>";
      html = htmlHead + htmlTBody;
      $(options.elem).html(html);
      tableDatas = ArrDelet(tableDatas, tableStr, "json"); //添加前先删除之前存储的
      var tempTable = '{"' + tableStr + '":' + JSON.stringify(listData) + '}';
      tableDatas.push(JSON.parse(tempTable));
      ArrDelet(optionList, tableStr);
      delete optionList[tableStr];
      optionList[tableStr] = options;
      page.domId = options.pageElem;
      SetPagin(page, options.elem);
      loadedFunction(options.loaded, options.elem, options.onclick, options.ondbclick, options.selectRow);
    }
  });
}

///删除数组中指定的元素
///param(arr):原始数组
///param(index):对应要删除的索引
///param(type):可选参数，如果是json，则传递type="json"，删除的时候只会匹配json的前标识，例如：[{"arr1":[{},{}]},{"arr2":[{},{}]}],传递arr1则只会删除arr1
///示经过详细测试，如遇到不可处理的数组时再进行升级
function ArrDelet (arr, index, type) {
  var resArr = [];
  if ($.type(index) == "number") {
    $.each(arr, function (i, item) {
      if (i == index) {
      } else {
        resArr.push(item);
      }
    });
  }
  else if ($.type(index) == "string") {
    $.each(arr, function (i, item) {
      if (type == "json") {
        if (item[index] == null || item[index] == undefined) {
          resArr.push(item);
        }
      } else {
        if (item == index) {

        } else {
          resArr.push(item);
        }
      }
    });
  }
  return resArr;
}
//table请求参数检测
function SetOptions (options) {
  if (options.url == null || options.url == undefined) {
    return;
  }
  if (options.elem == null || options.elem == undefined) {
    options.elem = this.myconfig.elem;
  }
  if (options.pageElem == null || options.pageElem == undefined) {
    options.pageElem = this.myconfig.pageElem;
  }
  if (!$(options.elem)) {
    return;
  }
  if (!($.type(options.columns) == "array")) {
    return;
  }
  if (!options.CORS && !options._CORS) {
    options.CORS = false;
  } else {
    options.CORS = true;
  }
  if (options.loaded == null || options.loaded == undefined) {
    options.loaded = function () { }
  }
  if (options.type == null || options.type == undefined) {
    options.type = 'post';
  }
  if (options.data == null || options.data == undefined) {
    options.data = {};
    options.time = new Date().getTime();
  }
  if (options.PageSize == null || options.PageSize == undefined) {
    options.PageSize = this.myconfig.PageSize;
  }
  if (options.Sort == null || options.Sort == undefined) {
    options.Sort = this.myconfig.Sort;
  }
  if (options.PageIndex == null || options.PageIndex == undefined) {
    options.PageIndex = this.myconfig.PageIndex;
  }
  if (options.multiple == null || options.multiple == undefined) {
    options.multiple = false;
  }
  if (options.width != null && options.width != undefined) {
    if ($.type(options.width) == "number") {
      $(options.elem).css("width", options.width + "px");
    }
    else if ($.type(options.width) == "string") {
      $(options.elem).css("width", options.width);
    }
  }
  if (options.height != null && options.height != undefined) {
    if ($.type(options.width) == "number") {
      $(options.elem).css("height", options.height + "px");
    }
    else if ($.type(options.width) == "string") {
      $(options.elem).css("height", options.height);
    }
  }
  $(options.elem).attr("class", this.myconfig.elemClass);
  if (options.elemClass != null && options.elemClass != undefined && options != "undefined") {
    $(options.elem).addClass(options.elemClass)
  }
  options.data.Sort = options.Sort;
  options.data.PageSize = options.PageSize;
  options.data.PageIndex = options.PageIndex;
  //$(options.elem).attr("class", "table align-center");
  return options;
}
//保留指定小数位数
function GetToFixed (number, leng) {
  var caculatorNumber = 10;
  for (i = 0; i < leng; i++) {
    caculatorNumber *= 10;
  }
  number = parseInt(number * caculatorNumber);
  if (number > 0) {
    number = (number % 10 >= 5 ? (parseInt(number / 10) + 1) : parseInt(number / 10));
  } else {
    number = (number % 10 <= -5 ? (parseInt(number / 10) - 1) : parseInt(number / 10));
  }
  number = parseFloat(number / (caculatorNumber / 10));
  var tailNumber = String(number).substr(String(number).indexOf('.')); for (var i = tailNumber.length - 1; i < leng; i++) {
    if (i == 0) { number = String(number) + "."; }
    number = String(number) + "0";
  }
  return number;
}

//JSON格式的数据格式化显示成对应的数据
function ColumnFormatJson (content, json) {
  json = JSON.parse(json);
  return json[content];
}

//时间格式化
function formatIntNumberToStr (number, len) {
  var numberlen = String(number).length;
  if (!(len > 0)) {
    return String(number);
  }
  if (!(numberlen < len)) {
    return String(number).substr(0, len);
  }
  var res = "";
  for (var i = numberlen; i < len; i++) {
    res += "0";
  }
  res += String(number);
  return res;

}
//格式化时间
function formatTime (datetime, formatStr) {
  var d = new Date(datetime);
  var year = d.getFullYear();
  var year2 = parseInt(String(year).substr(2));
  var month = d.getMonth() + 1;
  var day = d.getDate();
  var hour = d.getHours();
  var min = d.getMinutes();
  var sec = d.getSeconds();
  var mill = d.getMilliseconds();
  formatStr = formatStr.replace("yyyy", formatIntNumberToStr(year, 4));
  formatStr = formatStr.replace("yy", formatIntNumberToStr(year2, 2));
  formatStr = formatStr.replace("MM", formatIntNumberToStr(month, 2));
  formatStr = formatStr.replace("dd", formatIntNumberToStr(day, 2));
  formatStr = formatStr.replace("HH", formatIntNumberToStr(hour, 2));
  formatStr = formatStr.replace("mm", formatIntNumberToStr(min, 2));
  formatStr = formatStr.replace("ss", formatIntNumberToStr(sec, 2));
  formatStr = formatStr.replace("fff", formatIntNumberToStr(mill, 3));
  formatStr = formatStr.replace("ff", formatIntNumberToStr(mill, 2));
  formatStr = formatStr.replace("f", formatIntNumberToStr(mill, 1));
  return formatStr;
}

///取表格中的一行数据
///param(domId):table标签的id，例如<table id="#mytable"></table>,param(domId)=#mytable
///param(rowid):要取的行id，如果rowid为空，则返回全部数据
function _GetTableData (domId, rowid) {
  var rowData = {};
  var tableData = [];
  domId = String(domId).substr(1);
  $.each(tableDatas, function (i, item) {
    if (item[domId] != null && item[domId] != undefined) {
      tableData = item[domId];
    }
  });
  if (rowid == null || rowid == undefined) {
    return tableData;
  }
  $.each(tableData, function (i, item) {
    if (item.rowid == rowid) {
      rowData = item;
    }
  });
  return rowData;
}

//设置选中的RowId
function _GetSelectRowId () {
  return parseInt(selectRowId);
}

function _GetMultipleRowid (domId) {
  var arr = new Array();
  $.each($(domId).find("input[type='checkbox']:checked"), function (i, item) {
    arr.push($(item).val());
  });
  return arr;
}

//表格单击选中效果
function tableClick (e) {
  var _selectColor = this.myconfig.selectColor;
  selectRowId = $(e).find("td[name='_frameRowid']").html();
  var domId = $(e).parent().parent().attr("id");
  $("#" + domId).find("td").css("background-color", "");
  //$(e).css("background-color", this.myconfig.selectColor);
  $.each($("#" + domId).find("td"), function (i, item) {
    $(item).css("background-color", "");
  });
  $.each($(e).find("td"), function (i, item) {
    $(item).css("background-color", _selectColor);
  });
  selectRowData = _GetTableData("#" + domId, selectRowId);

  var tableStr = domId
  if (optionList[tableStr].multiple) {
    if (!($(e).find("input[type='checkbox']").attr("checked"))) {
      $(e).find("input[type='checkbox']").attr("checked", true);
    } else {
      $(e).find("input[type='checkbox']").attr("checked", false);
    }
  }
}

//设置分页
function SetPagin (options, tableElem) {
  if (options.domId == null || options.domId == undefined) {
    options.domId = this.myconfig.pageElem;
  }
  if (options.paginSize == null || options.paginSize == undefined) {
    domId = this.myconfig.PageSize;
  }
  if (options.PageIndex == null || options.PageIndex == undefined) {
    options.PageIndex = 1;
  }
  if (options.counts == null || options.counts == undefined) {
    options.counts = 0;
  }
  var html = "";
  var pageCount = parseInt((parseInt(options.counts) / parseInt(options.PageSize)) + 1);
  var PreviousPageIndex = options.PageIndex - 1;
  html += '<nav aria-label="Page navigation"><ul class="pagination"><li><a href="javascript:LoadPagin(' + options.PageSize + ',' + PreviousPageIndex + ',' + pageCount + ',\'' + tableElem + '\');" aria-label="Previous"><span aria-hidden="true">&laquo;</span></a></li>';
  if (options.PageIndex < 3) {
    for (var i = 0; i < pageCount; i++) {
      if (i == 6) {
        html += '<li><a href="#">...</a></li>';
        break;
      } else {
        html += '<li><a href="javascript:LoadPagin(' + options.PageSize + ',' + (i + 1) + ',' + pageCount + ',\'' + tableElem + '\');">' + (i + 1) + '</a></li>';
      }
    }
  } else {
    for (var i = 0; i < pageCount; i++) {
      var DValue = parseInt(options.PageIndex) - i;
      if (DValue > -3 && DValue < 3) {
        html += '<li><a href="javascript:LoadPagin(' + options.PageSize + ',' + (i + 1) + ',' + pageCount + ',\'' + tableElem + '\');">' + (i + 1) + '</a></li>';
      } else {
        if (DValue == -3) {
          html += '<li><a href="javascript:LoadPagin(' + options.PageSize + ',1,' + pageCount + ',\'' + tableElem + '\');">1</a></li>';
          html += '<li><a href="#">...</a></li>';
        }
        if (DValue == 3) {
          html += '<li><a href="#">...</a></li>';

        }
      }
    }
  }
  var nextPageIndex = options.PageIndex + 1;
  html += '<li><a href="javascript:LoadPagin(' + options.PageSize + ',' + nextPageIndex + ',' + pageCount + ',\'' + tableElem + '\');" aria-label="Next"><span aria-hidden="true">&raquo;</span></a></li>';
  html += '<li><span style="border:none;background-color:transparent;color:#000;">共' + options.counts + '条数据，每页' + options.PageSize + '条，当前第' + options.PageIndex + '页,共' + parseInt(pageCount) + '页</a></li></ul></nav>';
  $(options.domId).html(html);
}

function LoadPagin (pageSize, pageIndex, maxIndex, tableElem) {
  _frame(tableElem).LoadPagin(pageSize, pageIndex, maxIndex);
}

function loadedFunction (fun, elem, clickFun, dbclickFun, selectFun) {

  var allData = _frame("#fileList").getData();

  var _clickFun;

  if (!!clickFun && !!selectFun) {
    _clickFun = function (selectRowId, selectRowData) {
      clickFun(selectRowId, selectRowData);
      if ($.type(fun) == null || $.type(fun) == "undefined") {
        return;
      } else {
        var selectid = _frame(elem).getSelRowid();
        if (selectid.indexOf(selectRowId) > -1) {
          selectFun(selectRowId, selectRowData);
        }
      }
    }
  } else if (!!clickFun) {
    _clickFun = clickFun;
  } else if (!!selectFun) {
    _clickFun = function (selectRowId, selectRowData) {
      if ($.type(fun) == null || $.type(fun) == "undefined") {
        return;
      } else {
        var selectid = _frame(elem).getSelRowid();
        if (selectid.indexOf(selectRowId) > -1) {
          return selectFun(selectRowId, selectRowData);
        } else {
          return;
        }
      }
    };
  } else {
    _clickFun = "";
  }

  $.each(allData, function (i, item) {
    $("#_frame_tr_" + (i + 1)).click(function () {
      if (!!dbclickFun) {
        clearInterval(_clickTimer);
        _clickTimer = setInterval(function () {
          _frame(elem).onclick($("#_frame_tr_" + (i + 1)), _clickFun);
          clearInterval(_clickTimer);
        }, 20);
      } else {
        _frame(elem).onclick($("#_frame_tr_" + (i + 1)), clickFun);
      }
    });
    $("#_frame_tr_" + (i + 1)).dblclick(function () {
      clearInterval(_clickTimer);
      _frame(elem).ondbclick($("#_frame_tr_" + (i + 1)), dbclickFun)
    });
  });

  if ($.type(fun) != "function") {
    return false;
  }
  fun();
}

//日期计算
//<AddDayCount>:数值，-1表示前一天，1表示后一天
function GetDateStr (AddDayCount) {
  var dd = new Date();
  dd.setDate(dd.getDate() + AddDayCount);//获取AddDayCount天后的日期
  var y = dd.getFullYear();
  var m = dd.getMonth() + 1;//获取当前月份的日期
  var d = dd.getDate();
  return formatIntNumberToStr(y, 4) + "-" + formatIntNumberToStr(m, 2) + "-" + formatIntNumberToStr(d, 2);
}
///
// 调用示例
///
//_frame("#mytable").table({
//    url: "",
//    columns: [
//        { name: "菜单名称", index: "PowerName", width: 80 },
//        { name: "对应URL", index: "PowerUrl", width: 200 },
//        { name: "归属类", index: "PowerClass", width: 80 },
//        { name: "排序", index: "PowerSort", width: 80 },
//        {
//            name: "目录级别", index: "PowerSort", width: 80, format: function (rowid, rowdata) {
//                if (rowdata.PowerUrl == null || rowdata.PowerUrl == undefined) {
//                    return '1';
//                }
//                return '2';
//            }
//        },
//        { name: "创建时间", index: "create_time", width: 80, format: "date" },
//    ],
//    selectRow: function (rowid, rowData) {
//        console.log(rowid);
//        console.log(rowData);
//    }
//});


