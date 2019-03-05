<template>
  <div>
      <ul class="fileList">
          <li v-for="(item,index) in fileList" :key="index"> 
                <div @click="viewPicture(item.url)">
                  <img :src="item.url" alt="">
                </div>              
                <p class="bottom">{{item.tag}}</p>
          </li>
      </ul>
      <el-dialog
        :visible.sync="centerDialogVisible"
        width="100%"
        center>
        <img :src="imgSrc" alt="" style="text-align: center;display:block;margin:0 auto;">
      </el-dialog>
  </div>
  
</template>

<script>
export default {
  name: '',
  props:{
      fileList: Array,
      required: true
  },
  data(){
    return {
      imgSrc:'',
      centerDialogVisible:false
    }
  },
  components: {  },
  computed: {
    // cachedViews() {
    //   return this.$store.state.tagsView.cachedViews
    // },
    // key() {
    //   return this.$route.fullPath
    // }
  },
  methods: {
    viewPicture(row){
      this.imgSrc = row
      this.centerDialogVisible = true
    }
  },
  mounted(){
    // console.log(this.$route.fullPath) 
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.fileList{
    overflow: hidden;
    >li{
      float: left;
      margin: 10px 15px;
      border:.5px solid #C0C4CC;
      >div{ 
        width: 600px;
        height: 450px;
        
        >img{                                       
            display: block;
            width: 100%;
            height: 100%;
            object-fit: contain;
        }
      }                                                         
        .bottom{
            width: 600px;
            white-space:nowrap;
            text-overflow:ellipsis;
            overflow:hidden;
            // position: absolute;
            
            font-size:14px;
            // opacity: 0.1;
            // bottom: 0;
            // left: 0;       
            height: 40px;
            text-align: center;
            line-height: 40px;
            color: #164061;
        }
    }
}
</style>

