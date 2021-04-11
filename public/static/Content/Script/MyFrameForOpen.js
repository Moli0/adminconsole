﻿//import { setTimeout } from "timers";

var BoxList = {};

var _open = function (options) {
  if (options.type == "2") {
    if ($.type(options.content) == "string") {
      options.content = [options.content, "no"]
    }
  }
  if ((!!options.width) && (!!options.height)) {
    if ($.type(options.width) == "string") {
      options.area = [options.width, options.height];
    } else if ($.type(options.width) == "number") {
      options.area = [options.width + "px", options.height + "px"];
    }
    delete options.width;
    delete options.height;
  } else if (!!options.width) {
    if ($.type(options.width) == "string") {
      options.area = options.width;
    } else if ($.type(options.width) == "number") {
      options.area = options.width + "px";
    }
    delete options.width;
  }
  layer.open(options);
}

var _form = function (id) {
  return new initForm(id);
}

function initForm (id) {
  this.elem = id;
  this.check = function () { //表单必填验证
    var res = true;
    var elems = $(this.elem).find("[required]");
    $.each(elems, function (i, item) {
      if ($(item).val() == '') {
        $(item).fadeToggle(500, function () {
          $(item).fadeToggle(500, "linear", function () {
            $(item).focus();
          });
        });
        res = false;
        return;
      }
    });
    if (!res) {
      _alert("请将数据填写完整", "warning");
    }
    return res;
  }
  this.serializeArray = function (data) {
    if (!data) {
      return $(this.elem).serializeArray();
    } else {
      for (key in data) {
        $(this.elem).find("#" + key).val(data[key]);
      }
    }
  }
  this.bindSelect = function (options) {
    var param = {};
    var idCulomnName = "";
    var textCulomnName = "";
    var ajaxType = "POST";
    var dataType = "json";
    var selectElem = this.elem;
    if (options.url == null || options.url == undefined) {
      return;
    }
    if (options.data != null && options.data != undefined) {
      param = options.data;
    }
    if (options.id == null || options.id == undefined) {
      idCulomnName = "id";
    } else {
      idCulomnName = options.id;
    }
    if (options.text == null || options.text == undefined) {
      textCulomnName = "text";
    } else {
      textCulomnName = options.text;
    }
    if (options.type == null || options.type == undefined) {
      ajaxType = "POST";
    } else {
      ajaxType = options.type;
    }
    if (options.dataType == null || options.dataType == undefined) {
      dataType = "json";
    } else {
      dataType = options.dataType;
    }
    $.ajax({
      url: options.url,
      data: param,
      async: false,
      dataType: "json",
      type: ajaxType,
      success: function (res) {
        if (dataType == "json") {
        } else {
          res.model = JSON.parse(res.model);
        }
        var html = "";
        if (options.defaultNull == null || options.defaultNull == undefined) {
          html += "<option value=''>==请选择==</option>";
        } else {
          html += $(selectElem).html();
        }
        $.each(res.model, function (i, item) {
          html += "<option value='" + item[idCulomnName] + "'>" + item[textCulomnName] + "</option>";
        });
        $(selectElem).html(html);
      }
    });
  }
}

function _getCookie (key) {
  var idIndex = document.cookie.indexOf(key + "="); //expire=
  if (idIndex != -1) {
    idIndex += key.length + 1;
    var indexEnd = top.document.cookie.indexOf(";", idIndex);
    if (indexEnd != -1) {
      var useridCookie = document.cookie.substring(idIndex, indexEnd);
    } else {
      var useridCookie = document.cookie.substring(idIndex, document.cookie.length);
    }
  }
  return useridCookie;
}

function _setCookie (key, value) {
  document.cookie = key + "=" + value + ";path=/";
}

///
///上传文件
///file:文件
///function(res)：上传成功的回调函数
///
function UploadImage (url, file, fun) {
  var fr = new FileReader();
  fr.readAsDataURL(file);
  var lastName = file.name.substr((file.name).lastIndexOf('.') + 1);
  var lastNameIndex = 0;
  switch (lastName.toLowerCase()) {
    case "jpg":
    case "jpeg": lastNameIndex = 0; break;
    case "bmp": lastNameIndex = 1; break;
    case "gif": lastNameIndex = 2; break;
    case "png": lastNameIndex = 3; break;
    default: _alert("无法识别的类型"); return;
  }
  fr.onloadend = function (e) {
    var base64Data = e.target.result;
    var loadShard = layer.load(1, {
      skin: 'align-center',
      area: ['auto', '80px'],
      shade: [0.3, '#000'], //0.3透明度的白色背景
      content: '<div style="position:absolute;bottom:0px;font-size:20px;width:120px;margin-left:-30px;color:white;">正在上传...</div>'
    });
    $.ajax({
      //url: '/Share/UploadImgFile',
      url: url,
      type: 'post',
      dataType: "json",
      async: false,
      data: { fileBase64Str: base64Data, fileType: lastNameIndex },
      success: function (res) {
        layer.close(loadShard);
        fun(res.msg);
      },
      error: function (msg) {
        layer.close(loadShard)
        _alert(msg, "error");
      }
    });
  }
}
successFileIndex = 0;
///
///上传文件列表
///files:文件列表
///fun(url,file)单个文件上传成功的回调函数
///
function UploadImages (files, fun) {
  var passLoad = true;
  successFileIndex = 0;
  if (successFileIndex < files.length) {
    recLoad(files, fun, passLoad);
  } else {
    passLoad = true;
  }
}

