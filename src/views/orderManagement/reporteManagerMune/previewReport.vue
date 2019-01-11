<template>
    <div class="inspectionReport">
        <el-row >
            <!-- 报告页面预览 -->
            <el-col :span="24" class="inspectionReport-interface">
                <!-- 基本信息 -->
                <div class="Report-interface-baseInfo">
                    <ul>
                        <li><a href="#"><img src="/static/image/LogoReport.png" alt=""></a></li>
                        <li>检验报告</li>
                        <li @click="back()">返回上一页</li>
                    </ul>
                    <p>基本信息</p>
                    <div class="interface-baseInfo-table">
                           <table border="1" cellspacing="0" cellpadding="0"  height="100%" class="baseInfo-element-table">
                               <tr height="60px">
                                   <td>检验类型</td>
                                   <td>第{{baseInfoData.number}}次验货</td>
                               </tr>
                               <tr height="60px">
                                   <td>买家名称</td>
                                   <td>{{baseInfoData.user_name}}</td>
                               </tr>
                               <tr height="60px">
                                   <td>供应商名称</td>
                                   <td>{{baseInfoData.supplier_name}}</td>
                               </tr>
                               <tr height="60px">
                                   <td>工厂名称</td>
                                   <td>{{baseInfoData.factory_name}}</td>
                               </tr>
                               <tr height="60px">
                                   <td>款号/型号</td>
                                   <td>{{baseInfoData.product_number}}</td>
                               </tr>
                               <tr height="60px">
                                   <td>产品名称</td>
                                   <td>{{baseInfoData.product_name}}</td>
                               </tr>
                               <tr height="60px">
                                   <td>订单号</td>
                                   <td>{{baseInfoData.order_name}}</td>
                               </tr>
                               <tr height="60px">
                                   <td>检验服务</td>
                                   <td>{{ _.get(_.find( configs.inspectionTypes, {value : baseInfoData.inspection_type}), 'label') }}</td>
                                   <!-- <td>{{ _.get(_.find(configs.inspectionTypes, {value : baseInfoData.inspection_type}), 'label') }}</td> -->
                               </tr>
                               <tr height="60px">
                                   <td style="text-align:center;vertical-align:middle;">检验日期</td>
                                   <td>
                                       <span v-for="(item,index) in  baseInfoData.inspection_dates" :key = index>
                                           {{ item | moment("YYYY.MM.DD")}}
                                       </span>
                                   </td>
                               </tr>
                               <tr height="60px">
                                   <td>检验地点</td>
                                   <td>{{baseInfoData.inspection_address}}</td>
                               </tr>
                               <tr height="60px">
                                   <td>整批次数量</td>
                                   <td>{{baseInfoData.report_quantity}}</td>
                               </tr>
                               <tr height="60px">
                                   <td>检验依据</td>
                                   <td>{{ _.get(_.find( configs.inspectionBases, {value : baseInfoData.inspection_basis}), 'label') }}</td>
                               </tr>
                           </table>
                           <div class="baseInfo-table-img">
                              <img class="baseInfo-picture" :src="baseInfoData.file && baseInfoData.file.url" alt="">
                           </div>
                    </div>
                </div>
                <!-- 检验结论 -->
                <div class="Report-interface-conclusion">
                    <p>检验结论</p>
                    <p>
                        <span>报告总结论</span>
                        <span v-if="(exteriorData.real_fatal_defect<exteriorData.sampling.params.fatal_defect) && (exteriorData.real_serious_defect<exteriorData.sampling.params.serious_defect) && (exteriorData.real_minor_defect<exteriorData.sampling.params.minor_defect)">符合</span>
                        <span v-else>不符合</span>
                    </p>
                    <!-- <el-form-item label-width="0" style="margin: 0 0 24px 0;"> -->
                        <table cellspacing="0" cellpadding="0" border="0" class="tc-table" style="width: 100%">
                            <tbody>
                            <tr height="60px">
                                <td style="width: 270px;" class="background-gray">外观及工艺</td>
                                <td colspan="5" v-if="(exteriorData.real_fatal_defect<exteriorData.sampling.params.fatal_defect) && (exteriorData.real_serious_defect<exteriorData.sampling.params.serious_defect) && (exteriorData.real_minor_defect<exteriorData.sampling.params.minor_defect)">符合</td>
                                <td colspan="5" v-else>不符合</td>
                            </tr>
                            <tr height="60px">
                                <td style="width: 270px;" class="background-gray">抽样数</td>
                                <td colspan="5">{{ exteriorData.sampling.params.quantity }}</td>
                            </tr>
                            <tr>
                                <td rowspan="2" class="background-gray" style="vertical-align:middle;text-align:center;">检验标准</td>
                                <!-- {{order}} -->
                                <td rowspan="2" style="text-align:center;vertical-align:middle;">{{ _.get(_.find(_.get(configs, 'samplings.options', []), { value: exteriorData.sampling.type }), 'label') }}</td>
                                <td style="width: 180px;height:40px;">疵点</td>
                                <td style="width: 180px;">致命缺陷</td>
                                <td style="width: 180px;">严重缺陷</td>
                                <td style="width: 180px;">轻微缺陷</td>
                            </tr>
                            <tr>
                                <td height="40px">AQL</td>
                                <td>{{ exteriorData.sampling.params.fatal_defect_limit ? exteriorData.sampling.params.fatal_defect_limit : 'N/A' }}</td>
                                <td>{{ exteriorData.sampling.params.serious_defect_limit ? exteriorData.sampling.params.serious_defect_limit : 'N/A' }}</td>
                                <td>{{ exteriorData.sampling.params.minor_defect_limit ? exteriorData.sampling.params.minor_defect_limit : 'N/A' }}</td>
                            </tr>
                            <tr>
                                <td rowspan="3" class="background-gray" style="vertical-align:middle;text-align:center;">检验水平</td>
                                <td rowspan="3">{{ _.get(_.find(_.get(configs, 'samplings.levels', []), { level: _.get(order, 'visual_and_workmanship.sampling.params.level') }), 'value') }}</td>
                                <td height="40px">最大允许值</td>
                                <td>{{ exteriorData.sampling.params.fatal_defect }}</td>
                                <td>{{ exteriorData.sampling.params.serious_defect }}</td>
                                <td>{{ exteriorData.sampling.params.minor_defect }}</td>
                            </tr>
                            <tr>
                                <td height="40px">实际值</td>
                                <td>{{ exteriorData.real_fatal_defect }}</td>
                                <td>{{ exteriorData.real_serious_defect }}</td>
                                <td>{{ exteriorData.real_minor_defect }}</td>
                            </tr>
                            <tr>
                                <td height="40px">结论</td>
                                <td colspan="3" v-if="(exteriorData.real_fatal_defect<exteriorData.sampling.params.fatal_defect) && (exteriorData.real_serious_defect<exteriorData.sampling.params.serious_defect) && (exteriorData.real_minor_defect<exteriorData.sampling.params.minor_defect)">未超出可接受限值</td>
                                <td colspan="3" v-if="(exteriorData.real_fatal_defect>exteriorData.sampling.params.fatal_defect)">致命缺陷</td>
                                <td colspan="3" v-if="(exteriorData.real_serious_defect>exteriorData.sampling.params.serious_defect)">严重缺陷</td>
                                <td colspan="3" v-if="(exteriorData.real_minor_defect>exteriorData.sampling.params.minor_defect)">轻微缺陷</td>
                            </tr>
                            </tbody>
                        </table>
                    <!-- </el-form-item> -->


                    <!-- <div class="conclusion-tableA">
                        <table cellspacing="0" cellpadding="0" width="100%" height="100%" class="conclusion-element-tableA">
                            <tr height="60px">
                                <td>外观及工艺</td>
                                <td colspan="5" :class="addClass(conclusionData.general_conclusion)">{{conclusionData.general_conclusion = 1?'符合':'不符合'}}</td>
                            </tr>
                            <tr height="40px">
                                <td rowspan="3">检验标准</td>
                                <td width="464px" rowspan="3">ANSI/ASQ Z1.4 Single Sampling Plan</td>
                                <td width="180px">疵点</td>
                                <td width="180px">致命缺陷</td>
                                <td width="180px">严重缺陷</td>
                                <td width="180px">轻微缺陷</td>
                            </tr>
                            <tr>
                                
                                <td>抽样数</td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                            <tr>
                               
                                <td>AQL</td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                            <tr>
                                <td rowspan="3">检验水平</td>
                                <td rowspan="3">Level II</td>
                                <td>最大允许值</td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                            <tr>
                                <td>实际值</td>
                                <td></td>
                                <td></td>
                                <td></td>
                               
                            </tr>
                            <tr>
                                <td>结论</td>
                                <td colspan="3"></td>
                                
                            </tr>
                        </table>
                    </div> -->
                    

                    <div class="conclusion-tableB">
                        <table cellspacing="0" cellpadding="0" width="100%" height="100%" class="conclusion-element-tableB">
                            <tr height="60px">
                                <td width="270px">数量符合性</td>
                                <td v-if="QuantityData.conclusion==1" style="width: 270px;" class="trueText">符合</td>
                                <td v-if="QuantityData.conclusion==2" style="width: 270px;" class='wrongText'>不符合</td>
                                <td v-if="QuantityData.conclusion==3" style="width: 270px;" class='wrongText'>待定</td>
                                <td v-if="QuantityData.conclusion==4" style="width: 270px;" class='wrongText'>不适用</td>
                                <td > <span>{{conclusionData.conclusion.quantityCompliance ? conclusionData.conclusion.quantityCompliance : '无'}}</span></td>
                            </tr>
                            <tr height="60px">
                                <td>包装/标识/标签</td>
                                <td v-if="ClonebStatu == 1" class='wrongText'>不符合</td>
                                <td v-if="ClonebStatu == 2" class='wrongText'>待定</td>
                                <td v-if="ClonebStatu == 3" class="trueText">符合</td>
                                <td > <span>{{conclusionData.conclusion.packing ?  conclusionData.conclusion.packing : '无'}}</span> </td>
                                <!-- <td :class="addClass(conclusionData.general_conclusion)">{{conclusionData.general_conclusion = 1?'符合':'不符合'}}</td>
                                <td></td> -->
                            </tr>
                            <tr height="60px">
                                <td>产品符合性</td>
                                <td v-if="CloneCStatu == 1" class='wrongText'>不符合</td>
                                <td v-if="CloneCStatu == 2" class='wrongText'>待定</td>
                                <td v-if="CloneCStatu == 3" class="trueText">符合</td>
                                <td> <span>{{conclusionData.conclusion.product ? conclusionData.conclusion.product : '无'}}</span></td>
                                <!-- <td :class="addClass(conclusionData.general_conclusion)">{{conclusionData.general_conclusion = 1?'符合':'不符合'}}</td>
                                <td></td> -->
                            </tr>
                            <tr height="60px">
                                <td>数据测量/现场测试</td>
                                <td v-if="CloneDStatu == 1" class='wrongText'>不符合</td>
                                <td v-if="CloneDStatu == 2" class='wrongText'>待定</td>
                                <td v-if="CloneDStatu == 3" class="trueText">符合</td>
                                <td><span>{{conclusionData.conclusion.measure ? conclusionData.conclusion.measure : '无'}}</span></td>
                            
                            </tr>
                            <tr height="60px">
                                <td>特别注意点</td>
                                <td v-if="CloneFStatu == 1" class='wrongText'>不符合</td>
                                <td v-if="CloneFStatu == 2" class='wrongText'>待定</td>
                                <td v-if="CloneFStatu == 3" class="trueText">符合</td>
                                <td><span>{{conclusionData.conclusion.keyPoint ? conclusionData.conclusion.keyPoint : '无'}}</span></td>            
                            </tr>
                        </table>
                    </div>
                    <p class="conclusion-remark">备注</p>
                    <div class="conclusion-remark-table">
                        <table cellspacing="0" cellpadding="0" width="100%" height="100%">
                            <tr height="60px" v-for="(item,index) in conclusionData.remarks" :key="index+'-conclusion'">
                                <td width="100px">{{index+1}}</td>
                                <td width="1359px">{{item.remark}}</td>
                            </tr>
                            <!-- <tr height="60px">
                                <td></td>
                                <td></td>
                            </tr>
                            <tr height="60px">
                                <td></td>
                                <td></td>
                            </tr>
                            <tr height="60px">
                                <td></td>
                                <td></td>
                            </tr> -->
                        </table>
                    </div>
                </div>
                <!-- A、数量符合性 -->
                <div class="Report-interface-Quantity">
                    <p class="Quantity-p1">A、数量符合性</p>
                    <p class="Quantity-p2"><span>报告总结论</span><span :class="addClass(QuantityData.conclusion)">{{ _.get(_.find( configs.conclusionOptions, {value : QuantityData.conclusion}), 'label') }}</span></p>
                    <div class="interface-Quantity-table">
                        <table cellspacing="0" cellpadding="0" width="100%" height="100%">
                            <tr height="40px">
                                <td width="200px" rowspan="2">款号/型号</td>
                                <td width="200px" rowspan="2">订单号码</td>
                                <td width="134px" rowspan="2">订单产品数</td>
                                <td width="134px" rowspan="2">出货数量</td>
                                <td width="128px" colspan="2">实际完成数量</td>
                                <td width="128px" colspan="2">箱数</td>
                                <td width="128px" rowspan="2">抽样数</td>
                                <td width="128px" rowspan="2">抽箱数</td>
                            </tr>
                            <tr height="40px">
                                <td>已包装</td>
                                <td>未包装</td>
                                <td>已包装</td>
                                <td>未包装</td>
                            </tr>
                            <tr height="60px" v-if="QuantityData.products" v-for="(item,index) in _.get(QuantityData, 'products',[])" :key="index+'Quantity'">
                                <td>{{item.section_number}}</td>
                                <td>{{item.order_number}}</td>
                                <td>{{item.order_quantity}}</td>
                                <td>{{item.shipment_quantity}}</td>
                                <td>{{item.completed_unpackaged}}</td>
                                <td>{{item.completed_packaged}}</td>
                                <td>{{item.unpackaged}}</td>
                                <td>{{item.packaged}}</td>
                                <td>{{item.check_quantity}}</td>
                                <td>{{item.check_package_quantity}}</td>
                            </tr>
                            <tr height="60px">
                                <td colspan="2">总数</td>
                                <td>{{sum(_.get(QuantityData, 'products'),'order_quantity')}}</td>
                                <td>{{sum(_.get(QuantityData, 'products'),'shipment_quantity')}}</td>
                                <td>{{sum(_.get(QuantityData, 'products'),'completed_unpackaged')}}</td>
                                <td>{{sum(_.get(QuantityData, 'products'),'completed_packaged')}}</td>
                                <td>{{sum(_.get(QuantityData, 'products'),'unpackaged')}}</td>
                                <td>{{sum(_.get(QuantityData, 'products'),'packaged')}}</td>
                                <td>{{sum(_.get(QuantityData, 'products'),'check_quantity')}}</td>
                                <td>{{sum(_.get(QuantityData, 'products'),'check_package_quantity')}}</td>
                            </tr>
                        </table>
                    </div>
                    <p class="Quantity-p3"><span>是否有箱号:</span><span>{{QuantityData.has_package_number==0 ? '无' :'有'}}</span></p>
                    <p class="Quantity-p4" v-if="QuantityData.has_package_number!=0">{{QuantityData.packag_number}}</p>
                    <div class="interface-Quantity-remark clearfix">
                        <p>备注:</p>
                        <p class="content">{{QuantityData.remark_content}}</p>
                    </div>
                    <div class="interface-Quantity-images clearfix">
                        <div>图片:</div>
                        <ShowFile :file-list="QuantityData.files"/>
                    </div>
                </div>
                <!-- B、包装/标识/标签 -->
                <div class="Report-interface-packageLogo">
                    <p class="packageLogo-p1">B、包装/标识/标签</p>
                    <p class="packageLogo-p2">包装符合型</p>
                    <div class="packageLogo-packageInfo1" v-if="packageLogoData.packing.products" v-for="(item,index) in _.get(packageLogoData.packing, 'products', [])" :key="index+'-Info1'">
                        <p class="packageInfo1-p1">{{index+1}}、{{item.name}}/型号{{item.number}}</p>
                        <p class="packageInfo1-p2"><span>结论</span><span :class="addClass(item.conclusion)">{{ _.get(_.find( configs.conclusionOptions, {value : item.conclusion}), 'label') }}</span></p>
                        <div class="packageInfo1-table">
                            <table cellspacing="0" cellpadding="0" width="100%" height="100%">
                                <tr height="60px">
                                    <td width="180px">项目</td>
                                    <td colspan="4">检查结果</td>
                                </tr>
                                <tr height="60px">
                                    <td width="180px">单个包装</td>
                                    <td width="235px">
                                        <span>包装:</span><span>{{  _.get(_.find( configs.packageOptions.single, {value : item.single.package}), 'label')}}</span>
                                    </td>
                                    <td width="206px" colspan="3">
                                        <span>说明:</span><span>{{item.single.description?item.single.description:'无'}}</span>
                                    </td>
                                </tr>
                                <tr height="60px">
                                    <td>内包装</td>
                                    <td>
                                        <span>入数:</span><span>{{item.inner.quantity}}</span>
                                    </td>
                                    <td width="206px">
                                        <span>包装:</span><span>{{ _.get(_.find( configs.packageOptions.inner, {value : item.inner.package}), 'label')}}</span>
                                    </td>
                                    <td colspan="2">
                                        <span>说明:</span><span>{{item.inner.description?item.inner.description:'无'}}</span>
                                    </td>
                                </tr>
                                <tr height="60px">
                                    <td>外包装</td>
                                    <td>
                                        <span>入数</span><span>{{item.outer.quantity}}</span>
                                    </td>
                                    <td>
                                        <span>包装:</span><span>{{_.get(_.find( configs.packageOptions.outer, {value : item.outer.package}), 'label')}}</span>
                                    </td>
                                    <td colspan="2">
                                        <span>说明:</span><span>{{item.outer.description?item.outer.description:'无'}}</span>
                                    </td>
                                </tr>
                                <tr height="54px">
                                    <td></td>
                                    <td></td>
                                    <td colspan="2">
                                        <span>外箱尺寸:</span><span>{{item.outer.size_length}}（L） x {{item.outer.size_width}}（W） x {{ item.outer.size_height}}（H）{{_.get(_.find( configs.packageOptions.size, {value : item.outer.size_unit}), 'label')}}</span>
                                    </td>
                                    <td width="564px">
                                        <span>外箱毛重:</span><span>{{item.outer.weight}}{{_.get(_.find( configs.packageOptions.weight, {value : item.outer.weight_unit}), 'label')}}</span>
                                    </td>
                                </tr>
                            </table>
                        </div>
                        <div class="packageInfo1-remark clearfix">
                            <p>备注:</p>
                            <p class="content">{{item.remark_content}}</p>
                        </div>
                        <div class="packageInfo1-picture clearfix">
                            <div>图片:</div>
                            <ShowFile :file-list="item.files"/>
                        </div>
                    </div>
                    <p class="packageLogo-p3">唛头/标识</p>
                    <div class="packageLogo-identify" v-if="packageLogoData.marking.products" v-for="(item,index) in _.get(packageLogoData.marking, 'products', [])" :key="index+'-identify'">
                        <p class="identify-p1">{{index+1}}、{{item.name}}/型号{{item.number}}</p>
                        <p class="identify-p2"><span>结论</span><span :class="addClass(item.conclusion)">{{ _.get(_.find( configs.conclusionOptions, {value : item.conclusion}), 'label') }}</span></p>
                        <div class="identify-remark clearfix">
                            <p>备注:</p>
                            <p class="content">{{item.remark_content}}</p>
                        </div>
                        <div class="identify-images clearfix">
                            <div>图片:</div>
                            <ShowFile :file-list="item.files"/>
                        </div>
                    </div>
                </div>
                <!-- C、产品符合性 -->
                <div class="Report-interface-goodsInfo">
                    <p class="goodsInfo-p1">C、产品符合性</p>
                    <p class="goodsInfo-p2">款式/材料/颜色符合型</p>
                    <div class="goodsInfo-detail" v-if="goodsInfoData.products" v-for="(item,index) in _.get(goodsInfoData, 'products', [])" :key="index+'-Info-detail'">
                        <p class="detail-p1">{{index+1}}、{{item.name}}/型号{{ item.number }}</p>
                        <p class="detail-p2"><span>结论</span><span :class="addClass(item.conclusion)">{{ _.get(_.find( configs.conclusionOptions, {value : item.conclusion}), 'label') }}</span></p>
                        <div class="detail-remark clearfix">
                            <p>备注:</p>
                            <p class="content">{{ item.remark_content?item.remark_content:'无' }}</p>
                        </div>
                        <div class="detail-images clearfix">
                           <div>图片:</div>
                           <ShowFile :file-list="item.files"/>
                            <!-- <div class="content">
                                <p v-for="(Image,index) in item.files" :key="index+'-detail-images'">
                                    <img :src="Image && Image.url" alt="">
                                    <span>{{Image.name}}</span>
                                </p>
                            </div>  -->
                        </div>
                    </div>
                </div>
                <!-- D、数据测量/现场测试 -->
                <div class="Report-interface-gauge">
                    <p class="gauge-p1">D、数据测量/现场测试</p>
                    <div class="gauge-table">
                        <table cellspacing="0" cellpadding="0" width="100%" height="100%">
                            <tr height="60px">
                                <td width="220px">测试项目</td>
                                <td width="220px">测试要求</td>
                                <td width="532px">测试数据</td>
                                <td width="150px">包含产品</td>
                                <td width="123px">测试数量</td>
                                <td width="209px">测试结论</td>
                            </tr>
                            <tr height="80px" v-if="gaugeData.checkitems" v-for="(item,index) in gaugeData.checkitems" :key="index+'-gauge-table'">
                                <td>{{ item.title }}</td>
                                <td>{{ item.description }}</td>
                                <td>{{ item.message }}</td>
                                <td>{{ _.toString(item.products) }}</td>
                                <td>{{ item.check_quantity }}</td>
                                <td :class="addClass(item.conclusion)"> {{ _.get(_.find( configs.conclusionOptions, {value : item.conclusion}), 'label') }} </td>
                            </tr>
                        </table>
                    </div>
                    <div class="gauge-remark clearfix">
                        <p>备注:</p>
                        <p class="content">{{ gaugeData.remark_content?gaugeData.remark_content:'无' }}</p>
                    </div>
                    <div class="gauge-images clearfix">
                        <div>图片:</div>
                        <ShowFile :file-list="gaugeData.files"/>
                        <!-- <div class="content">
                            <p v-for="(Image,index) in gaugeData.files" :key="index+'-gauge-images'">
                                <img :src="Image && Image.url" alt="">
                                <span>{{Image.name}}</span>
                            </p>
                        </div>  -->
                    </div>
                </div>
                <!-- E、外观及工艺 -->
                <div class="Report-interface-exterior">
                    <p class="exterior-p1">E、外观及工艺</p>
                    <div class="exterior-table">
                        <table cellspacing="0" cellpadding="0" border="0" class="tc-table" style="width: 100%">
                            <tbody>
                            <tr>
                                <td style="width: 270px;height:60px;" class="background-gray">
                                检验标准
                                </td>
                                <td colspan="3">
                                {{ _.get(_.find(_.get(configs, 'samplings.options', []), { value: exteriorData.sampling.type }), 'label') }}
                                </td>
                            </tr>
                            <tr v-if="exteriorData.sampling.type === 1" style="height:60px">
                                <td class="background-gray">
                                抽样水平
                                </td>
                                <td colspan="3">
                                {{ _.get(_.find(_.get(configs, 'samplings.levels', []), { level: exteriorData.sampling.params.level }), 'value') }}
                                </td>
                            </tr>
                            <tr v-if="exteriorData.sampling.type === 2" style="height:60px">
                                <td class="background-gray">
                                抽样比例
                                </td>
                                <td colspan="3">
                                {{ exteriorData.sampling.params.proportion }}%
                                <!-- {{ _.get(_.find(_.get(configs, 'samplings.options', []), { level: data.sampling.params.proportion }), 'label') }} -->
                                </td>
                            </tr>
                            <tr style="height:60px">
                                <td class="background-gray">抽样数量</td>
                                <td colspan="3">{{ exteriorData.sampling.params.quantity }}</td>
                            </tr>
                            <tr style="height:60px">
                                <td class="background-gray">缺陷分类</td>
                                <td>致命缺陷</td>
                                <td>严重缺陷</td>
                                <td>轻微缺陷</td>
                            </tr>
                            <tr style="height:60px">
                                <td class="background-gray">可接受质量限（AQL）</td>
                                <td>{{ exteriorData.sampling.params.fatal_defect_limit ? exteriorData.sampling.params.fatal_defect_limit : 'N/A' }}</td>
                                <td>{{ exteriorData.sampling.params.serious_defect_limit ? exteriorData.sampling.params.serious_defect_limit : 'N/A' }}</td>
                                <td>{{ exteriorData.sampling.params.minor_defect_limit ? exteriorData.sampling.params.minor_defect_limit : 'N/A' }}</td>
                            </tr>
                            <tr style="height:60px">
                                <td class="background-gray">最大允许值</td>
                                <td>{{ exteriorData.sampling.params.fatal_defect }}</td>
                                <td>{{ exteriorData.sampling.params.serious_defect }}</td>
                                <td>{{ exteriorData.sampling.params.minor_defect }}</td>
                            </tr>
                            <tr style="height:60px">
                                <td class="background-gray">实际发现</td>
                                <td>{{ exteriorData.real_fatal_defect }}</td>
                                <td>{{ exteriorData.real_serious_defect }}</td>
                                <td>{{ exteriorData.real_minor_defect }}</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="exterior-detail" v-for="(item,index) in _.get(exteriorData, 'products', [])" :key="index+'-exterior-detail'">
                        <p class="exterior-detail-p">
                            <span>{{index+1}}、{{ item.name }}/型号{{ item.number }}</span>
                            <span>抽样数{{item.check_quantity}}</span>
                        </p>
                        <div class="exterior-detail-div">
                            <table border="1" cellspacing="0" cellpadding="0" width="100%" height="100%">
                                <tr height="60px">
                                    <td width="220px">缺陷类别</td>
                                    <td width="773px">缺陷明细</td>
                                    <td width="152px">致命缺陷</td>
                                    <td width="152px">严重缺陷</td>
                                    <td width="158px">轻微缺陷</td>
                                </tr>
                                <tr height="60px" v-for="(item,index) in item.defective_items" :key="index+'-detail-div'">
                                    <td>{{ _.get(_.find( configs.defectiveCategories, {value : item.title}), 'label') }}</td>
                                    <td>{{item.description}}</td>
                                    <td>{{item.fatal_defect}}</td>
                                    <td>{{item.serious_defect}}</td>
                                    <td>{{item.minor_defect}}</td>
                                </tr>
                            </table>
                        </div>
                        <div class="exterior-remark clearfix">
                            <p>备注:</p>
                            <p class="content">{{item.remark_content?item.remark_content:'无'}}</p>
                        </div>
                        <div class="exterior-images clearfix">
                            <div>图片:</div>
                            <ShowFile :file-list="item.files"/>
                        </div>
                    </div>
                    
                    
                </div>
                <!-- F、客户特殊要求 -->
                <div class="Report-interface-special">
                    <p class="special-p1"> 
                        F、客户特殊要求
                    </p>
                    <div class="special-detail" v-for="(item,index) in _.get(specialData, 'products', [])" :key="index+'-special'">
                        <p class="special-detail-p1">{{index+1}}、{{item.name}}/型号N/A</p>
                        <p class="special-detail-p2"><span>结论</span><span :class="addClass(item.conclusion)">{{ _.get(_.find( configs.conclusionOptions, {value : item.conclusion}), 'label') }}</span></p>
                        <div class="special-detail-remark clearfix">
                            <p>备注:</p>
                            <p class="content">{{ item.remark_content ? item.remark_content : '无'}}</p>
                        </div>
                        <div class="special-detail-images clearfix">
                            <div>图片:</div>
                            <ShowFile :file-list="item.files"/>
                        </div>
                    </div>    
                </div>
                <!-- G、附录 -->
                <div class="Report-interface-appendix">
                    <p class="appendix-p1">G、附录</p>
                    <p class="appendix-p2"><span>附录 I</span><span>取样信息</span></p>
                    <div class="appendix-sample" v-for="(item,index) in _.get(appendixData, 'sampling_information', [])" :key="index+'-appendix-sample'">
                        <p class="appendix-sample-p1">{{ index+1 }}、{{ item.sampling_number }}/型号123456</p>
                        <div class="appendix-sampl-table">
                            <div class="appendix-sampl-table-top">
                                <div class="appendix-sampl-table-top-left">
                                    <p>取样信息</p>
                                    <p><span>取样数量:</span><span>{{ item.sampling_quantity }}</span></p>
                                    <p><span>取样原因:</span><span>{{ item.sampling_reason }}</span></p>
                                    <p><span>收件公司:</span><span>{{ item.receive_company }}</span></p>
                                    <p><span>收件人:</span><span>{{ item.receive_person }}</span></p>
                                    <p><span>收件地址:</span><span>{{ item.receive_address }}</span></p>
                                    <p><span>备注信息:</span><span>{{ item.remark }}</span></p>
                                </div>
                                <div class="appendix-sampl-table-top-right">
                                    <p>其他信息</p>
                                    <p><span>快递公司:</span><span>{{ item.courier_company }}</span></p>
                                    <p><span>快递单号:</span><span>{{ item.courier_number }}</span></p>
                                    <p><span>备注信息:</span><span>{{ item.courier_remark }}</span></p>
                                </div>
                            </div>
                            <div class="appendix-sampl-table-bottom clearfix">
                                <ShowFile :file-list="item.files"/>
                                <!-- <p v-for="(item,index) in item.files" :key="index+'appendix-sampl'">
                                    <img :src="item && item.url" alt="">
                                    <span>{{ item.name }}</span>
                                </p> -->
                            </div>
                        </div>
                    </div>
                    <p class="appendix-p3"><span>附录Ⅱ</span><span>测量及测试仪器记录</span></p>
                    <div class="appendix-table">
                         <table cellspacing="0" cellpadding="0" width="100%" height="100%">
                            <tr height="60px">
                                <td width="262px">描述</td>
                                <td width="374px">仪器编号</td>
                                <td width="280px">校准日期</td>
                                <td width="280px">有效日期</td>
                                <td width="260px">来源</td>
                            </tr>
                            <tr height="60px" v-for="(item,index) in _.get(appendixData, 'tools', [])" :key="index+'-appendix-table'">
                                <td>{{ _.get(_.find( _.get(configs, 'toolOptions' ,[]), {value : item.name}), 'label') }}</td>
                                <td>{{ item.order_number }}</td>
                                <td>{{ item.calibrated_at | moment("YYYY-MM-DD") }}</td>
                                <td>{{ item.effected_at | moment("YYYY-MM-DD")}}</td>
                                <td>{{ _.get(_.find( _.get(configs, 'sourceOptions' ,[]), {value : item.source}), 'label') }}</td>
                            </tr>
                        </table>
                    </div>
                    <p class="appendix-p4"><span>附录Ⅲ</span><span>其他图片( 廉政声明、工厂大门，仓储，测量图标，包装清单等)</span></p>
                    <div class="appendix-otherImages clearfix">
                        <ShowFile :file-list=" _.get(appendixData, 'files', [])"/>
                        <!-- <p v-for="(item,index) in _.get(appendixData, 'files', [])" :key="index+'-otherImages'">
                            <img :src="item && item.url" alt="">
                            <span>{{ item.name }}</span>
                        </p> -->
                    </div>
                </div>
                <!-- 提交报告按钮 -->
                <el-form class="btn-group">
                    <el-form-item label-width="0" style="text-align: center;">
                        <el-button class="btnBack"  @click="back()">返回</el-button>
                        <el-button class="btnSubmit"  @click="reportsubmit()">提交报告</el-button>
                    </el-form-item>
                </el-form>

                <!-- <div class="btn-group">
                    <el-button class="back">返回</el-button>
                    <el-button class="submitBtn">提交报告</el-button>
                </div> -->
                <!-- 报告批核 -->
                <!-- <div class="Report-interface-approval">
                    <p class="approval-p">报告批核</p>
                    <div class="approval-table">
                        <table cellspacing="0" cellpadding="0" width="100%" height="100%">
                            <tr height="87px"> 
                                <td width="270px">
                                    <p>检验员</p>
                                    <p>检验日期</p> 
                                </td>
                                <td width="1189px">
                                    <p>TC1745，TC608062,TC821032</p>
                                    <p>2018-05-23</p>
                                </td>
                            </tr>
                            <tr height="140px">
                                <td>
                                    <p>审核员</p>
                                    <p>审核日期</p>
                                </td>
                                <td>
                                    <p><img src="" alt=""></p>
                                    <p>2018-05-23</p>
                                </td>
                            </tr>
                            <tr height="139px">
                                <td>
                                    <p>审批人</p>
                                    <p>核准时间</p> 
                                </td>
                                <td>
                                    <p><img src="" alt=""></p>
                                    <p>2018-05-23</p>
                                </td>
                            </tr>
                        </table>
                    </div>
                </div> -->
            </el-col>
        </el-row>
    </div>
