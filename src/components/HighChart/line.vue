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
    mounted() {
        this.initChart()
    },
    methods: {
        initChart() {
            console.log('氮磷钾对比')
            const xData = this.type == 12 ? this.area1 : this.area2
            this.chart = Highcharts.chart(this.$el, {
                colors: ['#6CF', '#39F', '#06C', '#036', '#000'],
                chart: {
                    backgroundColor: 'rgba(0,0,0,0.0)'
                },
                title: {
                    text: this.type + '区改良平均提高值（%）'
                },
                xAxis: {
                    categories: xData,
                    lineColor: '#999',
                    crosshair: { width: 10, color: '#999'},
                    lineWidth: 1
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
                            color: '#333',
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
                    pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td><td style="padding:0"><b>{point.y:.1f}%</b></td></tr>',
                    footerFormat: '</table>',
                    shared: true,
                    useHTML: true
                },
                plotOptions: {
                    column: {
                        stacking: 'normal'
                    }
                },
                series: [{
                    name: '氮',
                    type: 'line',
                    data: this.type == 12 ? [43.31,27.95,30.99,64.50,38.80,31.91,27.96,22.81,27.32,27.66,40.67,45.93]:[28.94,44.99,21.88,48.43,16.45,22.81,47.78,17.55,78.19,18.38,26.13,15.77,45.03,47.07,39.42,27.58,39.23,25.00,34.39,20.35,16.46,18.43,24.94,17.57]
                }, {
                    name: '磷',
                    type: 'line',
                    data: this.type == 12 ? [24.00,48.15,35.97,57.62,41.18,37.30,39.16,47.67,47.94,37.92,51.32,57.71]:[22.57,20.88,21.61,24.18,48.91,22.72,22.34,29.03,77.93,89.54,38.50,23.32,68.12,42.20,46.34,12.98,19.48,28.81,18.78,34.67,55.19,43.51,48.34,25.53]
                }, {
                    name: '钾',
                    type: 'line',
                    data: this.type == 12 ? [46.34,44.87,61.02,38.63,60.82,61.33,55.08,19.22,35.57,65.19,40.29,60.66]:[29.33,43.87,39.09,51.24,46.47,39.48,48.09,35.76,46.49,58.24,77.32,48.30,49.62,28.24,45.31,88.56,51.37,62.76,41.58,34.21,62.89,84.86,33.13,30.18]
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