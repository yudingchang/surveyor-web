<template>
  <div class="walletDetail">
    <p class="titleText">钱包详情</p>
    <el-form :model="form" class="walletDetailContent" label-width="160px">
      <el-form-item label="状态">{{ form.status }}</el-form-item>
      <el-form-item label="创建时间">{{ form.created_at }}</el-form-item>
      <el-form-item label="类型">{{ form.type }}</el-form-item>
      <el-form-item label="金额">{{ form.price }}</el-form-item>
      <el-form-item label="钱包余额">{{ form.balance }}</el-form-item>
      <el-form-item label="说明"/>
    </el-form>
  </div>
</template>
<script>
import {
  walletDetail
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
    this.getWalletDetail()
  },
  methods: {
    // 获取钱包详情
    getWalletDetail() {
      walletDetail({
        id: this.id
      }).then(res => {
        if (res.data.code == 0) {
          const data = res.data.data
          this.form = data
        }
      })
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
}
</style>
