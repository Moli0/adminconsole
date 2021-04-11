<template>
  <div>
    <div id="container">
      <div id="output">
        <div class="containerT"
             style="top:180px;">
          <div class="Login-Title">梦想书屋欢迎您加入</div>
          <form class="form"
                id="form1">
            <input id="Account"
                   name="Account"
                   type="text"
                   maxlength="24"
                   placeholder="用户名"
                   required>
            <input id="E_Mail"
                   name="E_Mail"
                   type="email"
                   maxlength="120"
                   placeholder="邮箱"
                   required>
            <input id="Real_Name"
                   name="Real_Name"
                   type="text"
                   maxlength="32"
                   placeholder="姓名"
                   required>
            <input id="Id_Number"
                   name="Id_Number"
                   type="text"
                   maxlength="20"
                   placeholder="身份证号码"
                   required>
            <input id="Phone_Number"
                   name="Phone_Number"
                   type="tel"
                   maxlength="12"
                   placeholder="手机号码"
                   required>
            <input id="Password"
                   name="Password"
                   type="password"
                   maxlength="64"
                   placeholder="密码"
                   required>
            <input id="VerifyPassword"
                   name="VerifyPassword"
                   type="password"
                   maxlength="64"
                   placeholder="确认密码"
                   required>
            <div style="text-align:right;width:100%;"><a href="/Login/SignIn">返回登陆</a></div>
            <div id="submitBtn"
                 class="btn btn-bubble">注册</div>
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
  name: 'SignIn',
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

    $("#submitBtn").click(function () {
      if (!_form("#form1").check()) {
        return false;
      }
      if ($("#Password").val().length < 6) {
        _alert("密码长度不得小于6位", "warning");
        return false;
      }
      if ($("#Password").val() != $("#VerifyPassword").val()) {
        _alert("再次密码不一致！", "error");
        return false;
      }
      $.SubmitForm({
        url: '/api/SignUp',
        CORS: true,
        iframe: false,
        data: _form("#form1").serializeArray(),
        success: function (res) {
          _alert(res.model, "ok", function () { window.location.href = "/Login/SignIn?Account=" + $("#Account").val(); });
        }
      });
    });
  },
  data () { return {} },
}
</script>