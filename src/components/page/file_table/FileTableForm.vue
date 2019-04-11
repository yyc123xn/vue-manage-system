<template>
    <el-col>
        <el-col class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-sort"></i> 文件转表</el-breadcrumb-item>
                <el-breadcrumb-item>表单</el-breadcrumb-item>
            </el-breadcrumb>
        </el-col>
        <el-col class="container">
            <el-col class="form-box">
                <el-form :model="fileTable" :rules="rules" ref="fileTable" label-width="8%">
                    <el-form-item label="表名前缀" prop="tableNameHelper">
                        <el-input v-model="fileTable.tableNameHelper" @change="changeTableNameHelper"></el-input>
                    </el-form-item>
                    <el-form-item label="表名全称">
                        {{fileTable.tableName}}
                    </el-form-item>
                    <el-form-item label="目标数据库" prop="database">
                        <el-select v-model="fileTable.database" placeholder="请选择">
                            <template v-for="(database, index) in fileTableConstant.databases">
                                <el-option :key="index" :label="database.database" :value="database.database">
                                </el-option>
                            </template>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="表字段">
                        <el-table :data="fileTable.fileTableFields">
                            <el-table-column type="expand">
                                <template slot-scope="props">
                                    <el-form label-position="right" inline class="demo-table-expand">
                                        <el-form-item label="字段名称">
                                            <el-input v-model="props.row.fieldName"></el-input>
                                        </el-form-item>
                                        <el-form-item label="字段类型">
                                            <el-select v-model="props.row.dataType" placeholder="请选择">
                                                <template v-for="(dataType, index) in fileTableConstant.dataTypes">
                                                    <el-option :key="index" :label="dataType.nameEn" :value="dataType.nameEn">
                                                    </el-option>
                                                </template>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="字段注释">
                                            <el-input v-model="props.row.fieldComment"></el-input>
                                        </el-form-item>
                                    </el-form>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    label="字段名称"
                                    prop="fieldName">
                            </el-table-column>
                            <el-table-column
                                    label="字段类型"
                                    prop="dataType">
                            </el-table-column>
                            <el-table-column
                                    label="字段注释"
                                    prop="fieldComment">
                            </el-table-column>
                            <el-table-column label="操作">
                                <template slot-scope="scope">
                                    <el-button
                                            size="mini"
                                            type="danger"
                                            @click="removeFileTableField(scope.$index)">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-form-item>
                    <el-form-item>
                        <el-button @click="addFileTableField" type="primary">新增表字段</el-button>
                    </el-form-item>
                    <el-form-item label="源文件">
                        <el-upload
                                class="upload-demo"
                                drag
                                action="/report/file_table/file_upload"
                                accept=".txt,.csv"
                                :before-upload="beforeUploadFile"
                                :on-change="fileChange"
                                :on-success="handleSuccess"
                                :on-error="handleError">
                            <i class="el-icon-upload"></i>
                            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                            <div class="el-upload__tip" slot="tip">只能上传csv/txt文件</div>
                        </el-upload>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="addFileTable('fileTable')">表单提交</el-button>
                        <el-button @click="redirect2FileTableTable">取消</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-col>

    </el-col>
</template>

