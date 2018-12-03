<template>
  <div class="walletAccount">
    <!-- wallet-index -->
    <div v-if="walletIndex" class="wallet-index">
      <div class="walletAccount-Ac">
        <p class="walletAccount-Ac-name">钱包账户</p>
        <div class="walletAccount-Ac-recharge">
          <div class="walletAccount-Ac-recharge-rmb">
            <p>
              <span>人民币</span>
              <span>￥ 8989.89</span>
            </p>
            <p @click="jumpPayRmb">去充值</p>
          </div>
          <div class="walletAccount-Ac-recharge-line"/>
          <div class="walletAccount-Ac-recharge-dollar">
            <p>
              <span>美元</span>
              <span>$ 8989.89</span>
            </p>
            <p @click="jumpDollar">去充值</p>
          </div>
        </div>
      </div>
      <div class="walletAccount-detail">
        <p class="walletAccount-detail-name">钱包明细</p>
        <div class="walletAccount-detail-list">
          <ul>
            <li>创建时间</li>
            <li>
              <div class="block">
                <el-date-picker
                  v-model="value10"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy 年 MM 月 dd 日"/>
              </div>
            </li>
            <li/>
            <li>
              <div class="block">
                <el-date-picker
                  v-model="value11"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy 年 MM 月 dd 日"/>
              </div>
            </li>
            <li>交易类型</li>
            <li>
              <el-select v-model="value1" placeholder="请选择">
                <el-option
                  v-for="item in options1"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"/>
              </el-select>
            </li>
            <li>状态</li>
            <li>
              <el-select v-model="value2" placeholder="请选择">
                <el-option
                  v-for="item in options2"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"/>
              </el-select>
            </li>
            <li>查询</li>
          </ul>
          <ul class="wallet-tableDate-ul">
           <el-table
                :header-cell-style="{background:'#F5F8FA'}"
                :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)"
                style="width: 100%">
                <el-table-column
                fixed
                prop="money_id"
                label="流水号"
                width="237">
                </el-table-column>
                <el-table-column
                prop="created_at"
                label="创建时间"
                width="200">
                </el-table-column>
                <el-table-column
                prop="price"
                label="金额"
                width="200">
                <template slot-scope="scope">
                    <span :class="{tableDataadd:tableDataadd,tableDatareduce:tableDatareduce}">￥</span>
                </template>
                </el-table-column>
                <el-table-column
                prop="type"
                label="交易类型"
                width="200">
                </el-table-column>
                <el-table-column
                prop="status"
                label="状态"
                width="200">
                </el-table-column>
                <el-table-column
                fixed="right"
                label="操作"
                width="381">
                <template slot-scope="scope">
                    <el-button @click="handleClick(scope.row, scope.$index)" type="text" size="small">详情</el-button>
                    <el-button type="text" size="small"></el-button>
                </template>
                </el-table-column>
            </el-table>
          </ul>
          <ul>
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-sizes="[9]" 
                    :page-size="pagesize"         
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="tableData.length">    
            </el-pagination>
          </ul>
        </div>
      </div>
    </div>
    <!-- wallet-pay -->
    <div v-if="walletPayRmb" class="wallet-pay-Rmb">
      <p>人民币充值</p>
      <ul class="wallet-pay-Rmb-ul">
        <li>充值金额</li>
        <!-- <li @click="sumMin" :calss="{'class-G':isG0,'class-B':isB0}">{{ sum.min }}元</li> -->
        <li @click="sumMin" :class="{'class-G':isG0,'class-B':isB0}">{{ sum.min }}元</li>
        <li @click="sumMinA" :class="{'class-G':isGA,'class-B':isBA}">{{ sum.minA }}元</li>
        <li @click="sumMinAA" :class="{'class-G':isGAA,'class-B':isBAA}">{{ sum.minAA }}元</li>
        <li @click="sumMinAAA" :class="{'class-G':isGAAA,'class-B':isBAAA}">{{ sum.minAAA }}元</li>
      </ul>
      <p>
        <input id="sumFin" v-model="sumFin" type="text" placeholder="输入" @click="sumMinDown">
        <span>元</span>
      </p>
      <div class="payment">
        <p>付款方式</p>
        <div class="paymentAll">
          <!-- 引入组件 -->
          <pay-ment-chn @receiveDate="paymentWay"></pay-ment-chn>
        </div>
      </div>
      <!-- 点击提交 -->
      <div class="pay-rmb-submit">
        <el-button type="text" @click="centerDialogVisible = true">确定付款</el-button>
        <el-dialog
          :visible.sync="centerDialogVisible"
          width="30%"
          center>
          <p class="su-payment">你正在使用{{detailPayWayInMessage}}付款</p>
          <p class="su-payaccount">充值金额￥{{sumFin}}</p>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="centerDialogVisible = false">确定</el-button>
            <el-button @click="centerDialogVisible = false">切换付款方式</el-button>
          </span>
        </el-dialog>
      </div>
    </div>
    <div v-if="walletPayDollar" class="wallet-pay-Dollar">
      <p>人民币充值</p>
      <ul class="wallet-pay-Rmb-ul">
        <li>充值金额</li>
        <!-- <li @click="sumMin" :calss="{'class-G':isG0,'class-B':isB0}">{{ sum.min }}元</li> -->
        <li @click="sumMin" :class="{'class-G':isG0,'class-B':isB0}">{{ us.min }}美元</li>
        <li @click="sumMinA" :class="{'class-G':isGA,'class-B':isBA}">{{ us.minA }}美元</li>
        <li @click="sumMinAA" :class="{'class-G':isGAA,'class-B':isBAA}">{{ us.minAA }}美元</li>
        <li @click="sumMinAAA" :class="{'class-G':isGAAA,'class-B':isBAAA}">{{ us.minAAA }}美元</li>
      </ul>
      <p>
        <input id="sumFin" v-model="sumFinDollar" type="text" placeholder="输入" @click="sumMinDown">
        <span>美元</span>
      </p>
      <div class="payment">
        <p>付款方式</p>
        <div class="paymentAll">
          <!-- 引入组件 -->
          <!-- <pay-ment-chn></pay-ment-chn> -->
        </div>
      </div>
      <!-- 点击提交 -->
      <div class="pay-rmb-submit">
        <el-button type="text" @click="centerDialogVisible = true">确定付款</el-button>
        <el-dialog
          :visible.sync="centerDialogVisible"
          width="30%"
          center>
          <p class="su-payment" v-on:receiveDate="paymentWay($event)">你正在使用支付宝充值</p>
          <p class="su-payaccount">充值金额￥1000.00</p>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="centerDialogVisible = false">确定</el-button>
            <el-button @click="centerDialogVisible = false">切换付款方式</el-button>
          </span>
        </el-dialog>
      </div>
    </div>
    <!-- wallet-detailGo -->
    <div v-if="walletDetail" class="wallet-detailGo">
      <p>钱包详情</p>
      <!-- ul待付款倒计时提示 -->
      <ul v-show="false">
        <li>
          <span>系统将在1天23小时59分59秒后自动关闭</span>
          <span id="obligation">付款</span>
        </li>
      </ul>
      <!-- ul钱包详情 -->
      <ul>
        <li>
          <span>{{jumpDetailKeyValue.detailStatus}}</span>
          <span></span>
        </li>
        <li>
          <span>{{jumpDetailKeyValue.detailCreateTime}}</span>
          <span></span>
        </li>
        <li>
          <span>{{jumpDetailKeyValue.detailSerial}}</span>
          <span></span>
        </li>
        <li>
          <span>{{jumpDetailKeyValue.detailTradeType}}</span>
          <span></span>
        </li>
        <li>
          <span>{{jumpDetailKeyValue.detailBill}}</span>
          <span></span>
        </li>
        <li>
          <span>{{jumpDetailKeyValue.detailAmount}}</span>
          <span></span>
        </li>
        <li>
          <span>{{jumpDetailKeyValue.detailPayTime}}</span>
          <span></span>
        </li>
      </ul>
      <!-- ul汇款转账预留 -->
    </div>
  </div>
