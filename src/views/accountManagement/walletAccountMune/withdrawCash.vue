<template>
  <div class="withdrawCash">
    <el-row type="flex" class="row-bg" justify="center">
      <el-col :span="24">
        <div class="withdrawCashTop clearfix">
          <span style="float:left">
            <span>提现钱包余额到银行卡</span>
            <span style="margin-left:40px;">余额:</span>
            <span class="moneyText">¥{{ balance }}</span>
            <span>元</span>
          </span>
          <el-button style="float:right;margin-top:5px;" @click="addCard()" type="success" icon="el-icon-plus">添加银行卡</el-button>
        </div>
      </el-col>
    </el-row>
    <div class="withdrawCashContent">
      <el-form>
        <el-form-item label="选择银行卡" label-width="100px">
          <div v-for="(item,index) in cardList" :key="index" class="cardSt">
            <el-radio v-model="radio" :label="index" @change="selects(item)">
              <div style="display:inline-block;width:250px;">
                <span>{{ item.open_bank }}</span>
                <span>{{ item.bank_account }}</span>
                <span v-if="item.is_default == 1">(默认卡)</span>
              </div>
              <el-select v-model="item.status" placeholder="管理" class="cardSelect" @change="manage(item)">
                <el-option label="管理" value="1" />
                <el-option label="设为默认" value="2"/>
                <el-option label="删除" value="3"/>
              </el-select>
            </el-radio>
          </div>
        </el-form-item>
        <el-form-item label="提现金额" label-width="100px">
          <div class="inputContent">
            <el-input v-model="price" placeholder="请输入内容" style="width:300px;">
              <span>元</span>
            </el-input>
            <span class="unit">元</span>
          </div>
          <span class="depositAll" @click="depositAll()">全部提现</span>
        </el-form-item>
        <el-form-item label label-width="100px" style="margin-top:-20px;">
          <span style="color:#7C8FA6;">注:每次提现需手续费15元，建议一次性提现</span>
        </el-form-item>
        <el-form-item label label-width="100px">
          <el-button :disabled="!(isdisabled==false && (price !='') && (cardDetail != ''))" :class="{'disableBg':!(isdisabled==false && (price !='') && (cardDetail != ''))}" class="greenBtn" @click="goconfirmDrawCash()">申请提现</el-button>
        </el-form-item>
        <el-form-item label label-width="100px" style="margin-top:-20px;">
          <span style="color:#EF3535">提现条件:每个月1，15号</span>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import {
  getCardList,
  getWallet,
  getBalanceList,
  getCashList,
  getDepositList,
  withdrawOperation,
  setDefalt,
  removeCard
} from '@/api/walletDetail' // 列表请求数据

