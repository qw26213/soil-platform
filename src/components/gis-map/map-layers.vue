<template>
  <div class="map-layers">
    <li
      v-for="(item, index) in landData"
      :key="index">
      <el-checkbox v-model="item.checked" @change="layerChecked(item)">
        <span class="layer-legend" :style="{background: item.color}"></span>
        {{ item.name }}
      </el-checkbox>
    </li>
  </div>
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
                landData: [
                  {
                    code: 'base-boundry',
                    name: '范围线',
                    url: 'mock/boundry.geojson',
                    color: '#ff0000',
                    checked: false,
                    opacity: 0
                  },
                    {
                        code: 'wet-dry',
                        name: '水田旱地',
                        url: 'mock/wet-dry.geojson',
                        color: '#c7f5cb',
                        checked: false,
                      opacity: 0.5
                    },
                    {
                        code: 'new-land',
                        name: '新增耕地',
                        url: 'mock/new-land.geojson',
                        color: '#eacefe',
                        checked: false,
                      opacity: 0.5
                    },
                    {
                        code: 'dry-wet',
                        name: '旱地变水田',
                        url: 'mock/dry-wet.geojson',
                        color: '#eca0a5',
                        checked: false,
                      opacity: 0.5
                    },
                    {
                        code: 'base-land',
                        name: '基本农田',
                        url: 'mock/base-land.geojson',
                        color: '#bdf5fd',
                        checked: false,
                      opacity: 0.5
                    },
                  {
                    code: 'base-farm',
                    name: '基本农田(仪征)',
                    url: 'mock/base-farm.geojson',
                    color: '#bdf5fd',
                    checked: false,
                    opacity: 0.5
                  },
                  {
                    code: 'change-farm',
                    name: '变更耕地',
                    url: 'mock/change-farm.geojson',
                    color: '#eacefe',
                    checked: false,
                    opacity: 0.5
                  }
                ]
            };
        },
        computed: {},
        watch: {},
        mounted() {},
        methods: {
            init() {
                const that = this;
            },
            layerChecked(layer) {
                // 如果已经存在，展示，不存在，加载
                if(!map.getSource(layer.code) && layer.checked) {
                    map.addSource(layer.code, {
                        type: 'geojson',
                        data: layer.url
                    });
                    map.addLayer({
                        id: layer.code,
                        type: 'fill',
                        source: layer.code,
                        paint: {
                            'fill-color': layer.color,
                            'fill-opacity': layer.opacity
                        }
                    }, 'background');
                } else {
                    const show = layer.checked ? 'visible' : 'none';
                    map.setLayoutProperty(layer.code, 'visibility', show);
                }
                if(layer.checked) {
                    const bbox = [
                        [119.2123,32.4279],
                        [119.2309,32.4432]
                    ];
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
        }
    };
</script>

<style scoped lang="scss">
.map-layers {
    position: absolute;
    left: 10px;
    bottom: 10px;
    padding: 10px;
    z-index: 9999;
    border-radius: 6px;
    border: 1px solid rgba(255, 255, 255, 0.3);
    margin: 0;

    .layer-legend {
        display: inline-block;
        width: 12px;
        height: 12px;
        margin-right: 5px;
    }
}
</style>
