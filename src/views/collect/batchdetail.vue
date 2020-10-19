<template>
  <div class="seeWidth flex jus_between position_relate">
    <!-- map -->
    <div class="mapBox position_relate">
      <!-- 中间提示条 -->
      <div v-if="pageStatus == 'toDistributionPoint'" class="tipDiv position_absolute flex ali_center jus_center">
        <img src="../../assets/info.png" alt class="tipIcon" />
        <span class="col_ffffff">请先在地图上选择采集点位，然后点击人员进行分配</span>
      </div>
      <!-- map -->
      <gis-map ref="gismap" :tool="false" @map-loaded="mapLoaded" @marker-click="markerClick"></gis-map>
    </div>

    <!-- 左侧菜单 -->
    <!-- 批次发布详情 -->
    <template v-if="pageStatus == 'publish'">
      <div class="leftNav position_absolute">
        <div class="fon_16 col_333333 fill_w text_center">本批次预定详情</div>
        <div class="fon_16 col_333333 borderTop mar_top_10 mar_bot_0 pad_top_10 pad_bot_0">批次号：{{batchCode}}</div>
        <div class="fon_16 col_333333 pad_top_10">截止日期：{{batchInfo.end_time}}</div>

        <!-- 数量 -->
        <div class="fon_16 col_333333 pad_top_8">
          <span class="pad_lef_14"></span>
          采集点：{{batchInfo.counts}}
        </div>
        <div class="fon_16 col_333333 flex ali_center pad_top_8">
          <img src="../../assets/unrequiredIcon.png" alt class="localIcon" />
          未认领：
          <span class="col_ff555a">{{batchInfo.unrequired || 0}}</span>
        </div>
        <div class="fon_16 col_333333 flex ali_center pad_top_8">
          <img src="../../assets/requiredIcon.png" alt class="localIcon" />
          已认领：
          <span class="col_509bfc">{{batchInfo.required || 0}}</span>
        </div>
        <!-- <div class="fon_16 col_333333 flex ali_center pad_top_8">
          <img src="../../assets/requiredIcon.png" alt class="localIcon" />
          已采集：
          <span class="col_509bfc">{{batchInfo.required || 0}}</span>
        </div> -->
        <div class="fon_16 col_333333 mar_top_10">已发布：{{batchInfo.batch_number || 0}} 组</div>
        <div class="flex jus_between borderTop mar_top_10 mar_bot_0">
          <div class="lineHiegh10 fon_16 col_509bfc borderRight flex1 flex jus_center ali_center cursor" @click="getPointBindDetails()">认领详情</div>
          <div v-if="batchInfo.unrequired != 0" class="lineHiegh10 fon_16 col_509bfc flex1 flex jus_center ali_center cursor" @click="dislogRestTask = true">再发布</div>
          <div v-else class="lineHiegh10 fon_16 col_9B9B9B flex1 flex jus_center ali_center cursor">再发布</div>
        </div>
      </div>
    </template>

    <!-- 左上角 剩余点数 -->
    <template v-if="pageStatus == 'changePublishReward' || pageStatus == 'toDistributionPoint'">
      <div class="leftNav position_absolute">
        <div class="fon_16 col_333333 fill_w text_center">
          本批次点数剩余：
          <span class="col_ff555a">{{ batchLstPointNumber }}</span> 个
        </div>
      </div>
    </template>

    <!-- 右上角 更改批次条件 -->
    <template v-if="pageStatus == 'changePublishReward'">
      <div class="flex wrap position_absolute rightUpPos jus_end">
        <div>
          <el-date-picker v-model="changeEndTime" type="date" placeholder="延长截止日期" :picker-options="pickerOptions" value-format="yyyy-MM-dd" class="selectWidth" clearable></el-date-picker>
        </div>
        <div class="selectWidth">
          <el-select v-model="rangeCurrent" clearable placeholder="扩大人员范围">
            <el-option v-for="item in RangeList" :key="item.value" :label="item.name" :value="item.code"></el-option>
          </el-select>
        </div>
        <div class="selectWidth">
          <el-select v-model="integralCurrent" clearable placeholder="增加奖励积分">
            <el-option v-for="item in integralSelectList" :key="item.value" :label="item.value" :value="item.value"></el-option>
          </el-select>
        </div>
      </div>
    </template>

    <!-- 右上角 直接分配 -->
    <template v-if="pageStatus == 'toDistributionPoint'">
      <div class="position_absolute rightUpPos">
        <div class="fon_16 col_656565 batchOpciatyBox">批次：{{batchCode}}</div>
        <div class="fon_16 col_333333 batchOpciatyBox flex mar_top_10 mar_bot_0 text_center">
          <div class="flex1">
            地块附
            <br />近人员
          </div>
          <div class="felx1">
            本批次
            <br />认领数
          </div>
          <div class="flex1">
            历史采
            <br />集点数
          </div>
        </div>
        <!-- 数据 -->
        <div class="fon_14 col_333333 batchOpciatyBox flex text_center" v-for="(e,k) of bactchVolunteerList[batchVounteerPage]" :key="K">
          <div class="flex1 cursor nameHover" @click="bindPoint(e.id,e.user_name)">{{e.user_name}}</div>
          <div class="flex1">{{e.taskCounts || 0}}</div>
          <div class="flex1">{{e.hisCounts}}</div>
        </div>
        <!-- 分页 -->
        <div class="batchOpciatyBox">
          <el-pagination
            small
            layout="total,prev, pager, next"
            :page-size="batchVounteerPageSize"
            :total="batchVounteerCount"
            @prev-click="prevClick"
            @next-click="nextClick"
            @current-change="currentChange"
          ></el-pagination>
        </div>
      </div>
    </template>

    <!-- 右下角 生成 改变预约条件 -->
    <template v-if="pageStatus == 'changePublishReward'">
      <div class="saveBotton position_absolute col_ffffff fon_16 flex ali_center jus_center cursor" @click="ensureAgainPublish">生成</div>
    </template>

    <!-- 右下角 返回 直接分配 -->
    <template v-if="pageStatus != 'publish'">
      <div class="backBotton position_absolute col_ffffff fon_16 flex ali_center jus_center cursor" @click="back()">返回</div>
    </template>

    <!-- 即将生成批次 -->
    <el-dialog :visible.sync="dislogPublishTask" top="24vh" width="420px" :center="true">
      <div class="text_center">
        <div class="col_333333 fon_20 mar_bot_24">即将发布的采点任务！</div>
        <div class="col_333333 fon_16">批次号：{{batchCode}}</div>
        <div class="col_333333 fon_16">截止日期：{{changeEndTime}}</div>
        <div class="col_333333 fon_16">采点总数：共 {{batchInfo.counts}} 个</div>
        <div class="col_333333 fon_16">已认领：共 {{batchInfo.required || 0}} 个</div>
        <div class="col_333333 fon_16">
          未认领：共
          <span class="col_68f58e">{{batchInfo.unrequired || 0}}</span> 个
        </div>
        <div class="col_333333 fon_16">本批次发布次数：共 {{batchInfo.batch_number || 0}} 次</div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dislogPublishTask = false">取 消</el-button>
        <el-button type="primary" plain @click="ensurePublish()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 剩余处理 -->
    <el-dialog :visible.sync="dislogRestTask" top="24vh" width="420px" :center="true">
      <div class="text_center">
        <div class="col_333333 fon_20 mar_bot_24">
          本批次剩余
          <span class="col_ff555a">{{batchLstPointNumber}}</span> 个采集点
        </div>
        <div class="col_333333 fon_20 mar_bot_24">请做选择</div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="toDistributionPoint()">直接分配</el-button>
        <el-button @click="toChangePublishRewrad()">改变预约条件</el-button>
      </div>
    </el-dialog>

    <!-- 重新生成批次成功 -->
    <el-dialog :visible.sync="dislogSaveBatch" top="24vh" width="500px" :center="true" @close="stopToBatchPage()">
      <div class>
        <div class="col_333333 fon_20 flex jus_center">更改批次 {{batchCode}} 条件成功</div>
        <div class="col_9B9B9B fon_16 mar_bot_40 flex jus_center">
          本批次完成截止日期是
          <span class="col_ff555a">{{changeEndTime}}</span>
        </div>
      </div>
      <div class="col_9B9B9B fon_14">
        自动跳转任务管理界面
        <span class="col_ff555a">{{time}} s</span>
        <span class="col_5381ff pad_lef_14" @click="jumpNow()">立即跳转</span>
      </div>
    </el-dialog>

    <!-- 查看面板 -->
    <el-dialog :visible.sync="dislogLook" title="认领详情" top="14vh" width="500px">
      <el-table :data="batchBindList" style="width: 100%" :header-cell-style="headerCellStyle">
        <el-table-column prop="batch_number" align="center" label="组别ID" />
        <el-table-column prop="counts" align="center" label="发布任务数" />
        <el-table-column prop="required" align="center" label="本组认领" />
        <el-table-column prop="unrequired" align="center" label="未认领" />
      </el-table>
      <div class="block mar_top_10 mar_bot_0">
        <el-pagination layout="total" :total="parseInt(totalPage)"></el-pagination>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  batchDetails,
  pointBindDetails,
  batchLastPoint,
  bactchVolunteer,
  integralList,
  addRange,
  batchPoint,
  pubishBatch,
  batchDirect
} from '@/api/collect.js'

