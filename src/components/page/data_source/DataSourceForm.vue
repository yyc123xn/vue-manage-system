<template>
    <el-col>
        <el-col class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-calendar"></i> 表单</el-breadcrumb-item>
                <el-breadcrumb-item>基本表单</el-breadcrumb-item>
            </el-breadcrumb>
        </el-col>
        <el-col class="container">
            <el-col class="form-box">
                <el-form ref="dataSource" :rules="rules" :model="dataSource" label-width="7%">
                    <el-form-item label="url" prop="url">
                        <el-input v-model="dataSource.url"></el-input>
                    </el-form-item>
                    <el-form-item label="username" prop="username">
                        <el-input v-model="dataSource.username"></el-input>
                    </el-form-item>
                    <el-form-item label="password" prop="password">
                        <el-input v-model="dataSource.password"></el-input>
                    </el-form-item>
                    <el-form-item label="数据源类型" prop="dataSourceType">
                        <el-select v-model="dataSourceInit.dataSourceType" placeholder="请选择">
                            <template v-for="(dataSourceType, index) in dataSourceInit.dataSourceTypes">
                                <el-option :key="dataSourceType.nameEn" :label="dataSourceType.nameEn" :value="dataSourceType.nameEn"></el-option>
                            </template>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="数据库名" prop="database">
                        <el-input v-model="dataSource.database"></el-input>
                    </el-form-item>
                    <el-form-item label="权限" prop="privilege">
                        <el-select v-model="dataSourceInit.privilege" placeholder="请选择">
                            <template v-for="(privilege, index) in dataSourceInit.privileges">
                                <el-option :key="privilege.nameEn" :label="privilege.nameCn" :value="privilege.nameCn"></el-option>
                            </template>
                        </el-select>
                    </el-form-item>
                    <!--<el-form-item label="固定资产描述">-->
                    <!--<el-input type="textarea" rows="5" v-model="developer.desc"></el-input>-->
                    <!--</el-form-item>-->
                    <!--<el-form-item label="固定资产时间">-->
                    <!--<el-col :span="12">-->
                    <!--<el-date-picker type="date" placeholder="选择日期" v-model="developer.date1" style="width: 100%;"></el-date-picker>-->
                    <!--</el-col>-->
                    <!--</el-form-item>-->
                    <!--<el-form-item label="固定资产类型">-->
                    <!--<el-select v-model="developer.region" placeholder="请选择">-->
                    <!--<template v-for="(voucherType, index) in developer.voucherTypes">-->
                    <!--<el-option :key="voucherType.nameEn" :label="voucherType.nameCn" :value="voucherType.nameCn"></el-option>-->
                    <!--</template>-->
                    <!--</el-select>-->
                    <!--</el-form-item>-->
                    <!--<el-form-item label="日期时间">-->
                    <!--<el-col :span="11">-->
                    <!--<el-date-picker type="date" placeholder="选择日期" v-model="developer.date1" style="width: 100%;"></el-date-picker>-->
                    <!--</el-col>-->
                    <!--<el-col class="line" :span="2">-</el-col>-->
                    <!--<el-col :span="11">-->
                    <!--<el-time-picker placeholder="选择时间" v-model="developer.date2" style="width: 100%;"></el-time-picker>-->
                    <!--</el-col>-->
                    <!--</el-form-item>-->
                    <!--<el-form-item label="城市级联">-->
                    <!--<el-cascader :options="options" v-model="developer.options"></el-cascader>-->
                    <!--</el-form-item>-->
                    <!--<el-form-item label="选择开关">-->
                    <!--<el-switch v-model="developer.delivery"></el-switch>-->
                    <!--</el-form-item>-->
                    <!--<el-form-item label="多选框">-->
                    <!--<el-checkbox-group v-model="developer.type">-->
                    <!--<el-checkbox label="步步高" name="type"></el-checkbox>-->
                    <!--<el-checkbox label="小天才" name="type"></el-checkbox>-->
                    <!--<el-checkbox label="imoo" name="type"></el-checkbox>-->
                    <!--</el-checkbox-group>-->
                    <!--</el-form-item>-->
                    <!--<el-form-item label="单选框">-->
                    <!--<el-radio-group v-model="developer.resource">-->
                    <!--<el-radio label="步步高"></el-radio>-->
                    <!--<el-radio label="小天才"></el-radio>-->
                    <!--<el-radio label="imoo"></el-radio>-->
                    <!--</el-radio-group>-->
                    <!--</el-form-item>-->
                    <el-form-item>
                        <el-button type="primary" @click="addDataSource">表单提交</el-button>
                        <el-button>取消</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-col>

    </el-col>
