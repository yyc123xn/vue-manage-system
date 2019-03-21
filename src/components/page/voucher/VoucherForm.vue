<template>
    <el-col>
        <el-col class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-punch"></i> 公司票据</el-breadcrumb-item>
                <el-breadcrumb-item>票据表单</el-breadcrumb-item>
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
                                    <span style="float: right; color: #8492a6; font-size: 13px">{{ type.nameEn }}</span>
                                </el-option>
                            </template>
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
                    <el-form-item>
                        <el-button type="primary" @click="addVoucher('voucher')">表单提交</el-button>
                        <el-button>取消</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-col>

    </el-col>
</template>

<script>
    import ElCol from "element-ui/packages/col/src/col";

    export default {
        components: {ElCol},
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
                    }]
                },

                voucherConstant: {
                    types: [],
                    statuses: []
                },

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
            addVoucher(voucher) {
                this.$refs[voucher].validate((valid) => {
                    if (valid) {
                        this.$api.FINANCE_VOUCHER_API.post('ADD_VOUCHER', this.fixedAssets).then(res => {
                            this.$message.success("成功添加票据")
                            this.$router.replace('/voucher_table')
                        })
                    } else {
                        this.$message.error("请将票据信息填写完整")
                        return false;
                    }
                })
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
            }
        },
        created() {
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