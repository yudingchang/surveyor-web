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
        label="服务单号"
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
          <span v-for="(item,index) in scope.row.reports" :key="index" style="margin-right:5px;">
            {{ item.locale_name }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        width="200"
        label="产品名称">
        <template slot-scope="scope">
          <span v-if="scope.row.products.length==1">{{ scope.row.products[0] }}</span>
          <span v-else-if="scope.row.products.length>1" style="display:inline-block;"><span style="display:inline-block;width:120px;">{{ scope.row.products[0] }}...</span><i style="display:inline-block;" class="iconfont icon-IconCopy" @click="getDetail(scope.row)"/></span>
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
          <el-button :disabled="(scope.row.can.confirm == false) && (scope.row.can.chase == false)" type="success" @click="showGrabSheetPump(scope.row)">抢单</el-button>
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

    <el-col :span="24" class="toolbar">
      <el-pagination
        :current-page="filters.currentpage"
        :page-sizes="[1, 30, 50]"
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
import { grabSheet } from '@/api/dashboard'
export default {
  name: '',
  components: { },
  data() {
    return {
      filters: {
        page: 1,
        rows: 1,
        currentpage: 1
      },
      dialogTableVisible: false,
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
        return {
          name: item
        }
      })
      console.log(this.gridData)
    },
    handleSizeChange(val) {
      console.log('ccc')
      this.filters.rows = val
      // this.filters.currentpage = val;
      this.getgrabSheet()
    },
    handleCurrentChange(val) {
      this.filters.page = val
      this.filters.currentpage = val
      this.getgrabSheet()
      // console.log(`当前页: ${val}`);
    }
  }
}
</script>

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
}
</style>

