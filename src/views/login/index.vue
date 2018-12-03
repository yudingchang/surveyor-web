<template>
  <div class="login-container">
    <!-- 头部 -->
    <div class='hometop'>
        <span class="logo">
         
        </span>
        <span>
          400-627-8168
        </span>
    </div>

    <!-- 登录界面主体 -->
    <el-form class='login-form-box' v-if="loginShow">
      <ul class="tabs">
        <li :class="{active:item.isBool}" v-for="(item,index) in denglustyle" :key = index @click="tab(item,index)">{{item.content}}</li>
      </ul>
      <!-- 电子邮箱登录 -->
      <el-form ref="loginForm" :model="loginForm"  class="login-form"  label-position="left" v-if="num==0">
        <el-form-item prop="username" class="email">
          <span>
            <img src="/static/image/email.png" alt="">
          </span>
          <el-input
            v-model="loginForm.email"
            placeholder="输入电子邮箱"
            name="username"
            type="text"
            class="email-content"     
          />            
        </el-form-item>
        <el-form-item prop="username" class="email">
          <span>
            <img src="/static/image/password.png" alt="">
          </span>
          <el-input
            v-model="loginForm.password"
            placeholder="输入登录密码"
            name="username"
            type="text"
            class="email-content"     
          />            
        </el-form-item>
        <p class="text1" @click="forgetPassword()">忘记密码?</p>
        <el-button type="primary" @click="loginByEmail()" :disabled="((loginForm.email == '') || (this.loginForm.password == ''))" :class="{disabled:((loginForm.email == '') || (this.loginForm.password == '')),isactive:((loginForm.email != '') && (this.loginForm.password != ''))}">登录</el-button>
        <p class="tip">还没加入测库? <a @click="toregister">立即注册</a></p>
      </el-form>
      <!-- 手机号登录 -->
      <el-form v-if="num==1" class="login-form" :model="phoneLoginForm">
        <el-form-item prop="username" class="phone-email clearfloat">
          <span class="phone-style">
            {{areaselect}}
          </span>
          <span class="arrow-next" @click="getpopover()"></span>
          <el-input
            v-model="phoneLoginForm.phone_number"
            placeholder="请输入电话号码"
            name="username"
            type="text"
            class="phone-email-content"     
          />   
          <div class="popover" v-show="popoverShow">
            <ul>
              <li v-for="(item,index) in area" :key=index @click="selected(item)">{{item}}</li>
            </ul>
            <div class="popper-arrow"></div>
          </div>         
        </el-form-item>
        <el-form-item prop="username" class="email">
          <span>
            <img src="/static/image/password.png" alt="">
          </span>
          <el-input
            v-model="phoneLoginForm.password"
            placeholder="输入登录密码"
            name="username"
            type="text"
            class="email-content"     
          />            
        </el-form-item>
        <p class="text1" @click="forgetPassword()">忘记密码?</p>
        <el-button type="primary"  @click="loginByPhone()" :disabled="(phoneLoginForm.phone_number=='') || (phoneLoginForm.password=='')" :class="{disabled:(phoneLoginForm.phone_number=='') || (phoneLoginForm.password==''),isactive:(phoneLoginForm.phone_number!='') && (phoneLoginForm.password!='')}">登录</el-button>
        <p class="tip">还没加入测库? <a  @click="toregister">立即注册</a></p>
      </el-form>
      <!-- 登录报错信息报文 -->
      <div class="errorPump" v-if="loginPumpShow">
        <div class="error-content">{{wrongMessage}}</div>
        <div class="errorPump-arrow">
        </div>
      </div>
    </el-form>

    <!-- 注册界面主体 -->
    <el-form class="login-form-box register-form-box" v-if="registerShow">
      <ul class="tabs">
        <li :class="{active:item.isBool}" v-for="(item,index) in registerstyle" :key = index @click="registerTab(item,index)">{{item.content}}</li>
      </ul>
      <!-- 电子邮箱注册 -->
      <el-form ref="registerForm" :model="registerForm"   class="login-form" label-position="left" v-if="registernum==0">
        <el-form-item prop="email" class="email">
          <span>
            <img src="/static/image/email.png" alt="">
          </span>
          <el-input
            v-model="registerForm.email"
            placeholder="输入电子邮箱"
            name="username"
            type="text"
            class="email-content"     
          />            
        </el-form-item>
        <el-form-item prop="password" class="email">
          <span>
            <img src="/static/image/password.png" alt="">
          </span>
          <el-input
            v-model="registerForm.password"
            placeholder="输入登录密码"
            name="username"
            type="password"
            class="email-content"   
            @focus="showPump()" 
            @blur="hidePump()"
          />    
          <div class="passwordPump" v-if="passwordPumpShow">
            1、8-20位字符<br>
            2、大写字母、小写字母、数字、特殊符号两种组合以上
            <div class="hover-pump-arrow"></div>
          </div>        
        </el-form-item>
        <el-form-item prop="confirmpassword" class="email">
          <span>
            <img src="/static/image/password.png" alt="">
          </span>
          <el-input
            v-model="registerForm.confirmpassword"
            placeholder="确认输入登录密码"
            name="username"
            type="password"
            class="email-content"     
          />            
        </el-form-item>
        <el-form-item prop="company_name" class="email">
          <span>
            <img src="/static/image/company.png" alt="">
          </span>
          <el-input
            v-model="registerForm.company_name"
            placeholder="请输入公司名称"
            name="username"
            type="text"
            class="email-content"     
          />            
        </el-form-item>
        
      </el-form>
      <!-- 手机号注册 -->
      <el-form v-if="registernum==1" class="login-form" :model="phoneRegisterForm">
        <el-form-item prop="username" class="phone-email clearfloat">
          <span class="phone-style">
            {{areaselect}}
          </span>
          <span class="arrow-next" @click="getpopover()"></span>
          <el-input
            v-model="phoneRegisterForm.phone_number"
            placeholder="请输入电话号码"
            name="username"
            type="text"
            class="phone-email-content"     
          />   
          <div class="popover" v-show="popoverShow">
            <ul>
              <li v-for="(item,index) in area" :key=index @click="selected(item)">{{item}}</li>
            </ul>
            <div class="popper-arrow"></div>
          </div>         
        </el-form-item>
        <el-form-item prop="username" class="email">
          <span>
            <img src="/static/image/password.png" alt="">
          </span>
          <el-input
            v-model="phoneRegisterForm.password"
            placeholder="输入登录密码"
            name="username"
            type="password"
            class="email-content"     
          />            
        </el-form-item>
        <el-form-item prop="username" class="email">
          <span>
            <img src="/static/image/password.png" alt="">
          </span>
          <el-input
            v-model="phoneRegisterForm.confirmpassword"
            placeholder="确认输入登录密码"
            name="username"
            type="password"
            class="email-content"     
          />            
        </el-form-item>
        <el-form-item prop="username" class="email">
          <span>
            <img src="/static/image/company.png" alt="">
          </span>
          <el-input
            v-model="phoneRegisterForm.company_name"
            placeholder="请输入公司名称"
            name="username"
            type="text"
            class="email-content"     
          />            
        </el-form-item>
        <!-- <el-button type="primary"  class="isactive margin40">注册</el-button>
        <el-button type="primary"  class="btnreturn margin16">返回登录</el-button>
        <p class="tip"><el-checkbox v-model="checked"></el-checkbox><span class="agreement">我已阅读并同意<a href="">《用户协议》</a></span></p> -->
      </el-form>
      <el-button type="primary"  class="isactive" @click="goRegister()">注册</el-button>
      <el-button type="primary"  class="btnreturn margin16" @click="goLogin">返回登录</el-button>
      <p class="tip"><el-checkbox v-model="checked"></el-checkbox><span class="agreement">我已阅读并同意<a href="">《用户协议》</a></span></p>
       <!-- 注册报错信息报文 -->
      <div class="errorPump" v-if="registerwrongPump">
        <div class="error-content">{{registerWrongMessage}}</div>
        <div class="errorPump-arrow">
        </div>
      </div>
    </el-form>

    <!-- 验证电子邮箱 -->
    <el-form class="verify-email" v-if="verifyEmail">
      <span class="email-img"></span>
      <p class="t1">验证您的电子邮箱地址以创建测库帐号</p>
      <p class="t1">一封包含验证码的电子邮件已发至{{registerForm.email}}
      <br>请在此处输入验证码：</p>
      <el-form-item class="input-box">
        <!-- <ul class="write-input"> -->
          <!-- getbackMoney -->
          <!-- <li v-for="disInput in disInputs" :key="disInput.value"><input class="disInput" type="tel" maxlength="1" v-model="disInput.value" ></li>
        </ul> -->
        <div id="inputList" class="write-input"> 
          <input type="tel" v-model="pwdList[i]" maxlength="1" @input="changeInput"
      @click="changePwd"
      @keyup="keyUp($event)"
      @keydown="oldPwdList = pwdList.length" class="disInput" v-for="(v, i) in 6" :key="i">
        </div>
        
        <!-- <input type="text" maxlength="1">
        <input type="text" maxlength="1">
        <input type="text" maxlength="1">
        <input type="text" maxlength="1">
        <input type="text" maxlength="1">  -->
      </el-form-item>
      <div class="t2">没有收到电子邮件?
        <div class="hover-pump">检查您的垃圾邮件文件夹或等待几分钟。<br>
        如果仍然存在问题，可以请求新的验证代码
          <div class="hover-pump-arrow"></div>
        </div>
      </div>    
      <div class="button-group">
        <div @click="resend()" :class={sendma:true,recolor:sendMaDisabled}>{{secondStepText}}</div>
        <div @click="backregister()">取消</div>
        <div @click="userRegister()">继续</div>
      </div>
    </el-form>

    <!-- 密码找回 -->
    <el-form class="password-recovery" v-if="passwordRecoveryShow">
      <el-steps :active="active" finish-status="finish" align-center>
        <el-step title="选择找回方式"></el-step>
        <el-step title="验证码校验"></el-step>
        <el-step title="设置新的登录密码"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <div class="first-step" v-if="firstStepShow">
        <div class="recovery-style">
          <div @click="recoveryByEmail()">
            <i class="iconfont icon-mimazhaohuiyouxiang-"></i>
            <span>电子邮箱</span>
          </div>
          <div @click="recoveryByPhone()">
            <i class="iconfont icon-Fill"></i>
            <span>手机号码</span>
          </div>
        </div>
        <div class="btn-recovery-return margin70" @click="goLogin()">返回登录</div>
      </div>
      <div class="second-step" v-if="secondStepShow" >
        <el-form class="login-form ma-content" v-if="secondStepEmailShow" :model="secondStepForm">
          <el-form-item prop="username" class="email">
            <span>
              <img src="/static/image/email.png" alt="">
            </span>
            <el-input
              v-model="secondStepForm.email"
              :placeholder="mamessage"
              name="username"
              type="text"
              class="email-content"     
            />            
          </el-form-item>
          <el-form-item prop="username" class="email">
            <span>
              <img src="/static/image/ma.png" alt="">
            </span>
            <el-input
              v-model="secondStepForm.verification_code"
              placeholder="输入验证码"
              name="username"
              type="text"
              class="ma-input email-content"     
            />  
            <div :class="{sendma:true,changeColor:sendMaDisabled}" @click="secondStepSendMa()" :disabled="sendMaDisabled" >
              {{secondStepText}}
            </div>       
          </el-form-item> 
          <el-button @click="goThirdStep()" :disabled="secondStepForm.email==''|| secondStepForm.verification_code==''" class="btn-next">下一步</el-button>
          <el-button @click="backFirstStep()" class="btn-return-sm">返回</el-button>
        </el-form> 
        
        <el-form class="login-form ma-content" v-if="secondStepPhoneShow" :model="secondStepFormPhone">
          <el-form-item prop="username" class="email clearfloat secondStepPhone">
             <span class="phone-style">
            {{areaselect}}
          </span>
          <span class="arrow-next" @click="getpopover()"></span>
          <el-input
            v-model="secondStepFormPhone.phone_number"
            placeholder="请输入电话号码"
            name="username"
            type="text"
            class="phone-email-content"     
          />   
          <div class="popover" v-show="popoverShow">
            <ul>
              <li v-for="(item,index) in area" :key=index @click="selected(item)">{{item}}</li>
            </ul>
            <div class="popper-arrow"></div>
          </div>            
          </el-form-item>
          <el-form-item prop="username" class="email">
            <span>
              <img src="/static/image/ma.png" alt="">
            </span>
            <el-input
              v-model="secondStepFormPhone.verification_code"
              placeholder="输入验证码"
              name="username"
              type="text"
              class="ma-input email-content"     
            />  
            <div :class={sendma:true,changeColor:sendMaDisabled}  @click="secondStepSendMa()">
              {{secondStepText}}
            </div>          
          </el-form-item> 
          <el-button @click="goThirdStep()" :disabled="secondStepFormPhone.phone_number==''|| secondStepFormPhone.verification_code==''" class="btn-next">下一步</el-button>
          <el-button @click="backFirstStep()" class="btn-return-sm">返回</el-button>
        </el-form> 

         
      </div>
      <div class="second-step third-step" v-if="thirdStepShow">
         <el-form class="login-form ma-content" :model="thirdStepForm">
          <el-form-item prop="username" class="email">
            <span>
              <img src="/static/image/password.png" alt="">
            </span>
            <el-input
              v-model="thirdStepForm.password"
              placeholder="输入登录密码"
              name="username"
              type="password"
              class="email-content"     
            />            
          </el-form-item>
          <el-form-item prop="username" class="email">
            <span>
              <img src="/static/image/password.png" alt="">
            </span>
            <el-input
              v-model="thirdStepForm.confirmpassword"
              placeholder="确认输入登录密码"
              name="username"
              type="password"
              class="email-content"     
            />            
          </el-form-item>
          <el-button @click="goFourStep()" :disabled="thirdStepForm.password=='' || thirdStepForm.confirmpassword==''" class="btn-next">下一步</el-button>
          <el-button @click="backSecondStep()" class="btn-return-sm">返回</el-button>
          

        </el-form> 
      </div>
      <div class="four-step"  v-if="fourStepShow">
         <el-form class="login-form ma-content">
          <span class="success"></span>
          <p class="t1">您的登录密码重置成功</p>
          <el-button @click="goLogin()" class="btn-next">立即登录</el-button>
        </el-form> 
      </div>
      
      <!-- <el-button style="margin-top: 12px;" @click="next">下一步</el-button> -->
    </el-form>

    <!-- 注册成功页面 -->
    <div class="registerResult"  v-if="registerResultShow">
      <el-form class="ma-content">
        <span class="success"></span>
        <p class="t1">恭喜您注册成功</p>
        <el-button class="btn-next" @click="goLogin()">进入测库</el-button>
      </el-form> 
    </div>
  </div>
