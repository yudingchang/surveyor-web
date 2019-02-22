<template>
  <div class="resetByEmail">
    <el-form ref="form" :model="form">
      <el-steps :active="active" finish-status="finish" align-center>
        <el-step title="电子邮箱验证"/>
        <el-step title="重置登录密码"/>
        <el-step title="重置成功"/>
      </el-steps>
      <div class="password" v-if="active==1">         
          <el-form-item prop="email" :rules="[{ required: true, message: '请输入电子邮箱', trigger: 'blur' }]">
            <i class="iconfont icon-dianziyouxiangzhongzhi"></i>
            <el-input
                v-model="form.email"
              placeholder="请输入电子邮箱"
              name="username"
              disabled
              type="text" 
            />
          </el-form-item> 
          <el-form-item prop="identifyCode" :rules="[{ required: true, message: '请输入验证码', trigger: 'blur' }]">
            <i class="iconfont icon-yanzhengma"></i>
            <el-input
            v-model="form.identifyCode"
              placeholder="请输入验证码"
              name="username"
              type="text" 
              style="width:530px;"
              >
              <el-button class="orangeAppend" slot="append" style="width:120px;height:48px;" :disabled="(sendMaDisabled == true) || (form.email =='')" @click="secondStepSendMa()">{{ secondStepText }}</el-button>
            </el-input>
            <!-- <el-button class="sendMa" @click="sendma()">{{sendmaText}}</el-button> -->
          </el-form-item> 
          <el-button @click="goActiveTwo()" class="next">下一步</el-button>
          <a @click="back()" class="back">重新选择验证方式</a>       
      </div>

      <div class="password" v-if="active==2">         
          <el-form-item prop="new_password" :rules="[{ required: true, message: '请输入登录密码', trigger: 'blur' }]">
            <i class="iconfont icon-denglumimazhongzhi"></i>
            <el-input
            v-model="form.new_password"
              placeholder="请输入登录密码"
              name="username"
              oncopy="return false"
              onpaste="return false"
              type="password" 
              @focus="passwordPumpShow=true"
              @blur="passwordPumpShow=false"
            />
            <div v-if="passwordPumpShow" class="passwordPump">
              1、8-20位字符<br>
              2、大写字母、小写字母、数字、特殊符号两种组合以上
               <div class="hover-pump-arrow"></div>
            </div>
          </el-form-item>
          <el-form-item prop="repeat_new_password" :rules="[{ required: true, message: '请确认输入登录密码', trigger: 'blur' }]">
            <i class="iconfont icon-denglumimazhongzhi"></i>
            <el-input
            v-model="form.repeat_new_password"
              placeholder="请确认登录密码"
              name="username"
              type="password" 
            />
          </el-form-item> 
          <el-button @click="goActiveThree()" class="next">确认</el-button>
          <a @click="back()" class="back">重新选择验证方式</a>       
      </div>
      <div class="partThree" v-if="active==3">         
          <i class="iconfont icon-Fill4"></i>  
          <p class="text1">您的登录密码重置成功</p>  
          <p class="text2">下次请使用新密码进行登录</p>
      </div>
      
    </el-form>  
     
  </div>
</template>

