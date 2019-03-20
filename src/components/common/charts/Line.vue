<template>
    <ve-line
            :data="chartData"
            :settings="report.config.chartSettings"
            :toolbox="toolbox"
            :loading="loading"
            :data-empty="dataEmpty"
            :data-zoom="dataZoom"
            :extend="report.config.extend.line">
    </ve-line>
</template>

<script>
    // 使用前需先引入对应模块
    import 'echarts/lib/component/toolbox'
    import 'v-charts/lib/style.css'
    import 'echarts/lib/component/dataZoom'
    export default {
        name: 'LineDup',
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
                    columns: ['日期', '成本', '利润'],
                    rows: [
                        { '日期': '1月1日', '成本': 15, '利润': 12 },
                        { '日期': '1月2日', '成本': 12, '利润': 25 },
                        { '日期': '1月3日', '成本': 21, '利润': 10 },
                        { '日期': '1月4日', '成本': 41, '利润': 32 },
                        { '日期': '1月5日', '成本': 31, '利润': 30 },
                        { '日期': '1月6日', '成本': 71, '利润': 55 }
                    ]
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
                    if (0 !== this.report.id) {
                        this.updateReportData(this.report.id)
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