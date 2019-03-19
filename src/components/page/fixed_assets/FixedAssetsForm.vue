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
                <el-form ref="fixedAssets" :rules="rules" :model="fixedAssets" label-width="7%">
                    <el-form-item label="名称" prop="name">
                        <el-input v-model="fixedAssets.name"></el-input>
                    </el-form-item>
                    <el-form-item label="描述" prop="description">
                        <el-input type="textarea" rows="5" v-model="fixedAssets.description"></el-input>
                    </el-form-item>
                    <el-form-item label="破损率" prop="broken">
                        <el-input v-model.number="fixedAssets.broken"></el-input>
                    </el-form-item>
                    <el-form-item label="破损时间" prop="brokenTime">
                        <el-date-picker type="date" placeholder="选择日期" v-model="fixedAssets.brokenTime" style="width: 100%;"></el-date-picker>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="addFixedAssets('fixedAssets')">表单提交</el-button>
                        <el-button>取消</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-col>

    </el-col>
</template>

<script>
    export default {
        name: 'DeveloperForm',
        data: function(){
            return {
                fixedAssets: {
                    id : 0,
                    name : '',
                    description : '',
                    broken : 0,
                    brokenTime: ''
                },

                rules: {
                    name: [
                        { required: true, message: '请输入固定资产名称', trigger: 'blur' }
                    ],
                    description: [
                        { required: true, message: '请输入固定资产描述', trigger: 'blur' }
                    ],
                    broken: [
                        { required: true, message: '请输入固定资产破损率'},
                        { type: 'number', message: '固定资产破损率必须为数字值'}
                    ],
                    brokenTime : [
                        { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
                    ]
                }
            }
        },
        methods: {
            addFixedAssets(fixedAssets) {
                this.$refs[fixedAssets].validate((valid) => {
                    if (valid) {
                        this.$api.FINANCE_FIXED_ASSETS_API.post('ADD_FIXED_ASSETS', this.fixedAssets).then(res => {
                            this.$message.success("成功添加固定资产")
                            this.$router.replace('/fixed_assets_table')
                        })
                    } else {
                        this.$message.error("请将固定资产信息填写完整")
                        return false;
                    }
                })
            }
        },
        created() {
        }
    }
</script>