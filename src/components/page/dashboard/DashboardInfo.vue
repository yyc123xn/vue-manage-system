<template>
    <el-col>
        <el-col class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-rank"></i> 数据看板</el-breadcrumb-item>
                <el-breadcrumb-item>看板详情</el-breadcrumb-item>
            </el-breadcrumb>
        </el-col>
        <el-col class="container" v-model="dashboard">
            <el-col>
                <el-collapse>
                    <el-collapse-item :title="dashboard.name" name="1">
                        <div>{{dashboard.name}}</div>
                    </el-collapse-item>
                    <el-collapse-item title="简介" name="2">
                        <div>{{dashboard.description}}</div>
                    </el-collapse-item>
                </el-collapse>
            </el-col>
            <el-col style="margin-top: 30px; margin-bottom: 30px">过滤条件</el-col>
            <el-col style="margin-bottom: 30px">
                <el-form :inline="true">
                    <el-form-item  v-for="(reportFilter, index) in dashboard.reportFilters" :key="reportFilter.id" >
                            {{reportFilter.name}}
                            <el-select
                                    v-model="reportFilter.queryCondition"
                                    v-if="'MULTI_SELECT_DROP_DOWN' === reportFilter.filterType"
                                    multiple filterable placeholder="请选择" style="margin-right: 55px">
                                <el-option
                                        v-for="(a, index) in reportFilter.values"
                                        :key="index"
                                        :label="a"
                                        :value="a">
                                </el-option>
                            </el-select>
                            <el-date-picker
                                    v-model="reportFilter.queryCondition"
                                    v-if="'DATE' === reportFilter.filterType"
                                    type="datetimerange"
                                    :picker-options="pickerOptions"
                                    range-separator="至"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期"
                                    align="right"
                                    value-format="yyyyMMddHH">
                            </el-date-picker>
                            <el-select
                                    v-model="reportFilter.queryCondition"
                                    v-if="'DROP_DOWN' === reportFilter.filterType" filterable
                                    placeholder="请选择" style="margin-right: 30px">
                                <el-option
                                        v-for="(value, index) in reportFilter.values"
                                        :key="index"
                                        :label="value"
                                        :value="value">
                                </el-option>
                            </el-select>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col>

                <el-col v-for="(reports, index1) in dashboard.reportss" :key="index1">
                    <el-col :span="24 / dashboard.reportss[index1].length" v-for="(report, index2) in dashboard.reportss[index1]" :key="index2">
                        <el-card>
                            <div slot="header">
                                <span>
                                    <span>{{report.name}}</span>
                                    <span v-for="(chartTypeToolTip, index) in chartTypeToolTips" style="float: right" :key="chartTypeToolTip.chartType">
                                        <el-tooltip v-if="report.chartType === chartTypeToolTip.chartType" placement="top">
                                            <div slot="content" v-html="chartTypeToolTip.toolTip + '<br>' + report.description.replace('\n', '<br>')"></div>
                                            <el-button type="primary" icon="el-icon-search" circle plain></el-button>
                                        </el-tooltip>
                                        <el-tooltip v-if="report.chartType === chartTypeToolTip.chartType" placement="top">
                                            <div slot="content" v-html="'点击可导出为csv文件'"></div>
                                            <el-button type="primary" icon="el-icon-lx-down" circle plain @click="exportReportData2File(report)"></el-button>
                                        </el-tooltip>
                                    </span>
                                </span>
                            </div>
                            <div>
                                <Histogram :report="report" :reportFilters="dashboard.reportFilters" v-if="'HISTOGRAM' === report.chartType"></Histogram>
                                <LineDup :report="report" :reportFilters="dashboard.reportFilters" v-if="'LINE' === report.chartType"></LineDup>
                                <Pie :report="report" :reportFilters="dashboard.reportFilters" v-if="'PIE' === report.chartType"></Pie>
                                <!--<MonitorCard v-if="'MONITOR_CARD' === report.chartType"></MonitorCard>-->
                                <Guage :report="report" :reportFilters="dashboard.reportFilters" v-if="'GUAGE' === report.chartType"></Guage>
                                <Map :report="report" :reportFilters="dashboard.reportFilters" v-if="'MAP' === report.chartType"></Map>
                                <Table :class="{'table-paged' : !report.config.chartSettings.isPaged}" :report="report" :reportFilters="dashboard.reportFilters" v-if="'TABLE' === report.chartType"></Table>
                                <Table :class="{'top-x-table-paged' : !report.config.chartSettings.isPaged}" :report="report" :reportFilters="dashboard.reportFilters" v-if="'TOP_X_TABLE' === report.chartType"></Table>
                            </div>
                        </el-card>
                    </el-col>
                </el-col>
            </el-col>
        </el-col>
    </el-col>

</template>

