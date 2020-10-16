<template>
  <div class="fill_w">
    <div class="fon_16 col_5381ff">创建盒子</div>
    <div class="fon_14 pad_top_20 mar_top_10 text_center borderBlue">
      <div class="textWidth flex jus_between ali_center">
        <div class>所属仓库：</div>
        <el-select v-model="depotName" size="small" class="inputWidth" placeholder="请选择仓库" disabled></el-select>
      </div>
      <div class="textWidth flex jus_between ali_center">
        <div class>新增盒子数量：</div>
        <el-input size="small" placeholder="请输入新增数量" v-model="boxCount" class="inputWidth"></el-input>
      </div>
      <div class="textWidth flex jus_between ali_center">
        <div class>盒子行数：</div>
        <el-input size="small" min="1" max="10" placeholder="请输入1-10的数字" v-model="boxRowCount" class="inputWidth"></el-input>
      </div>
      <div class="textWidth flex jus_between ali_center">
        <div class>盒子列数：</div>
        <el-input size="small" min="1" max="10" placeholder="请输入1-10的数字" v-model="boxColCount" class="inputWidth"></el-input>
      </div>
    </div>
    <div class="flex">
      <div class="flex1"></div>
      <el-button type="primary" plain size="small" @click="createBox()">新 增</el-button>
      <el-button @click="close" size="small">取 消</el-button>
    </div>
  </div>
</template>
<script>
import { createBox } from '@/api/collect.js'
export default {
  props: ['depotCurrent', 'depotName'],
  data() {
    return {
      // 新增盒子
      boxCount: '',
      boxRowCount: 2,
      boxColCount: 2
    }
  },
  methods: {
    // 新增盒子
    async createBox() {
      if (!this.depotCurrent) {
        this.$message.error('请选择仓库！')
        return ''
      }
      if (!this.boxCount) {
        this.$message.error('请填写新增盒子数量！')
        return ''
      }

      if (!this.boxRowCount) {
        this.$message.error('请填写新增盒子行数！')
        return ''
      }

      if (!this.boxColCount) {
        this.$message.error('请填写新增盒子列数！')
        return ''
      }

      this.close()

      let res = await createBox({
        deport_code: this.depotCurrent,
        count: this.boxCount,
        levels: this.boxRowCount,
        columns: this.boxColCount
      })
      if (res.code == 201) {
        this.$message.success('成功创建盒子！')
        this.disCreateBox = false
        this.changeFilter()
        this.boxCount = this.boxRowCount = this.boxColCount = ''
      } else {
        this.$message.success(res.msg)
      }
    },
    //关闭弹窗
    close() {
      this.$emit('close')
    }
  }
}
</script>
<style class="scss" scoped>
.borderBlue {
  border-top: 1px solid #5381ff;
  border-bottom: 1px solid #5381ff;
}

.textWidth {
  width: 310px;
  margin-bottom: 10px;
  margin: 10px auto;
}

.inputWidth {
  width: 200px;
}
</style>