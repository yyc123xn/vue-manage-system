<template>
  <ve-histogram
          :data="chartData"
          :settings="report.config.chartSettings"
          :toolbox="toolbox"
          :loading="loading"
          :data-empty="dataEmpty"
          :data-zoom="dataZoom"
          :extend="report.config.extend.histogram">
  </ve-histogram>
</template>

<script>
    // 使用前需先引入对应模块
    import 'echarts/lib/component/toolbox'
    import 'v-charts/lib/style.css'
    import 'echarts/lib/component/dataZoom'
    export default {
        name: "Histogram",
        props: {report: Object, reportFilters: Array},
        data () {
            this.toolbox = {
                feature: {
                    saveAsImage: {}
                }
            }
            this.dataZoom = [
                {
                    type: 'slider'
                }
            ]
            return {
                chartData: {},
                loading: true,
                dataEmpty: false,
                queryReportFilter: {
                    queryColumns: [],
                    queryConditions: [],
                },
                defaultChartData: {
                    columns: ['日期', '访问用户', '下单用户', '下单率'],
                    rows: [
                        { '日期': '1/1', '访问用户': 1393, '下单用户': 1093, '下单率': 0.32 },
                        { '日期': '1/2', '访问用户': 3530, '下单用户': 3230, '下单率': 0.26 },
                        { '日期': '1/3', '访问用户': 2923, '下单用户': 2623, '下单率': 0.76 },
                        { '日期': '1/4', '访问用户': 1723, '下单用户': 1423, '下单率': 0.49 },
                        { '日期': '1/5', '访问用户': 3792, '下单用户': 3492, '下单率': 0.323 },
                        { '日期': '1/6', '访问用户': 4593, '下单用户': 4293, '下单率': 0.78 }
                    ]
                }
            }
        },

        methods: {
            async getReportData(reportId, newV, oldV) {
                let reportData
                let postParams = {
                    id : reportId
                }
                let queryReportFilter = this.initQueryReportFilter()
                if (undefined === newV
                    || undefined === oldV
                    || JSON.stringify(queryReportFilter) !== JSON.stringify(this.queryReportFilter)) {
                    this.queryReportFilter = queryReportFilter
                    if (this.queryReportFilter.queryColumns !== undefined && 0 < this.queryReportFilter.queryColumns.length) {
                        postParams.queryColumns = this.queryReportFilter.queryColumns
                        postParams.queryConditions = this.queryReportFilter.queryConditions
                    }
                    await this.$api.REPORT_REPORT_API.post('GET_REPORT_DATA', postParams).then(res => {
                        reportData = res.data
                    })
                    return reportData
                    // 查数据
                }
            },

            updateReportData(reportId, newV, oldV) {
                this.getReportData(reportId, newV, oldV).then(res => {
                    if (undefined !== res) {
                        this.loading = true;
                        this.dataEmpty = 0 === res.rows.length;
                        this.chartData = res
                        this.loading = false;
                    }
                })
                setTimeout(() => {
                    this.dataEmpty = (this.chartData.rows === undefined || 0 === this.chartData.rows.length);
                    this.loading = false
                }, 5000)
            },

            /**
             * 重新生成queryReportFilter
             */
            initQueryReportFilter() {
                let queryReportFilter = {
                    queryColumns: [],
                    queryConditions: [],
                }
                this.reportFilters.forEach(reportFilter => {
                    if (-1 !== reportFilter.reportIds.indexOf(this.report.id)
                        && null !== reportFilter.queryCondition
                        && 0 !== reportFilter.queryCondition.length) {
                        if (-1 !== queryReportFilter.queryColumns.indexOf(reportFilter.queryColumn)) {
                            queryReportFilter.queryConditions[index] = reportFilter.queryCondition
                        } else {
                            queryReportFilter.queryColumns.push(reportFilter.queryColumn)
                            queryReportFilter.queryConditions.push(reportFilter.queryCondition)
                        }
                    }
                })
                return queryReportFilter
            }
        },

        watch: {
            reportFilters: {
                handler (newV, oldV) {
                    // do something, 可使用this
                    if (0 !== this.report.id) {
                        this.updateReportData(this.report.id, newV, oldV)
                    }
                },
                deep :true
            }
        },

        mounted() {
            let _this = this
            let reportId = _this._props.report.id
            if (0 === reportId) {
                this.chartData = this.defaultChartData
                this.loading = false;
            } else {
                this.updateReportData(reportId)
            }
        }
    }
</script>
