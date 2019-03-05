<template>
  <div class="addCard">
    <div class="addCardTop">
      添加银行卡
    </div>
    <div class="addCardContent">
      <el-form ref="cardMessage" :rules="rules" :model="cardMessage" label-width="150px">
        <el-form-item label="持卡人姓名" prop="cardholder">
          <span>{{ name }}</span>
        </el-form-item>
        <el-form-item label="开户银行" prop="open_bank">
          <el-autocomplete
            :fetch-suggestions="querySearchAsync"
            v-model="cardMessage.open_bank"
            value-key="label"
            placeholder="请输入开户银行"
            class="inputLength"
            @select="handleSelect"
            >
          </el-autocomplete>
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
        <el-form-item label="手机号码">
          <div>
            <el-input disabled v-model="phonenumber" placeholder="请输入手机号" class="input-with-select" style="width:400px;">
              <el-select slot="prepend" disabled v-model="cardMessage.area_phone_number" placeholder="中国大陆 +86" style="width:180px;color:#FFA500">
                <el-option
                  v-for="item in configs.phone_number_codes"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-input>
          </div>
        </el-form-item>
        <el-form-item label="验证码" prop="verification_code">
          <el-input v-model="cardMessage.verification_code" placeholder="请输入验证码" class="input-with-select" style="width:400px;">
            <el-button slot="append" style="width:120px;color:#FFA500;" :disabled="sendMaDisabled==true ||  phonenumber==''" @click="secondStepSendMa()">{{ secondStepText }}</el-button>
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
import { mapGetters } from 'vuex'
import { addCard , getBankList , sendMa , setDefalt } from '@/api/walletDetail'// 列表请求数据
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
      sendMaDisabled: false,
      secondStepText: '发送验证码',
      cardMessage: {
        open_bank: '',
        bank_code: 'ICBC',
        area_phone_number:'+86',
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
        // phone_number: [
        //   { required: true, message: '请输入手机号', trigger: 'blur' }
        // ],
        verification_code: [
          { required: true, message: '请输入验证码', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'real_name',
      'name',
      'phonenumber',
      'configs'
    ])
  },
  created(){
  },
  methods: {
    // 第二步发送验证码
    secondStepSendMa() {
      this.sendMa();
      const TIME_COUNT = 60
      //   this.sendMaDisabled = true
      this.secondStepText = TIME_COUNT
      clearInterval(this.timer)
      this.timer = setInterval(() => {
        if (this.secondStepText > 0 && this.secondStepText <= TIME_COUNT) {
          this.sendMaDisabled = true
         this.secondStepText--
        }else {
          this.sendMaDisabled = false
          this.secondStepText = '发送验证码'
          clearInterval(this.timer)
          this.timer = null
        }
      }, 1000)
    },
    // 输入式查询银行
    querySearchAsync(queryString, cb) {
      let restaurants  = this.configs.bankList
      let results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
      cb(results);
    },
    // 过滤符合条件的筛选项
    createFilter(queryString) {
      return (restaurant) => {
        return (restaurant.label.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    handleSelect(item) {
        this.cardMessage.bank_code = item.id
      },
    // 发送验证码
    sendMa(){
      sendMa({
        to:this.phonenumber,
        type:'phone_number'
      }).then(res=>{
        if(res.data.code == 0){

        }
      })
    },
    addCard() {
      this.$refs['cardMessage'].validate((valid) => {
        if (valid) {
          addCard({
            ...this.cardMessage,
            phone_number:this.phonenumber,
            cardholder: this.name
          }).then(res => {
            if (res.data.code == 0) {
              this.$message({
                message: '银行卡添加成功',
                type: 'success'
              })
              this.$router.push({
                path: 'withdrawCash'
              })
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
        padding:32px 0 32px 70px;
        .inputLength{
            width: 400px;
        }
    }
}
</style>
