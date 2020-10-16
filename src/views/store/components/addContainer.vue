<template>
  <div class="fill_w">
    <div class="fon_16 col_5381ff">创建容器</div>
    <div class="fon_14 pad_top_20 mar_top_10 text_center borderBlue">
      <div class="textWidth flex jus_between ali_center">
        <div class>容器类型：</div>
        <el-select v-model="containerCurrent" size="small" class="inputWidth" @change="changeContainer" placeholder="请选择容器类型">
          <el-option v-for="e in containerList" :key="e.code" :label="e.name" :value="e.code"></el-option>
        </el-select>
      </div>
      <div class="textWidth flex jus_between ali_center">
        <div class>新增容器数量：</div>
        <el-input size="small" placeholder="请输入新增数量" v-model="containerCount" class="inputWidth"></el-input>
      </div>
      <div class="textWidth flex jus_between ali_center">
        <div class>条码前缀：</div>
        <el-input size="small" min="1" max="10" placeholder="请输入容器编码前缀" v-model="containerPrefix" class="inputWidth" disabled></el-input>
      </div>
    </div>
    <div class="flex">
      <div class="flex1"></div>
      <el-button type="primary" plain size="small" @click="createContainer()">新 增</el-button>
      <el-button @click="close" size="small">取 消</el-button>
    </div>
  </div>
</template>

<script>
import { createContainer, depotContainer } from '../../../api/collect.js'
export default {
  props: ['depotCurrent', 'depotName'],
  data() {
    return {
      //容器列表
      containerList: [],
      containerCurrent: '',
      //新增容器
      containerCount: '',
      containerPrefix: ''
    }
  },
  mounted() {
    this.depotContainer() //容器列表
  },
  methods: {
    //获取容器列表
    async depotContainer() {
      let res = await depotContainer({})
      this.containerList = res.data
    },
    //changeContainer 改变容器
    changeContainer(value) {
      //找到对应的value
      this.containerList.forEach(e => {
        if (e.code == value) {
          this.containerPrefix = e.value
        }
      })
    },
    // 新增容器
    async createContainer() {
      if (!this.containerPrefix) {
        this.$message.error('请选择新增容器前缀！')
        return ''
      }

      if (!this.containerCount) {
        this.$message.error('请填写新增容器数量！')
        return ''
      }

      this.close()

      let res = await createContainer({
        count: this.containerCount,
        prefix: this.containerPrefix
      })
      if (res.code == 201) {
        this.$message.success('成功创建容器！')
        this.disCreateContain = false
        this.changeFilter()
        this.containerCurrent = this.containerCount = this.containerPrefix = ''
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