</template>


<script>
const moment = require('moment')
import {getReportSelf,reportsubmit} from '@/api/reportManagement'
import ShowFile300_225 from '@/components/ShowFile300_225'
export default {
    name: 'inspectionReport',
    components: {
        'ShowFile': ShowFile300_225,
    },
    data(){
        return{
            //基础信息table数据
            baseInfoData: [],
            ClonebStatu: '',
            CloneCStatu: '',
            CloneDStatu: '',
            CloneFStatu: '',
            baseImg: [],     //imgUrl
            
            //检验结论table数据
            conclusionData: [],

            //A、数量符合性table数据
            QuantityData: [],

            QuantityImg: [],    //imgUrl


            //B、包装/标识/标签table数据
            packageLogoData: [],

            //C、产品符合性table数据
            goodsInfoData: [],

            //D、数据测量/现场测试table数据
            gaugeData: [],

            //E、外观及工艺table数据
            exteriorData: [],    

            //F、客户特殊要求table数据
            specialData: [],

            //G、附录table数据
            appendixData: [],

            //报告批核table数据
            approvalData: [],

            //数据集合configs
            configs: [],
            id: this.$route.query.id

            
        }
    },
    created(){
        this.getInspectionReportData(this.$route.query.id)
    },
    methods:{
        //获取网页报告预览页面数据
        getInspectionReportData(urlValue){
            getReportSelf(urlValue).then(response => {
                if(response.data.code == 0){
                    // console.log(response.data.data.review)
                    //接收数据测量数据
                    this.gaugeData = response.data.data.review.data_measurement
                    // console.log(this.gaugeData)

                    //接收附录数据
                    this.appendixData = response.data.data.review.appendix

                    //接收基础信息数据
                    this.baseInfoData = response.data.data.review.general_information

                    //接收检验结论数据
                    this.conclusionData = response.data.data.review.inspection_results
                    // console.log(response.data.data.review)

                    //接收标识，备注数据
                    this.packageLogoData = response.data.data.review.packing_and_marking

                    //接收产品符合性数据
                    this.goodsInfoData = response.data.data.review.product_conformity

                    //接收数量符合性数据
                    this.QuantityData = response.data.data.review.quantity_conformity
                    console.log(this.QuantityData.files)

                    //接收特殊要求数据
                    this.specialData = response.data.data.review.special_attention

                    //接收外观及工艺数据
                    this.exteriorData = response.data.data.review.visual_and_workmanship

                    //接收操作人员数据
                    this.approvalData = response.data.data.review.operator
                    
                    //接收configs数据
                    this.configs = response.data.configs
                    this.jundgeB(this.packageLogoData.packing.products,this.packageLogoData.marking.products)
                    this.jundgeC(this.goodsInfoData.products)
                    this.jundgeD(this.gaugeData.checkitems)
                    this.jundgeF(this.specialData.products)
                }
            })
            // console.log(this.$route.params.accountApi)
        },

        //根据获取不同的值改变给予不同的class名
        addClass(value){
            if(value == 1){
                return 'conslusionAccord';
            }else if(value == 2){
                return  'conslusionUnAccord';
            }else if(value == 3){
                return 'indeterminate'
            }else if(value == 4){
                return 'inadequacy'
            }else if(value == 5){
                return 'emptying'
            }else if(value == '符合'){
                return 'conslusionAccord';
            }else if(value == '不符合'){
                return  'conslusionUnAccord';
            }
        },
        back(){
            this.$router.go(-1)
        },
        // 判断包装/标识/标签
        jundgeB(Array1,Array2){
            let Array = [...Array1,...Array2]
            if(Array.findIndex(t=>t.conclusion==2)!=-1){
                this.ClonebStatu = 1
                return false
            }else if(Array.findIndex(t=>t.conclusion==3)!=-1){
                this.ClonebStatu = 2
                return false
            }else{
                this.ClonebStatu = 3
                return  false
            }
        },
        // 判断产品符合性
        jundgeC(Array){
            console.log(Array)
            if(Array.findIndex(t=>t.conclusion==2)!=-1){
                this.CloneCStatu = 1
                return false
            }else if(Array.findIndex(t=>t.conclusion==3)!=-1){
                this.CloneCStatu = 2
                return false
            }else{
                this.CloneCStatu = 3
                return  false
            }
        },
        // 判断数据测量
        jundgeD(Array){
            if(Array.findIndex(t=>t.conclusion==2)!=-1){
                this.CloneDStatu = 1
                return false
            }else if(Array.findIndex(t=>t.conclusion==3)!=-1){
                this.CloneDStatu = 2
                return false
            }else{
                this.CloneDStatu = 3
                return  false
            }
        },
        // 判断特别注意点
        jundgeF(Array){
            if(Array.findIndex(t=>t.conclusion==2)!=-1){
                this.CloneFStatu = 1
                return false
            }else if(Array.findIndex(t=>t.conclusion==3)!=-1){
                this.CloneFStatu = 2
                return false
            }else{
                this.CloneFStatu = 3
                return  false
            }
        },
        reportsubmit(){
            reportsubmit(this.id, this.configs).then(res => {
                if (res.data.code == 0) {

                }
            })
        },
        sum(Array,key){
            return this._.sum(this._.map(Array, key))
        }

    },
    // beforeRouteLeave(to, from, next) {
    //          // 设置下一个路由的 meta
    //         to.meta.keepAlive = true;  // 让 A 缓存，即不刷新
    //         next();
    //     }
}
</script>


