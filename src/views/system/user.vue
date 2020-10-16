<template>
  <div class="mainPage">
    <div class="filterDiv">
      <span class>选择区域：</span>
      <el-select v-model="province" size="mini" class="phoneWidth" @change="changeProvince()" placeholder="省(直辖市)：">
        <el-option v-for="e in provinceList" :key="e.code" :label="e.name" :value="e.code" />
      </el-select>
      <el-select v-model="city" size="mini" class="phoneWidth" @change="changeCity()" placeholder="市：">
        <el-option v-for="e in cityList" :key="e.code" :label="e.name" :value="e.code" />
      </el-select>
      <el-select v-model="county" size="mini" class="phoneWidth" @change="changeCounty()" placeholder="区(县)：">
        <el-option v-for="e in countyList" :key="e.code" :label="e.name" :value="e.code" />
      </el-select>
      <el-select v-model="town" size="mini" class="phoneWidth" @change="changeTown()" placeholder="镇乡：">
        <el-option v-for="e in townList" :key="e.code" :label="e.name" :value="e.code" />
      </el-select>
      <el-button type="primary" size="mini" @click="getList">查询</el-button>
    </div>
    <div class="contentDiv">
      <div class="pad_top_8">
        <el-table :data="tableData" resize :header-cell-style="headerCellStyle">
          <el-table-column type="index" label="序号" align="center" />
          <el-table-column prop="user_name" label="用户名" align="center" />
          <el-table-column prop="user_phone" label="手机号" align="center" />
          <el-table-column prop="user_name" label="注册地" align="center" />
          <el-table-column prop="user_role" label="角色" align="center" />
          <el-table-column prop="task_count" label="任务完成数" align="center" />
          <el-table-column prop="user_date" label="注册日期" align="center" />
        </el-table>
      </div>
    </div>
    <div v-if="totalPage>10" class="block mar_top_10 mar_bot_0">
      <el-pagination
        layout="total,prev, pager, next"
        :page-size="pageSize"
        :total="totalPage"
        :current-page.sync="page"
        @prev-click="prevClick"
        @next-click="nextClick"
        @current-change="currentChange"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
import { get_city } from '@/api/collect.js'
export default {
  data() {
    return {
      tableData: [
        {
          user_name: '张三',
          user_role: '系统管理员',
          user_phone: 15011532730,
          user_date: '2020-09-26',
          task_count: 1000
        },
        {
          user_name: '李四',
          user_role: '系统管理员',
          user_phone: 15011532730,
          user_date: '2020-09-26',
          task_count: 1000
        },
        {
          user_name: '李四',
          user_role: '系统管理员',
          user_phone: 15011532730,
          user_date: '2020-09-26',
          task_count: 1000
        },
        {
          user_name: '张三',
          user_role: '系统管理员',
          user_phone: 15011532730,
          user_date: '2020-09-26',
          task_count: 1000
        },
        {
          user_name: '张三',
          user_role: '系统管理员',
          user_phone: 15011532730,
          user_date: '2020-09-26',
          task_count: 1000
        }
      ],
      // 分页
      page: 1,
      pageSize: 10,
      totalPage: 0,
      // 多级联动的参数
      // 省市级选择
      provinceList: [],
      province: '',
      // 市级
      cityList: [],
      city: '',
      // 县级
      countyList: [],
      county: '',
      // 镇
      townList: [],
      town: ''
    }
  },
  mounted() {
    this.getProvince()
  },
  methods: {
    getList() {
      this.page = 1
      this.getVolunteerList()
    },
    async getProvince() {
      let res = await get_city({})
      this.provinceList = res.data
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