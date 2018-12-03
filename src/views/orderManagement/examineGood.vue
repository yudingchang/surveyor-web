<template>
  <div>
    <div class="examine-good">
      <div class="tab-content clear-fixed">
        <div class="top-form">
          <el-form :inline="true" :model="fitter">
            <el-select v-model="fitter.timeStyle" placeholder="请选择">
              <el-option
                v-for="item in timeStyleList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-date-picker
              v-model="fitter.time"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
              format="yyyy 年 MM 月 dd 日"
              >
            </el-date-picker>
            <el-form-item label="订单号" label-width="80px">
              <el-input v-model="fitter.number" placeholder="请输入内容"></el-input>
            </el-form-item>
            <el-form-item label="产品名称" label-width="80px">
              <el-input v-model="fitter.product_name" placeholder="请输入内容"></el-input>
            </el-form-item>
            <el-button type="success" @click="getList()">查询</el-button>
          </el-form>
        </div>
        <div class="tabs-top">
          <ul class="tabs">
          <li :class="{active:item.isBool}" v-for="(item,index) in tablist" :key = index @click="tab(item,index)">{{item.content}}</li>
        </ul>
        </div>
        
        <!-- <el-button class="add" @click="add()"><span>增加</span></el-button> -->
      </div>
    </div>
    <el-table
      :data="tableData2"
      class="table-content"
      style="width: 100%"
      :row-class-name="tableRowClassName">
      <el-table-column
        label="订单号"
        width="200">
        <template slot-scope="scope">
          <el-button type="text" @click="goOrderDetail(scope.row)">{{scope.row.number}}</el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="created_at"
        label="下单时间"
        width="180">
      </el-table-column>
      <el-table-column
        label="验货开始日期">
        <template slot-scope="scope">
          <span>{{scope.row.estimated_dates[0]}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="product_name"
        width="300px"
        label="产品名称">
        <template slot-scope="scope">
          <span v-if="scope.row.products.length==1"><span style="display:inline-block;width:100px;">{{scope.row.products[0].name}}</span> </span>
          <span v-else-if="scope.row.products.length>1"><span style="display:inline-block;width:100px;">{{scope.row.products[0].name}}...</span><i style="margin-left:20px" class="iconfont icon-IconCopy" @click="getDetail(scope.row)"/></span>
        </template>
      </el-table-column>
       <el-table-column
        prop="fees"
        label="订单金额">
        <template slot-scope="scope">
          <div class="tc-separate "><span v-for="(item,index) in filterFees(scope.row.fees)" :key='index'>{{item}}</span></div> 
        </template>
      </el-table-column>
      <el-table-column
        prop="marking_name"
        label="状态">
      </el-table-column>
      <el-table-column
        label="操作"
        width="600"
        >
        <template slot-scope="scope">
          <el-button style="color:#FFA800;margin-right:10px;" @click="setDefault(scope.row)" type="text" size="small" v-if="scope.row.can.modify==true">修改</el-button>
          <el-button style="color:#FFA800;margin-right:10px;" type="text" size="small" @click="pay(scope.row)" v-if="scope.row.can.pay==true">付款</el-button>
          <el-button style="color:#FFA800;margin-right:10px;" type="text" size="small" v-if="scope.row.can.pay==true">追加付款</el-button>
          <el-button style="color:#FFA800;margin-right:10px;" type="text" size="small" v-if="scope.row.can.pay==true">退单</el-button>
          <el-button style="color:#FFA800;margin-right:10px;" type="text" size="small" v-if="scope.row.can.pay==true">查看退单</el-button>
          <el-button style="color:#FFA800;margin-right:10px;" type="text" size="small" v-if="scope.row.can.pay==true">查看报告</el-button>
          <el-button style="color:#FFA800;margin-right:10px;" type="text" size="small" v-if="scope.row.can.close==true">关闭</el-button>
          <span style="vertical-align: bottom;
    display: inline-block;margin-right:10px;"><img src="/static/image/vedio.png" alt=""></span>
          <el-button style="color:#FFA800" type="text" size="small">复制订单</el-button>
          
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="收货地址" :visible.sync="dialogTableVisible" class="detail-dialog" width="400px">
      <el-table :data="gridData">
        <el-table-column type="index" label="序号" width="100"></el-table-column>
        <el-table-column property="name" label="产品名称"></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import { getList } from "@/api/order";
export default {
  name: "",
  components: {},
  data() {
    return {
      fitter: {
        timeStyle: 0,
        time: "",
        number: ""
      },
      timeStyleList: [
        {
          value: 0,
          label: "验货开始日期"
        },
        {
          value: 1,
          label: "下单时间"
        }
      ],
      // tableRowClassName:'',
      tableData2: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄"
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄"
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄"
        }
      ],
      gridData: [],
      input: "",
      tablist: [
        {
          content: "全部",
          isBool: true
        },
        {
          content: "待报价",
          isBool: false
        },
        {
          content: "待付款",
          isBool: false
        },
        {
          content: "待验货",
          isBool: false
        },
        {
          content: "验货中",
          isBool: false
        },
        {
          content: "已完成",
          isBool: false
        },
        {
          content: "已关闭",
          isBool: false
        }
      ],
      value: "",
      value6: "",
      options: [
        {
          value: "0~20",
          label: "0~20"
        },
        {
          value: "20~100",
          label: "20~100"
        },
        {
          value: "100~500",
          label: "100~500"
        }
      ],
      form: {
        first_name: "",
        last_name: "",
        email: ""
      },
      supplyform: {
        first_name: "",
        last_name: "",
        email: "",
        supplier_name: "",
        telephone: "",
        addresses: []
      },
      editform: "",
      rules: {
        first_name: [
          { required: true, message: "请输入姓", trigger: "blur" }
          // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        last_name: [{ required: true, message: "请输入名", trigger: "blur" }],
        email: [{ required: true, message: "请输入电子邮件", trigger: "blur" }]
      },
      supplyrules: {
        first_name: [{ required: true, message: "请输入姓", trigger: "blur" }],
        last_name: [{ required: true, message: "请输入名", trigger: "blur" }],
        email: [{ required: true, message: "请输入电子邮件", trigger: "blur" }],
        supplier_name: [
          {
            required: true,
            message: "请输入供应商信息",
            trigger: "blur"
          }
        ],
        telephone: [
          {
            required: true,
            message: "请输入手机号码",
            trigger: "blur"
          }
        ]
      },
      tableData: [],
      supplyTableData: [],
      num: 0,
      emailDialogVisible: false,
      supplyDialogVisible: false,
      invoiceDialogVisible: false,
      addressDialogVisible: true,
      labelwidth: "100px",
      emailTitle: "新增报告接收电子邮箱",
      supplyTitle: "新增供应商信息",
      invoiceTitle: "新增发票信息",
      dialogTableVisible: false
    };
  },
  created() {
    this.getList();
  },
  methods: {
    filterFees(value) {
    let fees = {}
    _.each(value, fee => {
    _.each(fee.currencies, currency => {
    const value = parseFloat(currency.value)
    fees[currency.name] = fees[currency.name] ? (fees[currency.name] + value) : value
    })
    })
    return fees;
    },
    getList(markingstyle) {
      getList({
        number: this.fitter.number,
        marking: markingstyle==''?'':markingstyle,
        product_name: this.fitter.product_name,
        estimated_first_date:this.fitter.timeStyle== 0?this.fitter.time:'',
        created_at: this.fitter.timeStyle== 0?'':this.fitter.time,
      }).then(response => {
        if (response.data.code == 0) {
          this.tableData2 = response.data.data;
        }
      });
    },
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex === 0) {
        return "warning-row";
      } else if (rowIndex === 2) {
        return "success-row";
      }
      return "";
    },
    // tab切换
    tab(item, index) {
      this.tablist.forEach((item, index) => {
        item.isBool = false;
      });
      this.num = index;
      item.isBool = true;
      switch (index) {
        case 0:
          this.getList();
          break;
        case 1:
          this.getList('WAIT_QUOTE');
          break;
        case 2:
          this.getList('WAIT_PAY');
          break;
        case 3:
          this.getList('WAIT_INSPECT');
          break;
        case 4:
          this.getList('INSPECTING');
          break;
        case 5:
          this.getList('COMPLETED');
          break;
        case 6:
          this.getList('CLOSED');
          break;
      }
    },
    // 获取产品名称详情
    getDetail(row) {
      this.dialogTableVisible = true;
      this.gridData = row.products;
      console.log(this.gridData);
    },
    // 付款
    pay(row){
      console.log(row)
      this.$router.push({path: 'pay', query: {order:row.id}})
    },
    // 去订单详情
    goOrderDetail(row){
      this.$router.push({path: 'orderDetails', query: {orderId:row.id}})
    }
  },
  mounted() {
    // console.log(this.$route.fullPath)
  }
};
</script>
<style rel="stylesheet/scss" lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

