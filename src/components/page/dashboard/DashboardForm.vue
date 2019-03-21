<template>
    <el-col>
        <el-col class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-rank"></i> 数据看板</el-breadcrumb-item>
                <el-breadcrumb-item>看板表单</el-breadcrumb-item>
            </el-breadcrumb>
        </el-col>

        <el-col class="container">

            <el-steps :active="pageIndex - 1" finish-status="success" simple>
                <el-step title="看板基本信息" ></el-step>
                <el-step title="看板报表" ></el-step>
                <el-step title="看板过滤器" ></el-step>
                <el-step title="看板预览" ></el-step>
            </el-steps>

            <!--看板基本信息-->
            <el-col class="form-box" v-if="1 === pageIndex">
                <el-col  style="margin-top: 25px; text-align: center; margin-bottom: 25px; font-weight : 700" >数据看板基本信息</el-col>
                <el-form ref="dashboard" :rules="rules" :model="dashboard" label-width="9%">
                    <el-form-item label="数据看板名" prop="name">
                        <el-input v-model="dashboard.name"></el-input>
                    </el-form-item>
                    <el-form-item label="数据看板描述" prop="description">
                        <el-input type="textarea" rows="5" v-model="dashboard.description"></el-input>
                    </el-form-item>
                    <el-form-item label="权限" prop="privilege">
                        <el-select v-model="dashboard.privilege" placeholder="请选择">
                            <template v-for="(privilege, index) in dashboardConstant.privileges">
                                <el-option :key="privilege.nameEn" :label="privilege.nameCn" :value="privilege.nameEn">
                                    <span style="float: left">{{ privilege.nameCn }}</span>
                                    <span style="float: right; color: #8492a6; font-size: 13px">{{ privilege.nameEn }}</span>
                                </el-option>
                            </template>
                        </el-select>
                    </el-form-item>
                </el-form>
            </el-col>

            <!--看板报表-->
            <el-col v-if="2 === pageIndex">
                <el-col  style="margin-top: 25px; text-align: center; margin-bottom: 25px; font-weight : 700;" >数据看板报表制作</el-col>
                <el-row  :gutter="30">
                    <el-col :span="24 / dashboard.reportss.length" v-for="(reports, reportXAxis) in dashboard.reportss" :key="reportXAxis">
                        <el-col class="drag-box-item">
                            <el-col class="item-title">第{{reportXAxis + 1}}列</el-col>
                            <draggable v-model="dashboard.reportss[reportXAxis]" @remove="removeHandle" :options="dragOptions">
                                <transition-group tag="div" :id="'第' + (reportXAxis + 1) + '列'" class="item-ul">
                                    <div v-for="(report, reportYAxis) in dashboard.reportss[reportXAxis]" class="drag-list" :key="reportXAxis + reportYAxis + ''">
                                        {{report.name}}
                                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(reportXAxis, reportYAxis)">编辑</el-button>
                                        <el-button type="text" icon="el-icon-delete" class="red" @click="deleteReportRow(reportXAxis, reportYAxis)">删除</el-button>
                                    </div>
                                </transition-group>
                            </draggable>
                            <el-col align="center">
                                <el-button type="primary" icon="el-icon-lx-add" @click="addReportRow(reportXAxis)" style="margin-bottom: 3%; margin-top: 3%">添加一行</el-button>
                            </el-col>
                        </el-col>
                    </el-col>
                </el-row>
                <el-col align="center">
                    <el-button type="primary" icon="el-icon-lx-add" @click="addReportColumn" style="margin-top: 2%">添加一列</el-button>
                    <el-button type="danger" icon="el-icon-lx-move" @click="deleteReportColumn" style="margin-top: 2%">删除一列</el-button>
                </el-col>
            </el-col>

            <!--编辑报表弹出框 -->
            <el-dialog title="编辑报表" :visible.sync="editVisible" width="70%">
                <el-form ref="handleEditForm" :rules="rules.reportRules" :model="handleEditForm" label-width="10%">
                    <el-form-item label="报表名称" prop="name">
                        <el-input v-model="handleEditForm.name"></el-input>
                    </el-form-item>
                    <el-form-item label="报表描述" prop="description">
                        <el-input type="textarea" rows="5" v-model="handleEditForm.description"></el-input>
                    </el-form-item>
                    <el-form-item label="数据集列表" prop="dataSetId">
                        <el-select v-model="handleEditForm.dataSetId" placeholder="请选择" filterable @change="getDataSetMetricsAndDimensions" @click="getDataSetMetricsAndDimensions">
                            <template v-for="(dataSet, index) in dashboardConstant.reportConstant.dataSets">
                                <el-option :key="dataSet.id" :label="dataSet.name" :value="dataSet.id"></el-option>
                            </template>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="数据集指标" prop="dataSetMetricFieldIds">
                        <el-select v-model="handleEditForm.dataSetMetricFieldIds" placeholder="请选择" filterable multiple>
                            <template v-for="(metric, index) in dashboardHelper.reportssHelper[handleEditForm.reportXAxis][handleEditForm.reportYAxis].metrics">
                                <el-option :key="metric.id" :label="metric.showName" :value="metric.id"></el-option>
                            </template>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="数据集维度" prop="dataSetDimensionFieldId">
                        <el-select v-model="handleEditForm.dataSetDimensionFieldId" placeholder="请选择" filterable>
                            <template v-for="(dimension, index) in dashboardHelper.reportssHelper[handleEditForm.reportXAxis][handleEditForm.reportYAxis].dimensions">
                                <el-option :key="dimension.id" :label="dimension.showName" :value="dimension.id"></el-option>
                            </template>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="报表类型" prop="chartType">
                        <el-select v-model="handleEditForm.chartType" placeholder="请选择">
                            <template v-for="(chartType, index) in dashboardConstant.reportConstant.chartTypes">
                                <el-option :key="chartType.nameEn" :label="chartType.nameCn" :value="chartType.nameEn">
                                    <span style="float: left">{{ chartType.nameCn }}</span>
                                    <span style="float: right; color: #8492a6; font-size: 13px; margin-left: 20px">{{ chartType.nameEn }}</span>
                                </el-option>
                            </template>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="报表属性配置">
                        <el-collapse>
                            <el-collapse-item :title="handleEditForm.chartType">
                                <el-col v-if="'UNRECOGNIZED' === handleEditForm.chartType">
                                    <div class="red">请选择其他报表类型</div>
                                </el-col>
                                <el-col v-if="'LINE' === handleEditForm.chartType">
                                    <el-form ref="handleEditForm.chartSettings" :rules="rules" :model="handleEditForm.chartSettings" label-width="20%">
                                        <el-form-item label="axisSite(设置右轴key)">
                                            <el-select v-model="handleEditForm.config.chartSettings.axisSite.right" placeholder="请选择" multiple filterable>
                                                <template v-for="(metric, index) in dashboardHelper.reportssHelper[handleEditForm.reportXAxis][handleEditForm.reportYAxis].metrics">
                                                    <el-option :key="metric.showName" :label="metric.showName" :value="metric.showName"></el-option>
                                                </template>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="yAxisType(双y轴坐标类型)">
                                            <el-col :span="1">
                                                左轴
                                            </el-col>
                                            <el-col :span="10">
                                                <el-select v-model="handleEditForm.config.chartSettings.yAxisType[0]" placeholder="请选择">
                                                    <el-option :key="'KMB'" :label="'KMB'" :value="'KMB'"></el-option>
                                                    <el-option :key="'MB'" :label="'MB'" :value="'MB'"></el-option>
                                                    <el-option :key="'percent'" :label="'percent'" :value="'percent'"></el-option>
                                                </el-select>
                                            </el-col>
                                            <el-col :span="1">
                                                右轴
                                            </el-col>
                                            <el-col :span="10">
                                                <el-select v-model="handleEditForm.config.chartSettings.yAxisType[1]" placeholder="请选择">
                                                    <el-option :key="'KMB'" :label="'KMB'" :value="'KMB'"></el-option>
                                                    <el-option :key="'MB'" :label="'MB'" :value="'MB'"></el-option>
                                                    <el-option :key="'percent'" :label="'percent'" :value="'percent'"></el-option>
                                                </el-select>
                                            </el-col>
                                        </el-form-item>
                                        <el-form-item label="yAxisName(双y轴名)">
                                            <el-col :span="1">
                                                左轴
                                            </el-col>
                                            <el-col :span="10">
                                                <el-input v-model="handleEditForm.config.chartSettings.yAxisName[0]"></el-input>
                                            </el-col>
                                            <el-col :span="1">
                                                右轴
                                            </el-col>
                                            <el-col :span="10">
                                                <el-input v-model="handleEditForm.config.chartSettings.yAxisName[1]"></el-input>
                                            </el-col>
                                        </el-form-item>
                                        <el-form-item label="xAxisType(x轴坐标类型)">
                                            <el-col :span="10">
                                                <el-select v-model="handleEditForm.config.chartSettings.xAxisType" placeholder="请选择">
                                                    <el-option :key="'value'" :label="'连续数值'" :value="'value'"></el-option>
                                                    <el-option :key="'time'" :label="'连续时间'" :value="'time'"></el-option>
                                                </el-select>
                                            </el-col>
                                        </el-form-item>
                                        <el-form-item label="多指标堆叠">
                                            <el-select v-model="handleEditForm.config.chartSettings.stack.key" placeholder="请选择" multiple @change="showStack(handleEditForm.config.chartSettings)">
                                                <template v-for="(metric, index) in dashboardHelper.reportssHelper[handleEditForm.reportXAxis][handleEditForm.reportYAxis].metrics">
                                                    <el-option :key="metric.showName" :label="metric.showName" :value="metric.showName"></el-option>
                                                </template>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="展示指标数值">
                                            <el-switch v-model="handleEditForm.config.extend.line.series.label.normal.show"></el-switch>
                                        </el-form-item>
                                    </el-form>

                                    <div>备注1. axisSite(设置右轴key)：例如输入‘占比’， 即将占比的数据置于右轴上。</div>
                                    <div>备注2. yAxisType(双y轴坐标类型)：y轴坐标类型，KMB单位为k(数据值为5000时，显示5k)，percent单位为%(数据为0.6时，显示60%)。</div>
                                    <div>备注3. yAxisName(双y轴名)：y轴坐标展示的单位。</div>
                                    <div>备注4. xAxisType(x轴坐标类型)：x轴坐标类型，可展示为连续的时间轴或数值轴。</div>
                                    <div>备注5. 多指标堆叠：展示数据时，对于选中的指标进行堆叠展示。</div>
                                    <div>备注6. 展示指标数值：对于每一个指标的数值是否需要展示出来。</div>
                                </el-col>
                                <el-col v-if="'HISTOGRAM' === handleEditForm.chartType">
                                    <el-form ref="handleEditForm.chartSettings" :rules="rules" :model="handleEditForm.chartSettings" label-width="20%">
                                        <el-form-item label="axisSite(设置右轴key)">
                                            <el-select v-model="handleEditForm.config.chartSettings.axisSite.right" placeholder="请选择" multiple filterable>
                                                <template v-for="(metric, index) in dashboardHelper.reportssHelper[handleEditForm.reportXAxis][handleEditForm.reportYAxis].metrics">
                                                    <el-option :key="metric.showName" :label="metric.showName" :value="metric.showName"></el-option>
                                                </template>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="yAxisType(双y轴坐标类型)">
                                            <el-col :span="1">
                                                左轴
                                            </el-col>
                                            <el-col :span="10">
                                                <el-select v-model="handleEditForm.config.chartSettings.yAxisType[0]" placeholder="请选择">
                                                    <el-option :key="'KMB'" :label="'KMB'" :value="'KMB'"></el-option>
                                                    <el-option :key="'MB'" :label="'MB'" :value="'MB'"></el-option>
                                                    <el-option :key="'percent'" :label="'percent'" :value="'percent'"></el-option>
                                                </el-select>
                                            </el-col>
                                            <el-col :span="1">
                                                右轴
                                            </el-col>
                                            <el-col :span="10">
                                                <el-select v-model="handleEditForm.config.chartSettings.yAxisType[1]" placeholder="请选择">
                                                    <el-option :key="'KMB'" :label="'KMB'" :value="'KMB'"></el-option>
                                                    <el-option :key="'MB'" :label="'MB'" :value="'MB'"></el-option>
                                                    <el-option :key="'percent'" :label="'percent'" :value="'percent'"></el-option>
                                                </el-select>
                                            </el-col>
                                        </el-form-item>
                                        <el-form-item label="yAxisName(双y轴名)">
                                            <el-col :span="1">
                                                左轴
                                            </el-col>
                                            <el-col :span="10">
                                                <el-input v-model="handleEditForm.config.chartSettings.yAxisName[0]"></el-input>
                                            </el-col>
                                            <el-col :span="1">
                                                右轴
                                            </el-col>
                                            <el-col :span="10">
                                                <el-input v-model="handleEditForm.config.chartSettings.yAxisName[1]"></el-input>
                                            </el-col>
                                        </el-form-item>
                                        <el-form-item label="xAxisType(x轴坐标类型)">
                                            <el-col :span="10">
                                                <el-select v-model="handleEditForm.config.chartSettings.xAxisType" placeholder="请选择">
                                                    <el-option :key="'value'" :label="'连续数值'" :value="'value'"></el-option>
                                                </el-select>
                                            </el-col>
                                        </el-form-item>
                                        <el-form-item label="堆叠柱状图">
                                            <el-select v-model="handleEditForm.config.chartSettings.stack.key" placeholder="请选择" multiple @change="showStack(handleEditForm.config.chartSettings)">
                                                <template v-for="(metric, index) in dashboardHelper.reportssHelper[handleEditForm.reportXAxis][handleEditForm.reportYAxis].metrics">
                                                    <el-option :key="metric.showName" :label="metric.showName" :value="metric.showName"></el-option>
                                                </template>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="指标展示为折线">
                                            <el-select v-model="handleEditForm.config.chartSettings.showLine" placeholder="请选择" multiple @change="showStack(handleEditForm.config.chartSettings)">
                                                <template v-for="(metric, index) in dashboardHelper.reportssHelper[handleEditForm.reportXAxis][handleEditForm.reportYAxis].metrics">
                                                    <el-option :key="metric.showName" :label="metric.showName" :value="metric.showName"></el-option>
                                                </template>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="展示指标数值">
                                            <el-switch v-model="handleEditForm.config.extend.histogram.series.label.show"></el-switch>
                                        </el-form-item>
                                    </el-form>
                                    <div>备注1. axisSite(设置右轴key)：例如输入‘占比’， 即将占比的数据置于右轴上。</div>
                                    <div>备注2. yAxisType(双y轴坐标类型)：y轴坐标类型，KMB单位为k(数据值为5000时，显示5k)，percent单位为%(数据为0.6时，显示60%)。</div>
                                    <div>备注3. yAxisName(双y轴名)：y轴坐标展示的单位。</div>
                                    <div>备注4. xAxisType(x轴坐标类型)：x轴坐标类型，可展示为连续的时间轴或数值轴。</div>
                                    <div>备注5. 堆叠柱状图展示：选择相应的指标展示为堆叠柱状图。</div>
                                    <div>备注6. 指标展示为折线：选择相应的指标展示为折线图。</div>
                                    <div>备注7. 展示指标数值：对于每一个指标的数值是否需要展示出来。</div>
                                </el-col>
                                <el-col v-if="'TABLE' === handleEditForm.chartType">
                                    <div>与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；</div>
                                    <div>在界面中一致：所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。</div>
                                </el-col>
                                <el-col v-if="'PIE' === handleEditForm.chartType">
                                    <el-form ref="handleEditForm.chartSettings" :rules="rules" :model="handleEditForm.chartSettings" label-width="20%">
                                        <el-form-item label="数据类型">
                                            <el-select v-model="handleEditForm.config.chartSettings.dataType" placeholder="请选择">
                                                <el-option :key="'KMB'" :label="'KMB'" :value="'KMB'"></el-option>
                                                <el-option :key="'MB'" :label="'MB'" :value="'MB'"></el-option>
                                                <el-option :key="'percent'" :label="'percent'" :value="'percent'"></el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="展示玫瑰图">
                                            <el-switch v-model="handleEditForm.config.chartSettings.roseTypeHelper" @change="changeRoseType(handleEditForm.config.chartSettings)"></el-switch>
                                        </el-form-item>
                                        <el-form-item label="选中模式">
                                            <el-switch v-model="handleEditForm.config.chartSettings.selectedMode"></el-switch>
                                        </el-form-item>
                                    </el-form>
                                    <div>备注1. 数据类型：展示指标的数据类型，KMB单位为k(数据值为5000时，显示5k)，percent单位为%(数据为0.6时，显示60%)。</div>
                                    <div>备注2. 展示玫瑰图：展示为南丁格尔玫瑰图。</div>
                                    <div>备注3. 选中模式：将选中的饼图块分离展示。</div>
                                </el-col>
                                <el-col v-if="'GUAGE' === handleEditForm.chartType">
                                    <el-form ref="handleEditForm.chartSettings" :rules="rules" :model="handleEditForm.chartSettings" label-width="20%">
                                        <el-form-item label="数据类型">
                                            <el-select v-model="handleEditForm.config.chartSettings.dataType" placeholder="请选择">
                                                <el-option :key="'KMB'" :label="'KMB'" :value="'KMB'"></el-option>
                                                <el-option :key="'MB'" :label="'MB'" :value="'MB'"></el-option>
                                                <el-option :key="'percent'" :label="'percent'" :value="'percent'"></el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-form>
                                    <div>备注1. 数据类型：展示指标的数据，KMB单位为k(数据值为5000时，显示5k)，percent单位为%(数据为0.6时，显示60%)。</div>
                                </el-col>
                            </el-collapse-item>
                        </el-collapse>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEditForm('handleEditForm')">确 定</el-button>
            </span>
            </el-dialog>

            <!--看板过滤器-->
            <el-col v-if="3 === pageIndex">
                <el-col style="margin-top: 25px; text-align: center; margin-bottom: 25px; font-weight : 700;" >数据看板过滤器设置</el-col>
                <el-form>
                    <el-form-item>
                        <el-table :data="dashboard.reportFilters">
                            <el-table-column type="expand">
                                <template slot-scope="props">
                                    <el-form label-position="right" inline class="demo-table-expand">
                                        <el-form-item label="名称">
                                            <el-input v-model="props.row.name"></el-input>
                                        </el-form-item>
                                        <el-form-item label="过滤器类型">
                                            <el-select v-model="props.row.filterType" placeholder="请选择">
                                                <template v-for="(filterType, index) in dashboardConstant.reportFilterConstant.filterTypes">
                                                    <el-option :key="filterType.nameEn" :label="filterType.nameCn" :value="filterType.nameEn">
                                                        <span style="float: left">{{ filterType.nameCn }}</span>
                                                        <span style="float: right; color: #8492a6; font-size: 13px; margin-left: 20px">{{ filterType.nameEn }}</span>
                                                    </el-option>
                                                </template>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="作用报表">
                                            <el-select v-model="props.row.reportKeys" placeholder="请选择" multiple filterable>
                                                <template v-for="(report, index) in dashboardHelper.reportFilterHelper" :value="filterType.nameEn">
                                                    <el-option :key="report.reportXAxis+ '|' + report.reportYAxis" :label="report.name" :value="report.reportXAxis+ '|' + report.reportYAxis"></el-option>
                                                </template>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="数据集字段">
                                            <el-cascader
                                                    placeholder="请选择"
                                                    :options="dashboardConstant.reportConstant.dataSetsFields"
                                                    v-model="dashboardHelper.reportFiltersHelper[props.$index].queryColumns"
                                                    filterable
                                                    @change="changeReportFilterQueryColumns(props.$index)"
                                            ></el-cascader>
                                        </el-form-item>
                                    </el-form>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    label="名称"
                                    prop="name">
                            </el-table-column>
                            <el-table-column
                                    label="过滤器类型"
                                    prop="filterType">
                            </el-table-column>
                            <el-table-column label="作用报表">
                                <template slot-scope="scope">
                                    <el-col v-for="(reportKey, index) in dashboard.reportFilters[scope.$index].reportKeys" :key="index">
                                        {{index + 1}}.{{dashboard.reportss[reportKey.split('|')[0]][reportKey.split('|')[1]].name}}
                                    </el-col>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    label="查询字段"
                                    prop="queryColumn">
                            </el-table-column>
                            <el-table-column label="操作">
                                <template slot-scope="scope">
                                    <el-button @click.prevent="removeReportFilter(scope.$index)" size="mini" type="danger">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-form-item>
                </el-form>
                <el-col align="center">
                    <el-button type="primary" icon="el-icon-lx-add" @click="addReportFilter" style="margin-top: 2%">添加过滤器</el-button>
                </el-col>
            </el-col>

            <!--看板预览-->
            <el-col v-if="4 === pageIndex" v-model="dashboard">
                <el-col style="margin-top: 25px; text-align: center; margin-bottom: 25px; font-weight : 700;" >数据看板预览</el-col>
                <el-col>
                    <el-collapse>
                        <el-collapse-item :title="dashboard.name" name="1">
                            <div>{{dashboard.name}}</div>
                        </el-collapse-item>
                        <el-collapse-item title="简介" name="2">
                            <div>{{dashboard.description}}</div>
                        </el-collapse-item>
                    </el-collapse>
                </el-col>
                <el-col style="margin-top: 30px; margin-bottom: 30px">过滤条件</el-col>
                <el-col style="margin-bottom: 30px">
                    <el-form :inline="true">
                        <el-form-item  v-for="(reportFilter, index) in dashboard.reportFilters" :key="reportFilter.id" >
                            {{reportFilter.name}}
                            <el-select
                                    v-if="'MULTI_SELECT_DROP_DOWN' === reportFilter.filterType"
                                    multiple filterable placeholder="请选择" style="margin-right: 55px">
                                <el-option
                                        v-for="(a, index) in reportFilter.values"
                                        :key="index"
                                        :label="a"
                                        :value="a">
                                </el-option>
                            </el-select>
                            <el-date-picker
                                    v-if="'DATE' === reportFilter.filterType"
                                    type="datetimerange"
                                    :picker-options="pickerOptions"
                                    range-separator="至"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期"
                                    align="right"
                                    value-format="yyyyMMddHH">
                            </el-date-picker>
                            <el-select
                                    v-if="'DROP_DOWN' === reportFilter.filterType" filterable
                                    placeholder="请选择" style="margin-right: 30px">
                                <el-option
                                        v-for="(value, index) in reportFilter.values"
                                        :key="index"
                                        :label="value"
                                        :value="value">
                                </el-option>
                            </el-select>

                        </el-form-item>
                    </el-form>
                </el-col>
                <el-col>

                    <el-col v-for="(reports, index1) in dashboardHelper.reportssSymmetryHelper" :key="index1">
                        <el-col :span="24 / dashboardHelper.reportssSymmetryHelper[index1].length" v-for="(report, index2) in dashboardHelper.reportssSymmetryHelper[index1]" :key="index2">
                            <el-card>
                                <div slot="header">
                                <span>
                                    <span>{{report.name}} (模拟数据)</span>
                                    <span v-for="(value, key) in chartTypeToolTips" style="float: right" :key="key">
                                        <el-tooltip v-if="report.chartType === key" placement="top">
                                            <div slot="content" v-html="value"></div>
                                            <el-button type="primary" icon="el-icon-search" circle plain></el-button>
                                        </el-tooltip>
                                    </span>
                                </span>
                                </div>
                                <div>
                                    <histogram :report="report" v-if="'HISTOGRAM' === report.chartType"></histogram>
                                    <line-dup :report="report" v-if="'LINE' === report.chartType"></line-dup>
                                    <pie :report="report" v-if="'PIE' === report.chartType"></pie>
                                    <!--<MonitorCard v-if="'MONITOR_CARD' === report.chartType"></MonitorCard>-->
                                    <guage :report="report" v-if="'GUAGE' === report.chartType"></guage>
                                </div>
                            </el-card>
                        </el-col>
                    </el-col>
                </el-col>
                <el-col align="center">
                    <el-button type="primary" icon="el-icon-lx-add" @click="addDashboard" style="margin-top: 2%">提交</el-button>
                </el-col>
            </el-col>

            <el-col align="center" style="margin-top: 30px">
                <el-button-group>
                    <el-button type="primary" icon="el-icon-arrow-left" @click="previousPage" v-if="2 === pageIndex || 3 === pageIndex || 4 === pageIndex">上一页</el-button>
                    <el-button type="primary" @click="nextPage" v-if="1 === pageIndex || 2 === pageIndex || 3 === pageIndex">下一页<i class="el-icon-arrow-right el-icon--right"></i></el-button>
                </el-button-group>
            </el-col>

        </el-col>

    </el-col>
