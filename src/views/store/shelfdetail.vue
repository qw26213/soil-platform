<template>
  <div class="mainPage">
    <div class="filterDiv">
      <label>货架名称：{{ $route.query.shelf_code }}</label>
      <div style="display:inline-block; margin-left:30px">
        <span class="smallBox gray"></span>
        <span class="iconTxt">空闲</span>
        <span class="smallBox red"></span>
        <span class="iconTxt">占用</span>
        <span class="smallBox green"></span>
        <span class="iconTxt">已检</span>
      </div>
    </div>
    <!-- 采样袋 -->
    <div class="contentDiv">
      <!-- 行 -->
      <div v-for="(row, index) in tableData" :key="index" class="flex jus_between mar_bot_24">
        <!-- 列 -->
        <div v-for="(col, index) in row" :key="index" class="mar_rig_20 flex1">
          <div class="text_center fon_14" style="margin-bottom:8px">{{col.place_code}}</div>
          <div v-if="box_col > 0" class="boxDiv fill_w">
            <!-- 格子行 -->
            <div v-for="(b_row, index) in col.box" :key="index" class="rowItem clearfix">
              <!-- 格子列 -->
              <div v-for="(it,k) of b_row" :key="k" class="placeCell" :class="{'gray': it.box_status == 0, 'red': it.box_status == 1, 'green': it.box_status == 2}">{{it.box_place.slice(5,7)}}</div>
            </div>
          </div>
          <div v-else class="boxDiv fill_w nullDiv">无格位数据</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// 1占用，2已检，0空闲
import { shelf_detail } from '@/api/collect.js'
export default {
  data() {
    return {
      box_col: 2,
      tableData: []
    }
  },
  mounted() {
    this.getShelf_detail()
  },
  methods: {
    // 获取货架详情
    getShelf_detail() {
      shelf_detail({
        deport_code: this.$route.query.deport_code,
        shelf_code: this.$route.query.shelf_code,
        start: 0,
        page_rows: 100
      }).then(res => {
        let shelf_col = res.shelf_schema.split('*')[1]
        let box_col = !res.box_schema ? 0 : res.box_schema.split('*')[1]
        this.box_col = box_col
        let result = []
        //处理货架
        while (res.data.length > 0) {
          let boxList = res.data.splice(0, shelf_col)
          //处理盒子
          boxList.map(e => {
            let box = []
            while (e.box.length > 0 && box_col > 0) {
              box.unshift(e.box.splice(0, box_col))
            }
            e.box = box
            return e
          })

          result.push(boxList)
        }
        this.tableData = result
      })
    }
  }
}
</script>
<style scoped>
.maxHigh {
  min-height: calc(100vh - 120px);
}
.boxDiv .rowItem {
  border-bottom: 1px #fff solid;
  width: 100%;
}
.boxDiv .rowItem:last-child {
  border-bottom: none;
}
.boxDiv .rowItem .placeCell {
  width: 50%;
  height: 50px;
  line-height: 50px;
  text-align: center;
  font-size: 12px;
  box-sizing: border-box;
  border-right: 1px solid #fff;
  float: left;
}
.boxDiv .rowItem .placeCell:last-child {
  border-right: none;
}

.boxDiv {
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid #ddd;
}

.gray {
  background-color: #aeaeae;
}

.noBorder {
  border: none;
}

.red {
  background-color: #ff7676;
}

.green {
  background-color: #70eb88;
}

.blue {
  background-color: #52aeff;
}

.gray {
  background-color: #c6c6c6;
}

.smallBox {
  display: inline-block;
  vertical-align: middle;
  width: 14px;
  height: 14px;
  border-radius: 10px;
  margin-right: 5px;
}

.iconTxt {
  display: inline-block;
  vertical-align: middle;
  color: #626066;
  font-size: 14px;
  margin-right: 20px;
}
.nullDiv {
  text-align: center;
  line-height: 70px;
  background-color: #ddd;
  font-size: 12px;
}
</style>