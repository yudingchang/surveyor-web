<template>
  <div>
      <ul class="fileList">
          <li v-for="(item,index) in fileList" :key="index"> 
            <div>
                <svg-icon :icon-class="getFileExtensions('_.'+item.extension)" class-name="file-icon"/>
            </div>
            <p class="bottom">{{item.name}}</p>
            <span class="bgcover" v-if="canDownLoad == true">
                <i class="el-icon-download" @click="download(item.url)"></i>
            </span>
          </li>
      </ul>
  </div>
</template>

<script>
import prettyFileIcons from 'pretty-file-icons'
export default {
  name: '',
  props:{
      fileList:{
        type:Array,
        'default': null
      },
      canDownLoad:{
        type:Boolean,
        'default': false
      }
  },
  components: {  },
  created(){

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
  },
  methods: {
      getFileExtensions(url) {
      return prettyFileIcons.getIcon(url)
    },
    download(row){
        window.location.href = row
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.fileList{
    overflow: hidden;
    >li:hover .bgcover{
        display: block;
    }
    >li{
        float: left;
        width: 120px;
        // height: 120px;
        margin-left: 16px;
        position: relative;                                                     
        >img{                                       
            display: block;
            width: 100%;
            height: 100%;
        }
        .file-icon {
            font-size: 40px;
            margin-top:22px;
            text-align: center;
            display:block;
            margin: 0 auto;
        }
        .bottom{
            width: 120px;
            white-space:nowrap;
            text-overflow:ellipsis;
            overflow:hidden;
            // position: absolute;
            background: #FFFFFF;
            opacity: 0.8;
            bottom: 0;
            left: 0;       
            height: 21px;
            text-align: center;
            line-height: 21px;
            color: #164061;
            margin-top:6px;
        }
        .bgcover{
            display: none;
            position: absolute;
            width: 100%;
            height: 100%;
            border-radius: 4px;
            left: 0;
            top: 0;
            cursor: pointer;
            text-align: center;
            color: #fff;
            /* opacity: 0; */
            font-size: 20px;
            background-color: rgba(0,0,0,.5);
            transition: opacity .3s;
            i{
                line-height: 67px;
            }
        }
    }
    >li:first-child{
        margin-left: 0;
    }
    
}
</style>

