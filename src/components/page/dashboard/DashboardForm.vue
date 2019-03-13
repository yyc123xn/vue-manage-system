<template>
    <el-col>
        <el-col class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-calendar"></i> 表单</el-breadcrumb-item>
                <el-breadcrumb-item>基本表单</el-breadcrumb-item>
            </el-breadcrumb>
        </el-col>

        <el-col class="container">

            <el-steps :active="index - 1" finish-status="success" simple>
                <el-step title="步骤 1" ></el-step>
                <el-step title="步骤 2" ></el-step>
                <el-step title="步骤 3" ></el-step>
            </el-steps>

            <!--步骤1-->
            <el-col class="form-box" v-if="1 === index">
                <el-col  style="margin-top: 25px; text-align: center; margin-bottom: 25px; font-weight : 700" >数据看板基本信息</el-col>
                <el-form ref="dashboard" :rules="rules" :model="dashboard" label-width="9%">
                    <el-form-item label="数据看板名" prop="name">
                        <el-input v-model="dashboard.name"></el-input>
                    </el-form-item>
                    <el-form-item label="数据看板描述" prop="description">
                        <el-input type="textarea" rows="5" v-model="dashboard.description"></el-input>
                    </el-form-item>
                    <el-form-item label="权限" prop="privilege">
                        <el-select v-model="dashboard.privilege" placeholder="请选择">
                            <template v-for="(privilege, index) in dashboardConstant.privileges">
                                <el-option :key="privilege.nameEn" :label="privilege.nameCn" :value="privilege.nameEn"></el-option>
                            </template>
                        </el-select>
                    </el-form-item>
                </el-form>
            </el-col>

            <!--步骤2-->
            <el-col v-if="2 === index">
                <el-col  style="margin-top: 25px; text-align: center; margin-bottom: 25px; font-weight : 700;" >数据看板报表制作</el-col>
                <el-row  :gutter="30">
                    <el-col :span="24 / dashboard.reportss.length" v-for="(reports, index1) in dashboard.reportss" :key="index1">
                        <el-col class="drag-box-item">
                            <el-col class="item-title">第{{index1 + 1}}列</el-col>
                            <draggable v-model="dashboard.reportss[index1]" @remove="removeHandle" :options="dragOptions">
                                <transition-group tag="div" :id="'第' + (index1 + 1) + '列'" class="item-ul">
                                    <div v-for="(report, index2) in dashboard.reportss[index1]" class="drag-list" :key="index1 + index2 + ''">
                                        {{report.name}}
                                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(index1, index2)">编辑</el-button>
                                        <el-button type="text" icon="el-icon-delete" class="red" @click="deleteReportRow(index1, index2)">删除</el-button>
                                    </div>
                                </transition-group>
                            </draggable>
                            <el-col align="center">
                                <el-button type="primary" icon="el-icon-lx-add" @click="addReportRow(index1)" style="margin-bottom: 3%; margin-top: 3%">添加一行</el-button>
                            </el-col>
                        </el-col>
                    </el-col>
                </el-row>
                <el-col align="center">
                    <el-button type="primary" icon="el-icon-lx-add" @click="addReportColumn" style="margin-top: 2%">添加一列</el-button>
                    <el-button type="danger" icon="el-icon-lx-move" @click="deleteReportColumn" style="margin-top: 2%">删除一列</el-button>
                </el-col>
            </el-col>

            <!-- 编辑报表弹出框 -->
            <el-dialog title="编辑报表" :visible.sync="editVisible" width="70%">
                <el-form ref="form" :rules="rules.reportRules" :model="handleEditForm" label-width="10%">
                    <el-form-item label="报表名称" prop="name">
                        <el-input v-model="handleEditForm.name"></el-input>
                    </el-form-item>
                    <el-form-item label="报表描述" prop="description">
                        <el-input type="textarea" rows="5" v-model="handleEditForm.description"></el-input>
                    </el-form-item>
                    <el-form-item label="数据集列表" prop="dataSet">
                        <el-select v-model="handleEditForm.dataSetId" placeholder="请选择" filterable @change="getDataSetMetrics" @click="getDataSetMetrics">
                            <template v-for="(dataSet, index) in dashboardConstant.reportConstant.dataSets">
                                <el-option :key="dataSet.id" :label="dataSet.name" :value="dataSet.id"></el-option>
                            </template>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="数据集指标" prop="dataSetFieldIds">
                        <el-select v-model="handleEditForm.dataSetFieldIds" placeholder="请选择" filterable multiple>
                            <template v-for="(metric, index) in dashboardHelper.reportssHelper[handleEditForm.index1][handleEditForm.index2].metrics">
                                <el-option :key="metric.id" :label="metric.showName" :value="metric.id"></el-option>
                            </template>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="报表类型" prop="chartType">
                        <el-select v-model="handleEditForm.chartType" placeholder="请选择">
                            <template v-for="(chartType, index) in dashboardConstant.reportConstant.chartTypes">
                                <el-option :key="chartType.nameEn" :label="chartType.nameCn" :value="chartType.nameEn"></el-option>
                            </template>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="报表属性配置">
                        <el-collapse>
                            <el-collapse-item :title="handleEditForm.chartType">
                                <el-col v-if="'UNRECOGNIZED' === handleEditForm.chartType">
                                    <div class="red">请选择其他报表类型</div>
                                </el-col>
                                <el-col v-if="'LINE' === handleEditForm.chartType">
                                    <el-form ref="handleEditForm.chartSettings" :rules="rules" :model="handleEditForm.chartSettings" label-width="20%">
                                        <el-form-item label="axisSite(设置右轴key)">
                                            <el-select v-model="handleEditForm.config.chartSettings.axisSite.right" placeholder="请选择" multiple filterable>
                                                <template v-for="(metric, index) in dashboardHelper.reportssHelper[handleEditForm.index1][handleEditForm.index2].metrics">
                                                    <el-option :key="metric.showName" :label="metric.showName" :value="metric.id"></el-option>
                                                </template>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="yAxisType(双y轴坐标类型)">
                                            <el-col :span="1">
                                                左轴
                                            </el-col>
                                            <el-col :span="10">
                                                <el-select v-model="handleEditForm.config.chartSettings.yAxisType[0]" placeholder="请选择">
                                                    <el-option :key="'KMP'" :label="'KMP'" :value="'KMP'"></el-option>
                                                    <el-option :key="'MP'" :label="'MP'" :value="'MP'"></el-option>
                                                    <el-option :key="'percent'" :label="'percent'" :value="'percent'"></el-option>
                                                </el-select>
                                            </el-col>
                                            <el-col :span="1">
                                                右轴
                                            </el-col>
                                            <el-col :span="10">
                                                <el-select v-model="handleEditForm.config.chartSettings.yAxisType[1]" placeholder="请选择">
                                                    <el-option :key="'KMP'" :label="'KMP'" :value="'KMP'"></el-option>
                                                    <el-option :key="'MP'" :label="'MP'" :value="'MP'"></el-option>
                                                    <el-option :key="'percent'" :label="'percent'" :value="'percent'"></el-option>
                                                </el-select>
                                            </el-col>
                                        </el-form-item>
                                        <el-form-item label="yAxisName(双y轴名)">
                                            <el-col :span="1">
                                                左轴
                                            </el-col>
                                            <el-col :span="10">
                                                <el-input v-model="handleEditForm.config.chartSettings.yAxisName[0]"></el-input>
                                            </el-col>
                                            <el-col :span="1">
                                                右轴
                                            </el-col>
                                            <el-col :span="10">
                                                <el-input v-model="handleEditForm.config.chartSettings.yAxisName[1]"></el-input>
                                            </el-col>
                                        </el-form-item>
                                        <el-form-item label="多指标堆叠">
                                            <el-select v-model="handleEditForm.config.chartSettings.stack.key" placeholder="请选择" multiple>
                                                <template v-for="(metric, index) in dashboardHelper.reportssHelper[handleEditForm.index1][handleEditForm.index2].metrics">
                                                    <el-option :key="metric.showName" :label="metric.showName" :value="metric.id"></el-option>
                                                </template>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="指标数值">
                                            <el-checkbox v-model="handleEditForm.config.extend.lineSeries.label.normal.show">展示</el-checkbox>
                                        </el-form-item>
                                    </el-form>

                                    <div>备注1. axisSite(设置右轴key)：例如输入‘占比’， 即将占比的数据置于右轴上。</div>
                                    <div>备注2. yAxisType(双y轴坐标类型)：y轴坐标类型，KMP单位为k(数据值为5000时，显示5k)，percent单位为%(数据为0.6时，显示60%)。</div>
                                    <div>备注3. yAxisName(双y轴名)：y轴坐标展示的单位。</div>
                                    <div>备注4. 指标数值展示：对于每一个指标的数值是否需要展示出来。</div>
                                    <div>备注5. 多指标堆叠：展示数据时，对于选中的指标进行堆叠展示。</div>
                                </el-col>
                                <el-col v-if="'HISTOGRAM' === handleEditForm.chartType">
                                    <el-form ref="handleEditForm.chartSettings" :rules="rules" :model="handleEditForm.chartSettings" label-width="20%">
                                        <el-form-item label="axisSite(设置右轴key)">
                                            <el-select v-model="handleEditForm.config.chartSettings.axisSite.right" placeholder="请选择" multiple filterable>
                                                <template v-for="(metric, index) in dashboardHelper.reportssHelper[handleEditForm.index1][handleEditForm.index2].metrics">
                                                    <el-option :key="metric.showName" :label="metric.showName" :value="metric.id"></el-option>
                                                </template>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="yAxisType(双y轴坐标类型)">
                                            <el-col :span="1">
                                                左轴
                                            </el-col>
                                            <el-col :span="10">
                                                <el-select v-model="handleEditForm.config.chartSettings.yAxisType[0]" placeholder="请选择">
                                                    <el-option :key="'KMP'" :label="'KMP'" :value="'KMP'"></el-option>
                                                    <el-option :key="'MP'" :label="'MP'" :value="'MP'"></el-option>
                                                    <el-option :key="'percent'" :label="'percent'" :value="'percent'"></el-option>
                                                </el-select>
                                            </el-col>
                                            <el-col :span="1">
                                                右轴
                                            </el-col>
                                            <el-col :span="10">
                                                <el-select v-model="handleEditForm.config.chartSettings.yAxisType[1]" placeholder="请选择">
                                                    <el-option :key="'KMP'" :label="'KMP'" :value="'KMP'"></el-option>
                                                    <el-option :key="'MP'" :label="'MP'" :value="'MP'"></el-option>
                                                    <el-option :key="'percent'" :label="'percent'" :value="'percent'"></el-option>
                                                </el-select>
                                            </el-col>
                                        </el-form-item>
                                        <el-form-item label="yAxisName(双y轴名)">
                                            <el-col :span="1">
                                                左轴
                                            </el-col>
                                            <el-col :span="10">
                                                <el-input v-model="handleEditForm.config.chartSettings.yAxisName[0]"></el-input>
                                            </el-col>
                                            <el-col :span="1">
                                                右轴
                                            </el-col>
                                            <el-col :span="10">
                                                <el-input v-model="handleEditForm.config.chartSettings.yAxisName[1]"></el-input>
                                            </el-col>
                                        </el-form-item>
                                        <el-form-item label="堆叠柱状图">
                                            <el-select v-model="handleEditForm.config.chartSettings.stack.key" placeholder="请选择" multiple>
                                                <template v-for="(metric, index) in dashboardHelper.reportssHelper[handleEditForm.index1][handleEditForm.index2].metrics">
                                                    <el-option :key="metric.showName" :label="metric.showName" :value="metric.id"></el-option>
                                                </template>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="指标数值">
                                            <el-checkbox v-model="handleEditForm.config.extend.histogramSeries.label.show">展示</el-checkbox>
                                        </el-form-item>
                                    </el-form>
                                    <div>备注1. axisSite(设置右轴key)：例如输入‘占比’， 即将占比的数据置于右轴上。</div>
                                    <div>备注2. yAxisType(双y轴坐标类型)：y轴坐标类型，KMP单位为k(数据值为5000时，显示5k)，percent单位为%(数据为0.6时，显示60%)。</div>
                                    <div>备注3. yAxisName(双y轴名)：y轴坐标展示的单位。</div>
                                    <div>备注4. 指标数值展示：对于每一个指标的数值是否需要展示出来。</div>
                                    <div>备注5. 堆叠柱状图展示：展示为堆叠柱状图。</div>
                                </el-col>
                                <el-col v-if="'TABLE' === handleEditForm.chartType">
                                    <div>与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；</div>
                                    <div>在界面中一致：所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。</div>
                                </el-col>
                                <el-col v-if="'PIE' === handleEditForm.chartType">
                                    <el-form ref="handleEditForm.chartSettings" :rules="rules" :model="handleEditForm.chartSettings" label-width="20%">
                                        <el-form-item label="数据类型">
                                            <el-select v-model="handleEditForm.config.chartSettings.dataType" placeholder="请选择">
                                                <el-option :key="'KMP'" :label="'KMP'" :value="'KMP'"></el-option>
                                                <el-option :key="'MP'" :label="'MP'" :value="'MP'"></el-option>
                                                <el-option :key="'percent'" :label="'percent'" :value="'percent'"></el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="玫瑰图">
                                            <el-checkbox v-model="handleEditForm.config.chartSettings.roseType">展示</el-checkbox>
                                        </el-form-item>
                                    </el-form>
                                    <div>备注1. yAxisType(双y轴坐标类型)：y轴坐标类型，KMP单位为k(数据值为5000时，显示5k)，percent单位为%(数据为0.6时，显示60%)。</div>
                                    <div>备注2. 玫瑰图展示：展示为玫瑰图。</div>
                                </el-col>
                            </el-collapse-item>
                        </el-collapse>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                <!--<el-button @click="editVisible = false">取 消</el-button>-->
                <el-button type="primary" @click="">确 定</el-button>
            </span>
            </el-dialog>

            <!-- 删除提示框 -->
            <el-dialog title="提示" :visible.sync="deleteVisible" width="300px" center>
                <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
                <span slot="footer" class="dialog-footer">
                <!--<el-button @click="deleteVisible = false">取 消</el-button>-->
                <el-button type="primary" @click="">确 定</el-button>
            </span>
            </el-dialog>

            <!--步骤3-->
            <el-col v-if="3 === index">
                <el-col style="margin-top: 25px; text-align: center; margin-bottom: 25px; font-weight : 700;" >数据看板过滤器设置</el-col>
                <el-form>
                    <el-form-item
                            v-for="(reportFilter, index) in dashboard.reportFilters"
                            :label="'过滤器' + (index + 1)"
                            :key="reportFilter.id"
                            :prop="'reportFilters.' + index + '.value'">
                        <el-col class="line" :span="2">名称</el-col>
                        <el-col :span="3"><el-input v-model="reportFilter.name"></el-input></el-col>
                        <el-col class="line" :span="2">过滤器类型</el-col>
                        <el-col :span="3">
                            <el-select v-model="reportFilter.filterType" placeholder="请选择">
                                <template v-for="(filterType, index) in dashboardConstant.reportFilterConstant.filterTypes">
                                    <el-option :key="filterType.nameEn" :label="filterType.nameCn" :value="filterType.nameEn"></el-option>
                                </template>
                            </el-select>
                        </el-col>
                        <el-col class="line" :span="2">作用报表</el-col>
                        <el-col :span="3">
                            <el-select v-model="reportFilter.reportIds" placeholder="请选择" multiple>
                                <template v-for="(report, index) in dashboardHelper.reportFilterHelper" :value="filterType.nameEn">
                                    <el-option :key="'' + report.name + report.chartType" :label="report.name" :value="report.id"></el-option>
                                </template>
                            </el-select>
                        </el-col>
                        <el-col class="line" :span="2">操作</el-col>
                        <el-col :span="2"><el-button @click.prevent="removeDataSetField(dataSetField)" type="danger">删除</el-button></el-col>
                    </el-form-item>
                </el-form>
                <el-col align="center">
                    <el-button type="primary" icon="el-icon-lx-add" @click="addReportFilter" style="margin-top: 2%">添加过滤器</el-button>
                    <el-button type="primary" icon="el-icon-lx-add" @click="addDashboard" style="margin-top: 2%">提交</el-button>
                </el-col>
            </el-col>

            <el-col align="center" style="margin-top: 30px">
                <el-button-group>
                    <el-button type="primary" icon="el-icon-arrow-left" @click="previousPage" v-if="2 === index || 3 === index">上一页</el-button>
                    <el-button type="primary" @click="nextPage" v-if="1 === index || 2 === index">下一页<i class="el-icon-arrow-right el-icon--right"></i></el-button>
                </el-button-group>
            </el-col>

        </el-col>

    </el-col>
