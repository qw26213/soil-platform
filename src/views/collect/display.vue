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
      <div class="pad_top_8">省（直辖市）：</div>
      <el-select v-model="province" size="medium" class="provinceSelectWidth" @change="changeProvince()">
        <el-option v-for="e in provinceList" :key="e.code" :label="e.name" :value="e.code"></el-option>
      </el-select>
      <div class="pad_top_8">市 ：</div>
      <el-select v-model="city" size="medium" class="provinceSelectWidth" @change="changeCity()">
        <el-option v-for="e in cityList" :key="e.code" :label="e.name" :value="e.code"></el-option>
      </el-select>
      <div class="pad_top_8">城区（县）：</div>
      <el-select v-model="county" size="medium" class="provinceSelectWidth" @change="changeCounty()">
        <el-option v-for="e in countyList" :key="e.code" :label="e.name" :value="e.code"></el-option>
      </el-select>
      <div class="pad_top_8">镇乡 ：</div>
      <el-select v-model="town" size="medium" class="provinceSelectWidth" @change="changeTown()">
        <el-option v-for="e in townList" :key="e.code" :label="e.name" :value="e.code"></el-option>
      </el-select>
      <div class="pad_top_8">村 ：</div>
      <el-select v-model="village" size="medium" class="provinceSelectWidth" @change="changeVillage()">
        <el-option v-for="e in villageList" :key="e.code" :label="e.name" :value="e.code"></el-option>
      </el-select>
      <!-- 田亩大小 -->
      <div class="fon_12 mar_top_30 mar_bot_0">
        <div class="flex ali_center lineHiegh10 cursor" @click="changeLimit(0)">
          <img src="../../assets/unrequiredIcon.png" class="localIcon" />
          <div :class="`${currSelectPoint == 0?'currBlue':''}`">未认领：{{sampleCountInfo.unrequired}}</div>
        </div>
        <div class="flex ali_center lineHiegh10 cursor" @click="changeLimit(1)">
          <img src="../../assets/requiredIcon.png" class="localIcon" />
          <div :class="`${currSelectPoint == 1?'currBlue':''}`">已认领：{{sampleCountInfo.required}}</div>
        </div>
        <div class="flex ali_center lineHiegh10 cursor" @click="changeLimit(2)">
          <img src="../../assets/collectedICon.png" class="localIcon" />
          <div :class="`${currSelectPoint == 2?'currBlue':''}`">已采集：{{sampleCountInfo.finished}}</div>
        </div>
        <div class="flex ali_center lineHiegh10 cursor moveLeft" @click="changeLimit(2)">
          <div>(</div>
          <img src="../../assets/free_collect.png" class="localIcon" />
          <div :class="`${currSelectPoint == 2?'currBlue':''}`">自由采集：{{sampleCountInfo.finished}}</div>
          <div>)</div>
        </div>
        <div class="flex ali_center lineHiegh10 cursor" @click="changeLimit(3)">
          <img src="../../assets/incomedIcon.png" class="localIcon" />
          <div :class="`${currSelectPoint == 3?'currBlue':''}`">已入库：{{sampleCountInfo.incomed}}</div>
        </div>
        <div class="flex ali_center lineHiegh10 cursor">
          <el-checkbox v-model="checked" @change="changeAll()">
            <span class="col_ffffff">查看全部 {{sampleCountInfo.counts}}</span>
          </el-checkbox>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { batchResult, get_city, sampleCount } from '../../api/collect.js'
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
      // 全选
      checked: true
    }
  },
  mounted() {
    this.getProvince()
    this.getSampleCount()
  },
  methods: {
    // 采样点统计
    async getSampleCount() {
      let res = await sampleCount({})
      this.sampleCountInfo = res.data
    },
    // 筛选
    changeLimit(type) {
      this.checked = false
      this.limit = type
      this.currSelectPoint = type
      this.getBatchResult()
    },
    // 改变全选
    changeAll() {
      // 如果是显示全部 就加载全部
      if (this.checked) {
        this.limit = -1
        this.currSelectPoint = -1
        this.getBatchResult()
      }
    },
    // 地图加载完成
    mapLoaded() {
      // 地图加载完成之后再获取 然后渲染 有个顺序在里面
      this.getBatchResult()
    },
    markerClick(prop) {
      // 点击回调事件
      console.log(prop)
    },
    // 获取结果展示
    async getBatchResult() {
      let res = await batchResult({
        task_status: this.limit
      })
      // 遍历 回显
      let point = []
      let polygon = []
      for (let e of res.data) {
        point = point.concat(e.points)
        polygon.push(e.polygon)
      }
      if (this.limit != 2 && this.limit != -1) {
        res.free.points.length = 0
      }
      this.$refs.gismap.showMarkers(point)
      this.$refs.gismap.showFreeMarkers(res.free.points)
      this.$refs.gismap.showPolygons(polygon)
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

      // 根据code找name
      this.provinceList.map(value => {
        if (value.code == this.province) {
          this.provinceName = value.name
          // 根据名称飞行
          const code = value.code.substring(0, 6)
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

      // 根据code找name
      this.cityList.map(value => {
        if (value.code == this.city) {
          this.cityName = value.name
          // 根据名称飞行
          const code = value.code.substring(0, 6)
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

      // 根据code找name
      this.countyList.map(value => {
        if (value.code == this.county) {
          this.countyName = value.name
          // 根据名称飞行
          const code = value.code.substring(0, 6)
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

      // 根据code找name
      this.townList.map(value => {
        if (value.code == this.town) {
          this.townName = value.name
          // 根据名称飞行
          this.$refs.gismap.locateVillageByName(
            this.townName,
            this.county.substring(0, 6)
          )
        }
      })
    },
    // 改变了村级
    async changeVillage() {
      // 确认了村级 可以进行地图飞行了

      // 根据code找name
      this.villageList.map(value => {
        if (value.code == this.village) {
          this.villageName = value.name
          // 根据名称飞行
          console.log(this.countyName + this.townName + this.villageName)
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
.mapBox {
  width: 100%;
  height: calc(100%);
  background-color: #eeeeee;
}

.left {
  top: 0px;
  left: 200px;
  width: 200px !important;
  height: 100%;
  padding: 20px 30px;
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
  width: 16px;
  margin-right: 4px;
}

.moveLeft {
  margin-left: -4px;
}
</style>
