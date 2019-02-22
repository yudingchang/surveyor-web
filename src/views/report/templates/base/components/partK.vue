<template>
  <div v-loading="loading" class="tc-report-card">
    <div :class="{titleChange:!partHShow}" class="tc-report-card-title clearfix">
      <span><span class="titleText">H</span>基本信息</span>
      <span class="right" style="float:right;color:#FFA800" @click="partHShow=!partHShow">
        <span v-if="partHShow">收起</span>
        <span v-if="!partHShow">展开</span>
        <i :class="{rotaga:!partHShow}" class="el-icon-caret-top"/>
      </span>
    </div>
    <div v-show="partHShow" class="tc-report-card-content">
        <el-form ref="form" :model="data" label-width="130px">
          <el-upload
            :action="uploadUrl"
            :headers="uploadHeaders"
            :show-file-list="false"
            :on-success="handleSuccess"
            :on-remove="handleRemove"
            :before-upload="handleBeforeUpload"
            style="position:absolute;top:0;right:0;width:100%"
            >
            <img v-if="data.file" :src="data.file.url" class="avatar">
            <!-- <i v-else class="el-icon-plus avatar-uploader-icon"/> -->
            <div class="noFileStyle" v-else>
                <i class="iconfont icon-IconCopy1"></i>
                <p>上传图片</p>
                <p>图片大小≤10M，格式jpg/png</p>
            </div>
          </el-upload>
      </el-form>
    </div>
  </div>
</template>

<script>
import UploadImage from '@/views/report/components/UploadImage'
import { getToken } from '@/utils/auth'

const defaultData = {
  number: 1,
  user_name: '',
  supplier_name: '',
  factory_name: '',
  product_number: '',
  product_name: '',
  order_name: '',
  inspection_type: null,
  inspection_dates: [],
  inspection_address: '',
  report_quantity: 0,
  inspection_basis: null,
  inspection_basis_other: '',
  file: null
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
        const products = this._.get(this.order, 'products')
        const productNumbers = this._.filter(this._.map(products, 'number'))
        const productNames = this._.filter(this._.map(products, 'name'))
        const productOrderNumbers = this._.filter(this._.map(this._.flatten(this._.map(products, 'PO')), 'number'))
        const productQuantity = this._.sum(this._.map(products, 'report_quantity'))

        _data.user_name = this._.get(this.order, 'order.user_name')
        _data.supplier_name = this._.get(this.order, 'order.supplier.name')
        _data.factory_name = this._.get(this.order, 'service.address.name')
        _data.product_number = productNumbers ? productNumbers.join(',') : ''
        _data.product_name = productNames ? productNames.join(',') : ''
        _data.order_name = productOrderNumbers ? productOrderNumbers.join(',') : ''
        _data.inspection_type = parseInt(this._.get(this.order, 'order.inspection_type'))
        _data.inspection_dates = this._.get(this.order, 'service.inspection_dates')
        _data.inspection_address = this._.get(this.order, 'service.address.address_detail')
        _data.report_quantity = productQuantity

        this.data = _data
      }
      this.loading = false
    },
    // 提交
    handleComfirm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$message({
            message: '基本信息保存成功',
            type: 'success'
          })
          this.$emit('save', this.data, 'general_information')
        }
      })
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
        this.data.file = {
          id: response.data.id,
          name: response.data.name,
          url: response.data.url
        }
      }
    },
    // 移除图片
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
  }
}
</script>

<style lang="scss">
.tc-report-card {
  .noFileStyle{
    padding-top:300px;
    i{
      color:#FFA800;
      font-size: 36px;
    }
    p:nth-child(2){
      font-size:22px;
      color:#7F8FA4;
    }
    p:nth-child(3){
      font-size:16px;
      color:#EF3535;
      margin-top:25px;
    }

  }
  .el-upload {
    width: 80%;
    .avatar{
      width: 100%;
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
