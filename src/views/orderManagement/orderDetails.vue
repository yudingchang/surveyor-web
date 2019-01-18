<template>
  <div class="order-detail">
    <el-row>
      <el-col :span="14">
        <div class="orderNumber clearfix">
          <span>订单号: {{ fundamentalState.number }}</span>
          <span class="greencolor orderstate">({{ fundamentalState.marking_name }})</span>
          <div class="copyIcon closeIcon" @click="chargeback" v-if="fundamentalState.marking_name!='完成'">
            <i class="iconfont icon-fuzhi"/>
            <p>退单</p>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="14">
        <div class="supplierDetail">
          <p>基本信息</p>
          <div class="supplierContent">
            <el-form ref="item" :model="supplier" label-width="100px" class="demo-ruleForm">
              <el-form-item label="验货地区" prop="name">
                <span>{{ fundamentalState.inspection_address.address_detail }}</span>
              </el-form-item>
              <el-form-item label="验货日期" prop="name">
                <span class="tc-separate">
                  <span
                    v-for="(item,index) in fundamentalState.inspection_dates"
                    :key="index"
                  >{{ item }}</span>
                </span>
              </el-form-item>
              <el-form-item label="价格" prop="name">
                <span>¥{{ Number(fundamentalState.commission) + Number(fundamentalState.other_fee) }}</span>
                <span v-if="fundamentalState.other_fee!=''">
                  <span>(含其他费用</span>
                  <span
                    v-for="(item,index) in fundamentalState.other_fee_detail"
                    :key="index"
                  >{{ item.name }} : ¥{{ item.fee }}</span>
                  <span>)</span>
                </span>
              </el-form-item>
              <el-form-item label="我的工作量" prop="name">
                <span>{{ fundamentalState.workload }}天</span>
              </el-form-item>
              <el-form-item label="总工作量" prop="name">
                <span>{{ fundamentalState.total_workload }}人天</span>
              </el-form-item>
              <el-form-item label="服务类型" prop="name">
                <span>{{ fundamentalState.order.slug_name }}</span>
              </el-form-item>
              <el-form-item label="验货类型" prop="name">
                <span>{{ fundamentalState.order.inspection_type_name }}</span>
              </el-form-item>
              <el-form-item label="报告语言" prop="name">
                <span v-if="cn_num>0">简体中文{{ cn_num }}份</span>
                <span v-if="cn_num>0 && en_num>0">，</span>
                <span v-if="en_num>0">英文{{ en_num }}份</span>
              </el-form-item>
              <el-form-item label="测库联系人" prop="name">
                <span style="margin-right:8px;">{{ fundamentalState.system_contact.nickname }}</span>
                <span>{{ fundamentalState.system_contact.mobile_phone }}</span>
              </el-form-item>
              <el-form-item label="其他验货员" prop="name" v-if="vacancy_num!=0">
                <p v-for="(item,index) in fundamentalState.relations" :key="index">
                  <span v-if="item.real_name!=null">
                    <span style="margin-right:8px;" v->{{ item.real_name }}{{ item.phone_number }}</span>
                    <span v-if="item.is_main == 1" class="numberBg">主</span>
                    <span v-if="item.is_main == 0" class="numberBg">辅</span>
                    <span>{{ Number(item.workload) }}天</span>
                  </span>
                </p>
                <p>还缺{{ vacancy_num }}名验货员</p>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="14">
        <div class="examineGoodsMessage">
          <p>验货地信息</p>
          <div class="examineGoodContent">
            <el-form ref="item" label-width="120px" class="demo-ruleForm">
              <el-form-item label="验货地名称" prop="name">
                <span>{{ fundamentalState.inspection_address.name }}</span>
              </el-form-item>
              <el-form-item label="验货地详细信息" prop="name">
                <span>{{ fundamentalState.inspection_address.address_detail }}</span>
              </el-form-item>
              <el-form-item label="联系人姓名" prop="name">
                <span>{{ fundamentalState.inspection_address.last_name + fundamentalState.inspection_address.first_name }}</span>
              </el-form-item>
              <el-form-item label="手机号码" prop="name">
                <span>{{ fundamentalState.inspection_address.phone_number }}</span>
              </el-form-item>
              <el-form-item label="电子邮箱" prop="name">
                <span>{{ fundamentalState.inspection_address.email }}</span>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <div class="otherRequirements">
          <p>其它要求</p>
          <div class="otherRequirementsContent">
            <el-form ref="item" label-width="120px" class="demo-ruleForm">
              <el-form-item label="要求内容">
                <span>{{ fundamentalState.order.description == null ? '无' : fundamentalState.order.description}}</span>
              </el-form-item>
              <el-form-item label="检验资料">
                <div v-if="fundamentalState.order.files.length == 0">
                  无
                </div>
                <div v-if="fundamentalState.order.files.length>0">
                  <ShowFile :file-list="files"/>
                </div>              
              </el-form-item>
            </el-form>
          </div>
          <!-- <div class="otherRequirementsContent" v-if="fundamentalState.order.files.length == 0  && fundamentalState.order.description == null" >
            无
          </div> -->
        </div>
      </el-col>
    </el-row>
    <!-- 参考样品 -->
    <el-row>
      <el-col :span="24">
        <div class="sampleReference">
          <p>参考样品</p>
          <div>
            <el-form ref="item" label-width="100px" class="demo-ruleForm">
              <div
                v-for="(item,index) in fundamentalState.order.mailings"
                :key="index"
                class="sampleReferenceContent"
                v-if="fundamentalState.order.mailings.length>0"
              >
                <el-form-item label="参考样品">
                  <span>{{ item.name }}</span>
                </el-form-item>
                <el-form-item label="说明">
                  <span>{{ item.description }}</span>
                </el-form-item>
                <el-form-item label="参考图片">
                  <ShowFile :file-list="item.files"/>
                </el-form-item>
              </div>
              <div class="sampleReferenceContent"  v-if="fundamentalState.order.mailings.length==0">
                无
              </div>
            </el-form>
          </div>
        </div>
      </el-col>
    </el-row>
    <!-- 取样信息 -->
    <el-row>
      <el-col :span="24">
        <div class="sampleIntelligence">
          <p>取样信息</p>
          <div>
            <el-form ref="item" label-width="100px" class="demo-ruleForm">
              <div
                v-for="(item,index) in fundamentalState.order.sampling_information"
                :key="index"
                class="sampleIntelligenceContent"
                v-if="fundamentalState.order.sampling_information.length>0"
              >
                <el-form-item label="取样数量">
                  <span>{{ item.sampling_quantity }}</span>
                </el-form-item>
                <el-form-item label="取样原因">
                  <span>{{ item.sampling_reason }}</span>
                </el-form-item>
                <el-form-item label="收件公司">
                  <span>{{ item.receive_company }}</span>
                </el-form-item>
                <el-form-item label="收件人">
                  <span>{{ item.receive_person }}</span>
                </el-form-item>
                <el-form-item label="收件地址">
                  <span>{{ item.receive_address }}</span>
                </el-form-item>
                <el-form-item label="备注信息">
                  <span v-if="item.remark != null">{{ item.remark }}</span>
                  <span v-else>无</span>
                </el-form-item>
                <el-form-item label="参考图片">
                  <span v-if="item.remark != null">{{ item.remark }}</span>
                  <span v-else>无</span>
                </el-form-item>
              </div>
              <div class="sampleIntelligenceContent" v-if="fundamentalState.order.sampling_information.length==0">
                无
              </div>

            </el-form>
          </div>
        </div>
      </el-col>
    </el-row>
    <!-- 产品信息 -->
    <el-row>
      <el-col :span="24">
        <div class="productWrap">
          <div
            v-for="(item,index) in fundamentalState.reports"
            :key="index"
            class="productInformationWrap"
          >
            <div :class="{titleChange:item.is_collapse}" class="normalTitle">
              <span class="left">报告{{ index+1 }}</span>
              <span class="right" @click="Spread(item,index)">
                <span v-if="item.is_collapse == false">收起</span>
                <span v-else>展开</span>
                <i :class="{rotaga:item.is_collapse}" class="el-icon-caret-top"/>
              </span>
            </div>
            <div v-show="!item.is_collapse" class="productInformationContent">
              <div class="productInformation">
                <p>产品信息</p>
                <el-tabs v-model="item.name" type="card">
                  <el-tab-pane
                    v-for="(item, index) in item.products"
                    :key="index"
                    :label="'产品' + (index + 1)"
                    :name="'report' + (index + 1)"
                  >
                    <div class="content">
                      <el-form :model="item" label-width="80px" class="demo-ruleForm">
                        <el-form-item label="产品名称" prop="name">
                          <span>{{ item.name }}</span>
                          <!-- <el-input v-model="item.name" placeholder="请输入产品名称" style="width:500px;"/>
                              <div class="copy" @click="copy(item,index)">
                                <i class="iconfont icon-fuzhi_"/>
                                <p>复制</p>
                          </div>-->
                        </el-form-item>
                        <el-form-item label="产品货号">
                          <span>{{ item.number }}</span>
                          <!-- <el-input v-model="item.number" placeholder="请输入产品货号" style="width:500px;"/> -->
                        </el-form-item>
                        <el-form-item v-for="(val,i) in item.PO" :key="i" label="P.O号">
                          <span>{{ val.number }}</span>
                          <span>{{ val.quantity }}</span>
                          <span>{{ val.unit }}</span>
                        </el-form-item>
                        <el-form-item label="产品总数">
                          <span>{{ item.report_quantity }}</span>
                        </el-form-item>
                        <el-form-item label="抽样数量">
                          <span>{{ item.check_quantity }}</span>
                        </el-form-item>
                      </el-form>
                    </div>
                  </el-tab-pane>
                </el-tabs>
                <p>标准信息</p>
                <el-form>
                  <el-form-item label="检验标准:">
                    <span v-if="item.sampling.type == 1">ANSI/ASQ Z1.4 Single Sampling Plan</span>
                    <span v-if="item.sampling.type == 2">抽样比例</span>
                    <span v-if="item.sampling.type == 3">抽样数量</span>
                    <span v-if="item.sampling.type == 4">ASTM D5430 4 Points System</span>
                  </el-form-item>
                </el-form>
                <div class="labelStyle">验货项目</div>
                <table class="gridtable" border>
                  <!-- type=1 level2 -->
                  <tbody v-if="item.sampling.type == 1">
                    <tr>
                      <td class="greenTd">数量检查</td>
                      <td colspan="3">全检</td>
                    </tr>
                    <tr>
                      <td class="greenTd">一致性检查</td>
                      <td colspan="3">核对样板及检验资料</td>
                    </tr>
                    <tr align="center">
                      <td
                        class="greenTd fourLine"
                        rowspan="4"
                        style="vertical-align:middle;text-align:center;"
                      >产品外观及工艺</td>
                      <td>检验水平</td>
                      <td v-if="item.sampling.params.level == 1" colspan="2">S-1</td>
                      <td v-else-if="item.sampling.params.level == 2" colspan="2">S-2</td>
                      <td v-else-if="item.sampling.params.level == 3" colspan="2">S-3</td>
                      <td v-else-if="item.sampling.params.level == 4" colspan="2">S-4</td>
                      <td v-else-if="item.sampling.params.level == 11" colspan="2">I</td>
                      <td v-else-if="item.sampling.params.level == 12" colspan="2">II</td>
                      <td v-else-if="item.sampling.params.level == 13" colspan="2">III</td>
                      <td v-else colspan="2"/>
                    </tr>
                    <tr>
                      <td rowspan="3" style="vertical-align:middle;text-align:center;">可接受质量限</td>
                      <td>致命缺陷</td>
                      <td>{{ item.sampling.params.fatal_defect_limit }}</td>
                    </tr>
                    <tr>
                      <td>严重缺陷</td>
                      <td>{{ item.sampling.params.serious_defect_limit }}</td>
                    </tr>
                    <tr>
                      <td>轻微缺陷</td>
                      <td>{{ item.sampling.params.minor_defect_limit }}</td>
                    </tr>
                    <tr>
                      <td class="greenTd">功能测试项</td>
                      <td colspan="3">具体见测试项明细</td>
                    </tr>
                  </tbody>

                  <!-- type=2 或 type=3  -->
                  <tbody v-if="item.sampling.type == 2 || item.sampling.type == 3">
                    <tr>
                      <td class="greenTd">数量检查</td>
                      <td colspan="3">全检</td>
                    </tr>
                    <tr>
                      <td class="greenTd">一致性检查</td>
                      <td colspan="3">核对样板及检验资料</td>
                    </tr>
                    <tr align="center">
                      <td
                        class="greenTd fourLine"
                        rowspan="4"
                        style="vertical-align:middle;text-align:center;"
                      >产品外观及工艺</td>
                      <td v-if="item.sampling.type == 2">抽样数量</td>
                      <td v-if="item.sampling.type == 3">抽样比例</td>
                      <td
                        v-if="item.sampling.type == 2"
                        colspan="2"
                      >{{ item.sampling.params.quantity }}</td>
                      <td
                        v-if="item.sampling.type == 3"
                        colspan="2"
                      >{{ item.sampling.params.quantity }}%</td>
                    </tr>
                    <tr>
                      <td rowspan="3" style="vertical-align:middle;text-align:center;">可接受缺陷数</td>
                      <td>致命缺陷</td>
                      <td>{{ item.sampling.params.fatal_defect }}</td>
                    </tr>
                    <tr>
                      <td>严重缺陷</td>
                      <td>{{ item.sampling.params.serious_defect }}</td>
                    </tr>
                    <tr>
                      <td>轻微缺陷</td>
                      <td>{{ item.sampling.params.minor_defect }}</td>
                    </tr>
                    <tr>
                      <td class="greenTd">功能测试项</td>
                      <td colspan="3">具体见测试项明细</td>
                    </tr>
                  </tbody>

                  <!-- type=4 布料标准 -->
                  <tbody v-if="item.sampling.type == 4">
                    <tr>
                      <td class="greenTd">数量检查</td>
                      <td colspan="2">全检</td>
                    </tr>
                    <tr>
                      <td class="greenTd">一致性检查</td>
                      <td colspan="2">核对样板及检验资料</td>
                    </tr>
                    <tr align="center">
                      <td
                        class="greenTd fourLine"
                        rowspan="3"
                        style="vertical-align:middle;text-align:center;"
                      >产品外观及工艺</td>
                      <td>抽样方法</td>
                      <td v-if="item.sampling.params.method == 1">全检</td>
                      <td v-else-if="item.sampling.params.method == 2">总数量开平方*10</td>
                      <td v-else-if="item.sampling.params.method == 3">总数量百分比</td>
                      <td v-else-if="item.sampling.params.method == 4">固定值</td>
                    </tr>
                    <tr>
                      <td rowspan="2" style="vertical-align:middle;text-align:center;">可接受质量限</td>
                      <td>单卷每100平方码分数允许分值&nbsp;{{ item.sampling.params.single_limit }}</td>
                    </tr>
                    <tr>
                      <td>整批每100平方码分数允许分值&nbsp;{{ item.sampling.params.entire_limit }}</td>
                    </tr>
                    <tr>
                      <td class="greenTd">功能测试项</td>
                      <td colspan="3">具体见测试项明细</td>
                    </tr>
                  </tbody>
                </table>
                <p>测试项明细</p>
                <el-table
                  :data="item.checkitems"
                  border
                  style="width: 100%"
                  class="grabSheet"
                  empty-text="暂无待抢订单"
                >
                  <el-table-column label="测试项目" prop="title" align="center"/>
                  <el-table-column prop="description" label="测试要求" align="center"/>

                  <el-table-column label="包含产品" align="center">
                    <template slot-scope="scope">
                      <span v-if="scope.row.products.length==1">{{ scope.row.products[0] }}</span>
                      <span v-else-if="scope.row.products.length>1" style="display:inline-block;">
                        <span style="display:inline-block;width:120px;">{{ scope.row.products[0] }}...</span>
                        <i
                          style="display:inline-block;"
                          class="iconfont icon-IconCopy"
                          @click="getDetail(scope.row)"
                        />
                      </span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="check_quantity" label="测试数量" align="center"/>
                </el-table>
              </div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <!-- 产品名称弹出层 -->
    <div class="productBorder">
      <el-dialog :visible.sync="dialogTableVisible" title="产品名称" class="detail-dialog" width="400px" >
        <el-table :data="gridData" border height="200">
          <el-table-column type="index" label="序号" width="100" align="center"/>
          <el-table-column property="name" label="产品名称" align="center"/>
        </el-table>
      </el-dialog>
    </div>
    <!-- 确认退单弹出层 -->
    <div class="chargeBackDialog">
      <el-dialog
        :visible.sync="chargeBackDialogVisible"
        width="400px"
        center >
        <p class='title'>{{chargeBackText}}</p>
        <p class='cutTip' v-if="cut100">查看扣款规则</p>
        <span slot="footer" class="dialog-footer">
          <el-button style="width:80px;height:40px;" @click="chargeBackDialogVisible = false">否</el-button>
          <el-button  style="width:80px;height:40px;background:#FFA800;border:none" type="primary" @click="submitChargeBack">是</el-button>
        </span>
      </el-dialog>
    </div>
     <!-- 退单成功 -->
    <div class="chargeBackDialog">
      <el-dialog
        :visible.sync="successBackDialogVisible"
        width="400px"
        center >
        <i class="iconfont icon-Fill4"></i>
        <p class='text'>退单成功</p>
        <span slot="footer" class="dialog-footer">
          <el-button  style="width:200px;height:40px;background:#FFA800;border:none" type="primary" @click="successBackDialogVisible = false">确认</el-button>
        </span>
      </el-dialog>
    </div>
    <!-- 需联系工作人员退单 -->
    <div class="chargeBackDialog">
      <el-dialog
        :visible.sync="phoneChargeBackDialogVisible"
        width="400px"
        center >
        <p class='title'>验货中退款需联系测库工作人员</p>
        <p class='chargePhone'>测库电话:{{fundamentalState.system_contact.mobile_phone }}</p>
        <span slot="footer" class="dialog-footer">
          <el-button style="width:200px;height:40px;background:#FFA800;border:none" type="primary" @click="phoneChargeBackDialogVisible = false">确认</el-button>
        </span>
      </el-dialog>
    </div>
    

  </div>
