<template>
    <el-col>
        <el-col>
            <el-table
                    :data="chartData"
                    :loading="loading"
                    :height="isTop10Table ? noPaginationHeight : paginationHeight"
                    border
                    style="width: 100%">
                <el-table-column v-for="column in chartColumns" :prop="column.prop" :label="column.label">
                </el-table-column>
            </el-table>
        </el-col>
        <el-col v-if="!isTop10Table">
            <el-col class="pagination">
                <el-pagination height="50" small @current-change="handleCurrentChange" layout="prev, pager, next" :page-size="pageSize" :total="total">
                </el-pagination>
            </el-col>
        </el-col>
    </el-col>
</template>

<script>
    export default {
        name: 'Table',
        props: {report: Object, reportFilters: Array, isTop10Table: Boolean},
        data() {
            return {
                paginationHeight: 353,
                noPaginationHeight: 400,
                loading: true,
                pageSize: 10,
                total: 0,

                chartColumns: [
                    {
                        prop : "date"
                    }
                ],

                chartData: [
                    {
                        date: '2016-05-03',
                        name: '王小虎',
                        address: '上海市普陀区金沙江路 1518 弄'
                    }, {
                        date: '2016-05-02',
                        name: '王小虎',
                        address: '上海市普陀区金沙江路 1518 弄'
                    }, {
                        date: '2016-05-04',
                        name: '王小虎',
                        address: '上海市普陀区金沙江路 1518 弄'
                    }, {
                        date: '2016-05-01',
                        name: '王小虎',
                        address: '上海市普陀区金沙江路 1518 弄'
                    }, {
                        date: '2016-05-08',
                        name: '王小虎',
                        address: '上海市普陀区金沙江路 1518 弄'
                    }, {
                        date: '2016-05-06',
                        name: '王小虎',
                        address: '上海市普陀区金沙江路 1518 弄'
                    }, {
                        date: '2016-05-07',
                        name: '王小虎',
                        address: '上海市普陀区金沙江路 1518 弄'
                    }
                ],

                defaultChartColumns: [
                    {
                        prop : "date",
                        label: "日期"
                    },
                    {
                        prop : "name",
                        label: "姓名"
                    },
                    {
                        prop : "address",
                        label: "地址"
                    },
                ],

                defaultChartData: [
                    {
                        date: '2016-05-03',
                        name: '王小虎',
                        address: '上海市普陀区金沙江路 1518 弄'
                    }, {
                        date: '2016-05-02',
                        name: '王小虎',
                        address: '上海市普陀区金沙江路 1518 弄'
                    }, {
                        date: '2016-05-04',
                        name: '王小虎',
                        address: '上海市普陀区金沙江路 1518 弄'
                    }, {
                        date: '2016-05-01',
                        name: '王小虎',
                        address: '上海市普陀区金沙江路 1518 弄'
                    }, {
                        date: '2016-05-08',
                        name: '王小虎',
                        address: '上海市普陀区金沙江路 1518 弄'
                    }, {
                        date: '2016-05-06',
                        name: '王小虎',
                        address: '上海市普陀区金沙江路 1518 弄'
                    }, {
                        date: '2016-05-07',
                        name: '王小虎',
                        address: '上海市普陀区金沙江路 1518 弄'
                    }
                ]
            }
        },

        methods: {

            handleCurrentChange(pageIndex) {
                this.pageIndex = pageIndex;
                this.updateReportData()
            },

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
                        this.chartData = res.rows
                        this.chartColumns = res.columns
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
                    this.chartData = this.defaultChartData
                    this.chartColumns = this.defaultChartColumns
                    this.loading = false;
                } else {
                    this.updateReportData(reportId)
                }
            } else {
                this.chartData = this.defaultChartData
                this.chartColumns = this.defaultChartColumns
                this.loading = false;
            }
        }
    }
</script>