<script>

    /**
     * todo 图表的cofig
     */
    import Histogram from '../../common/charts/Histogram.vue'
    import LineDup from '../../common/charts/Line.vue'
    import Pie from '../../common/charts/Pie.vue'
    import MonitorCard from '../../common/charts/MonitorCard.vue'
    import Guage from '../../common/charts/Guage.vue'
    import Map from '../../common/charts/Map.vue'
    import Table from '../../common/charts/Table.vue'
    import 'echarts/lib/component/toolbox'
    import ElCol from "element-ui/packages/col/src/col";
    export default {
        name: 'DashboardInfo',
        components: {
            ElCol,
            Histogram,
            LineDup,
            Pie,
            MonitorCard,
            Map,
            Guage,
            Table
        },

        data: () => ({
            dashboard: {
                id: 0,
                name: '看板名称',
                description: '看板描述',
                privilege: '',
                reportFilters: [],
                reportss: [[]]
            },
            pickerOptions: {
                shortcuts: [{
                    text: '最近一周',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近一个月',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近三个月',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                        picker.$emit('pick', [start, end]);
                    }
                }]
            },
            chartTypeToolTips: []
        }),

        created() {
            let dashboardId = this.$route.query.id
            this.getDashboardInfo(dashboardId)
            this.getChartTypeToolTips()
        },

        methods : {

            dateFtt(fmt, date)
            { //author: meizz
                var o = {
                    "M+" : date.getMonth()+1,     //月份
                    "d+" : date.getDate(),     //日
                    "H+" : date.getHours(),     //小时
                    "m+" : date.getMinutes(),     //分
                    "s+" : date.getSeconds(),     //秒
                    "q+" : Math.floor((date.getMonth()+3)/3), //季度
                    "S" : date.getMilliseconds()    //毫秒
                };
                if(/(y+)/.test(fmt))
                    fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
                for(var k in o)
                    if(new RegExp("("+ k +")").test(fmt))
                        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
                return fmt;
            },

            async getDashboardInfo(dashboardId) {
                let getParams = {
                    id : dashboardId
                }
                await this.$api.REPORT_DASHBOARD_API.get('GET_DASHBOARD_INFO', getParams).then(res => {
                    this.dashboard = res.data
                    this.dashboard.reportFilters.forEach(reportFilter => {
                        if ('DATE' !== reportFilter.filterType) {
                            this.getReportFilterValues(reportFilter)
                        } else {
                            let now = new Date()
                            let dateOf14DaysAgo = new Date(now)
                            dateOf14DaysAgo.setDate(now.getDate() - 14);
                            reportFilter.queryCondition = [
                                this.dateFtt("yyyyMMddHH", dateOf14DaysAgo)
                                , this.dateFtt("yyyyMMddHH", now)
                            ]
                        }
                    })
                })
            },

            getChartTypeToolTips() {
                this.$api.REPORT_COMMON_API.get("GET_CHART_TYPE_TOOL_TIPS").then(res => {
                    this.chartTypeToolTips = res.data
                })
            },

            getReportFilterValues(reportFilter) {
                let getParams = {
                    id : reportFilter.id
                }
                this.$api.REPORT_REPORT_FILTER_API.get("GET_REPORT_REPORT_FILTER_VALUES", getParams).then(res => {
                    reportFilter.values = res.data
                })
            },

            exportReportData2File(report) {
                let postParams = {
                    id : report.id
                }
                let queryReportFilter = this.initQueryReportFilter(report.id)
                if (queryReportFilter.queryColumns !== undefined && 0 < queryReportFilter.queryColumns.length) {
                    if (-1 !== ['TOP_X_TABLE', 'TABLE'].indexOf(report.chartType)
                        && report.config.chartSettings.isPaged) {
                        postParams.pageSize = report.config.chartSettings.pageSize
                        postParams.pageIndex = report.config.chartSettings.pageIndex
                    }
                    postParams.queryColumns = queryReportFilter.queryColumns
                    postParams.queryConditions = queryReportFilter.queryConditions
                }
                this.$api.REPORT_REPORT_API.post('EXPORT_REPORT_DATA_2_FILE', postParams).then(res => {
                    this.download(res)
                })
            },

            download (data) {
                if (!data) {
                    return
                }
                let url = window.URL.createObjectURL(new Blob([data], { type: 'text/csv;charset=ANSI;' }))
                let link = document.createElement('a')
                link.style.display = 'none'
                link.href = url
                // 获取文件名
                // download 属性定义了下载链接的地址而不是跳转路径
                link.setAttribute('download', "reportData.csv")
                document.body.appendChild(link)
                link.click()
            },

            /**
             * 重新生成queryReportFilter
             */
            initQueryReportFilter(reportId) {
                let queryReportFilter = {
                    queryColumns: [],
                    queryConditions: [],
                }
                this.dashboard.reportFilters.forEach(reportFilter => {
                    if (-1 !== reportFilter.reportIds.indexOf(reportId)
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
        }
    }
</script>

<style scoped>
    .table-paged {
        margin-bottom: 17px
    }

    .top-x-table-paged {
        margin-bottom: 20px;
    }
</style>
