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
            this.chart = Highcharts.chart(this.$el, {
                colors: ['#bee3db', '#409eff', '#409eff', '#DDDF00', '#24CBE5', '#64E572', '#FF9655'],
                chart: {
                    inverted: false
                },
                title: {
                    text: '土壤元素变化范围'
                },
                xAxis: {
                    categories: ["2018-05","2018-06","2018-07","2018-08","2018-09","2019-05","2019-06","2019-07","2019-08","2019-09","2019-10"],
                },
                yAxis: {
                    title: {
                        text: '含量 (g/kg)'
                    }
                },
                plotOptions: {
                    columnrange: {
                        dataLabels: {
                            enabled: true,
                            formatter: function() {
                                return this.y
                            }
                        }
                    },
                    series: {
                        dataLabels: {
                            align: 'center',
                            enabled: true
                        }
                    }
                },
                legend: {
                    enabled: false
                },
                series: [{
                    name: '有机质',
                    type: 'columnrange', // columnrange 依赖 highcharts-more.js
                    data: [
                        [6.08, 19.27],
                        [11.52, 24.19],
                        [6.02, 17.41],
                        [11.23, 24.03],
                        [5.93, 17.28],
                        [10.75, 23.18],
                        [5.89, 17.45],
                        [11.02, 23.10],
                        [5.96, 18.85],
                        [10.64, 28.07],
                        [6.11, 18.49]
                    ]
                }, {
                    name: '平均值',
                    type: 'line', // columnrange 依赖 highcharts-more.js
                    data: [11.44,19.82,11.18,19.31,11.10,18.98,11.03,18.89,11.67,20.83,11.57]
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