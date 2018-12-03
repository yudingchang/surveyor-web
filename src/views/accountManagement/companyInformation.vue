<template>
  <div class="company-information">
    <div v-if="editMessage" :model="form">
      <div class="company-content clearfloat">
        <div class="left required">公司名称</div>
        <div class="right-fixed">
            <el-input style="width:380px;" type="text" placeholder="请输入公司名称"></el-input>
        </div>
      </div>
      <div class="company-content clearfloat">
        <div class="left">公司地址</div>
        <div class="right-fixed">
            <el-input style="width:380px;" type="text" placeholder="请输入公司地址"></el-input>
        </div>
      </div>
      <div class="company-content clearfloat">
        <div class="left">详细地址</div>
        <div class="right-fixed">
            <el-input
              style="width:380px;"
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4}"
              placeholder="请输入内容"
              v-model="form.address">
            </el-input>
        </div>
      </div>
      <div class="company-content clearfloat">
        <div class="left">公司规模</div>
        <div class="right-fixed">
            <el-select v-model="form.scope" placeholder="请选择" style="width:380px;">
              <el-option
              v-for="(item,index) in options"
              :key="index"
              :label="item.label"
              :value="item.value"
              >    
              </el-option>
          </el-select>
        </div>
      </div>
      <div class="company-content clearfloat">
        <div class="left">营业执照注册号</div>
        <div class="right-fixed">
            <el-input style="width:380px;" type="text" placeholder="请输入公司地址"></el-input>
        </div>
      </div>
      <div class="save"  @click="save()">保存</div>
    </div>


    <div v-if="normalStatu" :model="form">
      <div class="company-content clearfloat">
        <div class="left required">公司名称</div>
        <div class="right-fixed">
            <span v-if="form.name!=''">{{form.name}}</span>
            <span class="empty" v-else>未设置</span>
        </div>
      </div>
      <div class="company-content clearfloat">
        <div class="left">公司地址</div>
        <div class="right-fixed">
            <span v-if="form.name!=''">{{form.name}}</span>
            <span class="empty" v-else>未设置</span>
        </div>
      </div>
      <div class="company-content clearfloat">
        <div class="left">详细地址</div>
        <div class="right-fixed">
            <span v-if="form.name!=''">{{form.name}}</span>
            <span class="empty" v-else>未设置</span>
        </div>
      </div>
      <div class="company-content clearfloat">
        <div class="left">公司规模</div>
        <div class="right-fixed">
            <span v-if="form.name!=''">{{form.name}}</span>
            <span class="empty" v-else>未设置</span>
        </div>
      </div>
      <div class="company-content clearfloat">
        <div class="left">营业执照注册号</div>
        <div class="right-fixed">
            <span v-if="form.name!=''">{{form.name}}</span>
            <span class="empty" v-else>未设置</span>
        </div>
      </div>
      <div class="edit" @click="editPersonalMessage()">修改</div>
    </div>
  </div>
</template>

<script>
export default {
  name: '',
  components: {  },
  data(){
    return{
      editMessage:true,
      normalStatu:false,
      form:{
        name:'',
        scope:'',
        address:'',
      },
      options:[
        {
          value: "0~20",
          label: "0~20"
        },
        {
          value: "20~100",
          label: "20~100"
        },
        {
          value: "100~500",
          label: "100~500"
        },
      ]
    }
  },
  computed: {
    // cachedViews() {
    //   return this.$store.state.tagsView.cachedViews
    // },
    // key() {
    //   return this.$route.fullPath
    // }
  },
  mounted(){
    // console.log(this.$route.fullPath) 
  }
}
</script>

<style rel="stylesheet/scss" lang="scss"  scoped>
.clearfloat:after {
  display: block;
  clear: both;
  content: "";
  visibility: hidden;
  height: 0;
}
.company-information{
    margin: 40px 0 0 100px;
    color: #164061;
    font-size: 14px;
    .edit{
    margin-left: 160px;
    width: 240px;
    height: 40px;
    line-height: 40px;
    border: 1px solid #FFA800;
    border-radius: 4px;
    font-size: 16px;
    color: #FFA800;
    letter-spacing: 0.77px;
    text-align: center; 
    cursor: pointer;
  }
  .save {
    margin-left: 185px;
    width: 240px;
    height: 40px;
    line-height: 40px;
    background: #ffa800;
    border-radius: 4px;
    font-size: 16px;
    color: #ffffff;
    letter-spacing: 0.77px;
    text-align: center;
    cursor: pointer;
  }
  .company-content{
    // overflow: hidden;
    height: 36px;
    line-height: 36px;
    margin-bottom: 35px;
    .left{
      float: left;
      width: 150px;
      font-size: 14px;
      color: #7f8fa4;
    }
    .required{
      &::after{
        content: '*';
        color: #FF0000;
        margin-left: 9px;
      }
    }
    
    .right-fixed{
      float: left;
      margin-left: 34px;
      .empty{
        color: #909399;
      }
      // input{
      //   border: 1px solid #dfe3e9;
      //   outline: none;
      //   -webkit-box-shadow: none;
      //   box-shadow: none;
      //   color: #164061;
      //   height: 30px;
      //   line-height: 30px;
      //   padding-left: 14px;
      //   border-radius: 4px;
      // }
      // input[type='textarea']{
      //   width: 38px;
      // }
    }
  }
} 
</style>

