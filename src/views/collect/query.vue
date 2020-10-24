<template>
    <div class="mainPage">
        <div class="contentDiv">
            <div class="col_656565 fon_16">采集结果列表</div>
            <el-table :data="tableData" v-loading="loading" style="width: 100%;margin-top:10px" :header-cell-style="headerCellStyle">
                <el-table-column label="序号" type="index" width="50" align="center" />
                <el-table-column prop="create_time" label="采集编号" align="left" min-width="120">
                    <template slot-scope="{row}">
                        <span>{{ row.properties && row.properties.remark }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="area_name" label="采集人" min-width="120">
                    <template slot-scope="{row}">
                        <span>{{ row.properties && row.properties.results.collector }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="end_time" label="农户姓名" align="center" min-width="180">
                    <template slot-scope="{row}">
                        <span>{{ row.properties && row.properties.farmer }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="creater" label="东经" align="center" min-width="180">
                    <template slot-scope="{row}">
                        <span>{{ row.geometry && row.geometry.coordinates[0] | Fixed }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="creater" label="北纬" align="center" min-width="180">
                    <template slot-scope="{row}">
                        <span>{{ row.geometry && row.geometry.coordinates[1] | Fixed }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="create_time" label="采土地址" align="left" min-width="160">
                    <template slot-scope="{row}">
                        <span>{{ row.properties && row.properties.detail_address }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="area_name" label="提交时间" min-width="150" align="center">
                    <template slot-scope="{row}">
                        <span>{{ row.properties && row.properties.results.submit_time }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="area_name" label="现场图片" width="100" align="center">
                    <template slot-scope="{row}">
                        <el-button type="text" size="small" @click="showImgView(row)">查看</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <pagination v-if="totalPage>10" :total="totalPage" :page.sync="page" :limit.sync="pageSize" @pagination="getBatchList" />
        </div>
        <el-dialog :title="title" :visible.sync="modalVisible" width="870px">
          <div class="clearfix" style="margin-top:-15px">
            <div class="frontImg" :style="{backgroundImage:'url('+itemInfo.soil_sample_img+')'}" style="margin-right: 10px;"></div>
            <div class="frontImg" :style="{backgroundImage:'url('+itemInfo.planing_img+')'}" style="margin-right: 10px;"></div>
            <div class="frontImg" :style="{backgroundImage:'url('+itemInfo.people_bag_img+')'}"></div>
          </div>
        </el-dialog>
    </div>
</template>
<script>
import { batchResult } from '@/api/collect.js'
import Pagination from '@/components/Pagination'
export default {
    components: {
        Pagination
    },
    filters: {
        Fixed(val) {
            return val ? parseFloat(val).toFixed(6) : ''
        }
    },
    data() {
        return {
            basePicUrl: 'http://39.107.225.209:5410/static/img/backImg.0da86535.jpg',
            title: '',
            order_prop: '',
            order: '',
            loading: false,
            itemInfo: {},
            tableData: [],
            page: 1,
            pageSize: 10,
            totalPage: 0,
            modalVisible: false
        }
    },
    mounted() {
        this.getBatchResult()
    },
    methods: {
        headerCellStyle() {
            return 'color:#333333;'
        },
        showImgView(obj) {
            this.itemInfo = obj.properties
            const row = obj.properties
            this.title = '编号:' + row.remark + '、 ' + '采集人:' + row.results.collector + '、 ' + '农户:' + row.farmer + '、 ' + '地址:' + row.detail_address + '、 ' + '坐标:' + row.code
            this.modalVisible = true
        },
        getBatchResult() {
            this.loading = true
            batchResult({
                task_status: -1
            }).then(res => {
                this.loading = false
                console.log(res.free)
                this.tableData = res.free.points || []
            }).catch(() => {
                this.loading = false
            })
        }
    }
}
</script>
<style lang="scss" scoped>
.maxHigh {
    min-height: calc(100vh - 60px);
}
.item {
    margin-top: 10px;
    margin-right: 10px;
}
.imgTit{width: 100%;margin-bottom: 8px;text-align: center;font-weight:bold;}
.frontImg{width: 270px;height: 420px;float: left;border: 1px #eee solid;background: #f7f7f7;background-repeat: no-repeat;background-size: cover;border-radius: 6px;}
</style>