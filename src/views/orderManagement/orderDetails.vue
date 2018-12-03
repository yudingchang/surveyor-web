<template>
  <div class="order-detail">
      <div class="order-number">
          <span>订单号: {{number}}</span><span class="greencolor orderstate">({{marking_name}})</span>
          <span>下单时间: {{created_at}}</span>
          <div class="closeIcon">
              <i class="iconfont icon-guanbi_"/>
              <p>关闭</p>
          </div>
          <div class="copyIcon closeIcon">
              <i class="iconfont icon-fuzhi"/>
              <p>复制</p>
          </div>
      </div>
      <div class="supplierInformation">
          <span>供应商信息</span><span class="manDay">订单工作量{{workload}}MD需付款</span><span class="payNumber"><span>¥{{CNYpay}}</span><span>/${{USDpay}}</span></span><span class="btn">立即付款</span>  
      </div>
      <div class="productInformation">
        <el-tabs v-model="editableTabsValue2" type="card" >
          <el-tab-pane
            v-for="(item, index) in editableTabs2"
            :key="index"
            :label="'产品' + (index + 1)"
            :name="'tab' + (index + 1)">
            <div class="content">
              <el-form :model="item"  label-width="80px" class="demo-ruleForm">
                <el-form-item label="产品名称" prop="name">
                    <span class="left30">{{item.name}}</span>
                  <!-- <el-input v-model="item.name" placeholder="请输入产品名称" style="width:500px;"/>
                  <div class="copy" @click="copy(item,index)">
                    <i class="iconfont icon-fuzhi_"/>
                    <p>复制</p>
                  </div> -->
                </el-form-item>
                <el-form-item label="产品货号">
                    <span class="left30">{{item.number}}</span>
                  <!-- <el-input v-model="item.number" placeholder="请输入产品货号" style="width:500px;"/> -->
                </el-form-item>
                <el-form-item v-for="(val,i) in item.PO" :key="i" label="P.O号">
                    <span class="left30">{{val.number}}</span>
                    <span class="left30">{{val.quantity}}</span>
                    <span>{{val.unit}}</span>
                  <!-- <el-input v-model="val.number" placeholder="请输入P.O号" style="width:155px;"/> -->
                  <!-- <el-input v-model="val.quantity" placeholder="请输入数量" class="input-with-select" style="width:240px;">
                    <el-select slot="append" v-model="val.unit" style="width:100px" placeholder="请选择">
                      <el-option label="件" value="1"/>
                      <el-option label="个" value="2"/>
                      <el-option label="条" value="3"/>
                    </el-select>
                  </el-input> -->
                  <!-- <el-button type="success" icon="el-icon-plus" @click="addPO(val,index)"> P.O 号</el-button>
                  <el-button v-if="i>0" type="danger" icon="el-icon-minus" @click="removePO(val,index,i)"> P.O 号</el-button> -->
                </el-form-item>
              </el-form>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="supplierDetail">
          <p>供应商信息</p>
          <div class="supplierContent">
              <el-form ref="item" :model="supplier"  label-width="100px" class="demo-ruleForm">
                <el-form-item label="供应商名称" prop="name">
                        <span class="left30">{{supplier.name}}</span>
                </el-form-item>
                <el-form-item label="联系人姓名" prop="name">
                        <span class="left30">{{supplier.last_name + supplier.first_name}}</span>
                </el-form-item>
                <el-form-item label="手机号码" prop="name">
                        <span class="left30">{{supplier.phone_number}}</span>
                </el-form-item>
                <el-form-item label="电子邮箱" prop="name">
                        <span class="left30">{{supplier.email}}</span>
                </el-form-item>
                <el-form-item label="验货地址" prop="name">
                        <span class="left30">{{supplier.address_summary + supplier.address_detail}}</span>
                </el-form-item>
              </el-form>  
          </div>
      </div>
       <div class="examineGoodsMessage">
          <p>验货基本信息</p>
          <div class="examineGoodContent">
              <el-form ref="item"  label-width="100px" class="demo-ruleForm">
                <el-form-item label="产品总数" prop="name">
                        <span class="left30">{{supplierName}}</span>
                </el-form-item>
                <el-form-item label="抽样数" prop="name">
                        <span class="left30">{{supplierFullName}}</span>
                </el-form-item>
                <el-form-item label="预计验货时间" prop="name">
                        <span class="left30">{{phone}}</span>
                </el-form-item>
                <el-form-item label="实际验货时间" prop="name">
                        <span class="left30">{{email}}</span>
                </el-form-item>
                <el-form-item label="验货类型" prop="name">
                        <span class="left30">{{address}}</span>
                </el-form-item>
                <el-form-item label="是否提供样品" prop="name">
                    <p><span class="left30">{{address}}</span></p>
                    <p class="left30"><span>测库收件人</span><span class="left30">{{address}}</span></p>
                    <p class="left30"><span>联系电话</span><span class="left30">{{address}}</span></p>
                    <p class="left30"><span>地址</span><span class="left30">{{address}}</span></p>
                </el-form-item>
              </el-form>  
          </div>
      </div>
      <div class="reportList">
          <el-table
            :data="tableData"
            border
            style="width: 90%">
            <el-table-column
            prop="date"
            label="验货时间"
            align='center'
            width="180">
            </el-table-column>
            <el-table-column
            prop="date"
            label="报告"
            align='center'
            width="180">
            </el-table-column>
            <el-table-column
            prop="name"
            label="包含产品"
            align='center'
            width="180">
            </el-table-column>
            <el-table-column
            prop="address"
            align='center'
            label="产品数量">
            </el-table-column>
            <el-table-column
            prop="address"
            align='center'
            label="抽样数量">
            </el-table-column>
            <el-table-column
            prop="address"
            align='center'
            label="抽样标准">
            </el-table-column>
            <el-table-column
            prop="address"
            align='center'
            label="报告语言">
            </el-table-column>
            <el-table-column
            prop="address"
            align='center'
            label="报告接收邮箱">
            </el-table-column>
            <el-table-column
            prop="address"
            align='center'
            label="报告模版">
            </el-table-column>
        </el-table>
      </div>
      <dir class="otherRequirements">
          <p>其它要求</p>
          <div class="otherRequirementsContent">
              <div><span class="requirementText">要求内容</span><span>{{description}}</span></div>
              <div>
                  <span class="requirementText">检验资料</span>
                  <ShowFile :fileList="files"></ShowFile>
              </div>
          </div>
      </dir>
  </div>
