<template>
  <div class="container interlocution">
    <elHeader></elHeader>
    <elAside></elAside>
    <div class="m-main">
      <header class="m-mn-title">知识库</header>
      <div class="m-mn-body">
        <header class="mn-bd-hd">
          <el-form ref="searchForm"
                   :model="searchForm">
            <el-form-item label="问题描述："
                          prop="questionDescribe"
                          style="width:100%;">
              <div class="search-simple">
                <el-input v-model="searchForm.questionDescribe"
                          placeholder="请输入问题关键字"
                          @keydown.native.enter="() => {
                  goSearch = true;
                  currentPage = 1;
                }"></el-input>
                <div class="btn-group">
                  <el-button type="primary"
                             @click="() => {
                  goSearch = true;
                  currentPage = 1;
                }"
                             plain>搜索</el-button>
                </div>
                <el-button :icon="isMore?'el-icon-minus':'el-icon-plus'"
                           @click="isMore=!isMore"></el-button>
              </div>
            </el-form-item>
            <el-form-item v-if="isMore"
                          label="时间范围："
                          prop="startTime"
                          style="width:60%;margin:0 30% 0 0;">
              <el-row>
                <el-col :span="6">
                  <el-date-picker v-model="searchForm.startTime"
                                  type="datetime"
                                  @change="datetimerangeValueChangeStart"
                                  placeholder="选择日期时间"></el-date-picker>
                </el-col>
                <el-col class="line"
                        :span="1">
                  <div style="text-align:center;">至</div>
                </el-col>
                <el-col :span="6">
                  <el-form-item prop="endTime">
                    <el-date-picker v-model="searchForm.endTime"
                                    type="datetime"
                                    default-time="23:59:59"
                                    @change="datetimerangeValueChangeEnd"
                                    placeholder="选择日期时间"></el-date-picker>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item v-if="isMore"
                          label="问题类别："
                          label-width="82px"
                          prop="classification"
                          style="width:274px">
              <el-cascader :options="selectFilterCategory"
                           v-model="searchForm.classification"
                           :props="categrateProps">
              </el-cascader>
            </el-form-item>
            <el-form-item v-if="isMore"
                          label="可见性："
                          label-width="82px"
                          prop="visible"
                          style="width:30%;max-width:250px">
              <el-select v-model="searchForm.visible"
                         placeholder="请选择">
                <el-option label="全部"
                           :value="false">
                </el-option>
                <el-option label="可见"
                           value="1">
                </el-option>
                <el-option label="不可见"
                           value="0">
                </el-option>

              </el-select>
            </el-form-item>
            <el-form-item v-if="isMore"
                          label="待回答："
                          label-width="82px"
                          prop="noAnswer"
                          style="width:120px;">
              <el-checkbox v-model="searchForm.noAnswer"></el-checkbox>
            </el-form-item>
            <el-form-item v-if="isMore">
              <el-button type="warning"
                         @click="reset"
                         plain>重置</el-button>
            </el-form-item>
          </el-form>
        </header>
        <div class="mn-bd-box">
          <div class="mn-bd-tools">
            <el-button type="primary"
                       @click="addItem"
                       plain>添加新问题</el-button>
            <el-button type="warning"
                       @click="batchDelete"
                       plain>批量删除</el-button>
            <el-popover placement="bottom-start"
                        width="80"
                        trigger="hover">
              <div class="menu">
                <ul>
                  <li @click="handleItem('1')">批量显示</li>
                  <li @click="handleItem('0')">批量隐藏</li>
                </ul>
              </div>
              <el-button slot="reference"
                         style="margin-left:10px"
                         plain>
                更多操作
                <span class="el-icon-arrow-down"></span>
              </el-button>
            </el-popover>
            <el-button style="margin-left:10px"
                       @click="train"
                       plain>
              训练
            </el-button>
            <div class="search-tip">共搜索到 {{itemTotal}} 条信息</div>
          </div>
          <el-table :data="lst"
                    class="questionLst"
                    height="100%"
                    v-loading="tableLoading"
                    element-loading-text="加载中..."
                    @selection-change="handleSelectionChange"
                    size="medium">
            <el-table-column type="selection"
                             width="55"></el-table-column>
            <el-table-column type="expand"
                             width="100%">
              <template slot-scope="props">
                <el-form label-position="left"
                         inline
                         class="demo-table-expand">
                  <el-form-item class="table-answer">
                    <p>
                      <span>类别：</span>
                      {{ props.row.className || '待分类'}}
                    </p>
                    <p>
                      <span>状态：</span>
                      <el-badge class="dot-item"
                                is-dot
                                :type="props.row.waitAnswer == '1' ? 'info' : 'success'" />
                      {{ props.row.waitAnswer == '1' ? '待回答' : '已回答' }}
                    </p>
                    <p v-if="props.row.waitAnswer !='1'">
                      <span>回答：</span>
                      <div class="html-templet"
                           v-html="props.row.answer"></div>
                    </p>
                    <footer class="table-item-ft">
                      <ul>
                        <li class="similarity-btn"
                            @click="goSimilarity(props.row)">
                          <span>{{props.row.simQues.length}}个相似问法</span></li>
                      </ul>
                    </footer>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column label="问题"
                             :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <span @click="handleItem(scope.row)"
                      :class="scope.row.visible == '1'? 'fa fa-eye open-eye':'fa fa-eye-slash close-eye'"></span>
                <p v-html="scope.row.question"
                   class="table-title-height"></p>
              </template>
            </el-table-column>
            <el-table-column label="类别"
                             width="200">
              <template slot-scope="scope">{{ scope.row.className }}</template>
            </el-table-column>
            <el-table-column label="阈值"
                             width="200">
              <template slot-scope="scope">{{ scope.row.threshold }}</template>
            </el-table-column>
            <el-table-column width="200"
                             label="时间">
              <template slot-scope="scope">
                <span style="color:#909399">{{scope.row.insert_time}}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作"
                             width="200px">
              <template slot-scope="scope">
                <el-button type="text"
                           @click="editItem(scope.row)">编辑</el-button>
                <span class="cut-off">|</span>
                <el-popover placement="bottom-start"
                            width="80"
                            trigger="hover">
                  <div class="menu">
                    <ul>
                      <li @click="handleItem(scope.row)">{{scope.row.visible == '1'? '隐藏':'显示'}}</li>
                      <li @click="deleteItem(scope.row.id)">删除</li>
                    </ul>
                  </div>
                  <el-button slot="reference"
                             type="text">
                    更多
                    <span class="el-icon-arrow-down"></span>
                  </el-button>
                </el-popover>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination background
                         layout="prev, pager, next"
                         :page-size.sync="size"
                         :total.sync="itemTotal"
                         :current-page.sync="currentPage"
                         @current-change="setCurrentPage"></el-pagination>
        </div>
      </div>
      <!--- m-mn-body -->
    </div>
    <!--- dialog-start -->
    <el-dialog title="问题"
               :visible.sync="itemDialogVisible"
               @close="itemHandleClose"
               @opened="itemHandleShow"
               :closeOnClickModal="false"
               class="dialog-add dialog-project">
      <el-form ref="itemForm"
               :model="itemForm"
               :rules="itemRules">
        <el-form-item label="类别"
                      prop="classification">
          <el-cascader :options="filterCategory"
                       v-model="itemForm.classification"
                       :props="categrateProps">
          </el-cascader>
        </el-form-item>
        <el-form-item label="可见">
          <el-select v-model="itemForm.visible">
            <el-option :value="1"
                       label="显示"></el-option>
            <el-option :value="0"
                       label="隐藏"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="阈值"
                      prop="threshold">
          <el-input v-model="itemForm.threshold"
                    maxlength="4"
                    style="width:218px;"></el-input>
        </el-form-item>
        <el-form-item label="标签"
                      prop="tagValue">
          <el-tag :key="tag + index"
                  v-for="(tag, index) in itemForm.tagsValue"
                  closable
                  size="default"
                  :disable-transitions="false"
                  @close="handleClose(tag)">{{tag}}</el-tag>
          <el-input style="width:90px;margin-right:10px;"
                    class="input-new-tag"
                    v-if="tagVisible"
                    v-model="itemForm.tagValue"
                    ref="tagInput"
                    @keyup.enter.native="tagInputConfirm"
                    @blur="tagInputConfirm">
          </el-input>
          <div v-else
               style="display:inline;">
            <el-button class="button-new-tag"
                       size="small"
                       @click="showInput">
              <i class="el-icon-plus"></i>自定义
            </el-button>
            <el-button type
                       class="button-new-tag"
                       size="small"
                       @click="autoInput">
              <i class="fa fa-code"></i>自动
            </el-button>
          </div>
        </el-form-item>
        <el-form-item label="问题"
                      prop="question">
          <el-input v-model="itemForm.question"
                    ref="textarea"
                    type="textarea"
                    minlength="218"
                    :autosize="{minRows: 2, maxRows: 2}"
                    placeholder="请输入内容..."
                    resize="none"></el-input>
          <!-- <el-col class="simQuestionIcon"
            :span="2" 
            @click="goSimilarity(props.row)">
            <span class="fa fa-magnet"></span>
          </el-col> -->
        </el-form-item>
        <el-form-item label="回答"
                      prop="answer">
          <el-tabs v-model="panelType"
                   type="border-card">
            <el-tab-pane label="富文本"
                         name="richtext">
              <div ref="editor"></div>
            </el-tab-pane>
          </el-tabs>

          <div class="panel-richtext"></div>
        </el-form-item>
        <el-form-item label="问题图片"
                      v-if="0">
          <el-Upload v-model="itemForm.picture"
                     action>
            <el-button size="small"
                       type="primary">点击上传</el-button>
            <div slot="tip"
                 class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-Upload>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="itemDialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   :loading="itemDialogLoading"
                   @click="submitItemForm">
          {{itemDialogLoading ? '保存中...':'确认'}}</el-button>
      </span>
    </el-dialog>

    <el-dialog title="相似问法"
               :visible.sync="dialogSimilarityVisible"
               class="similarity-dialog"
               :close-on-click-modal='false'
               width="600px">
      <el-form :model="similaryityForm">
        <el-form-item>
          <p>标准问题：{{similaryityForm.question}}</p>
        </el-form-item>
        <el-form-item>
          <el-input v-model="simQuestionForm.simQuestion"
                    placeholder="输入相似问法">
          </el-input>
          <el-input v-model="simQuestionForm.threshold"
                    placeholder="输入阈值"
                    maxlength="4"
                    style="margin:15px 0">
          </el-input>
          <el-button style="width:100%"
                     type="primary"
                     @click="addSimQuestion"
                     :disabled="btnDisable"
                     plain>添加相似问法
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-table :data="similaryityForm.data"
                    v-loading="similaryityTableVisible">
            <el-table-column :show-overflow-tooltip="true"
                             label="问题详情">
              <template slot-scope="scope">
                <el-input v-model="scope.row.simQuestion">
                </el-input>
              </template>
            </el-table-column>
            <el-table-column width="150px"
                             label="阈值">
              <template slot-scope="scope">
                <el-input v-model="scope.row.threshold"
                          maxlength="4">
                </el-input>
              </template>
            </el-table-column>
            <el-table-column width="150px"
                             label="时间">
              <template slot-scope="scope">
                {{scope.row.time.substring(0,10)}}
              </template>
            </el-table-column>

            <el-table-column label="操作"
                             width="100px">
              <template slot-scope="scope">
                <el-button type="text"
                           @click="saveSimQuestion(scope.row)">保存</el-button>
                <el-button type="text"
                           @click="deleteSimQuestion(scope.row)"
                           style="color:#F56C6C">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </el-form>

    </el-dialog>
    <!--- m-main -->
  </div>
