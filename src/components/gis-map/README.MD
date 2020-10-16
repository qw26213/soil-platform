## 引入mapboxgl和turf.js
为方便后面的使用，引入的时候没有选择用es6的方式，而是选用传统的script标签方式引入。
```html
<link rel="stylesheet" href="./lib/mapbox/mapbox-gl.css" type="text/css">
<script type='text/javascript' src='./lib/mapbox/mapbox-gl.js'></script>
<script type='text/javascript' src='./lib/turf/turf.js'></script>
```

## 组件说明
组件位于`src/components/gis-map/`目录下，其中：
#### 1. index.vue
地图组件，实现地图的初始化，以及一些基本的地图控件。如：底图、比例尺、缩放控制等。

|参数|类型|是否必须|默认值|
| :-------------: |:-------------:|:-------------:|:-------------:|
|center|array|N|[89.54, 32.549]|
|zoom|int|N|3|
|tool|boolean|N|true|

#### 2. map-nav.vue
集成到map组件中去，以接口的方式提供：

##### 1.缩放到经纬度（**locate2Lonlat**）

|参数|类型|是否必须|默认值|
| :-------------: |:-------------:|:-------------:|:-------------:|
|lonlat|array|Y|无|
|zoom|int|N|当前地图级别|

##### 2.缩放到多边形（**locate2Polygon**）

|参数|类型|是否必须|默认值|
| :-------------: |:-------------:|:-------------:|:-------------:|
|polygon|Object|Y|无|
参数polygon的参考格式如下：
```json
{
    "type": "Feature",
    "geometry": {
        "type": "Polygon",
        "coordinates": [
            [
                [
                    108.524378,
                    37.7553956
                ],
                [
                    104.832966,
                    35.211841
                ],
                [
                    110.457967,
                    33.616779
                ],
                [
                    111.248987,
                    36.494059
                ],
                [
                    111.248987,
                    36.494059
                ],
                [
                    111.2489837,
                    36.4940595
                ],
                [
                    108.5243768,
                    37.75539536
                ]
            ]
        ]
    },
    "properties": {}
}
```
##### 3. 根据名称缩放(**locateZoneByName**)
|参数|类型|是否必须|默认值|
| :-------------: |:-------------:|:-------------:|:-------------:|
|name|String|Y|无|

##### 4. 根据名称,城市缩放村庄(**locateVillageByName**)
|参数|类型|是否必须|默认值|
| :-------------: |:-------------:|:-------------:|:-------------:|
|name|String|Y|无|
|city|String|Y|无|

##### 5. 清除地图绘制(**clearDrawData**)

##### 6. 绘制点的回显(**showMarkers**)
|参数|类型|是否必须|默认值|
| :-------------: |:-------------:|:-------------:|:-------------:|
|markers|Array|Y|无|
参数格式如下：
```json
[
    {
        "type": "Feature",
        "geometry": {
            "type": "Point",
            "coordinates": [
                108.20697,
                36.470206
            ]
        },
        "properties": {
            "index": 0
        }
    },
    {
        "type": "Feature",
        "geometry": {
            "type": "Point",
            "coordinates": [
                108.20697,
                36.470206
            ]
        },
        "properties": {
            "index": 0
        }
    }
]
```

##### 7. 绘制面的回显(**showPolygons**)
|参数|类型|是否必须|默认值|
| :-------------: |:-------------:|:-------------:|:-------------:|
|polygons|Array|Y|无|

##### 8. 移除点的回显(**removeMarkers**)

##### 9. 移除面的回显(**removePolygons**)

##### 10.回显点的事件(**marker-click**)
```sql
<gis-map
   @marker-click="markerClick"/>
```

#### 3. map-tool.vue
地图工具，主要包括：地块区域的绘制以及地块绘制完后的地图打点，并提供接口获取绘制数据。

##### 1.获取绘制数据（**getDrawData**）
该接口无参数，返回值的格式如下：
```json
{
    "points": [
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    108.20697,
                    36.470206
                ]
            },
            "properties": {
                "index": 0
            }
        }
    ],
    "polygon": {
        "type": "Feature",
        "geometry": {
            "type": "Polygon",
            "coordinates": [
                [
                    [
                        108.524368,
                        37.7553936
                    ],
                    [
                        104.832966,
                        35.211846
                    ],
                    [
                        110.457957,
                        33.616777
                    ],
                    [
                        111.248937,
                        36.494055
                    ],
                    [
                        111.248937,
                        36.494055
                    ],
                    [
                        111.248937,
                        36.494055
                    ],
                    [
                        108.524368,
                        37.7553936
                    ]
                ]
            ]
        },
        "properties": {
          "area": 10000
        }
    }
}
```

## 组件使用
```
<gis-map
   @map-loaded="mapLoaded()"/>

import GisMap from '@/components/gis-map';

components: {
  GisMap
},
methods: {
    mapLoaded() {
        // 地图加载完成后事件
    }
}
```

# 前后端数据交互说明
JSON为主要前后端交互格式，包括：数据的保存与获取。
## 1. 绘制数据的保存
发布保存前端以JSON对象发送至后端，后端以JSON接收后解析入库。
```
{
  'dataType': 'json',
  'contentType': "application/json; charset=utf-8",
}
// 会用到的函数
st_geomfromgeojson(geojson)
```
## 2.定位接口
如果是点定位，需要经纬度，如果是面，需要从数据库中直接查询geojson格式的数据。
```
// 会用到的函数
st_asgeojson(geom, 4)
```

