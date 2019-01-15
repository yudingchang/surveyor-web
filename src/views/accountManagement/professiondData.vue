<template>
  <div class="professiondData">
    <el-row>
      <!-- 个人认证 -->
      <el-col :span="24" class="personalAuthentication normalbox">
        <div :class="{titleChange:!personalCertificateFormShow}" class="normalTitle">
          <span class="left">
            <span>*</span>个人认证
          </span>
          <span class="right" @click="spread()">
            {{ text }}
            <i :class="{rotaga:!personalCertificateFormShow}" class="el-icon-caret-top"/>
          </span>
        </div>
        <div v-show="personalCertificateFormShow">
          <!-- 个人认证编辑 -->
          <el-form
            v-show="is_edit_certificate"
            ref="personalCertificateForm"
            :model="personalCertificateForm"
            :rules="personalCertificateRules"
            :inline="true"
            class="personalCertificateForm"
          >
            <el-form-item label="姓" prop="last_name" label-width="100px">
              <el-input
                v-model="personalCertificateForm.last_name"
                placeholder="请输入姓"
                class="normalInput"
                style="width:180px;"
              />
            </el-form-item>
            <el-form-item label="名" prop="first_name" label-width="50px">
              <el-input
                v-model="personalCertificateForm.first_name"
                placeholder="请输入名"
                class="normalInput"
                style="width:180px;"
              />
            </el-form-item>
            <br>
            <el-form-item label="性别" prop="sex" label-width="100px">
              <el-radio-group v-model="personalCertificateForm.sex">
                <el-radio :label="1">男</el-radio>
                <el-radio :label="2">女</el-radio>
              </el-radio-group>
            </el-form-item>
            <br>
            <el-form-item label="出生日期" prop="birthday" label-width="100px">
              <el-date-picker
                v-model="personalCertificateForm.birthday"
                type="date"
                format="yyyy 年 MM 月 dd 日"
                placeholder="选择日期"
                class="normalInput"
              />
            </el-form-item>
            <br>
            <el-form-item label="常驻地" label-width="100px">
              <tc-target ref="target" :target="supplier"/>
              <!-- <el-date-picker
                v-model="personalCertificateForm.birthday"
                type="date"
                placeholder="选择日期">
              </el-date-picker>-->
            </el-form-item>
            <br>
            <el-form-item label="详细地址" prop="address" label-width="100px">
              <el-input v-model="personalCertificateForm.address" type="textarea" class="normalInput"/>
            </el-form-item>
            <br>
            <el-form-item label="证件类型" prop="certificate_type" label-width="100px">
              <el-select
                v-model="personalCertificateForm.certificate_type"
                placeholder="请选择"
                class="normalInput"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <br>
            <el-form-item label="证件号" prop="identification_number" label-width="100px">
              <el-input
                v-model="personalCertificateForm.identification_number"
                class="normalInput"
                placeholder="请输入证件号"
              />
            </el-form-item>
            <br>
            <el-form-item label="证件照" prop="name" label-width="100px">
              <el-upload
                :action="uploadUrl"
                :headers="uploadHeaders"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
                class="avatar-uploader"
              >
                <img v-if="imageUrl" :src="imageUrl" class="avatar">
                <div v-else class="avatar-uploader-icon">
                  <i class="iconfont icon-IconCopy1"/>
                  <p>身份证正面照片</p>
                </div>
              </el-upload>
              <el-upload
                :action="uploadUrl"
                :headers="uploadHeaders2"
                :show-file-list="false"
                :on-success="handleAvatarSuccess2"
                :before-upload="beforeAvatarUpload2"
                class="avatar-uploader"
              >
                <img v-if="imageUrl2" :src="imageUrl2" class="avatar">
                <div v-else class="avatar-uploader-icon">
                  <i class="iconfont icon-IconCopy1"/>
                  <p>身份证反面照片</p>
                </div>
              </el-upload>
              <el-upload
                :action="uploadUrl"
                :headers="uploadHeaders3"
                :show-file-list="false"
                :on-success="handleAvatarSuccess3"
                :before-upload="beforeAvatarUpload3"
                class="avatar-uploader"
              >
                <img v-if="imageUrl3" :src="imageUrl3" class="avatar">
                <div v-else class="avatar-uploader-icon">
                  <i class="iconfont icon-IconCopy1"/>
                  <p>手持身份证正面照片</p>
                </div>
              </el-upload>
            </el-form-item>
            <br>
            <el-button class="btn" @click="savaPersonalCertificate()">保存</el-button>
          </el-form>
          <!-- 个人认证只读 -->
          <el-form
            v-show="!is_edit_certificate"
            ref="personalCertificateForm"
            :model="personalCertificateForm"
            class="personalCertificateForm"
          >
            <el-form-item label="姓名" prop="last_name" label-width="100px">
              <span>{{ personalCertificateForm.last_name + personalCertificateForm.first_name }}</span>
            </el-form-item>
            <el-form-item label="性别" prop="sex" label-width="100px">
              <span v-if="personalCertificateForm.sex == 1">男</span>
              <span v-if="personalCertificateForm.sex == 2">女</span>
            </el-form-item>
            <el-form-item label="出生日期" prop="birthday" label-width="100px">
              <span>{{ personalCertificateForm.birthday }}</span>
            </el-form-item>
            <el-form-item label="常驻地" label-width="100px">
              <span>{{ personalCertificateForm.country_name + personalCertificateForm.location_str }}</span>
              <!-- <tc-target ref="target" :target="supplier"/> -->
              <!-- <el-date-picker
                v-model="personalCertificateForm.birthday"
                type="date"
                placeholder="选择日期">
              </el-date-picker>-->
            </el-form-item>
            <el-form-item label="详细地址" prop="address" label-width="100px">
              <span>{{ personalCertificateForm.address }}</span>
            </el-form-item>
            <el-form-item label="证件类型" prop="certificate_type" label-width="100px">
              <span v-if="personalCertificateForm.certificate_type == 1">身份证</span>
            </el-form-item>
            <el-form-item label="证件号" prop="identification_number" label-width="100px">
              <span>{{ personalCertificateForm.identification_number }}</span>
            </el-form-item>
            <el-form-item label="证件照" prop="name" label-width="100px" class="showImg">
              <img v-if="imageUrl" :src="imageUrl" >
              <img v-if="imageUrl2" :src="imageUrl2">
              <img v-if="imageUrl3" :src="imageUrl3">
            </el-form-item>
            <el-button style="position:absolute;right:40px;top:0;" type="success" icon="el-icon-edit-outline" @click="is_edit_certificate = !is_edit_certificate">修改</el-button>
          </el-form>
        </div>
      </el-col>
      <!-- 验货信息 -->
      <el-col :span="24" class="examineGoods normalbox">
        <div :class="{titleChange:!examineGoodsFormShow}" class="normalTitle">
          <span class="left">
            <span>*</span>验货信息
          </span>
          <span class="right" @click="examineGoodsSpread()">
            {{ examineGoodstext }}
            <i
              :class="{rotaga:!examineGoodsFormShow}"
              class="el-icon-caret-top"
            />
          </span>
        </div>
        <div v-show="examineGoodsFormShow">
          <!-- 验货信息编辑 -->
          <el-form
            v-show="is_edit_serve"
            ref="examineGoodsForm"
            :model="examineGoodsForm"
            :rules="examineGoodsFormRules"
            :inline="true"
            class="personalCertificateForm"
          >
            <el-form-item label="验货期望地" prop="locations" label-width="100px">
              <ele-multi-cascader
                :options="optionList"
                v-model="examineGoodsForm.locations"
                style="width:428px;"
                placeholder="选择运营商"
                @change="ispChange"
              />
            </el-form-item>
            <br>
            <el-form-item label="报告语言" prop="report_languages" label-width="100px">
              <el-checkbox-group v-model="examineGoodsForm.report_languages">
                <el-checkbox
                  v-for="(item,index) in reportLanguagesList"
                  :label="item.val"
                  :key="index"
                >{{ item.label }}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <br>
            <el-button class="btn" @click="savaExamineGoods()">保存</el-button>
          </el-form>
          <!-- 验货信息只读 -->
          <el-form
            v-show="!is_edit_serve"
            ref="examineGoodsForm"
            :model="examineGoodsForm"
            class="personalCertificateForm"
          >
            <el-form-item label="验货期望地" prop="locations_arr" label-width="100px">
              <span class="tc-separate">
                <span v-for="(item,index) in examineGoodsForm.locations_arr" :key="index">{{ item.chinese_name }}</span>
              </span>
            </el-form-item>
            <el-form-item label="报告语言" prop="report_languages" label-width="100px">
              <span>{{ arrayLanguages(examineGoodsForm.report_languages) }}</span>
            </el-form-item>
            <el-button style="position:absolute;right:40px;top:0;" type="success" icon="el-icon-edit-outline" @click="is_edit_serve=!is_edit_serve">修改</el-button>
          </el-form>
        </div>

      </el-col>
      <!-- 工作经验 -->
      <el-col :span="24" class="experience normalbox">
        <div :class="{titleChange:!experienceFormShow}" class="normalTitle">
          <span class="left">
            <span>*</span>工作经验
          </span>
          <span class="right" @click="experienceSpread()">
            {{ experiencetext }}
            <i :class="{rotaga:!experienceFormShow}" class="el-icon-caret-top"/>
          </span>
        </div>
        <div v-show="experienceFormShow">
          <!-- 工作经验编辑 -->
          <div v-show="is_edit_work">
            <el-form ref="experienceForm" :model="experienceForm" class="personalCertificateForm">
              <div v-for="(item,index) in experienceForm.experienceFormArray" :key="index">
                <el-form-item
                  :prop="'experienceFormArray.' + index + '.company'"
                  :rules="experienceFormRules.company"
                  label="公司名称"
                  label-width="100px"
                >
                  <el-input v-model="item.company" class="normalInput" placeholder="请输入公司名称"/>
                  <div
                    v-if="index>=1"
                    class="remove"
                    @click="()=>{experienceForm.experienceFormArray.splice(index, 1)}"
                  >
                    <i class="iconfont icon-shanchu_"/>
                    <p>删除</p>
                  </div>
                </el-form-item>
                <el-form-item
                  :prop="'experienceFormArray.' + index + '.start_end_date'"
                  :rules="experienceFormRules.start_end_date"
                  label="起止时间"
                  label-width="100px"
                >
                  <el-date-picker
                    v-model="item.start_end_date"
                    class="normalInput"
                    type="daterange"
                    format="yyyy 年 MM 月 dd 日"
                    value-format="yyyy-MM-dd"
                    range-separator="-"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
                <el-form-item
                  :prop="'experienceFormArray.' + index + '.is_third_party_work'"
                  :rules="experienceFormRules.is_third_party_work"
                  label="是否有第三方工作经验"
                  label-width="170px"
                >
                  <el-radio-group v-model="item.is_third_party_work">
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="2">否</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item
                  :prop="'experienceFormArray.' + index + '.position'"
                  :rules="experienceFormRules.position"
                  label="职位"
                  label-width="100px"
                >
                  <el-input v-model="item.position" class="normalInput" placeholder="请输入职位"/>
                </el-form-item>
                <el-form-item
                  :prop="'experienceFormArray.' + index + '.work_description'"
                  :rules="experienceFormRules.work_description"
                  label="工作描述"
                  label-width="100px"
                >
                  <el-input
                    v-model="item.work_description"
                    type="textarea"
                    class="normalInput"
                    placeholder="500字以内"
                  />
                </el-form-item>
                <el-form-item
                  :prop="'experienceFormArray.' + index + '.company_nature'"
                  :rules="experienceFormRules.company_nature"
                  label="公司性质"
                  label-width="100px"
                >
                  <el-select v-model="item.company_nature" placeholder="请选择" class="normalInput">
                    <el-option
                      v-for="item in inspectorCompanyNatureArr"
                      :key="item.id"
                      :label="item.label"
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item
                  :prop="'experienceFormArray.' + index + '.company_scale'"
                  :rules="experienceFormRules.company_scale"
                  label="公司规模"
                  label-width="100px"
                >
                  <el-select v-model="item.company_scale" placeholder="请选择" class="normalInput">
                    <el-option
                      v-for="item in inspectorCompanyScaleArr"
                      :key="item.id"
                      :label="item.label"
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item
                  :prop="'experienceFormArray.' + index + '.is_full_time'"
                  :rules="experienceFormRules.is_full_time"
                  label="是否全职"
                  label-width="100px"
                >
                  <el-radio-group v-model="item.is_full_time">
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="2">否</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-input v-show="false" v-model="item.inspector_id"/>
                <el-input v-show="false" v-model="item.user_id"/>
              </div>
            </el-form>
            <el-button
              icon="el-icon-plus"
              type="success"
              style="margin-left:100px;"
              @click="addExperience()"
            >添加工作经验</el-button>
            <el-button class="btn" @click="saveExperience()">保存</el-button>
          </div>
          <!-- 工作经验只读 -->
          <div v-show="!is_edit_work">
            <el-form  :model="experienceForm" class="personalCertificateForm" label-width="200px">
              <div v-for="(item,index) in experienceForm.experienceFormArray" :key="index" style="margin-bottom:50px;" >
                <el-form-item
                  :prop="'experienceFormArray.' + index + '.company'"
                  label="公司名称"
                >
                  <span>{{ item.company }}</span>
                </el-form-item>
                <el-form-item
                  :prop="'experienceFormArray.' + index + '.start_end_date'"
                  label="起止时间"
                >
                  <span>{{ item.start_at | moment("YYYY.MM") }} - {{ item.end_at | moment("YYYY.MM") }} </span>
                </el-form-item>
                <el-form-item
                  :prop="'experienceFormArray.' + index + '.is_third_party_work'"
                  label="是否有第三方工作经验"
                >
                  <span v-if="item.is_third_party_work == 1">是</span>
                  <span v-if="item.is_third_party_work == 2">否</span>
                </el-form-item>
                <el-form-item
                  :prop="'experienceFormArray.' + index + '.position'"
                  label="职位"
                >
                  <span>{{ item.position }}</span>
                </el-form-item>
                <el-form-item
                  :prop="'experienceFormArray.' + index + '.work_description'"
                  label="工作描述"
                >
                  <span>{{ item.work_description }}</span>
                </el-form-item>
                <el-form-item
                  :prop="'experienceFormArray.' + index + '.company_nature'"
                  label="公司性质"
                >
                  <span>{{ jsonGetName(inspectorCompanyNatureArr,item.company_nature) }}</span>
                </el-form-item>
                <el-form-item
                  :prop="'experienceFormArray.' + index + '.company_scale'"
                  label="公司规模"
                >
                  <span>{{ jsonGetName(inspectorCompanyScaleArr,item.company_scale) }}</span>
                </el-form-item>
                <el-form-item
                  :prop="'experienceFormArray.' + index + '.is_full_time'"
                  label="是否全职"
                >
                  <span v-if="item.is_full_time == 1">是</span>
                  <span v-if="item.is_full_time == 2">否</span>
                </el-form-item>
              </div>
              <el-button style="position:absolute;right:40px;top:0;" type="success" icon="el-icon-edit-outline" @click="is_edit_work=!is_edit_work">修改</el-button>
            </el-form>
          </div>
        </div>

      </el-col>
      <!-- 教育经历 -->
      <el-col :span="24" class="educationExperience normalbox">
        <div :class="{titleChange:!educationFormShow}" class="normalTitle">
          <span class="left">
            <span>*</span>教育经历
          </span>
          <span class="right" @click="educationSpread()">
            {{ educationtext }}
            <i :class="{rotaga:!educationFormShow}" class="el-icon-caret-top"/>
          </span>
        </div>
        <div v-show="educationFormShow">
          <!-- 教育经历编辑 -->
          <div v-show="is_edit_education">
            <el-form ref="educationForm" :model="educationForm" class="personalCertificateForm">
              <div v-for="(item,index) in educationForm.educationFormArray" :key="index">
                <el-form-item
                  :prop="'educationFormArray.' + index + '.start_end_date'"
                  :rules="educationFormRules.start_end_date"
                  label="起止时间"
                  label-width="100px"
                >
                  <el-date-picker
                    v-model="item.start_end_date"
                    class="normalInput"
                    type="daterange"
                    format="yyyy 年 MM 月 dd 日"
                    range-separator="-"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                  <div
                    v-if="index>=1"
                    class="remove"
                    @click="()=>{educationForm.educationFormArray.splice(index, 1)}"
                  >
                    <i class="iconfont icon-shanchu_"/>
                    <p>删除</p>
                  </div>
                </el-form-item>
                <el-form-item
                  :prop="'educationFormArray.' + index + '.college'"
                  :rules="educationFormRules.college"
                  label="毕业学校"
                  label-width="100px"
                >
                  <el-input v-model="item.college" class="normalInput" placeholder="请输入毕业学校"/>
                </el-form-item>
                <el-form-item
                  :prop="'educationFormArray.' + index + '.major'"
                  :rules="educationFormRules.major"
                  label="专业"
                  label-width="100px"
                >
                  <el-input v-model="item.major" class="normalInput" placeholder="请输入专业"/>
                </el-form-item>
                <el-form-item
                  :prop="'educationFormArray.' + index + '.education'"
                  :rules="educationFormRules.education"
                  label="学历"
                  label-width="100px"
                >
                  <el-select v-model="item.education" placeholder="请输入学历" class="normalInput">
                    <el-option
                      v-for="item in inspectorEducationArr"
                      :key="item.id"
                      :label="item.label"
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item
                  :prop="'educationFormArray.' + index + '.is_full_time'"
                  :rules="educationFormRules.is_full_time"
                  label="是否全日制"
                  label-width="100px"
                >
                  <el-radio-group v-model="item.is_full_time">
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="2">否</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-input v-show="false" v-model="item.inspector_id"/>
                <el-input v-show="false" v-model="item.user_id"/>
              </div>

            </el-form>

            <el-button
              icon="el-icon-plus"
              type="success"
              style="margin-left:100px;"
              @click="addEducation()"
            >添加教育经验</el-button>
            <el-button class="btn" @click="saveEducationForm()">保存</el-button>
          </div>
          <!-- 教育经历只读 -->
          <div v-show="!is_edit_education">
            <el-form :model="educationForm" class="personalCertificateForm" label-width="100px">
              <div v-for="(item,index) in educationForm.educationFormArray" :key="index" style="margin-bottom:50px">
                <el-form-item
                  :prop="'educationFormArray.' + index + '.start_end_date'"
                  label="起止时间"
                >
                  <span>{{ item.start_at | moment("YYYY.MM") }} - {{ item.end_at | moment("YYYY.MM") }}</span>
                </el-form-item>
                <el-form-item
                  :prop="'educationFormArray.' + index + '.college'"
                  label="毕业学校"

                >
                  <span>{{ item.college }}</span>
                </el-form-item>
                <el-form-item
                  :prop="'educationFormArray.' + index + '.major'"
                  label="专业"

                >
                  <span>{{ item.major }}</span>
                </el-form-item>
                <el-form-item
                  :prop="'educationFormArray.' + index + '.education'"
                  label="学历"

                >
                  <span>{{ jsonGetName(inspectorEducationArr,item.education) }}</span>
                </el-form-item>
                <el-form-item
                  :prop="'educationFormArray.' + index + '.is_full_time'"
                  label="是否全日制"

                >
                  <span v-if="item.is_full_time == 1">是</span>
                  <span v-else>否</span>
                </el-form-item>
              </div>
              <el-button style="position:absolute;right:40px;top:0;" type="success" icon="el-icon-edit-outline" @click="is_edit_education=!is_edit_education">修改</el-button>
            </el-form>
          </div>
        </div>

      </el-col>
      <!-- 技术能力 -->
      <el-col :span="24" class="technicalCompetence normalbox">
        <div :class="{titleChange:!technicalCompetenceFormShow}" class="normalTitle">
          <span class="left">
            <span>*</span>技术能力
          </span>
          <span class="right" @click="technicalCompetencespread()">
            {{ technicalCompetencetext }}
            <i
              :class="{rotaga:!technicalCompetenceFormShow}"
              class="el-icon-caret-top"
            />
          </span>
        </div>
        <div v-show="technicalCompetenceFormShow">
          <!-- 技术能力编辑 -->
          <el-form
            v-show="is_edit_technical"
            ref="technicalCompetenceRules"
            :model="technicalCompetenceForm"
            class="personalCertificateForm"
          >
            <div
              v-for="(item,index) in technicalCompetenceForm.technicalCompetenceFormArray"
              :key="index"
            >
              <el-form-item
                :prop="'technicalCompetenceFormArray.' + index + '.level_attained'"
                :rules="technicalCompetenceRules.level_attained"
                label="英语水平"
                label-width="100px"
              >
                <el-select v-model="item.level_attained" placeholder="请选择" class="normalInput">
                  <el-option
                    v-for="item in optionSelet"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="英语相关证书" prop="en_images" label-width="100px">
                <el-upload
                  :action="uploadUrl"
                  :headers="uploadHeaders"
                  :file-list="item.en_images"
                  :on-remove="handleRemove.bind(this,index)"
                  :on-success="handleSuccess.bind(this,index)"
                  list-type="picture-card"
                >
                  <div class="bgContent">
                    <i class="iconfont icon-IconCopy1"/>
                    <p class="text">上传证书</p>
                  </div>
                  <!-- <i class="el-icon-plus"></i> -->
                </el-upload>
                <el-dialog :visible.sync="dialogVisible">
                  <!-- :src="dialogImageUrl" -->
                  <img width="100%" alt>
                </el-dialog>
                <p class="tip2">图片大小≤10M，格式jpg/png</p>
              </el-form-item>
              <el-form-item label="验货相关证书" prop="certificate_images" label-width="100px">
                <el-upload
                  :action="uploadUrl"
                  :headers="uploadHeaders"
                  :file-list="item.certificate_images"
                  :on-remove="handleRemoveCertificate.bind(this,index)"
                  :on-success="handleSuccessCertificate.bind(this,index)"
                  list-type="picture-card"
                >
                  <div class="bgContent">
                    <i class="iconfont icon-IconCopy1"/>
                    <p class="text">上传证书</p>
                  </div>
                  <!-- <i class="el-icon-plus"></i> -->
                </el-upload>
                <el-dialog :visible.sync="dialogVisible">
                  <img width="100%" alt>
                </el-dialog>
                <p class="tip2">图片大小≤10M，格式jpg/png</p>
              </el-form-item>
              <el-button class="btn" @click="savetechnicalCompetenceForm()">保存</el-button>
            </div>
          </el-form>
          <!-- 技术能力只读 -->
          <el-form
            v-show="!is_edit_technical"
            ref="technicalCompetenceRules"
            :model="technicalCompetenceForm"
            class="personalCertificateForm"
          >
            <div
              v-for="(item,index) in technicalCompetenceForm.technicalCompetenceFormArray"
              :key="index"
            >
              <el-form-item
                :prop="'technicalCompetenceFormArray.' + index + '.level_attained'"
                label="英语水平"

                label-width="100px"
              >
                <span v-if="item.level_attained == 1">一般</span>
                <span v-if="item.level_attained == 2">良好</span>
                <span v-if="item.level_attained == 3">熟练</span>
                <span v-if="item.level_attained == 4">精通</span>
              </el-form-item>
              <el-form-item label="英语相关证书" prop="en_images" label-width="100px" class="showImg">
                <img v-for="(item,index) in item.en_images" :src="item.url" :key="index" alt="">
                <!-- <span>{{item.en_images}}</span> -->
              </el-form-item>
              <el-form-item label="验货相关证书" prop="certificate_images" label-width="100px" class="showImg">
                <img v-for="(item,index) in item.certificate_images" :src="item.url" :key="index" alt="">
              </el-form-item>
            </div>
            <el-button style="position:absolute;right:40px;top:0;" type="success" icon="el-icon-edit-outline" @click="is_edit_technical = !is_edit_technical">修改</el-button>
          </el-form>
        </div>
      </el-col>
      <!-- 行业线 -->
      <el-col :span="24" class="sectorLine normalbox">
        <div :class="{titleChange:!sectorLineFormShow}" class="normalTitle">
          <span class="left">
            <span>*</span>行业线
          </span>
          <span class="right" @click="sectorLinespread()">
            {{ sectorLinetext }}
            <i :class="{rotaga:!sectorLineFormShow}" class="el-icon-caret-top"/>
          </span>
        </div>
        <div v-show="sectorLineFormShow">
          <!-- 行业线编辑 -->
          <div v-show="is_edit_industry">
            <div class="sectorLineBox">
              <div class="tabs-top">
                <ul class="tabs">
                  <li
                    v-for="(item,index) in tablist"
                    :class="{active:item.isBool}"
                    :key="index"
                    @click="tab(item,index)"
                  >{{ item.content }}</li>
                </ul>
              </div>
              <el-form :model="multiCascaderIndustrysForm.electronics">
                <el-tree
                  v-show="num == 0"
                  ref="electronics"
                  :data="multiCascaderIndustrys.electronics"
                  :default-checked-keys="multiCascaderIndustrysForm.electronics.category_ids"
                  :props="defaultProps"
                  show-checkbox
                  node-key="id"
                />
                <el-tree
                  v-show="num == 1"
                  ref="light_industry"
                  :data="multiCascaderIndustrys.light_industry"
                  :default-checked-keys="multiCascaderIndustrysForm.light_industry.category_ids"
                  :props="defaultProps"
                  show-checkbox
                  node-key="id"
                />
                <el-tree
                  v-show="num == 2"
                  ref="textile"
                  :data="multiCascaderIndustrys.textile"
                  :default-checked-keys="multiCascaderIndustrysForm.textile.category_ids"
                  :props="defaultProps"
                  show-checkbox
                  node-key="id"
                />
              </el-form>
            </div>
            <el-button class="btn" @click="savemultiCascaderIndustrysForm()">保存</el-button>
          </div>
          <!-- 行业线只读 -->
          <div v-show="!is_edit_industry">
            <el-form :model="multiCascaderIndustrysForm.electronics" class="personalCertificateForm" label-width="100px">
              <el-form-item label="电子电器" style="width:80%">
                <span class="tc-separate">
                  <span v-for="(item,index) in multiCascaderIndustrysForm.electronics.category_arr" :key="index">
                    {{ item.name }}
                  </span>
                </span>
              </el-form-item>
              <el-form-item label="轻工产品" style="width:80%">
                <span class="tc-separate">
                  <span v-for="(item,index) in multiCascaderIndustrysForm.light_industry.category_arr" :key="index">
                    {{ item.name }}
                  </span>
                </span>
              </el-form-item>
              <el-form-item label="纺织品" style="width:80%">
                <span class="tc-separate">
                  <span v-for="(item,index) in multiCascaderIndustrysForm.textile.category_arr" :key="index">
                    {{ item.name }}
                  </span>
                </span>
              </el-form-item>
              <el-button style="position:absolute;right:40px;top:0;" type="success" icon="el-icon-edit-outline" @click="is_edit_industry=!is_edit_industry">修改</el-button>
            </el-form>
          </div>
        </div>
      </el-col>
      <!-- 培训经历 -->
      <el-col :span="24" class="trainingExperience normalbox">
        <div :class="{titleChange:!trainingExperienceFormShow}" class="normalTitle">
          <span class="left">
            <span>*</span>培训经历
          </span>
          <span class="right" @click="trainingExperienceSpread()">
            {{ trainingExperiencetext }}
            <i
              :class="{rotaga:!trainingExperienceFormShow}"
              class="el-icon-caret-top"
            />
          </span>
        </div>
        <div v-show="trainingExperienceFormShow">
          <!-- 培训经历编辑 -->
          <div v-show="is_edit_training">
            <el-form
              ref="trainingExperienceForm"
              :model="trainingExperienceForm"
              class="personalCertificateForm"
            >
              <div
                v-for="(item,index) in trainingExperienceForm.trainingExperienceFormArray"
                :key="index"
              >
                <el-form-item
                  :prop="'trainingExperienceFormArray.' + index + '.start_end_date'"
                  :rules="trainingExperienceFormRules.start_end_date"
                  label="培训时间"
                  label-width="100px"
                >
                  <el-date-picker
                    v-model="item.start_end_date"
                    class="normalInput"
                    type="daterange"
                    format="yyyy 年 MM 月 dd 日"
                    range-separator="-"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                  <div
                    v-if="index>=1"
                    class="remove"
                    @click="()=>{trainingExperienceForm.trainingExperienceFormArray.splice(index, 1)}"
                  >
                    <i class="iconfont icon-shanchu_"/>
                    <p>删除</p>
                  </div>
                </el-form-item>
                <el-form-item
                  :prop="'trainingExperienceFormArray.' + index + '.training_institution'"
                  :rules="trainingExperienceFormRules.training_institution"
                  label="培训课程"
                  label-width="100px"
                >
                  <el-input
                    v-model="item.training_institution"
                    class="normalInput"
                    placeholder="请输入培训课程"
                  />
                </el-form-item>
                <el-form-item
                  :prop="'trainingExperienceFormArray.' + index + '.training_course'"
                  :rules="trainingExperienceFormRules.training_course"
                  label="培训机构"
                  label-width="100px"
                >
                  <el-input v-model="item.training_course" class="normalInput" placeholder="请输入培训机构"/>
                </el-form-item>
                <el-form-item
                  :prop="'trainingExperienceFormArray.' + index + '.address'"
                  :rules="trainingExperienceFormRules.address"
                  label="培训地点"
                  label-width="100px"
                >
                  <el-input v-model="item.address" class="normalInput" placeholder="请输入培训地点"/>
                </el-form-item>
                <el-form-item
                  :prop="'trainingExperienceFormArray.' + index + '.training_description'"
                  :rules="trainingExperienceFormRules.training_description"
                  label="培训描述"
                  label-width="100px"
                >
                  <el-input
                    v-model="item.training_description"
                    type="textarea"
                    class="normalInput"
                    placeholder="请输入培训描述"
                  />
                </el-form-item>
              </div>
            </el-form>
            <el-button
              icon="el-icon-plus"
              type="success"
              style="margin-left:100px;"
              @click="addTrainingExperience()"
            >添加培训经历</el-button>
            <el-button class="btn" @click="savetrainingExperienceForm()">保存</el-button>
          </div>
          <!-- 培训经历只读 -->
          <div v-show="!is_edit_training">
            <el-form
              :model="trainingExperienceForm"
              class="personalCertificateForm"
              label-width="100px"
            >
              <div
                v-for="(item,index) in trainingExperienceForm.trainingExperienceFormArray"
                :key="index"
                style="margin-bottom:50px;"
              >
                <el-form-item
                  :prop="'trainingExperienceFormArray.' + index + '.start_end_date'"
                  label="培训时间"
                >
                  <span>{{ item.start_at | moment("YYYY.MM") }} - {{ item.end_at | moment("YYYY.MM") }}</span>
                </el-form-item>
                <el-form-item
                  :prop="'trainingExperienceFormArray.' + index + '.training_institution'"
                  label="培训课程"

                >
                  <span>{{ item.training_institution }}</span>
                </el-form-item>
                <el-form-item
                  :prop="'trainingExperienceFormArray.' + index + '.training_course'"
                  label="培训机构"

                >
                  <span>{{ item.training_course }}</span>
                </el-form-item>
                <el-form-item
                  :prop="'trainingExperienceFormArray.' + index + '.address'"
                  label="培训地点"

                >
                  <span>{{ item.address }}</span>
                </el-form-item>
                <el-form-item
                  :prop="'trainingExperienceFormArray.' + index + '.training_description'"
                  label="培训描述"

                >
                  <span>{{ item.training_description }}</span>
                </el-form-item>
              </div>
              <el-button style="position:absolute;right:40px;top:0;" type="success" icon="el-icon-edit-outline" @click="is_edit_training=!is_edit_training">修改</el-button>
            </el-form>
          </div>
        </div>

      </el-col>
      <el-col :span="24" class="bottom">
        <el-button class="submitBtn" @click="submitBtn()">提交</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
