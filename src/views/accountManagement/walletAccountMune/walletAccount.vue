<template>
  <div class="walletAccount">
    <!-- <router-view></router-view> -->
    <div>
      <el-row>
        <el-col :span="24">
          <div class="walletAccountTop clearfix">
            <div class="WalletBalance">
              <p class="WalletBalanceTop"><i class="WalletBalanceLogo"/><span class="WalletBalanceText">钱包余额</span><i class="el-icon-question" style="color:#7F8FA4;font-size:18px;"/></p>
              <div class="WalletBalanceBottom">
                <span class="moneyText">¥{{ balance }}</span><span class="btn" @click="goWithDrawCash()">提现</span>
              </div>
            </div>
            <div class="WalletBalance deposit">
              <p class="WalletBalanceTop"><i class="depositLogo"/><span class="WalletBalanceText">保证金</span><i class="el-icon-question" style="color:#7F8FA4;font-size:18px;"/></p>
              <div class="WalletBalanceBottom">
                <span class="moneyText">¥{{ freeze }}</span>
              </div>
            </div>
            <div class="WalletBalance bankCard">
              <p class="WalletBalanceTop"><i class="bankCardLogo"/><span class="WalletBalanceText">银行卡</span></p>
              <div class="WalletBalanceBottom">
                <span class="btn" @click="goCardManager()">管理</span>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <div class="walletAccountContent">
            <div class="tabs-top">
              <ul class="tabs">
                <li v-for="(item,index) in tablist" :class="{active:item.isBool}" :key = "index" @click="tab(item,index)">{{ item.content }}</li>
              </ul>
              <!-- 钱包明细  -->
              <el-table
                v-show="num==0"
                :data="tableData"
                empty-text="暂无数据"
                stripe
                style="width: 100%"
                max-height="500"
                >
                <el-table-column
                  prop="created_at"
                  label="创建时间"
                  sortable
                />
                <el-table-column :filters="[{ text: '手续费', value: '5' }, { text: '提现', value: '4' },{ text: '提现退款', value: '6' },{ text: '手续费退款', value: '7' },{ text: '验货员收入', value: '8' },{ text: '保证金', value: '9' },{ text: '其他费用', value: '10' },{ text: '保证金扣除', value: '11' }]" :filter-method="filterTag" prop="type" label="类型" filter-placement="bottom-end">
                  <template slot-scope="scope">
                    <span v-if="scope.row.type=='4'" disable-transitions>提现</span>
                    <span v-if="scope.row.type=='5'" disable-transitions>手续费</span>
                    <span v-if="scope.row.type=='6'" disable-transitions>提现退款</span>
                    <span v-if="scope.row.type=='7'" disable-transitions>手续费退款</span>
                    <span v-if="scope.row.type=='8'" disable-transitions>验货收入</span>
                    <span v-if="scope.row.type=='9'" disable-transitions>保证金</span>
                    <span v-if="scope.row.type=='10'" disable-transitions>其他费用</span>
                    <span v-if="scope.row.type=='11'" disable-transitions>保证金扣除</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="金额">
                  <template slot-scope="scope">
                    <span v-if="scope.row.plus_minus==true">+</span>
                    <span v-if="scope.row.plus_minus==false">-</span>
                    <span>¥{{ scope.row.price }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="钱包余额">
                  <template slot-scope="scope">
                    <span>¥{{ scope.row.after_snapshot_price}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="状态">
                  <template slot-scope="scope">                
                    <span v-if="scope.row.status == 2">成功</span>
                    <span v-else>{{scope.row.status}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="操作">
                  <template slot-scope="scope">
                    <el-button type="text" @click="goDetail(scope.row)">详情</el-button>
                  </template>
                </el-table-column>
              </el-table>

              <!-- 保证金明细  -->
              <el-table
                v-show="num==1"
                :data="tableData2"
                empty-text="暂无数据"
                stripe
                style="width: 100%"
                max-height="500"
                >
                <el-table-column
                  prop="created_at"
                  label="创建时间"
                  sortable
                />
                <el-table-column :filters="[{ text: '钱包转入', value: '钱包转入' }, { text: '验货扣款', value: '验货扣款' },{ text: '退单扣款', value: '退单扣款' }]" :filter-method="filterTag" prop="tag" label="类型" filter-placement="bottom-end">
                  <template slot-scope="scope">
                    <span :type="scope.row.tag === '家' ? 'primary' : 'success'" disable-transitions>{{ scope.row.tag }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="金额">
                  <template slot-scope="scope">
                    <span v-if="scope.row.plus_minus==true">+</span>
                    <span v-if="scope.row.plus_minus==false">-</span>
                    <span>¥{{ scope.row.price }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="保证金">
                  <template slot-scope="scope">
                    <span>¥{{ scope.row.after_snapshot_price}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="状态">
                  <template slot-scope="scope">
                    <span v-if="scope.row.status == 0">处理中</span>
                    <span v-if="scope.row.status == 1">成功</span>
                    <span v-if="scope.row.status == 2">失败</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="操作">
                  <template slot-scope="scope">
                    <el-button type="text">详情</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <!-- 提现记录  -->
              <el-table
                v-show="num==2"
                :data="tableData3"
                empty-text="暂无数据"
                stripe
                style="width: 100%"
                max-height="500"
              >
                <el-table-column
                  prop="created_at"
                  label="创建时间"
                  sortable
                />
                <el-table-column
                  label="提现金额">
                  <template slot-scope="scope">
                    <!-- <span v-if="scope.row.plus_minus==true">+</span>
                    <span v-if="scope.row.plus_minus==false">-</span> -->
                    <span>-¥{{ scope.row.total_price }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="钱包余额">
                  <template slot-scope="scope">
                    <span>¥{{ scope.row.balance_after_presentation}}</span>
                  </template>
                </el-table-column>

                <el-table-column :filters="[{ text: '成功', value: '成功' }, { text: '处理中', value: '处理中' },{ text: '失败', value: '失败' }]" :filter-method="filterTag" prop="tag" label="状态" filter-placement="bottom-end">
                  <template slot-scope="scope">
                    <!-- {{scope.row}} -->
                    <!-- <span :type="scope.row.tag === '家' ? 'primary' : 'success'" disable-transitions> -->
                      <span v-if="scope.row.status == 0">处理中</span>
                      <span v-if="scope.row.status == 1">成功</span>
                      <span v-if="scope.row.status == 2">失败</span>
                    <!-- </span> -->
                  </template>
                </el-table-column>
                <el-table-column
                  label="完成时间">
                  <template slot-scope="scope">
                    <span>{{ scope.row.payment.deliveries_at }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="操作">
                  <template slot-scope="scope">
                    <el-button type="text" @click="withdrawRecord(scope.row)">详情</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <el-col v-if="num==0" :span="24" class="toolbar">
      <el-pagination
        :current-page="filters.currentpage"
        :page-sizes="[15, 30, 50]"
        :page-size="filters.rows"
        :total="filters.total"
        background
        layout="total, sizes, prev, pager, next, jumper"
        style="float:right;margin-top:10px;"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"/>
    </el-col>
    <el-col v-if="num==1" :span="24" class="toolbar">
      <el-pagination
        :current-page="Cashfilters.currentpage"
        :page-sizes="[15, 30, 50]"
        :page-size="Cashfilters.rows"
        :total="Cashfilters.total"
        background
        layout="total, sizes, prev, pager, next, jumper"
        style="float:right;margin-top:10px;"
        @size-change="CashSizeChange"
        @current-change="CashCurrentChange"/>
    </el-col>
    <el-col v-if="num==2" :span="24" class="toolbar">
      <el-pagination
        :current-page="Depositfilters.currentpage"
        :page-sizes="[15, 30, 50]"
        :page-size="Depositfilters.rows"
        :total="Depositfilters.total"
        background
        layout="total, sizes, prev, pager, next, jumper"
        style="float:right;margin-top:10px;"
        @size-change="DepositSizeChange"
        @current-change="DepositCurrentChange"/>
    </el-col>

  </div>
</template>

<script>
import { getWallet, getBalanceList, getCashList, getDepositList } from '@/api/walletDetail'// 列表请求数据
// import Router from '../../router'
// import $store from '../../store'
export default {
  name: 'WalletAccount',
  components: {
    // payMentChn
    // Router
  },
  data() {
    return {
      filters: {
        page: 1,
        rows: 15,
        currentpage: 1,
        total: 10
      },
      Cashfilters: {
        page: 1,
        rows: 15,
        currentpage: 1,
        total: 10
      },
      Depositfilters: {
        page: 1,
        rows: 15,
        currentpage: 1,
        total: 10
      },
      tablist: [
        {
          content: '钱包明细',
          isBool: true
        },
        {
          content: '保证金明细',
          isBool: false
        },
        {
          content: '提现记录',
          isBool: false
        }
      ],
      tableData: [],
      tableData2: [],
      num: 0,
      balance: '',
      freeze: ''
    }
  },
  computed: {
    routerShow() {
      // return this.$store.state.config.routerShow;
    }
  },
  watch: {// 监听点击事件
  },
  // beforeRouteUpdate  (to, from, next) {
  //   if(to.name == 'withdrawCash'){
  //     $store.commit('SET_routerShow')
  //   }
  //   if(from.name == 'withdrawCash'){
  //     $store.commit('SET_routerShow')
  //   }
  //   next()
  // },
  created() {
    this.getWallet()
    this.getBalanceList()
  },
  mounted() {
  },
  methods: {
    // 获取钱包信息
    getWallet() {
      getWallet({}).then(res => {
        if (res.data.code == 0) {
          this.balance = res.data.data.list.find(t => t.currency == 'CNY').price
          this.freeze = res.data.data.list.find(t => t.currency == 'CNY').freeze
        }
      })
    },
    // 获取钱包明细
    getBalanceList() {
      getBalanceList({
        page: this.filters.page,
        limit: this.filters.rows
      }).then(res => {
        if (res.data.code == 0) {
          this.tableData = res.data.data.list
          this.filters.total = res.data.meta.total
        }
      })
    },
    // 获取保证金明细
    getCashList() {
      getCashList({
        page: this.Cashfilters.page,
        limit: this.Cashfilters.rows
      }).then(res => {
        if (res.data.code == 0) {
          this.tableData2 = res.data.data.list
          this.Cashfilters.total = res.data.meta.total
        }
      })
    },
    // 获取提现明细
    getDepositList() {
      getDepositList({
        page: this.Depositfilters.page,
        limit: this.Depositfilters.rows
      }).then(res => {
        if (res.data.code == 0) {
          this.tableData3 = res.data.data.list
          this.Depositfilters.total = res.data.meta.total
        }
      })
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
          this.getBalanceList()
          break
        case 1:
          this.getCashList()
          break
        case 2:
          this.getDepositList()
          break
        // case 3:
        //   this.getList('WAIT_INSPECT');
        //   break;
        // case 4:
        //   this.getList('INSPECTING');
        //   break;
        // case 5:
        //   this.getList('COMPLETED');
        //   break;
        // case 6:
        //   this.getList('CLOSED');
        //   break;
      }
    },
    filterTag(value, row) {
      return row.type === value
    },
    // 跳转提现
    goWithDrawCash() {
      this.$router.push({
        path: 'withdrawCash'

      })
      // this.$route.meta.keepAlive = false
    },
    // 跳转提现
    goCardManager() {
      this.$router.push({
        path: 'cardManagement'
      })
    },
    jsonGetName(Arrays, key) {
      let value
      Arrays.map((item) => {
        if (Object.keys(item).join('') == key) {
          value = item[key]
        }
      })
      return value
    },
    handleSizeChange(val) {
      this.filters.rows = val
      // this.filters.currentpage = val;
      this.getBalanceList()
    },
    handleCurrentChange(val) {
      this.filters.page = val
      this.filters.currentpage = val
      this.getBalanceList()
      // console.log(`当前页: ${val}`);
    },
    CashSizeChange(val) {
      this.Cashfilters.rows = val
      // this.filters.currentpage = val;
      this.getCashList()
    },
    handleCurrentChange(val) {
      this.Cashfilters.page = val
      this.Cashfilters.currentpage = val
      this.getCashList()
      // console.log(`当前页: ${val}`);
    },
    DepositSizeChange(val) {
      this.Cashfilters.rows = val
      // this.filters.currentpage = val;
      this.getCashList()
    },
    DepositCurrentChange(val) {
      this.Depositfilters.page = val
      this.Depositfilters.currentpage = val
      this.getDepositList()
      // console.log(`当前页: ${val}`);
    },
    // 钱包详情
    goDetail(row) {
      this.$router.push({
        path: 'walletDetail',
        query: {
          id: row.id
        }
      })
    },
    withdrawRecord(row){
      this.$router.push({
        path: 'withdrawRecord',
        query: {
          id: row.id
        }
      })
    }
  }
}
</script>

<style lang="scss">
  .walletAccount{
    .el-button--text {
      color: #FFA800;
      font-size: 12px;
    }
    .el-table td{
      font-size: 12px;
    }
  }
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
.walletAccount{
  margin:24px 40px 0;
  // position: relative;
  .toolbar{
    position: absolute;
    right: 40px;
    bottom: 10px;
  }
  .walletAccountTop{
    padding:25px 0 25px 60px;
    background:#ffffff;
    .WalletBalance{
      float: left;
      .WalletBalanceTop{
        height: 25px;
        line-height: 25px;
        color: #50688C;
        .WalletBalanceLogo{
          display: inline-block;
          width: 24px;
          height: 20px;
          background:url("/static/image/bankCard.png") no-repeat;
          background-size:100% 100%;
          vertical-align:text-bottom;
        }
        .WalletBalanceText{
          margin: 0 8px;
          font-size: 16px;
        }
      }
      .WalletBalanceBottom{
        margin-top: 13px;
        .moneyText{
          font-size: 30px;
          color:#158BE4;
          margin-right: 122px;
          vertical-align: middle;
        }
        .btn{
          cursor: pointer;
          display: inline-block;
          font-size: 16px;
          width:80px;
          height:40px;
          border-radius:4px;
          border:1px solid rgba(103,194,58,1);
          text-align: center;
          line-height: 40px;
          color: #67C23A;
          vertical-align: middle;
        }
      }
    }
    .deposit{
      margin-left: 60px;
      padding: 0 60px 0 60px;
      border-left: 1px solid #A5B3C5;
      border-right:1px solid #A5B3C5;
      .depositLogo{
        width: 22px;
        height: 24px;
        display:inline-block;
        background:url("/static/image/deposit.png") no-repeat;
        background-size:100% 100%;
        vertical-align:middle;
      }
    }
    .bankCard{
      margin-left: 60px;
      .bankCardLogo{
        width: 24px;
        height: 20px;
        display:inline-block;
        background:url("/static/image/WalletBalance.png") no-repeat;
        background-size:100% 100%;
        vertical-align:text-bottom;
      }
    }
  }
  .walletAccountContent{
    margin-top: 24px;
    .tabs-top {
      background-color: #ffffff;
      // height: 50px;
      // line-height: 50px;
        // height: 50px;
        // line-height: 50px;
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
          font-size: 16px;
          color: #50688c;
          cursor: pointer;
        }
        .active {
          border-bottom: 2px solid #ffa800;
          color: #ffa800;
        }
      }

    }
  }
}

</style>