import GisMap from '@/components/gis-map'
export default {
  components: {
    GisMap
  },
  data() {
    return {
      // 批次号
      batchCode: '',
      // 即将发布的任务弹窗
      dislogPublishTask: false,
      // 批次剩余点数
      batchLstPointNumber: '',
      // 剩余任务的处理
      dislogRestTask: false,
      // 页面状态 发布 publish 改变预约条件 changePublishReward 直接分配 toDistributionPoint
      pageStatus: 'publish',
      // 更改截止时间的变量
      changeEndTime: '',
      // 过去的时间不能选择
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now()
        }
      },
      // 当前选择扩大的村都有什么
      rangeCurrent: '',
      // 扩大人员范围列表
      RangeList: [],
      // 奖励积分选择
      integralCurrent: '',
      // 奖励列表
      integralSelectList: [],
      // 志愿者报名列表
      bactchVolunteerList: [],
      //志愿者报名总数
      batchVounteerCount: '',
      // 志愿者分页当前页面
      batchVounteerPage: 0,
      // 志愿者分页size
      batchVounteerPageSize: 10,
      // 重新生成批次
      dislogSaveBatch: false,
      // 倒计时 time 5s
      time: 5,
      // 倒计时器
      loop: '',
      // 批次详情
      batchInfo: {},
      // 查看面板
      dislogLook: false,
      // 查看面板信息
      batchBindList: [],
      // 查看面板的分页
      page: 0,
      pageSize: 8,
      totalPage: 0,

      // 保存点击过的采集点id
      savePointId: '',

      type: '' //初始化页面类型
    }
  },
  mounted() {
    this.batchCode = this.$route.query.code
    this.getBatchDetails()
    // 查询剩余点数
    this.getBatchLastPoint()

    // 就只有进入页面的时候执行一次 查看url携带的type
    this.type = this.$route.query.type
  },
  methods: {
    // 地图加载完成之后
    mapLoaded() {
      this.getBatchPoint()
    },
    markerClick(prop) {
      // 点击回调事件
      console.log(prop)
      this.savePointId = prop.code
    },
    // 异步获取圈地和打点的数据
    async getBatchPoint() {
      let res = await batchPoint(
        {
          batch_code: this.batchCode
        },
        this.batchCode
      )
      // 地图回显
      const points = this.mergePoint(res.plotDatas)
      const polygon = this.mergePolygon(res.plotDatas)
      this.$refs.gismap.showMarkers(points)
      this.$refs.gismap.showPolygons(polygon, true)
    },
    mergePoint(arr) {
      const result = []
      for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr[i].points.length; j++) {
          result.push(arr[i].points[j])
        }
      }
      return result
    },
    mergePolygon(arr) {
      const result = []
      for (let i = 0; i < arr.length; i++) {
        result.push(arr[i].polygon)
      }
      return result
    },
    // 获取批次详情
    async getBatchDetails() {
      let res = await batchDetails({
        batch_code: this.batchCode
      })
      this.batchInfo = res.data
      this.changeEndTime = res.data.end_time

      this.judgeType()
    },
    // 判断类型
    judgeType() {
      // 改变预约条件
      if (this.type == 'changePublishReward') {
        this.toChangePublishRewrad()
      } else if (this.type == 'toDistributionPoint') {
        // 直接分配
        this.toDistributionPoint()
      }

      this.type = ''
    },

    // 获取批次认领详情
    async getPointBindDetails() {
      this.dislogLook = true
      let res = await pointBindDetails({
        batch_code: this.batchCode
      })
      this.batchBindList = res.data
      this.totalPage = res.count
    },
    // 批次剩余点数
    async getBatchLastPoint() {
      let res = await batchLastPoint({
        batch_code: this.batchCode
      })
      this.batchLstPointNumber = res.data
    },
    // 直接分配 报名人员bactchVolunteer
    async getBactchVolunteer() {
      let res = await bactchVolunteer({
        batch_code: this.batchCode,
        start: 0,
        page_rows: 10
      })
      // 先清一遍  因为改变刷新的话 可能会数据不更新
      this.bactchVolunteerList = []
      // 志愿者总数 做分页的
      this.batchVounteerCount = parseInt(res.data.length)
      // 将结果拆成长度为size的二维数组 分页就取其不同的下标数组就好了
      while (res.data.length > 0) {
        this.bactchVolunteerList.push(
          res.data.splice(0, this.batchVounteerPageSize)
        )
      }
    },
    // 改变预约条件 扩大人员范围
    async getRangeList() {
      let res = await addRange({
        batch_code: this.batchCode
      })
      // 如果是空数组 会返回[[null]] 所以必须加上res.data[0]判断是不是null  居尼玛傻逼 后端就说自己没错 ！！！
      if (res.data.length > 0 && res.data[0]) {
        console.log(res.data)
        this.RangeList = res.data
      }
    },
    // 改变预约条件 获取积分下拉菜单
    async getIntegralList() {
      let res = await integralList({})
      if (res.data.length > 0) {
        this.integralSelectList = res.data
      }
    },
    // 点击人 弹出是否确认分配
    async bindPoint(id, name) {
      this.$confirm(`是否将该点分配给 ${name}`, '分配采集点', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(() => {
          this.bindPonitAPeople(id)
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '取消分配！'
          })
        })
    },

    // 绑定人和点
    async bindPonitAPeople(id) {
      // 点击了 绑定按钮
      if (!this.savePointId) {
        this.$message({
          type: 'info',
          message: '请选择绑定的点！'
        })
        return ''
      }
      // 绑定点
      let res = await batchDirect({
        sample_code: this.savePointId,
        user_code: id
      })

      this.$message({
        type: 'success',
        message: '分配成功!'
      })

      // 重新加载点信息 渲染
      this.getBatchPoint()
      // 重新加载表单信息 渲染
      this.getBactchVolunteer()
      // 剩余点数 -1
      this.batchLstPointNumber--
    },

    // 确认发布
    async ensurePublish() {
      console.log('ensurePublish')
      // 隐藏发布面板
      this.dislogPublishTask = false

      // 重新发布批次
      let res = await pubishBatch({
        batch_code: this.batchCode,
        end_time: this.changeEndTime,
        ranger: this.rangeCurrent,
        integral: this.integralCurrent
      })
      // 发布成功 成功面板
      this.dislogSaveBatch = true
      // 倒计时5s
      this.loop = setInterval(() => {
        this.time--
        // console.log(this.time);
        if (this.time <= 0) {
          // 停止倒计时
          clearInterval(this.loop)
          // 清时间
          this.endTime = ''
          // 跳转到任务管理
          this.$router.push('./task')
        }
      }, 1000)
    },
    // 直接分配
    toDistributionPoint() {
      // 获取报名志愿者列表
      this.getBactchVolunteer()
      // 页面状态切换
      this.pageStatus = 'toDistributionPoint'
      // 关闭剩余处理弹窗
      this.dislogRestTask = false
    },
    // 更改预约条件
    toChangePublishRewrad() {
      // 获取积分列表
      this.getIntegralList()
      // 获取扩大范围
      this.getRangeList()
      // 页面状态切换
      this.pageStatus = 'changePublishReward'
      // 关闭剩余处理弹窗
      this.dislogRestTask = false
    },
    // 确认重新生成批次
    async ensureAgainPublish() {
      // 显示发布详情面板
      this.dislogPublishTask = true
    },
    // 查看面板首行样式
    headerCellStyle() {
      return 'color:#333333;'
    },
    // 上一页
    prevClick() {
      console.log('上一页')
      this.page--
      this.getBatchList()
    },
    // 下一页
    nextClick() {
      console.log('下一页')
      this.page++
      this.getBatchList()
    },
    // 当前页面被点击
    currentChange(index) {
      console.log('当前页面被点击')
      this.page = --index
      this.getBatchList()
    },
    // 立即跳转
    jumpNow() {
      this.stopToBatchPage()
      // 跳转到任务管理
      this.$router.push(`./task?id=${this.batchCode}`)
    },
    // 停止跳转到批次管理页面
    stopToBatchPage() {
      // 停止倒计时
      clearInterval(this.loop)
      // 清时间
      this.endTime = ''
    },
    // 返回上一页
    back() {
      // 重新加载批次详情
      this.getBatchDetails()
      this.pageStatus = 'publish'
    },
    // 分页
    // 上一页
    prevClick() {
      console.log('上一页')
      this.batchVounteerPage--
    },
    // 下一页
    nextClick() {
      console.log('下一页')
      this.batchVounteerPage++
    },
    // 当前页面被点击
    currentChange(index) {
      console.log('当前页面被点击')
      this.batchVounteerPage = --index
    }
  }
}
</script>

