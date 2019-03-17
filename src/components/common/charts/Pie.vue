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
        props: {id : Number, queryColumns: Array, queryConditions: Array},
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
                let postParams = {
                    id : reportId
                }
                if (this.queryColumns !== undefined && 0 < this.queryColumns.length) {
                    postParams.queryColumns = this.queryColumns
                    postParams.queryConditions = this.queryConditions
                }
                await this.$api.REPORT_REPORT_API.post('GET_REPORT_DATA', postParams).then(res => {
                    reportData = res.data
                })
                return reportData
            },

            updateReportData(reportId) {
                this.getReportData(reportId).then(res => {
                    console.log(res)
                    this.loading = true;
                    this.dataEmpty = 0 === res.rows.length;
                    this.chartData = {
                        rows: res.rows,
                        columns: res.columns
                    }
                    this.chartSettings = {
                        roseType: 'radius'
                    }
                    this.loading = false;
                })
            }
        },

        watch: {
            queryConditions: {
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