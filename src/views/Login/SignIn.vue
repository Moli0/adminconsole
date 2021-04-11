<template>
  <div>
    <div id="container">
      <div id="output">
        <div class="containerT">
          <div class="Login-Title">欢迎来到梦想书屋
          </div>
          <form class="form"
                id="form1">
            <input type="text"
                   placeholder="用户名"
                   id="Account"
                   name="Account"
                   value=""
                   required>
            <input type="password"
                   placeholder="密码"
                   id="Password"
                   name="Password"
                   required>
            <div style="text-align:right;width:100%;padding:5px 0px;">
              <a href="/Login/SignUp">注册账号</a>&nbsp;&nbsp;&nbsp;
              <a href="#">忘记密码?</a>
            </div>
            <button type="button"
                    class="btn btn-bubble"
                    v-on:click="SubmitForm">登陆</button>
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
import '../../../public/static/Frame/Login/css/style.css'
import '../../../public/static/Content/Css/btnCss.css'

export default {
  name: 'SignIn',
  data () { return {} },
  mounted () {
    setTimeout(() => {
      Victor("container", "output");   //登录背景函数
    }, 100);
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
              window.location.href = "/Home/Index";
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