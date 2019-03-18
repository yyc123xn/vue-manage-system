<template>
    <ve-line
            :data="chartData"
            :settings="config.chartSettings"
            :toolbox="toolbox"
            :loading="loading"
            :data-empty="dataEmpty"
            :data-zoom="dataZoom">
    </ve-line>
</template>

<script>
    // 使用前需先引入对应模块
    import 'echarts/lib/component/toolbox'
    import 'v-charts/lib/style.css'
    import 'echarts/lib/component/dataZoom'
    export default {
        name: 'LineDup',
        props: {id : Number, queryColumns: Array, queryConditions: Array, config: Object},
        data () {
            this.toolbox = {
                feature: {
                    saveAsImage: {}
                }
            }
            this.dataZoom = [
                {
                    type: 'slider'
                }
            ]
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
                    this.loading = true;
                    this.dataEmpty = 0 === res.rows.length;
                    this.chartData = res
                    this.loading = false;
                })
                setTimeout(() => {
                    this.dataEmpty = (this.chartData.rows === undefined || 0 === this.chartData.rows.length);
                    this.loading = false
                }, 5000)
            }
        },

        mounted() {
            let _this = this
            let reportId =_this._props.id
            this.updateReportData(reportId)
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
    }
</script>