</template>

<script>
import {
  sendma,
  userRegister,
  userLogin,
  forgetSendMa,
  resetPassword
} from "@/api/login";
import LangSelect from "@/components/LangSelect";
import SocialSign from "./socialsignin";

export default {
  name: "Login",
  components: { LangSelect, SocialSign },
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!isvalidUsername(value)) {
        // callback(new Error('Please enter the correct user name'))
      } else {
        callback();
      }
    };
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error("The password can not be less than 6 digits"));
      } else {
        callback();
      }
    };
    return {
      thirdStepForm: {
        password: "",
        confirmpassword: "",
        type: "email"
      },
      secondStepForm: {
        email: "",
        password: "",
        phone_number: "",
        type:"",
        verification_code: ""
      },
      secondStepFormPhone:{
        password: "",
        phone_number: "",
        type: "phone_number",
        verification_code: ""
      },
      loginForm: {
        email: "",
        password: "",
        type: "email"
      },
      phoneLoginForm:{
        phone_number: "",
        type: "phone_number",
        password: "",
      },
      // 邮箱注册发送验证码参数
      sendMail: {
        to: "",
        type: "email"
      },
      // 邮箱注册参数
      registerForm: {
        type: "email",
        email: "",
        password: "",
        confirmpassword: "",
        company_name: "",
        verification_code: ""
      },
      // 手机号注册参数
      phoneRegisterForm: {
        type: "phone_number",
        phone_number: "",
        password: "",
        confirmpassword: "",
        company_name: "",
        verification_code: ""
      },
      // 用户登录参数
      userLogin: {
        type: "",
        email: "",
        phone_number: "",
        password: ""
      },
      pwdList: [],
      oldPwdList: [],
      isDelete: false,
      ipt: [],
      // 发送电子邮箱页面
      verifyEmail: false,
      passwordPumpShow: false,
      loginPumpShow: false,
      loginShow: true,
      registerShow: false,
      registerwrongPump: false,
      registerResultShow: false,
      passwordRecoveryShow: false,
      firstStepShow: true,
      secondStepShow: false,
      secondStepText: "发送验证码",
      thirdStepShow: false,
      fourStepShow: false,
      secondStepPhoneShow: false,
      secondStepEmailShow:false,
      sendMaDisabled:false,
      timer: null,
      active: 1,
      checked: true,
      num: 0,
      registernum: 0,
      registerWrongMessage: "",
      wrongMessage: "",
      mamessage: "输入电子邮箱",
      popoverShow: false,
      areaselect: "中国大陆 +86",
      disabled: true,
      isactive: false,
      denglustyle: [
        {
          content: "电子邮箱登录",
          isBool: true
        },
        {
          content: "手机号码登录",
          isBool: false
        }
      ],
      registerstyle: [
        {
          content: "电子邮箱注册",
          isBool: true
        },
        {
          content: "手机号码注册",
          isBool: false
        }
      ],
      area: ["中国大陆 +86", "中国大陆 +86", "中国大陆 +86", "中国大陆22"],
      // passwordType: "password",
      loading: false,
      showDialog: false,
      redirect: undefined
    };
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    },
    "registerForm.password": function() {
      let passwordReg = /^(?![A-Z]+$)(?![a-z]+$)(?!\d+$)(?![\W_]+$)\S{8,20}$/;
      if (passwordReg.test(this.registerForm.password)) {
        this.passwordPumpShow = false;
      } else {
        this.passwordPumpShow = true;
      }
    }
  },
  created() {
    // window.addEventListener('hashchange', this.afterQRScan)
  },
  destroyed() {
    // window.removeEventListener('hashchange', this.afterQRScan)
  },
  methods: {
    goFourStep() {
      if(this.secondStepEmailShow){
         resetPassword({
        type: "email",
        verification_code: this.secondStepForm.verification_code,
        email: this.secondStepForm.email,
        password: this.thirdStepForm.password
      }).then(response => {
        if (response.data.code == 0) {
          this.fourStepShow = true;
          this.thirdStepShow = false;
          this.active++;
        } else {
          //  this.registerWrongMessage =
        }
      });
      }else{
         resetPassword({
        type: "phone_number",
        verification_code: this.secondStepFormPhone.verification_code,
        phone_number: this.secondStepFormPhone.phone_number,
        password: this.thirdStepForm.password
      }).then(response => {
        if (response.data.code == 0) {
          this.fourStepShow = true;
          this.thirdStepShow = false;
          this.active++;
        } else {
          //  this.registerWrongMessage =
        }
      });

      }
     

      // this.active--
    },
    // 回退第二步
    backSecondStep() {
      this.thirdStepShow = false;
      this.secondStepShow = true;
      this.active--;
    },
    backFirstStep() {
      this.secondStepShow = false;
      this.firstStepShow = true;
      this.active--;
    },
    // 重置密码第三步
    goThirdStep() {
      this.secondStepShow = false;
      this.thirdStepShow = true;
      this.active++;
    },
    forgetSendMa() {
      if(this.secondStepEmailShow){
          forgetSendMa({
          type: "email",
          to: this.secondStepForm.email
        }).then(response => {
          if (response.data.code == 0) {
          } else {
            //  this.registerWrongMessage =
          }
        })
      }else{
        forgetSendMa({
          type: "phone_number",
          to: this.secondStepFormPhone.phone_number
        }).then(response => {
          if (response.data.code == 0) {
          } else {
            //  this.registerWrongMessage =
          }
        })
      }
      
    },
    // 第二步发送验证码
    secondStepSendMa() {
      this.forgetSendMa();
      const TIME_COUNT = 60;
      this.sendMaDisabled = true
      this.secondStepText = TIME_COUNT;
      this.timer = setInterval(() => {
        if (this.secondStepText > 0 && this.secondStepText <= TIME_COUNT) {
          this.secondStepText--;
        } else {
          this.sendMaDisabled = false
          this.secondStepText = "发送验证码";
          clearInterval(this.timer);
          this.timer = null;
        }
      }, 1000);
    },
    // 通过邮箱找回密码
    recoveryByEmail() {
      this.firstStepShow = false;
      this.secondStepShow = true;
      this.secondStepPhoneShow = false
      this.secondStepEmailShow = true
      if (this.active++ > 2) this.active = 0;
    },
    // 通过手机号找回密码
    recoveryByPhone() {
      this.firstStepShow = false;
      this.secondStepShow = true;
      this.secondStepPhoneShow = true
      this.secondStepEmailShow = false
      if (this.active++ > 2) this.active = 0;
    },
    // 进入找回密码页面
    forgetPassword() {
      this.fourStepShow = false
      this.loginShow = false;
      this.passwordRecoveryShow = true;
    },
    // 邮箱登录
    loginByEmail() {
      let emailReg = /^[0-9A-Za-z][\.-_0-9A-Za-z]*@[0-9A-Za-z]+(\.[0-9A-Za-z]+)+$/;
      if (emailReg.test(this.loginForm.email)) {
        this.$store
          .dispatch("LoginByUsername", this.loginForm)
          .then(() => {
            this.$router.push({ path: this.redirect || "/" });
          })
          .catch(() => {
          });
      }
    },
    // 手机号登录
    loginByPhone(){
      // let emailReg = /^[0-9A-Za-z][\.-_0-9A-Za-z]*@[0-9A-Za-z]+(\.[0-9A-Za-z]+)+$/;
      // if (emailReg.test(this.loginForm.email)) {
        this.$store
          .dispatch("LoginByUsername", this.phoneLoginForm)
          .then(() => {
            this.$router.push({ path: this.redirect || "/" });
          })
          .catch(() => {
          });
      // }
    },
    // 去注册
    goRegister() {
      if (this.registernum == 0) {
        this.emailsendma();
      } else {
        this.phonesendma();
      }
    },
    // 重发验证码
    resend(){
      if (this.registernum == 0) {
        this.emailsendma();
      } else {
        this.phonesendma();
      }
      const TIME_COUNT = 60;
      this.sendMaDisabled = true
      this.secondStepText = TIME_COUNT;
      this.timer = setInterval(() => {
        if (this.secondStepText > 0 && this.secondStepText <= TIME_COUNT) {
          this.secondStepText--;
        } else {
          this.sendMaDisabled = false
          this.secondStepText = "发送验证码";
          clearInterval(this.timer);
          this.timer = null;
        }
      }, 1000);
    },
    // 验证电子邮箱，密码，确认密码，公司名称是否合理
    checkValidate() {
      let emailReg = /^[0-9A-Za-z][\.-_0-9A-Za-z]*@[0-9A-Za-z]+(\.[0-9A-Za-z]+)+$/;
      let passwordReg = /^(?![A-Z]+$)(?![a-z]+$)(?!\d+$)(?![\W_]+$)\S{8,20}$/;
      if (this.registerForm.email == "") {
        this.registerWrongMessage = "电子邮箱不能为空";
        this.registerwrongPump = true;
        return false;
      } else if (!emailReg.test(this.registerForm.email)) {
        this.registerWrongMessage = "电子邮箱格式错误";
        this.registerwrongPump = true;
        return false;
      } else if (this.registerForm.password == "") {
        this.registerWrongMessage = "密码不能为空";
        this.registerwrongPump = true;
        return false;
      } else if (!passwordReg.test(this.registerForm.password)) {
        this.registerWrongMessage = "密码格式错误";
        this.registerwrongPump = true;
        return false;
      } else if (this.registerForm.confirmpassword == "") {
        this.registerWrongMessage = "确认密码不能为空";
        this.registerwrongPump = true;
        return false;
      } else if (
        !(this.registerForm.confirmpassword == this.registerForm.password)
      ) {
        this.registerWrongMessage = "密码不一致";
        this.registerwrongPump = true;
        return false;
      } else if (this.registerForm.company_name == "") {
        this.registerWrongMessage = "公司名称不能为空";
        this.registerwrongPump = true;
        return false;
      }
      this.registerwrongPump = false;
      return true;
    },
    checkPhoneValidate() {
      let passwordReg = /^(?![A-Z]+$)(?![a-z]+$)(?!\d+$)(?![\W_]+$)\S{8,20}$/;
      if (this.phoneRegisterForm.phone_number == "") {
        this.registerWrongMessage = "手机号码不能为空";
        this.registerwrongPump = true;
        return false;
      } else if (this.phoneRegisterForm.password == "") {
        this.registerWrongMessage = "密码不能为空";
        this.registerwrongPump = true;
        return false;
      } else if (!passwordReg.test(this.phoneRegisterForm.password)) {
        this.registerWrongMessage = "密码格式错误";
        this.registerwrongPump = true;
        return false;
      } else if (this.phoneRegisterForm.confirmpassword == "") {
        this.registerWrongMessage = "确认密码不能为空";
        this.registerwrongPump = true;
        return false;
      } else if (
        !(
          this.phoneRegisterForm.confirmpassword ==
          this.phoneRegisterForm.password
        )
      ) {
        this.registerWrongMessage = "密码不一致";
        this.registerwrongPump = true;
        return false;
      } else if (this.phoneRegisterForm.company_name == "") {
        this.registerWrongMessage = "公司名称不能为空";
        this.registerwrongPump = true;
        return false;
      }
      this.registerwrongPump = false;
      return true;
    },
    // 聚焦的时候验证密码
    showPump() {
      this.passwordPumpShow = true;
    },
    hidePump() {
      this.passwordPumpShow = false;
    },
    // checkPassword(){
    //   console.log("lllllllll")
    //   let passwordReg = /^(?![A-Z]+$)(?![a-z]+$)(?!\d+$)(?![\W_]+$)\S{8,20}$/
    //   if(passwordReg.test(this.registerForm.password)){
    //     this.passwordPumpShow = false
    //   }
    // },
    // 电子邮件发送验证码
    emailsendma() {
      if (this.checkValidate()) {
        sendma({
          ...this.sendMail,
          to: this.registerForm.email
        }).then(response => {
          console.log(response);
          if (response.data.code == 0) {
            this.verifyEmail = true;
            this.$nextTick(() => {
              this.ipt = document.querySelectorAll("#inputList .disInput");
            });
          } else {
          }
        });
      }
    },
    // 手机号发送验证码
    phonesendma() {
      if (this.checkPhoneValidate()) {
        sendma({
          type: "phone_number",
          to: this.phoneRegisterForm.phone_number
        }).then(response => {
          console.log(response);
          if (response.data.code == 0) {
            this.verifyEmail = true;
            this.$nextTick(() => {
              this.ipt = document.querySelectorAll("#inputList .disInput");
            });
          } else {
          }
        });
      }
    },
    // 返回注册页
    backregister() {
      this.verifyEmail = false;
    },
    // 返回登录页
    goLogin() {
      this.registerShow = false;
      this.registerResultShow = false;
      this.passwordRecoveryShow = false;
      this.fourStepShow = false;
      this.loginShow = true;
    },
    // 去注册页
    toregister() {
      this.loginShow = false;
      this.registerShow = true;
    },
    // 电子邮箱注册
    userRegister() {
      if (this.registernum == 0) {
        userRegister({
          ...this.registerForm,
          verification_code: this.pwdList.join("")
        }).then(response => {
          if (response.data.code == 0) {
            this.registerResultShow = true;
            this.verifyEmail = false;
            this.registerShow = false;
          }
        });
      } else {
        userRegister({
          ...this.phoneRegisterForm,
          verification_code: this.pwdList.join("")
        }).then(response => {
          if (response.data.code == 0) {
            this.registerResultShow = true;
            this.verifyEmail = false;
            this.registerShow = false;
          }
        });
      }
    },
    getpopover() {
      this.popoverShow = true;
    },
    next() {
      if (this.active++ > 3) this.active = 1;
    },
    selected(item) {
      this.areaselect = item;
      this.popoverShow = false;
    },
    tab(item, index) {
      this.denglustyle.forEach((item, index) => {
        item.isBool = false;
      });
      this.num = index;

      item.isBool = true;
    },
    registerTab(item, index) {
      this.registerstyle.forEach((item, index) => {
        item.isBool = false;
      });
      this.registernum = index;
      item.isBool = true;
    },
    // showPwd() {
    //   if (this.passwordType === "password") {
    //     this.passwordType = "";
    //   } else {
    //     this.passwordType = "password";
    //   }
    // },
    // handleLogin() {
    //   this.$refs.loginForm.validate(valid => {
    //     if (valid) {
    //       this.loading = true;
    //       this.$store
    //         .dispatch("LoginByUsername", this.loginForm)
    //         .then(() => {
    //           this.loading = false;
    //           this.$router.push({ path: this.redirect || "/" });
    //         })
    //         .catch(() => {
    //           this.loading = false;
    //         });
    //     } else {
    //       console.log("error submit!!");
    //       return false;
    //     }
    //   });
    // },
    afterQRScan() {
      // const hash = window.location.hash.slice(1)
      // const hashObj = getQueryObject(hash)
      // const originUrl = window.location.origin
      // history.replaceState({}, '', originUrl)
      // const codeMap = {
      //   wechat: 'code',
      //   tencent: 'code'
      // }
      // const codeName = hashObj[codeMap[this.auth_type]]
      // if (!codeName) {
      //   alert('第三方登录失败')
      // } else {
      //   this.$store.dispatch('LoginByThirdparty', codeName).then(() => {
      //     this.$router.push({ path: '/' })
      //   })
      // }
    },
    keyUp(ev) {
      let index = this.pwdList.length;
      if (!index) return;
      if (ev.keyCode === 8) {
        this.isDelete = true;
        if (this.oldPwdList === this.pwdList.length) {
          if (index === this.pwdList.length) {
            this.pwdList.pop();
          }
          index--;
        } else {
          index > 0 && index--;
        }
        this.ipt[index].focus();
      } else if (
        this.isDelete &&
        index === this.pwdList.length &&
        /^\d$/.test(ev.key)
      ) {
        this.isDelete = false;
        this.pwdList.pop();
        this.pwdList.push(ev.key);
        this.ipt[this.pwdList.length] && this.ipt[this.pwdList.length].focus();
      }
      // this.$emit('getPwd', this.pwdList.join(''))
    },
    changePwd() {
      console.log(1111);
      let index = this.pwdList.length;
      index === 6 && index--;
      console.log(this.ipt);
      this.ipt[index].focus();
    },
    changeInput() {
      console.log(2222);
      let index = this.pwdList.length;
      let val = this.pwdList[index - 1];
      if (!/[0-9]/.test(val)) {
        this.pwdList.pop();
        return;
      }
      if (!val) {
        this.pwdList.pop();
        index--;
        console.log(index);
        if (index > 0) this.ipt[index - 1].focus();
      } else {
        console.log(index);
        if (index < 6) this.ipt[index].focus();
      }
    }
  },
  mounted() {
    this.ipt = document.querySelectorAll("#inputList .disInput");
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #eee;
$cursor: #fff;
$body_padding: 13px;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  // .login-container .el-input input {
  //   // color: $cursor;
  //   // &::first-line {
  //   //   color: $light_gray;
  //   // }
  // }
}
.el-checkbox__inner {
  border: 1px solid #c0c4cc;
  background: transparent;
}
// 步骤样式格式化
.el-step__title.is-process {
  color: #ffffff;
  font-weight: normal;
}
.el-step__head.is-process {
  color: #ffffff;
  border-color: #ffffff;
}
.el-step__icon {
  width: 26px;
  height: 26px;
  background-color: transparent;
}
.el-step.is-center .el-step__line {
  left: calc(50% + #{$body_padding});
  right: calc(-50% + #{$body_padding});
  background-color: #ffffff;
  top: 12px;
  height: 1px;
}
.el-step__icon.is-text {
  border: 1px solid;
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
  color: #ffffff;
  border-color: #ffffff;
}
.el-step__title.is-wait {
  color: #fff;
}
.el-checkbox__input.is-focus .el-checkbox__inner {
  border-color: #c0c4cc;
}
.el-checkbox__input.is-checked .el-checkbox__inner,
.el-checkbox__input.is-indeterminate .el-checkbox__inner {
  background-color: #ffa800;
  border-color: #ffa800;
}
// .el-tabs__nav-wrap::after{
//   background-color:transparent
// }
// .el-tabs__active-bar{
//   background-color: #FFA800;
// }

/* reset element-ui css */
.login-container {
  // .el-input {
  //   display: inline-block;
  //   height: 47px;
  //   width: 85%;
  //   input {
  //     background: transparent;
  //     border: 0px;
  //     -webkit-appearance: none;
  //     border-radius: 0px;
  //     padding: 12px 5px 12px 15px;
  //     color: $light_gray;
  //     height: 47px;
  //     caret-color: $cursor;
  //     &:-webkit-autofill {
  //       -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
  //       -webkit-text-fill-color: $cursor !important;
  //     }
  //   }
  // }
  .el-input__inner {
    background-color: transparent;
    color: #ffffff;
    border: none;
    height: 28px !important;
    line-height: 28px !important;
  }
  .el-form-item--medium .el-form-item__content,
  .el-form-item--medium .el-form-item__label {
    line-height: 28px;
  }
  .el-form-item {
    border-bottom: 1px solid #c0c4cc;
    // border: 1px solid rgba(255, 255, 255, 0.1);
    // background: rgba(0, 0, 0, 0.1);
    // border-radius: 5px;
    // color: #454545;
  }
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;
.clearfloat:after {
  display: block;
  clear: both;
  content: "";
  visibility: hidden;
  height: 0;
}
.changeColor{
  color:#DADADA !important;
  cursor:auto !important;
}
.recolor{
  border: 1px solid #C0C4CC !important;
  color: #909399 !important;
}
.disabled {
  width: 100%;
  height: 40px;
  text-align: center;
  font-size: 16px;
  color: #ffffff;
  background: #b9b9b9;
  border: none;
}
.disabled:hover {
  background: #b9b9b9;
}
.isactive {
  display: block;
  margin: 0 auto;
  width: 400px;
  height: 40px;
  text-align: center;
  font-size: 16px;
  color: #ffffff;
  background: #ffa800;
  border: none;
}
.isactive:hover {
  background: #ffc500;
}
.btnreturn {
  display: block;
  width: 400px;
  margin: 0 auto;
  height: 40px;
  text-align: center;
  font-size: 16px;
  background: transparent;
  color: #979797;
  border: 2px solid #979797;
  border-radius: 4px;
  color: #ffffff;
}
.margin40 {
  margin-top: 40px;
}
.margin16 {
  margin-top: 16px;
}
.tip {
  text-align: center;
  font-size: 14px;
  color: #ffffff;
  margin-bottom: 30px;
  .agreement {
    margin-left: 8px;
  }
  a {
    color: #ffa800;
    text-decoration: underline;
  }
}
.login-container {
  position: fixed;
  height: 100%;
  width: 100%;
  background: url("/static/image/homebackground.png") no-repeat 100% 100%;
  // 注册成功弹窗
  .registerResult {
    position: absolute;
    width: 550px;
    height: 400px;
    padding: 80px 0;
    background: rgba(255, 255, 255, 0.2);
    left: 50%;
    top: 50%;
    margin-left: -275px;
    margin-top: -200px;
    .success {
      background: url("/static/image/success.png") no-repeat;
      display: block;
      width: 108px;
      height: 108px;
      margin: 0 auto;
    }
    .t1 {
      text-align: center;
      font-size: 16px;
      color: #ffffff;
      letter-spacing: 0.71px;
      margin-top: 20px;
    }
    .btn-next {
      display: block;
      width: 400px;
      height: 40px;
      background: #ffa800;
      border-radius: 6px;
      color: #ffffff;
      text-align: center;
      font-size: 16px;
      border: none;
      margin: 50px auto 0;
    }
  }
  // 找回密码
  .password-recovery {
    position: absolute;
    width: 800px;
    height: 600px;
    padding: 120px 90px 80px 90px;
    background: rgba(255, 255, 255, 0.2);
    left: 50%;
    top: 50%;
    margin-left: -350px;
    margin-top: -300px;
    .first-step {
      margin-top: 70px;
      .recovery-style {
        overflow: hidden;
        > div {
          border: 2px solid #dadada;
          border-radius: 4px;
          width: 300px;
          height: 200px;
          text-align: center;
          line-height: 200px;
          font-size: 20px;
          color: #dadada;
        }
        > div:hover {
          cursor: pointer;
          color: #ffa800;
          background: rgba(255, 168, 0, 0.1);
          border: 2px solid #ffa800;
        }
        > div:first-child {
          float: left;
          .iconfont {
            font-size: 40px;
            vertical-align: middle;
            margin-right: 20px;
          }
        }
        > div:nth-child(2) {
          float: right;
          .iconfont {
            font-size: 40px;
            vertical-align: middle;
            margin-right: 20px;
          }
        }
      }
      .btn-recovery-return {
        margin: 0 auto;
        width: 400px;
        height: 40px;
        line-height: 40px;
        text-align: center;
        font-size: 16px;
        color: #dadada;
        letter-spacing: 0.77px;
        border: 1px solid #dadada;
        border-radius: 4px;
        cursor: pointer;
      }
      .margin70 {
        margin-top: 70px;
      }
    }
    .second-step {
      width: 400px;
      margin: 70px auto 0;
      .ma-content {
        padding: 0;
        .secondStepPhone {
          .phone-style {
            float: left;
            font-size: 16px;
            color: #ffffff;
            font-weight: normal;
            bottom: 0;
          }
          .arrow-next {
            float: left;
            background: url(/static/image/arrow-next.png) no-repeat;
            background-size: 33%;
            background-position: 50% 50%;
            display: inline-block;
            width: 42px;
            height: 24px;
            margin: 3px 8px 0 0;
            bottom:0;
          }
          .phone-email-content{
            float: left;
            width: 200px;
            color: #ffffff;
            border-left: 1px solid #ffffff;
            height: 28px;
            padding-left: 10px;
            font-size: 16px;
          }
        }
        .ma-input {
          width: 200px;
          border-right: 1px solid #ffffff;
        }
        .sendma {
          float: right;
          padding: 0 16px;
          font-size: 16px;
          color: #ffa800;
          cursor: pointer;
        }
      }
      .btn-next {
        width: 400px;
        height: 40px;
        background: #ffa800;
        border-radius: 6px;
        color: #ffffff;
        text-align: center;
        font-size: 16px;
        border: none;
        margin-top: 40px;
      }
      .btn-return-sm {
        width: 400px;
        height: 40px;
        background: transparent;
        border-radius: 6px;
        color: #ffffff;
        text-align: center;
        font-size: 16px;
        border: 2px solid #979797;
        border-radius: 4px;
        margin: 16px 0 0;
      }
    }
    .four-step {
      margin-top: 80px;
      .success {
        background: url("/static/image/success.png") no-repeat;
        display: block;
        width: 108px;
        height: 108px;
        margin: 0 auto;
      }
      .t1 {
        text-align: center;
        font-size: 16px;
        color: #ffffff;
        letter-spacing: 0.71px;
      }
      .btn-next {
        display: block;
        width: 400px;
        height: 40px;
        background: #ffa800;
        border-radius: 6px;
        color: #ffffff;
        text-align: center;
        font-size: 16px;
        border: none;
        margin: 50px auto 0;
      }
    }
  }
  .verify-email {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 800px;
    margin-left: -400px;
    margin-top: -300px;
    background: #ffffff;
    height: 600px;
    z-index: 2;
    .email-img {
      background: url("/static/image/bigemail.png") no-repeat 100% 100%;
      width: 122px;
      height: 80px;
      display: block;
      margin: 94px auto 0;
    }
    .input-box {
      border: none;
      overflow: hidden;
      width: 470px;
      margin: 0 auto;
      .write-input {
        overflow: hidden;
        list-style: none;
        // li{
        //   float: left;
        //    margin-right: 20px;
        input {
          width: 60px;
          height: 60px;
          padding: 0;
          text-align: center;
          line-height: 60px;
          font-size: 30px;
          color: #ffa800;
          border: 1px solid #909399;
          border-radius: 2px;
          margin-right: 20px;
          outline: none;
        }
        input:last-child {
          margin-right: 0;
        }
      }
    }
    .t1 {
      font-size: 22px;
      color: #1d2531;
      letter-spacing: 3px;
      text-align: center;
    }
    .t2 {
      position: relative;
      font-size: 20px;
      color: #ffa800;
      letter-spacing: 3.82px;
      text-align: center;
      margin-top: 18px;
      cursor: pointer;
      // line-height: 38px;
    }
    .t2:hover .hover-pump {
      display: block;
    }
    .hover-pump {
      display: none;
      position: absolute;
      top: -80px;
      left: 50%;
      padding: 16px 0;
      margin-left: -250px;
      width: 500px;
      // height: 90px;
      background: rgba(96, 98, 102, 0.9);
      font-size: 16px;
      color: #ffffff;
      text-align: center;
      .hover-pump-arrow {
        position: absolute;
        content: " ";
        width: 0;
        height: 0;
        border: 10px solid rgba(96, 98, 102, 0.9);
        border-top-color: rgba(96, 98, 102, 0.9);
        border-left-color: transparent;
        border-right-color: transparent;
        border-bottom-color: transparent;
        bottom: -20px;
        left: 50%;
        margin-left: -10px;
      }
    }
    .button-group {
      overflow: hidden;
      width: 560px;
      margin: 50px auto 0;
      > div {
        float: left;
        cursor: pointer;
      }
      > div:nth-child(1) {
        border: 1px solid #ffa800;
        border-radius: 4px;
        width: 180px;
        height: 50px;
        line-height: 50px;
        text-align: center;
        font-size: 18px;
        color: #ffa800;
        letter-spacing: 3.44px;
      }
      > div:nth-child(2) {
        float: left;
        margin-left: 164px;
        border: 1px solid #c0c4cc;
        border-radius: 4px;
        width: 98px;
        height: 50px;
        line-height: 50px;
        text-align: center;
        font-size: 18px;
        color: #c0c4cc;
        letter-spacing: 3.44px;
      }
      > div:nth-child(3) {
        float: right;
        border: 1px solid #c0c4cc;
        background: #c0c4cc;
        border-radius: 4px;
        width: 98px;
        height: 50px;
        line-height: 50px;
        text-align: center;
        font-size: 18px;
        color: #ffffff;
        letter-spacing: 3.44px;
        text-align: center;
      }
    }
  }
  .hometop {
    width: 80%;
    margin: 40px auto 0 auto;
    overflow: hidden;
    span:nth-child(1) {
      background: url("/static/image/logo.png") no-repeat;
      float: left;
      width: 130px;
      height: 20px;
      display: block;
    }
    span:nth-child(2) {
      float: right;
      font-size: 14px;
      color: #c0c4cc;
      vertical-align: middle;
    }
  }
  .login-form-box {
    position: relative;
    .errorPump {
      position: absolute;
      right: -370px;
      bottom: 20px;
      background: rgba(214, 214, 214, 0.2);
      // opacity: 0.2;
      width: 350px;
      height: 226px;
      font-size: 20px;
      padding: 20px;
      color: #ffffff;
      .error-content {
        font-size: 16px;
        color: #ffffff;
        z-index: 11;
      }
      .errorPump-arrow:after {
        position: absolute;
        content: " ";
        width: 0;
        height: 0;
        border: 10px solid #ffffff;
        border-top-color: transparent;
        border-left-color: transparent;
        border-right-color: rgba(214, 214, 214, 0.2);
        border-bottom-color: transparent;
        top: 50px;
        left: -20px;
      }
    }
    .tabs {
      width: 100%;
      overflow: hidden;
      list-style: none;
      margin: 0;
      padding: 0;
      .active {
        border-bottom: 2px solid #ffa800;
        color: #ffa800;
      }
      li {
        float: left;
        width: 50%;
        height: 70px;
        line-height: 70px;
        text-align: center;
        font-size: 18px;
        color: #dadada;
      }
    }
    .text1 {
      text-align: right;
      margin-right: 5px;
      font-size: 16px;
      color: #bbbbbb;
      cursor: pointer;
    }
    background: rgba(255, 255, 255, 0.2);
    position: absolute;
    left: 0;
    right: 0;
    width: 520px;
    max-width: 100%;
    margin: 180px auto 0 auto;
  }
  .login-form {
    .phone-email {
      padding: 0 0 10px 5px;
      margin-top: 32px;
      position: relative;
      .phone-style {
        float: left;
        font-size: 16px;
        color: #ffffff;
        font-weight: normal;
      }
      .arrow-next {
        float: left;
        background: url("/static/image/arrow-next.png") no-repeat;
        background-size: 33%;
        background-position: 50% 50%;
        display: inline-block;
        width: 42px;
        height: 24px;
        margin: 3px 8px 0 0;
      }
      .phone-email-content {
        float: left;
        width: 200px;
        color: #ffffff;
        border-left: 1px solid #ffffff;
        height: 28px;
        padding-left: 10px;
        font-size: 16px;
      }
      .popover {
        position: absolute;
        top: 50px;
        width: 191px;
        // height: 200px;
        border-radius: 5px;
        background: #ffffff;
        z-index: 5;
        > ul {
          height: 310px;
          overflow-y: scroll;
          list-style: none;
          margin-left: -20px;
          li {
            color: #7c8ca5;
            font-size: 14px;
            height: 22px;
            line-height: 22px;
            margin-bottom: 10px;
          }
        }
        .popper-arrow:after {
          position: absolute;
          content: " ";
          width: 0;
          height: 0;
          border: 6px solid #ffffff;
          border-top-color: transparent;
          border-left-color: transparent;
          border-right-color: transparent;
          border-bottom-color: #ffffff;
          top: -12px;
          left: 20px;
        }
      }
    }
    .email {
      padding: 0 0 10px 5px;
      margin-top: 30px;
      position: relative;
      span {
        position: relative;
        float: left;
        bottom: -6px;
      }
      .email-content {
        width: 80%;
        float: left;
        margin-left: 20px;
        border: none;
        background-color: transparent;
        font-size: 16px;
        color: #cfcfcf;
      }
      .passwordPump {
        position: absolute;
        top: 55px;
        left: -5px;
        padding: 16px 23px;
        width: 400px;
        // height: 90px;
        background: #ffffff;
        font-size: 14px;
        color: #909399;
        text-align: left;
        z-index: 2;
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
    }
    padding: 35px 60px 15px 60px;
    .tip {
      text-align: center;
      font-size: 14px;
      color: #ffffff;
      .agreement {
        margin-left: 8px;
      }
      a {
        color: #ffa800;
        text-decoration: underline;
      }
    }
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }
  .title-container {
    position: relative;
    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
    .set-language {
      color: #fff;
      position: absolute;
      top: 5px;
      right: 0px;
    }
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
  .thirdparty-button {
    position: absolute;
    right: 35px;
    bottom: 28px;
  }
}
</style>