<style rel="stylesheet/scss" lang="scss" scoped>
//普通样式
.inspectionReport{
    margin:32px 40px 161px ;
    width:1540px;
    min-width:1420px;
    background:rgba(255,255,255,1);
    .inspectionReport-interface{
        padding:0 40px;
        .Report-interface-baseInfo{
            margin-bottom:41px;
            ul{
                height:116px;
                line-height: 52px;
                padding:32px 0;
                // text-align: center;
                margin-bottom:8px;
                li:nth-child(1){
                    float:left;
                    margin-top:11px;
                    a{
                        float:left;
                        width:195px;
                        height:30px;
                        line-height: 30px;
                        img{
                            width:100%;
                            height:100%;
                        }
                    }
                }
                li:nth-child(2){
                    float:left;
                    height:52px;
                    font-size:32px;
                    color:rgba(51,51,51,1);
                    line-height:52px;
                    margin-left:438px;
                }
                li:nth-child(3){
                    float:right;
                    width:160px;
                    height:50px;
                    line-height: 50px;
                    background:rgba(144,147,153,0.1);
                    border-radius:4px;
                    border:1px solid rgba(144,147,153,1);
                    text-align: center;
                    cursor: pointer;
                    font-size:16px;
                    font-family:MicrosoftYaHei;
                    color:rgba(144,147,153,1);
                }
            }
            p{
                height:47px;
                font-size:18px;
                color:rgba(80,104,140,1);
                border-bottom:2px solid rgba(255,168,0,1);
                margin-bottom:25px;
            }
            .interface-baseInfo-table{
                width:1460px;
                background:rgba(255,255,255,1);
                border-radius:4px;
                border:1px solid rgba(215,220,227,1);
                border-right:none;
                border-collapse: collapse;
                overflow: hidden;
                .baseInfo-element-table{
                    float:left;
                    tr{
                        border-bottom:1px solid rgba(215,220,227,1);
                        height:60px;
                        line-height: 60px;
                        td{
                            border-right:1px solid rgba(215,220,227,1);
                        }
                        td:nth-child(3){
                            width:600px;
                            text-align: center;
                        }
                    }
                    tr:last-child{
                    border-bottom:none; 
                    }
                    tr td:nth-child(1){
                        // display:inline-block;
                        background:rgba(127,143,164,1);
                        text-align: center;
                        font-size:14px;
                        width:240px;
                        color:rgba(255,255,255,1);
                    }
                    tr td:nth-child(2){
                        width:618px;
                        line-height: 60px;
                        font-size:14px;
                        color:rgba(80,104,140,1);
                        padding-left:32px;
                    }
                    tr:nth-child(9){
                        td:nth-child(2){
                            span{
                               margin-right:16px; 
                            }
                            // span:nth-child(1){
                            //     margin-right:16px;
                            // }
                            // span:nth-child(2){
                            //     margin-right:16px;
                            // }
                        }
                    }
                }
                .baseInfo-table-img{
                    float:left;
                    width:599px;
                    height:732px;
                    border-right:1px solid rgba(215,220,227,1);
                    padding:37px 40px 49px;
                    border-top-right-radius:4px;
                    border-bottom-right-radius:4px;
                    overflow: hidden;
                    // background:#ccc;
                    img{
                        width:100%;
                        height:100%;
                    }
                }
            }
        }
        .Report-interface-conclusion{
            // height:1118px;
            margin-bottom:40px;
            P:nth-child(1){
                height:47px;
                font-size:18px;
                color:rgba(80,104,140,1);
                border-bottom:2px solid rgba(255,168,0,1);
                margin-bottom:25px;
                vertical-align: top;
                margin-bottom:24px;
            }
            p:nth-child(2){
                width:1460px;
                height:48px;
                background:rgba(245,248,250,1);
                border-radius:4px;
                border:1px solid rgba(215,220,227,1);
                margin-bottom:24px;
                span{
                    float:left;
                    text-align: center;
                    line-height: 48px;
                    height:46px;
                }
                span:nth-child(1){
                    width:730px;
                    font-size:16px;
                    font-family:MicrosoftYaHei;
                    color:rgba(80,104,140,1);
                }
                span:nth-child(2){
                    width:728px;
                    border-left:1px solid rgba(215,220,227,1);
                    font-size:16px;
                    color:rgba(103,194,58,1);
                }
            }
            .conclusion-tableA{
                width:1460px;
                height:308px;
                background:rgba(255,255,255,1);
                border:1px solid rgba(215,220,227,1);
                border-radius:4px;
                overflow: hidden;
                border-collapse: collapse;
                margin-bottom:24px;
                .conclusion-element-tableA{
                    tr{
                        height:40px;
                        line-height:40px;
                        border-bottom:1px solid rgba(215,220,227,1);
                        td{
                            border-left:1px solid rgba(215,220,227,1);
                        }
                        td:nth-child(1){
                            border-left:none;
                        }
                    }
                    tr:nth-child(1){
                        height:60px;
                        border-bottom:1px solid rgba(215,220,227,1);
                        line-height: 60px;
                        td:nth-child(1){
                            width:270px;
                            background:rgba(127,143,164,1);
                            font-size:14px;
                            color:rgba(255,255,255,1);
                            text-align: center;
                        }
                        td:nth-child(2){
                            border-left:1px solid rgba(215,220,227,1);
                            font-size:14px;
                            color:rgba(125,200,85,1);
                            text-align: center;
                        }
                    }
                    tr:nth-child(2){
                        td{
                            font-size:14px;
                            color:rgba(80,104,140,1);
                            text-align: center;
                            vertical-align: middle;
                        }
                        td:nth-child(1){
                            width:270px;
                            background:rgba(127,143,164,1);
                            font-size:14px;
                            color:rgba(255,255,255,1);
                            text-align: center;
                            vertical-align: middle;
                        }
                        td:nth-child(2){
                            font-size:16px;
                            color:rgba(80,104,140,1);
                            text-align: center;
                            vertical-align: middle;
                        }
                    }
                    tr:nth-child(3),tr:nth-child(4){
                        td{
                            font-size:14px;
                            color:rgba(80,104,140,1);
                            text-align: center;
                            vertical-align: middle;
                        }
                    }
                    tr:nth-child(5){
                        td{
                            font-size:14px;
                            color:rgba(80,104,140,1);
                            text-align: center;
                            vertical-align: middle;
                        }
                        td:nth-child(1){
                            width:270px;
                            background:rgba(127,143,164,1);
                            font-size:14px;
                            color:rgba(255,255,255,1);
                            text-align: center;
                            vertical-align: middle;
                        }
                        td:nth-child(2){
                            text-align: center;
                            vertical-align: middle;
                            font-size:16px;
                            color:rgba(80,104,140,1);
                        }
                    }
                    tr:nth-child(6){
                        td{
                            font-size:16px;
                            color:rgba(80,104,140,1);
                            text-align: center;
                            vertical-align: middle;
                        }
                    }
                    tr:last-child{
                       border-bottom:none;
                       td:nth-child(1){
                           font-size:16px;
                           color:rgba(80,104,140,1);
                           text-align: center;
                           vertical-align: middle;
                       }
                       td:nth-child(2){
                           font-size:16px;
                           color:rgba(80,104,140,1);
                           padding-left:24px;
                       } 
                    }
                }
            }
            .conclusion-tableB{
                width:1460px;
                // height:306px;
                background:rgba(255,255,255,1);
                border-radius:4px;
                border:1px solid rgba(215,220,227,1);
                overflow: hidden;
                border-collapse: collapse;
                margin-bottom:24px;
                
                .conclusion-element-tableB{
                    .wrongText{
                        color:#EF3535;
                    }
                    .trueText{
                        color:#7DC855;
                    }
                    tr{
                        border-bottom:1px solid rgba(215,220,227,1);
                        td{
                            border-left:1px solid rgba(215,220,227,1);
                            font-size:14px;
                            color:rgba(22,64,97,1);
                            vertical-align: middle;
                            text-align: center;
                        }
                        td:nth-child(1){
                            border-left:none;
                            background:rgba(127,143,164,1);
                            color:rgba(255,255,255,1);
                        }
                        td:nth-child(2){
                            // color:rgba(239,53,53,1);
                            // color:rgba(125,200,85,1);
                        }
                    }
                    tr:last-child{
                        border-bottom:none;
                    }
                }
            }
            .conclusion-remark{
                height:26px;
                font-size:18px;
                color:rgba(80,104,140,1);
                line-height:26px;
                margin-bottom:16px;
            }
            .conclusion-remark-table{
                width:1460px;
                // height:268px;
                border-radius:4px;
                border:1px solid rgba(215,220,227,1);
                overflow: hidden;
                border-collapse: collapse;
                table{
                    tr{
                        border-bottom:1px solid rgba(215,220,227,1);
                        td{
                           border-left:1px solid rgba(215,220,227,1);
                           vertical-align: middle;
                           font-size:16px;
                        }
                        td:nth-child(1){
                            border-left:none;
                            color:rgba(255,255,255,1);
                            background:rgba(127,143,164,1);
                            text-align: center; 
                        }
                        td:nth-child(2){
                            color:rgba(80,104,140,1);
                            padding-left:32px;
                        }
                    }
                    tr:last-child{
                        border-bottom:none;
                    }
                }
            }
        }
        .Report-interface-Quantity{
            // height:982px;
            margin-bottom:44px;
            .Quantity-p1{
                height:47px;
                font-size:18px;
                color:rgba(80,104,140,1);
                border-bottom:2px solid rgba(255,168,0,1);
                margin-bottom:25px;
                vertical-align: top;
                margin-bottom:24px;
            }
            .Quantity-p2{
                width:1460px;
                height:48px;
                background:rgba(245,248,250,1);
                border-radius:4px;
                border:1px solid rgba(215,220,227,1);
                margin-bottom:24px;
                span{
                    float:left;
                    text-align: center;
                    line-height: 48px;
                    height:46px;
                }
                span:nth-child(1){
                    width:730px;
                    font-size:16px;
                    font-family:MicrosoftYaHei;
                    color:rgba(80,104,140,1);
                }
                span:nth-child(2){
                    width:728px;
                    border-left:1px solid rgba(215,220,227,1);
                    font-size:16px;
                    color:rgba(103,194,58,1);
                    // color:rgba(239,53,53,1);
                }
            }
            .interface-Quantity-table{
                width:1460px;
                background:rgba(255,255,255,1);
                border-radius:4px;
                border:1px solid rgba(215,220,227,1);
                overflow: hidden;
                border-collapse: collapse;
                margin-bottom:24px;
                table{
                    tr{
                       border-bottom:1px solid rgba(215,220,227,1);
                       td{
                           border-left:1px solid rgba(215,220,227,1);
                           text-align: center;
                           vertical-align: middle;
                           font-size:14px;
                           color:rgba(80,104,140,1);
                       }
                       td:nth-child(1){
                           border-left:none;
                       }
                    }
                    tr:nth-child(1){
                        background:rgba(127,143,164,1);
                        td{
                            font-size:14px;
                            color:rgba(255,255,255,1);
                        }
                    }
                    tr:nth-child(2){
                        background:rgba(127,143,164,1);
                        td{
                           font-size:14px;
                           color:rgba(255,255,255,1); 
                        }
                    }
                    tr:last-child{
                        border-bottom:none;
                        td:nth-child(1){
                            font-size:16px;
                            color:rgba(80,104,140,1);
                            text-align: right;
                            padding-right:32px;
                        }
                    }
                }
            }
            .Quantity-p3{
                height:21px;
                font-size:16px;
                color:rgba(80,104,140,1);
                line-height:21px;
                margin-bottom:24px;
                span:nth-child(1){
                    margin-right:24px;
                }
            }
            .Quantity-p4{
                padding:20px 16px 27px;
                width:1460px;
                border-radius:4px;
                border:1px solid rgba(215,220,227,1);
                font-size:14px;
                color:rgba(80,104,140,1);
                vertical-align: middle;
                margin-bottom:24px;
            }
            .interface-Quantity-remark{
                margin-bottom:24px;
                p{
                    float:left;
                }
                p:nth-child(1){
                    width:36px;
                    margin-right:16px;
                    font-size:16px;
                    color:rgba(80,104,140,1);
                    padding:18px 0 0 0;
                }
                p:nth-child(2){
                    width:1408px;
                    border-radius:4px;
                    border:1px solid rgba(215,220,227,1);
                    padding:15px 24px;
                    font-size:14px;
                    color:rgba(80,104,140,1);
                    vertical-align: middle;
                }
            }
            .interface-Quantity-images{
                div{
                    float:left;
                }
                div:nth-child(1){
                    font-size:16px;
                    color:rgba(80,104,140,1);
                    padding:15px 0 0 0;
                    margin-right:16px;
                }
                div:nth-child(2){
                    width:1408px;
                    word-wrap: break-word;
                    word-break: normal;
                    p{
                        width:624px;
                        height:468px;
                        position:relative;
                        float:left;
                        margin:0 24px 24px 0;
                        img{
                            width:100%;
                            height:100%;
                        }
                        span{
                            display: block;
                            width:100%;
                            height:40px;
                            font-size:14px;
                            color:rgba(22,64,97,1);
                            position:absolute;
                            left:0;
                            bottom:0;
                            background:rgba(255,255,255,0.2);
                            text-align: center;
                            line-height: 40px;
                        }
                    }
                }
            }
        }
        .Report-interface-packageLogo{
            // height:2357px;
            margin-bottom:45px;
            .packageLogo-p1{
                height:47px;
                font-size:18px;
                font-family:MicrosoftYaHei;
                color:rgba(80,104,140,1);
                border-bottom:2px solid rgba(255,168,0,1);
                margin-bottom:25px;
                vertical-align: top;
                margin-bottom:24px;
            }
            .packageLogo-p2{
                height:26px;
                font-size:16px;
                font-family:MicrosoftYaHei;
                color:rgba(255,168,0,1);
                line-height:26px;
                margin-bottom:24px;
            }
            .packageLogo-packageInfo1{
                width:1460px;
                // height:812px;
                border-radius:8px;
                border:1px solid rgba(194,194,194,1);
                padding:24px 40px;
                margin-bottom:24px;
                .packageInfo1-p1{
                    height:21px;
                    font-size:16px;
                    font-family:MicrosoftYaHei;
                    color:rgba(80,104,140,1);
                    line-height:21px;
                    margin-bottom:24px;
                }
                .packageInfo1-p2{
                    width:1380px;
                    height:48px;
                    background:rgba(245,248,250,1);
                    border-radius:5px;
                    border:1px solid rgba(215,220,227,1);
                    margin-bottom:24px;
                    span{
                        float:left;
                    }
                    span:nth-child(1){
                        width:689px;
                        height:46px;
                        font-size:16px;
                        color:rgba(80,104,140,1);
                        text-align: center;
                        line-height: 46px;
                        border-right:1px solid rgba(215,220,227,1);
                    }
                    span:nth-child(2){
                        width:689px;
                        height:46px;
                        font-size:16px;
                        color:rgba(103,194,58,1);
                        // color:rgba(239,53,53,1);
                        text-align: center;
                        line-height: 46px;
                    }
                }
                .packageInfo1-table{
                    width:1380px;
                    height:297px;
                    background:rgba(255,255,255,1);
                    border-radius:4px;
                    border:1px solid rgba(215,220,227,1);
                    overflow: hidden;
                    border-collapse: collapse;
                    margin-bottom:24px;
                    table{
                        tr{
                            border-bottom:1px solid rgba(215,220,227,1);
                            td{
                                border-left:1px solid rgba(215,220,227,1);
                                vertical-align: middle;
                                text-align: center;
                                font-size:14px;
                                color:rgba(80,104,140,1);
                            }
                            td:nth-child(1){
                                border:none;
                            }
                        }
                        tr:nth-child(1){
                            background:rgba(127,143,164,1);
                            td{
                                color:rgba(255,255,255,1);
                            }
                        }
                        tr:nth-child(2){
                            td:nth-child(3){
                                border:none;
                                text-align: left;
                            }
                        }
                        tr:nth-child(3){
                            td:nth-child(3){
                                border:none;
                                text-align: left;
                            }
                            td:nth-child(4){
                                border:none;
                                text-align: left;
                            }
                        }
                        tr:nth-child(4){
                            border-bottom:none;
                            td:nth-child(3){
                                border:none;
                                text-align: left;
                            }
                            td:nth-child(4){
                                border:none;
                                text-align: left;
                            }
                        }
                        tr:last-child{
                            border-bottom:none;
                            td:nth-child(3){
                                border:none;
                                text-align: left;
                            }
                            td:nth-child(4){
                                border:none;
                                text-align: left;
                            }
                        }
                    }
                }
                .packageInfo1-remark{
                    margin-bottom:24px;
                    p{
                        float:left;
                    }
                    p:nth-child(1){
                        width:36px;
                        margin-right:22px;
                        font-size:16px;
                        color:rgba(80,104,140,1);
                        padding:18px 0 0 0;
                    }
                    p:nth-child(2){
                        width:1320px;
                        border-radius:4px;
                        border:1px solid rgba(215,220,227,1);
                        padding:15px 24px;
                        font-size:14px;
                        color:rgba(80,104,140,1);
                        vertical-align: middle;
                    }
                }
                .packageInfo1-picture{
                    div{
                        float:left;
                    }
                    div:nth-child(1){
                        font-size:16px;
                        color:rgba(80,104,140,1);
                        padding:15px 0 0 0;
                        margin-right:22px;
                    }
                    div:nth-child(2){
                        width:1320px;
                        word-wrap: break-word;
                        word-break: normal;
                        p{
                            width:624px;
                            height:468px;
                            position:relative;
                            float:left;
                            margin:0 24px 24px 0;
                            img{
                                width:100%;
                                height:100%;
                            }
                            span{
                                display: block;
                                width:100%;
                                height:40px;
                                font-size:14px;
                                color:rgba(22,64,97,1);
                                position:absolute;
                                left:0;
                                bottom:0;
                                background:rgba(255,255,255,0.2);
                                text-align: center;
                                line-height: 40px;
                            }
                        }
                    }
                }
            }
            .packageLogo-p3{
                height:46px;
                font-size:16px;
                color:rgba(255,168,0,1);
                line-height:26px;
                margin:0 0 24px;
                padding-top:20px;
            }
            .packageLogo-identify{
                width:1460px;
                // height:492px;
                border-radius:8px;
                border:1px solid rgba(194,194,194,1);
                padding:24px 40px;
                margin-bottom:24px;
                .identify-p1{
                    height:21px;
                    font-size:16px;
                    color:rgba(80,104,140,1);
                    line-height:21px;
                    margin-bottom:24px;
                }
                .identify-p2{
                    width:1380px;
                    height:48px;
                    background:rgba(245,248,250,1);
                    border-radius:5px;
                    border:1px solid rgba(215,220,227,1);
                    margin-bottom:24px;
                    span{
                        float:left;
                    }
                    span:nth-child(1){
                        width:689px;
                        height:46px;
                        font-size:16px;
                        color:rgba(80,104,140,1);
                        text-align: center;
                        line-height: 46px;
                        border-right:1px solid rgba(215,220,227,1);
                    }
                    span:nth-child(2){
                        width:689px;
                        height:46px;
                        font-size:16px;
                        color:rgba(103,194,58,1);
                        // color:rgba(239,53,53,1);
                        text-align: center;
                        line-height: 46px;
                    }
                }
                .identify-remark{
                    margin-bottom:24px;
                    p{
                        float:left;
                    }
                    p:nth-child(1){
                        width:36px;
                        margin-right:22px;
                        font-size:16px;
                        color:rgba(80,104,140,1);
                        padding:18px 0 0 0;
                    }
                    p:nth-child(2){
                        width:1320px;
                        border-radius:4px;
                        border:1px solid rgba(215,220,227,1);
                        padding:15px 24px;
                        font-size:14px;
                        color:rgba(80,104,140,1);
                        vertical-align: middle;
                    }
                }
                .identify-images{
                    div{
                        float:left;
                    }
                    div:nth-child(1){
                        font-size:16px;
                        color:rgba(80,104,140,1);
                        padding:15px 0 0 0;
                        margin-right:22px;
                    }
                    div:nth-child(2){
                        width:1320px;
                        word-wrap: break-word;
                        word-break: normal;
                        p{
                            width:624px;
                            height:468px;
                            position:relative;
                            float:left;
                            margin:0 24px 24px 0;
                            img{
                                width:100%;
                                height:100%;
                            }
                            span{
                                display: block;
                                width:100%;
                                height:40px;
                                font-size:14px;
                                color:rgba(22,64,97,1);
                                position:absolute;
                                left:0;
                                bottom:0;
                                background:rgba(255,255,255,0.2);
                                text-align: center;
                                line-height: 40px;
                            }
                        }
                    }
                }
            }
        }
        .Report-interface-goodsInfo{
            margin-bottom:40px;
            .goodsInfo-p1{
                height:47px;
                font-size:18px;
                font-family:MicrosoftYaHei;
                color:rgba(80,104,140,1);
                border-bottom:2px solid rgba(255,168,0,1);
                margin-bottom:25px;
                vertical-align: top;
                margin-bottom:24px;
            }
            .goodsInfo-p2{
                height:26px;
                font-size:16px;
                font-family:MicrosoftYaHei;
                color:rgba(255,168,0,1);
                line-height:26px;
                margin-bottom:24px;
            }
            .goodsInfo-detail{
                width:1460px;
                // height:492px;
                border-radius:8px;
                border:1px solid rgba(194,194,194,1);
                padding:24px 40px;
                margin-bottom:24px;
                .detail-p1{
                    height:21px;
                    font-size:16px;
                    font-family:MicrosoftYaHei;
                    color:rgba(80,104,140,1);
                    line-height:21px;
                    margin-bottom:24px;
                }
                .detail-p2{
                    width:1380px;
                    height:48px;
                    background:rgba(245,248,250,1);
                    border-radius:5px;
                    border:1px solid rgba(215,220,227,1);
                    margin-bottom:24px;
                    span{
                        float:left;
                    }
                    span:nth-child(1){
                        width:689px;
                        height:46px;
                        font-size:16px;
                        color:rgba(80,104,140,1);
                        text-align: center;
                        line-height: 46px;
                        border-right:1px solid rgba(215,220,227,1);
                    }
                    span:nth-child(2){
                        width:689px;
                        height:46px;
                        font-size:16px;
                        color:rgba(103,194,58,1);
                        // color:rgba(239,53,53,1);
                        text-align: center;
                        line-height: 46px;
                    }
                }
                 .detail-remark{
                    margin-bottom:24px;
                    p{
                        float:left;
                    }
                    p:nth-child(1){
                        width:36px;
                        margin-right:22px;
                        font-size:16px;
                        color:rgba(80,104,140,1);
                        padding:18px 0 0 0;
                    }
                    p:nth-child(2){
                        width:1320px;
                        border-radius:4px;
                        border:1px solid rgba(215,220,227,1);
                        padding:15px 24px;
                        font-size:14px;
                        color:rgba(80,104,140,1);
                        vertical-align: middle;
                    }
                }
                .detail-images{
                    div{
                        float:left;
                    }
                    div:nth-child(1){
                        font-size:16px;
                        color:rgba(80,104,140,1);
                        padding:15px 0 0 0;
                        margin-right:22px;
                    }
                    div:nth-child(2){
                        width:1320px;
                        word-wrap: break-word;
                        word-break: normal;
                        p{
                            width:624px;
                            height:468px;
                            position:relative;
                            float:left;
                            margin:0 24px 24px 0;
                            img{
                                width:100%;
                                height:100%;
                            }
                            span{
                                display: block;
                                width:100%;
                                height:40px;
                                font-size:14px;
                                color:rgba(22,64,97,1);
                                position:absolute;
                                left:0;
                                bottom:0;
                                background:rgba(255,255,255,0.2);
                                text-align: center;
                                line-height: 40px;
                            }
                        }
                    }      
                }
            }
        }
        .Report-interface-gauge{
            margin-bottom:40px;
            .gauge-p1{
                height:47px;
                font-size:18px;
                font-family:MicrosoftYaHei;
                color:rgba(80,104,140,1);
                border-bottom:2px solid rgba(255,168,0,1);
                margin-bottom:25px;
                vertical-align: top;
                margin-bottom:24px; 
            }
            .gauge-table{
                width:1460px;
                background:rgba(255,255,255,1);
                border-radius:4px;
                border:1px solid rgba(215,220,227,1);
                overflow: hidden;
                border-collapse: collapse;
                margin-bottom:24px;
                table{
                    tr{
                        border-bottom:1px solid rgba(215,220,227,1);
                        td{
                            border-left:1px solid rgba(215,220,227,1);
                            text-align: center;
                            vertical-align: middle;
                            font-size:12px;
                            color:rgba(80,104,140,1);
                            padding:0 16px;
                        }
                        td:nth-child(1){
                            border-left:none;
                        }
                        td:last-child{
                            font-size:14px;
                        }
                    }
                    tr:nth-child(1){
                        background:rgba(127,143,164,1);
                        td{
                            font-size:14px;
                            color:rgba(255,255,255,1);
                        }
                    }
                    tr:last-child{
                        border-bottom:none;
                    }
                }
            }
            .gauge-remark{
                margin-bottom:24px;
                    p{
                        float:left;
                    }
                    p:nth-child(1){
                        width:36px;
                        margin-right:21px;
                        font-size:16px;
                        color:rgba(80,104,140,1);
                        padding:18px 0 0 0;
                    }
                    p:nth-child(2){
                        width:1403px;
                        border-radius:4px;
                        border:1px solid rgba(215,220,227,1);
                        padding:15px 24px;
                        font-size:14px;
                        color:rgba(80,104,140,1);
                        vertical-align: middle;
                    }        
            }
            .gauge-images{
                div{
                    float:left;
                }
                div:nth-child(1){
                    font-size:16px;
                    color:rgba(80,104,140,1);
                    padding:15px 0 0 0;
                    margin-right:21px;
                }
                div:nth-child(2){
                    width:1403px;
                    word-wrap: break-word;
                    word-break: normal;
                    p{
                        width:624px;
                        height:468px;
                        position:relative;
                        float:left;
                        margin:0 24px 24px 0;
                        img{
                            width:100%;
                            height:100%;
                        }
                        span{
                            display: block;
                            width:100%;
                            height:40px;
                            font-size:14px;
                            color:rgba(22,64,97,1);
                            position:absolute;
                            left:0;
                            bottom:0;
                            background:rgba(255,255,255,0.2);
                            text-align: center;
                            line-height: 40px;
                        }
                    }
                }
            }
        }
        .Report-interface-exterior{
            margin-bottom:44px;
            .exterior-p1{
                height:47px;
                font-size:18px;
                font-family:MicrosoftYaHei;
                color:rgba(80,104,140,1);
                border-bottom:2px solid rgba(255,168,0,1);
                margin-bottom:25px;
                vertical-align: top;
                margin-bottom:24px;
            }
            .exterior-table{
                width:1460px;
                // height:429px;
                border-radius:4px;
                // border:1px solid rgba(215,220,227,1);
                overflow: hidden;
                border-collapse: collapse;
                margin-bottom:32px;
                table{
                    tr{
                        border-bottom:1px solid rgba(215,220,227,1);
                        td{
                            border-left:1px solid rgba(215,220,227,1);
                            text-align: center;
                            vertical-align: middle;
                            font-size:14px;
                            color:rgba(80,104,140,1);
                        }
                        td:nth-child(1){
                            border-left:none;
                            background:rgba(127,143,164,1);
                            color:rgba(255,255,255,1);
                        }
                    }
                    tr:last-child{
                        border-bottom:none;
                    }
                }
            }
            .exterior-detail{
                margin-bottom:24px;
                    .exterior-detail-p{
                        height:21px;
                        line-height: 21px;
                        margin-bottom:22px;
                        span{
                            font-size:16px;
                            color:rgba(80,104,140,1);
                        }
                        span:nth-child(1){
                            margin-right:16px;
                        }
                    }
                    .exterior-detail-div{
                        width:1460px;
                        // height:121px;
                        background:rgba(255,255,255,1);
                        border-radius:4px;
                        border:1px solid rgba(215,220,227,1);
                        overflow: hidden;
                        border-collapse: collapse;
                        margin-bottom:24px;
                        table{
                            tr{
                                border-bottom:1px solid rgba(215,220,227,1);
                                td{
                                    border-left:1px solid rgba(215,220,227,1);
                                    text-align: center;
                                    vertical-align: middle;
                                    font-size:14px;
                                    color:rgba(80,104,140,1);
                                }
                                td:nth-child(1){
                                    border-left:none;
                                }
                            }
                            tr:nth-child(1){
                                background:rgba(127,143,164,1);
                                td{
                                    color:rgba(255,255,255,1);
                                }
                            }
                            tr:last-child{
                                border-bottom:none;
                            }
                        }
                    }
                    .exterior-remark{
                        margin-bottom:24px;
                    p{
                        float:left;
                    }
                    p:nth-child(1){
                        width:36px;
                        margin-right:21px;
                        font-size:16px;
                        color:rgba(80,104,140,1);
                        padding:18px 0 0 0;
                    }
                    p:nth-child(2){
                        width:1403px;
                        border-radius:4px;
                        border:1px solid rgba(215,220,227,1);
                        padding:15px 24px;
                        font-size:14px;
                        color:rgba(80,104,140,1);
                        vertical-align: middle;
                    }  
                }
                .exterior-images{
                    div{
                        float:left;
                    }
                    div:nth-child(1){
                        font-size:16px;
                        color:rgba(80,104,140,1);
                        padding:15px 0 0 0;
                        margin-right:21px;
                    }
                    div:nth-child(2){
                        width:1403px;
                        word-wrap: break-word;
                        word-break: normal;
                        p{
                            width:624px;
                            height:468px;
                            position:relative;
                            float:left;
                            margin:0 24px 24px 0;
                            img{
                                width:100%;
                                height:100%;
                            }
                            span{
                                display: block;
                                width:100%;
                                height:40px;
                                font-size:14px;
                                color:rgba(22,64,97,1);
                                position:absolute;
                                left:0;
                                bottom:0;
                                background:rgba(255,255,255,0.2);
                                text-align: center;
                                line-height: 40px;
                            }
                        }
                    }
                }
            }
            
        }
        .Report-interface-special{
            margin-bottom:56px;
            .special-p1{
                height:47px;
                font-size:18px;
                font-family:MicrosoftYaHei;
                color:rgba(80,104,140,1);
                border-bottom:2px solid rgba(255,168,0,1);
                margin-bottom:25px;
                vertical-align: top;
                margin-bottom:24px;
            }
            .special-detail{
                margin-bottom:24px;
                padding:24px 40px 32px;
                width:1460px;
                border-radius:8px;
                border:1px solid rgba(194,194,194,1);
                .special-detail-p1{
                    height:21px;
                    font-size:16px;
                    color:rgba(80,104,140,1);
                    line-height:21px;
                    margin-bottom:24px;
                }
                .special-detail-p2{
                    width:1380px;
                    height:48px;
                    background:rgba(245,248,250,1);
                    border-radius:5px;
                    border:1px solid rgba(215,220,227,1);
                    margin-bottom:24px;
                    span{
                        float:left;
                        text-align: center;
                        line-height: 48px;
                        height:46px;
                    }
                    span:nth-child(1){
                        width:689px;
                        border-right:1px solid rgba(215,220,227,1);
                        font-size:16px;
                        color:rgba(80,104,140,1);
                    }
                    span:nth-child(2){
                        width:689px;
                        font-size:16px;
                        color:rgba(103,194,58,1);
                    }
                }
                .special-detail-remark{
                    margin-bottom:24px;
                    p{
                        float:left;
                    }
                    p:nth-child(1){
                        width:36px;
                        margin-right:21px;
                        font-size:16px;
                        color:rgba(80,104,140,1);
                        padding:18px 0 0 0;
                    }
                    p:nth-child(2){
                        width:1320px;
                        border-radius:4px;
                        border:1px solid rgba(215,220,227,1);
                        padding:15px 24px;
                        font-size:14px;
                        color:rgba(80,104,140,1);
                        vertical-align: middle;
                    }
                }
                .special-detail-images{
                    div{
                        float:left;
                    }
                    div:nth-child(1){
                        font-size:16px;
                        color:rgba(80,104,140,1);
                        padding:15px 0 0 0;
                        margin-right:21px;
                    }
                    div:nth-child(2){
                        width:1320px;
                        word-wrap: break-word;
                        word-break: normal;
                        p{
                            width:624px;
                            height:468px;
                            position:relative;
                            float:left;
                            margin:0 24px 24px 0;
                            img{
                                width:100%;
                                height:100%;
                            }
                            span{
                                display: block;
                                width:100%;
                                height:40px;
                                font-size:14px;
                                color:rgba(22,64,97,1);
                                position:absolute;
                                left:0;
                                bottom:0;
                                background:rgba(255,255,255,0.2);
                                text-align: center;
                                line-height: 40px;
                            }
                        }
                    }
                }
            }
        }
        .Report-interface-appendix{
            padding-bottom:60px;
            .appendix-p1{
                height:47px;
                font-size:18px;
                font-family:MicrosoftYaHei;
                color:rgba(80,104,140,1);
                border-bottom:2px solid rgba(255,168,0,1);
                margin-bottom:25px;
                vertical-align: top;
                margin-bottom:24px;
            }
            .appendix-p2{
                height:26px;
                line-height:26px;
                margin-bottom:24px;
                span{
                    font-size:16px;
                    color:rgba(255,168,0,1);
                }
                span:nth-child(1){
                    margin-right:16px;
                }
            }
            .appendix-sample{
                margin-bottom:32px;
                .appendix-sample-p1{
                    height:21px;
                    font-size:16px;
                    color:rgba(80,104,140,1);
                    line-height:21px;
                    margin-bottom:24px;
                }
                .appendix-sampl-table{
                    width:1460px;
                    // height:618px;
                    background:rgba(255,255,255,1);
                    border-radius:4px;
                    border:1px solid rgba(215,220,227,1);
                    overflow: hidden;
                    .appendix-sampl-table-top{
                        height:343px;
                        border-bottom:1px solid rgba(215,220,227,1);
                        div{
                            float:left;
                        }
                        .appendix-sampl-table-top-left{
                            width:620px;
                            height:100%;
                            border-right:1px solid rgba(215,220,227,1);
                            p{
                                width:100%;
                                height:21px;
                                margin-bottom:16px;
                                span{
                                    font-size:14px;
                                    color:rgba(80,104,140,1);
                                    float:left;
                                }
                                span:nth-child(1){
                                    width:100px;
                                    text-align: right;
                                }
                                span:nth-child(2){
                                    padding-left:24px;
                                }
                            }
                            p:nth-child(1){
                                width:100%;
                                height:60px;
                                background:rgba(127,143,164,1);
                                line-height: 60px;
                                text-align: center;
                                font-size:14px;
                                color:rgba(255,255,255,1);
                                margin-bottom:24px;
                            }
                            p:nth-child(6){
                                // height:42px;
                                
                                span:nth-child(2){
                                    width:384px;
                                }
                            }
                            p:nth-child(7){
                                height:53px;
                                margin-bottom:0;
                            }
                        }
                        .appendix-sampl-table-top-right{
                            width:838px;
                            height:100%;
                            p{
                                width:100%;
                                height:21px;
                                margin-bottom:16px;
                                span{
                                    font-size:14px;
                                    color:rgba(80,104,140,1);
                                    float:left;
                                }
                                span:nth-child(1){
                                    width:100px;
                                    text-align: right;
                                }
                                span:nth-child(2){
                                    padding-left:24px;
                                }
                            }
                            p:nth-child(1){
                                width:100%;
                                height:60px;
                                background:rgba(127,143,164,1);
                                line-height: 60px;
                                text-align: center;
                                font-size:14px;
                                color:rgba(255,255,255,1);
                                margin-bottom:24px;
                            }
                            p:nth-child(4){
                                span:nth-child(2){
                                    width:682px;
                                }
                            }
                        }
                        
                    }
                    .appendix-sampl-table-bottom{
                        // height:273px;
                        padding:24px 32px;
                        // li{
                        //     float:left;
                        //     width:300px;
                        //     height:225px;
                        //     margin-right:24px;
                        //     position:relative;
                        //     img{
                        //         width:100%;
                        //         height:100%;
                        //     }
                        //     p{
                        //         position:absolute;
                        //         left:0;
                        //         bottom:0;
                        //         width:300px;
                        //         height:40px;
                        //         background:rgba(255,255,255,0.2);
                        //         font-size:14px;
                        //         color:rgba(22,64,97,1);
                        //         line-height: 40px;
                        //         text-align: center;
                        //     }
                        // }
                        width:1460px;
                        word-wrap: break-word;
                        word-break: normal;
                        p{
                            width:624px;
                            height:468px;
                            position:relative;
                            float:left;
                            margin:0 24px 24px 0;
                            img{
                                width:100%;
                                height:100%;
                            }
                            span{
                                display: block;
                                width:100%;
                                height:40px;
                                font-size:14px;
                                color:rgba(22,64,97,1);
                                position:absolute;
                                left:0;
                                bottom:0;
                                background:rgba(255,255,255,0.2);
                                text-align: center;
                                line-height: 40px;
                            }
                        }
                    }
                }
            }
            .appendix-p3{
                height:26px;
                line-height:26px;
                margin-bottom:24px;
                span{
                    font-size:16px;
                    color:rgba(255,168,0,1);
                }
                span:nth-child(1){
                    margin-right:16px;
                }
            }
            .appendix-table{
                width:1460px;
                background:rgba(255,255,255,1);
                border-radius:4px;
                border:1px solid rgba(215,220,227,1);
                overflow: hidden;
                border-collapse: collapse;
                margin-bottom:32px;
               table{
                    tr{
                        border-bottom:1px solid rgba(215,220,227,1);
                        td{
                            border-left:1px solid rgba(215,220,227,1);
                            vertical-align: middle;
                            text-align: center;
                            font-size:14px;
                            color:rgba(80,104,140,1);
                        }
                        td:nth-child(1){
                            border-left:none;
                        }
                    }
                    tr:nth-child(1){
                        background:rgba(127,143,164,1);
                        td{
                            font-size:14px;
                            color:rgba(255,255,255,1);
                        }
                        
                    }
                    tr:last-child{
                        border-bottom:none;
                    }
               }
            }
            .appendix-p4{
                height:26px;
                line-height:26px;
                margin-bottom:24px;
                span{
                    font-size:16px;
                    color:rgba(255,168,0,1);
                }
                span:nth-child(1){
                    margin-right:16px;
                }
            }
            .appendix-otherImages{
                width:1460px;
                word-wrap: break-word;
                word-break: normal;
                p{
                    width:624px;
                    height:468px;
                    position:relative;
                    float:left;
                    margin:0 24px 24px 0;
                    img{
                        width:100%;
                        height:100%;
                    }
                    span{
                        display: block;
                        width:100%;
                        height:40px;
                        font-size:14px;
                        color:rgba(22,64,97,1);
                        position:absolute;
                        left:0;
                        bottom:0;
                        background:rgba(255,255,255,0.2);
                        text-align: center;
                        line-height: 40px;
                    }
                }
            }
        }
        .btn-group{
            .btnBack{
                border:1px solid rgba(144,147,153,1);width:160px;height:50px;color:#909399;font-size: 16px;
            }
            .btnSubmit{
                background:#FFA800;width:160px;height:50px;color:#ffffff;outline:none;border:none;font-size: 16px;
            }
        }
        .Report-interface-approval{
            margin-bottom:142px;
            .approval-p{
                height:47px;
                font-size:20px;
                font-family:MicrosoftYaHei;
                color:rgba(80,104,140,1);
                border-bottom:2px solid rgba(255,168,0,1);
                margin-bottom:25px;
                vertical-align: top;
                margin-bottom:24px; 
            }
            .approval-table{
                width:1460px;
                // height:370px;
                border-radius:4px;
                border:1px solid rgba(215,220,227,1);
                overflow: hidden;
                border-collapse: collapse;
                tr{
                    border-bottom:1px solid rgba(215,220,227,1);
                    td{
                        border-left:1px solid rgba(215,220,227,1);
                    }
                    td:nth-child(1){
                        border-left:none;
                        padding:24px 104px;
                        font-size:14px;
                        color:rgba(255,255,255,1);
                        background:rgba(127,143,164,1);
                        text-align: center;
                        vertical-align: middle;
                    }
                }
                tr:nth-child(1){
                    td:nth-child(2){
                        padding:15px 0 18px 32px;
                        p{
                            font-size:18px;
                            color:rgba(80,104,140,1);  
                        }
                        p:nth-child(1){
                            margin-bottom:8px;
                        }
                    }
                }
                tr:nth-child(2){
                    td:nth-child(2){
                        padding:15px 0 18px 32px;
                        p:nth-child(1){
                            width:160px;
                            height:76px;
                            margin-bottom:8px;
                            img{
                                width:100%;
                                height:100%;
                            }
                        }
                        p:nth-child(2){
                            height:21px;
                            font-size:18px;
                            color:rgba(80,104,140,1);
                            line-height:22px;
                        }
                    }
                   
                }
                tr:nth-child(3){
                    border-bottom:none;
                    td:nth-child(2){
                        padding:15px 0 18px 32px;
                        p:nth-child(1){
                            margin-bottom:8px;
                            width:160px;
                            height:76px;
                            img{
                                width:100%;
                                height:100%;
                            }
                        }
                        p:nth-child(2){
                            height:21px;
                            font-size:18px;
                            color:rgba(80,104,140,1);
                            line-height:22px;
                        }
                    }
                }
            }
        }
    }
    .tc-table {
      border: 1px solid #D7DCE3;
      margin-bottom:24px;
      %background-1 {
    background-color: #7F8FA4;
    color: #FFF;
  }
  $color-1: #FFA800;

  .background-gray {
    @extend %background-1
  }
      th {
        border-color: #D7DCE3;
        background-color: #7F8FA4;
        color: #FFF;
        font-weight: normal;
        
      }
      td, th {
        border: 1px solid #D7DCE3;
        color: #50688C;
        padding: 0 10px;
        text-align: center;
        vertical-align: middle;
        .el-form-item {
          margin: 20px 0;
        }
      }
      .el-form-item__label {
        margin-bottom: 0;
      }
      .el-form-item__content {
        margin-left: 10px !important;
        margin-right: 20px !important;
      }
      .el-input__inner {
        text-align: left !important;
      }
    }
    //公共样式 结论字体颜色
    .conslusionAccord{
        color:rgba(103,194,58,1) !important;       //符合
    }
    .conslusionUnAccord{
        color:rgba(239,53,53,1) !important;        //不符合
    }   
    .indeterminate{
        color:rgba(244,179,71,1) !important;       //待定
    }
    .emptying{
        color:rgba(74,144,226,1) !important;       //放空
    }
    .inadequacy{
        color:rgba(74,144,226,1) !important;       //不适合
    }
    
}

</style>

<style rel="stylesheet/scss" lang="scss" >
//element-ui样式


</style>

