<template>
  <div class="accountSetting">
    <el-row class="clearfix">
      <el-col style="float:left;width:160px" >
        <el-upload
          class="avatar-uploader"
          action="https://jsonplaceholder.typicode.com/posts/"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload">
          <img v-if="imageUrl" :src="imageUrl" class="avatar">
          <!-- <i v-else class="el-icon-plus avatar-uploader-icon"></i> -->
          <div v-else >
            <img src="/static/image/male.png" style="width:120px;height:120px;">
            <p style="color:#7C8FA6;font-size:14px">上传头像</p>
          </div>
        </el-upload>
      </el-col>
      <el-col :span="12" class="accountSetting-info" style="margin-left:70px;">
        <!-- 手机号码 -->
        <div class="Setting-info-Mobile">
          <p>手机号码</p>
          <p>
            
            <span v-if="phonenumber == ''">未绑定</span>
            <span v-else>{{phonenumber}}</span>
            <span  v-if="phonenumber == ''">立即绑定</span>
            <span @click="modifyPhone" v-else>修改</span>
          </p>
        </div>    
        <!-- 电子邮箱 -->
        <div class="Setting-info-mail">
          <p>电子邮箱</p>
          <p>
            <span v-if="email==null">
              未绑定
            </span>
            <span v-else>
              {{email}}
            </span>
            <span v-if="email==null" @click="modifyEmail()">
              绑定
            </span>
            <span v-else  @click="modifyEmail()">
              修改
            </span>
          </p>
        </div>     
        <!-- 密码登录 -->
        <div class="Setting-info-loginPassword">
          <p>登录密码</p>
          <p>
            <span>*********</span>
            <span @click="resetLoginpass">重置</span>
          </p>
        </div>
        <!-- 支付密码 -->
        <div class="Setting-info-payPassword">
          <p>支付密码</p>
          <p>
            <span v-if="is_paypassword==false">未设置</span>
            <span v-else>*******</span>
            <span v-if="is_paypassword==false" @click="modifyPay()">点击设置</span>
            <span v-else @click="modifyPayWord()">重置</span>
          </p>
        </div>
      </el-col>
    </el-row>
    <!-- 修改手机号码 -->
    <el-dialog title="修改手机号码" :visible.sync="form.dialogFormVisible" width="400px" center>
      <el-form :model="form" ref='form'>
        <el-form-item class="modifyPhone" prop="phone_number" :rules="[{ required: true, message: '请输入手机号', trigger: 'blur' }]">
          <el-input placeholder="请输入手机号" v-model="form.phone_number" class="input-with-select">
            <el-select v-model="select" slot="prepend" placeholder="请选择" style="width:180px">
              <el-option label="餐厅名" value="1"></el-option>
              <el-option label="订单号" value="2"></el-option>
              <el-option label="用户电话" value="3"></el-option>
            </el-select>
          </el-input>
        </el-form-item>
        <el-form-item class="modify2" prop="verification_code" :rules="[{ required: true, message: '请输入验证码', trigger: 'blur' }]">
          <el-input placeholder="请输入验证码" v-model="form.verification_code" class="input-with-select">
            <i class="iconfont icon-yanzhengma" slot="prepend"></i>
            <el-button slot="append" :disabled="form.phone_number=='' || form.sendMaDisabled == true" @click="secondStepSendMa()" style="width:120px;text-align:center">{{form.secondStepText}}</el-button>
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button style="background:#FFA800;border:none;width:140px;" type="primary" @click="phone_submit()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 手机号码绑定成功 -->
    <el-dialog :visible.sync="form.reviseMailSuccess" width="500px" center>
      <div class="dialogContent">
        <i class="iconfont icon-Fill4"></i>
        <p class="text1">您的手机号码修改成功</p>
        <p class="text2">下次请使用修改后的手机号码登录</p>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button style="background:#FFA800;border:none;width:140px;" type="primary" @click="modifyPhoneSubmit()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 绑定电子邮箱 -->
    <el-dialog :title="emailForm.emailText" :visible.sync="emailForm.dialogFormVisible" width="400px" center>
      <el-form :model="emailForm" ref='emailForm'>
        <el-form-item class="modify2" prop="email" :rules="[{ required: true, message: '请输入验证码', trigger: 'blur' }]">
          <el-input placeholder="请输入电子邮箱" v-model="emailForm.email" class="input-with-select">
            <i class="iconfont icon-dianziyouxiangzhongzhi" slot="prepend"></i>
          </el-input>
        </el-form-item>
        <el-form-item class="modify2" prop="verification_code" :rules="[{ required: true, message: '请输入验证码', trigger: 'blur' }]">
          <el-input placeholder="请输入验证码" v-model="emailForm.verification_code" class="input-with-select">
            <i class="iconfont icon-yanzhengma" slot="prepend"></i>
            <el-button slot="append" :disabled="emailForm.email=='' || emailForm.sendMaDisabled == true" @click="emailSendMa()" style="width:120px;text-align:center;color:#ffffff">{{emailForm.secondStepText}}</el-button>
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button style="background:#FFA800;border:none;width:140px;" type="primary" @click="email_submit()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 电子邮箱绑定成功 -->
    <el-dialog :visible.sync="emailForm.reviseMailSuccess" width="500px" center>
      <div class="dialogContent">
        <i class="iconfont icon-Fill4"></i>
        <p class="text1">您的电子邮箱<span v-if="email==null">绑定</span><span v-else>修改</span>成功</p>
        <p class="text2">下次请使用<span v-if="email==null">绑定</span><span v-else>修改</span>后的电子邮箱登录</p>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button style="background:#FFA800;border:none;width:140px;" type="primary" @click="modifyEmailSubmit()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 设置支付密码 -->
    <el-dialog :title="payForm.emailText" :visible.sync="payForm.dialogFormVisible" width="400px" center>
      <el-form :model="payForm" ref='payForm'>
        <el-form-item class="modify2" prop="password" :rules="[{ required: true, message: '请输入支付密码', trigger: 'blur' }]">
          <el-input placeholder="请输入支付密码" v-model="payForm.password" class="input-with-select">
            <i class="iconfont icon-denglumimazhongzhi1" slot="prepend"></i>
          </el-input>
        </el-form-item>
        <el-form-item class="modify2" prop="comfirm_password" :rules="[{ required: true, message: '请确认支付密码', trigger: 'blur' }]">
          <el-input placeholder="确认支付密码" v-model="payForm.comfirm_password" class="input-with-select">
            <i class="iconfont icon-denglumimazhongzhi1" slot="prepend"></i>
            <!-- <el-button slot="append" :disabled="payForm.email=='' || payForm.sendMaDisabled == true" @click="emailSendMa()" style="width:120px;text-align:center;color:#ffffff;border:none;">{{payForm.secondStepText}}</el-button> -->
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button style="background:#FFA800;border:none;width:140px;" type="primary" @click="pay_submit()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 支付密码设置成功 -->
    <el-dialog :visible.sync="payForm.reviseMailSuccess" width="500px" center>
      <div class="dialogContent">
        <i class="iconfont icon-Fill4"></i>
        <p class="text1">您的支付密码设置成功</p>
        <p class="text2">下次请使用新的支付密码支付</p>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button style="background:#FFA800;border:none;width:140px;" type="primary" @click="modifyPaySubmit()">确 定</el-button>
      </div>
    </el-dialog>


  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import store from '../../../store/'
