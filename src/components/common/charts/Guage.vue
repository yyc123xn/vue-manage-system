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
            this.chartSettings = {
//                dataType: {
//                    '占比': 'percent'
//                },
//                seriesMap: {
//                    '占比': {
//                        min: 0,
//                        max: 1
//                    }
//                }
            }
            this.toolbox = {
                feature: {
                    saveAsImage: {}
                }
            }
            return {
                chartData: {},
                loading: true,
                dataEmpty: false,
                queryReportFilter: {
                    queryColumns: [],
                    queryConditions: [],
                }
            }
        },

        methods: {
            async getReportData(reportId) {
                let reportData
                let postParams = {
                    id : reportId
                }
                this.initQueryReportFilter()
                if (this.queryReportFilter.queryColumns !== undefined && 0 < this.queryReportFilter.queryColumns.length) {
                    postParams.queryColumns = this.queryReportFilter.queryColumns
                    postParams.queryConditions = this.queryReportFilter.queryConditions
                }
                await this.$api.REPORT_REPORT_API.post('GET_REPORT_DATA', postParams).then(res => {
                    reportData = res.data
                })
                return reportData
            },

            updateReportData(reportId) {
                this.getReportData(reportId).then(res => {
                    this.loading = true;
                    this.dataEmpty = 0 === res.rows.length;
                    this.chartData = res
                    this.chartSettings = {
                    }
                    this.loading = false;
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
                this.queryReportFilter = {
                    queryColumns: [],
                    queryConditions: [],
                }
                this.reportFilters.forEach(reportFilter => {
                    if (-1 !== reportFilter.reportIds.indexOf(this.report.id)
                        && null !== reportFilter.queryCondition
                        && 0 !== reportFilter.queryCondition.length) {
                        if (-1 !== this.queryReportFilter.queryColumns.indexOf(reportFilter.queryColumn)) {
                            this.queryReportFilter.queryConditions[index] = reportFilter.queryCondition
                        } else {
                            this.queryReportFilter.queryColumns.push(reportFilter.queryColumn)
                            this.queryReportFilter.queryConditions.push(reportFilter.queryCondition)
                        }
                    }
                })
            }
        },

        watch: {
            reportFilters: {
                handler (newV, oldV) {
                    // do something, 可使用this
                    this.updateReportData(this.report.id)
                },
                deep :true
            }
        },

        mounted() {
            let _this = this
            let reportId = _this._props.report.id
            this.updateReportData(reportId)
        }
    }
</script>