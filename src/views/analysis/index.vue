<template>
    <div class="mainPage">
        <div class="contentDiv">
            <div class="col_656565 fon_16">
                栖霞市土壤检测结果分析
            </div>
            <el-row>
                <el-col :span="24" v-for="(item,index) in eles" :key="index">
                    <chart :chart-data="chartData[index]" :x-data="xData" :ele="item" />
                </el-col>
                <el-col :span="24" v-for="(item,index) in eles" :key="item">
                    <boxplot :chart-data="chartData[index]" :x-data="xData" :ele="item" />
                </el-col>
                <el-col :span="24" v-for="(item,index) in eles" :key="index + 'abc'">
                    <tilemap :chart-data="chartData[index]" :x-data="xData" :ele="item" />
                </el-col>
            </el-row>
        </div>
    </div>
</template>
<script>
import { batchList } from '@/api/collect.js'
import Pagination from '@/components/Pagination'
import Chart from '@/components/HighChart/bar'
import boxplot from '@/components/HighChart/boxplot'
import tilemap from '@/components/HighChart/tilemap'

export default {
    components: {
        Pagination, Chart, boxplot, tilemap
    },
    data() {
        return {
            order_prop: '',
            order: '',
            eles: 'organic'.split(','), //,ep,rk,efe,emn,ezn,ecu'.split(','),
            chartData: [],
            xData: ["2019-05","2019-06","2019-07","2019-08","2019-09","2019-10"],
            tableData: [],
            page: 1,
            pageSize: 10,
            totalPage: 0
        }
    },
    mounted() {
        this.getBatchList()
    },
    methods: {
        // 排序监听  实现排序功能
        sortChange(e) {
            this.order_prop = e.prop
            this.order = e.order === 'ascending' ? 'asc' : 'desc'
            this.getBatchList()
        },
        // 获取批次列表
        async getBatchList() {
            let res = await batchList({
                start: this.page - 1,
                page_rows: this.pageSize,
                order_prop: this.order_prop,
                order: this.order
            })
            this.tableData = res.data
            this.totalPage = res.count
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
<style lang="scss" scoped>
.maxHigh {
    min-height: calc(100vh - 60px);
}

.item {
    margin-top: 10px;
    margin-right: 10px;
}
</style>