<template>
  <div class="seeWidth flex jus_between position_relate">
    <!-- map -->
    <gis-map ref="gismap" :tool="true" />

    <!-- 左侧菜单 -->
    <div class="left position_absolute fon_14 col_ffffff back_000000" :class="leftShow?'leftOpen':'leftNavClose'">
      <div class="flex jus_end showBox pad_top_10 pad_lef_14 back_ffffff cursor" @click="leftShow = !leftShow">
        <i class="col_ffffff" :class="leftShow?'el-icon-d-arrow-left':'el-icon-d-arrow-right'"></i>
      </div>
      <!-- 选择省市 -->
      <div class="label">省(直辖市):</div>
      <el-select v-model="province" size="small" filterable class="provinceSelectWidth" @change="changeProvince()">
        <el-option v-for="e in provinceList" :key="e.code" :label="e.name" :value="e.code" />
      </el-select>
      <div class="label">市：</div>
      <el-select v-model="city" size="small" filterable class="provinceSelectWidth" @change="changeCity()">
        <el-option v-for="e in cityList" :key="e.code" :label="e.name" :value="e.code" />
      </el-select>
      <div class="label">城区(县)：</div>
      <el-select v-model="county" size="small" filterable class="provinceSelectWidth" @change="changeCounty()">
        <el-option v-for="e in countyList" :key="e.code" :label="e.name" :value="e.code" />
      </el-select>
      <div class="label">镇/乡：</div>
      <el-select v-model="town" size="small" filterable class="provinceSelectWidth" @change="changeTown()">
        <el-option v-for="e in townList" :key="e.code" :label="e.name" :value="e.code" />
      </el-select>
      <div class="label">村：</div>
      <el-select v-model="village" size="small" filterable class="provinceSelectWidth" @change="changeVillage()">
        <el-option v-for="e in villageList" :key="e.code" :label="e.name" :value="e.code" />
      </el-select>
      <!-- 四个单选 -->
      <!-- <div class="mar_top_10 flex wrap">
				<el-radio v-model="loadWay" v-for="(e,k) of loadList" :key="k" :label="e.code"><span class="fon_12 lineHiegh10 col_ffffff">{{e.name}}</span></el-radio>
      </div>-->
      <!-- 耕作形式 -->
      <div class="flex jus_between ali_center fon_12" style="margin-top:5px">
        <div class="pad_top_8 felx1">耕作形式：</div>
        <div class="areaSelectWidth">
          <el-select v-model="Gway" size="small" placeholder="选择">
            <el-option v-for="(e,k) of GList" :key="k" :label="e.name" :value="e.code" />
          </el-select>
        </div>
      </div>
      <!-- 土壤属性 -->
      <div class="flex jus_between ali_center fon_12" style="margin-top:5px">
        <div class="pad_top_8 felx1">土壤属性：</div>
        <div class="areaSelectWidth">
          <el-select v-model="Tway" size="small" placeholder="选择">
            <el-option v-for="(e,k) of TList" :key="k" :label="e.name" :value="e.code" />
          </el-select>
        </div>
      </div>
      <!-- 土壤酸碱度 -->
      <div class="jus_between flex ali_center fon_12" style="margin-top:5px">
        <div class="pad_top_8 felx1">土壤酸碱度：</div>
        <div class="areaSelectWidth">
          <el-select v-model="Sway" size="small" placeholder="选择">
            <el-option v-for="(e,k) of SList" :key="k" :label="e.name" :value="e.code" />
          </el-select>
        </div>
      </div>
      <!-- 田亩大小 -->
      <div class="fon_12 flex wrap mar_top_10 mar_bot_0">
        <div class="flex ali_center leftWidth lineHiegh10">
          <div class="yellow"></div>
          <div class="mar_left_6">0 - 1亩</div>
        </div>
        <div class="flex ali_center leftWidth lineHiegh10">
          <div class="red"></div>
          <div class="mar_left_6">1 - 10亩</div>
        </div>
        <div class="flex ali_center leftWidth lineHiegh10">
          <div class="green"></div>
          <div class="mar_left_6">10 - 100亩</div>
        </div>
        <div class="flex ali_center leftWidth lineHiegh10">
          <div class="blue"></div>
          <div class="mar_left_6">100 - 1000亩</div>
        </div>
        <div class="flex ali_center lineHiegh10">
          <div class="gray"></div>
          <div class="mar_left_6">1000 - 100,0000亩</div>
        </div>
      </div>
    </div>

    <!-- 右 历史地块搜索 -->
    <!-- <div class="flex ali_center searchBack flex1 position_absolute">
			<i class="el-icon-search col_7f7f7f fon_16"></i>
			<div class="mar_top_10 fon_16 col_7f7f7f">历史地块搜索</div>
    </div>-->
    <!-- 生成 -->
    <div class="saveBotton position_absolute col_ffffff fon_16 flex ali_center jus_center cursor" @click="toCreateBatch()">生成</div>

    <!-- 确定截止日期弹窗 -->
    <el-dialog title="请确定本批次完成最后截止日期？" :visible.sync="dislogDataShow" top="24vh" width="400px" :center="true">
      <div class="flex jus_center">
        <el-date-picker v-model="endTime" type="date" placeholder="选择日期" :picker-options="pickerOptions" value-format="yyyy-MM-dd" class="dataPicker" />
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dislogDataShow = false">取 消</el-button>
        <el-button type="primary" plain @click="ensureSave()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 生成批次成功 -->
    <el-dialog :visible.sync="dislogSaveBatch" top="24vh" width="500px" :center="true" @close="stopToBatchPage()">
      <div class>
        <div class="col_333333 fon_20 flex jus_center">成功生成批次 {{saveSuccessBatch}}！</div>
        <div class="col_9B9B9B fon_16 mar_bot_24 flex jus_center">
          本批次完成截止日期是
          <span class="col_ff555a">{{endTime}}</span>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="$router.push(`./batchdetail?type=toDistributionPoint&code=${saveSuccessBatch}`)">直接分配</el-button>
        <el-button @click="$router.push(`./batch`)">查看批次</el-button>
      </div>
      <!-- <div class="col_9B9B9B fon_14">自动跳转批次管理界面 <span class="col_ff555a">{{time}} s</span> <span class="col_5381ff pad_lef_14"
      @click="jumpNow()">立即跳转</span></div>-->
    </el-dialog>
  </div>
