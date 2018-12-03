<template>
  <div class="pay">
        <p class="t1">注：如果您对我们的报价有疑惑，请联系测库工作人员</p>
        <el-table
            :data="tableData"
            style="width: 100%" class="tableData">
            <el-table-column
                prop="number"
                label="订单号"
                width="180">
            </el-table-column>
            <el-table-column
                label="产品名称">
                <template slot-scope="scope">
                    <span v-if="scope.row.products.length==1">{{scope.row.products[0]}}</span>
                    <span v-else-if="scope.row.products.length>1"><span style="display:inline-block;width:150px;">{{scope.row.products[0]}}...</span><i style="margin-left:20px" class="iconfont icon-IconCopy" @click="getDetail(scope.row)"/></span>
                </template>
            </el-table-column>
            <el-table-column
                label="供应商">
                <template slot-scope="scope">
                    {{scope.row.supplier.name}}
                </template>
            </el-table-column>
            <el-table-column
                label="工作量">
                <template slot-scope="scope">
                    {{scope.row.workload}}人天
                </template>
            </el-table-column>
            <el-table-column
                label="订单金额">
                 <template slot-scope="scope">
                    <span>{{ calculateMoney(scope.row.fees)}}</span>
                    <span class="tc-separate" v-if="scope.row.fees.supplementary">
                        <span v-for="(item,index) in scope.row.fees.supplementary" :key = index>
                            {{item.name}}¥{{item.currencies.CNY}}/${{item.currencies.CNY}}
                        </span>
                    </span> 
                </template>
            </el-table-column>
        </el-table>         
        <el-form class="form-content" label-width="100px">
            <el-form-item label="付款币种"> 
                <el-radio-group v-model="moneyType">
                    <el-radio :label="1" @change="CNY()">人民币</el-radio>                                                              
                    <el-radio :label="2" @change="USD()">美元</el-radio>                                                
                </el-radio-group>
            </el-form-item>
            <el-form-item label="发票类型"> 
                <el-radio-group v-model="invoicetype">
                    <el-radio :label="0">不开发票</el-radio>
                    <el-radio :label="1">增值税发票</el-radio>
                    <el-radio :label="2">普通发票</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="开票公司" v-if="invoicetype!=0"> 
                <el-select v-model="invoiceCompany" placeholder="请选择">
                    <el-option
                    v-for="item in invoiceList"
                    :key="item.company_name"
                    :label="item.company_name"
                    :value="item.id">
                    </el-option>
                </el-select>
                <el-button type="success" icon="el-icon-plus" @click="addInvoiceCompany()">新增开票公司</el-button>
            </el-form-item>
            <el-form-item label="发票收件人" v-if="invoicetype!=0"> 
                <el-select v-model="recipients" placeholder="请选择">
                    <el-option
                    v-for="item in addressee"
                    :key="(item.last_name+item.first_name)"
                    :label="(item.last_name+item.first_name)"
                    :value="item.id">
                    </el-option>
                </el-select>
                <el-button type="success" @click="addressPump()" icon="el-icon-plus">新增寄送地址</el-button>
            </el-form-item>
            <el-form-item label="应付金额"> 
                <span class="money-text">{{shouldpay}}</span>
            </el-form-item> 
            <el-form-item label="付款方式"> 
                <ul class="paystyle" v-if="CNYPayShow">
                    <li v-for="(item,index) in CNYPay" :key="index">
                        <span v-if="item.id==1"><el-radio v-model="paymentTypeId" :label="item.id">{{item.trans_name}}</el-radio></span>
                        <span v-if="item.id==2"><el-radio v-model="paymentTypeId" :label="item.id">{{item.trans_name}}</el-radio></span>
                        <span v-if="item.id==3"><el-radio v-model="paymentTypeId" :label="item.id">{{item.trans_name}}</el-radio></span>
                        <span v-if="item.id==4"><el-radio v-model="paymentTypeId" :label="item.id">{{item.trans_name}}</el-radio></span>
                        <span v-if="item.id==6"><el-radio v-model="paymentTypeId" :label="item.id">{{item.trans_name}}</el-radio></span>
                    </li>
                    <!-- <li><el-radio v-model="radio1" label="2">支付宝</el-radio></li> -->
                </ul>
                <ul class="paystyle" v-if="USDPayShow">
                    <li v-for="(item,index) in USDPay" :key="index">
                        <span v-if="item.id==5"><el-radio v-model="paymentTypeId" :label="item.id">{{item.trans_name}}</el-radio></span>
                        <span v-if="item.id==9"><el-radio v-model="paymentTypeId" :label="item.id">{{item.trans_name}}</el-radio></span>
                    </li>
                    <!-- <li><el-radio v-model="radio1" label="2">支付宝</el-radio></li> -->
                </ul>
                <!-- <span class="money-text">{{shouldpay}}</span> -->
            </el-form-item> 
            <el-form-item label="支付密码"> 
                <el-input placeholder="请输入密码" style="width:280px;" v-model="password"></el-input>
                <span class="tip">忘记密码?</span>
            </el-form-item>  
            <el-form-item label=""> 
                <el-button type="warning" class="confirmPay" :disabled="paymentTypeId=='' || password==''" @click="confirmPay()">确定付款</el-button>
            </el-form-item>                                                            
        </el-form>
        <el-dialog title="新增发票信息" :visible.sync="dialogFormVisible" width="600px" center>
            <el-form :model="form" :rules="rules" ref="form" :label-width="formLabelWidth">
                <el-form-item label="公司名称：" prop="company_name">
                    <el-input v-model="form.company_name"></el-input>
                </el-form-item>
                <el-form-item label="纳税人识别号：" prop="tax_id_number">
                    <el-input v-model="form.tax_id_number"></el-input>
                </el-form-item>
                <el-form-item label="开户银行：" prop="bank">
                    <el-input v-model="form.bank"></el-input>
                </el-form-item>
                <el-form-item label="银行账号：" prop="bank_account">
                    <el-input v-model="form.bank_account"></el-input>
                </el-form-item>
                <el-form-item label="单位电话：" prop="telephone">
                    <el-input placeholder="请输入内容" v-model="form.telephone" class="input-with-select">
                        <el-select v-model="form.telephone_code" slot="prepend" placeholder="请选择" style="width:150px;">
                        <el-option label="86" value="1"></el-option>
                        <el-option label="86" value="2"></el-option>
                        <el-option label="86" value="3"></el-option>
                        </el-select>
                    </el-input>
                </el-form-item>
                <el-form-item label="单位地址：" prop="address">
                    <el-input v-model="form.address"></el-input>
                </el-form-item>
                <el-form-item label="详细地址：" prop="detailed_address">
                    <el-input type="textarea" v-model="form.detailed_address"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false" class="cancle">取 消</el-button>
                <el-button type="primary" @click="submit()" class="submit">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="新增寄送地址" :visible.sync="addressdialogFormVisible" width="600px" center>
            <el-form :model="addressform" :rules="addressrules" ref="addressform" :label-width="invoiceLabelWidth" :inline="true">
                <el-form-item label="收件人姓：" label-width="130px" prop="company_name">
                    <el-input v-model="addressform.last_name"  style="width:160px"></el-input>
                </el-form-item>
                <el-form-item label="名：" prop="company_name" label-width="40px">
                    <el-input v-model="addressform.first_name"  style="width:160px"></el-input>
                </el-form-item>
                <br>
                <el-form-item label="收件地址：" prop="address">
                    <el-input v-model="addressform.address"   style="width:375px"></el-input>
                </el-form-item>
                <br>
                <el-form-item label="详细地址：" prop="detailed_address">
                    <el-input type="textarea" style="width:375px" v-model="addressform.detailed_address" ></el-input>
                </el-form-item>
                <br>
                <el-form-item label="收件人手机号：" prop="telephone">
                    <el-input placeholder="请输入内容" v-model="addressform.telephone" class="input-with-select" style="width:375px">
                        <el-select v-model="addressform.telephone_code" slot="prepend" placeholder="请选择" style="width:150px;">
                        <el-option label="86" value="1"></el-option>                                                                                                                                                            
                        <el-option label="86" value="2"></el-option>
                        <el-option label="86" value="3"></el-option>
                        </el-select>
                    </el-input>
                </el-form-item>
                <br>
                <el-form-item label="收件人固定号：" prop="fixed_telephone">
                    <el-input placeholder="请输入内容" v-model="addressform.fixed_telephone" class="input-with-select" style="width:375px"> 
                        <el-select v-model="addressform.fixed_telephone_code" slot="prepend" placeholder="请选择" style="width:150px;">
                        <el-option label="86" value="1"></el-option>
                        <el-option label="86" value="2"></el-option>
                        <el-option label="86" value="3"></el-option>
                        </el-select>
                    </el-input>                     
                </el-form-item>                                                     
            </el-form>                                                  
            <div slot="footer" class="dialog-footer">                   
                <el-button @click="addressdialogFormVisible = false" class="cancle">取 消</el-button>
                <el-button type="primary" @click="addresssubmit()" class="submit">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 钱包支付成功 -->
        <el-dialog
            title=""
            :visible.sync="successDialogVisible"
            width="600px"
            center
            class="successDialog">
                <div class="success-content">
                    <img src="/static/image/success.png" alt="">
                    <p>支付成功</p>
                    <el-button type="primary" class="comfirm" @click="successDialogVisible = false">确 定</el-button>
                </div>
        </el-dialog>
        <!-- 钱包支付失败 -->
        <el-dialog
            title=""
            :visible.sync="failDialogVisible"
            width="600px"
            center
            class="successDialog">
                <div class="success-content">
                    <!-- <img src="/static/image/success.png" alt="">
                     -->
                     <i class="iconfont icon-Fill3"/>
                    <p>{{wrongMessage}}</p>
                    <el-button type="primary" class="comfirm" @click="successDialogVisible = false">确 定</el-button>
                </div>
        </el-dialog>
  </div>
