<template>
    <div>
        <ve-pie
                :data="chartData"
                :loading="loading"
                :data-empty="dataEmpty"
                :settings="report.config.chartSettings"
                :toolbox="toolbox">
        </ve-pie>
    </div>
</template>
<script>
    // 使用前需先引入对应模块
    import 'echarts/lib/component/toolbox'
    import 'v-charts/lib/style.css'
    export default {
        name: 'Pie',
        props: {report: Object, reportFilters: Array},
        data () {
            this.toolbox = {
                feature: {
                    saveAsImage: {}
                }
            }
            this.chartSettings = {
            }
            return {
                chartData: {},
                loading: true,
                dataEmpty: false,
                queryReportFilter: {
                    queryColumns: [],
                    queryConditions: [],
                },
                defaultChartData: {
                    columns: ['日期', '访问用户'],
                    rows: [
                        { '日期': '1/1', '访问用户': 1393 },
                        { '日期': '1/2', '访问用户': 3530 },
                        { '日期': '1/3', '访问用户': 2923 },
                        { '日期': '1/4', '访问用户': 1723 },
                        { '日期': '1/5', '访问用户': 3792 },
                        { '日期': '1/6', '访问用户': 4593 }
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
                    this.chartData = {
                        rows: res.rows,
                        columns: res.columns
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