const moment = require('moment')
import { grabSheet } from '@/api/dashboard'
import { getToken } from '@/utils/auth'
import { getPersonalAuthentication } from '@/api/professiondData'
import InspectionTarget from '@/components/InspectionTarget'
import store from '../../store/'
import {
  fetchList,
  fetchCounty,
  getConfigInfo,
  savaPersonalCertificate,
  savaExamineGoods,
  saveExperience,
  saveEducation,
  savetrainingExperience,
  saveTechnicalCompetence,
  savemultiCascaderIndustrys,
  saveAllMessage
} from '@/api/fetch'
export default {
  name: '',
  components: {
    // InspectionTarget
    'tc-target': InspectionTarget
  },
  data() {
    return {
      tableData: [],
      supplier: {
        //    location_ids:['247','4171','4190'],
        //    country_id:7
      },
      form: {
        isp: []
      },
      personalCertificateFormShow: false,
      text: '展开',
      examineGoodsFormShow: false,
      examineGoodstext: '展开',
      experienceFormShow: false,
      experiencetext: '展开',
      educationFormShow: false,
      educationtext: '展开',
      technicalCompetenceFormShow: false,
      technicalCompetencetext: '展开',
      sectorLineFormShow: false,
      sectorLinetext: '展开',
      trainingExperienceFormShow: false,
      trainingExperiencetext: '展开',

      educationForm: {
        educationFormArray: [
          {
            start_end_date: '',
            college: '',
            major: '',
            education: '',
            is_full_time: '',
            inspector_id: '',
            user_id: ''
          }
        ]
      },
      educationFormRules: {
        start_end_date: [
          { required: true, message: '请输入起止时间', trigger: 'change' }
        ],
        college: [
          { required: true, message: '请输入毕业学校', trigger: 'blur' }
        ],
        major: [{ required: true, message: '请输入专业', trigger: 'blur' }],
        education: [
          { required: true, message: '请选择学历', trigger: 'change' }
        ],
        is_full_time: [
          { required: true, message: '请选择是否全日制', trigger: 'change' }
        ]
      },
      trainingExperienceForm: {
        trainingExperienceFormArray: [
          {
            start_end_date: '',
            training_institution: '',
            training_course: '',
            address: '',
            training_description: ''
          }
        ]
      },
      trainingExperienceFormRules: {
        start_end_date: [
          { required: true, message: '请输入起止时间', trigger: 'change' }
        ],
        training_institution: [
          { required: true, message: '请输入培训课程', trigger: 'blur' }
        ],
        training_course: [
          { required: true, message: '请输入培训机构', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请输入培训地点', trigger: 'blur' }
        ],
        training_description: [
          { required: true, message: '请输入培训描述', trigger: 'blur' }
        ]
      },
      multiCascaderIndustrys: {},
      multiCascaderIndustrysForm: {
        electronics: {
          category_ids: [],
          category_arr: []
        },
        light_industry: {
          category_ids: [],
          category_arr: []
        },
        textile: {
          category_ids: [],
          category_arr: []
        }
      },
      //  个人认证表单
      personalCertificateForm: {},
      personalCertificateRules: {
        last_name: [{ required: true, message: '请输入姓', trigger: 'blur' }],
        first_name: [{ required: true, message: '请输入名', trigger: 'blur' }],
        sex: [{ required: true, message: '请选择性别', trigger: 'change' }],
        birthday: [{ required: true, message: '请选择生日', trigger: 'blur' }],
        address: [
          { required: true, message: '请选择详细地址', trigger: 'blur' }
        ],
        certificate_type: [
          { required: true, message: '请选择证件类型', trigger: 'blur' }
        ],
        identification_number: [
          { required: true, message: '请输入证件号', trigger: 'blur' }
        ]
      },
      examineGoodsForm: {},
      examineGoodsFormRules: {
        locations: [
          { required: true, message: '请选择验货期望地', trigger: 'change' }
        ],
        report_languages: [
          { required: true, message: '请选择报告语言', trigger: 'change' }
        ]
      },
      experienceFormRules: {
        company: [
          { required: true, message: '请输入公司名称', trigger: 'blur' }
        ],
        start_end_date: [
          { required: true, message: '请输入起止时间', trigger: 'change' }
        ],
        is_third_party_work: [
          {
            required: true,
            message: '请选择是否有第三方工作经验',
            trigger: 'change'
          }
        ],
        position: [{ required: true, message: '请输入职位', trigger: 'blur' }],
        work_description: [
          { required: true, message: '请输入工作描述', trigger: 'blur' }
        ],
        company_nature: [
          { required: true, message: '请输入工作性质', trigger: 'change' }
        ],
        company_scale: [
          { required: true, message: '请选择公司规模', trigger: 'change' }
        ],
        is_full_time: [
          { required: true, message: '请选择是否全职', trigger: 'change' }
        ]
      },
      experienceForm: {
        experienceFormArray: [
          {
            company: '',
            start_end_date: '',
            is_third_party_work: '',
            position: '',
            work_description: '',
            company_nature: '',
            company_scale: '',
            is_full_time: '',
            inspector_id: '',
            user_id: ''
          }
        ]
      },
      sex: '',
      imageUrl: '',
      imageUrl2: '',
      imageUrl3: '',
      options: [
        {
          value: 0,
          label: "请选择证件类型"
        },
        {
          value: 1,
          label: '身份证'
        }
      ],
      optionSelet: [
        {
          value: 1,
          label: '一般'
        },
        {
          value: 2,
          label: '良好'
        },
        {
          value: 3,
          label: '熟练'
        },
        {
          value: 4,
          label: '精通'
        }
      ],
      value: '',
      value6: '',
      tablist: [
        {
          content: '电子电器',
          isBool: true
        },
        {
          content: '轻工产品',
          isBool: false
        },
        {
          content: '纺织品',
          isBool: false
        }
      ],
      inspectorCompanyNatureArr: '',
      reportLanguagesList: [
        {
          label: '中文报告',
          val: 'zh_CN'
        },
        {
          label: '英文报告',
          val: 'en'
        }
      ],
      reportLanguages: [],
      identification_images: [],

      inspectorCompanyScaleArr: '',
      technicalCompetenceForm: {
        technicalCompetenceFormArray: [{
          skill:'en',
          en_images:[],
          certificate_images:[]
        }]
      },
      technicalCompetenceRules: {
        level_attained: [
          { required: true, message: '请选择', trigger: 'change' }
        ]
      },
      // handlePictureCardPreview:'',
      dialogVisible: false,
      inspectorEducationArr: '',
      optionList: [],
      front: {},
      back: {},
      num: 0,
      electronicsData: [],
      handheld: {},
      is_edit_certificate: true,
      is_edit_serve: false,
      is_edit_work: false,
      is_edit_education: false,
      is_edit_technical: false,
      is_edit_industry: false,
      is_edit_training: false,
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  computed: {
    uploadUrl() {
      return process.env.BASE_API + 'v1/upload'
    },
    uploadHeaders() {
      return {
        Authorization: 'Bearer ' + getToken()
      }
    },
    uploadHeaders2() {
      return {
        Authorization: 'Bearer ' + getToken()
      }
    },
    uploadHeaders3() {
      return {
        Authorization: 'Bearer ' + getToken()
      }
    }
  },
  created() {
    // this.getgrabSheet()
    this.getConfigInfo()
    this.getPersonalAuthentication()
    this.fillLocationOptions()
  },
  mounted() {},
  methods: {
    getConfigInfo() {
      getConfigInfo().then(response => {
        if (response.data.code == 0) {
          const {
            inspectorCompanyNatureArr,
            inspectorCompanyScaleArr,
            inspectorEducationArr,
            multiCascaderLocations,
            multiCascaderIndustrys
          } = response.data.data
          this.inspectorCompanyNatureArr = inspectorCompanyNatureArr
          this.inspectorCompanyScaleArr = inspectorCompanyScaleArr
          this.inspectorEducationArr = inspectorEducationArr
          this.optionList = multiCascaderLocations
          this.multiCascaderIndustrys = multiCascaderIndustrys
        }
      })
    },
    getgrabSheet() {
      grabSheet({}).then(response => {
        if (response.data.code == 0) {
          this.tableData = response.data.data
        }
      })
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
      this.front = {
        ...res.data,
        tag: 'front'
      }
      if (this.identificationImagesList.length > 0) {
        this.newfront = {
          ...res.data,
          tag: 'front'
        }
        let templateFront = {}
        let templateLeave = []

        templateFront = this.identificationImagesList.find(
          t => t.tag == 'front'
        )

        templateFront.detach = true

        templateLeave = this.identificationImagesList.filter(
          t => t.tag != 'front'
        )
        this.identificationImagesList = [...templateLeave, templateFront]
        console.log(this.identificationImagesList)
      }
    },
    beforeAvatarUpload(file) {},
    handleAvatarSuccess2(res, file) {
      this.imageUrl2 = URL.createObjectURL(file.raw)
      this.back = {
        ...res.data,
        tag: 'back'
      }
      if (this.identificationImagesList.length > 0) {
        this.newback = {
          ...res.data,
          tag: 'back'
        }
        let templateFront = {}
        let templateLeave = []

        templateFront = this.identificationImagesList.find(
          t => t.tag == 'back'
        )

        templateFront.detach = true

        templateLeave = this.identificationImagesList.filter(
          t => t.tag != 'back'
        )
        this.identificationImagesList = [...templateLeave, templateFront]
        console.log(this.identificationImagesList)
      }
    },
    beforeAvatarUpload2(file) {},
    handleAvatarSuccess3(res, file) {
      this.imageUrl3 = URL.createObjectURL(file.raw)
      this.handheld = {
        ...res.data,
        tag: 'handheld'
      }
      if (this.identificationImagesList.length > 0) {
        this.newhandheld = {
          ...res.data,
          tag: 'handheld'
        }
        let templateFront = {}
        let templateLeave = []

        templateFront = this.identificationImagesList.find(
          t => t.tag == 'handheld'
        )

        templateFront.detach = true

        templateLeave = this.identificationImagesList.filter(
          t => t.tag != 'handheld'
        )
        this.identificationImagesList = [...templateLeave, templateFront]
        console.log(this.identificationImagesList)
      }
    },
    beforeAvatarUpload3(file) {},
    spread() {
      this.personalCertificateFormShow = !this.personalCertificateFormShow
      if (this.personalCertificateFormShow) {
        this.text = '收起'
      } else {
        this.text = '展开'
      }
    },
    examineGoodsSpread() {
      this.examineGoodsFormShow = !this.examineGoodsFormShow
      if (this.examineGoodsFormShow) {
        this.examineGoodstext = '收起'
      } else {
        this.examineGoodstext = '展开'
      }
    },
    experienceSpread() {
      this.experienceFormShow = !this.experienceFormShow
      if (this.experienceFormShow) {
        this.experiencetext = '收起'
      } else {
        this.experiencetext = '展开'
      }
    },
    educationSpread() {
      this.educationFormShow = !this.educationFormShow
      if (this.educationFormShow) {
        this.educationtext = '收起'
      } else {
        this.educationtext = '展开'
      }
    },
    technicalCompetencespread() {
      this.technicalCompetenceFormShow = !this.technicalCompetenceFormShow
      if (this.technicalCompetenceFormShow) {
        this.technicalCompetencetext = '收起'
      } else {
        this.technicalCompetencetext = '展开'
      }
    },
    sectorLinespread() {
      this.sectorLineFormShow = !this.sectorLineFormShow
      if (this.sectorLineFormShow) {
        this.sectorLinetext = '收起'
      } else {
        this.sectorLinetext = '展开'
      }
    },
    trainingExperienceSpread() {
      this.trainingExperienceFormShow = !this.trainingExperienceFormShow
      if (this.trainingExperienceFormShow) {
        this.trainingExperiencetext = '收起'
      } else {
        this.trainingExperiencetext = '展开'
      }
    },
    // 英语相关证书
    handleRemove(index, file, fileList) {
      const newIndex = this._.findIndex(this.technicalCompetenceForm.technicalCompetenceFormArray[
        index
      ].en_images, { id: file.id })
      this.technicalCompetenceForm.technicalCompetenceFormArray[
        index
      ].en_images[newIndex].detach = true
    },
    handleSuccess(index, res, file) {
      console.log(index)
      this.technicalCompetenceForm.technicalCompetenceFormArray[
        index
      ].en_images.push(res.data)
      console.log(this.technicalCompetenceForm)
    },
    // 验货相关证书
    handleRemoveCertificate(index, file, fileList) {
      const newIndex = this._.findIndex(this.technicalCompetenceForm.technicalCompetenceFormArray[index].certificate_images, { id: file.id })
      this.technicalCompetenceForm.technicalCompetenceFormArray[
        index
      ].certificate_images[newIndex].detach = true
    },
    handleSuccessCertificate(index, res, file) {
      this.technicalCompetenceForm.technicalCompetenceFormArray[
        index
      ].certificate_images.push(res.data)
    },
    // 添加工作经验
    addExperience() {
      this.experienceForm.experienceFormArray.push({
        company: '',
        start_end_date: '',
        is_full_time: '',
        position: '',
        work_description: '',
        company_nature: '',
        company_scale: '',
        is_full_time: '',
      })
    },
    // 添加教育经历
    addEducation() {
      this.educationForm.educationFormArray.push({
        start_end_date: '',
        college: '',
        major: '',
        education: '',
        is_full_time: '',
      })
    },
    // 添加培训经历
    addTrainingExperience() {
      this.trainingExperienceForm.trainingExperienceFormArray.push({
        start_end_date: '',
        training_institution: '',
        training_course: '',
        address: '',
        training_description: ''
      })
    },
    // tab切换
    tab(item, index) {
      this.tablist.forEach((item, index) => {
        item.isBool = false
      })
      this.num = index
      item.isBool = true
      switch (index) {
        case 0:
          this.getList()
          break
        case 1:
          this.getList('WAIT_QUOTE')
          break
        case 2:
          this.getList('WAIT_PAY')
          break
      }
    },
    // 获取个人认证信息
    getPersonalAuthentication() {
      getPersonalAuthentication().then(response => {
        if (response.data.code == 0) {
          const {
            inspector_certificate,
            inspector,
            work_experience,
            education_info,
            training_experience,
            inspector_serve,
            technical_skills,
            industry,
            is_edit_certificate,
            is_edit_serve,
            is_edit_work,
            is_edit_education,
            is_edit_technical,
            is_edit_industry,
            is_edit_training
          } = response.data.data
          this.is_edit_certificate = is_edit_certificate
          this.is_edit_serve = is_edit_serve
          this.is_edit_work = is_edit_work
          this.is_edit_education = is_edit_education
          this.is_edit_technical = is_edit_technical
          this.is_edit_industry = is_edit_industry
          this.is_edit_training = is_edit_training
          this.personalCertificateForm = inspector_certificate
          this.identificationImagesList =
            inspector_certificate.identification_images
          this.imageUrl = inspector_certificate.identification_images.find(
            t => t.tag == 'front'
          ).url
          this.imageUrl2 = inspector_certificate.identification_images.find(
            t => t.tag == 'back'
          ).url
          this.imageUrl3 = inspector_certificate.identification_images.find(
            t => t.tag == 'handheld'
          ).url
          this.examineGoodsForm =
            Object.keys(inspector_serve).length === 0
              ? this.examineGoodsForm
              : inspector_serve
          this.supplier = inspector
          this.experienceForm =
            work_experience.length == 0
              ? this.experienceForm
              : { experienceFormArray: work_experience }
          this.educationForm =
            education_info.length == 0
              ? this.educationForm
              : { educationFormArray: education_info }
          this.technicalCompetenceForm =
            technical_skills.length == 0
              ? this.technicalCompetenceForm
              : { technicalCompetenceFormArray: technical_skills }
          this.multiCascaderIndustrysForm =
            Object.keys(industry).length === 0
              ? this.multiCascaderIndustrysForm
              : industry
          this.trainingExperienceForm =
            training_experience == 0
              ? this.trainingExperienceForm
              : { trainingExperienceFormArray: training_experience }
        }
      })
    },
    ispChange(values, items) {
      this.outputs.values = values
      this.outputs.items = items
    },
    fillLocationOptions() {
      fetchCounty({ pid: 7 }).then(response => {
        // this.optionList = response.data.data.multiCascaderLocations
      })
    },
    // 保存个人认证
    savaPersonalCertificate() {
      this.$refs['personalCertificateForm'].validate(valid => {
        if (valid) {
          let changeList
          const tempetchangeList = [
            ...this.identificationImagesList,
            this.newhandheld == null ? '' : this.newhandheld,
            this.newback == null ? '' : this.newback,
            this.newfront == null ? '' : this.newfront
          ]
          changeList = tempetchangeList.filter(item => item.length != 0)
          savaPersonalCertificate({
            inspector_certificate: {
              ...this.personalCertificateForm,
              country_id: this.supplier.country_id,
              location_ids: this.supplier.location_ids,
              identification_images:
                this.identificationImagesList.length == 0
                  ? [this.front, this.back, this.handheld]
                  : changeList
            }
          }).then(response => {
            if (response.data.code == 0) {
              store.dispatch('GetUserInfo')
              this.$message({
                message: '个人认证资料保存成功',
                type: 'success'
              })
              this.getPersonalAuthentication()
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 保存验货信息
    savaExamineGoods() {
      this.$refs['examineGoodsForm'].validate(valid => {
        if (valid) {
          savaExamineGoods({
            inspector_serve: {
              ...this.examineGoodsForm
            }
          }).then(response => {
            if (response.data.code == 0) {
              this.$message({
                message: '验货信息资料保存成功',
                type: 'success'
              })
              this.getPersonalAuthentication()
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 保存工作经验
    saveExperience() {
      this.$nextTick(() => {
        console.log(this.experienceForm.experienceFormArray)
      })
      this.$refs.experienceForm.validate(valid => {
        console.log(valid)
        if (valid) {
          saveExperience({
            work_experience: this.experienceForm.experienceFormArray
          }).then(response => {
            if (response.data.code == 0) {
              this.$message({
                message: '工作经验资料保存成功',
                type: 'success'
              })
              this.getPersonalAuthentication()
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 保存教育经历
    saveEducationForm() {
      this.$refs.educationForm.validate(valid => {
        if (valid) {
          saveEducation({
            education_info: this.educationForm.educationFormArray
          }).then(response => {
            if (response.data.code == 0) {
              this.$message({
                message: '教育经历资料保存成功',
                type: 'success'
              })
              this.getPersonalAuthentication()
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 保存培训经历
    savetrainingExperienceForm() {
      this.$refs.trainingExperienceForm.validate(valid => {
        if (valid) {
          savetrainingExperience({
            training_experience: this.trainingExperienceForm
              .trainingExperienceFormArray
          }).then(response => {
            if (response.data.code == 0) {
              this.$message({
                message: '培训经历资料保存成功',
                type: 'success'
              })
              this.getPersonalAuthentication()
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 保存技术能力
    savetechnicalCompetenceForm() {
      saveTechnicalCompetence({
        technical_skills: this.technicalCompetenceForm
          .technicalCompetenceFormArray
      }).then(response => {
        if (response.data.code == 0) {
          this.$message({
            message: '技术能力资料保存成功',
            type: 'success'
          })
          this.getPersonalAuthentication()
        }
      })
    },
    // 保存行业线
    savemultiCascaderIndustrysForm() {
      this.multiCascaderIndustrysForm.electronics.category_ids = this.$refs.electronics.getCheckedKeys()
      this.multiCascaderIndustrysForm.light_industry.category_ids = this.$refs.light_industry.getCheckedKeys()
      this.multiCascaderIndustrysForm.textile.category_ids = this.$refs.textile.getCheckedKeys()
      // console.log(this.electronicsData)
      savemultiCascaderIndustrys({
        industry: this.multiCascaderIndustrysForm
      }).then(res => {
        if (res.data.code == 0) {
          this.$message({
            message: '行业线资料保存成功',
            type: 'success'
          })
          this.getPersonalAuthentication()
        }
      })
    },
    // 提交所有信息
    submitBtn() {
      let changeList
      const tempetchangeList = [
        ...this.identificationImagesList,
        this.newhandheld == null ? '' : this.newhandheld,
        this.newback == null ? '' : this.newback,
        this.newfront == null ? '' : this.newfront
      ]
      changeList = tempetchangeList.filter(item => item.length != 0)
      this.multiCascaderIndustrysForm.electronics.category_ids = this.$refs.electronics.getCheckedKeys()
      this.multiCascaderIndustrysForm.light_industry.category_ids = this.$refs.light_industry.getCheckedKeys()
      this.multiCascaderIndustrysForm.textile.category_ids = this.$refs.textile.getCheckedKeys()
      saveAllMessage({
        inspector_certificate: {
          ...this.personalCertificateForm,
          country_id: this.supplier.country_id,
          location_ids: this.supplier.location_ids,
          identification_images:
            this.identificationImagesList.length == 0
              ? [this.front, this.back, this.handheld]
              : changeList
        },
        inspector_serve: this.examineGoodsForm,
        industry: this.multiCascaderIndustrysForm,
        education_info: this.educationForm.educationFormArray,
        work_experience: this.experienceForm.experienceFormArray,
        training_experience: this.trainingExperienceForm
          .trainingExperienceFormArray,
        technical_skills: this.technicalCompetenceForm
          .technicalCompetenceFormArray
      }).then(res => {
        if (res.data.code == 0) {
        }
      })
    },
    // 语言格式化
    arrayLanguages(val) {
      if (val != undefined) {
        return val.map((item, index) => {
          return item == 'zh_CN' ? '中文' : '英文'
        }).join(' , ')
      } else {
        return ''
      }
      // val.length > 0 ? return val.map((item,index) =>{
      //   return item=="zh_CN" ? '中文' : '英文'
      // }).join(' , ') : 2
    },
    // 去对象里面的key
    jsonGetName(item, key) {
      return item.find(t =>
        t.id == key
      ).label
    }
  }
}
</script>
<style lang="scss">
.professiondData {
  .avatar-uploader {
    float: left;
    margin-right: 24px;
  }
  .el-checkbox__input.is-checked .el-checkbox__inner,
  .el-checkbox__input.is-indeterminate .el-checkbox__inner {
    background-color: #ffa800;
    border-color: #ffa800;
  }
  .avatar-uploader .el-upload {
    border: 1px solid rgba(192, 196, 204, 1);
    border-radius: 4px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 240px;
    height: 135px;
    text-align: center;
    padding-top: 40px;
  }
  .avatar-uploader-icon i {
    font-size: 28px;
    color: #ffa800;
  }
  .avatar-uploader-icon p {
    margin-top: 10px;
    font-size: 14px;
    line-height: 1;
    color: rgba(144, 147, 153, 1);
  }
  .avatar {
    width: 240px;
    height: 135px;
    display: block;
  }
  .el-form-item__label {
    text-align: left;
  }
  .el-upload--picture-card {
    border: 1px solid rgba(192, 196, 204, 1);
    width: 240px;
    height: 135px;
    position: relative;
  }
  .el-upload-list--picture-card .el-upload-list__item {
    width: 240px;
    height: 135px;
  }
  .el-upload--picture-card:hover {
    border-color: #409eff;
  }
  .bgContent {
    position: absolute;
    top: 0;
    left: 0;
    width: 240px;
    height: 135px;
    line-height: 1;
    padding: 41px 0 0;
    z-index: 1;
    /* background-color: red; */
  }
  .bgContent i {
    /* display:block; */
    font-size: 28px;
    color: #ffa800;
    /* vertical-align: top;
    /* position: relative; */
    line-height: 1;
    height: 1px;

    /* top:-30px; */
    /* text-align: center;
    margin: 0 auto; */
  }
  .bgContent .text {
    text-align: center;
    color: rgba(127, 143, 164, 1);
    line-height: 1;
    margin-top: 10px;
  }
  .tip2 {
    color: #7f8fa4;
    font-size: 12px;
    margin-top: 6px;
    line-height: 1;
  }

  .el-radio + .el-radio {
    margin-left: 115px;
  }
  .el-radio__input.is-checked .el-radio__inner {
    border-color: #ffa500;
    background: #ffa500;
  }
  .el-radio__input.is-checked + .el-radio__label {
    color: #ffa500;
  }
  //  .el-tree-node__content {
  //   height: 48px;
  //   .el-tree-node__content {
  //     height: 12px;
  //   }
  // }
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
.professiondData {
  margin: 32px 40px 0;
  .tc-separate {
      span + span {
        &::before {
          content: " , ";
        }
      }
    }
  .btn {
    display: block;
    width: 160px;
    height: 40px;
    background: rgba(255, 168, 0, 1);
    border: none;
    color: rgba(255, 255, 255, 1);
    text-align: center;
    margin: 38px auto 0;
  }
  .bottom {
    padding: 60px 0;
    display: block;
    .submitBtn {
      display: block;
      width: 160px;
      height: 50px;
      background: #ffa800;
      border: none;
      color: rgba(255, 255, 255, 1);
      text-align: center;
      margin: 0 auto;
      font-size: 16px;
    }
  }

  .normalbox {
    padding: 20px 30px;
    background: rgba(255, 255, 255, 1);
    .normalTitle {
      padding-bottom: 20px;
      border-bottom: 2px solid #bfc4cc;
      overflow: hidden;
      .left {
        float: left;
        color: #50688c;
        font-size: 16px;
        > span {
          color: #ef3535;
          margin-right: 8px;
        }
      }
      .right {
        float: right;
        font-size: 16px;
        i {
          color: #ffa800;
          margin-left: 16px;
          transition: all 0.5s;
        }
        .rotaga {
          transform: rotate(180deg);
          -ms-transform: rotate(180deg); /* IE 9 */
          -moz-transform: rotate(180deg); /* Firefox */
          -webkit-transform: rotate(180deg); /* Safari 和 Chrome */
          -o-transform: rotate(180deg); /* Opera */
        }
      }
    }
    .titleChange {
      border-bottom: none;
      padding-bottom: 0;
    }
    .personalCertificateForm {
      position: relative;
      margin-top: 32px;
      .normalInput {
        width: 428px;
      }
      .showImg{
        img{
          width: 240px;
          height: 135px;
          display: inline-block;
          margin-right:20px;
        }

      }
      .remove {
        width: 60px;
        display: inline-block;
        color: #67c23a;
        cursor: pointer;
        vertical-align: middle;
        i {
          display: block;
          font-size: 16px;
          color: #67c23a;
          text-align: center;
          padding: 0;
          margin: 0;
          line-height: 1;
          position: relative;
          top: -3px;
        }
        p {
          line-height: 1;
          text-align: center;
          position: relative;
          top: 3px;
        }
      }
    }
  }
  .examineGoods {
    margin-top: 32px;
  }
  .experience {
    margin-top: 32px;
  }
  .educationExperience {
    margin-top: 32px;
  }
  .technicalCompetence {
    margin-top: 32px;
  }
  .sectorLine {
    margin-top: 32px;
    .sectorLineBox {
      border: 1px solid rgba(230, 234, 238, 1);
      border-radius: 4px;
      width: 100%;
      margin-top: 25px;
      .tabs-top {
        background-color: #ffffff;
        height: 50px;
        line-height: 50px;
        .tabs {
          display: inline-block;
          width: 800px;
          overflow: hidden;
          list-style: none;
          margin: 0;
          padding: 0;
          li {
            float: left;
            width: 20%;
            height: 50px;
            line-height: 50px;
            text-align: center;
            font-size: 14px;
            color: #50688c;
          }
          .active {
            border-bottom: 2px solid #ffa800;
            color: #ffa800;
          }
        }
      }
    }
  }
  .trainingExperience {
    margin-top: 32px;
  }
}
</style>

