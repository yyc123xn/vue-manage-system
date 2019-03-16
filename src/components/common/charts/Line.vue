<template>
    <ve-line
            :data="chartData"
            :toolbox="toolbox">
    </ve-line>
</template>

<script>
    // 使用前需先引入对应模块
    import 'echarts/lib/component/toolbox'
    export default {
        name: 'Line',
        props: {id : Number, chartData: Object},
        data () {
            this.toolbox = {
                feature: {
                    saveAsImage: {}
                }
            }
            return {
                chartData: {
                    columns: ['日期', '成本', '利润'],
                    rows: [
                        { '日期': '1月1日', '成本': 15, '利润': 12 },
                        { '日期': '1月2日', '成本': 12, '利润': 25 },
                        { '日期': '1月3日', '成本': 21, '利润': 10 },
                        { '日期': '1月4日', '成本': 41, '利润': 32 },
                        { '日期': '1月5日', '成本': 31, '利润': 30 },
                        { '日期': '1月6日', '成本': 71, '利润': 55 }
                    ]
                }
            }
        },

        methods: {
            async getReportData(reportId) {
                let reportData
                let getParams = {
                    id : reportId
                }
                await this.$api.REPORT_REPORT_API.get('GET_REPORT_DATA', getParams).then(res => {
                    reportData = res.data
                })
                return reportData
            }
        },

        mounted() {
            let _this = this;
            let reportId =_this._props.id;
            this.getReportData(reportId).then(res => {
                _this.chartData = {
                    rows: res,
                    columns: ['create_time', 'status'],
                }
            })
        }
    }
</script>