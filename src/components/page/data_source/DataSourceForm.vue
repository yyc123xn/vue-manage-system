<template>
    <el-col>
        <el-col class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-file"></i> 数据源</el-breadcrumb-item>
                <el-breadcrumb-item v-if="isEdit">编辑数据源</el-breadcrumb-item>
                <el-breadcrumb-item v-if="!isEdit">新增数据源</el-breadcrumb-item>
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
                    <el-form-item>
                        <el-button type="primary" @click="addDataSource('dataSource')">表单提交</el-button>
                        <el-button @click="redirect2DataSourceTable">取消</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-col>

    </el-col>
</template>

<script>
    import ElFormItem from "../../../../node_modules/element-ui/packages/form/src/form-item.vue";

    export default {
        components: {ElFormItem},
        name: 'DataSourceForm',
        data: function(){
            return {
                dataSource: {
                    id : 0,
                    url : '',
                    username : '',
                    password : '',
                    createDeveloper : '',
                    dataSourceType : '',
                    database : '',
                    weight : 0,
                    privilege : ''
                },
                dataSourceConstant: {
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
                        let dataSourceId = this.$route.query.id
                        if (undefined !== dataSourceId) {
                            // 编辑
                            this.$api.REPORT_DATA_SOURCE_API.put('EDIT_DATA_SOURCE', this.dataSource).then(res => {
                                this.$message.success("成功编辑数据源信息")
                            })
                        } else {
                            // 添加
                            this.$api.REPORT_DATA_SOURCE_API.post('ADD_DATA_SOURCE', this.dataSource).then(res => {
                                this.$message.success("成功添加数据源信息")
                            })
                        }
                        this.$router.replace('/data_source_table')
                    } else {
                        this.$message.error("请将数据源信息填写完整")
                        return false;
                    }
                })
            },

            getDataSourceTypes() {
                this.$api.REPORT_DATA_SOURCE_API.get('GET_DATA_SOURCE_TYPES').then(res => {
                    this.dataSourceConstant.dataSourceTypes = res.data;
                    this.dataSourceConstant.dataSourceType = this.dataSourceConstant.dataSourceTypes[0].nameEn;
                })
            },

            getDataSourceInfo(id) {
                let queryParams = {
                    id : id
                }
                this.$api.REPORT_DATA_SOURCE_API.get('GET_DATA_SOURCE_INFO', queryParams).then(res => {
                    this.dataSource =  res.data
                })
            },

            redirect2DataSourceTable() {
                this.$router.push("/data_source_table")
            }
        },
        computed: {
            isEdit: function () {
                return undefined !== this.$route.query.id
            }
        },
        created() {
            let dataSourceId = this.$route.query.id
            if (undefined !== dataSourceId) {
                this.getDataSourceInfo(dataSourceId)
            }
            this.getDataSourceTypes()
        }
    }
</script>