</template>

<script>
import {
  farm_method,
  get_city,
  load_method,
  soil_properties,
  saveBatch,
  soil_ph
} from '@/api/collect.js'

import GisMap from '@/components/gis-map'

export default {
  components: {
    GisMap
  },
  data() {
    return {
      // 左侧弹窗是否显示
      leftShow: true,
      // 耕作形式
      Gway: '',
      GList: [],
      // 加载方式
      loadWay: '001',
      loadList: [],
      // 土壤属性
      Tway: '',
      TList: [],
      // 酸碱度
      Sway: '',
      SList: [],
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
      // 单选
      radio: '1',
      // 截止日期
      endTime: '',
      // 过去的时间不能选择
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now()
        }
      },
      // 选择截止日期
      dislogDataShow: false,
      // 生成批次成功
      dislogSaveBatch: false,
      // 批次号码
      saveSuccessBatch: '',
      // 倒计时 time 5s
      time: 5,
      // 倒计时器
      loop: '',
      // 圈地
      plot: [{}],
      // 打点
      samplePoints: [{}],
      paint: []
    }
  },
  mounted() {
    this.getFarmMethods()
    this.getProvince()
    this.load_method()
    this.soil_properties()
    this.getSoilPh()
  },
  methods: {
    // 获取省市级
    async getProvince() {
      let res = await get_city({})
      this.provinceList = res.data
    },
    // 获取耕作方式
    async getFarmMethods() {
      let res = await farm_method({})
      this.GList = res.data
    },
    // 获取加载方式
    async load_method() {
      let res = await load_method({})
      this.loadList = res.data
    },
    // 获取土壤属性
    async soil_properties() {
      let res = await soil_properties({})
      this.TList = res.data
    },
    // 获取土壤酸碱度
    async getSoilPh() {
      let res = await soil_ph({})
      this.SList = res.data
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
    },
    // 点击生成按钮
    toCreateBatch() {
      // 获取绘制数据
      this.paint = this.$refs.gismap.getDrawData()
      console.log(this.paint)
      // if (!this.village) {
      // 	this.$message.error('您还没有选村！');
      // 	return
      // }
      if (this.paint.length == 0) {
        this.$message.error('您还没有圈地！')
        return
      }
      if (this.paint[0].points.length == 0) {
        this.$message.error('您还没有打点！')
        return
      }
      this.dislogDataShow = true
    },
    //  确认生成批次
    async ensureSave() {
      console.log(this.endTime)
      if (!this.endTime) {
        this.$message.error('请选择本批次截止时间！')
        return
      }
      this.dislogDataShow = false

      // 走生成批次的接口
      // 处理一下时间
      // 至少三个点 并且形成闭合区域  采样点要在区域里面
      let res = await saveBatch({
        area_code: '',
        creater: '',
        end_time: this.endTime,
        type: '',
        // 10-9 修改
        plotDatas: this.paint
      })

      // 显示成功返回的批次号
      this.saveSuccessBatch = res.data
      // 批次生成接口成功
      this.dislogSaveBatch = true

      // 倒计时5s
      // this.loop = setInterval(() => {
      // 	this.time--;
      // 	// console.log(this.time);
      // 	if (this.time <= 0) {
      // 		// 停止倒计时
      // 		clearInterval(this.loop)
      // 		// 清时间
      // 		this.endTime = ''
      // 		// 跳转到批次管理
      // 		this.$router.push('/batchManagement')
      // 	}
      // }, 1000)
    },
    // 停止倒计时 立即跳转
    jumpNow() {
      this.stopToBatchPage()
      // 跳转到批次管理
      this.$router.push('/batchManagement')
    },
    // 停止跳转到批次管理页面
    stopToBatchPage() {
      // 停止倒计时
      clearInterval(this.loop)
      // 清时间
      this.endTime = ''
    }
  }
}
</script>
<style lang="scss" scoped>
.seeWidth {
  width: 100%;
  height: 100%;
}
.label{padding:10px 0 3px; font-size: 12px;}
.left {
  top: 0px;
  left: 0px;
  width: 200px !important;
  height: 100%;
  padding: 0 20px 20px;
  background-color: rgba($color: #000000, $alpha: 0.5);
  box-sizing: border-box;
  transition: left 0.5s;
  z-index: 3;

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
    transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
    width: 100%;
  }
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
  margin-left: 180px;
  padding: 8px 8px;
  background-color: rgba($color: #000000, $alpha: 0.5);
  border-bottom-right-radius: 10px;
}

.provinceSelectWidth {
  width: 100%;
}

.areaSelectWidth {
  width: 80px;
}

.yellow {
  width: 14px;
  height: 14px;
  background-color: #ffca00;
}

.red {
  width: 14px;
  height: 14px;
  background-color: #ff555a;
}

.green {
  width: 14px;
  height: 14px;
  background-color: #68f58e;
}

.blue {
  width: 14px;
  height: 14px;
  background-color: #509bfc;
}

.gray {
  width: 14px;
  height: 14px;
  background-color: #aeaeae;
}

.leftWidth {
  width: 110px;
}

.searchBack {
  top: 30px;
  right: 20px;
  background-color: #dadada;
  opacity: 0.8;
  padding: 0px 20px;
}

.saveBotton {
  bottom: 30px;
  right: 20px;
  width: 120px;
  height: 38px;
  background-color: #5381ff;
}

.lineHiegh10 {
  line-height: 24px;
}

.mapBox {
  width: 100%;
  height: calc(100%);
  background-color: #eeeeee;
}

.dataPicker {
  background-color: #ffffff !important;
}
</style>
