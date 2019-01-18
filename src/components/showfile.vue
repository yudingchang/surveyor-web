<template>
  <div>
      <ul class="fileList">
          <li v-for="(item,index) in fileList" :key="index"> 
                <div>
                    <svg-icon :icon-class="getFileExtensions('_.'+item.extension)" class-name="file-icon"/>
                </div>
                <p class="bottom">{{item.name}}</p>
          </li>
      </ul>
  </div>
</template>

<script>
import prettyFileIcons from 'pretty-file-icons'
export default {
  name: '',
  props:{
      fileList: Array,
      required: true
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
  mounted(){
    // console.log(this.$route.fullPath) 
  },
  methods: {
      getFileExtensions(url) {
      return prettyFileIcons.getIcon(url)
    },
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.fileList{
    overflow: hidden;
    >li{
        float: left;
        width: 120px;
        height: 120px;
        margin-left: 16px;
        position: relative;                                                     
        >img{                                       
            display: block;
            width: 100%;
            height: 100%;
        }
        .file-icon {
            font-size: 56px;
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
            height: 24px;
            text-align: center;
            line-height: 24px;
            color: #164061;
        }
    }
    >li:first-child{
        margin-left: 0;
    }
}
</style>

