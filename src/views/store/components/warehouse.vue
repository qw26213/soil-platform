<template>
  <div style="margin-top:-30px">
    <div class="filterDiv" style="padding-top:0px">
      <span>仓库选择：</span>
      <el-select v-model="selectedVal" size="mini" class="phoneWidth" placeholder="请选择仓库" @change="changeVal">
        <el-option v-for="e in depotList" :key="e.code" :label="e.name" :value="e.code" />
      </el-select>
    </div>
    <div class="contentDiv">
      <div class="pad_top_8">
        <el-table :data="tableData" style="width: 100%" :header-cell-style="headerCellStyle">
          <el-table-column prop="deport_name" label="仓库名称" />
          <el-table-column prop="counts" label="总容量" />
          <el-table-column prop="reserve" label="当前库存" />
          <el-table-column prop="on_shelf" label="架上" />
          <el-table-column prop="un_shelf" label="未上架" />
          <el-table-column prop="sample" label="分样" />
          <el-table-column prop="lave" label="余量" />
        </el-table>
        <pagination v-if="totalPage>10" :total="totalPage" :page.sync="page" :limit.sync="pageSize" @pagination="getDeport_v2" />
      </div>
    </div>
  </div>
</template>
<script>
import {
  depotList,
  searchShelf,
  searchContainer,
  searchSample,
  batch_years,
  batch_query,
  area_query,
  collector_query,
  deport_container,
  deport_sample,
  deport_shelf,
  deport_v2
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
      depotCurrent: '',
      //分页
      page: 1,
      pageSize: 10,
      totalPage: 0,
      // 采土年份
      yearList: [],
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
      selectedVal: ''
    }
  },
  mounted() {
    this.getDepotList()
  },
  methods: {
    // 货架使用情况
    async getShelfUseDetails() {
      let shelf = await deport_shelf({
        deport_code: this.depotCurrent
      })
      if (shelf.code == 201) {
        this.use_shelf = shelf.data
      }
    },
    // 容器使用情况
    async getContainerUseDetails() {
      let container = await deport_container({
        deport_code: this.depotCurrent
      })
      if (container.code == 201) {
        this.use_container = container.data
      }
    },
    // 样本使用情况
    async getSampleUseDetails() {
      let sample = await deport_sample({
        deport_code: this.depotCurrent
      })
      if (sample.code == 201) {
        this.use_sample = sample.data
      }
    },
    changeVal(val) {
      if (val) {
        this.getDeport_v2()
      }
    },
    // 获取仓库列表
    async getDepotList() {
      let res = await depotList({})
      this.depotList = res.data
      // this.depotCurrent = res.data[0].code
      this.getDeport_v2() //获取仓库查询table
    },
    // 仓库查询
    async getDeport_v2() {
      let res = await deport_v2({
        deport_code: this.selectedVal,
        area_code: '',
        start: this.page - 1,
        page_rows: this.pageSize
      })
      this.tableData = res.data
      this.totalPage = res.count
    },
    //货架查询
    async getSearchShelf() {
      let res = await searchShelf({
        deport_code: this.selectedVal,
        area_code: '',
        start: this.page - 1,
        page_rows: this.pageSize
      })
      this.tableData = res.data
      this.totalPage = res.count
    },
    //容器查询
    async getSearchContainer() {
      let res = await searchContainer({
        deport_code: this.selectedVal,
        area_code: ''
      })
      this.tableData = res.data
    },
    // 样本查询
    async getSearchSample() {
      let res = await searchSample({
        deport_code: this.selectedVal,
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
        deport_code: this.depotCurrent,
        area_code: ''
      })
      this.yearList = res.data
    },
    //  批次列表
    async getBatch_query() {
      let res = await batch_query({
        deport_code: this.depotCurrent,
        area_code: ''
      })
      this.batchList = res.data
    },
    //  采土地址
    async getArea_query() {
      let res = await area_query({
        deport_code: this.depotCurrent,
        area_code: ''
      })
      this.areaList = res.data
    },
    //  采集人
    async getCollector_query() {
      let res = await collector_query({
        deport_code: this.depotCurrent,
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

.el-tabs--border-card {
  background: #fff;
  border: 1px solid #dcdfe6;
  box-shadow: none !important;
  border-radius: 10px;
}
</style>