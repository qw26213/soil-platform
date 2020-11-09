<template>
    <div id="map" class="map">
        <div>
            <ul class="base-map" :style="{right: tool ? '175px' : '20px'}">
                <li v-for="(item, index) in baseMaps" :key="index" :class="item.id === baseMap ? 'active' : ''" @click="baseMap = item.id">
                    <label>{{ item.label }}</label>
                </li>
            </ul>
            <div v-show="baseMap === 'img'" :style="{right: tool ? '298px'  : '145px'}" class="road-control">
                <el-checkbox v-model="isRoad">路网</el-checkbox>
            </div>
        </div>
        <map-tool v-show="tool" ref="maptool" :map="map" @set-info="setInfo" @marker-click="markerClick" :dist="dist" />
        <map-nav ref="mapnav" :map="map"></map-nav>
        <map-layer ref="maplyr" :map="map" v-if="layer"></map-layer>
        <div class="info-box" v-show="infoContent !== ''" v-html="infoContent"></div>
        <div class="init-location" @click="locate2Ip">
            <span class="el-icon-location"></span>
        </div>
        <el-dialog :close-on-click-modal="false" title="查看趋势图" :visible.sync="dialogVisible" width="800px">
            <div id="lineGraph" style="min-width:600px;height:400px"></div>
        </el-dialog>
    </div>