</template>

<script>
import { tableDate,tradeTypeDetail } from '@/api/walletDetail'//列表请求数据
import payMentChn from '../common/paymentCHN.vue'
export default {
    watch:{//监听点击事件
       
    },
  name: 'WalletAccount',
  components: { payMentChn },
  data() {
    return {
      a:"+",
      value10: '',
      value11: '',
      // options1交易类型
      options1: [{
        value: '选项1',
        label: '订单付款'
      }, {
        value: '选项2',
        label: '月结还款'
      }, {
        value: '选项3',
        label: '充值'
      }, {
        value: '选项4',
        label: '订单退款'
      }],
      // options2状态
      options2: [{
        value: '选项1',
        label: '待付款'
      }, {
        value: '选项2',
        label: '待审核'
      }, {
        value: '选项3',
        label: '审核中'
      }, {
        value: '选项4',
        label: '成功'
      }, {
        value: '选项5',
        label: '失败'
      }, {
        value: '选项6',
        label: '已关闭'
      }],
      // value1是交易类型数据
      value1: '',
      // value2是状态类型数据
      value2: '',
      // 钱包明细表格数据tableData
      tableData: [],
      currentPage: 1, // 初始页
      pagesize:9, // 每页的数据

      // walletindex
      walletIndex: true,
      // walletPay
      walletPayRmb: false,
      walletPayDollar:false,
      //美元选择数据
      us:{
         min: '119',
         minA: '500',
         minAA: '1000',
         minAAA: '2000'
      },
      //人民币选择数据
      sum: {
        min: '700',
        minA: '1000',
        minAA: '5000',
        minAAA: '10000'
      },
      //sumFinchinese支付双向数据绑定data
      sumFin: '',
      //sumFinDollarUS支付双向数据绑定data
      sumFinDollar:'',
      radio: '1',
      isG0:false,
      isB0:false,
      isGA:false,
      isBA:false,
      isGAA:false,
      isBAA:false,
      isGAAA:false,
      isBAAA:false,
      //点击提交数据
      centerDialogVisible: false,

      //点击详情跳转查看
      walletDetail:false,

      //详情页面的数据origin
      jumpDetailDate:[],
      jumpDetailKeyValue:{
        detailStatus:"状态",
        detailCreateTime:"创建时间",
        detailSerial:"流水号",
        detailTradeType:"交易类型",
        detailBill:this.judege,
        detailAmount:"金额",
        detailPayTime:"付款时间"
      },
       //判断是订单号是还是账单号
       judege:"",


      //用来区分table金额前面的加减号
       tableDataadd:false,
       tableDatareduce:true,

      //判断支付方式途径传递传出框中数据
      detailPayWayInMessage:""
    }

  },
  computed: {
    // cachedViews() {
    //   return this.$store.state.tagsView.cachedViews
    // },
    // key() {
    //   return this.$route.fullPath
    // }
  },
  created() {
    this.tableDateA()
  },
  mounted() {
    // console.log(this.$route.fullPath)
    
  },
  methods: {
    // 初始页currentPage、初始每页数据数pagesize和数据data
    handleSizeChange: function(size) {
      this.pagesize = size
      console.log(this.pagesize) // 每页下拉显示数据
    },
    handleCurrentChange: function(currentPage) {
      this.currentPage = currentPage
      console.log(this.currentPage) // 点击第几页
    },
    // 获取钱包明细状态信息
    tableDateA() {
      tableDate().then(response => {
        console.log(response.data.data.list)
        if (response.data.code == 0) {
          this.tableData = response.data.data.list
          console.log(this.tableData[0].money_id)
         
          for(let i=0;i<this.tableData.length;i++){
            //判断拿回来的数据进行列表交易类型判断
            if(this.tableData[i].money_id==22){
              this.tableData[i].money_id="订单付款"
            }else if(this.tableData[i].type=="1"){
              this.tableData[i].type="月结还款"
            }else if(this.tableData[i].type=="2"){
              this.tableData[i].type="充值"
            }else if(this.tableData[i].type=="3"){
              this.tableData[i].type="订单退款"
            }
            //判断拿回来的数据进行列表状态判断
            if(this.tableData[i].status=="0"){
              this.tableData[i].status="待付款"
            }else if(this.tableData[i].status=="1"){
              this.tableData[i].status="成功"
            }else if(this.tableData[i].status=="2"){
              this.tableData[i].status="已关闭"
            }
            //判断拿回来的数据进行金额数据判断
            if(this.tableData[i].ncsy==0){
              
            }
          }
          
        }
      })
    },
    //table表格操作click详情方法
    handleClick(row,index) {
        console.log(row);
        console.log(index);
        this.walletIndex=false
        this.walletDetail=true
        tradeTypeDetail().then(response =>{
          if(response.data.code == 0){
            this.jumpDetailDate=response.data.list;
          }
          // console.log('')
        })
        // if(response.data.id=="1"){

        // }
      },
    // 跳转支付
    jumpPayRmb() {
      this.walletIndex = false,
      this.walletPayRmb = true
    },
    jumpDollar(){
      this.walletIndex = false,
      this.walletPayDollar=true
    },
    // walletPayRmb
    sumMin() {
      this.sumFin = this.sum.min
      this.sumFinDollar=this.us.min
      this.isG0=true
      this.isB0=false
      this.isBA=true
      this.isBAA=true
      this.isBAAA=true
    },
    sumMinA() {
      this.sumFin = this.sum.minA
      this.sumFinDollar=this.us.minA
      this.isGA=true
      this.isB0=true
      this.isBA=false
      this.isBAA=true
      this.isBAAA=true
    },
    sumMinAA() {
      this.sumFin = this.sum.minAA
      this.sumFinDollar=this.us.minAA
      this.isGAA=true
      this.isB0=true
      this.isBA=true
      this.isBAA=false
      this.isBAAA=true
    },
    sumMinAAA() {
      this.sumFin = this.sum.minAAA
      this.sumFinDollar=this.us.minAAA
      this.isGAAA=true
      this.isB0=true
      this.isBA=true
      this.isBAA=true
      this.isBAAA=false
    },
    sumMinDown(){
      this.isB0=true
      this.isBA=true
      this.isBAA=true
      this.isBAAA=true
    },
    // 提交传递数据
    paymentWay(evl){
      if(evl=="1"){
        this.detailPayWayInMessage="银联";
      }else if(evl=="2"){
         this.detailPayWayInMessage="支付宝";
      }else if(evl=="3"){
        this.detailPayWayInMessage="测库月结";
      }else if(evl=="4"){
        this.detailPayWayInMessage="钱包";
      }
      
      console.log(evl)
    }

  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
  // walletAccount
.walletAccount{
  //walletAccount-detail
  .walletAccount-detail{
      //改变钱包明细列表样式
      .wallet-tableDate-ul{
        // .el-table .cell, .el-table th div{
        //   padding-left:39px;
        // }
        // //表头
        // .el-table__header-wrapper{
        //   tr{
        //     th{
        //       // padding-left:39px;
        //       div{
        //         text-align: left !important;
        //         padding-left:0 !important;
        //       }  
        //     }
        //   }
        // }
        // .el-table__row{
        //   //table表格 el-table_3_column_1操作样式改变
        //   td{
        //     // text-align: center;
        //     span{
        //       color:#FFA800 !important;
        //     }
        //   }
        // }
        .el-button--text{
          color:#FFA800;
        }
      }  
  }
  // pagination
  .el-pagination{
    //当前总页数
    .el-pagination__total{
      color:#7F8FA4 !important;
      font-size:14px !important;
      width:88px !important;
      height:36px !important;
      border:1px solid #CED0DA;
      text-align: center;
      line-height: 36px !important;
      border-radius:4px;
      cursor:pointer;
    }
    //选择页数
    .el-input__inner{
      color:#7F8FA4 !important;
      font-size:14px !important;
      // width:88px !important;
      height:36px !important;
      border:1px solid #CED0DA;
    }
    //后退
    .btn-prev,.btn-next{
      width:36px !important;
      height:36px !important;
      border:1px solid #CED0DA;
      border-radius:4px;
      text-align: center;
      padding-left:12px;
      margin-right:15px;
      color:#7F8FA4 !important;
    }
    .btn-next{
      margin-left:15px !important;
    }
    //
    //页码
    .el-pager{
      height:36px;
      .number{
        width:36px !important;
        height:100% !important;
        border:1px solid #CED0DA;
        border-radius:4px;
        text-align: center;
        line-height: 36px !important;
        margin-right:10px;
        color:#7F8FA4 !important;
      }
    }
    //跳转页码
    .el-pagination__jump{
        width:124px !important;
        height:36px !important;
        border:1px solid #CED0DA;
        border-radius:4px;
        line-height: 36px !important;
        text-align: center !important;
        background:#CED0DA;
        color:#fff !important;
        .el-input{
          float:right;
          width:68px;
          height:100%;
          overflow:hidden;
          padding:0;
          margin:0;
          border-top-left-radius:0 !important;
          border-bottom-left-radius:0 !important;
          .el-input__inner{
            border:none;
            border-radius: 0 !important;
            
          }
        }
    }
    
  }
  //rmb充值页面wallet-pay-Rmb
  .wallet-pay-Rmb,.wallet-pay-Dollar{
    //取消单选按钮el-radio__label的样式
  .el-radio{
    .el-radio__input{
      .el-radio__inner{
        width:26px !important;
        height:26px !important;
      }
    }
    .el-radio__input.is-checked .el-radio__inner{
      background:#F5A623;
      border-color:#F5A623;
    }
    .el-radio__inner:hover{
      border-color:#F5A623;
    }
    .el-radio__inner::after{
      width:6px !important;
      height:6px !important;
    }
    .el-radio__label{
      display:none !important;
    }
  }
  //弹出框样式调整
  .pay-rmb-submit{
    //点击按钮
    .el-button--medium{
      margin-left:146px;
      width:250px;
      height:50px;
      border-radius:4px;
      background:#FFA800;
      span{
        color:#fff;
        font-size:18px;
      }
    }
    //弹出框界面
    .el-dialog__wrapper{
      .el-dialog--center{
        width:600px !important;
        height:360px !important;
        border-radius:8px;
        border:none;
        //弹出框header
        .el-dialog__header{
          height:48px;
          margin-bottom:49px;
          .el-dialog__headerbtn{
            i{
              font-size:32px;
              color:#909399;
              font-weight:600;
            }
          }
        }
        //弹出框body
        .el-dialog__body{
          padding:0;
          margin-bottom:27px;
        }
        //弹出框footer
        .el-dialog__footer{
          padding:0;
          button{
            margin-left:210px !important;
            width:180px !important;
            height:40px !important;
            border:none;
            padding: 0;
            display:block;
          }
          button:nth-child(1){
            margin-bottom:16px;
            span{
              font-size:14px !important;
              color:#fff;
            }
            
          }
          button:nth-child(2){
            background:#fff;
            border:1px solid #909399;
            span{
              color:#909399;
              font-size:14px !important;
            }
          }
        }
      }
      
    }
  }
}

  
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
.walletAccount{
    padding-left:100px;
    // height:600px;
    overflow:hidden;
    .walletAccount-Ac{
        margin-bottom:32px;
        .walletAccount-Ac-name{
            height:33px;
            line-height:33px;
            font-size:16px;
            font-weight:100;
            color:#50688C;
            margin:24px 0;
        }
        .walletAccount-Ac-recharge{
            width:770px;
            height:168px;
            border:1px solid #E6EAEE;
            border-radius:4px;
            background:#fff;
            .walletAccount-Ac-recharge-rmb{
                width:383.5px;
                height:168px;
                float:left;
                p:nth-child(1){
                    height:35px;
                    margin:32px 0 22px;
                    span:nth-child(1){
                        color:#50688C;
                        font-size:24px;
                        margin-left:67px;
                    }
                    span:nth-child(2){
                        color:#158BE4;
                        font-size:26px;
                        margin-left:37px;
                    }
                }
               p:nth-child(2){
                   height:40px;
                   width:120px;
                   background:#67C23A;
                   text-align:center;
                   line-height:40px;
                   border-radius:4px;
                   color:#fff;
                   font-size:16px;
                   margin-left:132px;
                   cursor:pointer;
               }
            }
            .walletAccount-Ac-recharge-line{
                width:1px;
                height:80px;
                margin-top:46px;
                float:left;
                background:#DFE3E9;
            }
            .walletAccount-Ac-recharge-dollar{
                width:383.5px;
                height:168px;
                float:left;
                p:nth-child(1){
                    height:35px;
                    margin:32px 0 22px;;
                    span:nth-child(1){
                        color:#50688C;
                        font-size:24px;
                        margin-left:67px;
                    }
                    span:nth-child(2){
                        color:#158BE4;
                        font-size:26px;
                        margin-left:37px;
                    }
                }
               p:nth-child(2){
                   height:40px;
                   width:120px;
                   background:#67C23A;
                   text-align:center;
                   line-height:40px;
                   border-radius:4px;
                   color:#fff;
                   font-size:16px;
                   margin-left:132px;
                   cursor:pointer;
               }
            }
        }
    }
    .walletAccount-detail{
        // background:#fff;
        .walletAccount-detail-name{
            height:33px;
            line-height: 33px;
            font-size:16px;
            color:#50688C;
            margin:24px 0;
        }
        .walletAccount-detail-list{
            width:100%;
            height:682px;
            border:1px solid #E6EAEE;
            border-radius:4px;
            background:#fff;
            // padding-left:40px;
            padding-top:19px;
            ul:nth-child(1){
                height:36px;
                line-height:36px;
                padding-left:40px;
                 li{
                    list-style:none;
                    float:left;

                }
                li:nth-child(1){
                    margin-right:16px;
                    font-size:16px;
                    color:#50688C;
                }
                li:nth-child(3){
                    margin:18px 10px 0;
                    width:12px;
                    height:1px;
                    background:#C5D0DE;

                }
                li:nth-child(5){
                    margin-left:32px;
                    font-size:16px;
                    color:#50688C;
                }
                li:nth-child(6){
                    margin-left:16px;
                }
                li:nth-child(7){
                    margin-left:32px;
                    font-size:16px;
                    color:#50688C;
                    margin-right:16px;
                }
                li:nth-child(9){
                    margin-left:32px;
                    width:100px;
                    height:36px;
                    border-radius:4px;
                    background:#67C23A;
                    text-align: center;
                    line-height:36px;
                    color:#fff;
                    font-size:16px;
                    cursor:pointer;
                }
            }
            ul:nth-child(2){
                margin:18px 0 24px;
                width:100%;
                background:#F5F8FA;
            }
            ul:nth-child(3){
                margin-left:314px;
            }
        }
    }
    // wallet-pay
    .wallet-pay-Rmb,.wallet-pay-Dollar{
        padding-left:100px;
        padding-top:38px;
        p:nth-child(1){
            height:25px;
            line-height: 25px;
            font-size:16px;
            color:#50688C;
            margin-bottom:30px;
        }
        .wallet-pay-Rmb-ul{
            height:40px;
            padding:0;
            margin-bottom:24px;
            li{
                width:140px;
                height:100%;
                border:1px solid #C0C4CC;
                border-radius:4px;
                float:left;
                text-align:center;
                line-height: 40px;
                color:#909399;
                font-size:14px;
                margin-right:30px;
                cursor:pointer;
            }
            li:nth-child(1){
                border:none;
                width:64px;
                margin-right:26px;
                text-align: left;
                color:#7F8FA4;
            }
            .addBg{
                background:#67C23A;
                color:#fff;
            }
            .class-G{
                background:#67C23A;
                color:#fff;
            }
            .class-B{
                background:#F3F6F9;
                color:#909399;
            }
        }
        p:nth-child(3){
            height:40px;
            margin-left:90px;
            position:relative;
            width:300px;
            margin-bottom:24px;
            #sumFin{
                width:284px;
                height:100%;
                border:1px solid #C0C4CC;
                outline: none;
                border-radius:4px;
                color:#909399;
                font-size:14px;
                padding-left:16px;
                background:#F3F6F9;
            }
            span{
                color:#909399;
                font-size:14px;
                position:absolute;
                right:26px;
                top:13px;
            }
        }
        //payment
        .payment{
            height:320px;
            margin-bottom:24px;
            p{
                height:80px;
                color:#7F8FA4;
                font-size:14px;
                float:left;
                line-height:80px;
                margin-right:34px;

            }
            .paymentAll{
                float:left;
                height:320px;
                width:660px;
            }

        }
        //propsData
        .propsData{
            width:250px;
            height:50px;
            border:none;
            border-radius:4px;
            text-align: center;
            line-height: 50px;
            background:#FFA800;
            color:#fff;
            font-size:18px;
            margin-left:147px;
            cursor:pointer;
        }
        //pay-rmb-submit
        .pay-rmb-submit{
          p{
            height:28px;
            text-align: center;
            font-size:20px;
            color:#6F90AE;
          }
          .su-payment{
            margin-bottom:0;
          }
        }
    }
    //wallet-detailGo
    .wallet-detailGo{
      padding-top:40px;
      p{
        height:25px;
        line-height: 25px;
        font-size:16px;
        color:#50688C;
        margin-bottom:24px;
      }
      ul:nth-child(2){
        margin-bottom:24px;
        li{
          height:40px;
          line-height:40px;
          span:nth-child(1){
            display:inline-block;
            color:#FFA800;
            font-size:14px;
            margin-right:24px;
          }
          span:nth-child(2){
            display:inline-block;
            width:120px;
            height:40px;
            border-radius:4px;
            background:#67C23A;
            color:#fff;
            font-size:14px;
            text-align: center;
            line-height: 40px;
          }
        }
      }
      ul:nth-child(3){
        li{
          height:22px;
          line-height: 22px;
          margin-bottom:24px;
          span:nth-child(1){
            display: inline-block;
            width:190px;
            color:#7C8FA6;
            font-size:14px;
          }
          span:nth-child(2){
            color:#50688C;
            font-size:14px;
          }
        }
        li:last-child{
          margin-bottom:0;
        }
      }
    }
    //用来判定传过来的数据金额前面是+还是-
    .tableDataadd {
      &::before {
        content: '+';
      }
    }
    .tableDatareduce{
      &::before{
        content:'-';
      }
    }

}

</style>

