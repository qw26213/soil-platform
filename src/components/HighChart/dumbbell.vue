<template>
    <div style="width:100%;height:450px" />
</template>
<script>
import Highcharts from "highcharts"
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
        initChart(chartData, xData, ele) {
            var data = [{
                name: '1',
                low: 69,
                high: 82
            }, {
                name: '2',
                low: 70,
                high: 81
            }, {
                name: '3',
                low: 69,
                high: 75
            }, {
                name: '4',
                low: 65,
                high: 78
            }, {
                name: '5',
                low: 70,
                high: 81
            }, {
                name: '6',
                low: 70,
                high: 79
            }, {
                name: '7',
                low: 72,
                high: 81
            }, {
                name: '8',
                low: 68,
                high: 78
            }, {
                name: '9',
                low: 69,
                high: 81
            }, {
                name: '10',
                low: 70,
                high: 83
            }, {
                name: '11',
                low: 68,
                high: 81
            }, {
                name: '12',
                low: 69,
                high: 83
            }, {
                name: '13',
                low: 73,
                high: 82
            }, {
                name: '14',
                low: 70,
                high: 82
            }, {
                name: '15',
                low: 70,
                high: 75
            }, {
                name: '16',
                low: 68,
                high: 83
            }, {
                name: '17',
                low: 70,
                high: 75
            }, {
                name: '18',
                low: 69,
                high: 82
            }, {
                name: '19',
                low: 69,
                high: 81
            }, {
                name: '20',
                low: 68,
                high: 78
            }, {
                name: '21',
                low: 63,
                high: 81
            }, {
                name: '22',
                low: 66,
                high: 75
            }, {
                name: '23',
                low: 70,
                high: 77
            }, {
                name: '24',
                low: 69,
                high: 81
            }, {
                name: '25',
                low: 73,
                high: 82
            }, {
                name: '26',
                low: 68,
                high: 76
            }, {
                name: '27',
                low: 69,
                high: 83
            }, {
                name: '28',
                low: 71,
                high: 81
            }];
            this.chart = Highcharts.chart(this.$el, {
                colors: ['#17c3b2', '#fe6d73', 'rgba(0,0,0,1)'],
                chart: {
                    inverted: false
                },
                legend: {
                    enabled: true
                },
                title: {
                    text: '土壤ph变化情况'
                },
                tooltip: {
                    shared: true
                },
                xAxis: {
                    type: 'category'
                },
                yAxis: {
                    title: {
                        text: null
                    }
                },
                series: [{
                    name: 'ph改良前',
                    type: 'dumbbell',
                    data: data
                }, {
                    name: 'ph改良后',
                    type: 'dumbbell',
                    data: data
                }, {
                    name: '平均值',
                    type: 'line',
                    data: [60,60,60,60,60,60,60,60,60,60,60,60,60,60,60,60,60,60,60,60,60,60,60,60,60,60,60]
                }]
            });
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