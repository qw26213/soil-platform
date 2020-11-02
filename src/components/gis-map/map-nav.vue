<template>
  <div class="map-nav" />
</template>

<script>
export default {
  props: {
    map: {
      type: Object,
      default: () => {
        return window.map;
      }
    }
  },
  data() {
    return {
      location: null
    };
  },
  computed: {},
  watch: {},
  mounted() {
    const that = this;
    setTimeout(function() {
      that.init();
    }, 1000);
  },
  methods: {
    init() {
      const that = this;
      that.addShowLayer();
      that.addShowPoint();
    },
    addShowLayer() {
      const that = this;
      const map = that.map;
      const showLineOpt = {
        id: 'show-polygon',
        type: 'line',
        source: 'show-polygon',
        paint: {
          'line-color': '#00ffff',
          'line-width': 2,
          'line-opacity': 0.65
        }
      };
      map.addSource('show-polygon', {
        type: 'geojson',
        data: that.getGeojson([])
      });
      map.addLayer(showLineOpt);
    },
    addShowPoint() {
      const that = this;
      const dom = document.createElement('div');
      dom.setAttribute('class', 'location-marker');
      const option = {
        element: dom,
        anchor: "center",
      };
      that.location = new mapboxgl.Marker(option);
    },
    getGeojson(features) {
      return {
        type: 'FeatureCollection',
        features: features
      };
    },
    locate2Lonlat(lonlat, zoom) {
      const that = this;
      zoom = zoom ? zoom : map.getZoom();
      map.flyTo({
        center: lonlat,
        zoom: zoom,
        speed: 1
      });
      that.location.setLngLat(lonlat).addTo(map);
    },
    locate2Polygon(polygon) {
      const geojson = {
        type: 'Feature',
        geometry: polygon
      };
      map.getSource('show-polygon').setData(geojson);
      let bbox = turf.bbox(geojson);
      bbox = [[bbox[0], bbox[1]], [bbox[2], bbox[3]]];
      const padding = 80;
      map.fitBounds(bbox, {
        padding: {
          top: padding,
          bottom: padding,
          left: padding,
          right: padding
        }
      });
    }
  }
};
</script>

<style scoped lang="scss">
$main-color: #409eff;
$padding: 20px;
$border-radius: 4px;
.map-nav {
  position: absolute;
  top: $padding * 1.5;
  left: $padding * 2 + 350px;
  z-index: 99;
  .nav-selected {
    background: white;
    height: $padding * 2;
    line-height: $padding * 2;
    padding: 0 $padding / 2;
    -webkit-border-radius: $border-radius;
    -moz-border-radius: $border-radius;
    border-radius: $border-radius;
    cursor: pointer;
    white-space: nowrap;
    font-size: 14px;
    label {
      margin-right: 3px;
      font-weight: normal;
    }
    i {
      font-weight: bold;
    }
  }
  .nav-select {
    position: absolute;
    top: calc(100% + 5px);
    left: 0;
    width: 260px;
    padding: $padding/ 10px;
    background-color: white;
    border-radius: $border-radius;
    .title {
      padding: $padding / 2 $padding / 2 $padding / 2 $padding;
      border-bottom: solid 1px #ddd;
      .nav-close {
        float: right;
        cursor: pointer;
        font-size: 18px;
        &:hover {
          color: $main-color;
        }
      }
    }
    .content {
      padding: $padding / 2 $padding / 2 $padding / 2 $padding / 2;
      li {
        height: $padding * 2.5;
        line-height: $padding * 2.5;
      }
      label {
        display: inline-block;
        width: 45px;
        text-align: right;
        float: left;
      }
      .el-select {
        width: calc(100% - 50px);
        float: right;
      }
    }
  }
}
</style>
<style lang="scss">
$main-color: #e10000;
$marker-size: 10px;
@keyframes warn {
  0% {
    transform: scale(0.5);
    opacity: 1;
  }

  30% {
    opacity: 1;
  }

  100% {
    transform: scale(1.4);
    opacity: 0;
  }
}
.location-marker {
  width: $marker-size;
  height: $marker-size;
  border-radius: 100%;
  background: $main-color;
  position: relative;
  &:before,
  &:after {
    content: ' ';
    width: $marker-size + 5px;
    height: $marker-size + 5px;
    position: absolute;
    left: 50%;
    top: 50%;
    margin-left: -8px;
    margin-top: -8px;
    border-radius: 50%;
    animation: warn 1.5s ease-out 0s infinite;
  }
  &:before {
    background-color: $main-color;
    opacity: 0.2;
  }
  &:after {
    background-color: $main-color;
  }
}
</style>