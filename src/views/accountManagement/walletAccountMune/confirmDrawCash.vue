<template>
  <div class="confirmDrawCash">
    <div class="cardManagementTop">
      确认提现
    </div>
    <div class="confirmDrawCashContent">
      <el-form label-width="150px">
        <el-form-item label="提现卡币种">
          <span>人民币</span>
        </el-form-item>
        <el-form-item label="银行卡信息">
          <div>
            <p>{{ cardholder }}</p>
            <p>{{ open_bank }}({{ hide_bank_account }})</p>
          </div>
        </el-form-item>
        <el-form-item label="提现金额">
          <span class="moneyText">¥{{ price }}</span>
        </el-form-item>
        <el-form-item label="到账时间">
          <span>预计到账5个工作日</span>
        </el-form-item>
        <el-form-item label="交易密码">
          <el-input v-model="deal_password" placeholder="请输入交易密码" style="width:200px;"/>
          <span class="blueText">忘记密码？</span>
        </el-form-item>
        <el-form-item label="">
          <el-button class="submitBtn" @click="withdrawOperation()">确定提现</el-button>
        </el-form-item>
        <el-form-item label="">
          <el-button class="returnBtn" @click="back()">返回</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { withdrawOperation } from '@/api/walletDetail'// 列表请求数据

export default {
  name: '',
  components: {
  },
  data() {
    return {
      cardholder: this.$route.query.cardholder,
      open_bank: this.$route.query.open_bank,
      hide_bank_account: this.$route.query.hide_bank_account,
      price: this.$route.query.price,
      bank_id: this.$route.query.bank_id,
      deal_password: ''
    }
  },
  created() {
    this.getWallet()
    this.getCardList()
  },
  methods: {
    // 获取钱包信息
    getWallet() {
      getWallet({}).then(res => {
        if (res.data.code == 0) {
          this.balance = res.data.data.list.find(t => t.currency == 'CNY').price
          // this.freeze = res.data.data.list.find(t => t.currency == 'CNY' ).freeze
        }
      })
    },
    // 获取银行卡列表
    getCardList() {
      getCardList({}).then(res => {
        if (res.data.code == 0) {
          this.cardList = res.data.data.list
          this.CardDetail = res.data.data.list[0]
        }
      })
    },
    // 提现
    withdrawOperation() {
      withdrawOperation({
        bank_id: this.bank_id,
        price: this.price,
        deal_password: this.deal_password
      }).then(res => {
        if (res.data.code == 0) {
          this.$message({
            message: '提现成功',
            type: 'success'
          })
          this.$router.push({
            path: 'withdrawCash'
          })
        } else {
          this.$message({
            message: `${res.data.message}`
          })
        }
      })
    },
    back() {
      this.$router.go(-1)
    }
  }
}
</script>
<style lang="scss">
.confirmDrawCash{
    .el-form-item__label{
        text-align: left;
        color: #7C8FA6;
    }
}

</style>

<style rel="stylesheet/scss" lang="scss" scoped>
.confirmDrawCash {
    margin:24px 40px 0;
    background:#ffffff;
    min-height:80vh;
     .cardManagementTop{
        height: 80px;
        line-height:80px;
        padding-left:32px;
        border-bottom:1px solid #DFE3E9;
        font-size:16px;
        color:#50688C;
    }
    .confirmDrawCashContent{
        padding:32px 0 0 70px;
        color:#50688C;
        .moneyText{
            font-size:24px;
            color:#EF3535;
        }
        .blueText{
            margin-left:16px;
            color:#158BE4;
        }
        .submitBtn{
            width:200px;higth:40px;background:rgba(255,168,0,1);border:none;color:#ffffff;outline:none;
        }
        .returnBtn{
            width:200px;higth:40px;background:#C0C4CC;border:none;color:#ffffff;outline:none;
        }
    }
}
</style>
