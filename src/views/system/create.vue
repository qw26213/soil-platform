<template>
  <div class="mainPage">
    <div class="filterDiv">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="创建实验室" name="2" />
        <el-tab-pane label="创建仓库" name="0" />
        <el-tab-pane label="创建采土袋" name="1" />
      </el-tabs>
    </div>

    <!-- 创建仓库 -->
    <div v-show="activeTab == 0">
      <warehouse />
    </div>

    <!-- 创建采土袋 -->
    <div v-show="activeTab == 1">
      <bag />
    </div>

    <!-- 创建实验室 -->
    <div v-show="activeTab == 2">
      <laboratory />
    </div>
  </div>
</template>

<script>
import warehouse from './component/warehouse'
import bag from './component/bag'
import laboratory from './component/laboratory'
export default {
  components: { warehouse, bag, laboratory },
  data() {
    return {
      activeTab: '2'
    }
  },
  methods: {}
}
</script>
