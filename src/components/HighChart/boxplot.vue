<template>
    <div style="width:100%;height:450px" />
</template>
<script>
import Highcharts from 'highcharts'
import highchartsMore from 'highcharts/highcharts-more';
highchartsMore(Highcharts);
const eleJson = {
    "organic": "有机质,g/kg",
    "ph": "ph,",
    "tn": "全氮,g/kg",
    "ep": "有效磷,mg/kg",
    "rk": "速效钾,mg/kg",
    "efe": "有效态铁,ug/g",
    "emn": "有效态锰,ug/g",
    "ezn": "有效态锌,ug/g",
    "ecu": "有效态铜,ug/g",
    "pb": "铅,mg/g",
    "cd": "镉,mg/g",
    "cr": "铬,mg/g",
    "cu": "铜,mg/g",
    "ca": "交换性钙,g/kg",
    "mg": "交换性镁,g/kg",
    "Tporo": "总孔隙度,%",
    "Cporo": "毛管孔隙度,%",
    "Unporo": "非毛管孔隙度,%",
    "ben_rong": "本地容重,g/cm3",
    "rong": "容重,g/cm3"
}
export default {
    name: 'HighChart',
    props: ['chartData', 'xData', 'ele'],
    data() {
        return {
            isFullscreen: false,
            chart: null
        }
    },
    watch: {
        chartData() {
            this.initChart(this.chartData, this.xData, this.ele)
        }
    },
    mounted() {
        this.initChart(this.chartData, this.xData, this.ele)
    },
    methods: {
        initChart() {
            this.chart = Highcharts.chart(this.$el, {
                colors: ['#44f0ff', '#409eff', '#409eff', '#DDDF00', '#24CBE5', '#64E572', '#FF9655'],
                chart: {
                    inverted: false
                },
                title: {
                    text: '土壤元素变化范围'
                },
                xAxis: {
                    categories: ["2018-05","2018-06","2018-07","2018-08","2018-09","2019-05","2019-06","2019-07","2019-08","2019-09","2019-10"],
                },
                yAxis: {
                    title: {
                        text: '含量 (g/kg)'
                    }
                },
                plotOptions: {
                    columnrange: {
                        dataLabels: {
                            enabled: true,
                            formatter: function() {
                                return this.y
                            }
                        }
                    },
                    series: {
                        dataLabels: {
                            align: 'center',
                            enabled: true
                        }
                    }
                },
                legend: {
                    enabled: false
                },
                series: [{
                    name: '有机质',
                    type: 'columnrange', // columnrange 依赖 highcharts-more.js
                    data: [
                        [6.08, 19.27],
                        [11.52, 24.19],
                        [6.02, 17.41],
                        [11.23, 24.03],
                        [5.93, 17.28],
                        [10.75, 23.18],
                        [5.89, 17.45],
                        [11.02, 23.10],
                        [5.96, 18.85],
                        [10.64, 28.07],
                        [6.11, 18.49]
                    ]
                }, {
                    name: '平均值',
                    type: 'line', // columnrange 依赖 highcharts-more.js
                    data: [11.44,19.82,11.18,19.31,11.10,18.98,11.03,18.89,11.67,20.83,11.57]
                }]
            })
        }
    }
}
</script>
<style scoped>
.qq-svg {
    display: inline-block;
    cursor: pointer;
    fill: #5a5e66;
    width: 20px;
    height: 20px;
    vertical-align: 10px;
}
</style>