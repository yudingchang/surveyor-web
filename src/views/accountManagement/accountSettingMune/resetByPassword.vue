<template>
  <div class="resetByPassword">
    <el-form ref="form" :model="data">
      <el-steps :active="active" finish-status="finish" align-center>
        <el-step title="登录密码验证"/>
        <el-step title="重置登录密码"/>
        <el-step title="重置成功"/>
      </el-steps>
      <div class="password" v-if="active==1">         
          <el-form-item prop="password" :rules="[{ required: true, message: '请输入登录密码', trigger: 'blur' }]">
            <i class="iconfont icon-denglumimazhongzhi"></i>
            <el-input
            v-model="data.password"
              placeholder="请输入登录密码"
              name="username"
              type="password" 
            />
          </el-form-item> 
          <el-button @click="goActiveTwo()" class="next">下一步</el-button>
          <a @click="back()" class="back">重新选择验证方式</a>       
      </div>

      <div class="password" v-if="active==2">         
          <el-form-item prop="new_password" :rules="[{ required: true, message: '请输入登录密码', trigger: 'blur' }]">
            <i class="iconfont icon-denglumimazhongzhi"></i>
            <el-input
            v-model="data.new_password"
              placeholder="请输入登录密码"
              name="username"
              type="password" 
            />
          </el-form-item> 
          <el-form-item prop="repeat_new_password" :rules="[{ required: true, message: '请确认输入登录密码', trigger: 'blur' }]">
            <i class="iconfont icon-denglumimazhongzhi"></i>
            <el-input
            v-model="data.repeat_new_password"
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

import { validpassword , resetpassword} from '@/api/accountSetting'
export default {
  name: 'resetByPassword',
  components: {
  },
  props: {
  },
  data() {
    return {
      active: 1,
      data:{
        password:''
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
          validpassword({
            password:this.data.password
          }).then(res=>{
            if(res.data.code == 0){
              if (this.active++ > 2) this.active = 1;
            }
          })
        

        }
      })
    },
    goActiveThree(){
      this.$refs.form.validate(valid => {
        if (valid) {
          resetpassword({
            password:this.data.password,
            new_password:this.data.new_password,
            repeat_new_password:this.data.repeat_new_password
          }).then(res =>{
            if(res.data.code == 0){
              if (this.active++ > 2) this.active = 1;
            }
          })
          // if (this.active++ > 2) this.active = 1;

        }
      })
    }
  }
}
</script>
<style lang='scss'>
  .resetByPassword{
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
.el-checkbox__input.is-checked .el-checkbox__inner,
.el-checkbox__input.is-indeterminate .el-checkbox__inner {
  background-color: #ffa800;
  border-color: #ffa800;
}
  }
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
  .resetByPassword{
    width: 530px;
    margin:100px auto 0;
    .password{
      margin-top:80px;
      position: relative;
      i{
        position:absolute;
        display: block;
        top: 8px;
        left: 14px;
        color:#C0C4CC;
        font-size:16px;
        z-index: 10;
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
