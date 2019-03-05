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
            <el-form-item label="验货地名称" label-width="90px" style="margin-left:10px;">
              <el-input v-model="fitter.inspection_contact" placeholder="请输入内容" style="width:250px;"/>
            </el-form-item>
            <el-form-item label="订单号" label-width="60px">
              <el-input v-model="fitter.number" placeholder="请输入内容" style="width:250px;"/>
            </el-form-item>
            <el-button type="success" @click="getReportList()">查询</el-button>
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
      v-loading="loading"
      class="grabSheet"
      empty-text="暂无待办事项"
      height="calc(100vh - 400px)"
    >
      <el-table-column
        label="订单号"
        width="180">
        <template slot-scope="scope">
          <el-button type="text" class="btnText" @click="goOrderDetail(scope.row)" >{{ scope.row.service.number }}</el-button>
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
    <el-dialog :visible.sync="dialogTableVisible" title="收货地址" class="detail-dialog" width="400px">
      <el-table :data="gridData">
        <el-table-column type="index" label="序号" width="100"/>
        <el-table-column property="name" label="产品名称"/>
      </el-table>
    </el-dialog>
    <!-- 报告拒绝原因弹框 -->
    <el-dialog
      :visible.sync="reasonsVisible"
      width="30%"
      center>
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
    <el-col :span="24" class="toolbar">
      <el-pagination
        :current-page="filters.currentpage"
        :page-sizes="[15, 30, 50]"
        :page-size="filters.rows"
        :total="total"
        background
        layout="total, sizes, prev, pager, next, jumper"
        style="float:right;"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"/>
    </el-col>
  </div>
</template>

<script>
import { getList } from '@/api/order'
import { orderList } from '@/api/dashboard'
import { getReportList , getReason } from '@/api/report'
export default {
  name: '',
  components: {},
  data() {
    return {
      loading:false,
       filters: {
        page: 1,
        rows: 15,
        currentpage: 1
      },
      total:10,
      fitter: {
        inspection_contact: '',
        time: [],
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
      dialogTableVisible: false,
      // 原因数据
      reasonsVisible: false,
      reasonsData:[]
    }
  },
  created() {
    this.fitter.number = this.$route.query.number ? this.$route.query.number : ''
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
        this.loading = true
      })
      this.num = index
      item.isBool = true
      switch (index) {
        case 0:
          this.getReportList()
          break
        case 1:
          this.getReportList('WAIT_WRITE')
          break
        case 2:
          this.getReportList('WAIT_CHECK')
          break
        case 3:
          this.getReportList('COMPLETED')
          break
        case 4:
          this.getReportList('WAIT_MODIFY')
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
      this.$router.push({ path: '/orderManagement/orderDetails', query: { orderId: row.service.id }})
    },
    // 报告列表
    getReportList(marking) {
      getReportList({
        page: this.filters.page,
        limit: this.filters.rows,
        inspection_first_date:this.fitter.time,
        inspection_contact:this.fitter.inspection_contact,
        number:this.$route.query.number ? this.$route.query.number : ''  ,
        marking:marking?marking:'',
      }).then(res => {
        if (res.data.code == 0) {
          this.loading = false
          this.tableData2 = res.data.data
           this.total = res.data.meta.total
           this.$route.query.number = ''
        }
      })
    },
    goReportDetail(row,bool) {
      this.$router.push({
        path: 'writeReporte', query: { id: row.id ,modify:bool}
      })
    },
    handleSizeChange(val) {
      this.filters.rows = val
      // this.filters.currentpage = val;
      this.getList()
    },
    handleCurrentChange(val) {
      this.filters.page = val
      this.filters.currentpage = val
      this.getList()
      // console.log(`当前页: ${val}`);
    },
    // 上传报告
    uploadReport(row){
      this.$router.push({
        path: 'uploadReport', 
        query: { id: row.id }
      })
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
<style rel="stylesheet/scss" lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */
.reporteManager{
  .tab-content{
    .el-form-item__label{
      text-align:left;
    }
  }
    .el-dialog__header {
  padding: 50px 20px 10px;
}
.el-date-editor .el-range-separator{
  width:20px;
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
  .grabSheet{
    margin-top:20px;
  }
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
  .toolbar{
    position: absolute;
    right: 40px;
    bottom: 10px;
  }
}

</style>

