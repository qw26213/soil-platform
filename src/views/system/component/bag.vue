<template>
  <div style="margin-top:-30px">
    <div class="filterDiv" style="padding-top:0px">
      <span class>采土袋数量：</span>
      <el-input-number v-model="count" size="mini" :min="0" :max="1000" label="数量"></el-input-number>
      <span style="color:#666;font-size:12px;margin-left:3px">(可输入)</span>
      <el-button type="primary" style="margin-left:20px" size="small" @click="save">确定创建</el-button>
    </div>
    <div class="back_ffffff bor_rad_8 pad_top_14 pad_lef_14 mar_top_10">
      <div class="pad_top_8">
        <el-table :cell-style="cellStyle" :data="tableData" resize :header-cell-style="headerCellStyle">
          <el-table-column prop="create_date" label="创建日期" align="center" />
          <el-table-column prop="create_time" label="创建时间" align="center" />
          <el-table-column prop="counts" label="创建数量" align="center" />
          <el-table-column prop="creater" label="创建人" align="center" />
        </el-table>
      </div>
    </div>
  </div>
</template>
<script>
import { get_city } from '@/api/collect.js'
import { create_bag, bag_list } from '@/api/system'
export default {
  data() {
    return {
      tableData: [],
      count: 0,
      start: 1,
      page_rows: 10
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    resetForm() {
      this.count = ''
    },
    getData() {
      const obj = {
        start: this.start - 1,
        page_rows: this.page_rows
      }
      bag_list(obj).then(res => {
        if (res.code === 201) {
          this.tableData = res.data
        }
      })
    },
    save() {
      if (this.count === '') {
        this.$message.warning('请输入采土袋数量')
      }
      if (this.count === 0) {
        this.$message.warning('采土袋数量必须大于0')
      }
      const count = this.count
      create_bag(count).then(res => {
        if (res.code === 201) {
          this.resetForm()
          this.getData()
          this.$message.success('成功创建了' + count + '个土袋')
        }
      })
    },
    cellStyle(row, column, rowIndex, columnIndex) {
      return row.columnIndex == '5' ? 'color: #7BDD92;' : ''
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
<style scoped>
.maxHigh {
  min-height: calc(100vh - 120px);
}

.inputWidth {
  width: 120px;
}

.phoneWidth {
  width: 160px;
  margin-right: 10px;
}

.areaWidth {
  width: 200px;
}

.yellow {
  background-color: #ffca00;
  border: 1px solid #ffca00;
}
</style>