.el-dialog__header {
  padding: 50px 20px 10px;
}
.el-dialog__title {
  color: #7f8fa4;
}
.el-form-item__label {
  color: #909399;
  font-weight: normal;
}
.el-table th {
  background-color: #ffffff;
  text-align: center;
  font-size: 14px;
  color: #50688C;
}

.el-table td {                      
  text-align: center;
  font-size: 12px;
}
.el-button--text {
  color: #50688c;
}
.el-form-item__error {
  color: #ffa800;
}
.el-button--primary {
  background-color: #ffa800;
  border-color: #ffa800;
}
.el-message-box__btns button:nth-child(2) {
  background-color: #ffa800;
  border-color: #ffa800;
}
.special-input input {
  border-top-left-radius: 0px;
  border-bottom-left-radius: 0px;
}
.el-range-editor--medium.el-input__inner {
  vertical-align: middle;
}
.el-table .warning-row {
  background: #f5f8fa;
}

.el-table .success-row {
  background: #f5f8fa;
}
.clear-fixed::after {
  display: block;
  clear: both;
  content: "";
  visibility: hidden;
  height: 0;
}
.detail-dialog .el-dialog__header {
  text-align: center;
  background: #e6eaee;
  padding: 20px 20px 15px;
  font-size: 14px;
  color: #164061;
}
.tc-separate {
span + span {
&::before {
content: '/ ';
}
}
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
.email-dialog {
  .cancle {
    color: #909399;
  }
  .submit {
    color: #ffffff;
    background: #ffa800;
    outline: none;
    border: 1px solid #ffa800;
  }
}
.changecolor {
  color: #67c23a;
}
.examine-good {
  border: 1px solid #e6eaee;
  border-radius: 4px;
  margin: 24px 40px 0 20px;
  padding-bottom: 80px;
  background-color: #ffffff;
  .tab-content {
    // line-height: 200px;
    background-color: #ffffff;
    height: 50px;
    border-bottom: 1px solid #f5f8fa;
    .top-form {
      background-color: #ffffff;
      border-bottom: 1px solid #e6eaee;
      padding: 19px 0 0 32px;
    }
    .tabs-top {
      background-color: #ffffff;
      height: 50px;
      line-height: 50px;
      .tabs {
        display: inline-block;
        width: 800px;
        overflow: hidden;
        list-style: none;
        margin: 0;
        padding: 0;
        li {
          float: left;
          width: 14.2%;
          height: 50px;
          line-height: 50px;
          text-align: center;
          font-size: 14px;
          color: #50688c;
        }
        .active {
          border-bottom: 2px solid #ffa800;
          color: #ffa800;
        }
      }
    }

    .add {
      // display: inline-block;
      float: right;
      margin-right: 40px;
      width: 130px;
      height: 40px;
      vertical-align: top;
      margin-top: 5px;
      font-size: 16px;
      background: #67c23a;
      color: #ffffff;
      outline: none;
      &:hover {
        color: #ffffff;
      }
      span {
        &::before {
          content: "+";
          font-size: 16px;
          margin-right: 15px;
        }
      }
    }
  }
}
.table-content {
  margin: 24px 40px 0 20px;
}
</style>

