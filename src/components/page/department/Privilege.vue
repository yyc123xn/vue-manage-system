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
                <el-transfer
                        filterable
                        :filter-method="getDeveloper"
                        filter-placeholder="请输入城市拼音"
                        :data="developers">
                </el-transfer>
            </el-col>
        </el-col>

    </el-col>
</template>

<script>
    export default {
        data() {
            const generateData2 = _ => {
                const data = [];
                const cities = ['上海', '北京', '广州', '深圳', '南京', '西安', '成都'];
                const pinyin = ['shanghai', 'beijing', 'guangzhou', 'shenzhen', 'nanjing', 'xian', 'chengdu'];
                cities.forEach((city, index) => {
                    data.push({
                        label: city,
                        key: index,
                        pinyin: pinyin[index]
                    });
                });
                return data;
            };
            return {
                developers: generateData2(),
                getDeveloper(query) {
                    if (query !== '') {
                        this.loading = true;
                        let getParams = {
                            name: query
                        }
                        this.$api.FINANCE_DEVELOPER_API.get("QUERY_DEVELOPERS", getParams).then(res => {
                            this.developers = res.data
                        })
                        setTimeout(() => {
                            this.loading = false;
                        }, 1000);
                    } else {
                        this.developers = [];
                    }
                    return true;
                },
                value2: [],
                filterMethod(query, item) {
                    getDeveloper(query)
                    return true;
                },
            };
        },

        methods: {
        }
    };
</script>

<style>

</style>