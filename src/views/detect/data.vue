<template>
  <div class="mainPage" style="min-width: 1200px;">
    <div class="filterDiv">
      <div class="flex ali_center">
        <span>所在区域：</span>
        <el-select v-model="province" size="mini" class="phoneWidth" @change="changeProvince()" placeholder="省">
          <el-option v-for="item in provinceList" :key="item.code" :label="item.name" :value="item.code" />
        </el-select>
        <el-select v-model="city" size="mini" class="phoneWidth" @change="changeCity()" placeholder="市">
          <el-option v-for="item in cityList" :key="item.code" :label="item.name" :value="item.code" />
        </el-select>
        <el-select v-model="county" size="mini" class="phoneWidth" @change="changeCounty()" placeholder="县">
          <el-option v-for="item in countyList" :key="item.code" :label="item.name" :value="item.code" />
        </el-select>
        <el-select v-model="town" size="mini" class="phoneWidth" @change="changeTown()" placeholder="镇乡">
          <el-option v-for="item in townList" :key="item.code" :label="item.name" :value="item.code" />
        </el-select>
        <!-- <el-select v-model="village" size="mini" class="phoneWidth" @change="changeVillage()" placeholder="村 ：">
                    <el-option v-for="e in villageList" :key="item.code" :label="item.name" :value="item.code" />
        </el-select>-->
        <span>仓库：</span>
        <div>
          <el-select v-model="deport_code" size="mini" class="phoneWidth" placeholder="请选择仓库" @change="getBatch">
            <el-option v-for="item in deport_list" :key="item.code" :label="item.name" :value="item.code" />
          </el-select>
        </div>
      </div>
      <div class="flex ali_center" style="margin-top:10px">
        <span>批次号：</span>
        <el-select v-model="batch_code" filterable size="mini" class="phoneWidth" style="width:200px" placeholder="全部">
          <el-option v-for="(item,index) in batch_list" :key="index" :label="item" :value="item" />
        </el-select>
        <div>
          <span>年份：</span>
          <el-date-picker size="mini" v-model="year" type="year" placeholder="选择年份" value-format="yyyy" class="phoneWidth" />
        </div>
        <span>采集人员：</span>
        <el-select v-model="collector" filterable size="mini" class="phoneWidth" placeholder="全部">
          <el-option v-for="item in collector_list" :key="item.id" :label="item.user_name" :value="item.id" />
        </el-select>
        <el-button type="primary" size="mini" @click="getData()">查询</el-button>
      </div>
    </div>
    <!-- 穿梭框 -->
    <div class="mar_top_10 autoHeight">
      <el-transfer v-model="value" :props="props" :data="bag_codes" :titles="['选择土样', '待检土样']" @change="handleBagChange" />
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>选择实验室</span>
        </div>
        <div>
          <el-radio-group v-model="detected_org" @change="getEle">
            <el-radio v-for="item in orglist" :label="item.code" :key="item.code">{{ item.name }}</el-radio>
          </el-radio-group>
        </div>
      </el-card>
      <el-button type="primary" style="margin-left:20px" @click="creatData()">生成</el-button>
    </div>
    <el-dialog :close-on-click-modal="false" title="选择检测元素" :visible.sync="dialogFormVisible" width="500px">
      <el-form ref="dataForm" style="width: 480px; margin-left:10px;">
        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
        <div style="margin: 15px 0;" />
        <el-checkbox-group v-model="checkedEles" @change="handleCheckedElesChange">
          <el-checkbox v-for="ele in elelist" :label="ele.code" :key="ele.code">{{ ele.name }}</el-checkbox>
        </el-checkbox-group>
      </el-form>
      <div slot="footer" class="dialog-footer" align="center">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="handleCreate()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { get_city, depotList, batch_query, volunteerList } from '@/api/collect.js'
