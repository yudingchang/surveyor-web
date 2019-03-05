<template>
  <div class="grabList">
    <div class="nomarlTop">
      <span class="left">抢单</span>
    </div>
    <el-table
      :data="tableData"
      style="width: 100%"
      class="grabSheet"
      empty-text="暂无待抢订单"
      height="calc(100vh - 260px)"
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
          {{ scope.row.inspection_address.address_detail }}
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
          <span v-for="(item,index) in getFitter(scope.row.reports)" :key="index" style="margin-right:5px;">
            {{ item }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        width="200"
        label="产品名称">
        <template slot-scope="scope">
          <span v-if="scope.row.products.length==1">{{ scope.row.products[0].name }}</span>
          <span v-else-if="scope.row.products.length>1" style="display:inline-block;"><span style="display:inline-block;width:120px;">{{ scope.row.products[0].name }}...</span><i style="display:inline-block;" class="iconfont icon-IconCopy" @click="getDetail(scope.row)"/></span>
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
    <div class="productBorder">
      <el-dialog :visible.sync="dialogTableVisible" title="产品名称" class="detail-dialog" width="400px">
        <el-table :data="gridData" border height="200">
          <el-table-column type="index" label="序号" width="100" align="center"/>
          <el-table-column property="name" label="产品名称" align="center"/>
        </el-table>
      </el-dialog>
    </div>
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

    <el-col :span="24" class="toolbar">
      <el-pagination
        :current-page="filters.currentpage"
        :page-sizes="[15, 30, 50]"
        :page-size="filters.rows"
        :total="total"
        background
        layout="total, sizes, prev, pager, next, jumper"
        style="float:right;margin-top:10px;"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"/>
    </el-col>

  </div>
</template>

<script>
import { grabSheet , confirmgrabSheet } from '@/api/dashboard'
export default {
  name: '',
  components: { },
  data() {
    return {
      filters: {
        page: 1,
        rows: 15,
        currentpage: 1
      },
      canConfirm: false,
      canChase: false,
      dialogTableVisible: false,
      centerDialogVisible: false,
      noRobbing: false,
      noRobbingText: '',
      orderService: '',     
      orderInformation:{},
      grabSheetText:'',
      tableData: [
      ],
      gridData: [],
      currentPage4: 4,
      total: 100
    }
  },
  computed: {
  },
  created() {
    this.getgrabSheet()
  },
  mounted() {
  },
  methods: {
    getgrabSheet() {
      grabSheet({
        page: this.filters.page,
        limit: this.filters.rows
      }).then(response => {
        if (response.data.code == 0) {
          this.tableData = response.data.data
          this.total = response.data.meta.total
        }
      })
    },
    // 获取产品名称详情
    getDetail(row) {
      this.dialogTableVisible = true
      this.gridData = row.products.map((item, index) => {
        return item
      })
      console.log(this.gridData)
    },
    // 过滤中文，英文项目
    getFitter(row){
      return this._.map(this._.uniqBy(row, 'locale'), 'locale_name')
    },
    // 去订单详情
    goOrderDetail(row) {
      this.$router.push({ path: '/orderManagement/orderDetails', query: { orderId:row.service.id}})
    },
    handleSizeChange(val) {
      this.filters.rows = val
      this.getgrabSheet()
    },
    handleCurrentChange(val) {
      this.filters.page = val
      this.filters.currentpage = val
      this.getgrabSheet()
      // console.log(`当前页: ${val}`);
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
        this.grabSheetText = row.is_main == false ? `此单为辅单，订单金额为￥${Number(row.commission) + Number(row.other_fee)}，您确认抢此订单吗？` : `订单金额￥${Number(row.commission) + Number(row.other_fee)}，需要写${this.getArray(row.reports)}报告您确认抢此订单吗？`
        this.centerDialogVisible = true
        this.canConfirm = row.can.confirm
        this.canChase = row.can.chase
      }   
    },
    // 显示不可抢弹框
    showNoRobbingPump(row){
      this.noRobbing = true
      this.noRobbingText = row.can_messages.chase
    },
    // 遍历数组
    getArray(data) {
      return data.map((val, index) => {
        return val.locale_name
      })
    },
    // 抢单
    confirmgrabSheet() {
      let chaseText
      if (this.canConfirm) {
        chaseText = 'confirm'
      } else {
        chaseText = 'chase'
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
  }
}
</script>
<style lang="scss">
.grabList{
    .el-dialog--center .el-dialog__body {
          text-align: center ;
          color:rgba(124,143,166,1);
          font-size:16px;
    }
    .el-table th {
            background:inherit;
            height: inherit;
            color: inherit;
        }
   .el-dialog__header{
      text-align: center;
      // background:rgba(230,234,238,1);
      padding: 30px 20px 15px;
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
      .el-table td{
        font-size: 12px;
      }
      .el-dialog__footer{
        padding: 20px 20px 20px;
      }
}
  
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
.grabList {
    margin: 32px 40px 0 39px;
     .nomarlTop{
        width: 100%;
        overflow: hidden;
        .left{
            float: left;
            display: block;
            font-size: 18px;
            color: #50688C;
            padding: 0 16px;
            border-left: 3px solid #67C23A;

        }
        .right{
            float: right;
            font-size: 18px;
            color: #F5A623;
        }
    }
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

