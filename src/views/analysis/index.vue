<template>
    <div class="mainPage">
        <div class="contentDiv">
            <div style="font-weight:bold;font-size:16px;margin-bottom: 10px">山东栖霞土壤检测元素数据分析</div>
            <el-tabs v-model="activeTab">
                <el-tab-pane label="有机质" name="a" />
                <el-tab-pane label="PH值" name="b" />
                <el-tab-pane label="氮/磷/钾" name="c" />
                <el-tab-pane label="微/中量元素" name="d" />
                <el-tab-pane label="孔隙度/容重" name="e" />
                <el-tab-pane label="重金属" name="f" />
            </el-tabs>
            <div v-show="activeTab=='a'">
                <bar v-for="(item,index) in eles" :chart-data="chartData[index]" :x-data="xData" :ele="item" />
            </div>
            <div v-show="activeTab=='b'">
                <dumbbell />
            </div>
            <div v-show="activeTab=='c'">
                <chartline :type="12" />
                <chartline :type="24" />
            </div>
            <div v-show="activeTab=='d'">
                <boxplot :type="12" />
                <boxplot :type="24" />
            </div>
            <div v-show="activeTab=='e'">
                <column :type="12" />
                <column :type="24" />
            </div>
            <div v-show="activeTab=='f'">
                <tilemap v-for="(item,index) in eles" :chart-data="chartData[index]" :x-data="xData" :ele="item" />
            </div>
        </div>
    </div>
</template>
<script>
import { batchList } from '@/api/collect.js'
import bar from '@/components/HighChart/bar'
import chartline from '@/components/HighChart/line'
import boxplot from '@/components/HighChart/columnrange'
import tilemap from '@/components/HighChart/tilemap'
import dumbbell from '@/components/HighChart/dumbbell'
import column from '@/components/HighChart/column'
export default {
    components: {
        bar,
        chartline,
        boxplot,
        tilemap,
        dumbbell,
        column,
    },
    data() {
        return {
            activeTab: 'a',
            order_prop: '',
            order: '',
            eles: 'organic'.split(','), //,ep,rk,efe,emn,ezn,ecu'.split(','),
            chartData: [],
            xData: ["2019-05", "2019-06", "2019-07", "2019-08", "2019-09", "2019-10"],
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