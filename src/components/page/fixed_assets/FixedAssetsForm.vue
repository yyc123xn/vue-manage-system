<template>
    <el-col>
        <el-col class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-apps"></i> 公司固定资产</el-breadcrumb-item>
                <el-breadcrumb-item v-if="isEdit">编辑固定资产</el-breadcrumb-item>
                <el-breadcrumb-item v-if="!isEdit">新增固定资产</el-breadcrumb-item>
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
                    <el-form-item label="购入时间" prop="purchaseTime">
                        <el-date-picker
                                v-model="fixedAssets.purchaseTime"
                                type="datetime"
                                placeholder="选择日期时间"
                                align="right"
                                :picker-options="pickerOptions">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="addFixedAssets('fixedAssets')">提交</el-button>
                        <el-button @click="redirect2FixedAssetsTable">取消</el-button>
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
                    purchaseTime: ''
                },

                rules: {
                    name: [
                        { required: true, message: '请输入固定资产名称', trigger: 'blur' }
                    ],
                    description: [
                        { required: true, message: '请输入固定资产描述', trigger: 'blur' }
                    ],
                    purchaseTime : [
                        { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
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
            addFixedAssets(fixedAssets) {
                this.$refs[fixedAssets].validate((valid) => {
                    if (valid) {
                        let fixedAssetsId = this.$route.query.id
                        if (undefined !== fixedAssetsId) {
                            // 编辑
                            this.$api.FINANCE_FIXED_ASSETS_API.put('EDIT_FIXED_ASSETS', this.fixedAssets).then(res => {
                                this.$message.success("成功添加固定资产")
                            })
                        } else {
                            // 添加
                            this.$api.FINANCE_FIXED_ASSETS_API.post('ADD_FIXED_ASSETS', this.fixedAssets).then(res => {
                                this.$message.success("成功编辑固定资产")
                            })
                        }
                        this.$router.replace('/fixed_assets_table')
                    } else {
                        this.$message.error("请将固定资产信息填写完整")
                        return false;
                    }
                })
            },

            getFixedAssetsInfo(fixedAssetsId) {
                let getParams = {
                    id : fixedAssetsId
                }
                this.$api.FINANCE_FIXED_ASSETS_API.get("GET_FIXED_ASSETS_INFO", getParams).then(res => {
                    this.fixedAssets = res.data
                    this.fixedAssets.brokenTime = new Date(this.fixedAssets.brokenTime)
                })
            },

            redirect2FixedAssetsTable() {
                this.$router.push("/fixed_assets_table")
            }
        },
        computed: {
            isEdit: function () {
                return undefined !== this.$route.query.id
            }
        },
        created() {
            let fixedAssetsId = this.$route.query.id
            if (undefined !== fixedAssetsId) {
                this.getFixedAssetsInfo(fixedAssetsId)
            }
        }
    }
</script>