</template>

<script>
import ShowFile from "../../components/showfile"
import { getOrderList } from "@/api/order";
export default {
  data() {
    return {
      orderId:this.$route.query.orderId,
      number: "2018050310291584",
      marking_name: "待付款",
      created_at: "2018.08.01 12:02",
      description:'',
      workload: 1,
      files:[],
    //   fileList:'',
      CNYpay: "800",
      USDpay: "100",
      supplier:{},
      supplierName:'测库供应商',
      supplierFullName:'王大大',
      phone:'+86-11577889611',
      email:'wangdada123@qq.com',
      address:'浙江省杭州市滨江区',
      tableData: [{
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        }, {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }],
      editableTabs2: [
        {
          number: "22300188497563",
          name: "testcoo",
          title: "testcoo",
          PO: [
            {
              number: "421181199112181",
              quantity: "500",
              unit: "件"
            }
          ]
        },
        {
          number: "22300188497563",
          name: "testcoo1",
          title: "testcoo",
          PO: [
            {
              number: "421181199112181",
              quantity: "500",
              unit: "件"
            },
            {
              number: "421181199112181",
              quantity: "1000",
              unit: "个"
            }
          ]
        }
      ],
      editableTabsValue2: "tab1"
    };
  },
  created(){
      this.getOrderList()
  },
  components: {
      ShowFile
  },
  computed: {},
  methods:{
    //   获取订单详情
      getOrderList(){
          getOrderList({
              url:'/v1/inspection/'+ this.orderId
          }).then(response =>{
              if(response.data.code == 0){
                  let {number,marking_name,created_at,products,supplier,reports,workload,fees_total,description,files} = response.data.data
                  this.number = number
                  this.marking_name = marking_name
                  this.created_at = created_at
                  this.editableTabs2 = products
                  this.supplier = supplier
                  this.tableData = reports
                  this.workload = workload
                  this.CNYpay = fees_total.CNY
                  this.USDpay = fees_total.USD
                  this.description = description
                  this.files = files
              }
          })
      }
  },
  mounted() {

  }
};
</script>
<style>
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
   background: #7DC855; 
   color: #ffffff;
}
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
.order-detail {
  margin: 32px 0 0 100px;
  .greencolor {
    color: #ffc500;
  }
  .order-number {
    width: 1000px;
    background-color: #ffffff;
    color: #50688c;
    padding: 18px 42px 32px;
    border-left: 2px solid #158be4;
    .orderstate {
      margin-right: 32px;
    }
    .closeIcon {
      width: 40px;
      text-align: center;
      display: inline-block;
      position: relative;
      top: 9px;
      margin-left: 32px;
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
  .productInformation {
    position: relative;
    width: 85%;
    .addNewProducts {
      cursor: pointer;
      position: absolute;
      right: 0;
    }
    > p {
      font-size: 16px;
      font-weight: bold;
      color: #50688c;
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
      border-top: 1px solid #e6eaee;
      color: #50688c;
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
  }
  .supplierDetail{
      margin-top: 32px;
      >p:first-child{
          font-size: 18px;
          color: #50688C;
      }
      .supplierContent{
          width: 1000px;
          background-color: #ffffff;
          padding: 20px 40px 10px;
          margin-top:16px;
          color: #50688C;
          .left30 {
            margin-left: 30px;
        }
      }
  }
  .examineGoodsMessage{
      margin-top: 32px;
      >p:first-child{
          font-size: 18px;
          color: #50688C;
      }
      .examineGoodContent{
           width: 1000px;
          background-color: #ffffff;
          padding: 20px 40px 10px;
          color: #50688C;
          margin-top:16px;
          .left30 {
            margin-left: 30px;
        }
      }
  }
  .reportList{
      margin-top:25px; 
  }
  .otherRequirements{
      margin-top: 32px;
      padding: 0;
       >p:first-child{
          font-size: 18px;
          color: #50688C;
      }
      .otherRequirementsContent{
          width: 1000px;
          background-color: #ffffff;
          padding: 20px 40px 10px;
          margin-top:16px;
          .left30 {
            margin-left: 30px;
        }
        >div{
            margin-bottom: 24px;
            >span:first-child{
                color: #7C8FA6;
            }
            // >span:last-child{
            //     color: #50688C;;
            // }
        }
      }
  }





}
</style>