</template>

<script>


import {addInvoice,addAddress,getInvoiceList,getAddressList} from "@/api/accountManagement";
import {orderDetail,confirmPay,surePay} from "@/api/order";

let newTab;

export default {
  name: "",
  components: {},
  data() {
    return {
      successDialogVisible:false,
      failDialogVisible:false,
      wrongMessage:'',
      tableData: [],
      CNYPay:[],
      USDPay:[],
      CNYPayShow:true,
      USDPayShow:false,
      total: 0,
      shouldpay: "",
      password:'',
      moneyType:1,
      invoicetype:0,
      payurl:'',
      paymentTypeId:'',
      invoiceCompany:'',
      recipients:'',
      listLoading: true,
      dialogFormVisible:false,
      addressdialogFormVisible:false,
      value:'',
      radio1:'',
      order:this.$route.query.order,
      paymentOrder:'',
      form:{
          address:[1,2,3]
      },
      rules:{
            company_name:[{ required: true, message: '请输入公司名称', trigger: 'blur' }],    
            tax_id_number:[{ required: true, message: '请输入纳税人识别号', trigger: 'blur' }],  
            bank:[{ required: true, message: '请输入开户银行', trigger: 'blur' }],  
            bank_account:[{ required: true, message: '请输入银行账号', trigger: 'blur' }],  
            telephone:[{ required: true, message: '请输入单位电话', trigger: 'blur'}],
            address:[{ required: true, message: '请输入单位地址', trigger: 'blur'}],
            detailed_address:[{ required: true, message: '请输入详细地址', trigger: 'blur'}],
      },
      addressform:{
          address:[1,2,3]
      },
      addressrules:{
        last_name:[{required: true, message: '请输入收件人姓', trigger: 'blur'}],
        first_name:[{required: true, message: '请输入名', trigger: 'blur'}],
        address:[{ required: true, message: '请输入单位地址', trigger: 'blur'}],
        detailed_address:[{ required: true, message: '请输入详细地址', trigger: 'blur'}],
        telephone:[{ required: true, message: '请输入单位电话', trigger: 'blur'}],
        fixed_telephone:[{ required: true, message: '请输入收件人固定号码', trigger: 'blur'}],
      },
      formLabelWidth:'140px',
      invoiceLabelWidth:'130px',
      invoiceList: [
        {
          company_name: "",
          id: ""
        }
      ],
      addressee: [
        {
            last_name:'',
           first_name: "",
           id: ""
        }
      ],
      listQuery: {
        page: 1,
        limit: 20
      }
    };
  },
  computed: {
    // cachedViews() {
    //   return this.$store.state.tagsView.cachedViews
    // },
    // key() {
    //   return this.$route.fullPath
    // }
  },
  created(){
      this.orderDetail()
      this.getcompanyname()
      this.getaddress()
  },
  methods:{
      addInvoiceCompany(){
          this.dialogFormVisible = true
      },
      submit(){
          this.$refs['form'].validate((valid) => {
            if (valid) {
                addInvoice({
                    ...this.form,
                    address:[1,2,3]
                }).then(response => {
                    if(response.data.code == 0){
                        this.dialogFormVisible = false
                    }
                })
            }
          })
          
      },
      addressPump(){
          this.addressdialogFormVisible = true
      },
      addresssubmit(){
          this.$refs['addressform'].validate((valid) => {
            if (valid) {
                addAddress({
                    ...this.addressform
                }).then(response => {
                    if(response.data.code == 0){
                        this.addressdialogFormVisible = false
                    }
                })
            }
          })
      },
      getcompanyname(){
          getInvoiceList().then(response =>{
              if(response.data.code == 0){
                  this.invoiceList = response.data.data.list
              }
          })
      },
      getaddress(){
          getAddressList().then(response =>{
               if(response.data.code == 0){
                  this.addressee = response.data.data.list
              }
          })
      },
      orderDetail(){
          orderDetail({
              url:'/v1/order/'+ this.$route.query.order +'/pay'
          }).then(response =>{
              this.tableData = []
              this.tableData.push(response.data.data)
              this.CNYPay = response.data.data.select.CNY
              this.USDPay = response.data.data.select.USD
              this.paymentOrder = response.data.data.payment.orderid
              this.CNYShouldPay = response.data.data.payment.price.CNY.fee
              this.USDShouldPay = response.data.data.payment.price.USD.fee
              this.shouldpay = "¥" + this.CNYShouldPay 
          })  
      },
    //   计算工作量
    // calculateattch(value){
    //      _.each(value.main, fee => {
    //         CNYpay += Number(fee.currencies.CNY)
    //         USDpay += Number(fee.currencies.USD)
    //     })
    // },
    //   计算总金额
    calculateMoney(value){
        let CNYpay =  0
        let USDpay = 0
        let fees = ''
        _.each(value.main, fee => {
            CNYpay += Number(fee.currencies.CNY)
            USDpay += Number(fee.currencies.USD)
        })
        USDpay = USDpay==0 ? '' : '/$'+USDpay
        fees = "¥" + CNYpay + USDpay
        return fees;
    },
     //  人民币支付
    CNY(){
     this.CNYPayShow = true   
      this.USDPayShow = false 
      this.shouldpay = "¥" + this.CNYShouldPay 
    },
    //  美元支付
    USD(){
     this.USDPayShow = true 
     this.CNYPayShow = false 
     this.shouldpay = "$" + this.USDShouldPay  
    },
    //  预付款
    confirmPay(){
        if(this.paymentTypeId ==1){
            newTab = window.open();
        } 
        confirmPay({
           url:'/v1/payment/pay/select/' + this.paymentOrder + '/' + this.paymentTypeId
        }).then(response =>{
            let responsed = response.data
            if(responsed.code ==0 ){
                this.payurl = responsed.data.url
                this.surePay()
            }
        })
    },
    //  付款
    surePay(){
        surePay({
            url: this.payurl,
            password:this.password
        }).then(response =>{
            let res = response.data
            if(this.paymentTypeId ==2 && res.code == 0){
                this.successDialogVisible = true
            }else if(this.paymentTypeId ==2 && res.code != 0){    
                this.wrongMessage = res.data.message
                this.failDialogVisible = true
            }else if(this.paymentTypeId ==1){
                const div = document.createElement('div');
                div.innerHTML = res; // html code
                newTab.document.body.appendChild(div);
                newTab.document.forms.alipaysubmit.submit()
            }
        })
    }

  },
  mounted() {
    // console.log(this.$route.fullPath)
  }
};
</script>
<style>
.el-radio + .el-radio {
  margin-left: 115px;
}
.el-radio__input.is-checked .el-radio__inner {
  border-color: #ffa500;
  background: #ffa500;
}
.el-radio__input.is-checked + .el-radio__label {
  color: #ffa500;
}
.el-dialog__header {
    padding: 50px 20px 10px;
    text-align: center;
    color: #7C8FA6;
}
.el-dialog__title {
    font-size: 16px;
    color: #7C8FA6;
    font-weight: bold;
}
.el-table th{
    text-align: center;
}
.el-table td{
    text-align: center;
    font-size: 12px;
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
.tc-separate {
span + span {
&::before {
content: ' ，';
}
}
span:first-child{
    &::before {
content: ' (';
}
}
span:last-child{
    &::after {
content: ' ) ';
}
}
}
.dialog-footer{
  .cancle{
    color: #909399;
  }
  .submit{
    color: #ffffff;
    background:#FFA800;
    outline:none;
    border:1px solid #FFA800;
  }
}
.pay {
  margin: 22px 50px 0 100px;
  .t1 {
    font-size: 16px;
    color: #6f90ae;
  }
  .tableData {
    margin-top: 20px;
    border-left: 2px solid #158be4;
  }
  .form-content {
    margin-top: 20px;
    .money-text {
      font-size: 24px;
      font-weight: bold;
      color: #158be4;
    }
    .paystyle{
        width: 600px;
        li{
            border-bottom: 1px solid #C0C4CC;
            padding: 20px 0;
        }
        li:first-child{
            padding: 0 0 20px;
        }
    }
    .tip{
        margin-left: 16px;
        cursor: pointer;
        color: #158BE4;
    }
    .confirmPay{
        width: 250px;
        height: 40px;
        font-size: 16px;
        background: #FFA800;
        border: none;
    }
  }
}
.successDialog{
    .success-content{
        width: 240px;
        margin: 0 auto;
        i{
            width: 80px;
            font-size: 80px;
            color: #67C23A;
            display: block;
            margin: 0 auto;
        }
        img{
            display: block;
            margin: 0 auto;
        }
        p{
            width: 240px;
            margin: 14px 0 30px;
            text-align: center;
        }
        .comfirm{
            width: 240px;
            height: 40px;
            background-color:#FFA800;
            border: none;
        }
    }
}
</style>

