<template>
  <div class="upload-image-container">
    <div v-for="file in _.filter(files, { detach: false })" :key="file.id" class="image-preview shadow-sm">
      <div class="image-preview-wrapper">
        <img :src="file.url">
        <div class="image-name">
          <el-input v-model="file.tag" maxlength="30"/>
        </div>
        <i class="el-icon-close" @click="handleRemove(file)"/>
      </div>
    </div>
    <div v-for="(uploadingFile, index) in uploadingFiles" :key="index" class="image-preview shadow-sm">
      <div class="image-preview-wrapper">
        <div class="image-uploading-action">
          <el-progress :percentage="uploadingFile.percent" :width="88" type="circle" class="tc-progress"/>
        </div>
      </div>
    </div>
    <el-upload
      v-if="action"
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
      <i class="el-icon-upload"/>
      <p style="font-size:14px;color:#7F8FA4;line-height:20px;">上传图片</p>
      <p style="position:absolute;bottom:-20px;left:40px;font-size: 12px;color: #7F8FA4;">图片大小≤10M，格式jpg/png</p>
    </el-upload>
  </div>
</template>

<script>
import prettyFileIcons from 'pretty-file-icons'
import { getToken } from '@/utils/auth'

export default {
  name: 'UploadImage',
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
    name: {
      type: String,
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
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        this.$message.error('上传图片只能是 JPG/PNG 格式!')
        return false
      }
      if (file.size / 1024 / 1024 > 2) {
        this.$message.error('上传图片大小不能超过 2MB!')
        return false
      }
      file.percent = 0
      this.uploadingFiles.push(file)
    },
    handleRemove(file) {
      this.$emit('remove', file, this.name)
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
        const data = response.data
        data.tag = data.name.replace(/(\.[a-zA-Z]*)(?=$)/, '')
        this.$emit('upload', data, this.name)
      }
    }
  }
}
</script>

<style lang="scss">
@import '@/styles/mixin.scss';

.upload-image-container {
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
  .el-progress{
    margin-top: 67px;
  }
  .image-preview {
    position: relative;
    border: 1px solid rgb(220, 223, 230);
    border-radius: 4px;
    float: left;
    width: 300px;
    height: 225px;
    margin-right: 10px;
    margin-bottom: 15px;
    text-align: center;
    // overflow: hidden;
    .el-upload-dragger {
      // width: 208px;
      height: 167px;
      margin: 5px;
      border: dotted 1px rgb(220, 223, 230);
      border-radius: 5px;
      overflow:visible;
      .el-icon-upload {
        font-size: 40px;
        color: #FFA800;
        margin: 70px auto 10px;
        // line-height: 157px;
      }
    }
    .el-upload {
      border-width: 0;
      width: 100%;
      background-color: #fff;
      .el-upload-dragger {
        width:auto;
        height: 100%;
        // line-height: 150px;
        border-radius: 0;
        border-width: 0;
        background-color: transparent;
        &:hover {
          .el-icon-plus {
            color: #409eff !important;
          }
        }
        }
      }
      .el-upload{
        display: block;
      }
      $body_padding: 12px;
      .el-upload--picture-card {
        // padding: 6px;
        width: auto;
        // height: auto;
        border: 2px dashed #CED0DA;
        line-height: 0;
        margin: 6px !important;
        height:  calc(100% - #{$body_padding});
      }

    .image-preview-wrapper {
      position: relative;
      
      // border: 2px dashed #CED0DA;
      // width: 300px; 
      // height: 225px;
      width: 100%;
      height: 100%;
      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
    }
    .el-icon-close {
      position: absolute;
      font-size: 16px;
      right: 5px;
      top: 5px;
      font-weight: bolder;
      cursor: pointer;
    }
    .image-name {
      position: absolute;
      bottom: 0;
      width: 100%;
      height: 31px;
      .el-input {
        background-color: transparent;
        .el-input__inner {
          border: none;
          border-top:1px solid #DFE3E9; 
          background-color: rgba(255,255,255,.8);
          opacity: .8;
          border-radius: 0 0 5px 5px / 5px;
          height: 26px;
          font-size: 12px;
          color:#50688C;
          margin: 0;
          text-align: center;
        }
      }
    }
    .image-uploading-action {
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      background-color: rgba(0, 0, 0, .7);
      text-align: center;
      line-height: 179px;
    }
    .image-preview-action {
      position: absolute;
      width: 100%;
      height: 100%;
      padding: 6px;
      left: 0;
      top: 0;
      cursor: default;
      text-align: center;
      color: #fff;
      opacity: 0;
      background-color: rgba(0, 0, 0, .76);
      transition: opacity .2s;
      font-size: 26px;
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