</template>
<script>
import MapNav from './map-nav';
import MapLayer from './map-layers';
import MapTool from './map-tool';
import axios from 'axios';
import Highcharts from "highcharts";
axios.jsonp = (url, data) => {
    if (!url)
        throw new Error('url is necessary')
    const callback = 'CALLBACK' + Math.random().toString().substr(9, 18)
    const JSONP = document.createElement('script')
    JSONP.setAttribute('type', 'text/javascript')
    const headEle = document.getElementsByTagName('head')[0]
    let ret = '';
    if (data) {
        if (typeof data === 'string')
            ret = '&' + data;
        else if (typeof data === 'object') {
            for (let key in data)
                ret += '&' + key + '=' + encodeURIComponent(data[key]);
        }
        ret += '&_time=' + Date.now();
    }
    JSONP.src = `${url}?callback=${callback}${ret}`;
    return new Promise((resolve, reject) => {
        window[callback] = r => {
            resolve(r)
            headEle.removeChild(JSONP)
            delete window[callback]
        }
        headEle.appendChild(JSONP)
    })
}
const AMAPURL = 'https://restapi.amap.com/v3/';
const AMAPKEY = '9b35a675e309f3a8b78464527e975b99'; //'2c47919476d302b7eab0e363e94624aa';
const TDTKEY = 'c6a74bc1b752d5cfa699dbd386cafcf7';
const WEBURL = window.origin + '/lib/mapbox/';
export default {
    props: {
        center: {
            type: Array,
            default: () => {
                return [89.54, 32.549];
            }
        },
        zoom: {
            type: Number,
            default: 3
        },
        dist: {
            type: Number,
            default: 10
        },
        tool: {
            type: Boolean,
            default: () => {
                return true;
            }
        },
        layer: {
            type: Boolean,
            default: () => {
                return true;
            }
        }
    },
    components: {
        // MapSearch,
        MapNav,
        MapTool,
        MapLayer
    },
    data() {
        return {
            dialogVisible: false,
            baseMaps: [{ id: 'img', label: '影像' }, { id: 'vec', label: '矢量' }],
            baseMap: 'img',
            isRoad: true,
            map: null,
            infoContent: ''
        };
    },
    computed: {},
    watch: {
        baseMap(val) {
            const isVecShow = val === 'vec' ? 'visible' : 'none';
            const isImgShow = val === 'img' ? 'visible' : 'none';
            // map.setLayoutProperty('GaoDeVector', 'visibility', isVecShow);
            // map.setLayoutProperty('GaoDeImage', 'visibility', isImgShow);
            map.setLayoutProperty('TdtVector', 'visibility', isVecShow);
            map.setLayoutProperty('TdtVecLabel', 'visibility', isVecShow);
            map.setLayoutProperty('TdtImage', 'visibility', isImgShow);
            if (val === 'vec') this.isRoad = false;
            else this.isRoad = true;
        },
        isRoad(val) {
            const isShow = val ? 'visible' : 'none';
            // map.setLayoutProperty('GaoDeLabel', 'visibility', isShow);
            map.setLayoutProperty('TdtImgLabel', 'visibility', isShow);
        }
    },
    mounted() {
        this.init();
    },
    methods: {
        init() {
            this.initMap();
        },
        locate2Ip() {
            const url = AMAPURL + 'ip';
            const params = {
                key: AMAPKEY
            };
            axios.jsonp(url, params).then(function(res) {
                const rectangle = res.rectangle.split(';');
                const min = rectangle[0].split(',').map(Number);
                const max = rectangle[1].split(',').map(Number);
                const bbox = [min, max];
                const padding = 80;
                map.fitBounds(bbox, {
                    padding: {
                        top: padding,
                        bottom: padding,
                        left: padding,
                        right: padding
                    }
                });
            }).catch(function(error) {});
        },
        initMap() {
            const that = this;
            const tileBase = '.tianditu.gov.cn/DataServer?T=';
            const tileXyz = `&tk=${TDTKEY}&x={x}&y={y}&l={z}`;
            const vec_w = 'vec_w';
            const cva_w = 'cva_w';
            const img_w = 'img_w';
            const cia_w = 'cia_w';
            const mapStyle = {
                version: 8,
                name: 'Dark',
                sources: {
                    TdtVector: {
                        type: 'raster',
                        tiles: [
                            `https://t0${tileBase + vec_w + tileXyz}`,
                            `https://t1${tileBase + vec_w + tileXyz}`,
                            `https://t2${tileBase + vec_w + tileXyz}`,
                            `https://t3${tileBase + vec_w + tileXyz}`,
                            `https://t4${tileBase + vec_w + tileXyz}`,
                            `https://t5${tileBase + vec_w + tileXyz}`,
                            `https://t6${tileBase + vec_w + tileXyz}`,
                            `https://t7${tileBase + vec_w + tileXyz}`
                        ],
                        tileSize: 256
                    },
                    TdtVecLabel: {
                        type: 'raster',
                        tiles: [
                            `https://t0${tileBase + cva_w + tileXyz}`,
                            `https://t1${tileBase + cva_w + tileXyz}`,
                            `https://t2${tileBase + cva_w + tileXyz}`,
                            `https://t3${tileBase + cva_w + tileXyz}`,
                            `https://t4${tileBase + cva_w + tileXyz}`,
                            `https://t5${tileBase + cva_w + tileXyz}`,
                            `https://t6${tileBase + cva_w + tileXyz}`,
                            `https://t7${tileBase + cva_w + tileXyz}`
                        ],
                        tileSize: 256
                    },
                    TdtImage: {
                        type: 'raster',
                        tiles: [
                            `https://t0${tileBase + img_w + tileXyz}`,
                            `https://t1${tileBase + img_w + tileXyz}`,
                            `https://t2${tileBase + img_w + tileXyz}`,
                            `https://t3${tileBase + img_w + tileXyz}`,
                            `https://t4${tileBase + img_w + tileXyz}`,
                            `https://t5${tileBase + img_w + tileXyz}`,
                            `https://t6${tileBase + img_w + tileXyz}`,
                            `https://t7${tileBase + img_w + tileXyz}`
                        ],
                        tileSize: 256
                    },
                    TdtImgLabel: {
                        type: 'raster',
                        tiles: [
                            `https://t0${tileBase + cia_w + tileXyz}`,
                            `https://t1${tileBase + cia_w + tileXyz}`,
                            `https://t2${tileBase + cia_w + tileXyz}`,
                            `https://t3${tileBase + cia_w + tileXyz}`,
                            `https://t4${tileBase + cia_w + tileXyz}`,
                            `https://t5${tileBase + cia_w + tileXyz}`,
                            `https://t6${tileBase + cia_w + tileXyz}`,
                            `https://t7${tileBase + cia_w + tileXyz}`
                        ],
                        tileSize: 256
                    }
                },
                glyphs: WEBURL + "fonts/{fontstack}/{range}.pbf",
                sprite: WEBURL + "sprite_icons",
                layers: [{
                    id: 'TdtVector',
                    type: 'raster',
                    source: 'TdtVector',
                    minzoom: 3,
                    maxzoom: 18,
                    layout: {
                        visibility: 'none'
                    }
                }, {
                    id: 'TdtVecLabel',
                    type: 'raster',
                    source: 'TdtVecLabel',
                    minzoom: 3,
                    maxzoom: 18,
                    layout: {
                        visibility: 'none'
                    }
                }, {
                    id: 'TdtImage',
                    type: 'raster',
                    source: 'TdtImage',
                    minzoom: 3,
                    maxzoom: 18
                }, {
                    id: 'TdtImgLabel',
                    type: 'raster',
                    source: 'TdtImgLabel',
                    minzoom: 3,
                    maxzoom: 18
                }, {
                    id: "background",
                    type: "background",
                    paint: {
                        "background-color": "rgba(0, 0, 0, 0)"
                    }
                }]
            };
            window.map = new mapboxgl.Map({
                container: 'map',
                maxZoom: 17.3,
                minZoom: 3,
                zoom: that.zoom,
                center: that.center,
                style: mapStyle,
                attributionControl: false
            });
            that.map = window.map;
            map.on('load', function() {
                that.$emit('map-loaded');
                that.addControls();
                that.$refs.maptool.init();
                that.$refs.maplyr.init();
                that.locate2Ip();
            });
        },
        markerClick(prop) {
            const that = this;
            that.$emit('marker-click', prop);
        },
        setInfo(info) {
            this.infoContent = info;
        },
        addControls() {
            let nav = new mapboxgl.NavigationControl();
            map.addControl(nav, 'bottom-right');
            let scale = new mapboxgl.ScaleControl({
                maxWidth: 80,
                unit: 'metric'
            });
            map.addControl(scale);
        },
        // 缩放至坐标
        locate2Lonlat(lonlat, zoom) {
            this.$refs.mapnav.locate2Lonlat(lonlat, zoom);
        },
        locate2Polygon(polygon) {
            this.$refs.mapnav.locate2Polygon(polygon);
        },
        // 获取绘制的点 圈地数据
        getDrawData() {
            const drawData = this.$refs.maptool.getDrawData();
            return drawData;
        },
        clearDrawData() {
            this.$refs.maptool.clearDrawData();
        },
        locateZoneByName(name) {
            const that = this;
            const url = AMAPURL + 'config/district';
            const params = {
                keywords: name,
                subdistrict: 0,
                extensions: 'all',
                key: AMAPKEY
            };
            axios.jsonp(url, params).then(function(res) {
                const district = res.districts[0];
                const center = district.center.split(',').map(Number);
                let zoom = map.getZoom();
                switch (district.level) {
                    case 'province':
                        {
                            zoom = 5;
                            break;
                        }
                    case 'city':
                        {
                            zoom = 7;
                            break;
                        }
                    case 'district':
                        {
                            zoom = 9;
                            break;
                        }
                    case 'street':
                        {
                            zoom = 11;
                            break;
                        }
                }
                that.locate2Lonlat(center, zoom);
            }).catch(function(error) {});
        },
        locateVillageByName(name, city) {
            const that = this;
            const url = AMAPURL + 'place/text';
            const params = {
                keywords: name,
                types: '地名地址信息;普通地名;村庄级地名',
                city: city,
                key: AMAPKEY,
                extensions: 'all'
            };
            axios.jsonp(url, params).then(function(res) {
                let zoom = 13;
                let center = [];
                if (res.pois.length > 0) {
                    const poi = res.pois[0];
                    center = poi.location.split(',').map(Number);
                } else {
                    const sugAddress = res['sug_address'];
                    center = sugAddress.location.split(',').map(Number);
                }
                that.locate2Lonlat(center, zoom);
            }).catch(function(error) {});
        },
        showMarkers(markers) {
            this.$refs.maptool.showMarkers(markers);
        },
        showFreeMarkers(markers) {
            this.$refs.maptool.showFreeMarkers(markers);
        },
        showPolygons(polygons, isZoom) {
            this.$refs.maptool.showPolygons(polygons, isZoom);
        },
        removeMarkers() {
            this.$refs.maptool.removeMarkers();
        },
        removePolygons() {
            this.$refs.maptool.removePolygons();
        },
        addDataCompare(data) {
            if (map.getSource('data-compare-point')) {
                map.removeLayer('data-compare-point');
                map.removeLayer('data-compare-line');
                map.removeSource('data-compare-point');
                map.removeSource('data-compare-line');
            }
            let fPoints = [];
            const points = {
                type: 'FeatureCollection',
                features: fPoints
            }
            let fLines = [];
            const lines = {
                type: 'FeatureCollection',
                features: fLines
            };
            const arr = data.filter(it => it.properties && it.properties.related_geometry && it.properties.related_geometry.coordinates && it.geometry && it.geometry.coordinates)
            arr.forEach((d, i) => {
                fPoints.push({
                    type: 'Feature',
                    geometry: {
                        type: 'Point',
                        coordinates: d.properties.related_geometry.coordinates
                    },
                    properties: {
                        id: i
                    }
                });
                fLines.push({
                    type: 'Feature',
                    geometry: {
                        type: 'LineString',
                        coordinates: [d.geometry.coordinates, d.properties.related_geometry.coordinates]
                    },
                    properties: {
                        id: i
                    }
                });
            })
            map.addSource('data-compare-point', {
                type: 'geojson',
                data: points
            });
            map.addLayer({
                id: 'data-compare-point',
                type: 'circle',
                source: 'data-compare-point',
                paint: {
                    'circle-color': [
                        'match',
                        ['get', 'id'],
                        1, '#ffe500',
                        -1, '#f14feb',
                        '#ffe500'
                    ],
                    'circle-radius': 6,
                    'circle-stroke-width': 2,
                    'circle-stroke-color': '#ffffff'
                }
            });
            map.addSource('data-compare-line', {
                type: 'geojson',
                data: lines
            });
            map.addLayer({
                id: 'data-compare-line',
                type: 'line',
                source: 'data-compare-line',
                paint: {
                    'line-color': '#0e95ef',
                    'line-width': 2,
                    'line-dasharray': [5, 2]
                }
            });
        },
        initChart(xData, yData1, yData2, yData3, yData4) {
            var chart = Highcharts.chart('lineGraph', {
                chart: {
                    type: 'line'
                },
                title: {
                    text: '栖霞市土壤数据变化'
                },
                xAxis: {
                    categories: xData,
                    crosshair: true
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: '降雨量 (mm)'
                    }
                },
                tooltip: {
                    headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                    pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                        '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
                    footerFormat: '</table>',
                    shared: true,
                    useHTML: true
                },
                plotOptions: {
                    column: {
                        borderWidth: 0
                    }
                },
                series: [{
                    name: '改良前',
                    data: yData1
                }, {
                    name: '改良后',
                    data: yData2
                }, {
                    name: '改良前',
                    data: yData3
                }, {
                    name: '改良后',
                    data: yData4
                }]
            });
        }
    }
};
</script>
<style scoped lang="scss">
$main-color: #409eff;
$padding: 20px;
$border-radius: 4px;

