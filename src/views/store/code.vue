<template>
  <div class="mainPage">
    <div class="filterDiv">
      <span class>仓库选择：</span>
      <el-select v-model="depotCurrent" size="mini" class="phoneWidth" @change="changeFilter()" placeholder="请选择仓库">
        <el-option v-for="e in depotList" :key="e.code" :label="e.name" :value="e.code" />
      </el-select>
      <span class>类型：</span>
      <el-select v-model="depotTypeCurrent" size="mini" class="phoneWidth" @change="changeFilter()" placeholder="全部类型">
        <el-option v-for="e in depotTypeList" :key="e.code" :label="e.value" :value="e.code" />
      </el-select>
      <span class>生成时间：</span>
      <el-date-picker size="mini" v-model="createTime" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" class="phoneWidth" @change="changeFilter()" />
      <span class>创建人：</span>
      <el-select v-model="depotCreaterCurrent" size="mini" class="phoneWidth" @change="changeFilter()" placeholder="全部人员">
        <el-option v-for="e in depotCreaterList" :key="e.code" :label="e.value" :value="e.code" />
      </el-select>
      <!-- <el-button type="normal" size="mini" @click="clearSelect()">重置</el-button> -->
      <div @click="disCreateShelf = true" class="btnStyle btn1">
        <span class="img"></span>
        <span>创建货架</span>
      </div>
      <div @click="disCreateBox = true" class="btnStyle btn2">
        <span class="img"></span>
        <span>创建盒子</span>
      </div>
      <div @click="disCreateContain = true" class="btnStyle btn3">
        <span class="img"></span>
        <span>创建容器</span>
      </div>
      <el-button type="primary" :disabled="!canExcel" style="float:right" size="mini" plain @click="toExportExcel">导出EXCEL</el-button>
    </div>
    <div class="contentDiv">
      <el-table :cell-style="cellStyle" :data="tableData" style="width: 100%;" :header-cell-style="headerCellStyle" @selection-change="handleSelectionChange">
        >
        <el-table-column type="selection" :selectable="checkSelectable" width="55" />
        <el-table-column prop="name" label="赋码类型" />
        <el-table-column prop="numbers" label="赋码数量" />
        <el-table-column prop="rows" label="行" />
        <el-table-column prop="columns" label="列" />
        <el-table-column prop="creater" label="创建人" />
        <el-table-column prop="update_time" label="生成时间" />
        <el-table-column width="80">
          <template slot-scope="{row}">
            <el-button type="text" @click="toPage(`/warehouse/codedetail?id=${row.code}&type=${row.type}&name=${row.name}`)">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-if="totalPage>10" :total="totalPage" :page.sync="page" :limit.sync="pageSize" @pagination="getDepotCodeList" />
    </div>
    <!-- 创建货架 -->
    <el-dialog :visible.sync="disCreateShelf" top="18vh" width="600px" :center="true">
      <!-- 创建货架组件 仓库code name 关闭弹窗close方法 -->
      <addShelf :depotCurrent="depotCurrent" :depotName="depotName" @close="disCreateShelf = false"></addShelf>
    </el-dialog>
    <!-- 创建容器 -->
    <el-dialog :visible.sync="disCreateContain" top="18vh" width="600px" :center="true">
      <addContainer :depotCurrent="depotCurrent" :depotName="depotName" @close="disCreateContain = false"></addContainer>
    </el-dialog>
    <!-- 创建盒子 -->
    <el-dialog :visible.sync="disCreateBox" top="18vh" width="600px" :center="true">
      <!-- 创建盒子组件 仓库code name 关闭弹窗close方法 -->
      <addBox :depotCurrent="depotCurrent" :depotName="depotName" @close="disCreateBox = false"></addBox>
    </el-dialog>
  </div>
