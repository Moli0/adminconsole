<template>
  <div class="width100vw"
       style="height:100vh;">
    <div id="miniNav"
         style="width:50px;height:100vh;position:fixed;overflow:hidden;background-color:#252525">
      <div style="position:absolute;width:50px;height:50px;color:white;font-size:30px;padding:10px;"
           onclick="NavControl()">
        <span class="glyphicon glyphicon-th"></span>
      </div>
      <hr style="margin-top:60px;" />
    </div>
    <div id="iframeNav"
         class="my_Left_nav_web"
         style="overflow:hidden;background-color:rgba(255,255,255,0);border:none;margin:0;padding:0">
      <leftNav ref="leftNav"></leftNav>
    </div>
    <div id="adminIndex"
         style="margin-left:250px;width:auto;background-color:#000;background-color:#fff;height:100vh;overflow:hidden;min-width:500px;">
      <topNav ref="topNav"></topNav>
      <div class="boxpadding">
        <router-view v-for="item in openNav"
                     :key="item.id"
                     :class="{'display-none':nowNav!=item.id}"
                     :name="item.name"></router-view>
      </div>
    </div>
  </div>
</template>

<script>
// const leftNav = () => import('../../components/Nav/LeftNav.vue');

import leftNav from '../../components/Nav/LeftNav'
import topNav from '../../components/Nav/TopNav'

export default {
  data () {
    return {
      openNav: [],
      nowNav: 1
    }
  },
  created () {

  },
  components: {
    leftNav,
    topNav
  },
  methods: {
    SetNowNav (navId) {
      this.nowNav = navId;
      this.$refs.topNav.SelectNav(navId);
    },
    AddNav (obj) {
      let b = false;
      $.each(this.openNav, function (i, item) {
        if (item.id == obj.id) {
          b = true;
          return;
        }
      });
      if (!b) {
        this.openNav.push(obj);
      }
      this.SetNowNav(obj.id);
    },
    CloseNav (navId) {
      if (navId == 0) {
        return;
      }
      for (var i = 0; i < this.openNav.length; i++) {
        if (this.openNav[i].id == navId) {
          this.openNav.splice(i, 1);
          if (navId == this.nowNav) {
            this.SetNowNav(this.openNav[i - 1].id);
          }
          return;
        }
      }
    },
    UpdateNavPosition (navId, NewPosition) {

    },
    InitNavPostion () {

    },
  }
}
</script>