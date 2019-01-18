<template>
  <div class="upload-container reportupload">
    <div v-for="file in _.filter(files, { detach: false })" :key="file.id" class="image-preview shadow-sm" >
      <div class="image-preview-wrapper" :class="{'hiddenaction':!action}">
        <div>
          <svg-icon :icon-class="getFileExtensions('_.'+file.extension)" class-name="file-icon"/>
        </div>
        <div class="image-name" :class="{'hiddenBorder':!action}">{{ file.name }}</div>
        <div class="image-preview-action">
          <a :href="file.url" target="_blank"><i class="el-icon-download"/></a>
          <i v-if="action" class="el-icon-delete" @click="handleRemove(file)"/>
        </div>
      </div>
    </div>
    <div v-for="(uploadingFile, index) in uploadingFiles" :key="index" class="image-preview shadow-sm" :class="{'dashedAction':action}">
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
    },
    mimes: {
      type: Array|null,
      default: null
    },
    size: {
      type: Number|null,
      default: null
    }
  },
  data() {
    return {
      uploadingFiles: []
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
  methods: {
    getFileExtensions(url) {
      return prettyFileIcons.getIcon(url)
    },
    handleBeforeUpload(file) {
      console.log(file.type)
      if (this.mimes && !this.mimes.includes(file.type)) {
        this.$message.error(`上传图片只能是 ${this.mimes.join(',')} 格式!`)
        return false
      }
      if (this.size && file.size > this.size) {
        this.$message.error(`上传图片大小不能超过 ${this._.round(this.size/1024)} KB!`)
        return false
      }

      file.percent = 0
      this.uploadingFiles.push(file)
    },
    handleRemove(file) {
      if (file.detach === false) {
        this.$emit('remove', file, this.files)
      }
    },
    uploadOnProgress(e, file) {
      const index = this.uploadingFiles.findIndex(uploadingFile => uploadingFile.uid === file.uid)
      this.uploadingFiles[index].percent = Math.round(e.percent)
      this.$set(this.uploadingFiles, index, file)
    },
    // 上传成功
    handleSuccess(response, file, fileList) {
      const index = this.uploadingFiles.findIndex(uploadingFile => uploadingFile.uid === file.uid)
      this.uploadingFiles.splice(index, 1)
      if (response.code === 0) {
        this.$emit('upload', response.data, this.files)
      }
    }
  }
}
</script>
<style lang="scss">
@mixin clearfix {
  &:after {
    content: "";
    display: table;
    clear: both;
  }
}
.upload-container.reportupload{
  width: 100%;
  position: relative;
  margin-top: 0.8em;
  @include clearfix;
  .file-icon {
    font-size: 56px;
    margin-top:22px;   
  }
  .image-uploader {
    width: 60%;
    float: left;
  }
  .image-preview {
    position: relative;
    // border: 1px solid rgb(220, 223, 230);
    border-radius: 7px;
    float: left;
    width: 120px;
    height: 120px;
    margin-right: 20px;
    margin-bottom: 5px;
    text-align: center;
    // overflow: hidden;
    .el-upload-dragger{
      border: none;
      i{
        font-size:72px;
        color:#CED0DA;
      }
    }
    .el-upload-dragger{
      border: none;
      height:120px;
      border:2px dashed rgb(220, 223, 230);
    }
    .el-upload--picture-card{
      border:none;
      height:120px;
      // line-height:120px;
      
    }
    .image-preview-wrapper {
      position: relative;
      width: 100%;
      height: 100%;
      border:1px solid rgb(220, 223, 230);
      border-radius:4px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .image-name {
      color:#50688C;
      font-size: 10px;
      padding-top: 6px;
      line-height: 13px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      border-top:1px solid #CFCFCF;
      margin-top:6px;
    }
    .image-uploading-action {
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      background-color: rgba(0, 0, 0, 0.7);
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
      background-color: rgba(0, 0, 0, 0.76);
      transition: opacity 0.2s;
      font-size: 26px;
      text-align: center;
      line-height: 120px;
      i {
        cursor: pointer;
        &:hover {
          color: #409eff;
        }
      }
    }
    &:hover {
      .image-preview-action {
        opacity: 1;
      }
    }
  }
  .hiddenaction{
      border: none !important;
  }
  .dashedAction{
    border: 2px dashed #CED0DA !important;
  }
  .hiddenBorder{
    border-top:none !important;
  }
}
</style>
