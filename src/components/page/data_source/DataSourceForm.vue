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
                <el-form ref="dataSource" :rules="rules" :model="dataSource" label-width="8%">
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
                        <el-select v-model="dataSource.dataSourceType" placeholder="请选择">
                            <template v-for="(dataSourceType, index) in dataSourceConstant.dataSourceTypes">
                                <el-option :key="dataSourceType.nameEn" :label="dataSourceType.nameEn" :value="dataSourceType.nameEn"></el-option>
                            </template>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="数据库名" prop="database">
                        <el-input v-model="dataSource.database"></el-input>
                    </el-form-item>
                    <el-form-item label="权限" prop="privilege">
                        <el-select v-model="dataSource.privilege" placeholder="请选择">
                            <template v-for="(privilege, index) in dataSourceConstant.privileges">
                                <el-option :key="privilege.nameEn" :label="privilege.nameCn" :value="privilege.nameEn">
                                    <span style="float: left">{{ privilege.nameCn }}</span>
                                    <span style="float: right; color: #8492a6; font-size: 13px">{{ privilege.nameEn }}</span>
                                </el-option>
                            </template>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="addDataSource('dataSource')">表单提交</el-button>
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
                    dataSourceType : '',
                    database : '',
                    weight : 0,
                    privilege : ''
                },
                dataSourceConstant: {
                    privileges : [],
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
                }
            }
        },
        methods: {

            addDataSource(dataSource) {
                this.$refs[dataSource].validate((valid) => {
                    if (valid) {
//                        this.$api.REPORT_DATA_SOURCE_API.post('ADD_DATA_SOURCE', this.dataSource).then(res => {
//                            this.$message.success("成功添加员工")
//                            this.$router.replace('/data_source_table')
//                        })
                    } else {
                        this.$message.error("请将数据源信息填写完整")
                        return false;
                    }
                })
            },

            getPrivileges() {
                this.$api.FINANCE_DEVELOPER_API.get('GET_PRIVILEGES').then(res => {
                    this.dataSourceConstant.privileges = res.data
                })
            },

            getDataSourceTypes() {
                this.$api.REPORT_DATA_SOURCE_API.get('GET_DATA_SOURCE_TYPES').then(res => {
                    this.dataSourceConstant.dataSourceTypes = res.data;
                    this.dataSourceConstant.dataSourceType = this.dataSourceConstant.dataSourceTypes[0].nameEn;
                })
            }
        },
        created() {
            this.getPrivileges()
            this.getDataSourceTypes()
        }
    }
</script>