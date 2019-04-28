<template>
    <el-col>
        <el-col class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-punch"></i> 公司票据</el-breadcrumb-item>
                <el-breadcrumb-item v-if="isEdit">编辑票据</el-breadcrumb-item>
                <el-breadcrumb-item v-if="!isEdit">新增票据</el-breadcrumb-item>
            </el-breadcrumb>
        </el-col>
        <el-col class="container">
            <el-col class="form-box">
                <el-form ref="voucher" :rules="rules" :model="voucher" label-width="7%">
                    <el-form-item label="名称" prop="name">
                        <el-input v-model="voucher.name"></el-input>
                    </el-form-item>
                    <el-form-item label="描述" prop="description">
                        <el-input type="textarea" rows="5" v-model="voucher.description"></el-input>
                    </el-form-item>
                    <el-form-item label="票据时间" prop="date">
                        <el-date-picker
                                v-model="voucher.date"
                                type="datetime"
                                placeholder="选择日期时间"
                                align="right"
                                :picker-options="pickerOptions">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="票据类型" prop="type">
                        <el-select v-model="voucher.type" placeholder="请选择">
                            <template v-for="(type, index) in voucherConstant.types">
                                <el-option :key="type.nameEn" :label="type.nameCn" :value="type.nameEn">
                                    <span style="float: left">{{ type.nameCn }}</span>
                                    <span style="margin-left: 20px;float: right; color: #8492a6; font-size: 13px">{{ type.nameEn }}</span>
                                </el-option>
                            </template>
                        </el-select>
                    </el-form-item>
                    <el-form-item v-if="needClient" label="客户" prop="client">
                        <el-select
                                v-model="voucher.client"
                                filterable
                                remote
                                reserve-keyword
                                placeholder="请输入关键词"
                                :remote-method="queryClients"
                                :loading="loading">
                            <el-option v-for="client in voucherConstant.clients"
                                       :key="client.nameEn" :label="client.nameCn"
                                       :value="client.nameEn">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="票据详情">
                        <el-table
                                :data="voucher.voucherDetails"
                                style="width: 100%">
                            <el-table-column type="expand">
                                <template slot-scope="props">
                                    <el-form label-position="left" class="demo-table-expand">
                                        <el-form-item label="名称">
                                            <el-input v-model="props.row.name"></el-input>
                                        </el-form-item>
                                        <el-form-item label="描述" style="width: 100%" >
                                            <el-input type="textarea" rows="5" v-model="props.row.description"></el-input>
                                        </el-form-item>
                                        <el-form-item label="合计">
                                            <el-input-number v-model="props.row.sum" :precision="2" :step="0.1"></el-input-number>
                                        </el-form-item>
                                    </el-form>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    label="名称"
                                    prop="name">
                            </el-table-column>
                            <el-table-column
                                    label="描述"
                                    prop="description">
                            </el-table-column>
                            <el-table-column
                                    label="合计"
                                    prop="sum">
                            </el-table-column>
                            <el-table-column label="操作">
                                <template slot-scope="scope">
                                    <el-button
                                            size="mini"
                                            type="danger"
                                            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="addVoucherDetail">添加票据详情</el-button>
                    </el-form-item>
                    <el-form-item label="票据图片">
                        <el-upload
                                class="upload-demo"
                                action="/finance/voucher/file_upload"
                                accept=".jpg,.png"
                                :before-upload="beforeUploadFile"
                                :on-change="handleChange"
                                :fileList="voucher.imgs"
                                :on-success="handleSuccess"
                                :on-error="handleError"
                                list-type="picture">
                            <el-button size="small" type="primary">点击上传</el-button>
                            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过1MB</div>
                        </el-upload>
                    </el-form-item>
                    <el-form-item label="票据状态" prop="status">
                        <el-select v-model="voucher.status" placeholder="请选择">
                            <template v-for="(status, index) in voucherConstant.statuses">
                                <el-option :key="status.nameEn" :label="status.nameCn" :value="status.nameEn">
                                    <span style="float: left">{{ status.nameCn }}</span>
                                    <span style="float: right; color: #8492a6; font-size: 13px">{{ status.nameEn }}</span>
                                </el-option>
                            </template>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="所属部门">
                        <el-cascader
                                v-model="voucherHelper.departmentId"
                                placeholder="请选择"
                                :options="voucherConstant.departments"
                                filterable
                        ></el-cascader>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="addVoucher('voucher')">表单提交</el-button>
                        <el-button @click="redirect2VoucherTable">取消</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-col>

    </el-col>
</template>