.map {
    height: 100%;
    width: 100%;
}

.init-location {
    position: absolute;
    right: 20px;
    bottom: 175px;
    z-index: 99;
    background: white;
    width: 29px;
    height: 29px;
    line-height: 29px;
    text-align: center;
    font-size: 18px;
    border-radius: 4px;
    cursor: pointer;
}

.info-box {
    position: absolute;
    top: $padding * 3.5;
    right: $padding;
    padding: 10px 20px;
    background-color: #ffffff;
    box-sizing: border-box;
    opacity: 0.8;
    z-index: 99;
    border-radius: $border-radius;
}

.base-map {
    position: absolute;
    top: $padding;
    right: 175px;
    z-index: 99;
    margin: 0;
    border-radius: $border-radius;

    li {
        padding: 0 15px;
        height: $padding + 10px;
        line-height: $padding + 10px;
        text-align: center;
        cursor: pointer;
        border: 1px solid $main-color;
        border-right: 1px solid $main-color;
        color: $main-color;
        background-color: white;
        float: left;
        position: relative;
        font-size: 14px;

        i {
            font-size: 16px;
        }

        label {
            font-weight: normal;
            cursor: pointer;
        }

        &:first-child {
            border-top-left-radius: $border-radius;
            border-bottom-left-radius: $border-radius;
            border-right: none;
        }

        &:last-child {
            border-top-right-radius: $border-radius;
            border-bottom-right-radius: $border-radius;
            border-left: none;
        }

        &.active {
            background-color: $main-color;
            color: white;
        }
    }
}