<script>
import {  resetpassword } from '@/api/accountSetting'
import { resetPassword , forgetSendMa} from '@/api/login'
import { mapGetters } from 'vuex'
export default {
  name: 'resetByPassword',
  components: {
  },
  props: {
  },
  data() {
    return {
      active: 1,
      // 密码报错提示框
      passwordPumpShow:false,
      secondStepText:'获取验证码',
      sendMaDisabled:false,
      form:{
        password:''
      }
    }
  },
   computed: {
    ...mapGetters([    
      'email'
    ])
  },  
  created(){
    this.form.email = this.email
  },
  watch: {
    'form.new_password': function() {
      const passwordReg = /^(?![A-Z]+$)(?![a-z]+$)(?!\d+$)(?![\W_]+$)\S{8,20}$/
      if (passwordReg.test(this.form.new_password)) {
        this.passwordPumpShow = false
      } else {
        this.passwordPumpShow = true
      }
    }
  },
  methods: {
    back(){
      this.$router.go(-1)
    },
    goActiveTwo(){
       this.$refs.form.validate(valid => {
        if (valid) {
            if (this.active++ > 2) this.active = 1;
        //   validpassword({
        //     password:this.data.password
        //   }).then(res=>{
        //     if(res.data.code == 0){
              
        //     }
        //   })
        

        }
      })
    },
    goActiveThree(){
      this.$refs.form.validate(valid => {
        if (valid) {
          resetPassword({
            verification_code:this.form.identifyCode,
            type:'email',
            email:this.form.email,
            password:this.form.new_password,
            repeat_password:this.form.repeat_new_password,
          }).then(res =>{
            if(res.data.code == 0){
              if (this.active++ > 2) this.active = 1;
            }
          })
          // if (this.active++ > 2) this.active = 1;

        }
      })
    },
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
    // 发送验证码
    sendMa(){
      forgetSendMa({
        to:this.form.email,
        type:'email'
      }).then(res=>{
        if(res.data.code == 0){

        }
      })
    },
  }
}
</script>
<style lang='scss'>
  .resetByEmail{
    $body_padding: 20px;
    .el-input__inner{
      height: 50px;
      line-height:50px;
      padding: 0 40px;
    }
    .el-checkbox__inner {
  border: 1px solid #c0c4cc;
  background: transparent;
}
// 步骤样式格式化
.el-step__title.is-process {
  color: #909399;
  font-weight: normal;
}
.el-step__head.is-process {
  color: #909399;
  border-color: #ffffff;
}
.el-step__icon {
  width: 40px;
  height: 40px;
  background-color: transparent;
}
.el-step.is-center .el-step__line {
  left: calc(50% + #{$body_padding});
  right: calc(-50% + #{$body_padding});
  background-color: #909399;
  top: 20px;
  height: 1px;
}
.is-finish .is-text{
  border:1px solid #ffa800 !important;
}
.el-step__icon.is-text {
  border: 1px solid #909399;
}
.el-step__icon-inner {
  font-weight: normal;
  font-size: 14px;
}
.el-step__title.is-finish {
  color: #ffa800;
}
.el-step__head.is-finish {
  color: #ffa800;
  border-color: #ffa800;
}
.el-step__head.is-wait {
  color: #909399;
  border-color: #909399;
  
}
.el-step__title.is-wait {
  color: #909399;
}
.el-checkbox__input.is-focus .el-checkbox__inner {
  border-color: #c0c4cc;
}
.el-input-group__append{
  border:none;
  // border-radius: 0;
  color:#ffffff;
  background-color: #FFA800;
}    
.el-checkbox__input.is-checked .el-checkbox__inner,
.el-checkbox__input.is-indeterminate .el-checkbox__inner {
  background-color: #ffa800;
  border-color: #ffa800;
}
  }
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
  .resetByEmail{
    width: 530px;
    margin:100px auto 0;
    .password{
      margin-top:80px;
      position: relative;
      .passwordPump {
        position: absolute;
        top: 70px;
        left: 0;
        padding: 16px 23px;
        width: 530px;
        // height: 90px;
        background: #ffffff;
        font-size: 14px;
        color: #909399;
        text-align: left;
        z-index: 11;
        .hover-pump-arrow {
          position: absolute;
          content: " ";
          width: 0;
          height: 0;
          border: 10px solid rgba(96, 98, 102, 0.9);
          border-top-color: transparent;
          border-left-color: transparent;
          border-right-color: transparent;
          border-bottom-color: #ffffff;
          top: -20px;
          left: 50%;
          margin-left: -10px;
        }
      }
      i{
        position:absolute;
        display: block;
        top: 8px;
        left: 14px;
        color:#C0C4CC;
        font-size:16px;
        z-index: 10;
      }
      .sendMa{
          width: 115px;
          height: 50px;
          background:#FFA800;
          color:#ffffff;
          border-radius: 0;
      }
      
      .orangeAppend{
       
      }
    }
    .partThree{
      i{
        text-align:center;
        display: block;
        font-size:108px;
        color:#67C23A;
        margin:70px auto 0;
      }
      .text1{
        color: #474747;
        text-align:center;
      }
      .text2{
        color: #999999;
        text-align:center;
      }
    }
    .next{
      display: block;
      text-align:center;
      width: 140px;
      margin:50px auto 0;
      height: 40px;
      border:none;
      outline:none;
      background:#FFA800;
      color:#ffffff;
    }
    .back{
      margin-top:10px;
      display: block;
      text-decoration: underline;
      color:#999999;
      text-align:center;
    }
  }
</style>  