</template>

<script>
import {
  mapGetters
} from 'vuex'
import {
  api_post
} from '../api'
import qs from 'querystring'
import {
  postCategory
} from '../api/commonApi'
import {
  $deepClone,
  $checkRangeTime,
  $formatDateTime,
  $debounce
} from '../js/common'

import Editor from 'wangeditor';

export default {
  created () {
    this.goSearch = true;
    this.$formatDateTime = $formatDateTime;
    postCategory(this.$store)
  },
  watch: {
    goSearch (val) {
      if (!val) return;
      this.getLst();
    }
  },
  // filters: {
  //   formatDateTime (timer) {
  // return new Date(timer)  //null
  // 谷歌控制台 new Date(1557027489000) Sun May 05 2019 11:38:09 GMT+0800 (中国标准时间)
  // return $formatDateTime(new Date(timer)) //NaN-NaN-NaN NaN:NaN:NaN
  // return $formatDateTime(timer) //TypeError
  // return timer //1557027489000
  //   }
  // },
  computed: {
    itemRules () {
      const validateTags = (rule, value, callback) => {
        if (value) {
          if (Array.isArray(this.itemForm.tagsValue)) {
            let isHas = this.itemForm.tagsValue.some(item => {
              if (item === value) {
                return true
              }
            })
            if (isHas) {
              return callback(new Error('标签重复了'));
            }
          }
          if (value === this.itemForm.tagsValue) {
            return callback(new Error('标签重复了'));
          }
        }
        callback();
      }
      return {
        tagValue: [{
          required: true,
          validator: validateTags,
          trigger: 'change'
        }],
        classification: [{
          required: true,
          message: '请选择类别',
          trigger: 'blur'
        },],
        question: [{
          required: true,
          message: '请输入问题',
          trigger: 'blur'
        },],
        threshold: [{
          required: true,
          message: '当阈值为 0 时，不做过滤条件',
          trigger: 'blur'
        },]
      }
    },
    filterCategory () {
      let lst = JSON.parse(JSON.stringify(this.$store.getters.filterCategory));
      if (lst.length) {
        lst = lst[0].children;
      }
      lst.push({
        name: '待分类',
        id: '0'
      })
      return lst
    },
    selectFilterCategory () {
      let lst = JSON.parse(JSON.stringify(this.filterCategory));
      lst.unshift({
        name: '全部',
        id: '-1'
      })
      return lst;
    },
    currentPage: {
      get () {
        return parseInt(this.from) / parseInt(this.size) + 1;
      },
      set (val) {
        this.from = parseInt(this.size) * (parseInt(val) - 1)
      }
    },
  },
  methods: {

    train (val) {
      api_post('/train').then(resp => {
        if (val === 'setVisible') {
          this.Msg('操作成功', 'success')
          return
        }
        console.log(val)
        this.Msg(resp.msg, 'success')
      })
    },
    getSimQuestion () {
      const id = this.similaryityForm.id;
      const simQuestion = this.simQuestionForm.simQuestion;
      if (!simQuestion) {
        this.Msg('相似问题不能为空', 'warning')
        return;
      }
      return {
        ...this.simQuestionForm,
        questionId: id,
      }
    },
    saveSimQuestion (obj) {
      if (!obj.simQuestion) {
        this.Msg('相似问题不能为空', 'warning')
        return;
      }
      const paramObj = {
        simQuestionId: obj.simQuestionId,
        simQuestion: obj.simQuestion,
        threshold: obj.threshold
      }
      if (!obj.threshold || isNaN(Number(obj.threshold))) {
        this.Msg('阈值必须是数值', 'warning')
        return;
      }

      this.handleSimQues({
        api: 'updateSimQuestion',
        param: paramObj,
        id: obj.questionId,
        refreshTable: true
      })
    },
    addSimQuestion () {

      let simQuestionVal = this.getSimQuestion()


      if (!simQuestionVal.threshold || isNaN(Number(simQuestionVal.threshold))) {
        this.Msg('阈值必须是数值', 'warning')
        return;
      }
      const paramObj = {
        ...simQuestionVal
      }
      this.handleSimQues({
        api: 'appendSimQuestion',
        param: paramObj,
        id: simQuestionVal.questionId
      }).then(res => {
        this.simQuestionForm.simQuestion = ""
        this.simQuestionForm.threshold = "";
      })

    },
    editSimQues (obj) {
      const {
        val,
        row
      } = obj;
      if (!val || !row) return;

      const paramObj = {
        simQuestionId: row.simQuestionId,
        simQuestion: val,
        threshold: row.threshold
      }
      this.handleSimQues({
        api: 'updateSimQuestion',
        param: paramObj,
        id: row.questionId,
        refreshTable: true
      })
    },
    deleteSimQuestion (obj) {
      const {
        simQuestionId,
        questionId
      } = obj;

      const paramObj = {
        id: simQuestionId
      }

      this.handleSimQues({
        api: 'deleteSimQuestion',
        param: paramObj,
        id: questionId
      })
    },
    handleSimQues (obj) {
      const {
        param,
        api,
        id,
        refreshTable
      } = obj;

      this.btnDisable = true;
      return api_post(api, param).then(resp => {
        this.Msg(resp.msg, 'success')

        this.getLst()
        if (!refreshTable) this.getSimilarityTable(id)
        return true;
      }).finally(() => {
        this.btnDisable = false;
      })
    },
    handleClose (tag) {
      this.itemForm.tagsValue.splice(this.itemForm.tagsValue.indexOf(tag), 1);
    },
    showInput () {
      this.tagVisible = true;
      this.$nextTick(_ => {
        this.$refs.tagInput.$refs.input.focus();
      });
    },
    autoInput () {
      if (this.itemForm.question) {
        api_post('getKeyWord', {
          question: this.itemForm.question
        }).then(resp => {
          this.itemForm.tagsValue = Array.from(new Set([...resp.datas, ...this.itemForm.tagsValue]));
        })
      } else {
        this.$nextTick(_ => {
          this.$refs.itemForm.validateField('question');
        });
      }
    },
    tagInputConfirm (tags) {
      let inputValue = this.itemForm.tagValue;
      // 重复的标签不添加
      if (inputValue) {
        if (Array.isArray(this.itemForm.tagsValue)) {
          let isHas = this.itemForm.tagsValue.some(item => {
            if (item === inputValue) {
              return true
            }
          })
          if (isHas) {
            // this.$refs.itemForm.validateField('tagValue')
            return false
          }
        }
        if (this.itemForm.tagsValue === inputValue) {
          // this.$refs.itemForm.validateField('tagValue')
          return false
        }
        this.itemForm.tagsValue.push(inputValue);
      }
      this.tagVisible = false;
      this.itemForm.tagValue = '';
    },
    setCurrentPage (val) {
      // 重启搜
      this.goSearch = true;
      this.currentPage = val;
    },
    getLst () {
      this.tableLoading = true;
      let param = {
        size: this.size,
        from: this.from,
        sort: {
          insert_timestamp: 'desc'
        }
      }
      if (this.goSearch) {
        if (this.searchForm.startTime && this.searchForm.endTime) { //有日期过滤
          let isNormal = $checkRangeTime(this.searchForm.startTime, this.searchForm.endTime);
          if (isNormal) {
            param.range = {
              insert_timestamp: {
                gte: new Date(this.searchForm.startTime).getTime(),
                lte: new Date(this.searchForm.endTime).getTime()
              }
            }
          } else {
            this.$message({
              showClose: true,
              message: '日期选择范围不正确！',
              type: 'warning'
            });
            this.tableLoading = false;
            this.goSearch = false;
            return false;
          }
        }

        let classificationArr = this.searchForm.classification;

        if (classificationArr.length && classificationArr[classificationArr.length - 1] !== '-1') { //有分类
          let classification = classificationArr[classificationArr.length - 1];

          if (classification === '-1') return;
          if (classification === '0') { //选待分类
            param.must = {
              classification: ''
            };
          } else {
            param.must = {
              classification: classification
            };
          }
        }
        if (this.searchForm.noAnswer) {
          if (param.must) {
            param['must'].answer = ''
          } else {
            param.must = {
              answer: ''
            }
          }
        } else {
          if (param.must) {
            delete param['must'].answer
          }
        }
      }
      if (this.searchForm.visible) { //可见性
        if (param.must) {
          param['must'].visible = this.searchForm.visible
        } else {
          param.must = {
            visible: this.searchForm.visible
          }
        }
      } else {
        if (param.must) {
          delete param.must.visible
        }
      }
      if (this.searchForm.questionDescribe) {
        param.should = {
          question: this.searchForm.questionDescribe
        }
        param.highlight = 'question';
      }
      return new Promise(resolve => {
        api_post('faqQuestion/search', JSON.stringify(param), 'post', 'json').then(resp => {
          this.lst = [...resp.datas];
          this.itemTotal = resp.total;
          resolve(resp)
        }).finally(() => {
          this.tableLoading = false;
          this.goSearch = false;
        })
      })

    },
    reset () {
      this.$refs['searchForm'].resetFields();
    },
    datetimerangeValueChangeStart (val) {
      if (this.searchForm.endTime) {
        let isNormal = $checkRangeTime(val, this.searchForm.endTime);
        if (isNormal) {
          this.searchForm.startTime = val;
        } else {
          this.searchForm.startTime = this.searchForm.endTime;
        }
      } else {
        this.searchForm.startTime = val;
      }
    },
    datetimerangeValueChangeEnd (val) {
      if (this.searchForm.startTime) {
        let isNormal = $checkRangeTime(this.searchForm.startTime, val);
        if (isNormal) {
          this.searchForm.endTime = val;
        } else {
          this.searchForm.endTime = this.searchForm.startTime
        }
      } else {
        this.searchForm.endTime = val;
      }
    },
    addItem () {
      this.itemDialogVisible = true;
    },
    editItem ({
      tagsValue,
      question,
      ...data
    }) {
      this.itemDialogVisible = true;
      let classification = this.getTreeDeepArr(data.classification, this.filterCategory)
      tagsValue = tagsValue ? ((tagsValue === '') ? [] : tagsValue.split(',')) : [];
      question = question.replace(/<[^>]+>/g, '')
      delete data.tagValue;
      this.itemForm = {
        ...data,
        question,
        classification: classification,
        tagsValue: tagsValue
      };

      this.editorContent = data.answer;
    },
    handleItem (val) { //打开关闭
      this.$confirm('是否继续此操作?', '确认提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {

        let lst = [];
        if (typeof val === 'object') { //单条
          let visible = val.visible == '1' ? '0' : '1';
          lst.push({
            id: val.id,
            visible: visible
          })
        } else { //批量
          if (!this.multipleSelection.length) return;
          let visible = val;
          lst = this.multipleSelection.map(item => {
            return {
              id: item,
              visible: visible
            }
          })
        }
        this.tableLoading = true;
        api_post('setVisible', JSON.stringify(lst), 'post', 'json').then(resp => {
          setTimeout(function () {
            this.goSearch = true;
            this.getLst()
          }.bind(this), 1000)
        })
        this.train('setVisible')
      }).catch(() => {

      });

    },
    deleteItem (id) {
      let form = {
        id: id
      }
      this.$confirm('此操作将删除, 是否继续?', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.tableLoading = true;
        api_post('delete', qs.stringify(form)).then(resp => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          setTimeout(function () {
            this.getLst()
          }.bind(this), 1000)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    batchDelete () {
      if (!this.multipleSelection.length) return;
      this.$confirm('此操作将批量删除, 是否继续?', '批量删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.tableLoading = true;
        api_post('deleteBatch', JSON.stringify(this.multipleSelection), 'post', 'json').then(resp => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          setTimeout(function () {
            this.getLst()
          }.bind(this), 1000)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });

    },
    itemHandleShow () {
      if (!this.editor) {
        if (!this.$refs.editor) return;
        this.editor = new Editor(this.$refs.editor)
        this.editor.customConfig.onchange = (html) => {
          this.editorContent = html
        }

        this.editor.customConfig.uploadImgServer = '/uploadImage'

        this.editor.customConfig.menus = [
          'head', // 标题
          'bold', // 粗体
          'fontSize', // 字号
          'fontName', // 字体
          'italic', // 斜体
          'underline', // 下划线
          'strikeThrough', // 删除线
          'foreColor', // 文字颜色
          'backColor', // 背景颜色
          'link', // 插入链接
          'list', // 列表
          'justify', // 对齐方式
          'quote', // 引用
          'image', // 插入图片
          'table', // 表格
          'video', // 插入视频
          'code', // 插入代码
          'undo', // 撤销
          'redo' // 重复
        ]

        this.editor.create()
      }
      this.editor.txt.html(this.itemForm.answer);
    },
    itemHandleClose () {
      this.$refs['itemForm'].resetFields(); //清除部分
      this.itemForm = {
        ...this.defaultItemForm
      }
      console.log(this.editor.txt)
      // this.editor.txt.html=''
      this.editor.txt.html("");
      this.defaultItemForm.tagsValue = [];
      this.editorContent = '';

    },
    submitItemForm () {
      this.$refs['itemForm'].validate((validate) => {
        if (!validate) return;

        console.log(this.itemForm.threshold)

        if (isNaN(Number(this.itemForm.threshold))) {
          this.Msg('阈值必须是数值', 'warning')
          return;
        }
        this.itemDialogLoading = true;
        delete this.itemForm.tagValue;

        this.itemForm.answer = this.panelType === 'richtext' ? this.editorContent :
          this.itemForm.answer;

        let {
          insert_time,
          img_upload_path,
          ...form
        } = {
          ...this.itemForm,
          tagsValue: Array.isArray(this.itemForm.tagsValue) ? this.itemForm.tagsValue.join(',') : this.itemForm
            .tagsValue,
          classification: this.itemForm.classification[this.itemForm.classification.length - 1]
        };

        if (this.itemForm.id) { //更新
          form = {
            ...form,
            updateid: this.itemForm.id,
            updateimg: '',
            waitAnswer: (this.itemForm.answer || '').trim() === '' ? 1 : 0
          }
          delete form.id
        }
        api_post('upload', qs.stringify(form)).then(resp => {
          setTimeout(function () {
            this.getLst().then(() => {
              this.itemDialogVisible = false;
              this.itemDialogLoading = false;
            })
          }.bind(this), 1000)
        }).catch(res => {
          this.itemDialogLoading = false;
        })
      })
    },
    handleSelectionChange (lst) {
      this.multipleSelection = lst.map(({
        id
      }) => id);
    },
    getTreeDeepArr (key, treeData) {

      let arr = []; // 在递归时操作的数组
      let returnArr = []; // 存放结果的数组
      let depth = 0; // 定义全局层级
      // 定义递归函数
      function childrenEach (childrenData, depthN) {

        for (let j = 0; j < childrenData.length; j++) {

          depth = depthN; // 将执行的层级赋值 到 全局层级

          arr[depthN] = (childrenData[j].id);

          if (childrenData[j].id == key) {

            // returnArr = arr; // 原写法不行, 因 此赋值存在指针关系
            returnArr = arr.slice(0, depthN + 1); //将目前匹配的数组，截断并保存到结果数组，
            break
          } else {
            if (childrenData[j].children) {
              depth++;
              childrenEach(childrenData[j].children, depth);
            }
          }

        }
        return returnArr;
      }
      return childrenEach(treeData, depth);
    },
    goSimilarity ({
      ...obj
    }) {
      this.dialogSimilarityVisible = true;

      this.getSimilarityTable(obj.id)
    },
    getSimilarityTable (id) {
      this.similaryityTableVisible = true;
      api_post("getSimQuestion", {
        questionId: id
      }).then(resp => {
        this.similaryityForm = {
          id: id,
          data: resp.datas
        };
        this.similaryityTableVisible = false;
      })
    }
  },
  data () {
    const itemForm = {
      tagsValue: [],
      tagValue: '',
      classification: ['0'],
      question: '',
      answer: '',
      updateid: '',
      updateimg: '',
      funcLabels: '',
      threshold: '0.5',
      visible: 0
    };
    const similaryityForm = {
      id: '',
      data: []
    };
    return {
      editorContent: '', //富文本
      editor: '',
      panelType: 'richtext',
      similaryityTableVisible: true,
      timer: null,
      size: 10,
      itemTotal: 0,
      from: 0,
      isMore: false,
      tagVisible: false,
      multipleSelection: [],
      categrateProps: {
        value: 'id',
        label: 'name'
      },
      btnDisable: false,
      goSearch: false,
      searchForm: {
        visible: false,
        startTime: '',
        endTime: '',
        datetimerangeValue: '',
        questionDescribe: '',
        category: '',
        noAnswer: false,
        classification: ['-1']
      },
      simQuestionForm: {
        simQuestion: '',
        threshold: ''
      },
      lst: [],
      defaultItemForm: {
        ...$deepClone(itemForm)
      },
      similaryityForm: {
        ...$deepClone(similaryityForm)
      },
      itemForm: {
        ...itemForm
      },
      itemDialogLoading: false,
      tableLoading: false,
      itemDialogVisible: false,
      dialogSimilarityVisible: false
    }
  }
}
</script>
<style lang="scss">
@import "../sass/interlocutionMgt";

.search-simple {
  display: flex;

  .el-input {
    flex: 1;
  }

  .el-button {
    margin-left: 10px;
  }
}

.search-form-item {
  width: 100%;
}

.btn-group {
  float: right;
}

.open-eye {
  color: $primary;
  cursor: pointer;
}

.close-eye {
  color: $fontPrimary;
  cursor: pointer;
}

.table-title-height {
  display: inline;
  padding-left: 10px;

  span {
    color: #f00;
    padding: 0 2px;
  }
}

.table-answer {
  width: 100%;
  padding: 10px 20px;
  font-size: 12px;
  color: #888;
  background-color: $borderBtmColor;
  border-radius: 5px;

  p {
    margin: 0;

    span {
      color: #99a9bf;
    }

    .dot-item {
      top: 5px;
      right: 0px;
    }
  }
}

.dialog-add {
  .el-tag {
    margin-right: 10px;
    margin-bottom: 5px;
  }

  .input-new-tag {
    width: 90px;
    line-height: normal !important;
    vertical-align: middle;
  }

  .button-new-tag {
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
    margin-left: 0;
    margin-right: 10px;
  }
}

.w-e-text-container {
  height: 234px !important;
}
</style>