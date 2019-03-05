<template>
  <div v-loading="loading" class="tc-report-card partH">
    <div :class="{titleChange:!partHShow}" class="tc-report-card-title clearfix">
      <span><span class="titleText">H</span>检验款</span>
      <span class="right" style="float:right;color:#FFA800" @click="partHShow=!partHShow">
        <span v-if="partHShow">收起</span>
        <span v-if="!partHShow">展开</span>
        <i :class="{rotaga:!partHShow}" class="el-icon-caret-top"/>
      </span>
    </div>
    <div v-show="partHShow" class="tc-report-card-content">
      <el-form>
        <div class="examineBox clearfix">
          <div class="leftImg fl">
            <el-upload
              :action="uploadUrl"
              :headers="uploadHeaders"
              :show-file-list="false"
              :on-success="handleSuccess"
              :on-remove="handleRemove"
              :before-upload="handleBeforeUpload"
              
              >
              <img v-if="data.files[0].url" :src="data.files[0].url" class="avatar">
              
              <div class="noFileStyle" v-else>
                <i class="iconfont icon-IconCopy1"></i>
                <p>产品合照或具有代表性产品图片</p>
                <p>图片大小≤2M，格式jpg/png</p>
              </div>
            </el-upload>
          </div>
          <div class="rightImg fr">
            <el-upload
              :action="uploadUrl"
              :headers="uploadHeaders"
              :show-file-list="false"
              :on-success="handleSuccess1"
              :on-remove="handleRemove1"
              :before-upload="handleBeforeUpload"
              
              >
              <img v-if="data.files[1].url" :src="data.files[1].url" class="avatar">
              
              <div class="noFileStyle" v-else>
                <i class="iconfont icon-IconCopy1"></i>
                <p>产品合照或具有代表性产品图片</p>
                <p>图片大小≤2M，格式jpg/png</p>
              </div>
            </el-upload>
          </div>
        </div>
        <el-form-item label-width="0" style="text-align: center;margin-top:30px;">
          <el-button class="tc-report-button" @click="handleComfirm">保存</el-button>
        </el-form-item>
      </el-form>  
    </div>      
  </div>
</template>

<script>
import UploadImage from '@/views/report/components/UploadImage'
import { getToken } from '@/utils/auth'

const defaultData = {
  files:[
    {
      url:''
    },
    {
       url:''
    }
  ]
}

export default {
  name: 'ReportPartH',
  components: {
    'tc-upload-image': UploadImage
  },
  props: {
    configs: {
      required: true,
      type: Object
    },
    order: {
      required: true,
      type: Object | null
    }
  },
  data() {
    return {
      loading: true,
      data: this._.cloneDeep(defaultData),
      partHShow: true
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
    setData(data) {
      if (data) {
        this.data = this._.cloneDeep(data)
      } else {
        const _data = this._.cloneDeep(defaultData)
        this.data = _data
      }
      this.loading = false
    },
    // 提交
    handleComfirm() {
      if(!this.data.files[0].url || !this.data.files[1].url){
        this.$message({
          message: '请上传产品图片',
          type: 'error'
        })
        return false
      }else{
        this.$message({
          message: '检验款保存成功',
          type: 'success'
        })
        this.$emit('save', this.data, 'inspection_styles')
      }
          
    },

    handleBeforeUpload(file) {
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        this.$message.error('上传图片只能是 JPG/PNG 格式!')
        return false
      }
      if (file.size / 1024 / 1024 > 10) {
        this.$message.error('上传图片大小不能超过 10MB!')
        return false
      }
    },
    uploadOnProgress(e, file) {
      const index = this.uploadingFiles.findIndex(uploadingFile => uploadingFile.uid === file.uid)
      this.uploadingFiles[index].percent = Math.round(e.percent)
      this.$set(this.uploadingFiles, index, file)
    },
    // 上传成功
    handleSuccess(response, file, fileList) {
      if (response.code === 0) {
        this.data.files[0].id= response.data.id
        this.data.files[0].name= response.data.name
        this.data.files[0].url= response.data.url
        }
      
    },
    // 移除图片
    handleRemove(file, fileList) {
    },
    // 上传成功
    handleSuccess1(response, file, fileList) {
      if (response.code === 0) {
        this.data.files[1].id= response.data.id
        this.data.files[1].name= response.data.name
        this.data.files[1].url= response.data.url
      }
    },
    // 移除图片
    handleRemove1(file, fileList) {
    },
  }
}
</script>

<style lang="scss">
.partH {
  .el-upload {
    width: 100% !important;
    height: 100%;
    .avatar{
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }
}
  /* .avatar-uploader .el-upload {
    width: 450px;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    text-align: center;
  } */
  /* .avatar {
    width: 450px;
    display: block;
    object-fit: contain;
  } */
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
  .partH{
    .noFileStyle{
      padding-top:130px;
      i{
        color:#FFA800;
        font-size: 36px;
      }
      p:nth-child(2){
        font-size:16px;
        color:#7F8FA4;
      }
      p:nth-child(3){
        font-size:16px;
        color:#EF3535;
        margin-top:17px;
      }
    }
    .examineBox{
      width: 100%;
      border:1px solid #D7DCE3;
      border-radius:4px;
      height: 410px;
      .leftImg{
        width: 50%;
        height: 100%;
        border-right:1px solid #D7DCE3;
        >div{
          width: 100%;
          height: 100%;
        }
      }
      .rightImg{
        width: 50%;
        height: 100%;
        >div{
          width: 100%;
          height: 100%;
        }
      }
    }
  }
</style>