import { sendMa } from '@/api/walletDetail'
import { changeUserInfo , set_password} from '@/api/accountSetting'

export default {
  name: 'accountSetting',
  components: {
    //   accountResetLoginPassword
      },
  data(){
    return{
      form:{
        phone_number:'',
        verification_code:'',
        sendMaDisabled:false,
        dialogFormVisible:false,
        secondStepText:'获取验证码',
        reviseMailSuccess:false,
      },
      emailForm:{
        email:'',
        verification_code:'',
        sendMaDisabled:false,
        dialogFormVisible:false,
        secondStepText:'获取验证码',
        emailText:'绑定电子邮箱',
        reviseMailSuccess:false,
      },  
      payForm:{
        password:'',
        sendMaDisabled:false,
        dialogFormVisible:false,
        secondStepText:'获取验证码',
        emailText:'设置支付密码',
        reviseMailSuccess:false,
      }, 
      imageUrl:'',     
      
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'name',
      'phonenumber',
      'email',
      'is_paypassword',
      'avatar',
      'device'
    ])
  },
  created(){
    // this.getAccountInfoData()
    // console.log(new Date)
  },
  methods:{
    //打开页面获取账户信息
    getAccountInfoData(){
      getAccountInformation().then(response =>{
        if(response.data.code == 0){
          this.AccountSettingData = response.data.data
        }
      })
    },
    modifyPhone(){
      this.form.dialogFormVisible = true
    },
     modifyEmail(){
       if(this.email == null){
         this.emailForm.emailText = '绑定电子邮箱'
       }else{
         this.emailForm.emailText = '修改电子邮箱'
       }
      this.emailForm.dialogFormVisible = true
    },
  // 手机号绑定验证码
    secondStepSendMa() {
      this.sendMa();
      const TIME_COUNT = 60
      //   this.sendMaDisabled = true
      this.form.secondStepText = TIME_COUNT
      clearInterval(this.timer)
      this.timer = setInterval(() => {
        if (this.form.secondStepText > 0 && this.form.secondStepText <= TIME_COUNT) {
          this.form.sendMaDisabled = true
         this.form.secondStepText--
        }else {
          this.form.sendMaDisabled = false
          this.form.secondStepText = '发送验证码'
          clearInterval(this.timer)
          this.timer = null
        }
      }, 1000)
    },
    // email绑定验证码
    emailSendMa(){
      this.sendMa2();
      const TIME_COUNT = 60
      //   this.sendMaDisabled = true
      this.emailForm.secondStepText = TIME_COUNT
      clearInterval(this.timer)
      this.timer = setInterval(() => {
        if (this.emailForm.secondStepText > 0 && this.emailForm.secondStepText <= TIME_COUNT) {
          this.emailForm.sendMaDisabled = true
         this.emailForm.secondStepText--
        }else {
          this.emailForm.sendMaDisabled = false
          this.emailForm.secondStepText = '发送验证码'
          clearInterval(this.timer)
          this.timer = null
        }
      }, 1000)
    },
    // 发送验证码
    sendMa(){
      sendMa({
        to:this.form.phone_number,
        type:'phone_number'
      }).then(res=>{
        if(res.data.code == 0){

        }
      })
    },
     // 邮箱发送验证码
    sendMa2(){
      sendMa({
        to:this.emailForm.email,
        type:'email'
      }).then(res=>{
        if(res.data.code == 0){

        }
      })
    },
    // 确认修改手机号码
    phone_submit(){
      this.$refs.form.validate(valid => {
        if (valid) {
          changeUserInfo({
            verification_code:this.form.verification_code,
            type:'phone_number',
            phone_number:this.form.phone_number
          }).then(res =>{
            if(res.data.code == 0){
              this.form.dialogFormVisible = false
              this.form.reviseMailSuccess = true
            }
          })
        }
      })
    },
// 确认绑定邮箱
    email_submit(){
      this.$refs.emailForm.validate(valid => {
        if (valid) {
          changeUserInfo({
            verification_code:this.emailForm.verification_code,
            type:'email',
            email:this.emailForm.email
          }).then(res =>{
            if(res.data.code == 0){
              this.emailForm.dialogFormVisible = false
              this.emailForm.reviseMailSuccess = true
              store.dispatch('GetUserInfo')
            }
          })
        }
      })
    },
    // 手机号码修改成功确认
    modifyPhoneSubmit(){
      this.form.reviseMailSuccess=false;
      store.dispatch('GetUserInfo')
    },
    modifyEmailSubmit(){
      this.emailForm.reviseMailSuccess=false;
      this.$nextTick(()=>{
        // store.dispatch('GetUserInfo')
      })    
    },
    // 打开设置支付密码弹窗 
    modifyPay(){
      this.payForm.dialogFormVisible = true
    },
    pay_submit(){
      this.$refs.payForm.validate(valid => {
        if (valid) {
          if(this.payForm.password == this.payForm.comfirm_password ){
            set_password({
              password : this.payForm.password
            }).then(res=>{
              if(res.data.code == 0){
                this.payForm.dialogFormVisible = false
                this.payForm.reviseMailSuccess = true
              }
            })
          }else{
          this.$message({
            message: '密码不一致',
            type: 'error'
          });
          return false
          }
        }
      })
    },
    modifyPaySubmit(){
      this.payForm.reviseMailSuccess=false;
      this.$nextTick(()=>{
        store.dispatch('GetUserInfo')
      })   
    },
    // 跳转重置支付密码页面
    modifyPayWord(){
      this.$router.push({
        path:'resetPaymentPassword'
      })
    },


    //点击获取验证码，发送短信
    getAuthCodeSend(){
      //非空验证
      if(this.inputMobile ==''){
        this.authCodePromt = true
        this.authCodePromtValue = '*手机号码不能为空'
      }else if(!/^[0-9]*$/.test(this.inputMobile)){
        this.authCodePromt = true
        this.authCodePromtValue = '*手机号码输入格式错误'
      }else{
        //判断
        this.sendMa()
        this.authCodePromt = false
        this.getAuthCode = false
        this.CountDown = true
        this.auth_time = 59
        let auth_timetimer =  setInterval(()=>{     //启动定时器,倒计时
          this.auth_time--;
              if(this.auth_time<=0){
              this.getAuthCode = true
              this.CountDown = false
              clearInterval(auth_timetimer)
            }
        }, 1000)
      }
    },
    //确定绑定成功的按钮
    MobileBindTrue(){
       this.$refs.phoneform.validate(valid => {
        if (valid) {
          changeUserInfo({
           type:'phone_number',
           phone_number:this.phoneform.phone
          }).then(res =>{
            if(res.data.code == 0){
              if (this.active++ > 2) this.active = 1;
            }
          })
        }
      })
      // this.dialogFormMobile = false
      // this.dialogSuccess = true
    },

    //修改手机号码
    reviseMobile(){
      this.dialogFormMobile = true
    },

    //修改电子邮箱
    reviseMail(){
      this.dialogFormMail = true
    },

    getMailValidate(){      //点击 发送邮件地址到后台，发送验证码
      if(this.inputMailInfo == ''){
        this.mailPromtVS=true
        this.mailPromtValue='电子邮箱号码不能为空'
      }else if(!(/^([0-9A-Za-z\-_\.]+)@([0-9a-z]+\.[a-z]{2,3}(\.[a-z]{2})?)$/g).test(this.inputMailInfo)){
        this.mailPromtVS=true
        this.mailPromtValue='电子邮箱号码输入格式错误'
      }else{
        this.mailPromtVS=false
        this.getMailValidateVS = false
        this.inputMailTimeVS = true
        this.auth_time_Validate = 59
        let auth_timetimer =  setInterval(()=>{     //启动定时器,倒计时
          this.auth_time_Validate--;
              if(this.auth_time_Validate<=0){
              this.getMailValidateVS = true
              this.inputMailTimeVS = false
              clearInterval(auth_timetimer)
            }
        }, 1000)
      }
    },

    ConfirmRevise(){      //修改弹框确认修改
        this.dialogFormMail = false
        this.reviseMailSuccess = true
    },
    // 发送验证码
    

    //重置登录密码
    resetLoginpass(){
      // this.accountSettingVif = false
      // this.$route.meta.keepAlive = false
      this.$router.push({name: 'accountResetLoginPassword',params: {reset: ''}})
      // this.ResetLoginPassword = true
    },

    //点击设置
    clickSetting(){

    },
    handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw);
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      }

  },
}
</script>

