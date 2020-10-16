<template>
  <div class="fill_w">
    <div class="fon_16 col_5381ff">创建货架</div>
    <div class="fon_14 pad_top_20 mar_top_10 text_center borderBlue">
      <div class="textWidth flex jus_between ali_center">
        <div class>所属仓库：</div>
        <el-select v-model="depotName" size="small" class="inputWidth" placeholder="请选择仓库" disabled></el-select>
      </div>
      <div class="textWidth flex jus_between ali_center">
        <div class>新增架子数量：</div>
        <el-input size="small" placeholder="请输入新增数量" v-model="shelfCount" class="inputWidth"></el-input>
      </div>
      <div class="textWidth flex jus_between ali_center">
        <div class>货架总层数：</div>
        <el-input size="small" min="1" max="10" placeholder="请输入1-10的数字" v-model="shelfRowCount" class="inputWidth"></el-input>
      </div>
      <div class="textWidth flex jus_between ali_center">
        <div class>货架总列数：</div>
        <el-input size="small" min="1" max="10" placeholder="请输入1-10的数字" v-model="shelfColCount" class="inputWidth"></el-input>
      </div>
    </div>
    <div class="flex">
      <div class="flex1"></div>
      <el-button type="primary" plain size="small" @click="createShelf()">新 增</el-button>
      <el-button @click="close" size="small">取 消</el-button>
    </div>
  </div>
</template>

<script>
import { createShelf } from '../../../api/collect.js'
export default {
  props: ['depotCurrent', 'depotName'],
  data() {
    return {
      // 新增货架
      shelfCount: '',
      shelfRowCount: '',
      shelfColCount: ''
    }
  },
  methods: {
    // 新增货架
    async createShelf() {
      if (!this.depotCurrent) {
        this.$message.error('请选择仓库！')
        return ''
      }
      if (!this.shelfCount) {
        this.$message.error('请填写新增货架数量！')
        return ''
      }

      if (!this.shelfRowCount) {
        this.$message.error('请填写新增货架行数！')
        return ''
      }

      if (!this.shelfColCount) {
        this.$message.error('请填写新增货架列数！')
        return ''
      }

      this.close()

      let res = await createShelf({
        deport_code: this.depotCurrent,
        count: this.shelfCount,
        levels: this.shelfRowCount,
        columns: this.shelfColCount
      })
      if (res.code == 201) {
        this.$message.success('成功创建货架！')
        this.disCreateShelf = false
        this.changeFilter()
        this.shelfCount = this.shelfRowCount = this.shelfColCount = ''
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

<style lang="scss" scoped>
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
