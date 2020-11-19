<template>
    <div class="mainPage">
        <div class="contentDiv">
            <!-- <div style="font-weight:bold;font-size:16px;margin-bottom: 10px">栖霞土壤检测元素数据分析</div> -->
            <div class="chartView">
                <div class="tabselect">
                    <el-tabs v-model="activeTab" tab-position="left">
                        <el-tab-pane label="有机质" name="a" />
                        <el-tab-pane label="PH值" name="b" />
                        <el-tab-pane label="氮/磷/钾" name="c" />
                        <el-tab-pane label="中/微量元素" name="d" />
                        <el-tab-pane label="孔隙度/容重" name="e" />
                        <el-tab-pane label="重金属" name="f" />
                    </el-tabs>
                    <img v-show="activeTab=='b'" src="../../assets/legend.png" class="legend">
                </div>
                <div v-show="activeTab=='a'">
                    <bar v-for="(item,index) in eles" :chart-data="chartData[index]" :x-data="xData" :ele="item" />
                </div>
                <div v-show="activeTab=='b'" style="position:relative;padding-bottom:20px">
                    <dumbbell />
                    <div style="text-align:center;font-size:12px;">
                        <span style="display:inline-block;width:32px;height:12px;background:#b8e4e5;vertical-align:middle;margin-right:5px;border-radius:2px"></span>改良前
                        <span style="display:inline-block;width:32px;height:12px;background:#68b4b4;vertical-align:middle;margin-right:5px;border-radius:2px;margin-left:10px"></span>改良后
                    </div>
                </div>
                <div v-show="activeTab=='c'">
                    <chartline type="N" />
                    <chartline type="P" />
                    <chartline type="K" />
                </div>
                <div v-show="activeTab=='d'">
                    <boxplot type="a" />
                    <boxplot type="b" />
                    <boxplot type="c" />
                    <boxplot type="d" />
                    <boxplot type="e" />
                </div>
                <div v-show="activeTab=='e'">
                    <column />
                </div>
                <div v-show="activeTab=='f'">
                    <metal />
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { batchList } from '@/api/collect.js'
import bar from '@/components/HighChart/bar'
import chartline from '@/components/HighChart/line'
import boxplot from '@/components/HighChart/boxplot'
import metal from '@/components/HighChart/metal'
import dumbbell from '@/components/HighChart/ph'
import column from '@/components/HighChart/column'
export default {
    components: {
        bar,
        chartline,
        boxplot,
        metal,
        dumbbell,
        column,
    },
    data() {
        return {
            activeTab: 'b',
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
<style scoped>
.legend{margin-top: 320px;margin-left: 60px}
.chartView{padding-left: 120px;}
.maxHigh {
    min-height: calc(100vh - 60px);
}
.mainPage{position: relative;}
.item {
    margin-top: 10px;
    margin-right: 10px;
}
.tabselect{position: absolute;width: 120px;height:240px;top:40px;left: 20px }
</style>