</template>

<script>
    export default {
        name: 'DataSourceForm',
        data: function(){
            return {
                dataSource: {
                    id : 0,
                    url : '',
                    username : '',
                    password : '',
                    developer : '',
                    data_source_type : '',
                    database : '',
                    weight : 0,
                    privilege : ''
                },
                dataSourceInit: {
                    sex : "男",
                    privilege : '',
                    privileges : [],
                    dataSourceType: '',
                    dataSourceTypes: []
                },
                rules: {
                    url: [
                        { required: true, message: '请输入url', trigger: 'blur' }
                    ],
                    username: [
                        { required: true, message: '请输入username', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入password', trigger: 'blur' }
                    ],
                    dataSourceType : [
                        { required: true, message: '请选择数据源类型', trigger: 'blur' }
                    ],
                    database : [
                        { required: true, message: '请输入数据库名', trigger: 'blur' }
                    ],
                    privilege : [
                        { required: true, message: '请选择数据库查看权限', trigger: 'blur' },
                    ]
                },
                options:[
                    {
                        value: 'guangdong',
                        label: '广东省',
                        children: [
                            {
                                value: 'guangzhou',
                                label: '广州市',
                                children: [
                                    {
                                        value: 'tianhe',
                                        label: '天河区'
                                    },
                                    {
                                        value: 'haizhu',
                                        label: '海珠区'
                                    }
                                ]
                            },
                            {
                                value: 'dongguan',
                                label: '东莞市',
                                children: [
                                    {
                                        value: 'changan',
                                        label: '长安镇'
                                    },
                                    {
                                        value: 'humen',
                                        label: '虎门镇'
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        value: 'hunan',
                        label: '湖南省',
                        children: [
                            {
                                value: 'changsha',
                                label: '长沙市',
                                children: [
                                    {
                                        value: 'yuelu',
                                        label: '岳麓区'
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        },
        methods: {

            addDataSource() {
                this.dataSourceInit.privileges.forEach(privilege => {
                    if (privilege.nameCn === this.dataSourceInit.privilege) {
                        this.dataSource.privilege = privilege.nameEn
                    }
                })
                this.dataSourceInit.academicDegrees.forEach(academicDegree => {
                    if (academicDegree.nameCn === this.dataSourceInit.academicDegree) {
                        this.dataSource.academicDegree = academicDegree.nameEn
                    }
                })
                this.dataSource.sex = this.dataSourceInit.sex === '男' ? 1 : 0;
                this.dataSource.group = this.dataSourceInit.group[0]
                console.log(this.dataSource)
                this.$api.FINANCE_DEVELOPER_API.post('ADD_DEVELOPER', this.dataSource).then(res => {
                    this.$message.success("成功添加员工")
                    this.$router.replace('/data_source_table')
                })
            },

            getPrivileges() {
                this.$api.FINANCE_DEVELOPER_API.get('GET_PRIVILEGES').then(res => {
                    this.dataSourceInit.privileges = res.data
                })
            },

            getAcademicDegrees() {
                this.$api.FINANCE_DEVELOPER_API.get('GET_ACADEMIC_DEGREES').then(res => {
                    this.dataSourceInit.academicDegrees = res.data
                })
            },

            getDataSourceTypes() {
                this.$api.REPORT_DATA_SOURCE_API.get('GET_DATA_SOURCE_TYPES').then(res => {
                    this.dataSourceInit.dataSourceTypes = res.data;
                    this.dataSourceInit.dataSourceType = this.dataSourceInit.dataSourceTypes[0].nameEn;
                })
            },

            onSubmit() {
                this.$message.success('提交成功！');
            }
        },
        created() {
            this.getPrivileges()
            this.getAcademicDegrees()
            this.getDataSourceTypes()
        }
    }
</script>