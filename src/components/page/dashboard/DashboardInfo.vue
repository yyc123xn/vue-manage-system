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
                                    <span v-for="(value, key) in chartTypeToolTips" style="float: right" :key="key">
                                        <el-tooltip v-if="report.chartType === key" placement="top">
                                            <div slot="content" v-html="value"></div>
                                            <el-button type="primary" icon="el-icon-search" circle plain></el-button>
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
                                <Table :report="report" :reportFilters="dashboard.reportFilters" v-if="'TABLE' === report.chartType"></Table>
                                <Table style="margin-bottom: 20px" :report="report" :reportFilters="dashboard.reportFilters" :isTop10Table="true" v-if="'TOP_10_TABLE' === report.chartType"></Table>
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
            chartTypeToolTips: {
                GUAGE: "仪表盘统计规则：<br/>展示数据为所选维度<br/>之下所有指标[之和]",
                HISTOGRAM: "柱状图统计规则：<br/>展示数据为所选维度<br/>之下的指标",
                LINE: "折线图统计规则：<br/>展示数据为所选维度<br/>之下的指标",
                PIE: "饼图统计规则：<br/>展示数据为所选维度<br/>之下的指标"
            }
        }),

        created() {
            let dashboardId = this.$route.query.id
            this.getDashboardInfo(dashboardId)
        },

        methods : {
            async getDashboardInfo(dashboardId) {
                let getParams = {
                    id : dashboardId
                }
                await this.$api.REPORT_DASHBOARD_API.get('GET_DASHBOARD_INFO', getParams).then(res => {
                    this.dashboard = res.data
                })
            }
        }
    }
</script>