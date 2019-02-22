<template>
  <div class="uploadReport">
      <el-row>
        <el-col :span="24">
          <el-form label-width="100px">
            <el-form-item label="报告模板">
              <tc-upload :files="data.files.templates" :action="false"/>
            </el-form-item>
            <el-form-item label="上传附件">
              <tc-upload
              :files="data.files.inspector_reports"
              :mimes="['application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','application/vnd.ms-excel','text/html']"
              :size="30*1024*1024"
              @upload="handleUploadResource"
              @remove="handleRemoveResource"/>
              <p class="tip">只支持上传Word、Excel、Html格式,单个附件小于30M</p>
              <el-button class="btn-submit" @click="handleSave">提交</el-button>
            </el-form-item>      
          </el-form>
        </el-col>
      </el-row>
  </div>
</template>

<script>

import Upload from '@/components/UploadReport'
import {fetchReport,storeRow,updateRow} from "@/api/order";

let newTab;

export default {
  name: "",
  components: {
    'tc-upload': Upload
  },
  data() {
    return {
      data:{
        files: {},
        inspector_reports:[]
      }
    };
  },
  computed: {
    // cachedViews() {
    //   return this.$store.state.tagsView.cachedViews
    // },
    // key() {
    //   return this.$route.fullPath
    // }
  },
  created(){
    this.id = this.$route.query.id
    this.$nextTick(() => {
      this.getData()
    })
  },
  methods:{
    getData() {
      fetchReport(this.id).then(response => {
        this.data = response.data.data
      })
    },
    // 修改文件
    handleUploadResource(file) {
      console.log(file)
      this.data.files.inspector_reports.push(file)
    },
    // 删除文件
    handleRemoveResource(file) {
      const index = this._.findIndex(this.data.files.inspector_reports, { id: file.id })
      ~index && (this.data.files.inspector_reports[index].detach = true)
    },
    handleSave() {
      updateRow('/v1/inspector/report/' + this.id + '/submit', this.data.files).then(response => {
        // successNotify(this)
        this.getData()
      })
    },
  },
  mounted() {
    // console.log(this.$route.fullPath)
  }
};
</script>
<style lang="scss">
.uploadReport .el-form-item__label{
  text-align: left;
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
.uploadReport{
  margin: 24px 40px 0;
  background:#ffffff;
  padding:30px 40px;
  .tip{
    font-size:12px;
    color:#909399;
  }
  .btn-submit{
    width: 160px;
    height: 40px;
    background:#B9B9B9;
    color:#ffffff;
  }
}
</style>

