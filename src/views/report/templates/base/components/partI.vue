<template>
  <div class="tc-report-card">
    <div :class="{titleChange:!partIShow}" class="tc-report-card-title clearfix">
      <span><span class="titleText">I</span>检验结论</span>
      <span class="right" style="float:right;color:#FFA800" @click="partIShow=!partIShow">
        <span v-if="partIShow">收起</span>
        <span v-if="!partIShow">展开</span>
        <i :class="{rotaga:!partIShow}" class="el-icon-caret-top"/>
      </span>
    </div>
    <div v-show="partIShow" class="tc-report-card-content">
      <el-form ref="form" :model="data" label-width="130px">
        <el-form-item
          :rules="[{ required: true, message: '请选择结论', trigger: 'change' }]"
          label="报告总结论"
          prop="general_conclusion">
          <el-radio
            v-for="item in configs.generalConclusionOptions"
            v-model="data.general_conclusion"
            :key="item.value"
            :label="item.value">
            {{ item.label }}
          </el-radio>
        </el-form-item>
        <el-form-item label-width="0" style="margin: 0 0 24px 0;">
          <table cellspacing="0" cellpadding="0" border="0" class="tc-table" style="width: 100%">
            <tbody>
              <tr>
                <td style="width: 270px;" class="background-gray">外观及工艺</td>
                <td colspan="5">符合</td>
              </tr>
              <tr>
                <td style="width: 270px;" class="background-gray">抽样数</td>
                <td colspan="5">{{ cloneE.sampling.params.quantity }}</td>
              </tr>
              <tr>
                <td rowspan="2" class="background-gray" style="vertical-align:middle;text-align:center;">检验标准</td>
                <!-- {{order}} -->
                <td rowspan="2" style="text-align:center;vertical-align:middle;">{{ _.get(_.find(_.get(configs, 'samplings.options', []), { value: cloneE.sampling.type }), 'label') }}</td>
                <td style="width: 180px;">疵点</td>
                <td style="width: 180px;">致命缺陷</td>
                <td style="width: 180px;">严重缺陷</td>
                <td style="width: 180px;">轻微缺陷</td>
              </tr>
              <tr>
                <td>AQL</td>
                <td>{{ cloneE.sampling.params.fatal_defect_limit ? cloneE.sampling.params.fatal_defect_limit : 'N/A' }}</td>
                <td>{{ cloneE.sampling.params.serious_defect_limit ? cloneE.sampling.params.serious_defect_limit : 'N/A' }}</td>
                <td>{{ cloneE.sampling.params.minor_defect_limit ? cloneE.sampling.params.minor_defect_limit : 'N/A' }}</td>
              </tr>
              <tr>
                <td rowspan="3" class="background-gray" style="vertical-align:middle;text-align:center;">检验水平</td>
                <td rowspan="3">{{ _.get(_.find(_.get(configs, 'samplings.levels', []), { level: _.get(order, 'visual_and_workmanship.sampling.params.level') }), 'value') }}</td>
                <td>最大允许值</td>
                <td>{{ cloneE.sampling.params.fatal_defect }}</td>
                <td>{{ cloneE.sampling.params.serious_defect }}</td>
                <td>{{ cloneE.sampling.params.minor_defect }}</td>
              </tr>
              <tr>
                <td>实际值</td>
                <td>{{ cloneE.real_fatal_defect }}</td>
                <td>{{ cloneE.real_serious_defect }}</td>
                <td>{{ cloneE.real_minor_defect }}</td>
              </tr>
              <tr>
                <td>结论</td>
                <td colspan="3">致命缺陷</td>
              </tr>
            </tbody>
          </table>
        </el-form-item>
        <el-form-item label-width="0" style="margin: 0 0 24px 0;">
          <table cellspacing="0" cellpadding="0" border="0" class="tc-table" style="width: 100%">
            <tbody>
              <tr>
                <td style="width: 270px;" class="background-gray">数量符合性</td>
                <td v-if="cloneA.conclusion==1" style="width: 270px;">符合</td>
                <td v-if="cloneA.conclusion==2" style="width: 270px;">不符合</td>
                <td v-if="cloneA.conclusion==3" style="width: 270px;">待定</td>
                <td v-if="cloneA.conclusion==4" style="width: 270px;">不适用</td>
                <td v-if="cloneA.conclusion==1">无</td>
                <td v-if="[2,3].includes(cloneA.conclusion)"> <el-input type="text" class="tdInput" v-model="data.conclusion.quantityCompliance" placeholder="请输入"></el-input> </td>
              </tr>
              <tr>
                <td class="background-gray">包装/标识/标签</td>
                <td v-if="ClonebStatu == 1">不符合</td>
                <td v-if="ClonebStatu == 2">待定</td>
                <td v-if="ClonebStatu == 3">符合</td>
                <td v-if="ClonebStatu == 3">无</td>
                <td v-if="[1,2].includes(ClonebStatu)"><el-input type="text" class="tdInput" v-model="data.conclusion.packing" placeholder="请输入"></el-input> </td>
              </tr>
              <tr>
                
                <td class="background-gray">产品符合性</td>
                <td v-if="CloneCStatu == 1">不符合</td>
                <td v-if="CloneCStatu == 2">待定</td>
                <td v-if="CloneCStatu == 3">符合</td>
                <td v-if="CloneCStatu == 3">无</td>
                <td v-if="[1,2].includes(CloneCStatu)"><el-input type="text" class="tdInput" v-model="data.conclusion.product" placeholder="请输入"></el-input> </td>
              </tr>
              <tr>
                <!-- {{cloneD}} -->
                <td class="background-gray">数据测量/现场测试</td>
                <td v-if="CloneDStatu == 1">不符合</td>
                <td v-if="CloneDStatu == 2">待定</td>
                <td v-if="CloneDStatu == 3">符合</td>
                <td v-if="CloneDStatu == 3">无</td>
                <td v-if="[1,2].includes(CloneDStatu)"><el-input type="text" class="tdInput" v-model="data.conclusion.measure" placeholder="请输入"></el-input> </td>
              </tr>
              <tr>
                <td class="background-gray">特别注意点</td>
                <td v-if="CloneFStatu == 1">不符合</td>
                <td v-if="CloneFStatu == 2">待定</td>
                <td v-if="CloneFStatu == 3">符合</td>
                <td v-if="CloneFStatu == 3">无</td>
                <td v-if="[1,2].includes(CloneFStatu)"><el-input type="text" class="tdInput" v-model="data.conclusion.keyPoint" placeholder="请输入"></el-input> </td>
              </tr>
            </tbody>
          </table>
        </el-form-item>
        <div class="tc-report-card-content-title">备注</div>
        <el-form-item label-width="0" style="margin: 0 0 24px 0;">
          <el-table
            :data="data.remarks"
            border
            class="tc-writable-table"
            style="width: 100%">
            <el-table-column label="#" align="center" width="100">
              <template slot-scope="scope">
                {{ scope.$index + 1 }}
              </template>
            </el-table-column>
            <el-table-column label="备注" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.remark" placeholder="请输入"/>
              </template>
            </el-table-column>
            <el-table-column align="center" width="50">
              <template slot-scope="scope">
                <el-button size="mini" type="success" icon="el-icon-minus" @click="handleRemoveRemark(scope.$index)" circle/>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label-width="0" style="margin: 0 0 24px 0;">
          <el-button type="success" icon="el-icon-plus" @click="handleAddRemark">添加</el-button>
          <el-button type="success" @click="handleAddNofit">导入不符合备注</el-button>
          <el-button type="success" @click="handleAddPending">导入待定备注</el-button>
        </el-form-item>

        <el-form-item label-width="0" style="text-align: center;">
          <el-button class="tc-report-button" @click="handleComfirm">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import UploadImage from '@/views/report/components/UploadImage'