```vue
<template>
  <div
    id="map"
    class="map">
    <div>
      <ul class="base-map">
        <li
          v-for="(item, index) in baseMaps"
          :key="index"
          :class="item.id === baseMap ? 'active' : ''"
          @click="baseMap = item.id">
          <label>{{ item.label }}</label>
        </li>
      </ul>
      <div
        v-show="baseMap === 'img'"
        class="road-control">
        <el-checkbox v-model="isRoad">路网</el-checkbox>
      </div>
    </div>
    <map-tool v-show="tool" ref="maptool" :map="map"/>
    <map-nav ref="mapnav" :map="map"></map-nav>
  </div>
</template>

<script>
import MapNav from './map-nav';
import MapTool from './map-tool';
import axios from 'axios';

const AMAPURL = 'https://restapi.amap.com/v3/';
const AMAPKEY = '2c47919476d302b7eab0e363e94624aa';
const WEBURL = window.location + '/lib/mapbox/';

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
    tool: {
      type: Boolean,
      default: () => {
        return true;
      }
    }
  },
  components: {
    // MapSearch,
    MapNav,
    MapTool
  },
  data() {
    return {
      baseMaps: [{ id: 'img', label: '影像' }, { id: 'vec', label: '矢量' }],
      baseMap: 'img',
      isRoad: true,
      map: null
    };
  },
  computed: {},
  watch: {
    baseMap(val) {
      const isVecShow = val === 'vec' ? 'visible' : 'none';
      const isImgShow = val === 'img' ? 'visible' : 'none';
      map.setLayoutProperty('TdtVector', 'visibility', isVecShow);
      map.setLayoutProperty('TdtVecLabel', 'visibility', isVecShow);
      map.setLayoutProperty('TdtImage', 'visibility', isImgShow);
      if (val === 'vec') this.isRoad = false;
      else this.isRoad = true;
    },
    isRoad(val) {
      const isShow = val ? 'visible' : 'none';
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
    initMap() {
      const that = this;
      // https://t0.tianditu.gov.cn/DataServer?T=cva_w&tk=ef6151d9f0386f3b2a2fdf1d58fe9b32&x=1688&y=777&l=11
      const tileBase =
        '.tianditu.com/DataServer?T=';
      const tileXyz = '&tk=c6a74bc1b752d5cfa699dbd386cafcf7&x={x}&y={y}&l={z}';
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
        "glyphs": WEBURL + "fonts/mapbox/{fontstack}/{range}.pbf",
        layers: [
          {
            id: 'TdtVector',
            type: 'raster',
            source: 'TdtVector',
            minzoom: 3,
            maxzoom: 18,
            layout: {
              visibility: 'none'
            }
          },
          {
            id: 'TdtVecLabel',
            type: 'raster',
            source: 'TdtVecLabel',
            minzoom: 3,
            maxzoom: 18,
            layout: {
              visibility: 'none'
            }
          },
          {
            id: 'TdtImage',
            type: 'raster',
            source: 'TdtImage',
            minzoom: 3,
            maxzoom: 18,
            layout: {
              visibility: 'none'
            }
          },
          {
            id: 'TdtImgLabel',
            type: 'raster',
            source: 'TdtImgLabel',
            minzoom: 3,
            maxzoom: 18
          }
        ]
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
        // that.locate2Lonlat(that.center);
      });
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
      return this.$refs.maptool.getDrawData();
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
      axios.get(url, {
        params: params
      }).then(function (res) {
        res = res.data;
        const district = res.districts[0];
        const center = district.center.split(',').map(Number);
        // const polyline = district.polyline;
        // let coords = [];
        // const points = polyline.split(';');
        // for (let i = 0; i < points.length; i++) {
        //   const point = points[i].split(',').map(Number);
        //   if(point.join().indexOf('NaN') === -1) {
        //     coords.push(point);
        //   }
        // }
        // const line = {
        //   "type": "LineString",
        //   "coordinates": coords
        // };
        let zoom = map.getZoom();
        switch (district.level) {
          case 'province': {
            zoom = 5;
            break;
          }
          case 'city': {
            zoom = 7;
            break;
          }
          case 'district': {
            zoom = 9;
            break;
          }
          case 'street': {
            zoom = 11;
            break;
          }
        }
        that.locate2Lonlat(center, zoom);
      }).catch(function (error) {});
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
      axios.get(url, {
        params: params
      }).then(function (res) {
        res = res.data;
        let zoom = 13;
        let center = [];
        if(res.pois.length > 0){
          const poi = res.pois[0];
          center = poi.location.split(',').map(Number);
        } else {
          const sugAddress = res['sug_address'];
          center = sugAddress.location.split(',').map(Number);
        }
        that.locate2Lonlat(center, zoom);
      }).catch(function (error) {});
    },
    showMarkers(markers) {
      this.$refs.maptool.showMarkers(markers);
    },
    showPolygons(polygons) {
      this.$refs.maptool.showPolygons(polygons);
    },
    removeMarkers() {
      this.$refs.maptool.removeMarkers();
    },
    removePolygons() {
      this.$refs.maptool.removePolygons();
    },
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
  top: 20px;
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
  right: $padding;
  bottom: $padding;
}
.mapboxgl-ctrl-bottom-left {
  left: $padding;
  bottom: $padding;
}
.map-popup {
  width: $popup-width;
  max-width: 1000px !important;
  border-radius: $border-radius !important;
  z-index: 11;
  padding: 0;
  .mapboxgl-popup-content {
    padding: 0;
  }
  .popup-title {
    height: $padding + 10px;
    line-height: $padding + 10px;
    background: $main-color;
    color: white;
    font-size: 16px;
    padding: 0 $padding / 2;
    font-weight: bold;
    border-top-left-radius: $border-radius;
    border-top-right-radius: $border-radius;
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
</style>
```