<style lang="scss" scoped>
.seeWidth {
  width: 100%;
  height: 100%;
}

.leftNav {
  left: 20px;
  top: 30px;
  width: 285px;
  padding:15px 15px 10px;
  background-color: rgba($color: #ffffff, $alpha: 0.8);
  box-sizing: border-box;
  border-radius: 4px;
}

.rightUpPos {
  top: 70px;
  right: 20px;
}

.batchOpciatyBox {
  width: 250px;
  padding: 10px 20px;
  background-color: rgba($color: #dadada, $alpha: 0.8);
}

.searchBack {
  background-color: rgba($color: #dadada, $alpha: 0.8);
  padding: 0px 20px;
}

.saveBotton {
  bottom: 30px;
  right: 160px;
  width: 120px;
  height: 38px;
  background-color: #5381ff;
}

.backBotton {
  bottom: 30px;
  right: 20px;
  width: 120px;
  height: 38px;
  background-color: #5381ff;
}

.mapBox {
  width: 100%;
  height: calc(100%);
  background-color: #eeeeee;
}

.borderRight {
  border-right: 1px solid rgba($color: #333333, $alpha: 0.3);
}

.borderTop {
  border-top: 1px solid rgba($color: #333333, $alpha: 0.3);
}

.lineHiegh10 {
  height: 34px;
}

.selectWidth {
  width: 140px;
  padding: 0px 5px;
}

.nameHover {
  &:hover {
    color: #5381ff;
  }
}

.localIcon {
  width: 20px;
  margin-right: 8px;
}

.tipDiv {
  background-color: rgba($color: #000000, $alpha: 0.5);
  z-index: 10;
  width: 100%;
  height: 24px;
  font-size: 14px;
}

.tipIcon {
  width: 20px;
  height: 20px;
  margin-right: 10px;
}
</style>