const defaultData = {
  general_conclusion: '',
  remarks: [],
  conclusion :{}
}
const defaultRemark = {
  remark: ''
}

export default {
  name: 'ReportPartI',
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
      data: this._.cloneDeep(defaultData),
      cloneA: '',
      cloneB: '',
      cloneC:'',
      cloneD:'',
      cloneE: {
        sampling:{
          params:{}
        },
        
      },
      cloneF:'',
      ClonebStatu:'',
      CloneCStatu:'',
      CloneDStatu:'',
      CloneFStatu:'',
      partIShow: true
    }
  },
  created(){
    
  },
  methods: {
    setData(data, Deepclone) {
      if (data) {
        console.log(data)
        this.data = this._.cloneDeep(data)
        if (!this._.has(this.data, 'conclusion')) {
          this.data.conclusion = {}

        }
        // this.data = this.data.hasOwnProperty("conclusion") ? this.data : this.$set(this.data,'conclusion',{}) 
        // console.log(this.data)
        
        
        console.log('xxx') 
      } else {
        const _data = this._.cloneDeep(defaultData)
        this.data = _data
      }
      this.cloneE = Deepclone.review.visual_and_workmanship
      this.cloneA = Deepclone.review.quantity_conformity
      this.cloneB = Deepclone.review.packing_and_marking
      this.cloneC = Deepclone.review.product_conformity
      this.cloneD = Deepclone.review.data_measurement
      this.cloneF = Deepclone.review.special_attention
      this.loading = false
      this.jundgeB(this.cloneB.packing.products,this.cloneB.marking.products)
      this.jundgeC(this.cloneC.products)
      this.jundgeD(this.cloneD.checkitems)
      this.jundgeF(this.cloneF.products)
    },

    handleAddRemark() {
      this.data.remarks.push(this._.cloneDeep(defaultRemark))
    },
    handleRemoveRemark(index) {
      this.data.remarks.splice(index, 1)
    },
    // 导入不符合项
    handleAddNofit(){
      let NofitClone
      let NofitCloneA  
      if(this.cloneA.conclusion == 2){
        NofitCloneA = this.cloneA.remark_content
      }
      let NofitCloneB 
      let NofitCloneBpacking 
      let NofitCloneBmarking
      NofitCloneBpacking = this.cloneB.packing.products.filter(t=>t.conclusion == 2) ? this.cloneB.packing.products.filter(t=>t.conclusion == 2).map((item)=>{
        return item.remark_content
      }) : ''
      NofitCloneBmarking = this.cloneB.marking.products.filter(t=>t.conclusion == 2) ? this.cloneB.marking.products.filter(t=>t.conclusion == 2).map((item)=>{
        return item.remark_content
      }) : ''
      NofitCloneB = [...NofitCloneBpacking,...NofitCloneBmarking]
      let NofitCloneC
      NofitCloneC = this.cloneC.products.filter(t=>t.conclusion == 2) ? this.cloneC.products.filter(t=>t.conclusion == 2).map((item) =>{
        return item.remark_content
      }) : ''
      let NofitCloneD
      NofitCloneD = _.filter(this.cloneD.checkitems, item => {
            return [2,3].includes(item.conclusion) 
          }).length ? this.cloneD.remark_content :''
      let NofitCloneE    
      NofitCloneE = ((this.cloneE.real_fatal_defect>this.cloneE.sampling.params.fatal_defect) || (this.cloneE.real_serious_defect>this.cloneE.sampling.params.serious_defect) || (this.cloneE.real_minor_defect>this.cloneE.sampling.params.minor_defect)) ? this.cloneE.remark_content:''
      let NofitCloneF
      NofitCloneF = this.cloneF.products.filter(t=>t.conclusion == 2) ? this.cloneF.products.filter(t=>t.conclusion == 2).map((item) =>{
        return item.remark_content
      }) : '' 
      NofitClone = [NofitCloneA,...NofitCloneB,...NofitCloneC,NofitCloneD,NofitCloneE,...NofitCloneF].filter(item => item).map((item)=>{
        return {
          remark:item
        }
      })
      this.data.remarks.push(...NofitClone)
    },
    // 导入待定项
    handleAddPending(){
      let PendingClone
      let PendingCloneA  
      if(this.cloneA.conclusion == 3){
        PendingCloneA = this.cloneA.remark_content
      }
      let PendingCloneB 
      let PendingCloneBpacking 
      let PendingCloneBmarking
      PendingCloneBpacking = this.cloneB.packing.products.filter(t=>t.conclusion == 3) ? this.cloneB.packing.products.filter(t=>t.conclusion == 3).map((item)=>{
        return item.remark_content
      }) : ''
      PendingCloneBmarking = this.cloneB.marking.products.filter(t=>t.conclusion == 3) ? this.cloneB.marking.products.filter(t=>t.conclusion == 3).map((item)=>{
        return item.remark_content
      }) : ''
      PendingCloneB = [...PendingCloneBpacking,...PendingCloneBmarking]
      let PendingCloneC
      PendingCloneC = this.cloneC.products.filter(t=>t.conclusion == 3) ? this.cloneC.products.filter(t=>t.conclusion == 3).map((item) =>{
        return item.remark_content
      }) : ''
      let PendingCloneD
      PendingCloneD = _.filter(this.cloneD.checkitems, item => {
            return [2,3].includes(item.conclusion) 
          }).length ? this.cloneD.remark_content :''
      let PendingCloneE    
      PendingCloneE = ((this.cloneE.real_fatal_defect>this.cloneE.sampling.params.fatal_defect) || (this.cloneE.real_serious_defect>this.cloneE.sampling.params.serious_defect) || (this.cloneE.real_minor_defect>this.cloneE.sampling.params.minor_defect)) ? this.cloneE.remark_content:''
      let PendingCloneF
      PendingCloneF = this.cloneF.products.filter(t=>t.conclusion == 3) ? this.cloneF.products.filter(t=>t.conclusion == 3).map((item) =>{
        return item.remark_content
      }) : '' 
      PendingClone = [PendingCloneA,...PendingCloneB,...PendingCloneC,PendingCloneD,PendingCloneE,...PendingCloneF].filter(item => item).map((item)=>{
        return {
          remark:item
        }
      })
      this.data.remarks.push(...PendingClone)
    },
    // 判断partB结论
    jundgeB(Array1,Array2){
      let Array = [...Array1,...Array2]
      if(Array.findIndex(t=>t.conclusion==2)!=-1){
        this.ClonebStatu = 1
        return false
      }else if(Array.findIndex(t=>t.conclusion==3)!=-1){
        this.ClonebStatu = 2
        return false
      }else{
        this.ClonebStatu = 3
        return  false
      }
    },
    // 判断partC结论
    jundgeC(Array){
      console.log(Array)
      if(Array.findIndex(t=>t.conclusion==2)!=-1){
        this.CloneCStatu = 1
        return false
      }else if(Array.findIndex(t=>t.conclusion==3)!=-1){
        this.CloneCStatu = 2
        return false
      }else{
        this.CloneCStatu = 3
        return  false
      }
    },
    // 判断partD结论
    jundgeD(Array){
      if(Array.findIndex(t=>t.conclusion==2)!=-1){
        this.CloneDStatu = 1
        return false
      }else if(Array.findIndex(t=>t.conclusion==3)!=-1){
        this.CloneDStatu = 2
        return false
      }else{
        this.CloneDStatu = 3
        return  false
      }
    },
    // 判断partF结论
    jundgeF(Array){
      if(Array.findIndex(t=>t.conclusion==2)!=-1){
        this.CloneFStatu = 1
        return false
      }else if(Array.findIndex(t=>t.conclusion==3)!=-1){
        this.CloneFStatu = 2
        return false
      }else{
        this.CloneFStatu = 3
        return  false
      }
    },

    // 提交
    handleComfirm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$emit('save', this.data, 'inspection_results')
        }
      })
    }
  }
}
</script>
