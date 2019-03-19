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
                <el-form ref="voucher" :rules="rules" :model="voucher" label-width="7%">
                    <el-form-item label="名称" prop="name">
                        <el-input v-model="voucher.name"></el-input>
                    </el-form-item>
                    <el-form-item label="描述" prop="description">
                        <el-input type="textarea" rows="5" v-model="voucher.description"></el-input>
                    </el-form-item>
                    <el-form-item label="票据时间" prop="date">
                        <el-date-picker type="date" placeholder="选择日期" v-model="voucher.date" style="width: 100%;"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="票据类型" prop="type">
                        <el-select v-model="voucher.type" placeholder="请选择">
                            <template v-for="(type, index) in voucherConstant.types">
                                <el-option :key="type.nameEn" :label="type.nameCn" :value="type.nameEn"></el-option>
                            </template>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="票据状态" prop="status">
                        <el-select v-model="voucher.status" placeholder="请选择">
                            <template v-for="(status, index) in voucherConstant.statuses">
                                <el-option :key="status.nameEn" :label="status.nameCn" :value="status.nameEn"></el-option>
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
    import ElSwitch from "../../../../node_modules/element-ui/packages/switch/src/component.vue";

    export default {
        components: {ElSwitch},
        name: 'DeveloperForm',
        data: function(){
            return {
                voucher: {
                    id : 0,
                    name : '',
                    description : '',
                    date: '',
                    status: '',
                    type: ''
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
                }
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
            }
        },
        created() {
            this.getVoucherTypes()
            this.getVoucherStatuses()
        }
    }
</script>