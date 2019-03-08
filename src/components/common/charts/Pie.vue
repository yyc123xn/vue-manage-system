<template>
    <ve-pie :data="chartData" :settings="chartSettings"></ve-pie>
</template>

<script>
    export default {
        name: "Pie",
        data () {
            this.chartSettings = {
                dimension: '日期',
                metrics: '访问用户',
                width: '50%'
            }
            return {
                chartData: {
                    columns: ['日期', '访问用户'],
                    rows: [
                        { '日期': '1/1', '访问用户': 1393 },
                        { '日期': '1/2', '访问用户': 3530 },
                        { '日期': '1/3', '访问用户': 2923 },
                        { '日期': '1/4', '访问用户': 1723 },
                        { '日期': '1/5', '访问用户': 3792 },
                        { '日期': '1/6', '访问用户': 4593 }
                    ]
                }
            }
        }
    }
</script>

<style scoped>
    .schart-box{
        display: inline-block;
        margin: 20px;
    }
    .pie{
        width: 50%;
    }
</style>