<template>
  <div style="margin-top:-30px">
    <div class="filterDiv" style="padding-top:0px">
      <div class="width:900px;float:left">
        <span class>选择区域：</span>
        <el-select v-model="province" size="mini" filterable class="phoneWidth" @change="changeProvince()" placeholder="省(直辖市)：">
          <el-option v-for="e in provinceList" :key="e.code" :label="e.name" :value="e.code"></el-option>
        </el-select>
        <el-select v-model="city" size="mini" filterable class="phoneWidth" @change="changeCity()" placeholder="市：">
          <el-option v-for="e in cityList" :key="e.code" :label="e.name" :value="e.code"></el-option>
        </el-select>
        <el-select v-model="county" size="mini" filterable class="phoneWidth" @change="changeCounty()" placeholder="区(县)：">
          <el-option v-for="e in countyList" :key="e.code" :label="e.name" :value="e.code"></el-option>
        </el-select>
        <el-select v-model="town" size="mini" filterable class="phoneWidth" @change="changeTown()" placeholder="镇乡：">
          <el-option v-for="e in townList" :key="e.code" :label="e.name" :value="e.code"></el-option>
        </el-select>
        <el-select v-model="village" size="mini" filterable class="phoneWidth" @change="changeVillage()" placeholder="村：">
          <el-option v-for="e in villageList" :key="e.code" :label="e.name" :value="e.code"></el-option>
        </el-select>
        <br />
        <span class="warehouse">实验室选择：</span>
        <el-select v-model="village" size="mini" filterable class="phoneWidth" @change="changeVillage()" placeholder="实验室选择：">
          <el-option v-for="e in villageList" :key="e.code" :label="e.name" :value="e.code"></el-option>
        </el-select>
        <span class="warehouse">实验室：{{ deport_name }}</span>
      </div>
      <el-button type="primary" class="saveBtn" size="small" @click="save">保存并继续创建</el-button>
    </div>
    <div class="contentDiv">
      <el-table :cell-style="cellStyle" :data="tableData" resize :header-cell-style="headerCellStyle">
        <el-table-column prop="id" label="实验室ID" width="130">
          <template slot-scope="{row}">
            <input type="text" class="inputCell" v-model="row.deport_name" />
          </template>
        </el-table-column>
        <el-table-column prop="id" label="实验室名称" width="130">
          <template slot-scope="{row}">
            <input type="text" class="inputCell" v-model="row.deport_name" />
          </template>
        </el-table-column>
        <el-table-column prop="user_address" label="邮寄地址">
          <template slot-scope="{row}">
            <input type="text" class="inputCell" v-model="row.deport_area" />
          </template>
        </el-table-column>
        <el-table-column prop="task_perform_count" label="联系人" width="120" align="center">
          <template slot-scope="{row}">
            <input type="text" class="inputCell" v-model="row.deport_concater" />
          </template>
        </el-table-column>
        <el-table-column prop="task_perform_count" label="联系人电话" width="160" align="center">
          <template slot-scope="{row}">
            <input type="text" class="inputCell" v-model="row.deport_concaterPhone" />
          </template>
        </el-table-column>
        <el-table-column prop="task_perform_count" label="录入日期" width="150" align="center">
          <template slot-scope="{row}">
            <input type="text" class="inputCell" v-model="row.create_time" />
          </template>
        </el-table-column>
        <el-table-column prop="task_perform_count" label="备注" width="120" align="center">
          <template slot-scope="{row}">
            <input type="text" class="inputCell" v-model="row.creater" />
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import { get_city } from '@/api/collect.js'
import { deport_name, create_deport } from '@/api/system'
export default {
  data() {
    return {
      tableData: [{}],
      provinceList: [],
      province: '',
      cityList: [],
      city: '',
      countyList: [],
      county: '',
      townList: [],
      town: '',
      villageList: [],
      village: '',
      deport_name: '********'
    }
  },
  mounted() {
    this.getProvince()
  },
  methods: {
    save() {
      const len = this.tableData.length
      const obj = this.tableData[len - 1]
      create_deport(obj).then(res => {
        if (res.code === 201) {
          this.resetForm()
          this.$message.success('成功创建了一个仓库')
        }
      })
    },
    resetForm() {
      this.tableData.push({})
      this.province = ''
      this.cityList = []
      this.city = ''
      this.countyList = []
      this.county = ''
      this.townList = []
      this.town = ''
      this.villageList = []
      this.village = ''
    },
    async getProvince() {
      let res = await get_city({})
      this.provinceList = res.data
    },
    getdeport_name(code) {
      deport_name(code).then(res => {
        if (res.code === 201) {
          this.deport_name = res.data
          const len = this.tableData.length
          this.$set(this.tableData[len - 1], 'deport_name', res.data)
        }
      })
    },
    // 改变了省级
    async changeProvince() {
      this.getdeport_name({ top_area: this.province })
      this.cityList = this.countyList = this.townList = this.villageList = []
      this.city = this.county = this.town = this.village = ''
      let res = await get_city({
        parent_id: this.province
      })
      this.cityList = res.data
    },
    // 改变了市级
    async changeCity() {
      this.countyList = this.townList = this.villageList = []
      this.county = this.town = this.village = ''
      let res = await get_city({
        parent_id: this.city
      })
      this.countyList = res.data
    },
    // 改变了县级
    async changeCounty() {
      this.townList = this.villageList = []
      this.town = this.village = ''
      let res = await get_city({
        parent_id: this.county
      })
      this.townList = res.data
    },
    // 改变了镇级
    async changeTown() {
      this.villageList = []
      this.village = ''
      let res = await get_city({
        parent_id: this.town
      })
      this.villageList = res.data
    },
    // 改变了村级
    async changeVillage() {
      // 确认了村级 可以进行地图飞行了
    },
    cellStyle(row, column, rowIndex, columnIndex) {
      return row.columnIndex == '5' ? 'color: #7BDD92;' : ''
    },
    headerCellStyle() {
      return 'color:#333333;'
    }
  }
}
</script>
<style lang="scss" scoped>
/deep/.tdCell {
  padding: 0 !important;
  .cell {
    padding: 0 !important;
  }
}
</style>
<style scoped>
.maxHigh {
  min-height: calc(100vh - 120px);
}

.inputWidth {
  width: 120px;
}

.warehouse {
  margin-top: 10px;
  display: inline-block;
}

.inputCell {
  display: block;
  width: 100%;
  height: 40px;
  border: 1px #ccc solid;
  padding-left: 6px;
  padding-right: 6px;
  box-sizing: border-box;
}

.saveBtn {
  position: absolute;
  top: 20px;
  right: 20px;
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