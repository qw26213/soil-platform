<template>
  <div style="margin-top:-30px">
    <div class="filterDiv" style="padding-top:0px">
      <span class="label">仓库选择：</span>
      <el-select v-model="deportCurrent" size="mini" class="phoneWidth" placeholder="请选择仓库" @change="changeVal">
        <el-option v-for="e in depotList" :key="e.code" :label="e.name" :value="e.code" />
      </el-select>
      <span class="label">批次：</span>
      <el-select v-model="batchCurrent" size="mini" class="phoneWidth" @change="changeFilterKey()" placeholder="全部时间">
        <el-option v-for="e in batchList" :key="e" :label="e" :value="e" />
      </el-select>
      <span class="label">采土年份：</span>
      <el-select v-model="yearCurrent" size="mini" class="phoneWidth" @change="changeFilterKey()" placeholder="全部类型">
        <el-option v-for="e in yearList" :key="e" :label="e" :value="e" />
      </el-select>
      <span class="label">采土地址：</span>
      <el-select v-model="areaCurrent" size="mini" class="phoneWidth" @change="changeFilterKey()" placeholder="全部人员">
        <el-option v-for="e in areaList" :key="e.code" :label="e.name" :value="e.code"></el-option>
      </el-select>
      <span class="label">采集人：</span>
      <el-select v-model="collectorCurrent" size="mini" class="phoneWidth" @change="changeFilterKey()" placeholder="全部人员">
        <el-option v-for="e in collectorList" :key="e.code" :label="e.name" :value="e.code"></el-option>
      </el-select>
      <el-radio-group v-model="radio1" :border="true" size="mini" @change="changeFilterKey()">
        <el-radio-button :label="0">送检</el-radio-button>
        <el-radio-button :label="1">已检</el-radio-button>
      </el-radio-group>
    </div>
    <div class="contentDiv">
      <div class="pad_top_8">
        <el-table :data="tableData" style="width: 100%" :header-cell-style="headerCellStyle">
          <el-table-column prop="user_name" label="采集人" />
          <el-table-column prop="bag_code" label="采土袋编码" show-overflow-tooltip />
          <el-table-column prop="batch_code" label="批次ID" show-overflow-tooltip />
          <el-table-column prop="shelf_code" label="货架" />
          <el-table-column prop="place_code" label="架位" />
          <el-table-column prop="box_code" label="盒(格子)" />
          <el-table-column prop="task_count" label="送检" />
          <el-table-column prop="user_address" label="已检" />
          <el-table-column prop="area_name" label="采土地址" show-overflow-tooltip />
          <el-table-column prop="task_count" label="采土年份" />
        </el-table>
        <pagination v-if="totalPage>10" :total="totalPage" :page.sync="page" :limit.sync="pageSize" @pagination="getSearchSample" />
      </div>
    </div>
  </div>
</template>
<script>
import {
  depotList,
  searchSample,
  batch_years,
  batch_query,
  area_query,
  collector_query,
  deport_container,
  deport_sample
} from '@/api/collect.js'
import Pagination from '@/components/Pagination'
export default {
  components: {
    Pagination
  },
  data() {
    return {
      radio1: 1,
      tableData: [],
      activeTab: '0',
      //  仓库列表
      depotList: [],
      deportCurrent: '',
      //分页
      page: 1,
      pageSize: 10,
      totalPage: 0,
      // 采土年份
      yearList: [2019, 2020, 2021, 2022],
      yearCurrent: '',
      // 批次列表
      batchList: [],
      batchCurrent: '',
      // 采土地址
      areaList: [],
      areaCurrent: '',
      // 采集人
      collectorList: [],
      collectorCurrent: '',
      // 分页类型
      pageType: 1,
      // 货架使用情况
      use_shelf: '',
      // 样本使用情况
      use_container: '',
      // 容器使用情况
      use_sample: '',
      // 城市筛选
      cityCode: '',
      deportCurrent: ''
    }
  },
  mounted() {
    this.getDepotList()
  },
  methods: {
    // 货架使用情况
    async getShelfUseDetails() {
      let shelf = await deport_shelf({
        deport_code: this.deportCurrent
      })
      if (shelf.code == 201) {
        this.use_shelf = shelf.data
      }
    },
    // 容器使用情况
    async getContainerUseDetails() {
      let container = await deport_container({
        deport_code: this.deportCurrent
      })
      if (container.code == 201) {
        this.use_container = container.data
      }
    },
    // 样本使用情况
    async getSampleUseDetails() {
      let sample = await deport_sample({
        deport_code: this.deportCurrent
      })
      if (sample.code == 201) {
        this.use_sample = sample.data
      }
    },
    changeVal(val) {
      if (val) {
        this.getSearchSample()
      }
    },
    // 获取仓库列表
    async getDepotList() {
      let res = await depotList({})
      this.depotList = res.data
      this.deportCurrent = this.depotList[0].code
      this.getSearchSample() //获取仓库查询table
      this.getBatch_query() //批次列表
      this.getArea_query() //采土地址
      this.getCollector_query() //  采集人
      this.getSampleUseDetails() // 样本使用情况
      // this.getBatch_years() //采土年份
    },
    // 样本查询
    async getSearchSample() {
      let res = await searchSample({
        deport_code: this.deportCurrent,
        area_code: '',
        year: this.yearCurrent,
        batch_code: this.batchCurrent,
        mining_area: this.areaCurrent,
        collector: this.collectorCurrent,
        status: this.radio1, // 0-送检 1-已检
        start: this.page - 1,
        page_rows: this.pageSize
      })
      this.tableData = res.data
      this.totalPage = res.count
    },
    //  采土年份
    async getBatch_years() {
      let res = await batch_years({
        deport_code: this.deportCurrent,
        area_code: ''
      })
      this.yearList = res.data
    },
    //  批次列表
    async getBatch_query() {
      let res = await batch_query({
        deport_code: this.deportCurrent,
        area_code: ''
      })
      this.batchList = res.data
    },
    //  采土地址
    async getArea_query() {
      let res = await area_query({
        deport_code: this.deportCurrent,
        area_code: ''
      })
      this.areaList = res.data
    },
    //  采集人
    async getCollector_query() {
      let res = await collector_query({
        deport_code: this.deportCurrent,
        area_code: ''
      })
      this.collectorList = res.data
    },
    // key条件有更改
    changeFilterKey() {
      this.page = 1
      this.getSearchSample()
    },
    headerCellStyle() {
      return 'color:#333333;'
    },
    toPage(url) {
      this.$router.push(url)
    }
  }
}
</script>
<style lang="scss" scoped>
.maxHigh {
  min-height: calc(100vh - 120px);
}
.phoneWidth {
  width: 140px;
}

.el-tabs--border-card {
  background: #fff;
  border: 1px solid #dcdfe6;
  box-shadow: none !important;
  border-radius: 10px;
}
</style>