<template>
    <div style="width:100%;height:300px" />
</template>
<script>
import Highcharts from "highcharts"
const eleJson = {
    "organic": "有机质,g/kg",
    "ph": "ph,",
    "tn": "全氮,g/kg",
    "ep": "有效磷,mg/kg",
    "rk": "速效钾,mg/kg",
    "efe": "有效态铁,ug/g",
    "emn": "有效态锰,ug/g",
    "ezn": "有效态锌,ug/g",
    "ecu": "有效态铜,ug/g",
    "pb": "铅,mg/g",
    "cd": "镉,mg/g",
    "cr": "铬,mg/g",
    "cu": "铜,mg/g",
    "ca": "交换性钙,g/kg",
    "mg": "交换性镁,g/kg",
    "Tporo": "总孔隙度,%",
    "Cporo": "毛管孔隙度,%",
    "Unporo": "非毛管孔隙度,%",
    "ben_rong": "本地容重,g/cm3",
    "rong": "容重,g/cm3"
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
            // this.chart = Highcharts.chart(this.$el, {
            //     colors: ['#44f0ff', '#fd377d', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655'],
            //     chart: {
            //         type: 'column',
            //         backgroundColor: 'rgba(0,0,0,0.0)'
            //     },
            //     title: {
            //         text: '土壤' + eleJson[ele].split(',')[0] + '变化',
            //         style: {
            //             color: '#333',
            //             fontSize: '14px'
            //         }
            //     },
            //     xAxis: {
            //         categories: xData,
            //         lineColor: '#999',
            //         crosshair: { width: 10, color: '#999'},
            //         lineWidth: 1,
            //         labels: {
            //             step: parseInt(xData.length / 4),
            //             staggerLines: 1,
            //             style: {
            //                 color: '#333',
            //                 fontSize: '12px',
            //                 fontFamily: '微软雅黑'
            //             }
            //         }
            //     },
            //     yAxis: {
            //         // min: 0,
            //         title: {
            //             text: null
            //         },
            //         gridLineColor: '#999',
            //         lineColor: '#999',
            //         lineWidth: 1,
            //         labels: {
            //             style: {
            //                 color: '#333',
            //                 fontSize: '12px',
            //                 fontFamily: '微软雅黑'
            //             }
            //         },
            //         plotLines: [{
            //             value: 0,
            //             width: 1,
            //             color: '#162b5f'
            //         }]
            //     },
            //     tooltip: {
            //         headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            //         pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td><td style="padding:0"><b>{point.y:.1f} '+ eleJson[ele].split(',')[1] +'</b></td></tr>',
            //         footerFormat: '</table>',
            //         shared: true,
            //         useHTML: true
            //     },
            //     legend: {
            //         itemStyle: {
            //             fontSize: '12px',
            //             color: '#333'
            //         }
            //     },
            //     plotOptions: {
            //         column: {
            //             borderWidth: 0
            //         }
            //     },
            //     series: [{
            //         name: '改良前',
            //         data: prevData
            //     }, {
            //         name: '改良后',
            //         data: curData
            //     }],
            //     credits: { enabled: false }
            // });
            this.chart = Highcharts.chart(this.$el, {
                chart: {
                    zoomType: 'xy'
                },
                title: {
                    text: '土壤有机场含量分布',
                    style: {
                        color: '#333',
                        fontSize: '14px'
                    }
                },
                xAxis: [{
                    categories: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'
                    ],
                    crosshair: true
                }],
                yAxis: [{ // Primary yAxis
                    labels: {
                        format: '{value}°C',
                        style: {
                            color: Highcharts.getOptions().colors[1]
                        }
                    },
                    title: {
                        text: null,
                        style: {
                            color: Highcharts.getOptions().colors[1]
                        }
                    }
                }, { // Secondary yAxis
                    title: {
                        text: null,
                        style: {
                            color: Highcharts.getOptions().colors[0]
                        }
                    },
                    labels: {
                        format: '{value} mm',
                        style: {
                            color: Highcharts.getOptions().colors[0]
                        }
                    },
                    opposite: true
                }],
                tooltip: {
                    shared: true
                },
                legend: {
                    itemStyle: {
                        fontSize: '12px',
                        color: '#333'
                    }
                },
                series: [{
                    name: '降雨量',
                    type: 'column',
                    yAxis: 1,
                    data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4],
                    tooltip: {
                        valueSuffix: ' mm'
                    }
                }, {
                    name: '温度',
                    type: 'spline',
                    data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6],
                    tooltip: {
                        valueSuffix: '°C'
                    }
                }],
                credits: { enabled: false }
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