<template>
  <div class="walletDetail">
    <p class="titleText">提现记录详情</p>
    <div v-if="form.status==2">
      <div class="content">
        <span class="recordText">提现申请</span>
        <span class="recordText">处理中</span>
        <span class="recordFailText">提现失败</span>
        <img src="/static/image/fail_bar.png" alt="">
        <span class="recordTime">{{form.created_at}}</span>
        <span class="recordTime"></span>
        <span class="recordTime">{{form.log.hasOwnProperty("FD")?fdTime(form.log.FD):''}}</span>
      </div>
    </div>
    <div v-if="form.status==1">
      <div class="content">
        <span class="recordText">提现申请</span>
        <span class="recordText">处理中</span>
        <span class="recordText">提现成功</span>
        <img src="/static/image/success_bar.png" alt="">
        <span class="recordTime">{{form.created_at}}</span>
        <span class="recordTime"></span>
        <span class="recordTime">{{form.log.hasOwnProperty("FD")?fdTime(form.log.FD):''}}</span>
      </div>
    </div>
    <div v-if="form.status==0">
      <div class="content">
        <span class="recordText">提现申请</span>
        <span class="recordText">处理中</span>
        <span class="recordText">提现成功</span>
        <img src="/static/image/waiting_bar.png" alt="">
        <span class="recordTime">{{form.created_at}}</span>
        <span class="recordTime"></span>
        <span class="recordTime">{{form.log.hasOwnProperty("FD")?fdTime(form.log.FD):''}}</span>
      </div>
    </div>
    <!-- <el-steps :active="active" finish-status="finish" align-center>
      <el-step title="登录密码验证"/>
      <el-step title="重置登录密码"/>
      <el-step title="重置成功"/>
    </el-steps> -->
    <el-form :model="form" class="walletDetailContent" label-width="160px">
      <el-form-item label="状态">
        <span v-if="form.status==0">待审核</span>
        <span v-if="form.status==1">审核通过</span>
        <span v-if="form.status==2">审核不通过</span>
      </el-form-item>
      <el-form-item label="创建时间">{{ form.created_at }}</el-form-item>
      <el-form-item label="提现金额">
        <span>-</span>
        ¥{{ form.price }}
        </el-form-item>
      <el-form-item label="钱包余额">
         {{ jsonGetName(form.currency_data,'CNY') }}
        </el-form-item>
        <el-form-item label="说明"> 
          {{form.remark ? form.remark : '无'}}
        </el-form-item>     
    </el-form>
  </div>
</template>
<script>
import {
  withdrawRecordDetail
} from '@/api/walletDetail' // 列表请求数据

export default {
  name: '',
  components: {},
  data() {
    return {
      id: this.$route.query.id,
      form: {
        status: '',
        created_at: '',
        type: '',
        price: '',
        balance: ''
      }
    }
  },
  created() {
    this.getData()
  },
  methods: {
    // 获取钱包详情
    getData() {
      withdrawRecordDetail({
        id: this.id
      }).then(res => {
        if (res.data.code == 0) {
          const data = res.data.data
          this.form = data
        }
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
    fdTime(Array){     
      return Array[Array.length-1].created_at
    }
  }
}
</script>
<style lang="scss">
.walletDetail {
    .el-form-item__label{
        text-align: left;
        color: #7C8FA6;
    }
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
.walletDetail {
    margin:40px 0 0 100px;
    .titleText{
        color:#50688C;
        font-size:16px;
    }
    .walletDetailContent{
        margin-top:25px;
        color:#50688C;
    }
    .content{
      margin:55px 0 35px;
      width: 668px;
      .recordText{
        color:#7C8CA5;
        font-size:14px;
      }
      .recordFailText{
        color:#E65C5C;
        font-size:14px;
      }
      .recordTime{
        color:#50688C;
        font-size:14px;
      }
      position: relative;
      span{
        position: absolute;
      }
      span:first-child{
        position:absolute;
        top:-25px;
      }
      span:nth-child(2){
        position:absolute;
        top:-25px;
        left:315px;
      }
      span:nth-child(3){
        position:absolute;
        top:-25px;
        right:0;
      }
      span:nth-child(5){
        position:absolute;
        top:30px;
      }
      span:nth-child(6){
        position:absolute;
        top:30px;
        left:280px;
      }
       span:nth-child(7){
        position:absolute;
        top:30px;
        right:0;
      }
    }
}
</style>
