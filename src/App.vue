<template>
  <router-view />
</template>

<script>
export default {
  name: '后台',
  mounted () {
    window.addEventListener('load', () => { // 滚动事件变为 scroll
      if (this.$route.path !== '/home/index') { // /print 表示首页
        this.$router.replace('/home/index') // 切换到首页
      }
    })
  }
}
</script>