<style rel="stylesheet/scss" lang="scss" >
//element-ui样式
.accountSetting{
  // .avatar-uploader{
  //   width: 120px;
  //   height: 160px;
  // }
  .el-dialog__title{
    color: #7F8FA4;
  }
  .modifyPhone .el-input-group__prepend{
    background-color:inherit;
  }
  
  .modify2 {
    
    // .is-error .el-input__inner{
      
    // }
    .el-input-group__prepend{
      background-color:inherit;
      border-right:none; 
      padding: 0 10px;
    }
    .el-input__inner{
      border-left:none;
      &:hover{
        border:1px solid #dcdfe6;
        border-left:none; 
      }
      // &:active{
      //   border:1px solid #dcdfe6;
      //   border-left:none; 
      // }
      // &:visited{
      //   border:1px solid #dcdfe6;
      //   border-left:none; 
      // }
      
    }
    
    .el-input-group__append{
      background-color: #FFA800;
      color:#ffffff;
      .el-button {
        &:hover{
          background-color: #FFA800;
          color:#ffffff;
          border: none;
        }
      }
      
    }
  }
  .modify2.is-error .el-input__inner{
      border-color: #dcdfe6 !important;
    }
   .avatar-uploader .el-upload {
      // border: 1px dashed #d9d9d9;
      // border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
      border-color: #409EFF;
    }
    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      line-height: 178px;
      text-align: center;
    }
    .el-upload--text{
      width: 160px;
      height: 160px;
      border-radius: 80px;
    }
    .avatar {
      width: 100%;
      height: 100%;
      display: block;
    }
  .Setting-info-loginPassword{
    .el-input__inner{
      float:left;
    }
  }
  //绑定手机号码
  .Setting-info-MobileBind{
    .el-dialog{
        width:600px;
        height:400px;
        background:rgba(255,255,255,1);
        border-radius:8px;
        .el-dialog__header{
          padding:60px 0 0 0;
          height:93px;
          margin-bottom:50px;
          .el-dialog__title{
            margin-left:228px;
            font-size:20px;
            color:rgba(127,143,164,1);
          }
          .el-icon-close:before{
            font-size:24px;
            color:rgba(144,147,153,1);
            font-weight:600;
          }
        }
        .el-dialog__body{
          padding:0 0 31px 0;
          height:164px;
          .chooseOption{
            width:360px;
            height:40px;
            border-radius:4px;
            // border:1px solid rgba(192,196,204,1);
            line-height:40px;
            margin:0 auto;
            // overflow: hidden;
            .el-select{
              float:left;
              width:178px;
            }
            .el-input--medium{
              float:left;
              width:180px;
            }
            .el-select--medium .el-input__inner{
              border:none;
            }
            .el-input--medium .el-input__inner{
              width:178px;
              height:40px;
              float:left;
              // border-right:1px solid rgba(192,196,204,1);
              // border-radius:0;
            }
            .el-input--medium:nth-child(2) .el-input__inner{
              border:none;
              border-left:1px solid rgba(192,196,204,1);
              border-radius:0;
              border:1px solid rgba(192,196,204,1);
              border-top-right-radius:4px;
              border-bottom-right-radius:4px;
            }
            .el-input--medium:nth-child(1) .el-input__inner{
              font-size:14px;
              font-family:PingFang-SC-Medium;
              font-weight:500;
              color:rgba(255,165,0,1);
              border:1px solid rgba(192,196,204,1);
              border-right:none;
              border-top-right-radius:0;
              border-bottom-right-radius:0;
            }
            .el-input--medium:nth-child(1) .el-input__inner::-webkit-input-placeholder{
              font-size:14px;
              font-family:PingFang-SC-Medium;
              font-weight:500;
              color:rgba(255,165,0,1);
            }
            .el-input--medium:nth-child(2) .el-input__inner:focus{
              border:1px solid rgba(255,168,0,1);
            }
          }
          .chooseOption .el-input--medium:nth-child(2):focus{
            border:1px solid rgba(255,168,0,1);
          }
          .inputAuthCode{
            width:360px;
            height:40px;
            border-radius:4px;
            // border:1px solid rgba(192,196,204,1);
            line-height:40px;
            margin:24px auto 8px;
            overflow: hidden;
            .el-input--medium{
              height:40px;
              width:250px;
              float:left;
            }
            .el-input--medium .el-input__inner{
              border:none;
              height:40px;
              width:250px;
              border-radius:4px;
              border:1px solid rgba(192,196,204,1);
              border-top-right-radius:0;
              border-bottom-right-radius:0;
            }
            .el-input--medium .el-input__inner:focus{
              border:1px solid rgba(255,168,0,1);
            }
            span{
              float: left;
            }
            .getAuthCode{
              width:108px;
              height:40px;
              background:rgba(255,168,0,1);
              border-radius:4px;
              text-align:center;
              font-size:14px;
              font-family:MicrosoftYaHei;
              color:rgba(255,255,255,1);
              border-radius:0;
              border:none;
              cursor: pointer;
              border:1px solid rgba(192,196,204,1);
              border-left:none;
              border-top-right-radius:4px;
              border-bottom-right-radius:4px;
            }
            .getAuthCode:hover{
              opacity: 0.8;
            }
            .inputAuthTime{
              width:108px;
              height:40px;
              background:rgba(255,168,0,1);
              border-radius:4px;
              text-align:center;
              font-size:14px;
              font-family:MicrosoftYaHei;
              color:rgba(255,255,255,1);
              border-radius:0;
              border:none;
              // border:1px solid rgba(192,196,204,1);
              border-left:none;
              border-top-right-radius:4px;
              border-bottom-right-radius:4px;
            }
          }
          p{
            width:480px;
            height:21px;
            font-size:14px;
            font-family:MicrosoftYaHei;
            color:rgba(239,53,53,1);
            line-height:21px;
            padding-left:256px;
            text-align:right;
          }
        }
        .el-dialog__footer{
          padding:0;
          text-align:center;
          .el-button--medium{
            width:140px;
            height:40px;
            background:rgba(255,168,0,1);
            border-radius:4px;
            border:none;
            span{
              font-size:16px;
              color:rgba(255,255,255,1);
            }
          }
        }
    }
  }
  .MobileBind-Success{
    .el-dialog{
      width:600px;
      height:360px;
      background:rgba(255,255,255,1);
      border-radius:8px;
      .el-dialog__header{
          // padding:60px 0 0 0;
          padding:0;
          height:78px;
          // margin-bottom:50px;
          .el-icon-close:before{
            font-size:24px;
            color:rgba(144,147,153,1);
            font-weight:600;
          }
      }
      .el-dialog__body{
        padding:0;
        text-align:center;
        margin-bottom:41px;
        P:nth-child(1){
          width:80px;
          height:80px;
          border:5px solid rgba(103,194,58,1);
          margin:0 auto 16px;
          border-radius:50%;
          i{
            color:rgba(103,194,58,1);
            font-size:20px;
          }
        }
        p:nth-child(2){
          height:26px;
          font-size:20px;
          font-family:MicrosoftYaHei;
          color:rgba(51,51,51,1);
          line-height:26px;
          margin-bottom:10px;
        }
        p:nth-child(3){
          height:21px;
          font-size:16px;
          font-family:MicrosoftYaHei;
          color:rgba(153,153,153,1);
          line-height:21px;
        }
      }
      .el-dialog__footer{
        padding:0;
        text-align:center;
        .el-button--medium{
          width:140px;
          height:40px;
          background:rgba(255,168,0,1);
          border-radius:4px;
          border:none;
        }
        .el-button--primary{
          font-size:18px;
          font-family:MicrosoftYaHei;
          color:rgba(255,255,255,1);
        }
      }
    }
  }
  .reviseMailDialog{
    .el-dialog{
      width:600px;
      height:400px;
      background:rgba(255,255,255,1);
      border-radius:8px;
      .el-dialog__header{
        padding:60px 0 0 0;
        height:93px;
        margin-bottom:50px;
        .el-dialog__title{
          margin-left:228px;
          font-size:24px;
          font-family:PingFang-SC-Medium;
          font-weight:500;
          color:rgba(127,143,164,1);
          line-height:33px;
        }
        .el-icon-close:before{
          font-size:24px;
          color:rgba(144,147,153,1);
          font-weight:600;
        }
      }
      .el-dialog__body{
        padding:0;
        margin-bottom:40px;
        height:133px;
        .inputMailAddress{
          width:360px;
          height:40px;
          margin:0 auto 24px;
          .el-input--medium .el-input__inner{
            width:360px;
            height:40px;
            border-radius:4px;
            border:1px solid rgba(192,196,204,1);
          }
          .el-input--medium .el-input__inner::-webkit-input-placeholder{    //使用webkit内核的浏览器
            font-size:14px;
            font-family:MicrosoftYaHei;
            color:rgba(144,147,153,1);
          }
          .el-input--medium .el-input__inner:-moz-placeholder{      //Firefox版本4-18
            font-size:14px;
            font-family:MicrosoftYaHei;
            color:rgba(144,147,153,1);
          }
          .el-input--medium .el-input__inner::-moz-placeholder{       //Firefox版本19+
            font-size:14px;
            font-family:MicrosoftYaHei;
            color:rgba(144,147,153,1);
          }
          .el-input--medium .el-input__inner:-ms-input-placeholder{         //IE浏览器 
            font-size:14px;
            font-family:MicrosoftYaHei;
            color:rgba(144,147,153,1);
          }
          .el-input--medium .el-input__inner:focus{
            border:1px solid rgba(255,168,0,1);
          }
        }
        .mailValidate{
          width:360px;
          height:40px;
          border-radius:4px;
          margin:0 auto 8px;
          .el-input--medium{
            float:left;
            width:261px;
            height:40px;
          }
          .el-input__inner{
            width:261px;
            height:40px;
            border-radius:4px;
            border:1px solid rgba(192,196,204,1);
            border-top-right-radius:0;
            border-bottom-right-radius:0;
            border-right:none;
          }
          .el-input--medium .el-input__inner::-webkit-input-placeholder{    //使用webkit内核的浏览器
            font-size:14px;
            font-family:MicrosoftYaHei;
            color:rgba(144,147,153,1);
          }
          .el-input--medium .el-input__inner:-moz-placeholder{      //Firefox版本4-18
            font-size:14px;
            font-family:MicrosoftYaHei;
            color:rgba(144,147,153,1);
          }
          .el-input--medium .el-input__inner::-moz-placeholder{       //Firefox版本19+
            font-size:14px;
            font-family:MicrosoftYaHei;
            color:rgba(144,147,153,1);
          }
          .el-input--medium .el-input__inner:-ms-input-placeholder{         //IE浏览器 
            font-size:14px;
            font-family:MicrosoftYaHei;
            color:rgba(144,147,153,1);
          }
          .el-input__inner:focus{
            border:1px solid rgba(255,168,0,1);
          }
          .getMailValidate{
            float:left;
            display:inline-block;
            width:99px;
            height:40px;
            background:rgba(255,168,0,1);
            border-radius:4px;
            line-height:40px;
            text-align:center;
            font-size:14px;
            font-family:MicrosoftYaHei;
            color:rgba(255,255,255,1);
            border-top-left-radius:0;
            border-bottom-left-radius:0;
            cursor:pointer;
          }
          .getMailValidate:hover{
            opacity: 0.8;
          }
          .inputMailTime{
            float:left;
            display:inline-block;
            width:99px;
            height:40px;
            background:rgba(255,168,0,1);
            border-radius:4px;
            line-height:40px;
            text-align:center;
            font-size:14px;
            font-family:MicrosoftYaHei;
            color:rgba(255,255,255,1);
            border-top-left-radius:0;
            border-bottom-left-radius:0;
            cursor:pointer;
          }
        }
        p{
          width:480px;
          height:21px;
          font-size:14px;
          font-family:MicrosoftYaHei;
          color:rgba(239,53,53,1);
          line-height:21px;
          padding-left:256px;
          text-align:right;
        }
      }
      .el-dialog__footer{
        padding:0;
        text-align:center;
        .el-button--primary{
          width:140px;
          height:40px;
          background:rgba(255,168,0,1);
          border-radius:4px;
          border:none;
          font-size:18px;
          font-family:MicrosoftYaHei;
          color:rgba(255,255,255,1);
        }
      }
    }
  }
  .reviseMail-Success{
    .el-dialog{
      width:600px;
      height:360px;
      background:rgba(255,255,255,1);
      border-radius:8px;
      .el-dialog__header{
          // padding:60px 0 0 0;
          padding:0;
          height:78px;
          // margin-bottom:50px;
          .el-icon-close:before{
            font-size:24px;
            color:rgba(144,147,153,1);
            font-weight:600;
          }
      }
      .el-dialog__body{
        padding:0;
        text-align:center;
        margin-bottom:41px;
        P:nth-child(1){
          width:80px;
          height:80px;
          border:5px solid rgba(103,194,58,1);
          margin:0 auto 16px;
          border-radius:50%;
          i{
            color:rgba(103,194,58,1);
            font-size:20px;
          }
        }
        p:nth-child(2){
          height:26px;
          font-size:20px;
          font-family:MicrosoftYaHei;
          color:rgba(51,51,51,1);
          line-height:26px;
          margin-bottom:10px;
        }
        p:nth-child(3){
          height:21px;
          font-size:16px;
          font-family:MicrosoftYaHei;
          color:rgba(153,153,153,1);
          line-height:21px;
        }
      }
      .el-dialog__footer{
        padding:0;
        text-align:center;
        .el-button--medium{
          width:140px;
          height:40px;
          background:rgba(255,168,0,1);
          border-radius:4px;
          border:none;
        }
        .el-button--primary{
          font-size:18px;
          font-family:MicrosoftYaHei;
          color:rgba(255,255,255,1);
        }
      }
    }
  }
}
</style>




