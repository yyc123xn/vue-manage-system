<template>
    <ve-gauge :data="chartData"
              :settings="report.config.chartSettings"
              :toolbox="toolbox"
              :loading="loading"
              :data-empty="dataEmpty"></ve-gauge>
</template>

<script>
    // 使用前需先引入对应模块
    import 'echarts/lib/component/toolbox'
    import 'v-charts/lib/style.css'
    export default {
        name: 'Guage',
        props: {report: Object, reportFilters: Array},
        data () {
            this.toolbox = {
                feature: {
                    saveAsImage: {}
                }
            }
            return {
                chartData: {
                    columns: ['type', 'value'],
                    rows: [
                        { type: 'range', value: 0.8 }
                    ]
                },
                loading: true,
                dataEmpty: false,
                queryReportFilter: {
                    queryColumns: [],
                    queryConditions: [],
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
                        this.setGaugeRange(res)
                        this.chartData = res
                        this.loading = false;
                    }
                })
                setTimeout(() => {
                    this.dataEmpty = (this.chartData.rows === undefined || 0 === this.chartData.rows.length);
                    this.loading = false
                }, 5000)
            },

            setGaugeRange(res) {
                if (!this.dataEmpty) {
                    let range = this.report.config.chartSettings.seriesMap.range
                    let dimensionKey = res.columns[0]
                    let dimensionValue = res.rows[0][dimensionKey]
                    if (range.max === range.min) {
                        let metricKey = res.columns[1]
                        let metricValue = res.rows[0][metricKey]
                        if (metricValue > 0) {
                            this.report.config.chartSettings.seriesMap[dimensionValue] = {
                                min: 0,
                                max: parseInt(metricValue / 0.6)
                            }
                        } else {
                            this.report.config.chartSettings.seriesMap[dimensionValue] = {
                                min: parseInt(metricValue / 0.6),
                                max: 0
                            }
                        }
                    } else {
                        this.report.config.chartSettings.seriesMap[dimensionValue] = {
                            min: range.min,
                            max: range.max
                        }
                    }
                }
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
            if (undefined !== _this._props.report) {
                let reportId = _this._props.report.id
                if (0 === reportId) {
                    this.loading = false;
                } else {
                    this.updateReportData(reportId)
                }
            } else {
                this.loading = false;
            }
        }
    }
</script>