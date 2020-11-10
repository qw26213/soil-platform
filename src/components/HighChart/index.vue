<template>
    <div style="width:100%;height:220px" />
</template>
<script>
import Highcharts from "highcharts"
const eleJson = {
    "organic": "有机质",
    "ph": "ph",
    "tn": "全氮",
    "ep": "有效磷",
    "rk": "速效钾",
    "efe": "有效态铁",
    "emn": "有效态锰",
    "ezn": "有效态锌",
    "ecu": "有效态铜",
    "pb": "铅",
    "cd": "镉",
    "cr": "铬",
    "cu": "铜",
    "ca": "交换性钙",
    "mg": "交换性镁",
    "Tporo": "总孔隙度",
    "Cporo": "毛管孔隙度",
    "Unporo": "非毛管孔隙度",
    "ben_rong": "本地容重",
    "rong": "容重"
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
            let prevData = []
            let curData = []
            chartData.forEach(it => {
                prevData.push(Number(it.split(' ')[0]))
                curData.push(Number(it.split(' ')[1]))
            })
            this.chart = Highcharts.chart(this.$el, {
                colors: ['#44f0ff', '#fd377d', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655'],
                chart: {
                    type: 'line',
                    backgroundColor: 'rgba(0,0,0,0.0)'
                },
                title: {
                    text: '土壤' + eleJson[ele] + '变化',
                    style: {
                        color: '#fff',
                        fontSize: '14px'
                    }
                },
                xAxis: {
                    categories: xData,
                    lineColor: '#999',
                    crosshair: { width: 10, color: '#999'},
                    lineWidth: 1,
                    labels: {
                        step: parseInt(xData.length / 4),
                        staggerLines: 1,
                        style: {
                            color: '#fff',
                            fontSize: '12px',
                            fontFamily: '微软雅黑'
                        }
                    }
                },
                yAxis: {
                    // min: 0,
                    title: {
                        text: null
                    },
                    gridLineColor: '#999',
                    lineColor: '#999',
                    lineWidth: 1,
                    labels: {
                        style: {
                            color: '#fff',
                            fontSize: '12px',
                            fontFamily: '微软雅黑'
                        }
                    },
                    plotLines: [{
                        value: 0,
                        width: 1,
                        color: '#162b5f'
                    }]
                },
                tooltip: {
                    headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                    pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td><td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
                    footerFormat: '</table>',
                    shared: true,
                    useHTML: true
                },
                legend: {
                    itemStyle: {
                        fontSize: '12px',
                        color: '#fff'
                    }
                },
                plotOptions: {
                    column: {
                        borderWidth: 0
                    }
                },
                series: [{
                    name: '改良前',
                    data: prevData
                }, {
                    name: '改良后',
                    data: curData
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
    ;
    width: 20px;
    height: 20px;
    vertical-align: 10px;
}
</style>