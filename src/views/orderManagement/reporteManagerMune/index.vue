<template>
  <div class="reporteManager">
    <div class="examine-good">
      <div class="tab-content clear-fixed">
        <div class="top-form">
          <el-form :inline="true" :model="fitter">
            <el-form-item label="验货开始日期" label-width="100px"/>
            <el-date-picker
              v-model="fitter.time"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
              format="yyyy 年 MM 月 dd 日"
            />
            <el-form-item label="验货地名称" label-width="100px">
              <el-input v-model="fitter.number" placeholder="请输入内容" style="width:370px;"/>
            </el-form-item>
            <el-button type="success" @click="getList()">查询</el-button>
          </el-form>
        </div>
        <div class="tabs-top">
          <ul class="tabs">
            <li v-for="(item,index) in tablist" :class="{active:item.isBool}" :key = "index" @click="tab(item,index)">{{ item.content }}</li>
          </ul>
        </div>

        <!-- <el-button class="add" @click="add()"><span>增加</span></el-button> -->
      </div>
    </div>
    <el-table
      :data="tableData2"
      style="width: 100%"
      class="grabSheet"
      empty-text="暂无待办事项"
    >
      <el-table-column
        label="订单号"
        width="180">
        <template slot-scope="scope">
          <el-button type="text" class="btnText">{{ scope.row.service.number }}</el-button>
        </template>
      </el-table-column>
      <el-table-column
        label="报告单号"/>
      <el-table-column
        label="验货开始日期"/>
      <el-table-column
        label="验货地名称">
        <template slot-scope="scope">
          {{ scope.row.address.address_summary }}{{ scope.row.address.address_detail }}
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
          <el-button type="text" class="orangeText" @click="goReportDetail(scope.row)">写报告</el-button>
          <!-- {{scope.row.marking_name}}({{scope.row.service.marking_name}})  -->
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :visible.sync="dialogTableVisible" title="收货地址" class="detail-dialog" width="400px">
      <el-table :data="gridData">
        <el-table-column type="index" label="序号" width="100"/>
        <el-table-column property="name" label="产品名称"/>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import { getList } from '@/api/order'
import { orderList } from '@/api/dashboard'
import { getReportList } from '@/api/report'
export default {
  name: '',
  components: {},
  data() {
    return {
      fitter: {
        timeStyle: 0,
        time: '',
        number: ''
      },
      timeStyleList: [
        {
          value: 0,
          label: '验货开始日期'
        },
        {
          value: 1,
          label: '下单时间'
        }
      ],
      // tableRowClassName:'',
      tableData2: [

      ],
      gridData: [],
      input: '',
      tablist: [
        {
          content: '全部',
          isBool: true
        },
        {
          content: '未提交',
          isBool: false
        },
        {
          content: '待审核',
          isBool: false
        },
        {
          content: '审核通过',
          isBool: false
        },
        {
          content: '审核未通过',
          isBool: false
        }
      ],
      value: '',
      value6: '',
      options: [
        {
          value: '0~20',
          label: '0~20'
        },
        {
          value: '20~100',
          label: '20~100'
        },
        {
          value: '100~500',
          label: '100~500'
        }
      ],
      form: {
        first_name: '',
        last_name: '',
        email: ''
      },
      supplyform: {
        first_name: '',
        last_name: '',
        email: '',
        supplier_name: '',
        telephone: '',
        addresses: []
      },
      editform: '',
      rules: {
        first_name: [
          { required: true, message: '请输入姓', trigger: 'blur' }
          // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        last_name: [{ required: true, message: '请输入名', trigger: 'blur' }],
        email: [{ required: true, message: '请输入电子邮件', trigger: 'blur' }]
      },
      supplyrules: {
        first_name: [{ required: true, message: '请输入姓', trigger: 'blur' }],
        last_name: [{ required: true, message: '请输入名', trigger: 'blur' }],
        email: [{ required: true, message: '请输入电子邮件', trigger: 'blur' }],
        supplier_name: [
          {
            required: true,
            message: '请输入供应商信息',
            trigger: 'blur'
          }
        ],
        telephone: [
          {
            required: true,
            message: '请输入手机号码',
            trigger: 'blur'
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
      labelwidth: '100px',
      emailTitle: '新增报告接收电子邮箱',
      supplyTitle: '新增供应商信息',
      invoiceTitle: '新增发票信息',
      dialogTableVisible: false
    }
  },
  created() {
    this.getReportList()
  },
  mounted() {
    // console.log(this.$route.fullPath)
  },
  methods: {
    filterFees(value) {
      const fees = {}
      _.each(value, fee => {
        _.each(fee.currencies, currency => {
          const value = parseFloat(currency.value)
          fees[currency.name] = fees[currency.name] ? (fees[currency.name] + value) : value
        })
      })
      return fees
    },
    getList() {
      orderList(
      //   {
      //   number: this.fitter.number,
      //   marking: markingstyle==''?'':markingstyle,
      //   product_name: this.fitter.product_name,
      //   estimated_first_date:this.fitter.timeStyle== 0?this.fitter.time:'',
      //   created_at: this.fitter.timeStyle== 0?'':this.fitter.time,
      // }
      ).then(response => {
        if (response.data.code == 0) {
          this.tableData2 = response.data.data
        }
      })
    },
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex === 0) {
        return 'warning-row'
      } else if (rowIndex === 2) {
        return 'success-row'
      }
      return ''
    },
    // tab切换
    tab(item, index) {
      this.tablist.forEach((item, index) => {
        item.isBool = false
      })
      this.num = index
      item.isBool = true
      switch (index) {
        case 0:
          this.getList()
          break
        case 1:
          this.getList('WAIT_QUOTE')
          break
        case 2:
          this.getList('WAIT_PAY')
          break
        case 3:
          this.getList('WAIT_INSPECT')
          break
        case 4:
          this.getList('INSPECTING')
          break
        case 5:
          this.getList('COMPLETED')
          break
        case 6:
          this.getList('CLOSED')
          break
      }
    },
    // 获取产品名称详情
    getDetail(row) {
      this.dialogTableVisible = true
      this.gridData = row.products
      console.log(this.gridData)
    },
    // 付款
    pay(row) {
      console.log(row)
      this.$router.push({ path: 'pay', query: { order: row.id }})
    },
    // 去订单详情
    goOrderDetail(row) {
      this.$router.push({ path: 'orderDetails', query: { orderId: row.id }})
    },
    // 报告列表
    getReportList() {
      getReportList({}).then(res => {
        if (res.data.code == 0) {
          this.tableData2 = res.data.data
        }
      })
    },
    goReportDetail(row) {
      this.$router.push({
        path: 'writeReporte', query: { id: row.id }
      })
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */
.reporteManager{
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
  font-size: 14px;
  color: #50688C;
}

.el-table td {
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
.reporteManager{
  margin:25px 40px;
.btnText{
    color:#158BE4;
    font-size:12px !important;
    display: inline-block;
}
.orangeText{
    color:#FFA800;
    font-size:12px !important;
    display: inline-block;
}
.examine-good {
  border: 1px solid #e6eaee;
  border-radius: 4px;
  // padding-bottom: 70px;
  background-color: #ffffff;
  .tab-content {
    // line-height: 200px;
    background-color: #ffffff;
    // height: 50px;
    // border-bottom: 1px solid #f5f8fa;
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
          width: 20%;
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
  margin-top:22px;
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
}

</style>

