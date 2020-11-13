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
            area1: ['臧家庄1区', '观里2区', '观里3区', '蛇窝泊4区', '蛇窝泊5区', '官道6区', '官道7区', '官道8区', '杨础9区', '杨础10区', '杨础1区', '松山12区'],
            area2: ['臧家庄1区', '臧家庄2区', '臧家庄3区', '观里4区', '观里5区', '观里6区', '蛇窝泊7区', '蛇窝泊8区', '蛇窝泊9区', '官道10区', '官道11区', '官道12区', '杨础13区', '杨础14区', '杨础15区', '松山16区', '松山17区', '松山18区', '苏家店19区', '苏家店20区', '寺口21区', '寺口22区', '唐家坡23区', '唐家坡24区'],
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
            const xData = this.type == 12 ? this.area1 : this.area2
            this.chart = Highcharts.chart(this.$el, {
                colors: '#90e0ef,#ade8f4,#caf0f8,#0096c7,#00b4d8,#48cae4'.split(','),
                chart: {
                    type: 'column'
                },
                title: {
                    text: this.type + '区改良前后孔隙度对比（%）'
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
                    data: this.type == 12 ? [10,10,10,10,10,10,10,10,10,10,10,10]:[10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10],
                    stack: 'male'
                }, {
                    name: '非毛管孔隙度',
                    data: this.type == 12 ? [10,10,10,10,10,10,10,10,10,10,10,10]:[10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10],
                    stack: 'male'
                }, {
                    name: '毛管孔隙度改良后',
                    data: this.type == 12 ? [12,13,14,17,12,10,12,12,12,12,12,12]:[12,13,14,17,12,10,12,12,12,12,12,12,12,13,14,17,12,10,12,12,12,12,12,12],
                    stack: 'female' // stack 值相同的为同一组
                }, {
                    name: '非毛管孔隙度改良后',
                    data: this.type == 12 ? [12,14,14,12,15,10,12,12,12,12,12,12]:[12,14,14,12,15,10,12,12,12,12,12,12,12,14,14,12,15,10,12,12,12,12,12,12],
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