<template>
    <div style="width:100%;height:450px" />
</template>
<script>
import Highcharts from "highcharts"
export default {
    name: 'HighChart',
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
            const arr = [{
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
            const data = arr.map((item,index) => {
                return {
                    name: xData[index],
                    low: item.low,
                    high: item.high
                }
            })
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