<script>
    import ElCol from "element-ui/packages/col/src/col";
    import ElFormItem from "../../../../node_modules/element-ui/packages/form/src/form-item.vue";
    import axios from 'axios' //引用axios
    export default {
        components: {
            ElFormItem,
            ElCol},
        name: 'DeveloperForm',
        data: function(){
            return {
                voucher: {
                    id : 0,
                    name : '',
                    description : '',
                    date: '',
                    status: '',
                    type: '',
                    voucherDetails: [{
                        id: 0,
                        name: '票据详情1',
                        description: '票据描述1',
                        sum: 0
                    }],
                    departmentId: 0,
                    imgs: [],
                    client: ""
                },

                voucherHelper: {
                    departmentId: [],
                    imgs: []
                },

                voucherConstant: {
                    types: [],
                    statuses: [],
                    departments: [],
                    clients: []
                },

                loading: false,

                rules: {
                    name: [
                        { required: true, message: '请输入票据名称', trigger: 'blur' }
                    ],
                    description: [
                        { required: true, message: '请输入票据描述', trigger: 'blur' }
                    ],
                    date : [
                        { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
                    ],
                    type: [
                        { required: true, message: '请选择票据类型', trigger: 'blur' }
                    ],
                    status: [
                        { required: true, message: '请选择票据状态', trigger: 'blur' }
                    ]
                },

                pickerOptions: {
                    shortcuts: [{
                        text: '今天',
                        onClick(picker) {
                            picker.$emit('pick', new Date());
                        }
                    }, {
                        text: '昨天',
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() - 3600 * 1000 * 24);
                            picker.$emit('pick', date);
                        }
                    }, {
                        text: '一周前',
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', date);
                        }
                    }]
                },
            }
        },
        methods: {

            queryClients(query) {
                if (query !== '') {
                    this.loading = true;
                    let getParams = {
                        name: query
                    }
                    this.$api.FINANCE_CLIENT_API.get("QUERY_CLIENTS", getParams).then(res => {
                        this.voucherConstant.clients = res.data
                        this.loading = false;
                    })
                    setTimeout(() => {
                        this.loading = false;
                    });
                } else {
                    this.voucherConstant.clients = []
                }
            },

            addVoucher(voucher) {
                this.$refs[voucher].validate((valid) => {
                    if (valid) {
                        let voucherId = this.$route.query.id
                        this.voucher.departmentId = this.voucherHelper.departmentId[this.voucherHelper.departmentId.length - 1]
                        let formData = new FormData()
                        this.voucherHelper.imgs.forEach(img => {
                            formData.append('img[]', img.raw)
                        })
                        formData.append("voucher", JSON.stringify(this.voucher))
                        if (undefined === voucherId) {
                            // 添加
                            let axios = this.getFormDataAxios();
                            axios.post("/finance/voucher", formData).then(res => {
                                this.$message.success("成功添加票据")
                            }).catch(error => {
                                this.$message.error ("提交失败", error)
                            })
                        } else {
                            // 编辑
                            let axios = this.getFormDataAxios();
                            axios.post("/finance/voucher", formData).then(res => {
                                this.$message.success("成功编辑票据")
                            }).catch(error => {
                                this.$message.error ("编辑失败", error)
                            })
                        }
                        this.$router.replace('/voucher_table')
                    } else {
                        this.$message.error("请将票据信息填写完整")
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

            handleChange(file, fileList) {
                this.voucherHelper.imgs = fileList
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

            getVoucherTypes() {
                this.$api.FINANCE_VOUCHER_API.get('GET_VOUCHER_TYPES').then(res => {
                    this.voucherConstant.types = res.data
                })
            },

            getVoucherStatuses() {
                this.$api.FINANCE_VOUCHER_API.get('GET_VOUCHER_STATUSES').then(res => {
                    this.voucherConstant.statuses = res.data
                })
            },

            handleDelete(index, row) {
                if (this.voucher.voucherDetails.length > 1) {
                    this.voucher.voucherDetails.splice(index, 1)
                } else {
                    this.$message.error("请至少填写一条票据详情记录")
                }
            },

            addVoucherDetail() {
                this.voucher.voucherDetails.push({
                    id: 0,
                    name: '票据详情' + (this.voucher.voucherDetails.length + 1),
                    description: '票据描述' + (this.voucher.voucherDetails.length + 1),
                    sum: 0
                })
            },

            getDepartments() {
                this.$api.FINANCE_DEPARTMENT_API.get("GET_DEPARTMENTS").then(res => {
                    this.voucherConstant.departments = this.getTreeData(res.data)
                    this.voucherHelper.departmentId = this.getVoucherHelperDepartmentId(
                        this.voucherConstant.departments, this.voucher.departmentId)
                })
            },

            getVoucherHelperDepartmentId(departments, departmentId) {
                let res = []
                departments.forEach(department => {
                    if (department.value === departmentId) {
                        res.push(department.value)
                    } else {
                        if (undefined !== department.children && department.children.length > 0) {
                            let inners = this.getVoucherHelperDepartmentId(department.children, departmentId)
                            if (0 !== inners.length) {
                                res.push(department.value)
                                inners.forEach(inner => {
                                    res.push(inner)
                                })
                            }
                        }
                    }
                })
                return res
            },

            getTreeData(data){
                // 循环遍历json数据
                for(var i = 0;i < data.length; i++){
                    if(data[i].children.length < 1){
                        // children若为空数组，则将children设为undefined
                        data[i].children = undefined;
                    } else {
                        // children若不为空数组，则继续 递归调用 本方法
                        this.getTreeData(data[i].children);
                    }
                }
                return data;
            },

            getVoucherInfo(voucherId) {
                let getParams = {
                    id : voucherId
                }
                this.$api.FINANCE_VOUCHER_API.get("GET_VOUCHER_INFO", getParams).then(res => {
                    this.voucher = res.data
                    this.voucher.date = new Date(this.voucher.date)
                    this.getDepartments()
                })
            },

            redirect2VoucherTable() {
                this.$router.push("/voucher_table")
            }
        },
        computed: {
            isEdit: function () {
                return undefined !== this.$route.query.id
            },
            needClient: function () {
                let needClient = false;
                this.voucherConstant.types.forEach(type => {
                    if (type.nameEn === this.voucher.type && type.needClient) {
                        needClient = type.needClient
                    }
                })
                return needClient
            }
        },
        created() {
            let voucherId = this.$route.query.id
            if (undefined !== voucherId) {
                this.getVoucherInfo(voucherId)
            } else {
                this.getDepartments()
            }
            this.getVoucherTypes()
            this.getVoucherStatuses()
        }
    }
</script>

<style>
    .demo-table-expand label {
        width: 90px;
        color: #99a9bf;
    }
    .demo-table-expand {
        width: 100%;
    }
</style>