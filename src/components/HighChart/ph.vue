<template>
    <div style="width:100%;height:680px" />
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
                colors: ['#ffffff', '#ffffff', '#ffffff', '#ffffff'],
                chart: {
                    type: 'boxplot'
                },
                title: {
                    text: '改良前后土壤PH值对比'
                },
                legend: {
                    enabled: false
                },
                xAxis: {
                    categories: xData,
                    title: {
                        text: ''
                    },
                    lineColor: '#999',
                    lineWidth: 1,
                    alternateGridColor: '#fff6ff',
                    labels: {
                        style: {
                            color: '#333',
                            fontSize: '12px',
                            fontFamily: '微软雅黑'
                        }
                    }
                },
                yAxis: {
                    title: {
                        text: null
                    },
                    gridLineColor: '#ddd',
                    lineColor: '#999',
                    lineWidth: 1,
                    labels: {
                        style: {
                            color: '#333',
                            fontSize: '12px',
                            fontFamily: '微软雅黑'
                        }
                    },
                    plotLines: [{
                        value: 0,
                        width: 1,
                        color: '#162b5f'
                    },{
                        value: 5.6,
                        width: 1,
                        color: '#fded75'
                    },{
                        value: 6.3,
                        width: 1,
                        color: '#68b4b4'
                    }]
                },
                tooltip: {
                    pointFormat: '最大值: {point.q3}<br/>最小值: {point.low}<br/>平均值: {point.median}'
                },
                series: [{
                    name: '改良前',
                    type: 'boxplot',
                    fillColor: "#b8e4e5",
                    pointWidth: 10,
                    eageColor: '#ffffff',
                    eageWidth: 0,
                    medianColor: '#fded75',
                    medianWidth: 2,
                    whiskerLength: 10,
                    whiskerWidth: 5,
                    whiskerColor: '#278181',
                    data: [
                        [4.6, 4.6, 5.3, 6.6, 6.6],
                        [4.9, 4.9, 5.6, 6.4, 6.4],
                        [4.7, 4.7, 5.1, 5.7, 5.7],
                        [4.9, 4.9, 5.4, 5.7, 5.7],
                        [4.0, 4.0, 5.0, 6.0, 6.0],
                        [5.1, 5.1, 5.4, 5.9, 5.9],
                        [5.2, 5.2, 5.6, 5.9, 5.9],
                        [5.2, 5.2, 5.5, 5.9, 5.9],
                        [5.0, 5.0, 5.3, 5.6, 5.6],
                        [4.5, 4.5, 5.1, 5.7, 5.7],
                        [4.7, 4.7, 5.2, 5.5, 5.5],
                        [4.7, 4.7, 5.2, 5.8, 5.8],
                        [5.0, 5.0, 5.4, 5.6, 5.6],
                        [5.6, 5.6, 6.1, 6.5, 6.5],
                        [5.4, 5.4, 5.6, 5.8, 5.8],
                        [5.0, 5.0, 5.2, 5.4, 5.4],
                        [4.8, 4.8, 5.3, 5.7, 5.7],
                        [5.3, 5.3, 6.0, 6.6, 6.6],
                        [4.3, 4.3, 5.1, 5.9, 5.9],
                        [5.9, 5.9, 6.2, 6.5, 6.5],
                        [5.3, 5.3, 5.7, 6.1, 6.1],
                        [5.1, 5.1, 5.4, 5.7, 5.7],
                        [4.6, 4.6, 5.1, 5.6, 5.6],
                        [5.0, 5.0, 5.5, 6.5, 6.5],
                        [5.8, 5.8, 6.0, 6.5, 6.5],
                        [5.6, 5.6, 5.8, 6.0, 6.0],
                        [5.4, 5.4, 5.9, 6.1, 6.1],
                        [6.1, 6.1, 6.4, 6.9, 6.9],
                        [5.7, 5.7, 5.9, 6.0, 6.0],
                        [5.3, 5.3, 5.6, 6.0, 6.0],
                        [4.7, 4.7, 5.1, 5.3, 5.3],
                        [5.1, 5.1, 5.5, 5.8, 5.8],
                        [6.7, 6.7, 7.2, 7.6, 7.6],
                        [5.5, 5.5, 5.9, 6.2, 6.2],
                        [5.4, 5.4, 5.9, 6.1, 6.1],
                        [5.2, 5.2, 5.5, 5.8, 5.8]
                    ]
                }, {
                    name: '改良后',
                    type: 'boxplot',
                    fillColor: "#68b4b4",
                    pointWidth: 10,
                    eageColor: '#ffffff',
                    eageWidth: 0,
                    medianColor: '#ff6906',
                    medianWidth: 2,
                    whiskerLength: 10,
                    whiskerWidth: 5,
                    whiskerColor: '#278181',
                    data: [
                        [5.5, 5.5, 5.9, 6.5, 6.5],
                        [6.0, 6.0, 6.2, 7.0, 7.0],
                        [5.2, 5.2, 5.7, 6.0, 6.0],
                        [5.9, 5.9, 6.3, 6.6, 6.6],
                        [5.4, 5.4, 6.0, 6.3, 6.3],
                        [5.8, 5.8, 6.6, 7.5, 7.5],
                        [6.2, 6.2, 6.3, 6.5, 6.5],
                        [6.0, 6.0, 6.3, 6.7, 6.7],
                        [5.5, 5.5, 6.1, 6.4, 6.4],
                        [5.7, 5.7, 6.0, 6.3, 6.3],
                        [5.7, 5.7, 6.3, 7.0, 7.0],
                        [5.9, 5.9, 6.1, 6.3, 6.3],
                        [5.8, 5.8, 6.2, 6.5, 6.5],
                        [6.2, 6.2, 6.9, 7.6, 7.6],
                        [5.9, 5.9, 6.4, 6.9, 6.9],
                        [5.3, 5.3, 6.1, 7.2, 7.2],
                        [5.7, 5.7, 6.0, 6.3, 6.3],
                        [5.9, 5.9, 6.6, 7.2, 7.2],
                        [5.1, 5.1, 6.2, 6.7, 6.7],
                        [6.2, 6.2, 6.8, 7.2, 7.2],
                        [6.0, 6.0, 6.5, 6.8, 6.8],
                        [5.8, 5.8, 6.5, 7.0, 7.0],
                        [5.5, 5.5, 6.0, 6.4, 6.4],
                        [6.1, 6.1, 6.5, 7.3, 7.3],
                        [6.3, 6.3, 6.5, 7.0, 7.0],
                        [6.2, 6.2, 6.3, 6.4, 6.4],
                        [6.2, 6.2, 6.6, 6.8, 6.8],
                        [6.7, 6.7, 6.8, 7.0, 7.0],
                        [6.2, 6.2, 6.6, 7.0, 7.0],
                        [6.2, 6.2, 6.3, 6.6, 6.6],
                        [5.2, 5.2, 5.7, 5.9, 5.9],
                        [5.7, 5.7, 6.0, 6.5, 6.5],
                        [6.8, 6.8, 7.2, 7.4, 7.4],
                        [6.5, 6.5, 6.8, 7.0, 7.0],
                        [6.1, 6.1, 6.5, 6.8, 6.8],
                        [6.2, 6.2, 6.3, 6.6, 6.6]
                    ]
                }],
                credits: { enabled: false }
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