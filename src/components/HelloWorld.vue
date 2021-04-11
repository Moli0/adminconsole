
<template>
  <el-button type="text"
             @click="dialogVisible = true">点击打开 Dialog</el-button>

  <el-dialog title="提示"
             v-model="dialogVisible"
             width="30%"
             :before-close="handleClose">
    <homeBox></homeBox>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="dialogVisible = false">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import homeBox from '../views/Home.vue'
export default {
  components: {
    homeBox
  },
  data () {
    return {
      dialogVisible: false
    };
  },
  methods: {
    handleClose (done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => { });
    }
  }
};
</script>

<style>
</style>