</template>

<script>
const moment = require('moment')
import ShowFile from '@/components/showfile'
// import { getOrderList } from "@/api/order";
import { orderDetail , chargeBack} from '@/api/dashboard'
export default {
  components: {
    ShowFile
  },
  data() {
    return {
      orderId: this.$route.query.orderId,
      number: '2018050310291584',
      marking_name: '待付款',
      created_at: '2018.08.01 12:02',
      description: '',
      workload: 1,
      files: [],
      //   fileList:'',
      CNYpay: '800',
      USDpay: '100',
      supplier: {},
      supplierName: '测库供应商',
      supplierFullName: '王大大',
      phone: '+86-11577889611',
      email: 'wangdada123@qq.com',
      address: '浙江省杭州市滨江区',
      tableData: [
        // {
        //   date: "2016-05-02",
        //   name: "王小虎",
        //   address: "上海市普陀区金沙江路 1518 弄"
        // },
        // {
        //   date: "2016-05-04",
        //   name: "王小虎",
        //   address: "上海市普陀区金沙江路 1517 弄"
        // },
        // {
        //   date: "2016-05-01",
        //   name: "王小虎",
        //   address: "上海市普陀区金沙江路 1519 弄"
        // },
        // {
        //   date: "2016-05-03",
        //   name: "王小虎",
        //   address: "上海市普陀区金沙江路 1516 弄"
        // }
      ],
      // fundamentalState: {
      //   reports: [
      //     {
      //       bool: true,
      //       spreadtext: '展开'
      //     },
      //     {
      //       bool: false,
      //       spreadtext: '展开'
      //     }
      //   ]
      // },
      editableTabs2: [
        {
          number: '22300188497563',
          name: 'testcoo',
          title: 'testcoo',
          PO: [
            {
              number: '421181199112181',
              quantity: '500',
              unit: '件'
            }
          ]
        },
        {
          number: '22300188497563',
          name: 'testcoo1',
          title: 'testcoo',
          PO: [
            {
              number: '421181199112181',
              quantity: '500',
              unit: '件'
            },
            {
              number: '421181199112181',
              quantity: '1000',
              unit: '个'
            }
          ]
        }
      ],
      editableTabsValue2: 'tab1',
      fundamentalState: {
        other_fee: '',
        order: '',
        system_contact: '',
        inspection_address: '',
        inspection_first_date:''
      },
      cn_num: '',
      en_num: '',
      vacancy_num: '',
      spreadtext: '收起',
      productInformationContentShow: false,
      dialogTableVisible: false,
      gridData: [],
      chargeBackDialogVisible:false,
      phoneChargeBackDialogVisible:false,
      successBackDialogVisible:false,
      // 电话退单
      canPhoneChargeBack:false,
      chargeBackText:'是否退单？',
      cut100:false,
    }
  },
  computed: {},
  created() {
    this.getOrderList()
    
  },
  mounted() {},
  methods: {
    //   获取订单详情
    getOrderList() {
      orderDetail({
        url: '/v1/inspector/service/' + this.orderId
      }).then(response => {
        if (response.data.code == 0) {
          this.fundamentalState = response.data.data
          this.jundgeTime()
          this.cn_num = this.fundamentalState.reports.filter(
            t => t.locale_name == '简体中文'
          ).length
          this.cn_name = '简体中文'
          this.en_num = this.fundamentalState.reports.filter(
            t => t.locale_name == '英文'
          ).length
          this.en_name = '英文'
          this.vacancy_num = this.fundamentalState.relations.filter(
            t => t.real_name == null
          ).length
          this.files = this.fundamentalState.order.files
        }
      })
    },
    Spread(item, index) {
      item.is_collapse = !item.is_collapse
    },
    // 获取商品明细弹出框
    getDetail(row) {
      console.log(row)
      this.dialogTableVisible = true
      this.gridData = row.products.map((item, index) => {
        return {
          name: item
        }
      })
    },
    // 确认退单弹窗出现
    chargeback(){
       console.log(this.canPhoneChargeBack);
      // 没有超过验货前一天10点
      if((this.fundamentalState.marking_name == '已抢待审核' || this.jundgeTime()) && this.canPhoneChargeBack == false ){
        this.chargeBackDialogVisible = true
        return false
      }
      // 超过验货前一天10点不到验货时间
     
      else if( this.jundgeTime() == false && this.canPhoneChargeBack == false){
        this.chargeBackDialogVisible = true
        this.chargeBackText = '现在退单将扣款¥100您确定退单吗?'
        this.cut100 = true
         return false
      }else if(this.canPhoneChargeBack){
        this.phoneChargeBackDialogVisible = true
        return false
      }
      
      
    },
    // 确认退单
    submitChargeBack(){
      // if(this.fundamentalState.marking_name == '已抢待审核' || this.jundgeTime){
        chargeBack(`/v1/inspector/service/${this.orderId}/refund`).then(res=>{
          if(res.data.code == 0){
            this.successBackDialogVisible = true
          }
        })
      // }    
    },
    // 判断当前时间跟验货时间第一天前一天10点对比
    jundgeTime(){
      let checkproduct = moment(this.fundamentalState.inspection_first_date,'YYYY-MM-DD').valueOf()
      
      if(new Date().getTime() > moment(this.fundamentalState.inspection_first_date,'YYYY-MM-DD').valueOf()){
        this.canPhoneChargeBack = true
      }else{
        this.canPhoneChargeBack = false
      }
      return new Date().getTime() > checkproduct-86400000 + 86400000/24*10 ? false : true 
    }
  }
}
</script>
<style lang="scss">
.order-detail {
  .el-tabs__item.is-active {
    color: #ffa800;
    height: 40px;
    line-height: 40px;
    position: relative;
    background-image: none;
    background-color: #ffffff;
    top: 0;
    width: 100px;
    text-align: center;
  }
  .el-tabs__nav-wrap {
    margin-bottom: 0;
  }
  .el-tabs__item {
    margin-right: 10px;
    border: 1px solid #e6eaee;
    line-height: 35px;
    height: 35px;
    /* // background-color: #ffffff; */
    border-radius: 4px;
    position: relative;
    color: #768caa;
    top: 5px;
    background-image: linear-gradient(0deg, #f4f7fa 0%, #ffffff 100%);
  }
  .el-tabs__item:hover {
    color: #ffa800;
  }
  .el-tabs--card > .el-tabs__header .el-tabs__nav {
    border: none;
  }
  .el-tabs--card > .el-tabs__header .el-tabs__item:first-child {
    border-left: 1px solid #e6eaee;
  }
  .el-tabs__nav-next,
  .el-tabs__nav-prev {
    line-height: 50px;
  }
  .el-tabs--card > .el-tabs__header {
    border-bottom: none;
    margin: 0;
  }
  .el-form-item__label {
    font-size: 14px;
    color: #7c8fa6;
  }
  .el-form-item {
    margin-bottom: 15px;
  }
  .el-table th {
    background: #7dc855;
    color: #ffffff;
    height: 60px;
  }
  .el-form-item__label {
    text-align: left;
  }
  .productBorder{
  .el-table th {
    background:inherit;
    height: inherit;
    color: inherit;
  }
 .el-dialog__header{
    text-align: center;
    background:rgba(230,234,238,1);
    padding: 20px 20px 15px;
  }
  .el-dialog__title{
    color: #164061;
    font-size: 14px;
    font-weight: bold;
  }
  
  .el-dialog--center .el-dialog__body{
      padding: 0;
      text-align: center;
    }
}
  .chargeBackDialog{
    .el-dialog__body{
      padding: 20px 25px 30px;
      color:#7C8FA6;
    }
  }
}


</style>
<style rel="stylesheet/scss" lang="scss" scoped>

.order-detail {
  margin: 32px 120px 0 100px;
  .greencolor {
    color: #ffc500;
  }
  .chargeBackDialog{
    .title{
      display:block;
      text-align:center;
      color:#7C8FA6;
      font-size:16px;
    }
    .cutTip{
      font-size:16px;
      color:#E65C5C;
      margin-top:8px;
      text-align:center
    }
    .chargePhone{
      text-align:center;
      font-size:16px;
      color:#4A90E2;
      margin-top:10px;
    }
    i{
      font-size:80px;
      display:block;
      text-align:center;
      color:#67C23A;
    }
    .text{
      color:#50688C;
      text-align:center;
      font-size:16px;
    }
  }
  .orderNumber {
    width: 1000px;
    width: 100%;
    background-color: #ffffff;
    color: #50688c;
    padding: 18px 42px 32px;
    border-left: 2px solid #158be4;
    height: 84px;
    > span {
      line-height: 50px;
      vertical-align: middle;
    }

    .orderstate {
      margin-right: 32px;
    }
    .closeIcon {
      width: 40px;
      text-align: center;
      // display: inline-block;
      float: right;
      // position: relative;
      // top: 9px;
      // margin-left: 32px;
      cursor: pointer;
      i {
        color: #7c8ca5;
      }
    }
  }
  .supplierInformation {
    margin: 25px 0;
    font-size: 18px;
    color: #50688c;
    .manDay {
      margin: 0 30px;
    }
    .payNumber {
      color: #ef3535;
      font-weight: bold;
      font-size: 20px;
    }
    .btn {
      display: inline-block;
      background: #67c23a;
      width: 120px;
      text-align: center;
      height: 32px;
      line-height: 32px;
      font-size: 14px;
      color: #ffffff;
      border-radius: 4px;
      cursor: pointer;
      margin-left: 16px;
    }
  }

  .supplierDetail {
    margin-top: 32px;
    > p:first-child {
      font-size: 18px;
      color: #50688c;
    }
    .numberBg {
      display: inline-block;
      // paddding:5px;
      border-radius: 6px;
      width: 22px;
      height: 22px;
      color: #ffffff;
      text-align: center;
      line-height: 22px;
      background: rgba(74, 144, 226, 1);
    }
    .supplierContent {
      // width: 1000px;
      background-color: #ffffff;
      padding: 20px 40px 10px;
      margin-top: 16px;
      color: #50688c;
      .left30 {
        margin-left: 30px;
      }
      .tc-separate {
        span + span {
          &::before {
            content: " , ";
          }
        }
      }
    }
  }
  .examineGoodsMessage {
    margin-top: 32px;
    > p:first-child {
      font-size: 18px;
      color: #50688c;
    }
    .examineGoodContent {
      //  width: 1000px;
      background-color: #ffffff;
      padding: 20px 40px 10px;
      color: #50688c;
      margin-top: 16px;
      .left30 {
        margin-left: 30px;
      }
    }
  }
  .reportList {
    margin-top: 25px;
  }
  .otherRequirements {
    margin-top: 32px;
    padding: 0;
    > p:first-child {
      font-size: 18px;
      color: #50688c;
    }
    .otherRequirementsContent {
      // width: 1000px;
      background-color: #ffffff;
      padding: 20px 40px 10px;
      margin-top: 16px;
      .left30 {
        margin-left: 30px;
      }
      > div {
        margin-bottom: 24px;
        > span:first-child {
          color: #7c8fa6;
        }
        // >span:last-child{
        //     color: #50688C;;
        // }
      }
    }
  }
  .sampleReference {
    margin-top: 32px;
    padding: 0;
    > p:first-child {
      font-size: 18px;
      color: #50688c;
      margin-bottom: 16px;
    }
    .sampleReferenceContent {
      background-color: #ffffff;
      padding: 20px 40px;
      color: #50688c;
      margin-bottom: 24px;
    }
  }

  .sampleIntelligence {
    margin-top: 32px;
    padding: 0;
    > p:first-child {
      font-size: 18px;
      color: #50688c;
      margin-bottom: 16px;
    }
    .sampleIntelligenceContent {
      background-color: #ffffff;
      padding: 20px 40px;
      color: #50688c;
      margin-bottom: 24px;
    }
  }
  .productWrap {
    margin-top: 32px;
    .productInformationWrap {
      background-color: #ffffff;
      // padding: 32px 0;
      color: #50688c;
      margin-bottom: 24px;

      .normalTitle {
        padding-bottom: 20px;
        border-bottom: 1px solid #bfc4cc;
        padding: 32px 40px;
        overflow: hidden;
        .left {
          float: left;
          color: #50688c;
          font-size: 16px;
          > span {
            color: #ef3535;
            margin-right: 8px;
          }
        }
        .right {
          float: right;
          font-size: 16px;
          i {
            color: #ffa800;
            margin-left: 16px;
            transition: all 0.5s;
          }
          .rotaga {
            transform: rotate(180deg);
            -ms-transform: rotate(180deg); /* IE 9 */
            -moz-transform: rotate(180deg); /* Firefox */
            -webkit-transform: rotate(180deg); /* Safari 和 Chrome */
            -o-transform: rotate(180deg); /* Opera */
          }
        }
      }
      .titleChange {
      border-bottom: none;
      // padding-bottom: 0;
    }
      .productInformation {
        position: relative;
        padding: 24px 40px 60px;
        // width: 85%;
        .addNewProducts {
          cursor: pointer;
          position: absolute;
          right: 0;
        }
        > p {
          font-size: 16px;
          font-weight: bold;
          color: #ffa800;
          margin-bottom: 24px;
        }
        .addNewProduct {
          display: inline-block;
          position: absolute;
          cursor: pointer;
          right: 0;
          z-index: 5;
          top: 55px;
          background-image: linear-gradient(0deg, #f4f7fa 0%, #ffffff 100%);
        }
        .content {
          width: 100%;
          padding: 20px 30px 10px;
          background-color: #ffffff;
          border: 1px solid #e6eaee;
          border-radius: 4px;
          color: #50688c;
          margin-bottom: 32px;
          .left30 {
            margin-left: 30px;
          }
          .copy {
            display: inline-block;
            color: #7c8ca5;
            font-size: 10px;
            line-height: 36px;
            height: 36px;
            vertical-align: middle;
            margin-left: 30px;
            cursor: pointer;
            p {
              margin: 0;
              padding: 0;
              position: relative;
              top: -28px;
              text-align: center;
            }
            i {
              position: relative;
              display: inline-block;
              width: 24px;
              top: -10px;
              text-align: center;
            }
          }
        }
        .labelStyle {
          font-size: 14px;
          color: #7c8fa6;
        }
        .gridtable {
          border-collapse: collapse;
          width: 100%;
          margin: 15px auto 33px;
          thead > tr {
            // background: #eef1f6;
            height: 40px;
            line-height: 40px;
          }
          th,
          td {
            border: 1px solid #dfe6ec;
            font-size: 14px;
            font-weight: normal;
            text-align: center;
          }

          .w {
            width: 120px;
          }
          tbody > tr {
            height: 50px;
            line-height: 50px;
            // &:hover {
            //   background: #eef1f6;
            // }
            td {
              padding: 0 10px;
              color: #50688c;
            }
            .greenTd {
              background: #7dc855;
              color: #ffffff;
            }
            // vertical-align:
            // line-height: 200px;
            // height: 200px;
            // }
          }
        }
      }
    }
  }
}

</style>

