<template>
  <div class="examineGoods">
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
              <el-input v-model="fitter.inspection_contact" placeholder="请输入内容" style="width:370px;"/>
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
      :row-class-name="tableRowClassName"
      class="table-content"
      style="width: 100%"
      v-loading="loading"
      height="calc(100vh - 400px)"
      >
      <el-table-column
        label="订单号"
        width="230"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.is_main == true" class="numberBg">主</span><span v-if="scope.row.is_main == false" class="numberBg">辅</span> <el-button type="text" class="btnText" @click="goOrderDetail(scope.row)">{{ scope.row.number }}</el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="inspection_first_date"
        label="验货开始日期"/>
      <el-table-column
        label="验货地名称">
        <template slot-scope="scope">
          <span>{{ scope.row.inspection_address.name }}</span>
          <!-- <span v-if="scope.row.products.length==1"><span style="display:inline-block;width:100px;">{{scope.row.products[0].name}}</span> </span>
          <span v-else-if="scope.row.products.length>1"><span style="display:inline-block;width:100px;">{{scope.row.products[0].name}}...</span><i style="margin-left:20px" class="iconfont icon-IconCopy" @click="getDetail(scope.row)"/></span> -->
        </template>
      </el-table-column>
      <el-table-column
        width="200"
        label="验货地区">
        <template slot-scope="scope">
          <span>{{ scope.row.inspection_address.address_summary }}</span>
          <!-- <div ><span v-for="(item,index) in filterFees(scope.row.fees)" :key='index'>{{item}}</span></div>  -->
        </template>
      </el-table-column>
      <el-table-column
        label="报告语言"
      >
        <template slot-scope="scope">
          <span class="tc-separate"><span v-for="(item,index) in Duplicate(scope.row.reports)" :key="index" style="margin-right:5px;">{{ item.locale_name }}</span></span> 
          <!-- <div class=""><span v-for="(item,index) in filterFees(scope.row.fees)" :key='index'>{{item}}</span></div>  -->
        </template>
      </el-table-column>
      <el-table-column
        prop="marking_name"
        label="状态"/>
      <el-table-column
        label="测库联系人">
        <template slot-scope="scope">
          {{scope.row.admin.nickname}}
          <span v-if="scope.row.admin.mobile_phone">
            ({{scope.row.admin.mobile_phone}})
          </span>
          <!-- <div class=""><span v-for="(item,index) in filterFees(scope.row.fees)" :key='index'>{{item}}</span></div>  -->
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
      >
        <template slot-scope="scope">  
          <el-button v-if="scope.row.marking_name=='待验货' && scope.row.is_main==true" style="color:#FFA800;margin-right:10px;" type="text" size="small" @click="viewReport(scope.row)">查看报告</el-button>
          <el-button v-if="scope.row.marking_name=='验货中' && scope.row.is_main==true" style="color:#FFA800;margin-right:10px;" type="text" size="small" @click="viewReport(scope.row)">查看报告</el-button>
          <el-button v-if="scope.row.marking_name=='完成'" style="color:#FFA800;margin-right:10px;" type="text" size="small" @click="viewReport(scope.row)">查看报告</el-button>
          <!-- <el-button v-if="scope.row.marking_name=='完成'" style="color:#FFA800;margin-right:10px;" type="text" size="small">下载PDF报告</el-button> -->
          <!-- <el-button v-if="scope.row.marking_name!='完成'" style="color:#FFA800;margin-right:10px;" type="text" size="small">退单</el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :visible.sync="dialogTableVisible" title="收货地址" class="detail-dialog" width="400px">
      <el-table :data="gridData">
        <el-table-column type="index" label="序号" width="100"/>
        <el-table-column property="name" label="产品名称"/>
      </el-table>
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
      total:0,
      fitter: {
        timeStyle: 0,
        time: '',
        inspection_contact: ''
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
          content: '已抢待审核',
          isBool: false
        },
        {
          content: '待验货',
          isBool: false
        },
        {
          content: '验货中',
          isBool: false
        },
        {
          content: '已完成',
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
    this.getList()
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
    getList(marking) {
      orderList({
         page: this.filters.page,
        limit: this.filters.rows,
        inspection_first_date:this.fitter.time,
        inspection_contact:this.fitter.inspection_contact,
        marking:marking?marking:'',
      }).then(response => {
        if (response.data.code == 0) {
          this.loading = false
          this.tableData2 = response.data.data
          this.total = response.data.meta.total
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
        this.loading = true
      })
      this.num = index
      item.isBool = true
      switch (index) {
        case 0:
          this.getList()
          break
        case 1:
          this.getList('WAIT_CHECK')
          break
        case 2:
          this.getList('WAIT_INSPECT')
          break
        case 3:
          this.getList('INSPECTING')
          break
        case 4:
          this.getList('COMPLETED')
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
    // 数组去重
    Duplicate(Array){
      let newArray = []
      Array.forEach((item)=>{
        newArray.push(item.locale_name)
      })
      return [...new Set(newArray)].map((item)=>{
        return {
          locale_name:item
        }
      });
    },
    //跳转报告管理
    viewReport(row){
      this.$router.push({
        path:'reporteManager/index',
        query:{
          number:row.number
        }
      })
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */
.examineGoods{
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
  .el-range-separator{
    width: 20px;
  }
}

.tc-separate {
span + span {
&::before {
content: ' , ';
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
.examineGoods{
  margin:25px 40px;
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
        cursor: pointer;
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