.road-control {
    position: absolute;
    top: 21px;
    right: 175px + 120px + 3px;
    white-space: nowrap;
    z-index: 99;
    background-color: white;
    height: $padding + 10px;
    line-height: $padding + 10px;
    border-radius: $border-radius;
    padding: 0 6px;
}
</style>
<style lang="scss">
$popup-width: 200px;
$main-color: #409eff;
$padding: 20px;
$border-radius: 4px;

ul,
li {
    list-style: none;
}

.mapboxgl-ctrl-bottom-right {
    right: 10px;
    bottom: 70px;
}

.mapboxgl-ctrl-bottom-left {
    left: calc(50% - 20px);
    bottom: $padding;
}

.map-popup {
    max-width: 1000px !important;
    border-radius: $border-radius !important;
    z-index: 11;
    padding: 0;

    .mapboxgl-popup-content {
        padding: 0;
    }

    .popup-title {
        height: $padding + 15px;
        line-height: $padding + 15px;
        background: $main-color;
        color: white;
        font-size: 16px;
        padding: 0 $padding / 2;
        font-weight: bold;
        border-top-left-radius: $border-radius;
        border-top-right-radius: $border-radius;

        label {
            display: inline-block;
            max-width: 260px;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            padding-right: 15px;
        }

        .popup-close {
            float: right;
            cursor: pointer;
        }
    }

    .popup-content {
        padding: $padding / 2;

        button {
            float: right;
        }
    }
}

.delete-button {
    padding: 1px 8px;
    background: rgba(255, 255, 255, 0.8);
    border-radius: 3px;
    cursor: pointer;

    &:hover {
        color: $main-color;
    }
}

.measure-result {
    padding: 0 3px;
    background: rgba(255, 255, 255, 0.8);
    border-radius: 3px;

    &.close {
        padding: 0;
        cursor: pointer;
        width: 12px;
        height: 12px;
        line-height: 12px;
        text-align: center;
    }
}
</style>