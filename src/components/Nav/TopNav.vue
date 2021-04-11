<template>
  <div class="my_top_info">
    <!--导航内容-->
    <div class="float-left"
         style="padding-top:10px;">
      <div class="float-left font-size-14 align-center btn btn-default btn-sm top_Nav_Btn"
           v-for="item in openNav"
           :key="item.id"
           :class="{isActivity:nowNav==item.id}"
           draggable="true"
           @dragover="allowDrop"
           @drop="dropDiv"
           @dragstart="dragStart"
           @click="SetNowNav(item.id)">
        <span>{{item.text}}{{item.id}}</span>
        <div v-if="!item.isMain"
             class="btn-close"
             @click.stop="CloseTab(item.id)">x</div>
      </div>
    </div>

    <!--右侧用户内容-->
    <div class="align-right"
         style="width:auto;height:50px;">
      <span style="line-height:50px;"><i class="el-icon-user"></i></span>
      <span style="line-height:50px;margin-right:30px;">
        <span class="font-size-16"
              id="headUserName">
          &nbsp;&nbsp;{{userInfo.userName}}
        </span>
      </span>
      <span style="line-height:50px;margin-right:20px;">
        <a href="/Notice/MessageNotice">
          <i class="el-icon-message-solid"></i><span id="headWarnningNumber"
                style="color:red;margin-left:5px">
            {{userInfo.msgCount}}
          </span>
        </a>
      </span>
      <el-button type="primary"
                 style="margin-right:20px;">退出</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'topNav',
  data () {
    return {
      openNav: this.$parent.openNav,
      nowNav: 1,
      userInfo: {
        userName: 'Moli',
        userEmail: 'linmolilin@gmail.com',
        msgCount: 10,
      }
    }
  },
  created () {
  },
  methods: {
    SelectNav (id) {
      this.nowNav = id;
    },
    SetNowNav (id) {
      this.nowNav = id;
      this.$parent.SetNowNav(id);
    },
    CloseTab (id) {
      this.$parent.CloseNav(id);
    },
    allowDrop (ev) {
      ev.preventDefault();
    },
    dragStart (ev) {
      console.log(22);
      console.log(ev);
    },
    dropDiv (ev) {
      console.log(11);
      console.log(ev);
    }
  }
}
</script>