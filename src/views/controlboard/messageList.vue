<template>
  <div class="messageList">
    <!-- <ul class="tabs">
        <li v-for="(item,index) in tablist" :class="{active:item.isBool}" :key = "index" @click="tab(item,index)">{{ item.content }}</li>
    </ul> -->
    <el-table
    :data="tableData"
    stripe
    style="width: 100%"
    :show-header = "false"  
    max-height="calc(100vh - 200px)"
    >
    <el-table-column
      >
      <template slot-scope="scope">
        <span style="color:#004167;">【{{scope.row.title}}】</span>
      </template>
    </el-table-column>
    <el-table-column
      width="800">
      <template slot-scope="scope">
        <span style="color:#50688C;">{{scope.row.message}}</span>
      </template>
    </el-table-column>
    <el-table-column
      >
      <template slot-scope="scope">
        <span style="color:#50688C;">{{scope.row.created_at}}</span>
      </template>
    </el-table-column>
  </el-table>
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
    <!-- <ul class="messageListContent">

        <li v-for="(item,index) in message" :key ="index" class="clearfix">
            <span class="fl">【{{item.title}}】</span><span class="fl">{{item.message}}</span><span class="fr">{{item.created_at}}</span>
        </li>
    </ul> -->
  </div>
</template>
<script>
import {
  getMessageList
} from '@/api/dashboard' // 列表请求数据

export default {
  name: '',
  components: {},
  data() {
    return {
      filters: {
        page: 1,
        rows: 15,
        currentpage: 1
      },
      id: this.$route.query.id,
      total:0,
      tablist: [
        {
          content: '系统消息',
          isBool: true
        },
        {
          content: '钱包消息',
          isBool: false
        },
        {
          content: '订单消息',
          isBool: false
        }
      ],
      tableData:[],
      message:[{
        title:'标题内容标题内容标题内容标题内容标题内容',
        content:'消息内容消息内容消息消息内容消息内容消息消息内容消息内容消息消息内容消息内容消息消息内容消息内容消息消息内容消息内容消息消息内容消息内容消息',
        time:'2018-05-21 12:30' 
      },
      {
        title:'标题内容标题内容标题内容标题内容标题内容',
        content:'消息内容消息内容消息消息内容消息内容消息消息内容消息内容消息消息内容消息内容消息消息内容消息内容消息消息内容消息内容消息消息内容消息内容消息',
        time:'2018-05-21 12:30' 
      }
       
      ]
    }
  },
  created() {
    this.getMessageList()
  },
  methods: {
    // tab切换
    tab(item, index) {
      this.tablist.forEach((item, index) => {
        item.isBool = false
      })
      this.num = index
      item.isBool = true
      switch (index) {
        case 0:
        //   this.getBalanceList()
          break
        case 1:
        //   this.getCashList()
          break
        case 2:
        //   this.getDepositList()
          break
      }
    },
    getMessageList(){
        getMessageList({
          page: this.filters.page,
          limit: this.filters.rows,
        }).then(res => {
            if(res.data.code == 0){
                this.tableData = res.data.data
                this.total = res.data.meta.total
            }
        })
    },
    handleSizeChange(val) {
      this.filters.rows = val
      // this.filters.currentpage = val;
      this.getMessageList()
    },
     handleCurrentChange(val) {
      this.filters.page = val
      this.filters.currentpage = val
      this.getMessageList()
      // console.log(`当前页: ${val}`);
    },

  }
}
</script>
<style lang="scss">
.messageList {
    .el-table thead{
        display: none;
    }
    .el-form-item__label{
        text-align: left;
        color: #7C8FA6;
       
    }
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
.messageList {
    margin:24px 40px 0 40px;
      .tabs {
        display: inline-block;
        width: 100%;
        background-color: #ffffff;
        overflow: hidden;
        list-style: none;
        margin: 0;
        padding: 0;
        li {
          float: left;
          width: 150px;
        //   height: 60px;
          line-height:60px;
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
      .messageListContent{
          margin-top:24px;
          li{
              padding:0 40px 0;
              span:first-child{
                  color: #004167;
              }
              span:nth-child(2){
                  color:#50688C;
                  margin-left:8px;
                  width: 800px;
              }
              span:last-child{
                  color:#50688C;
              }
          }
          li:nth-child(2n+1){
            //   height: 60px;
            //   line-height:60px;
              background-color: #ffffff;
          }
          li:nth-child(2n){
            //   height: 60px;
            //   line-height:60px;
              background-color: #F5F8FA;
          }
      }
      .toolbar{
        position: absolute;
        right: 40px;
        bottom: 10px;
    }
}
</style>
