<template>
  <div class="container">
    <div class="dialog">
      <header class="dlg-hd">
        <div class="w-icon w-icon-people"></div>
        <div class="w-icon w-icon-logo"></div>
        <h1>海迈智能问答</h1>
        <div style="position: absolute;right:25px;">
          <el-popover placement="bottom"
                      width="100"
                      trigger="hover"
                      v-model="visibleQrcode">
            <ul class="qrcode-box">
              <li>
                <div class="w-icon w-icon-qrCode"></div>
                <p>关注公众号<br>了解更多信息</p>
              </li>
            </ul>
            <i slot="reference"
               class="fa fa-weixin"
               @click="visibleQrcode = !visibleQrcode"
               style="font-size:12px;cursor:pointer;">&nbsp;海迈公众号</i>
          </el-popover>
        </div>
      </header>
      <div class="dlg-bd">
        <main>
          <div class="chat-panel custom-scroll"
               ref="chartPanel">
            <ul>
              <li v-for="(item,index) in chatLst"
                  :key="index">
                <div :class="['msg-box', item.customer ?'msg-right':'msg-left']">
                  <div :class="['head', 'w-icon',item.customer ?'w-icon-customer': 'w-icon-service']"></div>
                  <div class="text-box">
                    <div v-if="!item.customer"
                         class="name">智能客服</div>
                    <div class="html-templet"
                         v-html="item.answer">
                    </div>
                    <pre v-if="0">{{encodeTextAreaString(item.answer)}}</pre>
                    <div v-if="item.evaluate >= 0"
                         class="satisfaction">
                      <el-button v-if="item.evaluate<2"
                                 type="primary"
                                 size="mini"
                                 @click="evalute(item)"
                                 :disabled="item.evaluate==1">满意</el-button>
                      <el-button v-if="item.evaluate<'2'"
                                 type="info"
                                 size="mini"
                                 @click="evalute(item,0)"
                                 :disabled="item.evaluate==1">不满意</el-button>
                    </div>
                    <div v-if="item.question && item.hasanswer == 0"
                         class="quote-box">
                      <div class="quote-box-card">
                        <p class="quote-text">{{item.question}}</p>
                        <el-button :loading="item.index === currentSubmitIndex"
                                   @click="submitNewQuestion(item)"
                                   type="primary"
                                   size="small"
                                   round
                                   class="quote-btn"
                                   :disabled="item.isSubmit">{{item.isSubmit?'提交成功':'提交问题'}}</el-button>
                      </div>
                    </div>
                    <time>{{item.time}}</time>
                  </div>
                  <div v-if="item.customer && item.status !=='success'"
                       class="msg-status">
                    <span :class="item.status == 'loading' ? 'el-icon-loading' : 'el-icon-warning' "></span>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <div class="input-field">
            <p class="tip">
              <el-button class="el-icon-delete"
                         size="mini"
                         type="text"
                         @click="clearChat">清空记录</el-button>您还可以输入
              <a>{{remain}}</a>个字
            </p>
            <textarea slot="reference"
                      @keydown.enter="sendQuestion(questionForm)"
                      @input="questionInput"
                      v-model="questionForm.question"
                      style="height:100%"
                      placeholder="请输入您的问题..."
                      maxlength="100"
                      resize="false"></textarea>
            <div class="btn-send">
              <el-button @click="sendQuestion(questionForm)"
                         :disabled="isDisabledSend"
                         type="primary">发送</el-button>
            </div>
            <div class="tip-question"
                 v-if="!isDisabledSend && tipLst.length">
              <ul>
                <li v-for="(item,itemIndex) in tipLst"
                    :key="itemIndex"
                    @click="getAnswer(item)">{{++itemIndex}}、<p v-html="item.question"></p>
                </li>
              </ul>
            </div>
          </div>
        </main>
        <aside>
          <div class="chart-tool">
            <ul class="icon-group">
              <li>
                <div class="w-icon w-icon-answer"></div>
                <p>常见问题</p>
              </li>
              <li v-if="0">
                <div class="w-icon w-icon-answer"></div>
                <p>快捷服务</p>
              </li>
              <li v-if="0">
                <div class="w-icon w-icon-msg"></div>
                <p>意见反馈</p>
              </li>
            </ul>
            <ol class="faq-lst custom-scroll">
              <li :title="item.question"
                  v-for="(item,itemIndex) in faqLst"
                  :key="itemIndex"
                  @click="sendQuestion(item, 'faq')">{{++itemIndex}}. {{item.question}}</li>
            </ol>
          </div>
          <div class="tags-cloud-index"
               style="height:30%;">
            <header>热词云</header>
            <Chart ref="tagCloud"
                   @click="setTagCloud"
                   :options="tagsCloud"
                   theme="macarons"
                   auto-resize
                   style="width:100%;height:80%;"></Chart>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { api_post } from '../api'
