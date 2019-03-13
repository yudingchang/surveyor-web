<template>
  <div class="controlboard" v-loading.fullscreen.lock="fullscreenLoading">
    <div class="nomarlTop">
      <span class="left">抢单</span>
      <a class="right" @click="goGrabList()">更多<i class="el-icon-d-arrow-right"/></a>
    </div>
    <el-table
      :data="tableData"
      style="width: 100%"
      class="grabSheet"
      height="255"
      empty-text="暂无待抢订单"
    >
      <el-table-column
        label="订单号"
        width="230">
        <template slot-scope="scope">
          <span v-if="scope.row.is_main == true" class="numberBg">主</span><span v-if="scope.row.is_main == false" class="numberBg">辅</span> <el-button type="text" class="btnText" @click="goOrderDetail(scope.row)">{{ scope.row.number }}</el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="验货地区"
        width="200">
        <template slot-scope="scope">
          {{ scope.row.inspection_address.address_summary }}
        </template>
      </el-table-column>
      <el-table-column
        label="服务类型">
        <template slot-scope="scope">
          {{ scope.row.order.slug_name }}
        </template>
      </el-table-column>
      <el-table-column
        prop="inspection_first_date"
        label="验货开始日期"/>
      <el-table-column
        label="报告语言">
        <template slot-scope="scope">
          <span v-for="(item,index) in _.map(_.uniqBy(scope.row.reports, 'locale'), 'locale_name')" :key="index" style="margin-right:5px;">
            {{ item }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        width="200"
        label="产品名称">
        <template slot-scope="scope">
          <span v-if="scope.row.products.length==1">{{ scope.row.products[0].name}}</span>
          <span v-else-if="scope.row.products.length>1" style="display:inline-block;"><span style="display:inline-block;width:100px;overflow: hidden; text-overflow:ellipsis; white-space: nowrap;">{{ scope.row.products[0].name }}</span><i style="display:inline-block;" class="iconfont icon-IconCopy" @click="getDetail(scope.row)"/></span>
        </template>
      </el-table-column>
      <el-table-column
        label="工作量">
        <template slot-scope="scope">
          {{ Number(scope.row.workload) }}天
        </template>
      </el-table-column>
      <el-table-column
        prop="address"
        label="价格">
        <template slot-scope="scope">
          ¥{{ Number(scope.row.commission) + Number(scope.row.other_fee) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="address"
        label="操作">
        <template slot-scope="scope">
          <!-- <el-button v-if="(scope.row.can.confirm == false) && (scope.row.can.chase == false)" type="warning" @click="showNoRobbingPump(scope.row)">查看原因</el-button> -->
          <el-button type="success" @click="showGrabSheetPump(scope.row)">抢单</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row :gutter="50" class="walletMiddle">
      <el-col :span="8">
        <div class="wallet">
          <div class="nomarlTop">
            <span class="left">钱包余额</span>
            <a class="right" @click="goWalletDetail()">明细<i class="el-icon-d-arrow-right"/></a>
          </div>
          <div class="walletContent">
            <p class="number">¥{{ balance }}</p>
            <el-button class="btn" @click="goWalletAccount()">提现</el-button>
          </div>
        </div>
      </el-col>
      <el-col :span="16">
        <div class="grabQualification">
          <div class="nomarlTop">
            <span class="left">抢单资格</span>
          </div>
          <div class="grabContent">
            <div v-if="inspector.inspector_status==0">
              <p class="number">您的专业资料未完善，无法抢单！</p>
              <el-button class="btn" @click="goProfessiondData()">立即完善</el-button>
            </div>
            <div v-if="inspector.inspector_status==1">
              <p class="number">您的专业资料在待审核中，请耐心等待</p>
              <el-button class="btn" @click="goProfessiondData()">查看资料</el-button>
            </div>
            <div v-if="inspector.inspector_status==-2">
              <p class="number">您的专业资料审核未通过 
                <el-popover
                  placement="bottom"
                  width="200"
                  center
                  trigger="click"
                  :content="qualification.reject_description"
                  >
                  <a slot="reference" style="color:#E65C5C;text-decoration: underline;">查看原因</a>
                </el-popover>
              </p>
              <el-button class="btn" @click="goProfessiondData()">修改资料</el-button>
            </div>
            <div v-if="inspector.inspector_status==2" class="completeMessage clearfix">
               <div class="informationContent fl" v-if="qualification.main_assist_order.length!=0">
                 <p class="informationTitle">可抢主辅单</p>
                 <p class="informationList clearfix">
                   <span class="fl" :class="{'noneStyle':getBool(qualification.main_assist_order,2) && qualification.main_assist_order.length==1}" v-if="getBool(qualification.main_assist_order,2)">辅单(不能写报告)</span>
                   <span class="fr" style="margin-left:0" :class="{'noneStyle':getBool(qualification.main_assist_order,1) && qualification.main_assist_order.length==1}" v-if="getBool(qualification.main_assist_order,1)">主单(能写报告)</span>
                 </p>
               </div>
               <div class="line fl" v-if="qualification.report_language.length!=0"></div>
               <div class="informationContent fl" v-if="qualification.report_language.length!=0">
                 <p class="informationTitle">可抢报告语言订单</p>
                 <p class="informationList clearfix">
                   <span class="fl" :class="{'noneStyle':getBool(qualification.report_language,'zh_CN') && qualification.report_language.length==1}" v-if="getBool(qualification.report_language,'zh_CN')">中文报告</span>
                   <span class="fr" :class="{'noneStyle':getBool(qualification.report_language,'en') && qualification.report_language.length==1}" v-if="getBool(qualification.report_language,'en')">英文报告</span>
                 </p>
               </div>
               <div class="line fl" v-if="_.flatten(_.map(qualification.category_tags,'category_arr')).length > 0"></div>
               <div class="informationContent fl" style="width:340px;" v-if="_.flatten(_.map(qualification.category_tags,'category_arr')).length > 0">
                 <p class="informationTitle">可抢产品分类</p>

                 <p class="informationList clearfix">
                   <span v-for="(item,index) in qualification.category_tags" :key="index" v-if="_.get(item,'category_arr',[]).length>0">
                     {{item.name}}
                     <i class="iconfont icon-IconCopy" @click="getProductDetail(item.category_arr)"></i>
                   </span>
                   <!-- <span class="fl" v-if="Object.keys(qualification.category_tags.electronics).length != 0">
                     电子电器
                     <i class="iconfont icon-IconCopy" @click="getProductDetail(qualification.category_tags.electronics.category_arr)"></i>
                   </span>
                   <span class="fl" v-if="Object.keys(qualification.category_tags.light_industry).length != 0">
                     轻工产品
                     <i class="iconfont icon-IconCopy" @click="getProductDetail(qualification.category_tags.light_industry.category_arr)"></i>
                     </span>
                   <span class="fl" v-if="Object.keys(qualification.category_tags.textile).length != 0">纺织品
                      <i class="iconfont icon-IconCopy" @click="getProductDetail(qualification.category_tags.textile.category_arr)"></i>
                   </span> -->
                 </p>
               </div>
            </div>
           
          </div>
        </div>
      </el-col>
    </el-row>
    <div class="nomarlTop backlog">
      <span class="left">近期待办事项</span>
      <a class="right" @click="goReporteManager()">更多<i class="el-icon-d-arrow-right"/></a>
    </div>
    <el-table
      :data="tableData2"
      style="width: 100%"
      class="grabSheet"
      height="255"
      empty-text="暂无待办事项"
    >
      <el-table-column
        label="订单号"
        width="180">
        <template slot-scope="scope">
          <el-button type="text" class="btnText"  @click="goReportsDetail(scope.row)">{{ scope.row.service.number }}</el-button>
        </template>
      </el-table-column>
      <el-table-column
        label="报告单号" prop="number"/>
      <el-table-column
        label="验货开始日期" prop="service.inspection_first_date"/>
      <el-table-column
        label="验货地名称">
        <template slot-scope="scope">
          {{ scope.row.address.name }}
        </template>
      </el-table-column>
      <el-table-column
        label="验货地区">
        <template slot-scope="scope">
          {{ scope.row.address.address_summary }}
        </template>
      </el-table-column>
      <el-table-column
        label="报告语言">
        <template slot-scope="scope">
          {{ scope.row.locale_name }}({{ scope.row.type_name }})
        </template>
      </el-table-column>
      <el-table-column
        label="状态">
        <template slot-scope="scope">
          {{ scope.row.marking_name }}({{ scope.row.service.marking_name }})
        </template>

      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" class="orangeText" v-if="(scope.row.type == 'offline')&&((scope.row.service.marking == 'WAIT_INSPECT') || (scope.row.service.marking == 'INSPECTING'))" @click="goReportDetail(scope.row)"> 下载模版</el-button>
          <el-button type="text" class="orangeText"  @click="uploadReport(scope.row)" v-if="(scope.row.type == 'offline')&&(scope.row.service.marking == 'INSPECTING')">上传报告</el-button> 
          <el-button type="text" class="orangeText" @click="goReportDetail(scope.row,true)" v-if="(scope.row.type == 'online')&&(scope.row.service.marking == 'INSPECTING')&& (scope.row.marking == 'WAIT_MODIFY')">修改报告</el-button>
          <el-button type="text" class="orangeText" v-if="(scope.row.type == 'online')&&(scope.row.service.marking=='INSPECTING')&& (scope.row.marking == 'WAIT_MODIFY')" @click="viewReasons(scope.row)">查看原因</el-button>
          <el-button type="text" class="orangeText" v-if="(scope.row.type == 'online')&&(scope.row.service.marking == 'INSPECTING')&& (scope.row.marking == 'WAIT_WRITE')" @click="goReportDetail(scope.row,false)">写报告</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 抢单对话框 -->
    <el-dialog
      :visible.sync="centerDialogVisible"
      width="30%"
      top="30vh"
      center>
      <span>{{ grabSheetText }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button class="cancle" @click="centerDialogVisible = false">否</el-button>
        <el-button type="primary" class="confirm" @click="confirmgrabSheet()">是</el-button>
      </span>
    </el-dialog>

    <!-- 不可抢对话框 -->
    <el-dialog
      title="不可抢原因"
      :visible.sync="noRobbing"
      width="25%"
      top="30vh"
      center>
      <span>{{ noRobbingText }}</span>
      <span slot="footer" class="dialog-footer">
        <!-- <el-button class="cancle" @click="centerDialogVisible = false">否</el-button>
        <el-button type="primary" class="confirm" @click="confirmgrabSheet()">是</el-button> -->
      </span>
    </el-dialog>
    <!-- 报告拒绝原因弹框 -->
    <el-dialog
      :visible.sync="reasonsVisible"
      width="30%"
      left>
      <el-table :data="reasonsData" style="width: 100%">
        <el-table-column type="index"  ></el-table-column>
        <el-table-column property="created_at" label="时间" ></el-table-column>
        <el-table-column property="remark" label="原因" ></el-table-column>
      </el-table>
      <!-- <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="centerDialogVisible = false">确 定</el-button>
      </span> -->
    </el-dialog>

    <div class="productBorder">
      <el-dialog :visible.sync="dialogTableVisible" title="产品名称" class="detail-dialog" width="400px" >
        <el-table :data="gridData" border height="200">
          <el-table-column type="index" label="序号" width="100" align="center"/>
          <el-table-column property="name" label="产品名称" align="center"/>
        </el-table>
      </el-dialog>
    </div>

  </div>
</template>
<script>
import store from '@/store/'
import { mapGetters } from 'vuex'
import { grabSheet, confirmgrabSheet , qualification} from '@/api/dashboard'
import { getWallet } from '@/api/walletDetail'
import { getReportList , getReason } from '@/api/report'
export default {
  name: '',
  components: { },
  data() {
    return {
      // 不通过原因
      reasonsVisible:false,
      reasonsData:[],
      fullscreenLoading:true,
      orderInformation:{},
      balance: '0',
      tableData: [
      ],
      tableData2: [
      ],
      centerDialogVisible: false,
      dialogTableVisible: false,
      gridData: [],
      grabSheetText: '',
      orderService: '',
      canConfirm: false,
      canChase: false,
      noRobbing:false,
      noRobbingText:'',
      // 资料完善度
      informationComplete:true,
      qualification:{
        main_assist_order:'',
        report_language:'',
        reject_description:'',
        category_tags:{
        }
      }
    }
  },
  computed: {
    ...mapGetters([
      'inspector'
    ])
  },
  created() {
    store.dispatch('GetUserInfo')
    this.getgrabSheet()
    this.getWallet()
    this.getReportList()
    this.getQualification()
    
  },
  mounted() {
    // console.log(this.$route.fullPath)
  },
  methods: {
    getgrabSheet() {
      grabSheet({}).then(response => {
        if (response.data.code == 0) {
          this.tableData = response.data.data
        }
      })
    },
    goGrabList() {
      this.$router.push({
        path: 'grabList'
      })
    },
    // 获取钱包信息
    getWallet() {
      getWallet({}).then(res => {
        if (res.data.code == 0) {
          this.balance = res.data.data.list.find(t => t.currency == 'CNY').price
        }
      })
    },
    // 获取产品名称详情
    getDetail(row) {
      this.dialogTableVisible = true
      this.gridData = row.products.map((item, index) => {
        return item       
      })
    },
    // 显示抢单弹框
    showGrabSheetPump(row) {
      if(row.can.chase==false && row.can.confirm==false){
        // 显示不可抢弹框
        this.noRobbing = true
        this.noRobbingText = row.can_messages.chase
      }else{
        this.orderService = row.id   
        this.orderInformation = _.cloneDeep(row)
        this.grabSheetText = row.is_main == false ? `此单为辅单，订单金额为￥${Number(row.commission) + Number(row.other_fee)}，您确认抢此订单吗？` : `订单金额￥${Number(row.commission) + Number(row.other_fee)}，需要写${this._.map(_.uniqBy(row.reports, 'locale'), 'locale_name')}报告您确认抢此订单吗？`
        this.centerDialogVisible = true
        this.canConfirm = row.can.confirm
        this.canChase = row.can.chase
      }   
    },
    
    // 抢单
    confirmgrabSheet() {
      let chaseText
      if (this.canConfirm) {
        chaseText = 'confirm'
      } else {
        (
          chaseText = 'chase'
        )
      }
      confirmgrabSheet({
        url: `v1/inspector/service/${this.orderService}/${chaseText}`
      }).then(response => {
        if (response.data.code == 0) {  
          this.centerDialogVisible = false
          this.getgrabSheet()
          this.$router.push({
            path: 'SuccessfulSingle',
            query:{
              orderInformation:this.orderInformation
            }
          })
        }
      })
    },
    // 跳转钱包账户
    goWalletAccount() {
      this.$router.push({
        path: 'accountManagement/wallet/withdrawCash'
      })
    },
    // 跳转专业资料
    goProfessiondData() {
      this.$router.push({
        path: 'accountManagement/professiondData'
      })
    },
    // 跳转钱包详情
    goWalletDetail() {
      this.$router.push({
        path: 'accountManagement/wallet'
      })
    },
    // 近期待办事项列表
    getReportList() {
      getReportList({}).then(res => {
        if (res.data.code == 0) {
          this.tableData2 = res.data.data
        }
      })
    },
    // 跳转报告管理
    goReporteManager(){
      this.$router.push({
        path: '/orderManagement/reporteManager'
      })
    },
    // 获取抢单资格
    getQualification(){
      qualification().then(res=>{
        if (res.data.code == 0) {
          this.qualification = res.data.data
          this.fullscreenLoading = false
          // this.tableData2 = res.data.data
        }
      })
    },
    getBool(Array,number){
      return Array.indexOf(number)>=0 ? true : false
    },
    getProductDetail(Array){
      this.dialogTableVisible = true
      this.gridData = Array.map((item, index) => {
        return {
          name: item.name
        }
      })
    },
    // 写报告
    goReportDetail(row,bool) {
      this.$router.push({
        path: '/orderManagement/reporteManager/writeReporte', query: { id: row.id ,modify:bool}
      })
    },
    // 上传报告
    uploadReport(row){
      this.$router.push({
        path: '/orderManagement/reporteManager/uploadReport', 
        query: { id: row.id }
      })
    },
    // 去订单详情
    goOrderDetail(row) {
      this.$router.push({ path: '/orderManagement/orderDetails', query: { orderId:row.id}})
    },
    // 报告详情
    goReportsDetail(row) {
      this.$router.push({ path: '/orderManagement/orderDetails', query: { orderId:row.service.id}})
    },
    // 取消原因
    viewReasons(row){
      this.getReasons(row.id)
      this.reasonsVisible = true     
    },
    // 原因数据
    getReasons(row){
      getReason(row).then(res =>{
        if(res.data.code == 0){
          let data = res.data.data
          this.reasonsData = data
        }
      })
    }
    
  }
}
</script>
<style lang="scss">
.controlboard{
    .el-table td{
        font-size:12px;
        color:#50688C;
    }
    .el-dialog--center .el-dialog__body {
        text-align: center ;
        color:rgba(124,143,166,1);
        font-size:16px;
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
        .el-dialog__body{
          text-align: center;
        padding: 0;
        }
    }
    .el-popover{
      text-align: center;
    }
}

</style>
<style rel="stylesheet/scss" lang="scss" scoped>
$TotleLeft:500px;
.controlboard {
    margin: 32px 40px 0 39px;
    // 公共头部
    .nomarlTop{
        width: 100%;
        overflow: hidden;
        .left{
            float: left;
            display: block;
            font-size: 16px;
            color: #50688C;
            padding: 0 16px;
            border-left: 3px solid #67C23A;

        }
        .right{
            float: right;
            font-size: 16px;
            color: #F5A623;
        }
    }
    .orangeText{
      color:#FFA800;
      font-size:12px !important;
      display: inline-block;
    }
    // 抢单列表
    .grabSheet{
        margin-top: 16px;
         .btnText{
            color:#158BE4;
            font-size:12px !important;
            display: inline-block;
        }
        .numberBg{
            display:inline-block;
            // paddding:5px;
            border-radius:6px;
            width:22px;
            height:22px;
            color:#ffffff;
            text-align:center;
            line-height:22px;
            background:rgba(74,144,226,1);
        }
    }
    // 钱包余额 抢单资格
    .walletMiddle{
        margin-top: 25px;
        overflow: hidden;
        .wallet{
            // width: 450px;
            // float: left;
            .walletContent{
                margin-top: 15px;
                width: 100%;
                height: 140px;
                border-radius:4px;
                border:1px solid rgba(230,234,238,1);
                background:rgba(255,255,255,1);
                .number{
                   font-size:30px;
                   color:rgba(21,139,228,1);
                   text-align: center;
                   margin-top: 24px;
                }
                .btn{
                    display: block;
                    margin: 0 auto;
                    text-align: center;
                   width:120px;
                    height:40px;
                    background:rgba(103,194,58,1);
                    color:rgba(255,255,255,1);
                    font-size:16px;
                    margin-top: 16px;
                }
            }
        }
        .grabQualification{
            // width: calc(100%- #{$TotleLeft});
            // width: 1040px;
            // min-width: 800px;
            // float: left;
            // margin-left: 50px;
            .grabContent{
                 margin-top: 15px;
                width: 100%;
                height: 140px;
                border-radius:4px;
                border:1px solid rgba(230,234,238,1);
                background:rgba(255,255,255,1);
                .number{
                   font-size:20px;
                   color:#50688C;
                   text-align: center;
                   margin-top: 24px;
                }
                .btn{
                    display: block;
                    margin: 0 auto;
                    text-align: center;
                    width:120px;
                    height:40px;
                    background:rgba(103,194,58,1);
                    color:rgba(255,255,255,1);
                    font-size:16px;
                    margin-top: 16px;
                }
                .noneStyle{
                  float:none;
                  display:block;
                  text-align:center;
                }
                .completeMessage{
                  padding:34px 38px;
                  .informationContent{
                    width: 220px;
                    .informationTitle{
                      text-align:center;
                      color:#4A90E2;
                      font-size:16px;
                    }
                    .informationList{
                      margin-top:27px;
                      color:#50688C;
                      font-size:14px;
                      i{
                        margin-left:8px;
                        font-size:14px;
                        color:#768CAA;
                      }
                      &>span:nth-child(2){
                        margin-left:39px;
                      }
                      &>span:nth-child(3){
                        margin-left:39px;
                      }
                    }
                  }
                  .line{
                    width: 1px;
                    height: 50px;
                    background:#DFE3E9;
                    margin:10px 30px 0;
                  }
                }
            }
        }
    }
    .backlog{
        margin-top: 24px;
    }
    .dialog-footer{
       .cancle{
            width:98px;
            height:40px;
            border:1px solid rgba(144,147,153,1);
            color: #909399;
       }
       .cancle:hover{
           background-color: #ffffff;
       }
       .confirm{
            width:98px;
            height:40px;
            background:rgba(255,168,0,1);
            color: 14px;
            border: none;
       }
    }
}
</style>