</template>
<script>
import {
  depotList,
  depotContainer,
  depotCodeList,
  createBox,
  createContainer,
  depotType,
  depotCreater,
  exportExcel
} from '@/api/collect.js'
import addShelf from './components/addShelf.vue'
import addBox from './components/addBox.vue'
import addContainer from './components/addContainer.vue'
import Pagination from '@/components/Pagination'
export default {
  components: {
    addShelf,
    addBox,
    addContainer,
    Pagination
  },
  data() {
    return {
      //赋码列表table
      tableData: [],
      // 分页
      page: 1,
      pageSize: 8,
      totalPage: 0,
      // 创建货架dislog
      disCreateShelf: false,
      // 创建容器
      disCreateContain: false,
      // 创建容器
      disCreateBox: false,
      // 仓库列表
      depotList: [],
      depotCurrent: '',
      depotName: '',
      // 类型列表
      depotTypeList: [],
      depotTypeCurrent: '',
      //生成时间
      createTime: '',
      // 创建人列表
      depotCreaterList: [],
      depotCreaterCurrent: '',
      //多选框结果数组
      selectList: [],
      // 是否可以导出
      canExcel: false,

      // 创建按钮
      shelfImg: true,
      boxImg: true,
      containerImg: true
    }
  },
  mounted() {
    this.getDepotList() //仓库列表
    this.getDepotType() //类型列表
    this.getDepotCreater() //创建人列表
  },
  methods: {
    //更改多选框
    handleSelectionChange(e) {
      console.log(e)
      this.selectList = e
      if (e.length > 0) {
        this.canExcel = true
      } else {
        this.canExcel = false
      }
    },
    //  更改所有的过滤选项
    changeFilter() {
      this.page = 1
      this.getDepotCodeList()
    },
    // 获取仓库列表
    async getDepotList() {
      let res = await depotList({})
      this.depotList = res.data
      this.depotCurrent = res.data[0].code
      this.depotName = res.data[0].name
      this.getDepotCodeList() //table
    },
    // 获取类型列表
    async getDepotType() {
      let res = await depotType({})
      this.depotTypeList = res.data
    },
    // 获取生成人列表
    async getDepotCreater() {
      let res = await depotCreater({})
      this.depotCreaterList = res.data
    },
    //导出excel
    async toExportExcel() {
      let codes = []
      this.selectList.map(e => {
        codes.push(e.code + '_' + e.type)
      })
      console.log(codes)
      let res = await exportExcel({
        codes: codes.join(',')
      })

      let a = document.createElement('a')
      a.href = res.data
      a.click()

      this.getDepotCodeList() //不改变分页的获取新table
    },
    // 获取赋码管理的列表
    async getDepotCodeList() {
      let res = await depotCodeList({
        type: this.depotTypeCurrent,
        creater: this.depotCreaterCurrent,
        create_time: this.createTime,
        deport_code: this.depotCurrent,
        start: this.page - 1,
        page_rows: this.pageSize
      })
      if (res.code == 201) {
        this.tableData = res.data
        this.totalPage = res.count
      } else {
        this.$message.success(res.msg)
      }
    },
    //重置筛选条件
    clearSelect() {
      this.depotTypeCurrent = this.depotCreaterCurrent = this.createTime = ''
      this.page = 1
      this.getDepotCodeList()
    },
    //多选框禁用
    checkSelectable(row) {
      return row.status != '1'
    },
    //导出过的浅色
    cellStyle(row, column, rowIndex, columnIndex) {
      return row.row.status == '1' ? 'color: #c7c8ca;' : ''
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
  min-height: calc(100vh - 60px);
}
.phoneWidth {
  width: 140px;
}
.yellow {
  background-color: #ffca00;
  border: 1px solid #ffca00;
}

.huojia {
  width: 18px;
  height: 18px;
}

.textWidth {
  width: 310px;
  margin-bottom: 10px;
  margin: 10px auto;
}

.inputWidth {
  width: 200px;
}

.borderBlue {
  border-top: 1px solid #5381ff;
  border-bottom: 1px solid #5381ff;
}

.shlef {
  width: 18px;
  height: 18px;
}

.box {
  width: 20px;
  height: 20px;
}

.btnStyle {
  width: 100px;
  height: 28px;
  line-height: 28px;
  border-radius: 4px;
  padding: 0 10px;
  color: #fff;
  font-size: 13px;
  cursor: pointer;
  box-sizing: border-box;
  color: #409eff;
  display: inline-block;
  background: #ecf5ff;
  border-color: #b3d8ff;
  border: 1px solid #409eff;
  margin-left: 10px;
}

.btnStyle:hover {
  background-color: #409eff;
  color: #ffffff;
}
.btnStyle span.img {
  width: 16px;
  height: 16px;
  display: inline-block;
  vertical-align: middle;
}
.btnStyle span {
  vertical-align: middle;
}
.btn1 span.img {
  background: url(../../assets/blue_shelf.png) no-repeat center center;
  background-size: contain;
}
.btn1:hover span.img {
  background: url(../../assets/blue_shelf_on.png) no-repeat center center;
  background-size: contain;
}
.btn2 span.img {
  background: url(../../assets/blue_box.png) no-repeat center center;
  background-size: contain;
}
.btn2:hover span.img {
  background: url(../../assets/blue_box_on.png) no-repeat center center;
  background-size: contain;
}
.btn3 span.img {
  background: url(../../assets/blue_ping.png) no-repeat center center;
  background-size: contain;
}
.btn3:hover span.img {
  background: url(../../assets/blue_ping_on.png) no-repeat center center;
  background-size: contain;
}
</style>