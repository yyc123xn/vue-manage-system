<template>
    <ve-map
            :data="chartData"
            :settings="chartSettings"
            :loading="loading"
            :data-empty="dataEmpty"
            :events="chartEvents">
    </ve-map>
</template>

<script>
    import ElCol from "element-ui/packages/col/src/col";

    export default {
        components: {ElCol},
        name: "Map",
        props: {report: Object, reportFilters: Array},
        data () {
            this.chartSettings = {
                position: 'china',
                selectData: true,
                selectedMode: 'multiple'
            }
            this.chartEvents = {
                click: (v) => {
                }
            }
            return {
                loading: true,
                dataEmpty: false,
                info: '当前无选中数据或选中数据为空',
                chartData: {
                    columns: ['位置', '税收', '人口', '面积'],
                    rows: [
                        { '位置': '吉林', '税收': 123, '人口': 123, '面积': 92134 },
                        { '位置': '北京', '税收': 1223, '人口': 2123, '面积': 29234 },
                        { '位置': '上海', '税收': 2123, '人口': 1243, '面积': 94234 },
                        { '位置': '浙江', '税收': 4123, '人口': 5123, '面积': 29234 }
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