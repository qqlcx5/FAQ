<template>
  <div class="dialog-mobile">
    <header class="dlg-hd">
      <div class="img-wrap">
        <img :src="require('@/assets/img/icon/logo.png')" alt="logo">
      </div>
      <h1>海迈智能问答</h1>
    </header>
    <div class="dlg-bd">
      <div class="chat-panel custom-scroll" ref="chartPanel">
        <ul>
          <li v-for="item in chatLst" :key="item.id">
            <div :class="['msg-box', item.customer ?'msg-right':'msg-left']">
              <div :class="['head', 'w-icon',item.customer ?'w-icon-customer': 'w-icon-service']"></div>
              <div class="text-box">
                <div v-if="!item.customer" class="name">智能客服</div>
                <p>{{item.answer}}</p>
                <div v-if="item.evaluate >= 0" class="satisfaction">
                  <el-button
                    v-if="item.evaluate<2"
                    type="primary"
                    size="mini"
                    @click="evalute(item)"
                    :disabled="item.evaluate==1"
                  >满意</el-button>
                  <el-button
                    v-if="item.evaluate<'2'"
                    type="info"
                    size="mini"
                    @click="evalute(item,0)"
                    :disabled="item.evaluate==1"
                  >不满意</el-button>
                </div>
                <div v-if="item.question && item.hasanswer == 0" class="quote-box">
                  <div class="quote-box-card">
                    <p class="quote-text">{{item.question}}</p>
                    <el-button
                      :loading="item.index === currentSubmitIndex"
                      @click="submitNewQuestion(item)"
                      type="primary"
                      size="small"
                      round
                      class="quote-btn"
                      :disabled="item.isSubmit"
                    >{{item.isSubmit?'提交成功':'提交问题'}}</el-button>
                  </div>
                </div>
                <time>{{item.time}}</time>
              </div>
              <div v-if="item.customer && item.status !=='success'" class="msg-status">
                <span :class="item.status == 'loading' ? 'el-icon-loading' : 'el-icon-warning' "></span>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="dlg-fd">
      <p class="tip">
        <el-button class="el-icon-delete" size="mini" type="text" @click="clearChat">清空记录</el-button>
        <el-button class="tip-size" size="mini" type="text">
          您还可以输入
          <a>{{remain}}</a>个字
        </el-button>
      </p>
      <div class="input-wrap">
        <input
          slot="reference"
          @keydown.enter="sendQuestion(questionForm)"
          @input="questionInput"
          v-model="questionForm.question"
          style="height:100%"
          placeholder="请输入您的问题..."
          maxlength="100"
          resize="false"
        >
        <div class="btn-send-wrap">
          <el-button
            icon="fa fa-paper-plane"
            class="btn-send"
            @click="sendQuestion(questionForm)"
            :disabled="isDisabledSend"
            type="primary"
          >&nbsp;发送</el-button>
        </div>
      </div>
      <div class="tip-question" v-if="showMask">
        <div class="tip-mask" @click="showMask = false"></div>
        <ul>
          <li v-for="(item,itemIndex) in tipLst" @click="getAnswer(item)" :key="item.id">
            {{++itemIndex}}、
            <p v-html="item.question"></p>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { api_post } from '@/api'
