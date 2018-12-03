<template>
  <div class="paymentCHN">
    <ul class="paymentCHN-ul">
        <!-- <li v-if="unionpay">
            <el-radio v-model="radio" label="1"/>
            <img src="../../../static/image/UnionPay.png" alt="">
            <span>银联</span>
        </li>
        <li v-if="alipayment">
            <el-radio v-model="radio" label="2" />
            <img src="../../../static/image/payment.png" alt="">
            <span>支付宝</span>
        </li>
        <li v-if="testcoopay">
            <el-radio v-model="radio" label="3"/>
            <span>测库月结</span>
            <span>(你还有一份账单未结算)</span>
        </li>
        <li v-if="wallet"> 
            <el-radio v-model="radio" label="4"/>
            <span>钱包</span>
            <span>￥8989.89</span>
            <span>充值</span>
        </li> -->
        <li v-for="(item,index) in data" :key="index">
             <el-radio v-model="radio" :label="item.id"/>
             <template v-if="item.name=='unionpay'">
                 <span class="lis1">
                     <img src="../../../static/image/UnionPay.png" alt="">
                     <span>银联</span>
                 </span>
             </template>
             <template v-if="item.name=='alipayment'">
                 <span class="lis2">
                    <img src="../../../static/image/payment.png" alt="">
                    <span>支付宝</span>
                 </span>
             </template>
             <template v-if="item.name=='testcoopay'">
                 <span class="lis3">
                     <span>测库月结</span>
                     <span>(你还有一份账单未结算)</span>
                 </span>
             </template>
             <template v-if="item.name=='wallet'">
                 <span class="lis4">
                     <span>钱包</span>
                     <span>￥8989.89</span>
                     <span>充值</span>
                 </span>
             </template>
        </li>
    </ul>
  </div>
</template>

<script>
export default{
  name: 'paymentCHN',
  data () {
      return {
        radio: "",
        data:[
            {
                id:1,
                name:"unionpay"
            },
            {
                id:2,
                name:"alipayment"
            },
            {
                id:3,
                name:"testcoopay" 
            },
            {
                id:4,
                name:"wallet"
            }
        ]

        
      };
    },
    props:[],
    methods:{
       
    },
    mounted(){
       
        
    },
    watch:{
        //监听页面按钮点击触发的事件
        radio(val) {
            // console.log(val)
            this.$emit("receiveDate",val)
            // console.log(val)

        }
    }
}
</script>
<style rel="stylesheet" lang="scss" scoped>
.paymentCHN{
    height:100%;
    margin-bottom:24px;
    .paymentCHN-ul{
        li{
            height:80px;
            line-height: 80px;
            border-bottom:1px solid #C0C4CC;
            padding-left:55px;
        }
        .lis1{
            img{
                margin:0 75px 0 64px;
                vertical-align: middle;
            }
            span{
                font-size:18px;
                color:#50688C;
            }
        }
        .lis2{
            img{
                margin:0 40px 0 24px;
                vertical-align: middle;
            }
            span{
                font-size:18px;
                color:#50688C;
            }
        }
        // .lis3{
        //     display:inline-block;
        //     span:nth-child(1){
        //         margin-left:24px;
        //         font-size:18px;
        //         color:#50688C;
        //     }
        // }
        .lis3{
            span:nth-child(1){
                margin-left:24px;
                font-size:18px;
                color:#50688C;
            }
            span:nth-child(2){
                font-size:18px;
                color:#606266;
            }
        }
        .lis4{
            span:nth-child(1){
                margin-left:24px;
                font-size:18px;
                color:#606266;
            }
            span:nth-child(2){
                margin:0 218px 0 32px;
                font-size:22px;
                color:#158BE4; 
            }
            span:nth-child(3){
                width:100px;
                height:32px;
                display:inline-block;
                background:#67C23A;
                text-align: center;
                line-height: 32px;
                border-radius:4px;
                color:#fff;
                cursor:pointer;
            }
        }
    }
}
</style>

