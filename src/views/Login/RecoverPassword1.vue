<template>
  <div>
    <div id="container">
      <div id="output">
        <div class="containerT">
          <div class="Login-Title">找回密码</div>
          <form class="form"
                id="form1">
            <input type="text"
                   placeholder="用户名"
                   id="Account"
                   name="Account"
                   value=""
                   required>
            <div style="text-align:right;width:100%;padding:5px 0px;">
              <a href="/Login/SignUp">注册账号</a>&nbsp;&nbsp;&nbsp;
            </div>
            <button type="button"
                    class="btn btn-bubble"
                    onclick="SubmitForm()">下一步</button>
            <div id="prompt"
                 class="prompt"></div>
          </form>
        </div>
      </div>
    </div>
    <div style="text-align:center;">
    </div>
  </div>

</template>
<style>
.btn {
  display: inline-block;
  text-decoration: none;
  padding: 1em 2em;
}

.btn-bubble {
  color: white;
  background-color: #77b11c;
  background-repeat: no-repeat;
}
</style>
<script>
import '../../../static/Frame/Login/css/style.css'
import '../../../static/Content/Css/btnCss.css'

export default {
  name: 'RecoverPassword1',
  data () { return {} },
  mounted () {
    const oScript = document.createElement('script');
    oScript.type = 'text/javascript';
    oScript.src = '/static/Frame/Login/js/vector.js';
    document.body.appendChild(oScript);
    var sl = ShowLoad('正在加载');
    setTimeout(() => {
      layer.close(sl);
      Victor("container", "output");   //登录背景函数
    }, (200));
    $("#entry_name").focus();
    $(document).keydown(function (event) {
      if (event.keyCode == 13) {
        $("#entry_btn").click();
      }
    });
    var Account = $.request("Account");
    if (!!Account) {
      $("#Account").val(Account);
    }
  },
  methods: {
    SubmitForm: function () {
      if (!_form("#form1").check()) {
        return false;
      }

      $.SubmitForm({
        url: '/api/SignIn',
        CORS: true,
        iframe: false,
        data: _form("#form1").serializeArray(),
        success: function (data) {
          if (data.code == 0) {
            _setCookie("__usertoken", data.model);
            _alert("登录成功", "ok", function () {
              window.location.href = "/";
            });
          } else {
            _alert(data.model, "error");
          }
        }
      });

      return false;
    }
  }
}

</script>