<style rel="stylesheet/scss" lang="scss" scoped>
//普通样式
.accountSetting{
  margin:40px 40px 0;
  // dialog样式
  .dialogContent{
    i{
      font-size:80px;
      color:#67C23A;
      display: block;
      margin:0 auto;
      text-align:center;
    }
    .text1{
      font-size:16px;
      color:rgba(71,71,71,1);
      text-align:center;
      margin-bottom:5px;
    }
    .text2{
      font-size:14px;
      color:#999999;
      text-align:center;
    }
  }

  .accountSetting-info{
      .Setting-info-Mobile{
        height:24px;
        line-height: 24px;
        margin-bottom:45px;
        p{
          float:left;
          height:24px;
          line-height: 24px;
        }
        p:nth-child(1){
          font-size:14px;
          font-family:MicrosoftYaHei;
          color:rgba(127,143,164,1);
          margin-right:51px;
        }
        p:nth-child(2){
          span{
            display:inline-block;
          }
          span:nth-child(1){
            width:214px;
            height:24px;
            font-size:14px;
            font-family:MicrosoftYaHei;
            color:rgba(80,104,140,1);
          }
          span:nth-child(2){
            height:24px;
            font-size:14px;
            font-family:MicrosoftYaHei;
            color:rgba(255,168,0,1);
            line-height:24px;
            cursor: pointer;
          }
        }
      }
      .Setting-info-MobileBind{
        .submitBtn{
          display:block;margin:40px auto 0;width: 140px;height: 40px;font-size:16px;color:#ffffff;background:#FFA800;
          border:none;
        }
        // width:600px;
        // height:400px;
        // background:rgba(255,255,255,1);
        // border-radius:8px;
      }
      .Setting-info-mail{
        height:24px;
        line-height: 24px;
        margin-bottom:45px;
        p{
          float:left;
          height:24px;
          line-height: 24px;
        }
        p:nth-child(1){
          font-size:14px;
          font-family:MicrosoftYaHei;
          color:rgba(127,143,164,1);
          margin-right:51px;
        }
        p:nth-child(2){
          span{
            display:inline-block;
          }
          span:nth-child(1){
            width:214px;
            height:24px;
            font-size:14px;
            font-family:MicrosoftYaHei;
            color:rgba(80,104,140,1);
          }
          span:nth-child(2){
            height:24px;
            font-size:14px;
            font-family:MicrosoftYaHei;
            color:rgba(255,168,0,1);
            line-height:24px;
            cursor: pointer;
          }
        }
      }
      .Setting-info-loginPassword{
        height:24px;
        line-height: 24px;
        margin-bottom:45px;
        p{
          float:left;
          height:24px;
          line-height: 24px;
        }
        p:nth-child(1){
          font-size:14px;
          font-family:MicrosoftYaHei;
          color:rgba(127,143,164,1);
          margin-right:51px;
        }
        p:nth-child(2){
          span{
            display:inline-block;
          }
          span:nth-child(1){
            width:214px;
            height:24px;
            font-size:14px;
            font-family:MicrosoftYaHei;
            line-height: 24px;
            color:rgba(80,104,140,1);
          }
          span:nth-child(2){
            height:24px;
            font-size:14px;
            font-family:MicrosoftYaHei;
            color:rgba(255,168,0,1);
            line-height:24px;
            cursor: pointer;
          }
        }
      }
      .Setting-info-payPassword{
        height:24px;
        line-height: 24px;
        p{
          float:left;
          height:24px;
          line-height: 24px;
        }
        p:nth-child(1){
          font-size:14px;
          font-family:MicrosoftYaHei;
          color:rgba(127,143,164,1);
          margin-right:51px;
        }
        p:nth-child(2){
          span{
            display:inline-block;
          }
          span:nth-child(1){
            width:214px;
            height:24px;
            font-size:14px;
            font-family:MicrosoftYaHei;
            line-height: 24px;
            color:rgba(80,104,140,1);
          }
          span:nth-child(2){
            height:24px;
            font-size:14px;
            font-family:MicrosoftYaHei;
            color:rgba(255,168,0,1);
            line-height:24px;
            cursor: pointer;
          }
        }
      }
  }
}

</style>

