<template>
    <div style="width:100%;height:400px" />
</template>
<script>
import Highcharts from 'highcharts'
import highchartsMore from 'highcharts/highcharts-more';
import dumbbell from 'highcharts/modules/dumbbell'
highchartsMore(Highcharts)
dumbbell(Highcharts)
const eleJson = {
    'a': '交换性钙',
    'b': '交换性镁',
    'c': '有效态铁',
    'd': '有效态锰',
    'e': '有效态锌',
    'f': '交换性铜'
}
export default {
    name: 'HighChart',
    props: ['type'],
    data() {
        return {
            area1: ['A1区', 'A2区', 'A3区', 'A4区', 'A5区', 'A6区', 'A7区', 'A8区', 'A9区', 'A10区', 'A11区', 'A12区', 'A13区', 'A14区', 'A15区', 'A16区', 'A17区', 'A18区', 'A19区', 'A20区', 'A1区', 'A22区', 'A23区', 'A24区'],
            area2: ['B1区', 'B2区', 'B3区', 'B4区', 'B5区', 'B6区', 'B7区', 'B8区', 'B9区', 'B10区', 'B1区', 'B12区'],
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
            const xData = this.area1.concat(this.area2)
            this.chart = Highcharts.chart(this.$el, {
                chart: {
                    type: 'boxplot'
                },
                title: {
                    text: '改良前后'+ eleJson[this.type] +'元素对比'
                },
                legend: {
                    enabled: false
                },
                xAxis: {
                    categories: xData,
                    title: {
                        text: ''
                    }
                },
                yAxis: {
                    title: {
                        text: null
                    },
                    plotLines: [{
                        value: 932,
                        color: 'red',
                        width: 1,
                        label: {
                            text: '理论模型: 932',
                            align: 'center',
                            style: {
                                color: 'gray'
                            }
                        }
                    }]
                },
                tooltip: {
                    pointFormat: '最大值: {point.q3}<br/>最小值: {point.low}<br/>平均数: {point.median}'
                },
                plotOptions: {
                    boxplot: {
                        fillColor: "#b6d2eb",
                        eageColor: '#ffffff',
                        medianColor: '#5381ff'
                    }
                },
                series: [{
                    name: '观测值',
                    type: 'boxplot',
                    data: [
                        [760, 760, 848, 895, 890],
                        [760, 760, 848, 895, 890],
                        [760, 760, 848, 895, 890],
                        [760, 760, 848, 895, 890],
                        [760, 760, 848, 895, 890],
                        [760, 760, 848, 895, 890],
                        [760, 760, 848, 895, 890],
                        [760, 760, 848, 895, 890],
                        [760, 760, 848, 895, 890],
                        [760, 760, 848, 895, 890],
                        [760, 760, 848, 895, 890],
                        [760, 760, 848, 895, 890],
                        [760, 760, 848, 895, 890],
                        [760, 760, 848, 895, 890],
                        [760, 760, 848, 895, 890],
                        [760, 760, 848, 895, 890],
                        [760, 760, 848, 895, 890],
                        [760, 760, 848, 895, 890],
                        [760, 760, 848, 895, 890],
                        [760, 760, 848, 895, 890],
                        [760, 760, 848, 895, 890],
                        [760, 760, 848, 895, 890],
                        [760, 760, 848, 895, 890],
                        [760, 760, 848, 895, 890],
                        [760, 760, 848, 895, 890],
                        [760, 760, 848, 895, 890],
                        [760, 760, 848, 895, 890],
                        [760, 760, 848, 895, 890],
                        [760, 760, 848, 895, 890],
                        [760, 760, 848, 895, 890],
                        [760, 760, 848, 895, 890],
                        [760, 760, 848, 895, 890],
                        [760, 760, 848, 895, 890],
                        [760, 760, 848, 895, 890],
                        [760, 760, 848, 895, 890],
                        [760, 760, 848, 895, 890]
                    ]
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