</template>

<script>
    import draggable from 'vuedraggable'
    import Histogram from '../../common/charts/Histogram.vue'
    import LineDup from '../../common/charts/Line.vue'
    import Pie from '../../common/charts/Pie.vue'
    import MonitorCard from '../../common/charts/MonitorCard.vue'
    import Guage from '../../common/charts/Guage.vue'
    import 'echarts/lib/component/toolbox'
    import ElFormItem from "../../../../node_modules/element-ui/packages/form/src/form-item.vue";
    export default {
        name: 'DashboardForm',
        components : {
            ElFormItem,
            draggable,
            Histogram,
            LineDup,
            Pie,
            MonitorCard,
            Guage
        },
        data: function(){
            return {
                dashboardConstant: {
                    privileges: [],
                    reportFilterConstant: {
                        filterTypes: []
                    },
                    // 报表中需要的枚举值
                    reportConstant: {
                        dataSets: [],
                        chartTypes: [],
                        dataSetsFields: []
                    },
                },

                dashboardHelper: {

                    reportFiltersHelper: [
                        {
                            queryColumns: []
                        }
                    ],
                    // 用户选择的不同数据集的指标list
                    reportssHelper: [
                        [
                            {
                                metrics: [],
                                dimensions: []
                            }
                        ]
                    ],

                    reportssSymmetryHelper: [[]]
                },
                dashboard: {
                    id: 0,
                    name: '',
                    description: '',
                    privilege: '',
                    reportFilters: [],
                    reportss: [
                        [
                            {
                                id: 0,
                                name : "新报表",
                                description: "",
                                dataSetId: "",
                                dataSetMetricFieldIds: [],
                                dataSetDimensionFieldId: '',
                                chartType: '',
                                config: {
                                    chartSettings: {
                                        axisSite: { right: [] },
                                        yAxisType: [],
                                        yAxisName: [],
                                        xAxisType: '',
                                        stack: { 'key': [] },
                                        showLine: [],
                                        area: false,
                                        // 饼图
                                        roseTypeHelper: false,
                                        roseType: '',
                                        dataType: 'percent',
                                        selectedMode: false
                                    },
                                    extend: {
                                        // 折线图显示指标数据
                                        line: {
                                            series: {
                                                label: {
                                                    normal: {
                                                        show: false
                                                    }
                                                }
                                            }
                                        },

                                        // 柱状图显示指标数据
                                        histogram: {
                                            series: {
                                                label: {
                                                    show: false,
                                                    position: "top"
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        ]
                    ]
                },

                rules: {
                    name: [
                        {required: true, message: '请输入数据看板名', trigger: 'blur'}
                    ],
                    description: [
                        {required: true, message: '请输入数据看板描述', trigger: 'blur'}
                    ],
                    privilege: [
                        {required: true, message: '请选择员工权限', trigger: 'blur'},
                    ],
                    reportRules: {
                        name: [
                            {required: true, message: '请输入报表名', trigger: 'blur'}
                        ],
                        description: [
                            {required: true, message: '请输入报表描述', trigger: 'blur'}
                        ],
                        dataSetId: [
                            {required: true, message: '请选择数据集', trigger: 'change'}
                        ],
                        chartType: [
                            {required: true, message: '请选择报表类型', trigger: 'change'}
                        ],
                        dataSetMetricFieldIds: [
                            {required: true, message: '请选择数据集指标', trigger: 'change'}
                        ],
                        dataSetDimensionFieldId: [
                            {required: true, message: '请选择数据集维度', trigger: 'change'}
                        ],
                    },
                    reportFilterRules: {
                        name: [
                            {required: true, message: '请输入过滤器名', trigger: 'blur'}
                        ],
                        filterType: [
                            {required: true, message: '请选择过滤器类型', trigger: 'change'}
                        ],
                        reportKeys: [
                            {required: true, message: '请选择过滤器需要作用的报表', trigger: 'blur'}
                        ]
                    }
                },
                dragOptions: {
                    animation: 120,
                    scroll: true,
                    group: 'sortlist',
                    ghostClass: 'ghost-style'
                },
                pageIndex: 1,
                editVisible: false,
                handleEditForm : {
                    reportXAxis: 0,
                    reportYAxis: 0,
                    name: "",
                    dataSetId: "",
                    chartType: '',
                    config: {
                        chartSettings: {
                            axisSite: { right: [] },
                            yAxisType: [],
                            yAxisName: [],
                            xAxisType: '',
                            stack: { 'key': [] },
                            showLine: [],
                            area: false,
                            // 饼图
                            roseTypeHelper: false,
                            roseType: '',
                            dataType: 'percent',
                            selectedMode: false
                        },
                        extend: {
                            // 折线图显示指标数据
                            line: {
                                series: {
                                    label: {
                                        normal: {
                                            show: false
                                        }
                                    }
                                }
                            },

                            // 柱状图显示指标数据
                            histogram: {
                                series: {
                                    label: {
                                        show: false,
                                        position: "top"
                                    }
                                }
                            }
                        }
                    }
                },

                pickerOptions: {
                    shortcuts: [{
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近三个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                },

                chartTypeToolTips: {
                    GUAGE: "仪表盘统计规则：<br/>展示数据为所选维度<br/>之下所有指标[之和]",
                    HISTOGRAM: "柱状图统计规则：<br/>展示数据为所选维度<br/>之下的指标",
                    LINE: "折线图统计规则：<br/>展示数据为所选维度<br/>之下的指标",
                    PIE: "饼图统计规则：<br/>展示数据为所选维度<br/>之下的指标"
                }
            }
        },
        methods: {

            // 保存时候的校验
            saveEditForm(handleEditForm) {
                this.$refs[handleEditForm].validate((valid) => {
                    if (valid) {
                        this.editVisible = false
                    } else {
                        this.$message.error("请将报表信息填写完整")
                        return false;
                    }
                })
            },

            // pie 展示为roseType
            changeRoseType(chartSettings) {
                chartSettings.roseType = chartSettings.roseTypeHelper ? 'radius' : '';
            },

            // line 或者 histogram 展示为堆积图
            showStack(chartSettings) {
                chartSettings.area = 0 < chartSettings.stack.key.length;
            },

            getDataSetMetricsAndDimensions(id) {
                this.getDataSetMetrics(id)
                this.getDataSetDimensions(id)
            },

            // 获取数据集下的指标列表
            getDataSetMetrics(id) {
                this.handleEditForm.dataSetMetricFieldIds = []
                let queryParams = {
                    id : id
                }
                this.$api.REPORT_DATA_SET_API.get('GET_DATA_SET_METRICS', queryParams).then(res => {
                    this.dashboardHelper.reportssHelper[this.handleEditForm.reportXAxis][this.handleEditForm.reportYAxis].metrics = res.data
                })
            },

            // 获取数据集下的维度列表
            getDataSetDimensions(id) {
                this.handleEditForm.dataSetDimensionFieldId = ''
                let queryParams = {
                    id : id
                }
                this.$api.REPORT_DATA_SET_API.get('GET_DATA_SET_DIMENSIONS', queryParams).then(res => {
                    this.dashboardHelper.reportssHelper[this.handleEditForm.reportXAxis][this.handleEditForm.reportYAxis].dimensions = res.data
                })
            },

            // 获取所有数据集和数据集字段的组合cascade
            getDataSetsFields() {
                this.$api.REPORT_DATA_SET_API.get("GET_DATA_SETS_FIELDS").then(res => {
                    this.dashboardConstant.reportConstant.dataSetsFields = res.data
                })
            },

            // step2-报表编辑
            handleEdit(reportXAxis, reportYAxis) {
                this.handleEditForm = this.dashboard.reportss[reportXAxis][reportYAxis]
                this.handleEditForm.reportXAxis = reportXAxis
                this.handleEditForm.reportYAxis = reportYAxis
                this.editVisible = true
            },

            // 添加一行
            addReportRow(reportXAxis) {
                let report =  {
                    id: 0,
                    name : "新报表",
                    description: "",
                    dataSetId: "",
                    dataSetMetricFieldIds: [],
                    dataSetDimensionFieldId: '',
                    reportXAxis: reportXAxis,
                    reportYAxis: 0,
                    config: {
                        chartSettings: {
                            // 折线图和柱状图
                            axisSite: { right: [] },
                            yAxisType: [],
                            yAxisName: [],
                            xAxisType: '',
                            stack: { 'key': [] },
                            showLine: [],
                            area: false,
                            // 饼图
                            roseTypeHelper: false,
                            roseType: '',
                            dataType: 'percent',
                            selectedMode: false
                        },
                        extend: {
                            // 折线图显示指标数据
                            line: {
                                series: {
                                    label: {
                                        normal: {
                                            show: false
                                        }
                                    }
                                }
                            },

                            // 柱状图显示指标数据
                            histogram: {
                                series: {
                                    label: {
                                        show: false,
                                        position: "top"
                                    }
                                }
                            }
                        }
                    }
                }
                let reportHelper = {
                    metrics : [],
                    dimensions: []
                }
                this.dashboard.reportss[reportXAxis].push(report)
                this.dashboardHelper.reportssHelper[reportXAxis].push(reportHelper)
            },

            // 添加一列
            addReportColumn() {
                let reports =  [{
                    id: 0,
                    name : "新报表",
                    description: "",
                    dataSetId: "",
                    dataSetMetricFieldIds: [],
                    dataSetDimensionFieldId: '',
                    reportXAxis: 0,
                    reportYAxis: 0,
                    config: {
                        chartSettings: {
                            // 折线图和柱状图
                            axisSite: { right: [] },
                            yAxisType: [],
                            yAxisName: [],
                            xAxisType: '',
                            stack: { 'key': [] },
                            showLine: [],
                            area: false,
                            // 饼图
                            roseTypeHelper: false,
                            roseType: '',
                            dataType: 'percent',
                            selectedMode: false
                        },
                        extend: {
                            // 折线图显示指标数据
                            line: {
                                series: {
                                    label: {
                                        normal: {
                                            show: false
                                        }
                                    }
                                }
                            },

                            // 柱状图显示指标数据
                            histogram: {
                                series: {
                                    label: {
                                        show: false,
                                        position: "top"
                                    }
                                }
                            }
                        }
                    }
                }]
                let reportsHelper = [{
                    metrics : [],
                    dimensions: [],
                }]
                this.dashboard.reportss.push(reports)
                this.dashboardHelper.reportssHelper.push(reportsHelper)
            },

            // 删除一列
            deleteReportColumn() {
                if (1 < this.dashboard.reportss.length) {
                    this.$confirm('删除不可恢复，是否确定删除？', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.dashboard.reportss.pop()
                        this.dashboardHelper.reportssHelper.pop()
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        });
                    });
                } else {
                    this.$message.error("请至少配置一列报表")
                }
            },

            // step2-报表删除
            deleteReportRow(reportXAxis, reportYAxis) {
                if (1 < this.dashboard.reportss[reportXAxis].length) {
                    this.$confirm('删除不可恢复，是否确定删除？', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.dashboard.reportss[reportXAxis].splice(reportYAxis, 1)
                        this.dashboardHelper.reportssHelper[reportXAxis].splice(reportYAxis, 1)
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        });
                    });
                } else {
                    this.$message.error("请每列至少配置一个报表")
                }
            },

            // step3-添加报表过滤选项
            addReportFilter() {
                this.dashboard.reportFilters.push({
                    id: 0,
                    name: "过滤器" + (this.dashboard.reportFilters.length + 1),
                    filterType: '',
                    reportKeys: [],
                    queryColumn: []
                })
                this.dashboardHelper.reportFiltersHelper.push({
                    queryColumns: []
                })
            },

            // step3-删除报表过滤项
            removeReportFilter(index) {
                this.$confirm('删除不可恢复，是否确定删除？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.dashboard.reportFilters.splice(index, 1)
                    this.dashboardHelper.reportFiltersHelper.splice(index, 1)
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },

            // 改变helper里面的queryColumns时触发
            changeReportFilterQueryColumns(index) {
                this.dashboard.reportFilters[index].queryColumn = this.dashboardHelper.reportFiltersHelper[index].queryColumns[1];
            },

            removeHandle(event){
                this.$message.success(`从 ${event.from.id} 移动到 ${event.to.id} `);
            },

            // 前一页
            previousPage() {
                if (2 === this.pageIndex || 3 === this.pageIndex || 4 === this.pageIndex) {
                    this.pageIndex--;
                }
            },

            // 后一页
            nextPage() {
                if (1 === this.pageIndex || 2 === this.pageIndex || 3 === this.pageIndex) {
                    this.pageIndex++;
                }
                if (3 === this.pageIndex) {
                    this.dashboardHelper.reportFilterHelper = []
                    this.dashboard.reportss.forEach(reports => {
                        reports.forEach(report => {
                            this.dashboardHelper.reportFilterHelper.push(report)
                        })
                    })
                }
                if (4 === this.pageIndex) {
                    this.dashboardHelper.reportssSymmetryHelper = []
                    this.dashboard.reportss[0].forEach(reports => this.dashboardHelper.reportssSymmetryHelper.push([]))
                    for (let i = 0; i < this.dashboard.reportss.length; i++) {
                        let reports = this.dashboard.reportss[i];
                        for (let j = 0; j < reports.length; j++) {
                            this.dashboardHelper.reportssSymmetryHelper[j].push(reports[j]);
                        }
                    }
                }
            },

            addDashboard() {
                console.log(this.dashboard)
                this.$api.REPORT_DASHBOARD_API.post('ADD_DASHBOARD', this.dashboard).then(res => {
                    this.$message.success("成功添加数据看板")
                    this.$router.replace('/dashboard_table')
                })
            },

            // 获取数据集列表
            getDataSets() {
                let queryParams = {
                    pageIndex: 1,
                    pageSize: 10
                }
                this.$api.REPORT_DATA_SET_API.get('GET_DATA_SET', queryParams).then(res => {
                    this.dashboardConstant.reportConstant.dataSets = res.data.list
                })
            },

            // 获取报表类型chartTypes
            getChartTypes() {
                this.$api.REPORT_REPORT_API.get('GET_CHART_TYPES').then(res => {
                    this.dashboardConstant.reportConstant.chartTypes = res.data
                })
            },

            getPrivileges() {
                this.$api.FINANCE_DEVELOPER_API.get('GET_PRIVILEGES').then(res => {
                    this.dashboardConstant.privileges = res.data
                })
            },

            getFilterTypes() {
                this.$api.REPORT_REPORT_API.get('GET_FILTER_TYPES').then(res => {
                    this.dashboardConstant.reportFilterConstant.filterTypes = res.data
                })
            }
        },
        created() {
            this.getPrivileges()
            this.getDataSets()
            this.getChartTypes()
            this.getFilterTypes()
            this.getDataSetsFields()
        }
    }
</script>

<style>
    .drag-box-item {
        flex: 1;
        max-width: 100%;
        background-color: #eff1f5;
        border-radius: 6px;
        border: 1px #e1e4e8 solid;
    }
    .item-title{
        padding: 3% 8px 8px 12px;
        font-size: 14px;
        line-height: 1.5;
        color: #24292e;
        font-weight: 600;
    }
    .item-ul{
        padding: 0 8px 8px;
        height: 500px;
        overflow-y: scroll;
    }
    .item-ul::-webkit-scrollbar{
        width: 0;
    }
    .drag-list {
        border: 1px #e1e4e8 solid;
        padding: 10px;
        margin: 5px 0 10px;
        list-style: none;
        background-color: #fff;
        border-radius: 6px;
        cursor: pointer;
        -webkit-transition: border .3s ease-in;
        transition: border .3s ease-in;
    }
    .drag-list:hover {
        border: 1px solid #20a0ff;
    }

    .table{
        width: 100%;
        font-size: 14px;
    }

    .line{
        text-align: center;
    }

    .red{
        color: #ff0000;
    }

    .demo-table-expand {
    }
    .demo-table-expand label {
        width: 90px;
        color: #99a9bf;
    }
    .demo-table-expand .el-form-item {
        margin-right: 0;
        width: 50%;
    }
</style>