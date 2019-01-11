<template>
  <div class="walletDetail">
    <p class="titleText">钱包详情</p>
    <el-form :model="form" class="walletDetailContent" label-width="160px">
      <el-form-item label="状态">
        <span v-if="form.status==2">成功</span>
        <span v-if="form.status!=2">失败</span>
      </el-form-item>
      <el-form-item label="创建时间">{{ form.created_at }}</el-form-item>
      <el-form-item label="类型">
        <span v-if="form.type=='4'" >提现</span>
        <span v-if="form.type=='5'" >手续费</span>
        <span v-if="form.type=='6'" >提现退款</span>
        <span v-if="form.type=='7'" >手续费退款</span>
        <span v-if="form.type=='8'" >验货收入</span>
        <span v-if="form.type=='9'" >保证金</span>
        <span v-if="form.type=='10'" >其他费用</span>
        <span v-if="form.type=='11'" >保证金扣除</span>
      </el-form-item>
      <el-form-item label="金额">
        <span v-if="form.plus_minus==true">+</span>
        <span v-if="form.plus_minus==false">-</span>
        {{ form.price }}
        </el-form-item>
      <el-form-item label="钱包余额">
         ¥{{jsonGetName(form.currency_data,'CNY') }}
        </el-form-item>
        <el-form-item label="说明">
          {{form.description ? form.description : '无'}}
        </el-form-item>
      
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
