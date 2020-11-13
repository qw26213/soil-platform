<template>
    <div style="width:1000px;height:720px;margin:0 auto" />
</template>
<script>
import Highcharts from 'highcharts'
import highchartsMore from 'highcharts/highcharts-more';
import HeatMap from 'highcharts/modules/heatmap'
import TileMap from 'highcharts/modules/tilemap'
highchartsMore(Highcharts)
HeatMap(Highcharts)
TileMap(Highcharts)
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
        initChart() {
            this.chart = Highcharts.chart(this.$el, {
                chart: {
                    type: 'tilemap',
                    inverted: true,
                    height: '80%'
                },
                title: {
                    text: '栖霞各区土壤有机质对比'
                },
                xAxis: {
                    visible: false
                },
                yAxis: {
                    visible: false
                },
                colorAxis: {
                    dataClasses: [{
                        from: 0,
                        to: 1000000,
                        color: '#F9EDB3',
                        name: '< 1M'
                    }, {
                        from: 1000000,
                        to: 5000000,
                        color: '#FFC428',
                        name: '1M - 5M'
                    }, {
                        from: 5000000,
                        to: 20000000,
                        color: '#FF7987',
                        name: '5M - 20M'
                    }, {
                        from: 20000000,
                        color: '#FF2371',
                        name: '> 20M'
                    }]
                },
                tooltip: {
                    headerFormat: '',
                    pointFormat: 'The population of <b> {point.name}</b> is <b>{point.value}</b>'
                },
                plotOptions: {
                    series: {
                        dataLabels: {
                            enabled: true,
                            format: '{point.hc-a2}',
                            color: '#000000',
                            style: {
                                textOutline: false
                            }
                        }
                    }
                },
                series: [{
                    name: '',
                    data: [{
                        'hc-a2': 'AL',
                        name: 'Alabama',
                        region: 'South',
                        x: 6,
                        y: 7,
                        value: 4849377
                    }, {
                        'hc-a2': 'AK',
                        name: 'Alaska',
                        region: 'West',
                        x: 0,
                        y: 0,
                        value: 737732
                    }, {
                        'hc-a2': 'AZ',
                        name: 'Arizona',
                        region: 'West',
                        x: 5,
                        y: 3,
                        value: 6745408
                    }, {
                        'hc-a2': 'AR',
                        name: 'Arkansas',
                        region: 'South',
                        x: 5,
                        y: 6,
                        value: 2994079
                    }, {
                        'hc-a2': 'CA',
                        name: 'California',
                        region: 'West',
                        x: 5,
                        y: 2,
                        value: 39250017
                    }, {
                        'hc-a2': 'CO',
                        name: 'Colorado',
                        region: 'West',
                        x: 4,
                        y: 3,
                        value: 5540545
                    }, {
                        'hc-a2': 'CT',
                        name: 'Connecticut',
                        region: 'Northeast',
                        x: 3,
                        y: 11,
                        value: 3596677
                    }, {
                        'hc-a2': 'DE',
                        name: 'Delaware',
                        region: 'South',
                        x: 4,
                        y: 9,
                        value: 935614
                    }, {
                        'hc-a2': 'DC',
                        name: 'District of Columbia',
                        region: 'South',
                        x: 4,
                        y: 10,
                        value: 7288000
                    }, {
                        'hc-a2': 'FL',
                        name: 'Florida',
                        region: 'South',
                        x: 8,
                        y: 8,
                        value: 20612439
                    }, {
                        'hc-a2': 'GA',
                        name: 'Georgia',
                        region: 'South',
                        x: 7,
                        y: 8,
                        value: 10310371
                    }, {
                        'hc-a2': 'HI',
                        name: 'Hawaii',
                        region: 'West',
                        x: 8,
                        y: 0,
                        value: 1419561
                    }, {
                        'hc-a2': 'ID',
                        name: 'Idaho',
                        region: 'West',
                        x: 3,
                        y: 2,
                        value: 1634464
                    }, {
                        'hc-a2': 'IL',
                        name: 'Illinois',
                        region: 'Midwest',
                        x: 3,
                        y: 6,
                        value: 12801539
                    }, {
                        'hc-a2': 'IN',
                        name: 'Indiana',
                        region: 'Midwest',
                        x: 3,
                        y: 7,
                        value: 6596855
                    }, {
                        'hc-a2': 'IA',
                        name: 'Iowa',
                        region: 'Midwest',
                        x: 3,
                        y: 5,
                        value: 3107126
                    }, {
                        'hc-a2': 'KS',
                        name: 'Kansas',
                        region: 'Midwest',
                        x: 5,
                        y: 5,
                        value: 2904021
                    }, {
                        'hc-a2': 'KY',
                        name: 'Kentucky',
                        region: 'South',
                        x: 4,
                        y: 6,
                        value: 4413457
                    }, {
                        'hc-a2': 'LA',
                        name: 'Louisiana',
                        region: 'South',
                        x: 6,
                        y: 5,
                        value: 4649676
                    }, {
                        'hc-a2': 'ME',
                        name: 'Maine',
                        region: 'Northeast',
                        x: 0,
                        y: 11,
                        value: 1330089
                    }, {
                        'hc-a2': 'MD',
                        name: 'Maryland',
                        region: 'South',
                        x: 4,
                        y: 8,
                        value: 6016447
                    }, {
                        'hc-a2': 'MA',
                        name: 'Massachusetts',
                        region: 'Northeast',
                        x: 2,
                        y: 10,
                        value: 6811779
                    }, {
                        'hc-a2': 'MI',
                        name: 'Michigan',
                        region: 'Midwest',
                        x: 2,
                        y: 7,
                        value: 9928301
                    }, {
                        'hc-a2': 'MN',
                        name: 'Minnesota',
                        region: 'Midwest',
                        x: 2,
                        y: 4,
                        value: 5519952
                    }, {
                        'hc-a2': 'MS',
                        name: 'Mississippi',
                        region: 'South',
                        x: 6,
                        y: 6,
                        value: 2984926
                    }, {
                        'hc-a2': 'MO',
                        name: 'Missouri',
                        region: 'Midwest',
                        x: 4,
                        y: 5,
                        value: 6093000
                    }, {
                        'hc-a2': 'MT',
                        name: 'Montana',
                        region: 'West',
                        x: 2,
                        y: 2,
                        value: 1023579
                    }, {
                        'hc-a2': 'NE',
                        name: 'Nebraska',
                        region: 'Midwest',
                        x: 4,
                        y: 4,
                        value: 1881503
                    }, {
                        'hc-a2': 'NV',
                        name: 'Nevada',
                        region: 'West',
                        x: 4,
                        y: 2,
                        value: 2839099
                    }, {
                        'hc-a2': 'NH',
                        name: 'New Hampshire',
                        region: 'Northeast',
                        x: 1,
                        y: 11,
                        value: 1326813
                    }, {
                        'hc-a2': 'NJ',
                        name: 'New Jersey',
                        region: 'Northeast',
                        x: 3,
                        y: 10,
                        value: 8944469
                    }, {
                        'hc-a2': 'NM',
                        name: 'New Mexico',
                        region: 'West',
                        x: 6,
                        y: 3,
                        value: 2085572
                    }, {
                        'hc-a2': 'NY',
                        name: 'New York',
                        region: 'Northeast',
                        x: 2,
                        y: 9,
                        value: 19745289
                    }, {
                        'hc-a2': 'NC',
                        name: 'North Carolina',
                        region: 'South',
                        x: 5,
                        y: 9,
                        value: 10146788
                    }, {
                        'hc-a2': 'ND',
                        name: 'North Dakota',
                        region: 'Midwest',
                        x: 2,
                        y: 3,
                        value: 739482
                    }, {
                        'hc-a2': 'OH',
                        name: 'Ohio',
                        region: 'Midwest',
                        x: 3,
                        y: 8,
                        value: 11614373
                    }, {
                        'hc-a2': 'OK',
                        name: 'Oklahoma',
                        region: 'South',
                        x: 6,
                        y: 4,
                        value: 3878051
                    }, {
                        'hc-a2': 'OR',
                        name: 'Oregon',
                        region: 'West',
                        x: 4,
                        y: 1,
                        value: 3970239
                    }, {
                        'hc-a2': 'PA',
                        name: 'Pennsylvania',
                        region: 'Northeast',
                        x: 3,
                        y: 9,
                        value: 12784227
                    }, {
                        'hc-a2': 'RI',
                        name: 'Rhode Island',
                        region: 'Northeast',
                        x: 2,
                        y: 11,
                        value: 1055173
                    }, {
                        'hc-a2': 'SC',
                        name: 'South Carolina',
                        region: 'South',
                        x: 6,
                        y: 8,
                        value: 4832482
                    }, {
                        'hc-a2': 'SD',
                        name: 'South Dakota',
                        region: 'Midwest',
                        x: 3,
                        y: 4,
                        value: 853175
                    }, {
                        'hc-a2': 'TN',
                        name: 'Tennessee',
                        region: 'South',
                        x: 5,
                        y: 7,
                        value: 6651194
                    }, {
                        'hc-a2': 'TX',
                        name: 'Texas',
                        region: 'South',
                        x: 7,
                        y: 4,
                        value: 27862596
                    }, {
                        'hc-a2': 'UT',
                        name: 'Utah',
                        region: 'West',
                        x: 5,
                        y: 4,
                        value: 2942902
                    }, {
                        'hc-a2': 'VT',
                        name: 'Vermont',
                        region: 'Northeast',
                        x: 1,
                        y: 10,
                        value: 626011
                    }, {
                        'hc-a2': 'VA',
                        name: 'Virginia',
                        region: 'South',
                        x: 5,
                        y: 8,
                        value: 8411808
                    }, {
                        'hc-a2': 'WA',
                        name: 'Washington',
                        region: 'West',
                        x: 2,
                        y: 1,
                        value: 7288000
                    }, {
                        'hc-a2': 'WV',
                        name: 'West Virginia',
                        region: 'South',
                        x: 4,
                        y: 7,
                        value: 1850326
                    }, {
                        'hc-a2': 'WI',
                        name: 'Wisconsin',
                        region: 'Midwest',
                        x: 2,
                        y: 5,
                        value: 5778708
                    }, {
                        'hc-a2': 'WY',
                        name: 'Wyoming',
                        region: 'West',
                        x: 3,
                        y: 3,
                        value: 584153
                    }]
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