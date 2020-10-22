<template>
  <div>
    <ul class="map-tools">
      <li
        v-for="(item, index) in mapTools"
        :key="index"
        :class="item.id === mapTool ? 'active' : ''"
        @click="mapTool = item.id">
        <i :class="item.icon"/>
      </li>
    </ul>
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
            },
            dist: {
                type: Number,
                default: 10
            }
        },
        data() {
            return {
                mapTools: [
                    { id: 'polygon', label: '绘制面', icon: 'el-icon-edit-outline' },
                    { id: 'point', label: '绘制点', icon: 'el-icon-location-outline' },
                    { id: '', label: '结束绘制', icon: 'el-icon-rank' }
                ],
                mapTool: '',
                isDraw: false,
                points: [],
                polygon: null,
                polygons: [],
                borders: [],
                centers: [],
                markers: [],
                popup: null,
                popupArea: null,
                lenResults: [],
                tempLength: null,
                tempElement: null,
                delMarker: null,
                delObject: null
            };
        },
        computed: {},
        watch: {
            mapTool(val) {
                const that = this;
                switch (val) {
                    case 'polygon': {
                        that.isDraw = true;
                        that.points = [];
                        break;
                    }
                    case 'point': {
                        that.isDraw = true;
                        break;
                    }
                    default: {
                        that.isDraw = false;
                        const data = that.getDrawData();
                        console.log(data);
                        break;
                    }
                }
            },
            isDraw(val) {
                const that = this;
                const cursor = val ? 'crosshair' : '';
                map.getCanvasContainer().style.cursor = cursor;
                val ? map.doubleClickZoom.disable() : map.doubleClickZoom.enable();
                map.getSource('temp-line').setData(that.getGeojson([]));
                map.getSource('temp-polygon').setData(that.getGeojson([]));
            }
        },
        mounted() {},
        methods: {
            init() {
                const that = this;
                const map = that.map;
                that.addPopup();
                that.addDrawLayer();
                that.addShowLayer();
                map.on('click', function(e) {
                    if (that.isDraw) {
                        switch (that.mapTool) {
                            case 'polygon': {
                                that.polygon = null;
                                const lonlat = e.lngLat.toArray();
                                that.points.push(lonlat);
                                // if(that.points.length > 1) {
                                //   const len = that.getLength(lonlat, that.points[that.points.length - 2]);
                                // that.addMeasureResult(len);
                                // }
                                break;
                            }
                            default: {
                                that.addMarkerToMap(e.lngLat.toArray());
                                break;
                            }
                        }
                    }
                });
                map.on('mousemove', function(e) {
                    if (that.isDraw && that.mapTool === 'polygon') {
                        const coords = e.lngLat.toArray();
                        if(that.points.length > 0) {
                            const tempLen = that.getLength(coords, that.points[that.points.length - 1]);
                            that.tempElement.innerHTML = tempLen;
                            that.tempLength.setLngLat(coords);
                        }
                        const _points = that.points.concat([coords]);
                        that.showTempPolygon(_points);
                    }
                });
                map.on('dblclick', function(e) {
                    that.isDraw = false;
                    if (that.mapTool === 'polygon' && that.points.length > 3) {
                        that.points = that.points.splice(0, that.points.length - 1);
                        const _points = that.points.concat([]);
                        that.addPolygonToMap(_points);
                        that.points = [];
                        // that.$confirm('地块绘制完成，是否激活打点功能?', '提示', {
                        //   confirmButtonText: '确定',
                        //   cancelButtonText: '取消',
                        //   type: 'warning'
                        // }).then(() => {
                        //   that.mapTool = 'point';
                        // }).catch(() => {
                        //   that.mapTool = '';
                        // });
                    }
                });
            },
            addLengthResult(idx, uuid) {
                const that = this;
                const ele = document.createElement('div');
                const cls = uuid ? 'measure-result ' + uuid : 'measure-result';
                ele.setAttribute('class', cls);
                const option = {
                    element: ele,
                    anchor: 'left',
                    offset: [8, 0]
                };
                const pos0 = that.points[idx - 1];
                const pos1 = that.points[idx];
                const len = that.getLength(pos0, pos1);
                ele.innerHTML = len;
                const pos = [(pos0[0] + pos1[0]) / 2, (pos0[1] + pos1[1]) / 2];
                const lenMarker = new mapboxgl.Marker(option)
                    .setLngLat(pos)
                    .addTo(map);
                that.lenResults.push(lenMarker);
            },
            addMeasureResult(res) {
                const that = this;
                const ele = document.createElement('div');
                ele.setAttribute('class', 'measure-result');
                ele.innerHTML = res;
                const option = {
                    element: ele,
                    anchor: 'left',
                    offset: [8, 0]
                };
                const pos0 = that.points[that.points.length - 2];
                const pos1 = that.points[that.points.length - 1];
                const pos = [(pos0[0] + pos1[0]) / 2, (pos0[1] + pos1[1]) / 2];
                const lenMarker = new mapboxgl.Marker(option)
                    .setLngLat(pos)
                    .addTo(map);
                that.lenResults.push(lenMarker);
            },
            getLength(pt1, pt2) {
                const line = turf.lineString([pt1, pt2]);
                let len = turf.length(line);
                if(len < 1) {
                    len = Math.round(len * 1000) + 'm';
                } else {
                    len = len.toFixed(2) + 'km';
                }
                return len;
            },
            addPopup() {
                const that = this;
                that.popup = new mapboxgl.Popup({
                    closeButton: false,
                    closeOnClick: false,
                    className: 'map-popup',
                    offset: [0, -28],
                    anchor: 'bottom'
                });
                that.popup.on('open', function(){
                    var ele = $(that.popup.getElement());
                    var offset = ele.offset();
                    var top = offset.top;
                    var left = offset.left;
                    var right = ele.width() + left;
                    var mapEle = $(map.getContainer());
                    var mapOffset = mapEle.offset();
                    var mapTop = mapOffset.top;
                    var mapLeft = mapOffset.left;
                    var mapRight = mapEle.width() + mapLeft;
                    var center = map.getCenter();
                    var centerPx = map.project(center);
                    var h = 0, v = 0, size = 50;
                    if(top < mapTop) {
                        v = mapTop - top + size;
                    }
                    if(left < mapLeft) {
                        h = mapLeft - left + size + 300;
                    }
                    if(right > mapRight) {
                        h = mapRight - right - size;
                    }
                    centerPx = [centerPx.x - h, centerPx.y - v];
                    map.panTo(map.unproject(centerPx));
                });
                that.popupArea = new mapboxgl.Popup({
                    closeButton: false,
                    closeOnClick: false,
                    className: 'map-popup',
                    offset: [0, -12],
                    anchor: 'bottom'
                });
            },
            addMarkerLayer() {
                const that = this;
                map.addSource('show-markers', {
                    type: 'geojson',
                    data: that.getGeojson([])
                });
                map.addSource('free-markers', {
                    type: 'geojson',
                    data: that.getGeojson([])
                });
                const highImg = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAASCAYAAAAzI3woAAAACXBIWXMAAAsTAAALEwEAmpwYAAA4GmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS41LWMwMTQgNzkuMTUxNDgxLCAyMDEzLzAzLzEzLTEyOjA5OjE1ICAgICAgICAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIKICAgICAgICAgICAgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIgogICAgICAgICAgICB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIKICAgICAgICAgICAgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIKICAgICAgICAgICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOmV4aWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vZXhpZi8xLjAvIj4KICAgICAgICAgPHhtcDpDcmVhdG9yVG9vbD5BZG9iZSBQaG90b3Nob3AgQ0MgKFdpbmRvd3MpPC94bXA6Q3JlYXRvclRvb2w+CiAgICAgICAgIDx4bXA6Q3JlYXRlRGF0ZT4yMDIwLTEwLTExVDEwOjE0OjE1KzA4OjAwPC94bXA6Q3JlYXRlRGF0ZT4KICAgICAgICAgPHhtcDpNb2RpZnlEYXRlPjIwMjAtMTAtMTFUMTA6MTU6NDYrMDg6MDA8L3htcDpNb2RpZnlEYXRlPgogICAgICAgICA8eG1wOk1ldGFkYXRhRGF0ZT4yMDIwLTEwLTExVDEwOjE1OjQ2KzA4OjAwPC94bXA6TWV0YWRhdGFEYXRlPgogICAgICAgICA8ZGM6Zm9ybWF0PmltYWdlL3BuZzwvZGM6Zm9ybWF0PgogICAgICAgICA8cGhvdG9zaG9wOkNvbG9yTW9kZT4zPC9waG90b3Nob3A6Q29sb3JNb2RlPgogICAgICAgICA8eG1wTU06SW5zdGFuY2VJRD54bXAuaWlkOjUyMzdiYWFlLTY4MjItMWQ0OS1iMGY5LTAyNGUzOWY2MjA5MDwveG1wTU06SW5zdGFuY2VJRD4KICAgICAgICAgPHhtcE1NOkRvY3VtZW50SUQ+eG1wLmRpZDo1MjM3YmFhZS02ODIyLTFkNDktYjBmOS0wMjRlMzlmNjIwOTA8L3htcE1NOkRvY3VtZW50SUQ+CiAgICAgICAgIDx4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ+eG1wLmRpZDo1MjM3YmFhZS02ODIyLTFkNDktYjBmOS0wMjRlMzlmNjIwOTA8L3htcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD4KICAgICAgICAgPHhtcE1NOkhpc3Rvcnk+CiAgICAgICAgICAgIDxyZGY6U2VxPgogICAgICAgICAgICAgICA8cmRmOmxpIHJkZjpwYXJzZVR5cGU9IlJlc291cmNlIj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OmFjdGlvbj5jcmVhdGVkPC9zdEV2dDphY3Rpb24+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDppbnN0YW5jZUlEPnhtcC5paWQ6NTIzN2JhYWUtNjgyMi0xZDQ5LWIwZjktMDI0ZTM5ZjYyMDkwPC9zdEV2dDppbnN0YW5jZUlEPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6d2hlbj4yMDIwLTEwLTExVDEwOjE0OjE1KzA4OjAwPC9zdEV2dDp3aGVuPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6c29mdHdhcmVBZ2VudD5BZG9iZSBQaG90b3Nob3AgQ0MgKFdpbmRvd3MpPC9zdEV2dDpzb2Z0d2FyZUFnZW50PgogICAgICAgICAgICAgICA8L3JkZjpsaT4KICAgICAgICAgICAgPC9yZGY6U2VxPgogICAgICAgICA8L3htcE1NOkhpc3Rvcnk+CiAgICAgICAgIDx0aWZmOk9yaWVudGF0aW9uPjE8L3RpZmY6T3JpZW50YXRpb24+CiAgICAgICAgIDx0aWZmOlhSZXNvbHV0aW9uPjcyMDAwMC8xMDAwMDwvdGlmZjpYUmVzb2x1dGlvbj4KICAgICAgICAgPHRpZmY6WVJlc29sdXRpb24+NzIwMDAwLzEwMDAwPC90aWZmOllSZXNvbHV0aW9uPgogICAgICAgICA8dGlmZjpSZXNvbHV0aW9uVW5pdD4yPC90aWZmOlJlc29sdXRpb25Vbml0PgogICAgICAgICA8ZXhpZjpDb2xvclNwYWNlPjY1NTM1PC9leGlmOkNvbG9yU3BhY2U+CiAgICAgICAgIDxleGlmOlBpeGVsWERpbWVuc2lvbj4zNjwvZXhpZjpQaXhlbFhEaW1lbnNpb24+CiAgICAgICAgIDxleGlmOlBpeGVsWURpbWVuc2lvbj4xODwvZXhpZjpQaXhlbFlEaW1lbnNpb24+CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgIAo8P3hwYWNrZXQgZW5kPSJ3Ij8+CTA1QQAAACBjSFJNAAB6JQAAgIMAAPn/AACA6QAAdTAAAOpgAAA6mAAAF2+SX8VGAAACk0lEQVR42syWz0sUcRjGn8edmd2lH2BqmO6MiW27yx66dKhDEBGBBB3qFkQYHRSCIOnUXxBREER2KBSCLnUKovAQeDU6dFB3W9TdGVclE6Eyd2dmfTu4G/tDx9w18DkO7/f9fnif9/u+QxEBAJCEl0pxO9WcTk2fg71d3F8OLyABFNPAgS4TK41AlXJnDDQbJn4ScHcElAL8BV3tA3hPIDNRyzlLQOqFIgkBmpK6OiakTpH7Ect5TsDZFmg6hLBN7R2JcDH0BwXnI5bzqV77SGKqUzlNHz8APLiRAylN7Is9c0htCZQM+XrX2fSa5L7izcNBOoMlyxoBKlm2JupDkH3FPKuAXI5Z7mgNUKqDsXVF/QwyWLz1WdRyBnajwav7M6GrQyD7N/pUVoROPJaWhQqgRJf/DYErpUP+NftI9xIWG311mz2W2Ta054PaQlmyFxHTvlkBlDS0JZCtpRjVtbt65mE2Mgq2GiXTHTAcRcuUfUpHMvluTyAvyxpVQlefghwomy/ZiJkPVVpmaCMkr1eVYFjWnbuxLJZ3A8QK4dAq1Qcgb1RUUmTkuGn3VQClD7M9F1BTJPdX2fKL4GN/zn7i1VNemm1Dez6g3RLI7c3yB3JO+Og3Wax59olO5Zz4+J6gtkm/uCTGBJiByFcfMK763PHuNHJVVQj+pnJSBKekiccIhEVwhqRSuwnEZkF6o1n345aDcUpXLgB8RbIF/1EisgzI1Zjljm67OjIGmnOiPhLgGkjfLpMUCLwM0LlTPnD/abkmQ+gUav2AXAIQrxtOpABgAuBbwB6KWpiva9uXawLQFF09ASImYFyAOCAdELYA0goABJeF8h1glsAkIZMQTLqW8yUO71+QGqC9oj0H9GcAWIdt7D/NlSEAAAAASUVORK5CYII=';
                map.loadImage(highImg, function(error, image) {
                    if (error) throw error;
                    map.addImage('highlight-marker', image);
                    map.addSource('highlight-marker', {
                        type: 'geojson',
                        data: that.getGeojson([])
                    });
                    const highlight = {
                        id: 'highlight-marker',
                        type: 'symbol',
                        source: 'highlight-marker',
                        layout: {
                            'icon-image': 'highlight-marker',
                            'icon-ignore-placement': true,
                            'icon-anchor': 'bottom',
                            'icon-offset': [0, 10],
                            'icon-size': [
                                'interpolate',
                                ['linear'],
                                ['zoom'],
                                4,
                                0.4,
                                8,
                                0.6
                            ]
                        }
                    };
                    map.addLayer(highlight);
                });
                // REQUIRED：已认领
                // UNREQUIRED：未认领
                // FINISHED：已完成（采集）：
                // INCOMED：已入库
                // SEND_DETECTING：送检中
                // DETECTED：已检
                const clusterNone = {
                    id: 'show-markers',
                    source: 'show-markers',
                    type: 'symbol',
                    layout: {
                        'icon-image': [
                            'match',
                            ['get', 'status'],
                            'INVALID', 'marker-grey',//#aaaaaa
                            'OUTTIME', 'marker-grey',//#aaaaaa
                            'FINISHED', 'marker-green',//#45e984
                            'INCOMED', 'marker-yellow',//#ffe25e
                            'REQUIRED', 'marker-blue',//#67a4ff
                            'marker-red' // 无匹配值颜色#ff524fUNREQUIRED
                        ],
                        'icon-ignore-placement': true,
                        'icon-anchor': 'bottom',
                        'icon-size': [
                            'interpolate',
                            ['linear'],
                            ['zoom'],
                            4,
                            0.6,
                            8,
                            0.8
                        ]
                    }
                };
                const clusterFree = {
                    id: 'free-markers',
                    source: 'free-markers',
                    type: 'symbol',
                    layout: {
                        'icon-image': [
                            'match',
                            ['get', 'status'],
                            'OUTTIME', 'marker-grey',//#aaaaaa
                            'FINISHED', 'marker-green1',//#45e984
                            'INCOMED', 'marker-yellow1',//#ffe25e
                            'REQUIRED', 'marker-blue1',//#67a4ff
                            'marker-red1' // 无匹配值颜色#ff524fUNREQUIRED
                        ],
                        'icon-ignore-placement': true,
                        'icon-anchor': 'bottom',
                        'icon-size': [
                            'interpolate',
                            ['linear'],
                            ['zoom'],
                            4,
                            0.6,
                            8,
                            0.8
                        ]
                    }
                };
                map.addLayer(clusterNone);
                map.addLayer(clusterFree);
                // 添加点击事件
                map.on('click', 'show-markers', function(e) {
                    const feature = e.features[0];
                    map.getSource('highlight-marker').setData(feature);
                    that.$emit('marker-click', feature.properties);
                });
                map.on('mouseenter', 'show-markers', function(e) {
                    map.getCanvas().style.cursor = 'pointer';
                    const feature = e.features[0];
                    const prop = feature.properties;
                    const coord = feature.geometry.coordinates;
                    that.showPopupInfo(prop, coord);
                });
                map.on('mouseleave', 'show-markers', function(e) {
                    map.getCanvas().style.cursor = '';
                    that.popup.setLngLat([0, 0])
                });
                // 添加点击事件
                map.on('click', 'free-markers', function(e) {
                    const feature = e.features[0];
                    map.getSource('highlight-marker').setData(feature);
                    that.$emit('marker-click', feature.properties);
                });
                map.on('mouseenter', 'free-markers', function(e) {
                    map.getCanvas().style.cursor = 'pointer';
                    const feature = e.features[0];
                    const prop = feature.properties;
                    const coord = feature.geometry.coordinates;
                    that.showPopupInfo(prop, coord);
                });
                map.on('mouseleave', 'free-markers', function(e) {
                    map.getCanvas().style.cursor = '';
                    that.popup.setLngLat([0, 0])
                });
            },
            showPopupInfo(prop, coord) {
                const that = this;
                let content = '';
                //{"sample_area":"重庆市市辖区万州区龙驹镇",
                // "end_time":"2020-10-31",
                // "batch_code":"PC160024927686272750"}
                // REQUIRED：已认领
                // UNREQUIRED：未认领
                // FINISHED：已完成：
                // INCOMED：已入库
                // SEND_DETECTING：送检中
                // DETECTED：已检
                prop.results = JSON.parse(prop.results);
                prop = Object.assign(prop, prop.results);
                const fieldLabel = {
                    'UNREQUIRED': '所属批次,完成日期,所在行政区'.split(','),
                    'FINISHED': '所属批次,提交日期,所在行政区,采集人,采集编号,农户姓名,采集地址,采集形式'.split(','),
                    'REQUIRED': '所属批次,截止日期,所在行政区,采集人'.split(','),
                    'INCOMED': '所属批次,采土袋ID,入库日期,所属仓库,仓库所在地,采集人,采集形式'.split(',')
                };
                const fieldCode = {
                    'UNREQUIRED': 'batch_code,end_time,sample_area'.split(','),
                    'FINISHED': 'batch_code,submit_time,sample_area,collector,remark,farmer,detail_address,task_attr'.split(','),
                    'REQUIRED': 'batch_code,end_time,sample_area,collector'.split(','),
                    'INCOMED': 'batch_code,bag_code,income_time,deport_name,deport_area,collector,task_attr'.split(',')
                };
                const fields = fieldCode[prop.status];
                for (let i = 0; i < fields.length; i++) {
                    const f = fields[i];
                    const l = fieldLabel[prop.status][i];
                    if(prop[f]) {
                        content += `
              <li><b>${l}：</b> ${prop[f] ? prop[f] : '-'}</li>
            `;
                    }
                }
                const html = `
        <div class="popup-title">
          <label>${'点位ID：' + prop.code}</label>
          <span class="popup-close" id="popupClose">×</span>
        </div>
        <div class="popup-content">
            ${content}
        </div>
      `;
                that.popup
                    .setLngLat(coord)
                    .setHTML(html)
                    .addTo(map);
                const popupClose = document.getElementById('popupClose');
                popupClose.onclick = function() {
                    if (that.popup) that.popup.remove();
                    map.getSource('highlight-marker').setData(that.getGeojson([]));
                };
            },
            addPolygonLayer() {
                const that = this;
                if(!map) return;
                if(map.getSource('show-polygons')) {
                    map.removeLayer('show-polygons');
                    map.removeLayer('show-line');
                    map.removeSource('show-polygons');
                }
                // 添加面的回显
                map.addSource('show-polygons', {
                    type: 'geojson',
                    data: that.getGeojson([])
                });
                map.addSource('highlight-polygons', {
                    type: 'geojson',
                    data: that.getGeojson([])
                });
                var showColor = [
                    'case',
                    ['<', ['get', 'area'], 666], '#ffff00',
                    ['<', ['get', 'area'], 6666], '#ff3300',
                    ['<', ['get', 'area'], 66666], '#66ff33',
                    ['<', ['get', 'area'], 666666], '#0066ff',
                    '#c9c9c9' // 默认值
                ];
                const showPolygonOpt = {
                    id: 'show-polygons',
                    type: 'fill',
                    source: 'show-polygons',
                    paint: {
                        'fill-color': showColor,
                        'fill-opacity': 0.1
                    }
                };
                map.addLayer(showPolygonOpt);
                // 绘制完成后展示的线
                const showLineOpt = {
                    id: 'show-line',
                    type: 'line',
                    source: 'show-polygons',
                    paint: {
                        'line-color': showColor,
                        'line-width': 2,
                        'line-opacity': 0.65
                    }
                };
                map.addLayer(showLineOpt);
                map.addLayer({
                    id: 'highlight-polygons',
                    type: 'line',
                    source: 'highlight-polygons',
                    paint: {
                        'line-color': '#00ffff',
                        'line-width': 2
                    },
                    filter: ['in', 'id', '']
                });
                map.on('mouseenter', 'show-polygons', function(e) {
                    map.getCanvas().style.cursor = 'pointer';
                    const feature = e.features[0];
                    map.setFilter('highlight-polygons', ['in', 'id', feature.properties.id]);
                    const center = turf.centroid(feature);
                    let area = Math.round(feature.properties.area);
                    area = area * 0.0015;
                    area = area.toFixed(2);
                    const areas = area.split('.');
                    let areaText = that.toThousands(areas[0]);
                    if(Number(areas[1]) > 0) {
                        areaText += '.' + Number(areas[1]);
                    }
                    const info = `<b>地块面积</b>：${areaText}亩`;
                    that.$emit('set-info', info);
                });
                map.on('mouseleave', 'show-polygons', function(e) {
                    map.getCanvas().style.cursor = '';
                    map.setFilter('highlight-polygons', ['in', 'id', '']);
                    if (that.popupArea) that.popupArea.remove();
                    that.$emit('set-info', '');
                });
            },
            toThousands(num) {
                num = (num || 0).toString();
                let re = /\d{3}$/;
                let result = '';
                while ( re.test(num) ) {
                    result = RegExp.lastMatch + result;
                    if (num !== RegExp.lastMatch) {
                        result = ',' + result;
                        num = RegExp.leftContext;
                    } else {
                        num = '';
                        break;
                    }
                }
                if (num) { result = num + result; }
                return result;
            },
            showMarkers(markers) {
                const that = this;
                const geojson = that.getGeojson(markers);
                map.getSource('show-markers').setData(geojson);
            },
            showFreeMarkers(markers) {
                const that = this;
                const geojson = that.getGeojson(markers);
                map.getSource('free-markers').setData(geojson);
            },
            showPolygons(polygons, isZoom) {
                const that = this;
                for(let i = 0;i<polygons.length;i++) {
                    polygons[i].properties.id = that.uuid();
                }
                const geojson = that.getGeojson(polygons);
                map.getSource('show-polygons').setData(geojson);
                map.getSource('highlight-polygons').setData(geojson);
                if(isZoom) {
                    // 将回显地块放大
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
            },
            removeMarkers() {
                if(map.getSource('show-markers')) {
                    const geojson = this.getGeojson([]);
                    map.getSource('show-markers').setData(geojson);
                }
            },
            removePolygons() {
                if(map.getSource('show-polygons')) {
                    const geojson = this.getGeojson([]);
                    map.getSource('show-polygons').setData(geojson);
                }
            },
            addShowLayer() {
                const that = this;
                that.addPolygonLayer();
                that.addMarkerLayer();
            },
            addDrawLayer() {
                const that = this;
                const map = that.map;
                that.tempElement = document.createElement('div');
                that.tempElement.setAttribute('class', 'measure-result');
                const option = {
                    element: that.tempElement,
                    anchor: 'left',
                    offset: [12, 0]
                };
                that.tempLength = new mapboxgl.Marker(option)
                    .setLngLat([0, 0])
                    .addTo(map);
                const delElement = document.createElement('div');
                delElement.setAttribute('class', 'delete-button');
                delElement.innerHTML = "删除";
                const delOption = {
                    element: delElement,
                    anchor: 'left',
                    offset: [12, 0]
                };
                that.delMarker = new mapboxgl.Marker(delOption)
                    .setLngLat([0, 0])
                    .addTo(map);
                delElement.onclick = function () {
                    let msg = that.delObject.layer.id === "draw-markers" ? '是否确认删除该打点?' : ' 是否确定删除此地块以及地块上所有的采集点?';
                    that.$confirm(msg, '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        that.delMarker.setLngLat([0, 0]);
                        // 删除打点
                        if (that.delObject.layer.id === "draw-markers") {
                            const id = that.delObject.properties.id;
                            that.deleteMarkerById(id);
                        } else { // 删除地块
                            const id = that.delObject.properties.id;
                            that.deletePolygonById(id);
                        }
                        that.deleteMarkerById();
                        that.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                    }).catch(() => {
                        that.delMarker.setLngLat([0, 0]);
                        that.$message({
                            type: 'info',
                            message: '已取消删除'
                        });
                    });
                };
                // 绘制时的临时线，会在绘制结束后清楚
                const tempLineOpt = {
                    id: 'temp-line',
                    type: 'line',
                    source: 'temp-line',
                    paint: {
                        'line-color': '#ff0000',
                        'line-width': 2,
                        'line-opacity': 0.65
                    }
                };
                map.addSource('temp-line', {
                    type: 'geojson',
                    data: that.getGeojson([])
                });
                map.addLayer(tempLineOpt);
                // 绘制时的临时面，会在绘制结束后清楚
                const tempPolygonOpt = {
                    id: 'temp-polygon',
                    type: 'fill',
                    source: 'temp-polygon',
                    paint: {
                        'fill-color': '#ff0000',
                        'fill-opacity': 0.1
                    }
                };
                map.addSource('temp-polygon', {
                    type: 'geojson',
                    data: that.getGeojson([])
                });
                map.addLayer(tempPolygonOpt);
                // 绘制完成后展示的面
                var showColor = [
                    'case',
                    ['<', ['get', 'area'], 666], '#ffff00',
                    ['<', ['get', 'area'], 6666], '#ff3300',
                    ['<', ['get', 'area'], 66666], '#66ff33',
                    ['<', ['get', 'area'], 666666], '#0066ff',
                    '#c9c9c9' // 默认值
                ];
                const drawPolygonOpt = {
                    id: 'draw-polygon',
                    type: 'fill',
                    source: 'draw-polygon',
                    paint: {
                        'fill-color': showColor,
                        'fill-opacity': 0.1
                    }
                };
                map.addSource('draw-polygon', {
                    type: 'geojson',
                    data: that.getGeojson([])
                });
                map.addLayer(drawPolygonOpt);
                // 绘制完成后展示的线
                map.addSource('draw-border', {
                    type: 'geojson',
                    data: that.getGeojson([])
                });
                const drawLineOpt = {
                    id: 'draw-border',
                    type: 'line',
                    source: 'draw-border',
                    paint: {
                        'line-color': "#f00",
                        'line-width': 2,
                        'line-opacity': 0.65
                    }
                };
                map.addLayer(drawLineOpt);
                const drawLineLabelOpt = {
                    id: 'draw-border-label',
                    type: 'symbol',
                    source: 'draw-border',
                    'layout': {
                        'symbol-placement': 'line-center',
                        'text-field': ['get', 'length'],
                        "text-size": 13,
                        'text-font': ["Open Sans Regular"],
                        'text-allow-overlap': true,
                    },
                    paint: {
                        'text-color': '#000',
                        'text-halo-color': '#fff',
                        'text-halo-width': 1
                    }
                };
                map.addLayer(drawLineLabelOpt);
                // 绘制点图层
                map.addSource('draw-markers', {
                    type: 'geojson',
                    data: that.getGeojson([])
                });
                map.addLayer({
                    id: 'draw-markers',
                    type: 'symbol',
                    source: 'draw-markers',
                    layout: {
                        'icon-image': 'marker-red',
                        'icon-ignore-placement': true,
                        'icon-anchor': 'bottom',
                        'icon-size': [
                            'interpolate',
                            ['linear'],
                            ['zoom'],
                            4,
                            0.6,
                            8,
                            0.8
                        ]
                    }
                });
                map.on('mouseenter', 'draw-markers', function(e) {
                    if(!that.isDraw) {
                        map.getCanvas().style.cursor = 'pointer';
                    }
                });
                map.on('mouseleave', 'draw-markers', function(e) {
                    if(!that.isDraw) {
                        map.getCanvas().style.cursor = '';
                    }
                });
                map.on('contextmenu', function(e) {
                    const coords = e.lngLat;
                    const r = [
                        [e.point.x - 5, e.point.y - 5],
                        [e.point.x + 5, e.point.y + 5],
                    ];
                    const features = map.queryRenderedFeatures(r, {});
                    const feat = features[0];
                    // 只在绘制页面出现
                    if("draw-markers,draw-polygon".indexOf(feat.layer.id) !== -1) {
                        that.delObject = feat;
                        that.delMarker.setLngLat(coords);
                    }
                });
            },
            showPopup(prop, lngLat) {
                const that = this;
                const map = that.map;
                const html = `
        <div class="popup-title">
          <label>第${prop.index + 1}个打点</label>
          <span class="popup-close" id="popupClose">×</span>
        </div>
        <div class="popup-content">
            ${lngLat.map(res => { return res.toFixed(3) }).join(',')}
            <!--<button id="deleteMarker" markerid="${prop.id}">删除</button>-->
        </div>
      `;
                that.popup
                    .setLngLat(lngLat)
                    .setHTML(html)
                    .addTo(map);
                const popupClose = document.getElementById('popupClose');
                popupClose.onclick = function() {
                    if (that.popup) that.popup.remove();
                };
            },
            deleteMarkerById(id) {
                const that = this;
                let markers = [];
                for (let i = 0; i < that.markers.length; i++) {
                    const marker = that.markers[i];
                    if(id !== marker.properties.id) {
                        markers.push(marker);
                    }
                }
                that.markers = markers;
                const geojson = that.getGeojson(that.markers);
                map.getSource('draw-markers').setData(geojson);
                if (that.popup) that.popup.remove();
            },
            deletePolygonById (id) {
                const that = this;
                // 处理面
                let polygons = [];
                for (let i = 0; i < that.polygons.length; i++) {
                    const polygon = that.polygons[i];
                    if(id !== polygon.properties.id) {
                        polygons.push(polygon);
                    } else { // 删除地块时删除打点，以及展示结果
                        const markers = that.markers.concat([]);
                        for (let j = 0; j < markers.length; j++) {
                            const marker = markers[j];
                            if(turf.booleanPointInPolygon(marker, polygon)) {
                                const idM = marker.properties.id;
                                that.deleteMarkerById(idM)
                            }
                        }
                        $('.' + id).remove();
                        that.$emit('set-info', '');
                    }
                }
                that.polygons = polygons;
                map.getSource('draw-polygon').setData(that.getGeojson(that.polygons));
                // 删除边界
                let borders = [];
                for (let i = 0; i < that.borders.length; i++) {
                    const border = that.borders[i];
                    if(id !== border.properties.id) {
                        borders.push(border);
                    }
                }
                that.borders = borders;
                map.getSource('draw-border').setData(that.getGeojson(that.borders));
            },
            getGeojson(features) {
                return {
                    type: 'FeatureCollection',
                    features: features
                };
            },
            addMarkerToMap(lonlat) {
                const that = this;
                if (!that.polygon) {
                    that.$confirm('请先绘制地块, 是否激活地块绘制?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        that.mapTool = 'polygon';
                    }).catch(() => {
                        that.mapTool = '';
                    });
                    return;
                }
                const map = that.map;
                const marker = {
                    type: 'Feature',
                    geometry: {
                        type: 'Point',
                        coordinates: lonlat
                    },
                    properties: {
                        id: that.uuid()
                    }
                };
                // 判断点之间的距离
                if (that.isInDistance(lonlat)) {
                    that.$message({
                        type: 'warning',
                        message: `打点距离小于${that.dist}m，请检查后重新打点`
                    });
                    return;
                }
                // 判断点在面内
                let isIn = false;
                for (let i = 0; i < that.polygons.length; i++) {
                  const polygon = that.polygons[i];
                    if(turf.booleanPointInPolygon(marker, polygon)) {
                        isIn = true;
                        break;
                    }
                }
                if(isIn) {
                    that.markers.push(marker);
                    const geojson = that.getGeojson(that.markers);
                    map.getSource('draw-markers').setData(geojson);
                } else {
                    that.$message({
                        type: 'warning',
                        message: '超出地块范围，请重新绘制'
                    });
                }
            },
            isInDistance(lonlat) {
                const that = this;
                let isDist = false;
                for (let i = 0; i < that.markers.length; i++) {
                    const coords = that.markers[i].geometry.coordinates;
                    const from = turf.point(lonlat);
                    const to = turf.point(coords);
                    const options = {units: 'kilometers'};
                    let distance = turf.distance(from, to, options);
                    distance = distance * 1000;
                    if(distance < that.dist) {
                        isDist = true;
                        break;
                    }
                }
                return isDist;
            },
            addPolygonToMap(points) {
                const that = this;
                const uuid = that.uuid();
                const map = that.map;
                // 隐藏临时绘制时的内容
                map.getSource('temp-line').setData(that.getGeojson([]));
                map.getSource('temp-polygon').setData(that.getGeojson([]));
                that.tempLength.setLngLat([0, 0]);
                // 删除展示的结果
                for (let i = 0; i < that.lenResults.length; i++) {
                    const res = that.lenResults[i];
                    res.remove();
                }
                that.lenResults = [];
                // 将第一个点追加到后面，形成面
                points.push(points[0]);
                that.points = points;
                const geojson = {
                    type: 'Feature',
                    geometry: {
                        type: 'Polygon',
                        coordinates: [that.points]
                    },
                    properties: {
                        id: uuid
                    }
                };
                // 将面积在中心点展示
                let area = turf.area(geojson);
                area = area * 0.0015;
                area = area.toFixed(2);
                const areas = area.split('.');
                let areaText = that.toThousands(areas[0]);
                if(Number(areas[1]) > 0) {
                    areaText += '.' + Number(areas[1]);
                }
                const info = `<b>地块面积</b>：${areaText}亩`;
                that.$emit('set-info', info);
                // 最后展示的多边形
                that.polygon = geojson;
                that.polygons.push(geojson);
                map.getSource('draw-polygon').setData(that.getGeojson(that.polygons));
                // 展示测量结果
                for (let i = 1; i < points.length; i++) {
                    const pos0 = that.points[i - 1];
                    const pos1 = that.points[i];
                    const feat = {
                        "type": "Feature",
                        "properties": {"length": that.getLength(pos0, pos1), id: uuid},
                        "geometry": {"type": "LineString", "coordinates": [pos0, pos1]}
                    };
                    that.borders.push(feat);
                }
                map.getSource('draw-border').setData(that.getGeojson(that.borders));
                // 将绘制地块放大
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
            },
            uuid() {
                let s = [];
                let hexDigits = "0123456789abcdef";
                for (let i = 0; i < 36; i++) {
                    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
                }
                s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
                s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
                s[8] = s[13] = s[18] = s[23] = "-";
                return s.join("");
            },
            showTempPolygon(points) {
                const that = this;
                const map = that.map;
                points.push(points[0]);
                if (points.length > 1) {
                    const geojson = {
                        type: 'Feature',
                        geometry: {
                            type: 'LineString',
                            coordinates: points
                        }
                    };
                    map.getSource('temp-line').setData(geojson);
                }
                if (points.length > 2) {
                    const geojson = {
                        type: 'Feature',
                        geometry: {
                            type: 'Polygon',
                            coordinates: [points]
                        },
                        properties: {}
                    };
                    const area = turf.area(geojson);
                    geojson.properties.area = area;
                    map.getSource('temp-polygon').setData(geojson);
                }
            },
            getDrawData() {
                const that = this;
                let res = [];
                for (let i = 0; i < that.polygons.length; i++) {
                    const polygon = that.polygons[i];
                    let markers = [];
                    for (let j = 0; j < that.markers.length; j++) {
                        const marker = that.markers[j];
                        if(turf.booleanPointInPolygon(marker, polygon)) {
                            markers.push(marker);
                        }
                    }
                    res.push({
                        points: markers,
                        polygon: polygon
                    })
                }
                return res;
                // return {
                //     points: that.markers,
                //     polygon: that.polygon,
                //     polygons: that.polygons
                // }
            },
            clearDrawData() {
                const that = this;
                that.markers = [];
                that.mapTool =  '';
                that.isDraw = false;
                that.points = [];
                that.polygon = null;
                map.getSource('draw-polygon').setData(that.getGeojson([]));
                map.getSource('draw-markers').setData(that.getGeojson([]));
            }
        }
    };
</script>

<style scoped lang="scss">
  $main-color: #409eff;
  $padding: 20px;
  $border-radius: 4px;
  .map-tools {
    position: absolute;
    top: $padding;
    right: $padding;
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
</style>