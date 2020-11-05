<template>
  <div class="mapBox position_relate">
    <!-- map -->
    <gis-map ref="gismap" :tool="false" @map-loaded="mapLoaded" @marker-click="markerClick"></gis-map>
    <!-- 左侧菜单 -->
    <div class="left position_absolute col_ffffff fon_14" :class="leftShow?'leftOpen':'leftNavClose'">
      <div class="flex jus_end showBox pad_top_10 pad_lef_14 back_ffffff cursor" @click="leftShow = !leftShow">
        <i class="col_ffffff" :class="leftShow?'el-icon-d-arrow-left':'el-icon-d-arrow-right'"></i>
      </div>
      <!-- 选择省市 -->
      <div class="label">省(直辖市)：</div>
      <el-select filterable v-model="province" size="small" class="provinceSelectWidth" @change="changeProvince()">
        <el-option v-for="e in provinceList" :key="e.code" :label="e.name" :value="e.code" />
      </el-select>
      <div class="label">市：</div>
      <el-select filterable v-model="city" size="small" class="provinceSelectWidth" @change="changeCity()">
        <el-option v-for="e in cityList" :key="e.code" :label="e.name" :value="e.code" />
      </el-select>
      <div class="label">县(区)：</div>
      <el-select filterable v-model="county" size="small" class="provinceSelectWidth" @change="changeCounty()">
        <el-option v-for="e in countyList" :key="e.code" :label="e.name" :value="e.code" />
      </el-select>
      <div class="label">镇(乡)：</div>
      <el-select filterable v-model="town" size="small" class="provinceSelectWidth" @change="changeTown()">
        <el-option v-for="e in townList" :key="e.code" :label="e.name" :value="e.code" />
      </el-select>
      <div class="label">仓库：</div>
      <el-select filterable v-model="deport_code" size="small" class="provinceSelectWidth" @change="getBatch1">
        <el-option v-for="e in deport_list" :key="e.code" :label="e.name" :value="e.code" />
      </el-select>
      <div class="label">批次编码：</div>
      <el-select filterable v-model="batch_code" size="small" class="provinceSelectWidth">
        <el-option v-for="e in batch_list" :key="e" :label="e" :value="e" />
      </el-select>
      <div class="label">采样年份：</div>
      <el-select filterable v-model="year" size="small" class="provinceSelectWidth">
        <el-option v-for="e in [2018,2019,2020,2021,2022]" :key="e" :label="e" :value="e" />
      </el-select>
      <div class="label">采样人 ：</div>
      <el-select filterable v-model="collector" size="small" class="provinceSelectWidth">
        <el-option v-for="e in collector_list" :key="e.id" :label="e.user_name" :value="e.id" />
      </el-select>
      <div class="legend">
        <div class="item">
          <img src="../../assets/incomedIcon.png" class="localIcon" style="display:inline-block;vertical-align:middle" />
          <span class="fon_12">已入库</span>
        </div>
        <div class="item" style="margin-top:10px">
          <img src="../../assets/detecting.png" class="localIcon" style="display:inline-block;vertical-align:middle" />
          <span class="fon_12">送检中</span>
        </div>
        <div class="item" style="margin-top:10px">
          <img src="../../assets/detected.png" class="localIcon" style="display:inline-block;vertical-align:middle" />
          <span class="fon_12">已检测</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { get_city, sampleCount, volunteerList, depotList, batch_query } from '@/api/collect.js'
