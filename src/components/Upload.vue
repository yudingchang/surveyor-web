<template>
  <div class="upload-container">
    <div v-for="file in files" :key="file.id"  :class="{'successBorder':isSuccess,'image-preview':true,'shadow-sm':true}">
      <div class="image-preview-wrapper">
        <div>
          <svg-icon :icon-class="getFileExtensions(file.url)" class-name="file-icon"/>
        </div>
        <div class="image-name">{{ file.name }}</div>
        <div class="image-preview-action">
          <i class="el-icon-zoom-in"/>
          <i v-if="file.can_destory && action" class="el-icon-delete"/>
          <i class="el-icon-download" />
        </div>
      </div>
    </div>
    <div v-for="(uploadingFile, index) in uploadingFiles" :key="index" class="image-preview shadow-sm">
      <div class="image-preview-wrapper">
        <svg-icon :icon-class="getFileExtensions(uploadingFile.name)" class-name="file-icon"/>
        <div class="image-uploading-action">
          <el-progress :percentage="uploadingFile.percent" :width="88" type="circle" class="tc-progress"/>
        </div>
      </div>
    </div>
    <el-upload
      v-if="action"
      :on-remove="handleRemove"
      :on-progress="uploadOnProgress"
      :on-success="handleSuccess"
      :before-upload="handleBeforeUpload"
      :show-file-list="false"
      :action="uploadUrl"
      :headers="uploadHeaders"
      drag
      multiple
      class="image-preview shadow-sm"
      list-type="picture-card">

      <i class="el-icon-plus"/>
    </el-upload>
  </div>
</template>

<script>
import prettyFileIcons from 'pretty-file-icons'
import { getToken } from '@/utils/auth'

export default {
  name: 'Upload',
  props: {
    files: {
      type: Array,
      default: () => {
        return []
      }
    },
    action: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      uploadingFiles: [],
      isSuccess:true
    }
  },
  computed: {
    uploadUrl() {
      return process.env.BASE_API + 'v1/upload'
    },
    uploadHeaders() {
      return { Authorization: 'Bearer ' + getToken() }
    }
  },
  created() {

  },
  methods: {
    getFileExtensions(url) {
      return prettyFileIcons.getIcon(url)
    },
    handleBeforeUpload(file) {
      file.percent = 0
      this.uploadingFiles.push(file)
      console.log('aaa')
    },
    // handleRemove(index, file, fileList) {
    //   // console.log(index)
    //   this.uploadingFiles[index].image = [];
    //   //   console.log(file, fileList);
    // },
    handleRemove(file, fileList) {
    //   console.log(file, fileList)
      this.uploadingFiles.push(file)
    },
    uploadOnProgress(e, file) {
      const index = this.uploadingFiles.findIndex(uploadingFile => uploadingFile.uid === file.uid)
      this.uploadingFiles[index].percent = Math.round(e.percent)
      this.$set(this.uploadingFiles, index, file)
    },
    handleSuccess(response, file, fileList) {
      const index = this.uploadingFiles.findIndex(uploadingFile => uploadingFile.uid === file.uid)
      this.uploadingFiles.splice(index, 1)
      console.log(response.code)
      if (response.code === 0) {
        this.files.push(response.data)
        this.isSuccess = true
        console.log(response.data)
      }
    }
  }
}
</script>
<style>
  .el-upload-dragger{
    border: none;
  }
  .el-upload--picture-card{
    border: none;
  }
  .successBorder{
    border: 1px solid #CFCFCF !important;
  }
   .el-progress-circle{
     position: absolute;
     left: 50%;
     top: 50%;
     margin-top: -44px;
     margin-left: -44px;
  }
  .el-progress--circle .el-progress__text{
    position: absolute;
     left: 50%;
     top: 50%;
     margin-left: -10px;
     /* margin-top: -44px;
     /* margin-left: -44px; */ 
  }
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";
.upload-container {
  width: 100%;
  position: relative;
  margin-top: .8em;
  @include clearfix;
  .file-icon {
    font-size: 105px;
  }
  .image-uploader {
      width: 60%;
      float: left;
  }
 
  .image-preview {
    position: relative;
    border: 2px dashed #e1e1e1;
    border-radius: 7px;
    float: left;
    width: 120px;
    height: 145px;
    margin-left: 10px;
    margin-bottom: 15px;
    text-align: center;
    overflow: hidden;
    .image-preview-wrapper {
      position: relative;
      width: 100%;
      height: 100%;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .image-name {
      padding-top: 5px;
      line-height: 1.3em;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      border-top:1px solid #CFCFCF;
      margin-top: 10px;
    }
    
    .image-uploading-action {
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      background-color: rgba(0, 0, 0, .7);
      text-align: center;
      line-height: 140px;
    }
    .image-preview-action {
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        cursor: default;
        text-align: center;
        color: #fff;
        opacity: 0;
        background-color: rgba(0, 0, 0, .7);
        transition: opacity .2s;
        font-size: 28px;
        text-align: center;
        line-height: 150px;
        i {
          cursor: pointer;
          &:hover {
            color: #409EFF;
          }
        }
    }
    &:hover {
      .image-preview-action {
          opacity: 1;
      }
    }
  }
}
</style>

