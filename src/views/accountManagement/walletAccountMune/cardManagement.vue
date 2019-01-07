<template>
  <div class="cardManagement">
    <div class="cardManagementTop">
      银行卡管理
    </div>
    <el-row class="cardManagementContent clearfix">
      <el-col class="leftContent">
        <div>
          <div v-for="(item,index) in cardList" :key = "index" class="cardStyle clearfix" @click="getCardDetail(item)">
            <div class="left1">
              <p>
                <img :src="item.logo" alt="">
                <!-- <span>{{item.open_bank}}</span> -->
              </p>
              <p>{{ item.bank_account  ?  bankNumber(item.bank_account) : ''}}</p>
            </div>
            <div class="right1">
              <p v-if="item.is_default == 1">默认卡</p>
              <p v-if="item.is_default == 0" @click="setDefalt(item)">设为默认</p>
              <p @click="removeCard(item)">删除</p>
            </div>

          </div>
          <div class="addCard" @click="addCard()">
            <i class="el-icon-plus"/>
            <p>添加银行卡</p>
          </div>
        </div>
      </el-col>
      <el-col :span="13" :offset="1" class="rightContent">
        <div class="rightContentTop">
          银行卡管理
        </div>
        <div class="rightContentMiddle">
          <el-form :data="CardDetail" label-width="150px">
            <el-form-item label="持卡人姓名">
              <span>{{ CardDetail.cardholder }}</span>
            </el-form-item>
            <el-form-item label="开户银行">
              <span>{{ CardDetail.open_bank }}</span>
            </el-form-item>
            <el-form-item label="开户支行">
              <span>{{ CardDetail.bank_branch }}</span>
            </el-form-item>
            <el-form-item label="银行账号">
              <span>{{ CardDetail.bank_account }}</span>
            </el-form-item>
            <el-form-item label="手机号码">
              <span>{{ CardDetail.phone_number }}</span>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getCardList, removeCard, setDefalt } from '@/api/walletDetail'// 列表请求数据
export default {
  name: '',
  components: {
  },
  data() {
    return {
      cardList: [ 
      ],
      CardDetail:{
        cardholder:'',
        open_bank:'',
        bank_branch:'',
        bank_account:'',
        phone_number:''
      }
    }
  },
  created() {
    this.getCardList()
  },
  methods: {
    //   获取银行卡列表
    getCardList() {
      getCardList({}).then(res => {
        if (res.data.code == 0) {
          this.cardList = res.data.data.list
          this.CardDetail = res.data.data.list[0]
        }
      })
    },
    //   跳转添加银行卡页面
    addCard() {
      this.$router.push({
        path: 'addCard'
      })
    },
    bankNumber(value) {
      // var str1 = "111177772209822";
      // var lastFour = value.slice(-4);
      let newArr = new Array(value.length - 3).join('*') + value.slice(-4)
      newArr = newArr.replace(/\s/g, '').replace(/(.{4})/g, '$1 ')
      return newArr
    },
    getCardDetail(val) {
      this.CardDetail = val
    },
    // 删掉银行卡
    removeCard(item) {
      removeCard({
        id: item.id
      }).then(res => {
        if (res.data.code == 0) {
          this.getCardList()
        }
      })
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
    }
  }
}
</script>
<style lang="scss">
.cardManagement{
    .el-form-item__label{
        text-align: left;
    }
    .el-input-group__prepend , .el-input-group__append{
        background-color: #ffffff;

    }
    .el-form-item__label{
        color:#7C8FA6;
    }

}

</style>

<style rel="stylesheet/scss" lang="scss" scoped>
.cardManagement {
    margin:24px 40px 0;
    background-color:#ffffff;
    min-height:80vh;
    .cardManagementTop{
        height: 80px;
        line-height:80px;
        padding-left:32px;
        border-bottom:1px solid #DFE3E9;
        font-size:16px;
        color:#50688C;
    }
    .cardManagementContent{
        padding:32px 50px 0;
        .leftContent{
            float: left;
            width: 320px;
            color:#50688C;
            .cardStyle{
                width: 100%;
                height: 160px;
                background:rgba(255,255,255,1);
                box-shadow:0px 2px 4px 0px rgba(120,120,120,0.5);
                border-radius:8px;
                margin-bottom:24px;
                padding: 0 16px 0 20px;
                cursor: pointer;
                &:hover{
                    background:rgba(74,144,226,0.1);
                }
                .left1{
                    float: left;
                    margin-top:20px;
                    >p:first-child{
                        height: 32px;
                        line-height:32px;
                        img{
                            display: inline-block;
                            // width: 32px;
                            // height: 32px;
                        }
                        span{
                           line-height:32px;
                           height: 32px;
                           vertical-align: top;
                        //    margin-left:14px;
                        }
                    }
                    >p:last-child{
                        margin-top:26px;
                    }
                }
                .right1{
                    float: right;
                    margin-top:16px;
                    >p:last-child{
                        margin-top:85px;
                        color:#7C8CA5;
                    }
                }
            }
            .addCard{
                cursor: pointer;
                width: 100%;
                height: 160px;
                border:2px dashed #CED0DA;
                border-radius:8px;
                i{
                    display: block;
                    font-size:72px;
                    color:#CED0DA;
                    margin:0 auto;
                    text-align:center;
                    margin-top:30px;
                }
                p{
                    font-size:18px;
                    color:#CED0DA;
                    text-align:center;
                    margin-top:10px;
                }
            }

        }
        .rightContent{
            float: left;
            // margin-left:60px;
            border-radius:4px;
            border:1px solid rgba(192,196,204,1);
            // width:1000px;
            height:500px;
            .rightContentTop{
                width: 100%;
                height: 60px;
                line-height:60px;
                padding-left:32px;
                border-bottom:1px solid #DFE3E9;
                color:#50688C;
                font-size:16px;
            }
            .rightContentMiddle{
                padding:42px 0 42px 80px;
                color:#50688C;
            }
        }
    }
}
</style>
