<template>
  <div>
    <el-button type="success"
               @click="isShow=!isShow;btnC=isShow?'隐藏':'显示'">{{btnC}}</el-button>
    <div :class="{activity:isShow}">11111111</div>
    <div>2222222</div>
  </div>
</template>

<script>
export default ({
  name: 'test',
  data () {
    return {
      isShow: false,
      btnC: "显示",
    }
  }
})
</script>

<style>
.activity {
  display: none;
}
</style>
