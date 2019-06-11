<template>
  <div class="dialog-mobile">
    <header class="dlg-hd">
      <div class="img-wrap">
        <img :src="require('@/assets/img/icon/logo.png')" alt="logo">
      </div>
      <h1>
        客服服务
        <span>({{socketStatusName}})</span>
      </h1>
    </header>
    <div class="dlg-bd">
      <div class="chat-panel custom-scroll" ref="chartPanel">
        <ul>
          <li v-for="item in chatLst" :key="item.id">
            <div :class="['msg-box', item.customer ?'msg-right':'msg-left']">
              <div :class="['head', 'w-icon',item.customer ?'w-icon-customer': 'w-icon-service']"></div>
              <div class="text-box">
                <div v-if="!item.customer" class="name">匿名用户</div>
                <p>{{item.answer}}</p>
                <div v-if="item.evaluate >= 0" class="satisfaction">
                  <el-button
                    v-if="item.evaluate<2"
                    type="primary"
                    size="mini"
                    :disabled="item.evaluate==1"
                  >满意</el-button>
                  <el-button
                    v-if="item.evaluate<'2'"
                    type="info"
                    size="mini"
                    :disabled="item.evaluate==1"
                  >不满意</el-button>
                </div>
                <time>{{item.time}}</time>
              </div>
              <div v-if="!item.customer && item.status !=='success'" class="msg-status">
                <span :class="item.status == 'loading' ? 'el-icon-loading' : 'el-icon-warning' "></span>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="dlg-fd">
      <p class="tip" id='guest_list'>
        <el-button class="el-icon-delete" size="mini" type="text" @click="clearChat">清空记录</el-button>
        <el-button class="tip-size" size="mini" type="text" @click="switchPerson(1)">访客-2</el-button>
        <el-button class="tip-size" size="mini" type="text" @click="switchPerson(0)">访客-1</el-button>
        <el-button class="tip-size" size="mini" type="text">
          您还可以输入
          <a>{{remain}}</a>个字
        </el-button>
      </p>
      <div class="input-wrap">
        <input
          slot="reference"
          @keydown.enter="sendQuestion(questionForm)"
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
    </div>
  </div>
</template>

<script>
import io from 'socket.io-client'
import { api_post } from '@/api'
import { $debounce, $formatDateTime } from '@/js/common'
var gb_username='yxy'
var guest_list= new Array()
var gb_guest='rock'

export default {
  created () {
    this.initSocket()
  },
  beforeDestroy () {
    this.socket.close()
  },
  computed: {
    socketStatusName () {
      switch (this.socketStatus) {
        case 0:
          return '离线';
        case 1:
          return '在线';
        case 2:
          return '连接中';
        default:
          return '离线'
      }
    },
    isDisabledSend () {
      return this.questionForm.question.trim() === ''
    },
    remain () {
      return 100 - this.questionForm.question.length
    }
  },
  methods: {
    initSocket () {
        let host= document.domain
        console.log("host:"+host)
      this.socket = io.connect('http://'+host +':5000/chats');
      this.socket.on('msg_receive', (data) => {
        let res = JSON.parse(data.message)
        console.log("msg_receive:"+res)
        gb_guest = res.from
        console.log("guest:"+ gb_guest)
        this.socketStatus = 1;
        this.chatLst.push({
          answer: res.msg,
          time: res.time,
          customer: false,
          status: 'success',
          visible: 1
        })
      });
      /* this.socket.on('client_response', (data) => {
        console.log("client_response:"+data)
        let res = JSON.parse(data)
        this.socketStatus = 1;
        this.chatLst.push({
          answer: res.msg,
          time: res.time,
          customer: false,
          status: 'success',
          visible: 1
        })
      });*/
      this.socket.on('join_resp',(data)=>{
        console.log("customer resp msg:"+data.message)
        let res= JSON.parse(data.message)  //json转对象
        gb_username=res.u_name
        console.log("customer gb_username:"+gb_username)
        guest_list = res.guest_users
        console.log("customer guest_list:"+guest_list)
        let len = guest_list.length
        console.log("访客数:"+len)
        /* if(len != 0){
            let guest_index = Math.ceil(Math.random()* guest_list.length) -1
            console.log("customer guest_index:"+ guest_index)
            gb_guest =guest_list[guest_index]
            console.log("customer gb_guest:"+gb_guest)
        }
        */
      });
      this.socket.on('connecting', () => {
        this.socketStatus = 2;
        console.log("正在连接");
      });
      this.socket.on('connect', () => {
        this.socketStatus = 1;
        console.log("gb_username:"+gb_username)
        let username= 'yxy-'+ $formatDateTime(new Date())
        console.log("客服:"+username+"连接成功!");
        this.socket.emit('join',{username:username,user_type:'customer'})
      });
      this.socket.on('connect_failed', () => {
        this.socketStatus = 0;
        console.log("连接失败");
      });
      this.socket.on('reconnect', () => {
        this.socketStatus = 1;
        console.log("成功重连");
      });
      this.socket.on('reconnecting', () => {
        this.socketStatus = 2;
        console.log("正在重连");
      });
      this.socket.on('reconnect_failed', () => {
        this.socketStatus = 0;
        console.log("重连失败");
      });
      this.socket.on('disconnect', () => {
        this.socketStatus = 0;
        console.log("断开连接");
      });
    },
    sendQuestion (questionForm) {
      this.chatLst.push({
        answer: questionForm.question,
        time: $formatDateTime(new Date()),
        customer: true,
        visible: 1
      })
      if (this.socket && this.socketStatus === 1) {
        this.socket.emit('send', JSON.stringify({user_type:'customer', type: 'personal', from: gb_username, to: gb_guest, msg: questionForm.question, time: $formatDateTime(new Date()) }));
        //this.socket.emit('server_request', JSON.stringify({ type: 'personal', from: 'yxy', to: 'lockey', msg: questionForm.question, time: $formatDateTime(new Date()) }));
      }
    },
    clearChat () {
      this.chatLst = []
    },
    switchPerson(index){
        gb_guest=guest_list[index]
        console.log("访客 switch to :"+ gb_guest)
    }
  },
  data () {
    return {
      socket: null,
      timer: null,
      chatLst: [],
      socketStatus: -1,
      currentSubmitIndex: 0,
      questionForm: {
        question: ''
      }
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
.el-message {
  min-width: 180px !important;
}
</style>