import {
  get_samples,
  detect_org,
  detect_ele,
  create_detect_record
} from '@/api/detect'
export default {
  data() {
    return {
      props: { key: 'bag_code', label: 'bag_code' },
      deport_list: [],
      batch_list: [],
      collector_list: [],
      // 穿梭框
      selected_bag_codes: [],
      bag_codes: [],
      orglist: [],
      value: [],
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
      town: '',
      // 村
      villageList: [],
      village: '',
      area_code: '',
      deport_code: '',
      collector: '',
      year: '',
      dialogFormVisible: true,
      batch_code: '',
      detected_org: '',
      checkAll: false,
      checkedEles: [],
      elelist: [],
      isIndeterminate: true
    }
  },
  mounted() {
    this.getDepotList()
    this.getProvince()
    detect_org().then(res => {
      this.orglist = res.data
    })
  },
  methods: {
    //生成穿梭数据
    getData() {
      const obj = {
        deport_code: this.deport_code,
        area_code: this.area_code,
        year: this.year,
        batch_code: this.batch_code,
        collector: this.collector
      }
      get_samples(obj).then(res => {
        this.bag_codes = res.data
      })
    },
    getEle(val) {
      detect_ele({ detect_id: val }).then(res => {
        this.elelist = res.data[0].values.map(item => {
          return {
            code: item.split('_')[0],
            name: item.split('_')[1]
          }
        })
      })
    },
    creatData() {
      if (this.selected_bag_codes.length === 0) {
        this.$message.warning('请选择土样！')
        return
      }
      if (this.detected_org === '') {
        this.$message.warning('请选择实验室！')
        return
      }
      this.dialogFormVisible = true
      this.isIndeterminate = false
      this.checkAll = false
      this.checkedEles = []
    },
    handleCreate() {
      if (this.checkedEles.length === 0) {
        this.$message.warning('请选择检测元素')
        return
      }
      const obj = {
        bag_codes: this.selected_bag_codes,
        deport_code: this.deport_code,
        detected_org: this.detected_org,
        elements: this.checkedEles.join(',')
      }
      create_detect_record(obj).then(res => {
        if (res.code === 201) {
          this.dialogFormVisible = false
          this.$message.success('生成检测记录成功')
        } else {
          this.$mesage.warning(res.msg)
        }
      })
    },
    getBatch(val) {
      if (val) {
        batch_query({ deport_code: val }).then(res => {
          this.batch_list = res.data
        })
      }
    },
    getDepotList() {
      depotList({}).then(res => {
        this.deport_list = res.data
      })
      volunteerList({}).then(res => {
        this.collector_list = res.data
      })
    },
    handleCheckAllChange(val) {
      const arr = this.elelist.map(item => {
        return item.code
      })
      this.checkedEles = val ? arr : []
      this.isIndeterminate = false
    },
    handleCheckedElesChange(value) {
      console.log(value)
      this.checkedEles = value
      let checkedCount = value.length
      this.checkAll = checkedCount === this.elelist.length
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.elelist.length
    }, //穿梭框有改变
    handleBagChange(value) {
      this.selected_bag_codes = value
    },
    // 获取省市级
    async getProvince() {
      console.log('获取省市级')
      let res = await get_city({})
      this.provinceList = res.data
    },
    // 改变了省级
    async changeProvince() {
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
    }
  }
}
</script>
<style lang="scss" scoped>
.maxHigh {
  min-height: calc(100vh - 120px);
}

.phoneWidth {
  width: 135px;
  margin-right: 20px;
}

.autoHeight {
  height: 100%;
}

.el-card {
  width: 300px;
  height: 650px;
  display: inline-block;
  vertical-align: middle;
}

.el-transfer {
  width: 750px;
  display: inline-block;
  vertical-align: middle;
}
>>> .el-transfer-panel__empty {
  padding-top: 200px;
}

/deep/ .el-transfer-panel {
  width: 300px;
}

/deep/ .el-transfer-panel__body {
  height: 610px;

  .el-transfer-panel__list {
    height: 610px;
  }
}

>>> .el-radio-group label {
  display: block;
  width: 100%;
  height: 30px;
}
>>> .el-checkbox__label {
  width: 50px;
}
</style>