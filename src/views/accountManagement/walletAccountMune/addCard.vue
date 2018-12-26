<template>
  <div class="addCard">
    <div class="addCardTop">
      添加银行卡
    </div>
    <div class="addCardContent">
      <el-form ref="cardMessage" :rules="rules" :model="cardMessage" label-width="150px">
        <el-form-item label="持卡人姓名" prop="cardholder">
          <span>{{ cardMessage.cardholder }}</span>
        </el-form-item>
        <el-form-item label="开户银行" prop="open_bank">
          <el-select v-model="cardMessage.open_bank" placeholder="请选择开户银行" class="inputLength">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="开户支行" prop="bank_branch">
          <el-input v-model="cardMessage.bank_branch" placeholder="请输入开户支行名称" class="inputLength"/>
          <el-tooltip class="item" effect="dark" placement="right">
            <div slot="content">开户支行是指您办卡的具体银行网点。<br>填写形式：比如上海工商银行松江大学城支行</div>
            <i style="color:#7F8FA4;font-size:18px;" class="el-icon-question"/>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="银行账号" prop="bank_account">
          <el-input v-model="cardMessage.bank_account" placeholder="请输入银行账号" class="inputLength"/>
        </el-form-item>
        <el-form-item label="手机号码" prop="phone_number">
          <div>
            <el-input v-model="cardMessage.phone_number" placeholder="请输入手机号" class="input-with-select" style="width:400px;">
              <el-select slot="prepend" v-model="select" placeholder="请选择区号" style="width:180px;color:#FFA500">
                <el-option label="餐厅名" value="1"/>
                <el-option label="订单号" value="2"/>
                <el-option label="用户电话" value="3"/>
              </el-select>
            </el-input>
          </div>
        </el-form-item>
        <el-form-item label="验证码" prop="verification_code">
          <el-input v-model="cardMessage.verification_code" placeholder="请输入验证码" class="input-with-select" style="width:400px;">
            <el-button slot="append" style="width:120px;color:#FFA500;" @click="secondStepSendMa()">{{ secondStepText }}</el-button>
          </el-input>
        </el-form-item>
        <el-form-item label=" ">
          <el-button type="warning" style="width:200px;background-color:#FFA800;height:40px;font-size:16px;" @click="addCard()">确定添加</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { addCard } from '@/api/walletDetail'// 列表请求数据
export default {
  name: '',
  components: {
  },
  data() {
    return {
      options: [{
        value: '选项1',
        label: '黄金糕'
      }, {
        value: '选项2',
        label: '双皮奶'
      }, {
        value: '选项3',
        label: '蚵仔煎'
      }, {
        value: '选项4',
        label: '龙须面'
      }, {
        value: '选项5',
        label: '北京烤鸭'
      }],
      value: '',
      secondStepText: '发送验证码',
      cardMessage: {
        cardholder: '狗子',
        open_bank: '',
        bank_code: 'ICBC',
        bank_branch: '',
        bank_account: '',
        phone_number: '',
        verification_code: ''
      },
      rules: {
        open_bank: [
          { required: true, message: '请选择开户银行', trigger: 'change' }
        ],
        bank_branch: [
          { required: true, message: '请输入开户支行名称', trigger: 'blur' }
        ],
        bank_account: [
          { required: true, message: '请输入银行账号', trigger: 'blur' }
        ],
        //    open_bank: [
        //     { required: true, message: '请选择区号', trigger: 'change' },
        //   ],
        phone_number: [
          { required: true, message: '请输入手机号', trigger: 'blur' }
        ],
        verification_code: [
          { required: true, message: '请输入验证码', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 第二步发送验证码
    secondStepSendMa() {
    //   this.forgetSendMa();
      const TIME_COUNT = 60
      //   this.sendMaDisabled = true
      this.secondStepText = TIME_COUNT
      clearInterval(this.timer)
      this.timer = setInterval(() => {
        if (this.secondStepText > 0 && this.secondStepText <= TIME_COUNT) {
          this.secondStepText--
        } else {
          this.sendMaDisabled = false
          this.secondStepText = '发送验证码'
          clearInterval(this.timer)
          this.timer = null
        }
      }, 1000)
    },
    addCard() {
      this.$refs['cardMessage'].validate((valid) => {
        if (valid) {
          addCard({
            ...this.cardMessage
          }).then(res => {
            if (res.data.code == 0) {

            }
          })
        }
      })
    }
  }
}
</script>
<style lang="scss">
.addCard{
    .el-form-item__label{
        text-align: left;
    }
    .el-input-group__prepend , .el-input-group__append{
        background-color: #ffffff;
    }

}

</style>

<style rel="stylesheet/scss" lang="scss" scoped>
.addCard {
    margin:24px 40px 0;
    background-color:#ffffff;
    min-height:80vh;
    .addCardTop{
        height: 80px;
        line-height:80px;
        padding-left:32px;
        border-bottom:1px solid #DFE3E9;
        font-size:16px;
        color:#50688C;
    }
    .addCardContent{
        padding:32px 0 0 70px;
        .inputLength{
            width: 400px;
        }
    }
}
</style>
