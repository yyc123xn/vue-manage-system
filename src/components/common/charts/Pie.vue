<template>
    <div>
        <ve-pie
                :data="chartData"
                :loading="loading"
                :data-empty="dataEmpty"
                :settings="chartSettings"
                :toolbox="toolbox">
        </ve-pie>
    </div>
</template>
<script>
    // 使用前需先引入对应模块
    import 'echarts/lib/component/toolbox'
    import 'v-charts/lib/style.css'
    export default {
        name: 'Pie',
        props: {id : Number, queryColumn: Array, queryCondition: Array},
        data () {
            this.toolbox = {
                feature: {
                    saveAsImage: {}
                }
            }
            this.chartSettings = {
            }
            return {
                chartData: {},
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
            },

            updateReportData(reportId) {
                this.getReportData(reportId).then(res => {
                    this.loading = true;
                    if (0 === res.length) {
                        this.dataEmpty = true;
                    }
                    this.chartData = {
                        rows: res,
                        columns: ['base_wages', 'base_wages']
                    }
                    this.chartSettings = {
                        roseType: 'radius'
                    }
                    this.loading = false;
                })
            }
        },

        watch: {
            queryCondition: {
                handler (newV, oldV) {
                    // do something, 可使用this
                    this.updateReportData(this.id)
                },
                deep:true
            }
        },

        mounted() {
            let _this = this;
            let reportId =_this._props.id;
            this.updateReportData(reportId)
        }
    }
</script>