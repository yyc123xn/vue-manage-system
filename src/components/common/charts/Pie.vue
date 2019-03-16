<template>
    <div>
        <ve-pie
                :data="chartData"
                :loading="loading"
                :data-empty="dataEmpty"
                :settings="chartSettings"
                :toolbox="toolbox"
        >
        </ve-pie>
    </div>
</template>
<script>
    // 使用前需先引入对应模块
    import 'echarts/lib/component/toolbox'
    export default {
        name: 'Pie',
        props: {id : Number, chartData: Object},
        data () {
            this.toolbox = {
                feature: {
                    saveAsImage: {}
                }
            }
            return {
                loading: true,
                dataEmpty: false
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
                    columns: ['base_wages', 'base_wages']
                }
                this.chartSettings = {
                    roseType: 'radius'
                }
            })
        }
    }
</script>