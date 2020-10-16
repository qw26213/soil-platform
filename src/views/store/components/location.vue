<template>
  <div>
    <div class="col_333333 fon_14 flex jus_between ali_center mar_top_10 mar_bot_0">
      <span class>所在区域：</span>
      <el-select v-model="province" size="mini" class="phoneWidth" @change="changeProvince()" placeholder="省（直辖市）：">
        <el-option v-for="e in provinceList" :key="e.code" :label="e.name" :value="e.code" />
      </el-select>
      <el-select v-model="city" size="mini" class="phoneWidth" @change="changeCity()" placeholder="市 ：">
        <el-option v-for="e in cityList" :key="e.code" :label="e.name" :value="e.code" />
      </el-select>
      <el-select v-model="county" size="mini" class="phoneWidth" @change="changeCounty()" placeholder="城区（县）：">
        <el-option v-for="e in countyList" :key="e.code" :label="e.name" :value="e.code" />
      </el-select>
      <el-select v-model="town" size="mini" class="phoneWidth" @change="changeTown()" placeholder="镇乡 ：">
        <el-option v-for="e in townList" :key="e.code" :label="e.name" :value="e.code" />
      </el-select>
      <el-select v-model="village" size="mini" class="phoneWidth" @change="changeVillage()" placeholder="村 ：">
        <el-option v-for="e in villageList" :key="e.code" :label="e.name" :value="e.code" />
      </el-select>
      <el-button type="primary" size="mini" class="yellow" @click="clickSearch">查询</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
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
      village: ''
    }
  },
  mounted() {
    this.getProvince()
  },
  methods: {
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

<style>
</style>
