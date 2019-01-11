<template>
  <div class="walletDetail">
    <p class="titleText">提现记录详情</p>
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
         ¥{{jsonGetName(form.currency_data,'CNY') }}
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
}
</style>