import { $debounce } from '@/js/common'
import polar from '@/js/polar'
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
        this.showMask = true
        this.tipPopover = true;
      } else {
        this.showMask = false
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
    // $debounce,
    getTips () {
      if (this.questionForm.question.trim().length === 0) {
        this.tipLst = [];
        return;
      };
      let question = this.questionForm.question;
      let form = {
        size: 5,
        from: 0,
        must: {
          visible: '1'
        },
        highlight: 'question',
        should: {
          question: question
        },
        mustexist: ['answer']
      }
      api_post('match', form).then(resp => {
        this.tipLst = resp.datas.filter(item => {
          // 只返回可见
          return item.visible === '1'
        })
      });
    },
    getAnswer (obj) {//前端获取答案
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

      this.$store.commit('PUSHCHATITEM', questionObj)//添加问题
      this.$store.commit('PUSHCHATITEM', answerObj)//添加回答

      this.$nextTick(() => {
        let chartPanel = this.$refs.chartPanel;
        chartPanel.scrollTop = chartPanel.scrollHeight;
      })
      this.tipLst = [];
      this.questionForm.question = '';
      this.showMask = false;
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
      showMask: false,
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
@import "../../sass/_mixin.scss";
@import "../../assets/sass/sprite.scss";
.dialog-mobile {
  position: relative;
  width: 100%;
  height: 100%;
  font-size: 14px;
  display: flex;
  flex-direction: column;
  .dlg-hd {
    height: 45px;
    line-height: 45px;
    padding: 10px 20px;
    background-color: $primary;
    box-sizing: border-box;
    flex: 0 0 45px;
    display: flex;
    .img-wrap {
      flex: 1 1 100px;
      display: block;
      width: 100px;
      img {
        display: block;
        max-width: 100%;
        height: auto;
      }
    }
    h1 {
      flex: 1 1 auto;
      font-size: 12px;
      color: #fff;
      line-height: 25px;
      padding-left: 10px;
    }
  }
  .dlg-bd {
    height: 100%;
    flex: 1 1 auto;
    overflow-y: auto;
    .chat-panel {
      padding: 8px;
      .msg-box {
        display: flex;
        margin-bottom: 20px;
        .head {
          margin-top: 10px;
          height: 52px;
          flex: 0 0 52px;
          width: 52px;
          margin-right: 8px;
        }
        .text-box {
          flex: 1 1 52px;
          box-sizing: border-box;
          position: relative;
          display: -webkit-box;
          display: -ms-flexbox;
          display: flex;
          margin-top: 10px;
          flex-direction: column;
          justify-content: center;
          padding: 10px;
          border: 1px solid #e3e4e8;
          border-radius: 6px;
          background: #fff;
          min-width: 142px;
          min-height: 42px;
          .name {
            font-size: 16px;
            padding-bottom: 6px;
            color: #ff8030;
          }
          p {
            font-size: 14px;
            line-height: 1.3;
            margin: 0;
          }
          time {
            position: absolute;
            bottom: -20px;
            font-size: 12px;
            color: #909399;
          }
          .satisfaction {
            margin: 15px 0 0 auto;
            &:empty {
              &:after {
                content: "感谢您的评价~";
                font-size: 12px;
                color: $fontSecond;
              }
            }
          }
        }
        .msg-status {
          display: flex;
          align-items: center;
          padding: 10px 15px 0;
          color: $placeholder;
          .el-icon-warning {
            color: #f56c6c;
          }
        }
      }
    }
  }
  .dlg-fd {
    position: relative;
    flex: 0 0 auto;
    background-color: #ccc;
    .tip {
      font-size: 12px;
      margin: 0;
      line-height: 20px;
      padding: 0 10px;
      background-color: #f7f7f7;
      .tip-size {
        display: block;
        padding: 7px;
        float: right;
      }
    }
    .input-wrap {
      display: flex;
      padding: 10px 8px;
      input {
        flex: 1 1 auto;
        height: 32px !important;
        padding: 5px;
        box-sizing: border-box;
        border: none;
        outline: $primary;
      }
      .btn-send-wrap {
        flex: 0 0 80px;
        .btn-send {
          width: 100%;
        }
      }
    }
    .tip-question {
      position: absolute;
      width: 100%;
      background-color: #ccc;
      bottom: 80px;
      .tip-mask {
        position: fixed;
        left: 0;
        right: 0;
        top: 0;
        bottom: 80px;
        background-color: #000;
        opacity: 0.4;
        z-index: 1;
        transition: all 0.5s ease;
      }
      ul {
        position: absolute;
        bottom: 0;
        z-index: 10;
        width: 100%;
        background-color: #fff;
        li {
          box-sizing: border-box;
          padding: 0 10px;
          height: 35px;
          line-height: 35px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          p {
            display: inline;
            span {
              color: #f00 !important;
            }
          }
        }
      }
    }
  }
  .msg-left {
    .text-box {
      margin-left: 15px;
      .name {
        padding-bottom: 6px;
        color: #ff8030;
      }
      &:before {
        display: block;
        content: "";
        position: absolute;
        top: 14px;
        left: -14px;
        width: 0;
        height: 0;
        border-width: 7px 13px 7px 0;
        border-style: solid;
        border-color: transparent $borderColor transparent transparent;
      }
      &:after {
        display: block;
        content: "";
        position: absolute;
        top: 15px;
        left: -12px;
        width: 0;
        height: 0;
        border-width: 6px 12px 6px 0;
        border-style: solid;
        border-color: transparent #fff transparent transparent;
      }
    }
  }
  .msg-right {
    flex-direction: row-reverse;
    .text-box {
      margin-right: 15px;
      background: #6ea8e3 !important;
      color: #fff !important;
      &:before {
        display: block;
        content: "";
        position: absolute;
        top: 14px;
        right: -12px;
        width: 0;
        height: 0;
        border-width: 7px 0 7px 13px;
        border-style: solid;
        border-color: transparent transparent transparent #6ea8e3;
      }
    }
  }
}
</style>
<style lang="scss">
.el-message{
  min-width: 180px!important;
}
.tip-question p {
  display: inline;
  span {
    color: #f00 !important;
  }
}
</style>



