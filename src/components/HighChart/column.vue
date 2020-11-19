<template>
    <div style="width:100%;height:680px" />
</template>
<script>
import Highcharts from "highcharts"
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
            this.initChart()
        }
    },
    mounted() {
        this.initChart()
    },
    methods: {
        initChart() {
            const xData = this.area1.concat(this.area2)
            this.chart = Highcharts.chart(this.$el, {
                colors: '#90e0ef,#ade8f4,#caf0f8,#0096c7,#00b4d8,#48cae4'.split(','),
                title: {
                    text: '改良前后土壤孔隙度改善'
                },
                xAxis: {
                    categories: xData,
                    lineColor: '#999',
                    lineWidth: 1
                },
                yAxis: [{
                    min: 0,
                    labels: {
                        format: '{value}%'
                    },
                    title: {
                        text: null
                    }
                },{
                    min: 0,
                    labels: {
                        format: '{value}g/cm3'
                    },
                    title: {
                        text: null
                    },
                    opposite: true
                }],
                tooltip: {
                    formatter: function() {
                        return '<b>' + this.x + '</b><br/>' + this.series.name + '孔隙度: ' + this.y + '%' + '<br/>' + '总孔隙度: ' + this.point.stackTotal + '%';
                    }
                },
                plotOptions: {
                    column: {
                        stacking: 'normal'
                    }
                },
                series: [{
                    name: '毛管',
                    data: [29.25, 27.35, 20.19, 29.32, 27.42, 28.86, 23.58, 24.7, 27.33, 28.14, 25.52, 30.04, 28.14, 27.9, 27.68, 30.55, 28.33, 27.43, 31.74, 29.24, 25.69, 27.5, 24.91, 22.95, 24.25, 25.17, 21.83, 24.45, 26.24, 27.77, 30.47, 24.61, 24.45, 27.05, 26.01, 25.99],
                    stack: 'male',
                    type: 'column'
                }, {
                    name: '非毛管',
                    data: [15.03, 17.04, 19.46, 12.77, 7.58, 12.61, 17.48, 19.56, 28.31, 22.33, 6.95, 12.77, 15.49, 13.69, 8.58, 10.56, 13.78, 13.43, 10.77, 15.24, 13.59, 17.45, 13.46, 22.44, 12.84, 26.65, 14.11, 16.83, 18.98, 22.33, 16.53, 16.64, 13.79, 13.28, 12.79, 16.51],
                    stack: 'male',
                    type: 'column'
                }, {
                    name: '改良后毛管',
                    data: [33.97, 30.3, 23.69, 31.09, 30.19, 32.58, 26.09, 29.88, 31.15, 32.94, 28.68, 36.02, 33.83, 33.13, 31.35, 34.22, 31.22, 29.73, 35.73, 34.1, 29.83, 31.34, 28.69, 27.85, 29.61, 30.08, 27.37, 29.49, 29.88, 31.65, 34.77, 30.03, 28.44, 32.43, 32.28, 31.72],
                    stack: 'female',
                    type: 'column'
                }, {
                    name: '改良后非毛管',
                    data: [11.59, 16.7, 20.05, 12.95, 8.08, 10.89, 17.63, 17.35, 25.06, 19.41, 6.27, 9.81, 11.86, 11.34, 6.9, 9.65, 13.64, 13.2, 7.11, 12.8, 12.32, 16.39, 12.14, 19.42, 9.62, 24.08, 13.87, 14.24, 17.45, 21.39, 16.13, 13.55, 14.37, 12.61, 11.52, 14.98],
                    stack: 'female',
                    type: 'column'
                }, {
                    name: '容重',
                    data: [1.62, 1.54, 1.4, 1.46, 1.51, 1.46, 1.37, 1.42, 1.62, 1.55, 1.5, 1.53, 1.45, 1.44, 1.49, 1.58, 1.64, 1.57, 1.64, 1.47, 1.43, 1.42, 1.63, 1.42, 1.54, 1.57, 1.58, 1.49, 1.54, 1.55, 1.42, 1.44, 1.65, 1.56, 1.68, 1.52],
                    yAxis: 1,
                    type: 'spline'
                }, {
                    name: '改良后容重',
                    data: [1.55, 1.45, 1.28, 1.39, 1.42, 1.36, 1.26, 1.36, 1.49, 1.42, 1.36, 1.41, 1.4, 1.36, 1.38, 1.52, 1.54, 1.51, 1.56, 1.38, 1.37, 1.36, 1.56, 1.34, 1.47, 1.48, 1.52, 1.41, 1.46, 1.48, 1.4, 1.37, 1.56, 1.47, 1.6, 1.46],
                    yAxis: 1,
                    type: 'spline'
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