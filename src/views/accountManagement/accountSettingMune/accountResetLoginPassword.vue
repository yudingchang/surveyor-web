<template>
    <div class="accountResetLoginPassword">
        <el-row>
            <!-- 登录密码重置 -->
            <el-col :span="24" class="ResetLoginPassword-index">
                <div class="ResetLoginPassword">
                    <div>
                        <p><i class="iconfont icon-denglumimazhongzhi"></i></p>
                        <p>通过登录密码重置</p>
                        <p @click="resetByPassword()">立即重置</p>
                    </div>
                    <div v-if="email!=null">
                        <p><i class="iconfont icon-dianziyouxiangzhongzhi1"></i></p>
                        <p>通过电子邮箱重置</p>
                        <p @click="resetByEmail()">立即重置</p>
                    </div>
                    <div>
                        <p><i class="iconfont icon-hebingxingzhuang6"></i></p>
                        <p>通过手机号码重置</p>
                        <p @click="resetByPhone()">立即重置</p>
                    </div>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    name: 'accountResetLoginPassword',
    data(){
        return {
            first: true ,
            second: false ,
            third: false ,
        }
    },
    computed: {
        ...mapGetters([
        'sidebar',
        'name',
        'phonenumber',
        'email',
        'avatar',
        'device'
        ])
    },
    methods: {
        // 跳转重置byPassword
       resetByPassword(){
           this.$router.push({
               path:'resetByPassword'
           })
       },
       resetByEmail(){
           this.$router.push({
               path:'resetByEmail'
           })
       },
       resetByPhone(){
           this.$router.push({
               path:'resetByPhone'
           })
       }
    }

}
</script>


<style rel="stylesheet/scss" lang="scss" scoped>
//普通样式
.accountResetLoginPassword{
    .ResetLoginPassword-index{
        padding:128px 0 0 90px;
        .ResetLoginPassword{
            >div{
                float:left;
                width:300px;
                height:400px;
                border:2px solid rgba(127,143,164,1);
                padding-top:87px;
                text-align: center;
                margin-right:120px;
                cursor:pointer;
                p:nth-child(1){
                    width:90px;
                    height:100px;
                    margin:0 auto 16px;
                    line-height: 90px;
                    i{
                        font-size:90px;
                        color:rgba(127,143,164,1);
                    }
                }
                p:nth-child(2){
                    width:128px;
                    height:22px;
                    font-size:16px;
                    font-weight:500;
                    color:rgba(127,143,164,1);
                    line-height:22px;
                    margin:0 auto 82px;
                }
                p:nth-child(3){
                    width:136px;
                    height:40px;
                    // background:rgba(255,168,0,1);
                    border:1px solid rgba(127,143,164,1);
                    border-radius:4px;
                    line-height: 40px;
                    text-align: center;
                    margin:0 auto;
                    font-size:16px;
                    color:rgba(127,143,164,1);
                }
                
            }
            >div:hover{
                border:2px solid #FFA800;            
            }
            >div:hover>p{
                color: #FFA800;         
            }                   
            >div:hover>p i{
                color: #FFA800;         
            }    
            >div:hover>p:last-child{
                border:none ;  
                background-color: #FFA800 ;
                color:#ffffff;
            }                                                     
            div:last-child{
                margin-right:0;
            }
        }
    }
}
</style>

<style rel="stylesheet/scss" lang="scss">
//element-ui样式


</style>