export default {
  name: '',
  components: {},
  data() {
    return {
      balance: '8989.89',
      radio: '',
      select: '',
      balance: '',
      price: '',
      cardList: [],
      cardDetail: '',
      isdisabled: false
    }
  },
  created() {
    this.getWallet()
    this.getCardList()
    this.judgeDay()
  },
  methods: {
    // 获取钱包信息
    getWallet() {
      getWallet({}).then(res => {
        if (res.data.code == 0) {
          this.balance = res.data.data.list.find(
            t => t.currency == 'CNY'
          ).price
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
        bank_id: '',
        price: '',
        deal_password: ''
      })
    },
    // 跳转确认提现
    goconfirmDrawCash() {
      if (this.isdisabled == false && this.cardDetail != '' && this.price != '') {
        this.$router.push({
          path: 'confirmDrawCash',
          query: {
            bank_id: this.cardDetail.id,
            price: this.price,
            cardholder: this.cardDetail.cardholder,
            open_bank: this.cardDetail.open_bank,
            hide_bank_account: this.cardDetail.hide_bank_account
          }
        })
      }
    },
    // 全部提现
    depositAll() {
      this.price = Number(this.balance)
    },
    selects(item) {
      this.cardDetail = item
    },
    // 判断是否每月1.15号
    judgeDay() {
      const day = new Date().getDate()
      this.isdisabled = !((day == 1 || day == 15))
    },
    // 跳转添加银行卡页面
    addCard(){
      this.$router.push({
          path: 'addCard'
        })
    },
    // 管理银行卡
    manage(item){
      console.log(item)
      switch (item.status)
      {
      case '1':
        this.$router.push({
          path: 'cardManagement'
        })
        break;
      case '2': 
      this.setDefalt(item)
        break;
      case '3':
        this.removeCard(item)
        break;
      }
    },
    // 设置默认卡
    setDefalt(item) {
      setDefalt({
        id: item.id
      }).then(res => {
        if (res.data.code == 0) {
          this.getCardList()
        }
      })
    },
    removeCard(item) {
      removeCard({
        id: item.id
      }).then(res => {
        if (res.data.code == 0) {
          this.getCardList()
        }
      })
    },

  }
}
</script>
<style lang="scss">
.withdrawCash {
  .el-form-item__label {
    text-align: left;
  }
  .cardSt {
    .el-input__inner {
      border: none;
      background-color: transparent;
    }
    .el-input__icon {
      width: 10px;
      height: 10px;
      line-height: 1;
    }
    .el-input__suffix {
      line-height: 36px;
      // right: 45px;
    }
    .el-icon-arrow-up:before {
      content: "";
      width: 0;
      height: 0;
      border-width: 5px;
      border-style: solid;
      border-color: transparent transparent #333; /*透明 透明  灰*/
      // margin:40px auto;
      position: absolute;
      top: -5px;
      right: 0;
    }
    .el-select__caret.is-reverse {
      position: relative;
      top: 5px;
    }
  }
  .el-input-group__append {
    background-color: inherit;
    border-left: none;
  }
  .el-radio + .el-radio {
    margin-left: 115px;
  }
  .el-radio__input.is-checked .el-radio__inner {
    border-color: #ffa500;
    background: #ffa500;
    width: 24px;
    height: 24px;
  }
  .el-radio__inner {
    width: 24px;
    height: 24px;
  }
  .el-radio__inner::after {
    width: 8px;
    height: 8px;
  }
  .el-radio__input.is-checked + .el-radio__label {
    color: #ffa500;
  }
  .el-select .el-input.is-focus .el-input__inner {
    border-color: #dfe3e9;
  }
  .cardSt .el-input__inner {
    text-align: right;
  }
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
.withdrawCash {
  margin: 24px 40px 0;
  background: #ffffff;
  min-height: 80vh;
  .disableBg{
      background:rgba(187,187,187,1) !important;
  }
  .withdrawCashTop {
    border-bottom: 1px solid #dfe3e9;
    padding: 28px 60px 28px 32px;
    color: #50688c;
    font-size: 16px;
    > span:first-child {
      margin-right: 40px;
    }
    .moneyText {
      font-size: 32px;
      color: #ef3535;
    }
    > span:last-child {
      color: #164061;
    }
  }
  .withdrawCashContent {
    padding: 32px 0 0 60px;
    .cardSt {
      padding: 14px 24px;
      width: 700px;
      height: 60px;
      border-radius: 4px;
      border: 1px solid rgba(192, 196, 204, 1);
      margin-bottom: 10px;
      .cardSelect {
        width: 105px;
        margin-left: 270px;
      }
      &:hover {
        background: rgba(74, 144, 226, 0.1);
      }
    }
    .inputContent {
      width: 300px;
      padding-right: 40px;
      position: relative;
      display: inline-block;
      .unit {
        position: absolute;
        right: 10px;
        top: 0;
      }
    }
    .depositAll {
      cursor: pointer;
      margin-left: 16px;
      color: #ffa800;
    }
    .greenBtn {
      width: 200px;
      height: 40px;
      background-color: #ffa800;
      color: #ffffff;
      outline: none;
      border: none;
    }
  }
}
</style>
