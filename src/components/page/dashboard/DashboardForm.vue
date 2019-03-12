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

            <!--步骤一-->
            <el-col class="form-box" v-if="1 === index">
                <el-col  style="margin-top: 25px; text-align: center; margin-bottom: 25px; font-weight : 700" >数据看板基本信息</el-col>
                <el-form ref="dashboard" :rules="rules" :model="dashboard" label-width="6%">
                    <el-form-item label="数据看板名" prop="name">
                        <el-input v-model="dashboard.name"></el-input>
                    </el-form-item>
                    <el-form-item label="数据看板描述" prop="description">
                        <el-input type="textarea" rows="5" v-model="dashboard.description"></el-input>
                    </el-form-item>
                    <el-form-item label="权限" prop="privilege">
                        <el-select v-model="dashboardInit.privilege" placeholder="请选择">
                            <template v-for="(privilege, index) in dashboardInit.privileges">
                                <el-option :key="privilege.nameEn" :label="privilege.nameCn" :value="privilege.nameCn"></el-option>
                            </template>
                        </el-select>
                    </el-form-item>
                </el-form>
            </el-col>

            <!--步骤2-->
            <el-col v-if="2 === index">
                <el-col  style="margin-top: 25px; text-align: center; margin-bottom: 25px; font-weight : 700;" >数据看板报表制作</el-col>
                <el-row  :gutter="30">
                    <el-col :span="24 / reportss.length" v-for="(reports, index1) in reportss" :key="index1">
                        <el-col class="drag-box-item">
                            <el-col class="item-title">第{{index1 + 1}}列</el-col>
                            <draggable v-model="reportss[index1]" @remove="removeHandle" :options="dragOptions">
                                <transition-group tag="div" :id="'第' + (index1 + 1) + '列'" class="item-ul">
                                    <div v-for="(report, index2) in reportss[index1]" class="drag-list" :key="index1 + index2 + ''">
                                        {{report.content}}
                                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(report, reportssInit[index1][index2])">编辑</el-button>
                                        <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(index1, index2)">删除</el-button>
                                    </div>
                                </transition-group>
                            </draggable>
                            <el-col align="center">
                                <el-button type="primary" icon="el-icon-lx-add" @click="addRow(index1)" style="margin-bottom: 3%; margin-top: 3%">添加一行</el-button>
                            </el-col>
                        </el-col>
                    </el-col>
                </el-row>
                <el-col align="center">
                    <el-button type="primary" icon="el-icon-lx-add" @click="addColumn" style="margin-top: 2%">添加一列</el-button>
                    <el-button type="danger" icon="el-icon-lx-move" @click="deleteColumn" style="margin-top: 2%">删除一列</el-button>
                </el-col>
            </el-col>

            <!-- 编辑报表弹出框 -->
            <el-dialog title="编辑报表" :visible.sync="editVisible" width="70%">
                <el-form ref="form" :model="handleEditForm" label-width="8%">
                    <el-form-item label="报表名称">
                        <el-input v-model="handleEditForm.content"></el-input>
                    </el-form-item>
                    <el-form-item label="报表描述">
                        <el-input type="textarea" rows="5" v-model="handleEditForm.content"></el-input>
                    </el-form-item>
                    <el-form-item label="数据集列表">
                        <el-select v-model="handleEditForm.dataSet" placeholder="请选择">
                            <template v-for="(dataSet, index) in handleEditForm.dataSets">
                                <el-option :key="dataSet.name" :label="dataSet.name" :value="dataSet.name"></el-option>
                            </template>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="报表类型">
                        <el-select v-model="handleEditForm.chartType" placeholder="请选择">
                            <template v-for="(chartType, index) in handleEditForm.chartTypes">
                                <el-option :key="chartType.nameEn" :label="chartType.nameCn" :value="chartType.nameCn"></el-option>
                            </template>
                        </el-select>
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
                <el-col style="margin-top: 25px; text-align: center; margin-bottom: 25px; font-weight : 700;" >数据看板过滤选项设置</el-col>
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
    import ElCol from "element-ui/packages/col/src/col";
    export default {
        name: 'DashboardForm',
        components : {
            ElCol,
            draggable
        },
        data: function(){
            return {
                dashboard: {
                    id: 0,
                    name: '',
                    description: '',
                    sex: 0,
                    email: '',
                    privilege: '',
                    status: 1,
                    password: '',
                    group: '',
                    academicDegree: '',
                    baseWages: 0,
                    dutyWages: 0,
                    housingWages: 0,
                    pension: 0,
                    phoneNumber: '',
                    createDeveloper: '',
                    updateDeveloper: ''
                },
                dashboardInit: {
                    sex: "男",
                    privilege: '',
                    privileges: [
                        {
                            nameEn: "privilege1",
                            nameCn: "权限1"
                        },
                        {
                            nameEn: "privilege2",
                            nameCn: "权限2"
                        }
                    ],
                    group: [],
                    groups: [
                        {
                            value: "group1",
                            label: "部门1"
                        },
                        {
                            value: "group2",
                            label: "部门2"
                        }
                    ],
                    academicDegree: '',
                    academicDegrees: [
                        {
                            nameEn: "academicDegree1",
                            nameCn: "学历1"
                        },
                        {
                            nameEn: "academicDegree2",
                            nameCn: "学历2"
                        }
                    ]
                },
                rules: {
                    name: [
                        {required: true, message: '请输入数据看板名', trigger: 'blur'}
                    ],
                    description: [
                        {required: true, message: '请输入数据看板描述', trigger: 'blur'}
                    ],
                    sex: [
                        {required: true, message: '请输入中文名', trigger: 'blur'}
                    ],
                    email: [
                        {required: true, message: '请输入邮箱地址', trigger: 'blur'},
                        {type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change']}
                    ],
                    phoneNumber: [
                        {required: true, message: '请输入电话号码', trigger: 'blur'},
                        {validator: this.$validator.phoneNumber, trigger: 'blur'}
                    ],
                    privilege: [
                        {required: true, message: '请选择员工权限', trigger: 'blur'},
                    ],
                    group: [
                        {required: true, message: '请选择员工部门', trigger: 'blur'},
                    ],
                    academicDegree: [
                        {required: true, message: '请输入员工学历', trigger: 'blur'},
                    ],
                    region: [
                        {required: true, message: '请选择活动区域', trigger: 'change'}
                    ],
                    date1: [
                        {type: 'date', required: true, message: '请选择日期', trigger: 'change'}
                    ],
                    date2: [
                        {type: 'date', required: true, message: '请选择时间', trigger: 'change'}
                    ],
                    type: [
                        {type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change'}
                    ],
                    resource: [
                        {required: true, message: '请选择活动资源', trigger: 'change'}
                    ],
                    desc: [
                        {required: true, message: '请填写活动形式', trigger: 'blur'}
                    ]
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

                dataSets: [],
                chartTypes: [],

                handleEditForm : {
                    content: "content",
                    dataSet: '',
                    dataSets: [],
                    chartType: '',
                    chartTypes: []
                },

                reportss: [
                    [
                        {
                            id: 1,
                            content: '开发图表组件1',
                            name : "",
                            description: "",
                            dataSetId: 0,
                        },
                        {
                            id: 2,
                            content: '开发图表组件5',
                            name : "",
                            description: "",
                            dataSetId: 0
                        }
                    ],
//                    [
//                        {
//                            id: 1,
//                            content: '开发图表组件2',
//                            name : "",
//                            description: "",
//                            dataSetId: 0
//                        }
//                    ],
//                    [
//                        {
//                            id: 3,
//                            content: '开发图表组件3',
//                            name : "",
//                            description: "",
//                            dataSetId: 0
//                        }
//                    ]
                ],

                reportssInit : [
                    [
                        {
                            dataSets : [
                                {
                                    nameCn: "nameCn1",
                                    nameEn: "nameEn1"
                                }
                            ],
                            chartTypes : []
                        },
                        {
                            dataSets : [
                                {
                                    nameCn: "nameCn5",
                                    nameEn: "nameEn5"
                                }
                            ],
                            chartTypes : []
                        }
                    ],
                    [
                        {
                            dataSets : [
                                {
                                    nameCn: "nameCn2",
                                    nameEn: "nameEn2"
                                }
                            ],
                            chartTypes : []
                        }
                    ],
                    [
                        {
                            dataSets : [
                                {
                                    nameCn: "nameCn3",
                                    nameEn: "nameEn3"
                                }
                            ],
                            chartTypes : []
                        }
                    ]
                ]

            }
        },
        methods: {

            // 获取数据集列表
            getDataSets() {
                let queryParams = {
                    pageIndex: 1,
                    pageSize: 10
                }
                this.$api.REPORT_DATA_SET_API.get('DATA_SET', queryParams).then(res => {
                    this.dataSets = res.data.data.list
                    this.reportssInit.forEach(reportsInit => {
                        reportsInit.forEach(reportInit => {
                            reportInit.dataSets = this.dataSets
                        })
                    })
                })
            },

            // 获取报表类型chartTypes
            getChartTypes() {
                this.$api.REPORT_REPORT_API.get('GET_CHART_TYPES').then(res => {
                    this.chartTypes = res.data.data
                    this.reportssInit.forEach(reportsInit => {
                        reportsInit.forEach(reportInit => {
                            reportInit.chartTypes = this.chartTypes
                        })
                    })
                })
            },

            // step2-报表编辑
            handleEdit(report, reportInit) {
                console.log(report)
                this.handleEditForm = report
                this.editVisible = true
                this.handleEditForm.dataSets = reportInit.dataSets
                this.handleEditForm.chartTypes = reportInit.chartTypes
            },

            // 添加一行
            addRow(index1) {
                let report = {
                    id: 2,
                    content: '开发图表组件5',
                    name : "",
                    description: "",
                    dataSetId: 0
                }
                let reportInit = {
                    dataSets : this.dataSets,
                    chartTypes : this.chartTypes
                }
                this.reportss[index1].push(report)
                this.reportssInit[index1].push(reportInit)
            },

            // 添加一列
            addColumn() {
                let reports = []
                let reportsInit = []
                this.reportss.push(reports)
                this.reportssInit.push(reportsInit)
            },

            // 删除一列
            deleteColumn() {
                this.reportss.pop()
                this.reportssInit.pop()
            },

            // step2-报表删除
            handleDelete(index1, index2) {
                this.deleteVisible = true
                this.reportss[index1].splice(index2, 1)
                this.reportssInit[index1].splice(index2, 1)
            },

            removeHandle(event){
                console.log(event)
                this.$message.success(`从 ${event.from.id} 移动到 ${event.to.id} `);
            },

            // 前一页
            previousPage() {
                console.log(this.index)
                if (2 === this.index || 3 === this.index) {
                    this.index--;
                }
            },

            // 后一页
            nextPage() {
                console.log(this.index)
                if (1 === this.index || 2 === this.index) {
                    this.index++;
                }
            },

            addDeveloper() {
                this.dashboardInit.privileges.forEach(privilege => {
                    if (privilege.nameCn === this.dashboardInit.privilege) {
                        this.dashboard.privilege = privilege.nameEn
                    }
                })
                this.dashboardInit.academicDegrees.forEach(academicDegree => {
                    if (academicDegree.nameCn === this.dashboardInit.academicDegree) {
                        this.dashboard.academicDegree = academicDegree.nameEn
                    }
                })
                this.dashboard.sex = this.dashboardInit.sex === '男' ? 1 : 0;
                this.dashboard.group = this.dashboardInit.group[0]
                console.log(this.dashboard)
                this.$api.FINANCE_DEVELOPER_API.post('ADD_DEVELOPER', this.dashboard).then(res => {
                    this.$message.success("成功添加员工")
                    this.$router.replace('/developer_table')
                })
            },

            getPrivileges() {
                this.$api.FINANCE_DEVELOPER_API.get('GET_PRIVILEGES').then(res => {
                    this.dashboardInit.privileges = res.data.data
                })
            },

            getAcademicDegrees() {
                this.$api.FINANCE_DEVELOPER_API.get('GET_ACADEMIC_DEGREES').then(res => {
                    this.dashboardInit.academicDegrees = res.data.data
                })
            },

            onSubmit() {
                this.$message.success('提交成功！');
            }
        },
        created() {
            this.getPrivileges()
            this.getAcademicDegrees()
            this.getDataSets()
            this.getChartTypes()
        }
    }
</script>

<style>
    .drag-box{
        display: flex;
        user-select: none;
    }
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
    .drag-title {
        font-weight: 400;
        line-height: 25px;
        margin: 10px 0;
        font-size: 22px;
        color: #1f2f3d;
    }
    .ghost-style{
        display: block;
        color: transparent;
        border-style: dashed
    }

    .red{
        color: #ff0000;
    }
</style>