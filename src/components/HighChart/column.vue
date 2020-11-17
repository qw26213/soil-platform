<template>
    <div style="width:100%;height:450px" />
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
                chart: {
                    type: 'column'
                },
                title: {
                    text: '栖霞各区改良前后孔隙度对比(%)'
                },
                xAxis: {
                    categories: xData,
                    lineColor: '#999',
                    crosshair: { width: 10, color: '#999'},
                    lineWidth: 1
                },
                yAxis: {
                    allowDecimals: false,
                    min: 0,
                    title: {
                        text: null
                    }
                },
                tooltip: {
                    formatter: function() {
                        return '<b>' + this.x + '</b><br/>' + this.series.name + ': ' + this.y + '%' + '<br/>' + '总孔隙度: ' + this.point.stackTotal + '%';
                    }
                },
                plotOptions: {
                    column: {
                        stacking: 'normal'
                    }
                },
                series: [{
                    name: '毛管孔隙度',
                    data: [10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10],
                    stack: 'male'
                }, {
                    name: '非毛管孔隙度',
                    data: [10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10],
                    stack: 'male'
                }, {
                    name: '毛管孔隙度改良后',
                    data: [12,13,14,17,12,10,12,12,12,12,12,12,12,13,14,17,12,10,12,12,12,12,12,12,12,13,14,17,12,10,12,12,12,12,12,12],
                    stack: 'female' // stack 值相同的为同一组
                }, {
                    name: '非毛管孔隙度改良后',
                    data: [12,14,14,12,15,10,12,12,12,12,12,12,12,14,14,12,15,10,12,12,12,12,12,12,12,14,14,12,15,10,12,12,12,12,12,12],
                    stack: 'female'
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