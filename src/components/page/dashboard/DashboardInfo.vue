<template>
    <el-col>
        <el-col class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-favor"></i> schart图表</el-breadcrumb-item>
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
                                        v-for="item in options"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
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
                                        v-for="item in options"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>

                    </el-form-item>
                </el-form>
            </el-col>
            <el-col>
                <el-col v-for="(reports, index1) in dashboard.reportss" :key="index1">
                    <el-col :span="24 / dashboard.reportss[index1].length" v-for="(report, index2) in dashboard.reportss[index1]" :key="index2">
                        <histogram :id="report.id" :loading="true" v-if="'HISTOGRAM' === report.chartType"></histogram>
                        <line-dup :id="report.id" :loading="true" v-if="'LINE' === report.chartType"></line-dup>
                        <pie :id="report.id" :loading="true" v-if="'PIE' === report.chartType"></pie>
                        <!--<MonitorCard v-if="'MONITOR_CARD' === report.chartType"></MonitorCard>-->
                        <guage :id="report.id" :loading="true" v-if="'GUAGE' === report.chartType"></guage>
                    </el-col>
                </el-col>
            </el-col>
        </el-col>
    </el-col>

</template>

<script>
    import Histogram from '../../common/charts/Histogram.vue'
    import LineDup from '../../common/charts/Line.vue'
    import Pie from '../../common/charts/Pie.vue'
    import MonitorCard from '../../common/charts/MonitorCard.vue'
    import Guage from '../../common/charts/Guage.vue'
    import 'echarts/lib/component/toolbox'
    export default {
        name: 'DashboardInfo',
        components: {
            Histogram,
            LineDup,
            Pie,
            MonitorCard,
            Guage
        },

        data: () => ({
            filter: [],
            dashboard: {
                id: 0,
                name: '看板名称',
                description: '看板描述',
                privilege: '',
                reportFilters: [
                    {
                        id: 0,
                        name: "过滤器1",
                        filterType: 'DATE',
                        reportIds: [1],
                        queryCondition: []
                    }
                ],
                reportss: [
                    [
                        {
                            id: 1,
                            name : "新报表",
                            description: "",
                            dataSetId: "",
                            dataSetFieldIds: [],
                            chartType: 'HISTOGRAM',
                            chartData: [],
                            loading : true,
                            config: {
                                chartSettings: {
                                    axisSite: { right: [] },
                                    yAxisType: [],
                                    yAxisName: [],
                                    stack: { 'key': [] },
                                    area: false,
                                    // 饼图
                                    roseType: 'radius',
                                    dataType: 'percent'
                                },
                                extend: {
                                    // 折线图显示指标数据
                                    lineSeries: {
                                        label: {
                                            normal: {
                                                show: false
                                            }
                                        }
                                    },

                                    // 柱状图显示指标数据
                                    histogramSeries: {
                                        label: {
                                            show: false,
                                            position: "top"
                                        }
                                    }
                                }
                            }
                        }
                    ]
                ]
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