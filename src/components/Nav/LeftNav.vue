<template>
  <div class="my_Left_nav_web">

    <div id="my_nav"
         onclick="window.parent.NavControl()"
         class="my_min_nav_btn position-static"><span class="glyphicon glyphicon-list my_bootsrap_btnSize"></span> <span class="my_nav_btn_rightText">{{SystemName}}</span></div>

    <div class="my_nav_list_box position-static"
         id="mainNav">
      <ul>
        <li v-for="item in navs"
            :key="item.id">
          <div v-if="!!item.url"
               class="nav_link"
               @click="AddNav(item)"
               style="color:white">
            <span>{{item.text}}</span>
          </div>
          <div v-else
               class="nav_link"
               style="color:white">
            <span>{{item.text}}</span>
          </div>
          <span class="float-right open-icon">&gt;</span>
          <ul class="inline-nav_list">
            <li v-for="a in item.child"
                :key="a.id"
                class="glyphicon glyphicon-ice-lolly-tasted font-size-12"
                style="display:block;">
              <div class="nav_link"
                   @click="AddNav(a)"
                   :to="a.url"
                   style="padding-left:5px;">{{a.text}}</div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import '../../../public/static/Content/Css/nav.css'

export default {
  name: 'LeftNav',
  data () {
    return {
      SystemName: '题库管理后台',
      navs: [{
        id: 1,
        name: 'Home',
        text: '首页',
        url: '/home/index',
        isMain: true,
        child: []
      }, {
        id: 2,
        name: 'Settings',
        text: '系统设置',
        url: '',
        isMain: false,
        child: [{
          id: 3,
          name: 'AccountManage',
          text: '账号管理',
          url: '/sysmanagement/account',
          isMain: false,
          child: []
        }, {
          id: 4,
          name: 'SystemManage',
          text: '系统设置',
          url: '/sysmanagement/account',
          isMain: false,
          child: []
        }
        ]
      }]
    }
  },
  created () {
    var __this = this;
    __this.$parent.openNav = [];
    var param = {};
    $.each(this.navs, function (i, item) {
      if (item.isMain) {
        param = {
          id: item.id,
          name: item.name,
          text: item.text,
          url: item.url,
          isMain: item.isMain
        }
        __this.$parent.openNav.push(param);
      }
    });
  },
  methods: {
    AddNav (obj) {
      const param = {
        id: obj.id,
        name: obj.name,
        text: obj.text,
        url: obj.url,
        isMain: obj.isMain
      }
      this.$parent.AddNav(param);
    }
  }
}
</script>