import { $debounce } from '../js/common'
import polar from '../js/polar'
import 'echarts-wordcloud'
export default {
  created () {
    this.$store.commit('INITCHAT');
    this.getTagCloud();
    this.getFAQLst();
  },
  watch: {
    tipLst (curVal, oldVal) {
      if (curVal.length) {
        this.tipPopover = true;
      } else {
        this.tipPopover = false;
      }
    }
  },
  computed: {
    isDisabledSend () {
      return this.questionForm.question.trim() === ''
    },
    chatLst () {
      return this.$store.state.chatLst
    },
    faqLst () {
      return this.$store.state.faqLst
    },
    remain () {
      return 100 - this.questionForm.question.length
    }
  },
  methods: {
    encodeTextAreaString (text) {
      return text;
    },
    getFAQLst () {
      api_post('/getHotFaq', { top: 15 }).then(resp => {
        this.$store.commit('INITFAQLST', resp.datas);
      });
    },
    setTagCloud (params) {
      this.questionForm.question = params.name
      this.getTips()
    },
    getTagCloud () {
      api_post('/getFaqQuestionWordCloud', {
        top: 100
      }).then(resp => {
        this.tagsCloud = polar.tag(resp.datas, {
          tooltip: {
            show: false
          }
        })
      });
    },
    submitNewQuestion (item) {
      let form = {
        question: item.question
      }
      this.currentSubmitIndex = item.index;
      api_post('appendQuestion', form).then(resp => {
        this.currentSubmitIndex = 0;
        this.$store.commit('PUSHCHATITEMSUBMIT', {
          index: item.index,
          isSubmit: true
        })
      });
    },
    getTips () {
      if (this.questionForm.question.trim().length === 0) {
        this.tipLst = [];
        return;
      };
      let question = this.questionForm.question;
      let form = {
        size: 5,
        // from: 0,
        // must: {
        //   visible: '1'
        // },
        // highlight: 'question',
        should: {
          question: question
        },
        // mustexist: ['answer']
      }
      api_post('faqQuestion/smart_search', form).then(resp => {
        this.tipLst = resp.datas.filter(item => {
          // 只返回可见
          return item.visible === '1'
        })
      });
    },
    getAnswer (obj) {//前端获取答案
      const question = this.questionForm.question;
      let questionObj = {
        answer: obj.question,
        customer: true,
        visible: '1',
        isSubmit: false,
        status: 'success'
      }
      let answerObj = {
        ...obj,
        visible: '1',
        evaluate: 0,//未评价
        isSubmit: false,
        status: 'success'
      }

      let suggestionForm = {
        questionId: obj.id,
        input_ques: question,
        datas: this.tipLst
      }

      api_post('faqQuestion/clickSuggestion', suggestionForm).then(resp => {
        console.log(resp)
      })


      this.$store.commit('PUSHCHATITEM', questionObj)//添加问题
      this.$store.commit('PUSHCHATITEM', answerObj)//添加回答

      this.$nextTick(() => {
        let chartPanel = this.$refs.chartPanel;
        chartPanel.scrollTop = chartPanel.scrollHeight;
      })
      this.tipLst = [];
      this.questionForm.question = '';
    },
    sendQuestion (obj, faq) {
      this.tipLst = [];
      if (!faq) {
        if (this.isDisabledSend) return false
      }
      let itemIndex = this.$store.state.chatLst.length;//用户发起的问题位置
      let question = obj.question;

      this.$store.commit('PUSHCHATITEM', {
        answer: question,
        customer: true,
        visible: '1',
        isSubmit: false,
        status: 'loading'
      })
      let form = {
        question: question
      }
      api_post('semantics', form).then(resp => {
        console.log(resp)
        this.$store.commit('CHANGEPROPERTY', {
          index: itemIndex,
          key: 'status',
          val: 'success'
        })

        let answerObj = {
          ...resp.datas
        }
        if (resp.datas.hasanswer) {//如果有答案则
          answerObj.evaluate = 0
        } else {
          // 没有答案，记录刚刚答案，并且允许用户提交后台
          answerObj.question = question
        }
        this.$store.commit('PUSHCHATITEM', answerObj)

        this.$nextTick(() => {
          let chartPanel = this.$refs.chartPanel;
          chartPanel.scrollTop = chartPanel.scrollHeight;
        })

      }).catch(() => {
        this.$store.commit('CHANGEPROPERTY', {
          //请求失败
          index: itemIndex,
          key: 'status',
          val: 'warning'
        })
      })
      this.$nextTick(() => {
        //把清空操作放在这边，保证解决keydown事件无法清除内容的问题。
        this.questionForm.question = '';
        let chartPanel = this.$refs.chartPanel;
        chartPanel.scrollTop = chartPanel.scrollHeight;
      })
    },
    evalute (obj, satisfied = 1) {
      let answerObj = {
        index: obj.index,
        key: 'evaluate',
        val: 1
      }
      this.$store.commit('CHANGEPROPERTY', answerObj)
      let parm = {
        question: obj.question ? obj.question : '',
        answer: obj.answer ? obj.answer : '',
        questionid: obj.id ? obj.id : '',
        className: obj.className ? obj.className : '',
        satisfied: satisfied      }
      api_post('survey', parm).then(resp => {
        answerObj = {
          index: obj.index,
          key: 'evaluate',
          val: 2
        }
        this.$store.commit('CHANGEPROPERTY', answerObj)
      }).catch(() => {
        answerObj = {
          index: obj.index,
          key: 'evaluate',
          val: 0
        }
        this.$store.commit('CHANGEPROPERTY', answerObj)
      });

    },
    clearChat () {
      this.$store.commit('INITCHAT')
    }
  },
  data () {
    return {
      timer: null,
      visibleQrcode: false,
      currentSubmitIndex: 0,
      questionForm: {
        question: ''
      },
      tipLst: [],
      tagsCloud: {},
      tipPopover: false,
      questionInput: $debounce.call(this, this.getTips, 500)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../sass/_mixin.scss";
@import "../sass/home.scss";
.quote-box {
  margin: 10px;
  display: flex;
  .quote-box-card {
    width: 100%;
    padding: 5px;
  }
  .quote-text {
    font-size: 12px;
    color: #888;
    background-color: #6ea8e3;
    border-radius: 5px;
    padding: 10px;
    color: #fff;
    position: relative;
    &:before {
      display: block;
      content: "";
      position: absolute;
      bottom: -14px;
      right: 30px;
      width: 0;
      height: 0;
      border-width: 7px 0 7px 13px;
      border-style: solid;
      border-color: #6ea8e3 transparent transparent transparent;
      z-index: 99;
    }
  }
  .quote-btn {
    margin-top: 10px;
    float: right;
  }
}
.tags-cloud-index {
  height: 30% !important;
  header {
    padding-left: 10px;
    font-size: 10px;
    color: #888;
    height: 30px;
    line-height: 30px;
    border-top: 1px solid $borderColor;
  }
}
.tip-question {
  min-width: 40%;
  ul {
    li {
      &:hover {
        color: #6494fd;
      }
      p {
        display: inline;
      }
    }
  }
}
</style>
<style lang="scss">
.tip-question ul li p span {
  color: #f00;
}
</style>


