<template>
  <div>
    <!-- 样本详情 -->
    <div v-show="info.type == 1">
      <div class="fon_14">
        接收人：
        <span class="col_5381ff">{{info.name}}</span>
      </div>
      <el-table :data="tableData" style="width: 100%;margin-top:10px" border resize size="mini">
        <el-table-column type="index" align="center" label="#" width="50" />
        <el-table-column prop="code" align="center" label="采样袋" width="160" />
        <el-table-column align="center" label="接收时间" width>
          <template slot-scope="scope">
            <span>{{scope.row.value}}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 样盒详情 -->
    <div v-show="info.type == 2">
      <div class="fon_14">
        装盒人：
        <span class="col_5381ff">{{info.name}}</span>
      </div>
      <el-table :data="tableData" style="width: 100%;margin-top:10px" border resize size="mini">
        <el-table-column type="index" align="center" label="#" width="50" />
        <el-table-column prop="bag_code" align="center" label="采样袋" width="160" />
        <el-table-column prop="box_code" align="center" label="盒子编码" width />
        <el-table-column prop="box_place" align="center" label="格子编码" width />
        <el-table-column align="center" label="接收时间" width>
          <template slot-scope="{row}">
            <span>{{ row.update_time }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 架子详情 -->
    <div v-show="info.type == 3" top="18vh" :center="true">
      <div class="fon_14">
        装盒人：
        <span class="col_5381ff">{{info.name}}</span>
      </div>
      <el-table :data="tableData" style="width: 100%;margin-top:10px" border resize size="mini">
        <el-table-column type="index" align="center" label="#" width="50" />
        <el-table-column prop="bag_code" align="center" label="采样袋" width="160" />
        <el-table-column prop="shelf_code" align="center" label="架子编码" width />
        <el-table-column prop="shelf_place" align="center" label="架位编码" width />
        <el-table-column prop="box_code" align="center" label="盒子编码" width />
        <el-table-column align="center" label="接收时间" width>
          <template slot-scope="{row}">
            <span>{{row.update_time}}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div class="block mar_top_10 mar_bot_0">
      <pagination v-if="totalPage>10" :total="totalPage" :page.sync="page" :limit.sync="pageSize" @pagination="getDeportDetail" />
    </div>
  </div>
</template>
<script>
import { deportDetail, depotList } from '@/api/collect.js'
export default {
  props: ['info'],
  data() {
    return {
      // 详情数组
      tableData: [],
      //分页
      page: 1,
      pageSize: 10,
      totalPage: 0
    }
  },
  mounted() {
    this.getDeportDetail()
  },
  methods: {
    //入库管理详情
    async getDeportDetail() {
      let res = await deportDetail({
        type: this.info.type,
        operator: this.info.operator,
        operate_time: this.info.operate_time,
        deport_code: this.info.depotCurrent,
        start: this.page - 1,
        page_rows: this.pageSize
      })
      //添加 index
      let index = 1 + this.page * this.pageSize
      res.data.map(e => {
        e.index = index
        index++
      })
      console.log(res.data)
      this.tableData = res.data
      this.totalPage = res.count
    },
    // 上一页
    prevClick() {
      console.log('上一页')
      this.page--
      this.getDeportDetail()
    },
    // 下一页
    nextClick() {
      console.log('下一页')
      this.page++
      this.getDeportDetail()
    },
    // 当前页面被点击
    currentChange(index) {
      console.log('当前页面被点击')
      this.page = --index
      this.getDeportDetail()
    },
    headerCellStyle() {
      return 'color:#333333;'
    }
  }
}
</script>
<style lang="scss" scoped>
</style>