</template>

<script>
    import draggable from 'vuedraggable'
    export default {
        name: 'DashboardForm',
        components : {
            draggable
        },
        data: function(){
            return {
                dashboardConstant: {
                    privileges: [],
                    reportFilterConstant: {
                        filterTypes: []
                    },
                    // 报表中需要的枚举值
                    reportConstant: {
                        dataSets: [],
                        chartTypes: [],
                    },
                },

                dashboardHelper: {

                    reportFilterHelper: [],
                    // 用户选择的不同数据集的指标list
                    reportssHelper: [
                        [
                            {
                                metrics: []
                            }
                        ]
                    ]
                },
                dashboard: {
                    id: 0,
                    name: '',
                    description: '',
                    privilege: '',
                    reportFilters: [
                        {
                            id: 0,
                            name: "",
                            filterType: '',
                            reportIds: []
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
                                chartType: '',
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

                rules: {
                    name: [
                        {required: true, message: '请输入数据看板名', trigger: 'blur'}
                    ],
                    description: [
                        {required: true, message: '请输入数据看板描述', trigger: 'blur'}
                    ],
                    privilege: [
                        {required: true, message: '请选择员工权限', trigger: 'blur'},
                    ],
                    reportRules: {
                        name: [
                            {required: true, message: '请输入报表名', trigger: 'blur'}
                        ],
                        description: [
                            {required: true, message: '请输入报表描述', trigger: 'blur'}
                        ],
                        dataSet: [
                            {required: true, message: '请输入报表名', trigger: 'blur'}
                        ],
                        chartType: [
                            {required: true, message: '请输入报表描述', trigger: 'blur'}
                        ],
                        dataSetFieldIds: [
                            {required: true, message: '请输入报表描述', trigger: 'blur'}
                        ]
                    },
                    reportFilterRules: {
                        name: [
                            {required: true, message: '请输入过滤器名', trigger: 'blur'}
                        ],
                        filterType: [
                            {required: true, message: '请选择过滤器类型', trigger: 'blur'}
                        ],
                        reportIds: [
                            {required: true, message: '请选择过滤器需要作用的报表', trigger: 'blur'}
                        ]
                    }
                },
                dragOptions: {
                    animation: 120,
                    scroll: true,
                    group: 'sortlist',
                    ghostClass: 'ghost-style'
                },
                index: 1,
                editVisible: false,
                deleteVisible: false,

                handleEditForm : {
                    index1: 0,
                    index2: 0,
                    name: "",
                    dataSetId: "",
                    dataSets: [],
                    chartType: '',
                    chartTypes: [],
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
                    },
                    metrics: []
                },
            }
        },
        methods: {

            // 获取数据集下的指标列表
            getDataSetMetrics(id) {
                this.handleEditForm.dataSetFieldIds = []
                let queryParams = {
                    id : id
                }
                this.$api.REPORT_DATA_SET_API.get('GET_DATA_SET_METRICS', queryParams).then(res => {
                    this.handleEditForm.metrics = res.data
                    this.dashboardHelper.reportssHelper[this.handleEditForm.index1][this.handleEditForm.index2].metrics = this.handleEditForm.metrics
                })
            },

            // step2-报表编辑
            handleEdit(index1, index2) {
                this.handleEditForm = this.dashboard.reportss[index1][index2]
                this.editVisible = true
                this.handleEditForm.dataSets = this.dashboardConstant.reportConstant.dataSets
                this.handleEditForm.chartTypes = this.dashboardConstant.reportConstant.chartTypes
                this.handleEditForm.metrics = this.dashboardHelper.reportssHelper[index1][index2].metrics
                this.handleEditForm.index1 = index1
                this.handleEditForm.index2 = index2
            },

            // 添加一行
            addReportRow(index1) {
                let report = {
                    id: 0,
                    name : "新报表",
                    description: "",
                    dataSetId: "",
                    config: {
                        chartSettings: {
                            // 折线图和柱状图
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
                let reportInit = {
                    metrics : []
                }
                this.dashboard.reportss[index1].push(report)
                this.dashboardHelper.reportssHelper[index1].push(reportInit)
            },

            // 添加一列
            addReportColumn() {
                let reports = []
                let reportsInit = []
                this.dashboard.reportss.push(reports)
                this.dashboardHelper.reportssHelper.push(reportsInit)
            },

            // 删除一列
            deleteReportColumn() {
                this.dashboard.reportss.pop()
                this.dashboardHelper.reportssHelper.pop()
            },

            // step2-报表删除
            deleteReportRow(index1, index2) {
                this.deleteVisible = true
                this.dashboard.reportss[index1].splice(index2, 1)
                this.dashboardHelper.reportssHelper[index1].splice(index2, 1)
            },

            // step3-添加报表过滤选项
            addReportFilter() {
                this.dashboard.reportFilters.push({
                    id: 0,
                    name: "",
                    filterType: '',
                    reportIds: []
                })
            },

            removeHandle(event){
                this.$message.success(`从 ${event.from.id} 移动到 ${event.to.id} `);
            },

            // 前一页
            previousPage() {
                if (2 === this.index || 3 === this.index) {
                    this.index--;
                }
            },

            // 后一页
            nextPage() {
                if (1 === this.index || 2 === this.index) {
                    this.index++;
                }
                if (3 === this.index) {
                    this.dashboardHelper.reportFilterHelper = []
                    this.dashboard.reportss.forEach(reports => {
                        reports.forEach(report => {
                            this.dashboardHelper.reportFilterHelper.push(report)
                        })
                    })
                }
            },

            addDashboard() {
                console.log(this.dashboard)
                this.$api.REPORT_DASHBOARD_API.post('ADD_DASHBOARD', this.dashboard).then(res => {
                    this.$message.success("成功添加数据看板")
                    this.$router.replace('/dashboard_table')
                })
            },

            // 获取数据集列表
            getDataSets() {
                let queryParams = {
                    pageIndex: 1,
                    pageSize: 10
                }
                this.$api.REPORT_DATA_SET_API.get('DATA_SET', queryParams).then(res => {
                    this.dashboardConstant.reportConstant.dataSets = res.data.list
                })
            },

            // 获取报表类型chartTypes
            getChartTypes() {
                this.$api.REPORT_REPORT_API.get('GET_CHART_TYPES').then(res => {
                    this.dashboardConstant.reportConstant.chartTypes = res.data
                })
            },

            getPrivileges() {
                this.$api.FINANCE_DEVELOPER_API.get('GET_PRIVILEGES').then(res => {
                    this.dashboardConstant.privileges = res.data
                })
            },

            getFilterTypes() {
                this.$api.REPORT_REPORT_API.get('GET_FILTER_TYPES').then(res => {
                    this.dashboardConstant.reportFilterConstant.filterTypes = res.data
                })
            }
        },
        created() {
            this.getPrivileges()
            this.getDataSets()
            this.getChartTypes()
            this.getFilterTypes()
        }
    }
</script>

<style>
    .drag-box-item {
        flex: 1;
        max-width: 100%;
        background-color: #eff1f5;
        border-radius: 6px;
        border: 1px #e1e4e8 solid;
    }
    .item-title{
        padding: 3% 8px 8px 12px;
        font-size: 14px;
        line-height: 1.5;
        color: #24292e;
        font-weight: 600;
    }
    .item-ul{
        padding: 0 8px 8px;
        height: 500px;
        overflow-y: scroll;
    }
    .item-ul::-webkit-scrollbar{
        width: 0;
    }
    .drag-list {
        border: 1px #e1e4e8 solid;
        padding: 10px;
        margin: 5px 0 10px;
        list-style: none;
        background-color: #fff;
        border-radius: 6px;
        cursor: pointer;
        -webkit-transition: border .3s ease-in;
        transition: border .3s ease-in;
    }
    .drag-list:hover {
        border: 1px solid #20a0ff;
    }

    .table{
        width: 100%;
        font-size: 14px;
    }

    .line{
        text-align: center;
    }

    .red{
        color: #ff0000;
    }
</style>