function recLoad (files, fun, passLoad) {
  if (successFileIndex < files.length) {
    if (passLoad) {
      passLoad = false;
      UploadFile(files[successFileIndex], function (res) {
        successFileIndex++;
        passLoad = true;
        fun(res, files[successFileIndex - 1]);
        recLoad(files, fun, passLoad);
      });
      recLoad(files, fun, passLoad);
    } else {
      setTimeout(function () {
        recLoad(files, fun, passLoad);
      }, 500)
    }
  } else {
    successFileIndex = 999999;
    passLoad = true;
  }
}

function UploadFiles (url, param, fileElem, fun) {
  var formData = new FormData();
  for (var key in param) {
    formData.append(key, param[key]);
  }
  $.each($(fileElem)[0].files, function (i, item) {
    formData.append(fileElem.substr(1), item, item.name);
  });
  $.ajax({
    host: " ",
    type: 'POST',
    url: url,
    data: formData,
    mimeType: "multipart/form-data",
    contentType: false,
    cache: false,
    processData: false,
    async: true,
    dataType: 'json',
    success: function (res) {
      fun(res);
    }
  });

  // var tempFrame = $("<iframe></iframe").attr("name", "tempFrame").attr("src", "").attr("frameborder", "0").attr("class", "display:none");
  // tempFrame.appendTo('body');
  // var form = $("<form></form>").attr("action", url).attr("method", "post").attr("enctype", "multipart/form-data").attr("target", "tempFrame");
  // for (var key in param) {
  //   form.append($("<input></input>").attr("type", "hidden").attr("name", key).attr("value", param[key]));
  // }
  // form.append($("<input></input>").attr("type", "file").attr("name", "UploadFiles_File_Input").attr("id", "UploadFiles_File_Input"));
  // form.appendTo('body');
  // $("#UploadFiles_File_Input")[0].files = $(fileElem)[0].files;
  // form.appendTo('body');
  // form.submit(function () {
  //   var formData = new FormData(this);
  //   $.ajax({
  //     host: " ",
  //     type: form.attr('method'),
  //     url: form.attr('action'),
  //     data: formData,
  //     mimeType: "multipart/form-data",
  //     contentType: false,
  //     cache: false,
  //     processData: false,
  //     async: true,
  //     dataType: 'json',
  //     success: function (res) {
  //       form.remove();
  //       tempFrame.remove();
  //       fun(res);
  //     }
  //   });
  //   return;
  // }).submit();
}

///
///POST文件下载(提交表单式)
///url:下载路径
///param：请求的参数
///
function DownLoadFile (url, param) {
  var form = $("<form></form>").attr("action", url).attr("id", "Upload_File_Form").attr("method", "post");
  for (var key in param) {
    form.append($("<input></input>").attr("type", "hidden").attr("name", key).attr("value", param[key]));
  }
  form.appendTo('body').submit().remove();
}

function ShowBox (elem, title, location) {
  if (!elem) { return false; }
  if (!title) {
    title = "";
  }
  var offset = [50, 0];
  if ($.type(location) == "array") {
    offset = location;
  }
  else if (location == "top") {
    offset = [50, 0];
  }
  else if (location == "center") {
    offset = 'auto';
  }

  BoxList[elem] = layer.open({
    type: 1,
    title: title,
    content: $(elem),
    offset: offset,
    btn: null,
    closeBtn: 2,
    anim: 1,
    Boolean: false,
    maxWidth: window.innerWidth * .8,
    maxHeight: window.innerHeight * .8,
    cancel: function (index, layero) {
      if (confirm('当前数据尚未提交，确定要关闭么？')) { //只有当点击confirm框的确定时，该层才会关闭
        layer.close(index)
      }
      return false;
    },
  });
}
function CloseBox (elem) {
  layer.close(BoxList[elem]);
}