<script>
    import multiCascader from "multi-cascader"
    import ElButton from "../../../../node_modules/element-ui/packages/button/src/button.vue";
    import ElFormItem from "../../../../node_modules/element-ui/packages/form/src/form-item.vue";
    import axios from 'axios' //引用axios
    export default {
        name: 'FileTableForm',
        components: {
            ElFormItem,
            ElButton,
            multiCascader},
        data: function(){
            return {
                rules: {
                    tableNameHelper: [
                        {required: true, message: '请输入目标表名称', trigger: 'blur'},
                        { validator : this.$validator.enText, trigger: 'blur'}
                    ],
                    database: [
                        {required: true, message: '请选择目标数据库', trigger: 'blur'}
                    ]
                },
                fileTable: {
                    tableNameHelper: '',
                    tableName: '',
                    database: '',
                    fileTableFields: [
                        {
                            fieldName: 'field_name1',
                            dataType: '',
                            fieldComment: "field_comment1"
                        }
                    ]
                },

                file: '',

                fileTableConstant: {
                    databases: [],
                    dataTypes: []
                },
            }
        },
        methods: {

            changeTableNameHelper() {
                this.fileTable.tableName = this.fileTable.tableNameHelper + "_" + new Date().getTime()
            },

            // 文件上传成功时的钩子
            handleSuccess(res, file) {
                this.$notify.success({
                    title: '成功',
                    message: `文件上传成功`
                });
            },
            // 文件上传失败时的钩子
            handleError(err, file) {
                this.$notify.error({
                    title: '错误',
                    message: `文件上传失败`
                });
            },

            // 文件状态改变时的钩子
            fileChange(file) {
                this.file = file.raw
            },

            beforeUploadFile(file) {
                let size = file.size / 1024 / 1024
                if(size > 1) {
                    this.$notify.warning({
                        title: '警告',
                        message: `文件大小不得超过1M`
                    });
                }
            },

            getDatabases() {
                this.$api.REPORT_DATA_SOURCE_API.get("GET_DATABASES").then(res => {
                    this.fileTableConstant.databases = res.data
                })
            },

            getDataTypes() {
                this.$api.REPORT_DATA_SET_API.get('GET_DATA_TYPES').then(res => {
                    this.fileTableConstant.dataTypes = res.data
                })
            },

            addFileTable(fileTable) {
                this.$refs[fileTable].validate((valid) => {
                    if (valid) {
                        let fileTable = this.$route.query.id
                        let formData = new FormData()
                        formData.append('file', this.file)
                        formData.append("fileTable", JSON.stringify(this.fileTable))
                        if (undefined !== fileTable) {
                            // 编辑
                            let axios = this.getFormDataAxios();
                            axios.put("/report/file_table", formData).then(res => {
                                console.log(res.data)
                            }).catch(error => {
                                this.$message.error ("提交失败", error)
                            })
                        } else {
                            // 添加
                            let axios = this.getFormDataAxios();
                            axios.post("/report/file_table", formData).then(res => {
                                console.log(res.data)
                            }).catch(error => {
                                this.$message.error ("提交失败", error)
                            })
                        }
                        this.$router.push('/file_table_table')
                    } else {
                        this.$message.error("请将文件到表的映射信息填写完整")
                        return false;
                    }
                })
            },

            getFormDataAxios() {
                const service = axios.create({ // 创建服务
                    timeout: 5000 // 请求延时
                })
                service.defaults.withCredentials = true
                service.defaults.headers = {
                    'Content-Type': 'multipart/form-data'
                }
                return service
            },

            removeFileTableField(index) {
                if (this.fileTable.fileTableFields.length > 1) {
                    this.fileTable.fileTableFields.splice(index, 1)
                } else {
                    this.$message.error("表至少有一个字段")
                }
            },

            addFileTableField() {
                this.fileTable.fileTableFields.push({
                    fieldName: 'field_name' + (this.fileTable.fileTableFields.length + 1),
                    dataType: '',
                    fieldComment: "field_comment" + (this.fileTable.fileTableFields.length + 1),
                    key: Date.now()
                })
            },

            // 获取数菜单详情
            getFileTableInfo(FileTableId) {
                let getParams = {
                    id : FileTableId
                }
                this.$api.REPORT_FILE_TABLE_API.get('GET_FILE_TABLE_INFO', getParams).then(res => {
                    this.fileTable = res.data
                })
            },

            redirect2FileTableTable() {
                this.$router.push("/file_table_table")
            }
        },
        created() {
            let fileTableId = this.$route.query.id
            if (undefined !== fileTableId) {
                this.getFileTableInfo(fileTableId)
            }
            this.getDatabases()
            this.getDataTypes()
        }
    }
</script>

<style>
    .demo-table-expand {
    }
    .demo-table-expand label {
        width: 90px;
        color: #99a9bf;
    }
    .demo-table-expand .el-form-item {
        margin-right: 0;
        width: 50%;
    }
</style>