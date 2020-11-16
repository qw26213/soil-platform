<template>
    <div style="width:100%;height:450px" />
</template>
<script>
import Highcharts from 'highcharts'
import highchartsMore from 'highcharts/highcharts-more';
import dumbbell from 'highcharts/modules/dumbbell'
highchartsMore(Highcharts)
dumbbell(Highcharts)
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
            this.initChart(this.chartData, this.xData, this.ele)
        }
    },
    mounted() {
        this.initChart(this.chartData, this.xData, this.ele)
    },
    methods: {
        initChart() {
            const xData = this.type == 12 ? this.area1 : this.area2
            this.chart = Highcharts.chart(this.$el, {
                chart: {
                    type: 'boxplot'
                },
                title: {
                    text: this.type + '区改良前后微量元素对比（mg/kg）'
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
                    pointFormat: '最大值: {point.high}<br/>最小值: {point.low}<br/>平均数: {point.median}'
                },
                series: [{
                    name: '观测值',
                    type: 'boxplot',
                    data: [
                        [760, 760, 848, 895, 895],
                        [760, 760, 848, 895, 895],
                        [760, 760, 848, 895, 895],
                        [760, 760, 848, 895, 895],
                        [760, 760, 848, 895, 895],
                        [760, 760, 848, 895, 895],
                        [760, 760, 848, 895, 895],
                        [760, 760, 848, 895, 895],
                        [760, 760, 848, 895, 895],
                        [760, 760, 848, 895, 895],
                        [760, 760, 848, 895, 895],
                        [760, 760, 848, 895, 895],
                        [760, 760, 848, 895, 895],
                        [760, 760, 848, 895, 895],
                        [760, 760, 848, 895, 895],
                        [760, 760, 848, 895, 895],
                        [760, 760, 848, 895, 895],
                        [760, 760, 848, 895, 895],
                        [760, 760, 848, 895, 895]
                    ]
                },{
                    name: '观测值',
                    type: 'boxplot',
                    data: [
                        [760, 760, 848, 895, 895],
                        [760, 760, 848, 895, 895],
                        [760, 760, 848, 895, 895],
                        [760, 760, 848, 895, 895],
                        [760, 760, 848, 895, 895],
                        [760, 760, 848, 895, 895],
                        [760, 760, 848, 895, 895],
                        [760, 760, 848, 895, 895],
                        [760, 760, 848, 895, 895],
                        [760, 760, 848, 895, 895],
                        [760, 760, 848, 895, 895],
                        [760, 760, 848, 895, 895],
                        [760, 760, 848, 895, 895],
                        [760, 760, 848, 895, 895],
                        [760, 760, 848, 895, 895],
                        [760, 760, 848, 895, 895],
                        [760, 760, 848, 895, 895],
                        [760, 760, 848, 895, 895],
                        [760, 760, 848, 895, 895]
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