<template>
    <div style="width:100%;height:300px" />
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
                chart: {
                    type: 'columnrange', // columnrange 依赖 highcharts-more.js
                    inverted: true
                },
                title: {
                    text: '土壤元素变化范围'
                },
                xAxis: {
                    categories: ['2018-05', '2018-07', '2018-09', '2018-11', '2019-01', '2019-03', '2019-05', '2019-07', '2019-09', '2019-11', '2020-01', '2020-03']
                },
                yAxis: {
                    title: {
                        text: '含量 ( g/kg )'
                    }
                },
                tooltip: {
                    valueSuffix: '°C'
                },
                plotOptions: {
                    columnrange: {
                        dataLabels: {
                            enabled: true,
                            formatter: function() {
                                return this.y + '°C';
                            }
                        }
                    }
                },
                legend: {
                    enabled: false
                },
                series: [{
                    name: '温度',
                    data: [
                        [-9.7, 9.4],
                        [-8.7, 6.5],
                        [-3.5, 9.4],
                        [-1.4, 19.9],
                        [0.0, 22.6],
                        [2.9, 29.5],
                        [9.2, 30.7],
                        [7.3, 26.5],
                        [4.4, 18.0],
                        [-3.1, 11.4],
                        [-5.2, 10.4],
                        [-13.5, 9.8]
                    ]
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