import { dected_resultv2 } from '../../api/detect'
import GisMap from '@/components/gis-map'
export default {
  components: {
    GisMap
  },
  data() {
    return {
      // 抽屉
      leftShow: true,
      // 筛选条件
      limit: -1,

      // 省市级选择
      provinceList: [],
      province: '',
      provinceName: '',
      // 市级
      cityList: [],
      city: '',
      cityName: '',
      // 县级
      countyList: [],
      county: '',
      countyName: '',
      // 镇
      townList: [],
      town: '',
      townName: '',
      // 村
      villageList: [],
      village: '',
      villageName: '',
      // 采样点统计
      sampleCountInfo: {},
      currSelectPoint: -1,
      deport_code: '',
      batch_code: '',
      year: '',
      collector: '',
      // 全选
      checked: true,
      batch_list: [],
      deport_list: [],
      collector_list: []
    }
  },
  mounted() {
    this.getProvince()
    depotList({}).then(res => {
      this.deport_list = res.data
    })
    volunteerList({}).then(res => {
      this.collector_list = res.data
    })
  },
  methods: {
    // 获取结果展示
    get_dected_result(area_code) {
      const obj = {
        area_code: area_code,
        deport_code: this.deport_code,
        batch_code: this.batch_code,
        year: this.year,
        collector: this.collector
      }
      dected_resultv2(obj).then(res => {
        let point = res.data.points.filter(
          item =>
            item.properties.status === 'INCOMED' ||
            item.properties.status === 'SEND_DETECTING' ||
            item.properties.status === 'DETECTED'
        )
        console.log(point.length + '条数据')
        this.$refs.gismap.showMarkers(point)
      })
    },
    getBatch(code) {
      if (val) {
        batch_query({ area_code: code, deport_code: this.deport_code }).then(
          res => {
            this.batch_list = res.data
          }
        )
      }
    },
    getBatch1(code) {
      if (code) {
        batch_query({ deport_code: code }).then(res => {
          this.batch_list = res.data
        })
      }
    },

    // 地图加载完成
    mapLoaded() {
      this.get_dected_result('')
    },
    markerClick(prop) {
      // 点击回调事件
      console.log(prop)
    },
    // 获取省市级
    async getProvince() {
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
      this.getBatch(this.province)
      this.cityList = res.data

      // 根据code找name
      this.provinceList.map(value => {
        if (value.code == this.province) {
          this.provinceName = value.name
          // 根据名称飞行
          const code = value.code.substring(0, 6)
          this.get_dected_result(value.code.substr(0, 3))
          this.$refs.gismap.locateZoneByName(code)
        }
      })
    },
    // 改变了市级
    async changeCity() {
      this.countyList = this.townList = this.villageList = []
      this.county = this.town = this.village = ''
      let res = await get_city({
        parent_id: this.city
      })
      this.countyList = res.data
      this.getBatch(this.city)
      // 根据code找name
      this.cityList.map(value => {
        if (value.code == this.city) {
          this.cityName = value.name
          // 根据名称飞行
          const code = value.code.substring(0, 6)
          this.get_dected_result(value.code.substr(0, 5))
          this.$refs.gismap.locateZoneByName(code)
        }
      })
    },
    // 改变了县级
    async changeCounty() {
      this.townList = this.villageList = []
      this.town = this.village = ''
      let res = await get_city({
        parent_id: this.county
      })
      this.townList = res.data
      this.getBatch(this.county)
      // 根据code找name
      this.countyList.map(value => {
        if (value.code == this.county) {
          this.countyName = value.name
          // 根据名称飞行
          const code = value.code.substring(0, 6)
          this.get_dected_result(value.code.substr(0, 7))
          this.$refs.gismap.locateZoneByName(code)
        }
      })
    },
    // 改变了镇级
    async changeTown() {
      this.villageList = []
      this.village = ''
      let res = await get_city({
        parent_id: this.town
      })
      this.villageList = res.data
      this.getBatch(this.town)
      // 根据code找name
      this.townList.map(value => {
        if (value.code == this.town) {
          this.townName = value.name
          // 根据名称飞行
          this.get_dected_result(value.code.substr(0, 9))
          this.$refs.gismap.locateVillageByName(
            this.townName,
            this.county.substring(0, 6)
          )
        }
      })
    },
    // 改变了村级
    changeVillage() {
      this.villageList.map(value => {
        if (value.code == this.village) {
          this.villageName = value.name
          // 根据名称飞行
          this.get_dected_result(value.code.substr(0, 11))
          this.$refs.gismap.locateVillageByName(
            this.villageName,
            this.county.substring(0, 6)
          )
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>

.legend {
  padding: 12px 0;
  margin-top: 10px;
}

.mapBox {
  width: 100%;
  height: calc(100%);
  background-color: #eeeeee;
}
.label{padding:10px 0 3px; font-size: 12px;}
.left {
  top: 0px;
  left: 0px;
  width: 200px !important;
  height: 100%;
  padding: 1px 20px 20px;
  background-color: rgba($color: #000000, $alpha: 0.5);
  box-sizing: border-box;
  transition: left 0.5s;
  z-index: 3;
}

.leftOpen {
  left: 0px;
}

.leftNavClose {
  left: -200px;
}

.showBox {
  width: 20px;
  margin-top: -20px;
  margin-left: 170px;
  padding: 8px 8px;
  background-color: rgba($color: #000000, $alpha: 0.5);
  border-bottom-right-radius: 10px;
}

.provinceSelectWidth {
  width: 100%;
}

.areaSelectWidth {
  width: 40%;
}

.yellow {
  width: 14px;
  height: 14px;
  background-color: #ffca00;
  border-radius: 10px;
  margin-right: 10px;
}

.red {
  width: 14px;
  height: 14px;
  background-color: #ff555a;
  border-radius: 10px;
  margin-right: 10px;
}

.green {
  width: 14px;
  height: 14px;
  background-color: #68f58e;
  border-radius: 10px;
  margin-right: 10px;
}

.blue {
  width: 14px;
  height: 14px;
  background-color: #509bfc;
  border-radius: 10px;
  margin-right: 10px;
}

.gray {
  width: 14px;
  height: 14px;
  background-color: #aeaeae;
  border-radius: 10px;
  margin-right: 10px;
}

.leftWidth {
  width: 100px;
}

.lineHiegh10 {
  line-height: 28px;

  &:hover {
    color: #509bfc;
  }
}

.currBlue {
  color: #509bfc;
}

/deep/ .el-input__inner {
  -webkit-appearance: none;
  background-color: rgba($color: #000000, $alpha: 0.3);
  background-image: none;
  border-radius: 4px;
  border: 1px solid rgba($color: #ffffff, $alpha: 0.3);
  box-sizing: border-box;
  color: #409eff;
  display: inline-block;
  font-size: 12px;
  outline: 0;
  padding: 0 15px;
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  width: 100%;
}

.localIcon {
  width: 20px;
  margin-right: 4px;
}
</style>