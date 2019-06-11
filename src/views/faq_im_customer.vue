<template>
  <div class="container im">
    <Aside></Aside>
    <Header></Header>
    <div class="m-main">
      <div class="customerServicePanel">
        <el-row>
          <el-col :span="6">
            <div class="custom-info">
              <div class="custom-header">
                <img src="../assets/img/icon/gift.png"
                     alt="">
                <div>
                  <div style="margin-bottom:5px">客服001</div>

                  <el-select v-model="customValue"
                             placeholder="请选择"
                             style="width:100px"
                             @change="switchCustomStatus">
                    <el-option v-for="item in customStatus"
                               :key="item.value"
                               :label="item.label"
                               :value="item.value">
                    </el-option>
                  </el-select>

                </div>
              </div>
              <div>
                <el-tabs type="card"
                         v-model="tabsCustom"
                         @tab-click='handleCustom'>
                  <el-tab-pane label="我的信息"
                               name="first">
                    <div class="custom-tabs">
                      <ul>
                        <li v-for="(item,index) in customChatList"
                            :key="index">
                          <div class="custom-chat"
                               @click="selectedChat(item)">
                            <img class="custom-chat-img"
                                 src="../assets/img/icon/gift.png"
                                 alt="">
                            <div class="custom-chat-item">
                              <span class="custom-chat-item-name">{{item.sender}}</span>
                              <span class="custom-chat-item-text">{{item.content}}</span>
                            </div>
                            <span class="custom-chat-time">{{ item.create_time | formatDateTime }}</span>
                          </div>

                        </li>

                      </ul>
                    </div>
                  </el-tab-pane>
                  <el-tab-pane label="同事列表"
                               name="second">
                    <div class="custom-tabs">
                      <ul>
                        <li class="custom-chat"
                            v-for="(item, index) in workmates"
                            :key="index">
                          <img class="custom-chat-img"
                               src="../assets/img/icon/gift.png"
                               alt="">
                          <div class="custom-chat-item">
                            <span class="custom-chat-item-name">{{item.sender}}</span>
                            <span class="custom-chat-item-text">{{item.content}}</span>
                          </div>
                          <span class="custom-chat-time">{{ item.create_time | formatDateTime}}</span>
                        </li>
                      </ul>
                    </div>
                  </el-tab-pane>
                </el-tabs>
              </div>
            </div>
          </el-col>
          <el-col :span="12">
            <div>

              <section class="chat-header">
                <div class="chat-header-title">IM 客服聊天系统</div>
                <div class="chat-header-desc">用户信息：{{guestInfo.os}} {{guestInfo.browser}} {{guestInfo.ip}}</div>
              </section>
              <section class="chat-middle"
                       ref="chatMiddle">
                <ul>
                  <li class="none-history-msg"
                      @click="getChatMsg">获取更多历史消息
                  </li>
                  <li v-for="(item,index) in chatList"
                      :key="index">
                    <div>
                      <div class="dialog-title"
                           :class="[item.user_type === 'guest'?'left':'right']">
                        {{item.sender}}<span>{{item.create_time }}</span>
                      </div>
                      <div class="dialog-item"
                           :class="[item.user_type === 'guest'?'left':'right']">
                        <div class="dialog-box">
                          <!-- {{item.content}} -->
                          <img :src="item.image"
                               v-if="item.image"
                               class="image-size">
                          <span v-else
                                v-html="item.content">{{item.content}}</span>
                          <div class="arrow"
                               :class="[item.user_type === 'guest'?'left':'right']"></div>
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
              </section>
              <section>
                <el-row type="flex"
                        class="chat-fonter">
                  <el-upload action=""
                             class="upload-image"
                             :show-file-list="false"
                             :auto-upload="false"
                             :on-change="getFile">
                    <i class="el-icon-picture"></i>
                  </el-upload>
                  <el-col :span="24">
                    <textarea @keyup.enter="sendMsg()"
                              placeholder="请输入内容"
                              v-model="content"
                              maxlength="500"
                              class="textarea"></textarea>
                  </el-col>
                  <el-button type="primary"
                             class="send"
                             :disabled="isDisabledSend"
                             @click="sendMsg()">发送</el-button>
                </el-row>
              </section>
            </div>
          </el-col>
          <el-col :span="6">
            <el-tabs v-model="tabsGuest"
                     type="border-card">
              <el-tab-pane label="用户信息"
                           name="first">
                <div class="tabs-item">
                  <el-collapse v-model="activeNames"
                               @change="handleClick">
                    <el-collapse-item name="1">
                      <template slot="title">
                        <i class="header-icon el-icon-warning"></i> 访问信息
                      </template>

                      <ul>
                        <li class="collapse-li">
                          <span class="collapse-name">发起页</span> <a href="#">{{guestInfo.from_page}}</a>
                        </li>
                        <li class="collapse-li">
                          <span class="collapse-name">来源页</span><a href="#">{{guestInfo.launch_page}}</a>
                        </li>
                        <li class="collapse-li">
                          <span class="collapse-name">IP地址</span><span>{{guestInfo.ip}}</span>
                        </li>
                        <li class="collapse-li">
                          <span class="collapse-name">浏览器</span> <span>{{guestInfo.browser}}</span>
                        </li>
                        <li class="collapse-li">
                          <span class="collapse-name">系统</span> <span>{{guestInfo.os}}</span>
                        </li>
                      </ul>
                    </el-collapse-item>
                    <el-collapse-item name="2">
                      <template slot="title">
                        <i class="header-icon el-icon-service"></i> 客户信息
                        <button @click.stop="guestInfoGrade"
                                class="custom-btn"
                                :class="[guestInfo.grade === '普通' ?'':'vip']">{{guestInfo.grade == '普通' ?'普通':'VIP'}}</button>
                      </template>
                      <ul>
                        <li class="collapse-custom-li">
                          <el-input placeholder="请填写姓名"
                                    v-model="guestInfo.name">
                            <template slot="prepend">姓名:</template>
                          </el-input>
                        </li>
                        <li class="collapse-custom-li">
                          <el-input placeholder="请填写电话"
                                    v-model="guestInfo.phone">
                            <template slot="prepend">电话:</template>
                          </el-input>
                        </li>
                        <li class="collapse-custom-li">
                          <el-input placeholder="请填写行业"
                                    v-model="guestInfo.industry">
                            <template slot="prepend">行业:</template>
                          </el-input>
                        </li>
                        <li class="collapse-custom-li">
                          <el-input placeholder="请填写公司"
                                    v-model="guestInfo.company">
                            <template slot="prepend">公司:</template>
                          </el-input>
                        </li>
                        <li class="collapse-custom-li">
                          <el-input placeholder="请填写邮箱"
                                    v-model="guestInfo.email">
                            <template slot="prepend">邮箱:</template>
                          </el-input>
                        </li>
                      </ul>
                      <el-button size="mini"
                                 type="primary"
                                 @click="saveGuest"
                                 round>保存</el-button>
                    </el-collapse-item>
                  </el-collapse>
                </div>
              </el-tab-pane>
              <el-tab-pane label="联系记录"
                           name="second">
                <div class="tabs-item">
                  <div>
                    <ul>
                      <li class="none-history-msg"
                          @click='getChatMsg'>获取更多历史消息</li>
                      <li v-for="(item,index) in chatList"
                          :key="index">
                        <div>
                          <div class="dialog-title"
                               :class="[item.user_type === 'guest'?'left':'right']">
                            {{item.sender}}<span>{{item.create_time | formatDateTime }}</span>
                          </div>
                          <div class="dialog-item"
                               :class="[item.user_type === 'guest'?'left':'right']">
                            <div class="dialog-box">
                              <img :src="item.image"
                                   v-if="item.image"
                                   class="image-size">
                              <span v-else
                                    v-html="item.content">{{item.content}}</span>
                              <div class="arrow"
                                   :class="[item.user_type === 'guest'?'left':'right']"></div>
                            </div>

                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </el-tab-pane>
            </el-tabs>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>
<script>
import Aside from "../components/aside";
import Header from "../components/header";
import io from 'socket.io-client'
import { $formatDateTime, $msg, $getBase64 } from '@/js/common'
import { api_post, api_get } from '@/api/index'

let cust_socket
let new_msg_socket;
export default {
  components: {
    Aside,
    Header
  },
  data () {
    return {
      content: '', //发送输入框
      tabsCustom: "first",// 左边tabs
      tabsGuest: "first",// 右边tabs
      activeNames: ['1', '2'],//折叠面板
      input1: "cgqezxhx@qq.com",  //客户信息
      customChatList: [],//左边列表
      room_id: '',//中间对话房间
      // sender_id: '',//中间对话发送id
      username: '',//中间对话名字
      pageNo: 1,//中间对话
      chatList: [],//中间对话列表
      // new_u_name: '',//暂时没用
      // new_u_room: '',//暂时没用
      // u_name: '',
      // u_room: '',
      customStatus: [{  // 客服状态
        value: '0',
        label: '离线'
      }, {
        value: '1',
        label: '在线'
      }, {
        value: '2',
        label: '休息'
      }],
      customValue: '1',  // 客服默认状态
      user_type: "customer",

      guestInfo: {
        grade: '普通',
        name: '',
        phone: '',
        company: '',
        email: '',
        industry: '',
        from_page: '',
        launch_page: '',
        browser: '',
        ip: '',
        os: ''
      },
      workmates: [], //同事列表
      status: 'offline'// 客服状态


    }
  },
  filters: {
    formatDateTime (timer) {
      if (!timer) return
      return $formatDateTime(new Date(timer)).slice(11, 16)

    }
  },
  methods: {
    _initNewMsgSocket () {
      // this.customChatList = JSON.parse(sessionStorage.getItem('customChatList')) || []
      let host = document.domain
      new_msg_socket = io.connect('http://' + host + ':5000/newMsg');
      console.log("客服端连接成功")
      let username = 'id1';  //----------默认客服的ID
      new_msg_socket.on('connect', function () {
        new_msg_socket.emit('customer_join', { username, user_type: 'customer', customer_id: username })
      });
      // 左边列表
      new_msg_socket.on('join_resp', function (data) {
        console.log('new_join_resp')
        // let res = JSON.parse(data.message)  //json转对象，暂时没有
      });
      new_msg_socket.on('msg_receive', data => {
        let res = JSON.parse(data)
        console.log('服务的返回消息', res)
        //这块是不是只是处理用户信息这块

        let status = false;
        let findKey = res.room_id.substring(0, res.room_id.lastIndexOf(':'))
        for (let i = 0; i < this.customChatList.length; i++) {
          if (this.customChatList[i].room_id.substring(0, res.room_id.lastIndexOf(':')) == findKey) {
            // this.customChatList[i] = res;
            this.$set(this.customChatList, i, res)
            status = true;
            break;
          }
        };
        status ? '' : this.customChatList.push(res);
        // sessionStorage.setItem('customChatList', JSON.stringify(this.customChatList))
      })
    },

    _initSocket () {
      let host = document.domain
      cust_socket = io.connect('http://' + host + ':5000/chats')
      console.log("客服端连接成功")
      cust_socket.on('connect', data => {
        // console.log("connect:", data)
      });
      let that = this
      cust_socket.emit('customer_join', { username: that.username, user_type: 'customer', room_id: that.room_id })
      cust_socket.on('join_resp', data => {

      });
      cust_socket.on('msg_receive', data => {
        let res = JSON.parse(data)
        // console.log("msg_receive: ", res)
        // this.chatList.push(res)
        // this.scrollToBottom()

        let image;
        let content;
        if (res.content_type == 'image') {
          let isImage = (res.content).slice(0, 10)
          // console.log(isImage)
          if (isImage == 'data:image') {
            image = res.content
          } else {
            $msg("请上传符合类型的图片")
          }
        } else if (res.content_type == 'text') {
          content = (res.content).replace(/\r?\n/g, '<br />')
        }
        let user_type = res.user_type
        let create_time = $formatDateTime(new Date(res.create_time)).slice(11, 16)
        this.chatList.push({
          content,
          create_time,
          sender: res.sender,
          user_type,
          image
        })
        this.scrollToBottom()
      });
      cust_socket.on('customer_msg_receive', function (data) {
        let res = JSON.parse(data.message)
        console.log("customer_msg_receive:", res)
      });
    },
    selectedChat (e) {
      // 防止客服点击多次用户，触发多个socket

      /**
     * 1.当房间号没有时，赋值id
     * 2.接收聊天消息和消息滚动轮
     * 3.判断是不同用户而且没有cust_socket才触发重新socket
     */
      if (!this.room_id) {
        this.room_id = e.id
        this.username = e.sender
      }
      this.selectedChatMsg()
      if (this.room_id === e.id && cust_socket != null) return;
      this.room_id = e.id
      this.username = e.sender
      let id = e.id.split(":")[1]
      this.getGuestInfo(id)
      this._initSocket()
    },
    selectedChatMsg () {
      let param = {
        room_id: this.room_id,
        page_no: this.pageNo,
        page_size: 10
      };
      api_post("http://localhost:5000/customer/getHistoryMsg", JSON.stringify(param), "post", "json").then(resp => {
        // console.log(resp)
        let Marr = JSON.parse(resp.data);
        let arr = []
        Marr.forEach(v => {
          // console.log(v)
          let res = JSON.parse(v)
          let image;
          let content;
          if (res.content_type == 'image') {
            let isImage = (res.content).slice(0, 10)
            // console.log(isImage)
            if (isImage == 'data:image') {
              image = res.content
            } else {
              $msg("请上传符合类型的图片")
            }
          } else if (res.content_type == 'text') {
            content = (res.content).replace(/\r?\n/g, '<br />')
          }
          let user_type = res.user_type
          let create_time = $formatDateTime(new Date(res.create_time)).slice(11, 16)
          arr.unshift({
            content,
            create_time,
            sender: res.sender,
            user_type,
            image
          })
          // arr.unshift(JSON.parse(v))
        })
        // console.log(arr)
        this.chatList = arr
        this.scrollToBottom()
      })
    },
    getChatMsg () {
      if (!this.room_id) return
      // 选中列表时，得到最新消息
      let param = {
        room_id: this.room_id,
        page_no: this.pageNo++,
        page_size: 10
      };
      api_post("http://localhost:5000/customer/getHistoryMsg", JSON.stringify(param), "post", "json").then(resp => {
        // console.log(resp)
        let Marr = JSON.parse(resp.data);
        // let arr = []
        Marr.forEach(v => {
          this.chatList.unshift(JSON.parse(v))
        })
        // this.chatList = arr
      })
    },
    getFile (file, fileList) {
      $getBase64(file.raw).then(res => {
        this.imageB64 = res
        // console.log(res)
        let that = this
        if (!cust_socket) return
        cust_socket.emit('sendMsg', JSON.stringify({
          room_id: that.room_id, id: that.room_id, status: that.status,
          receiver: that.username, sender: "客服001", content: that.imageB64,
          create_time: new Date().getTime(), receiver_id: that.username,
          sender_id: "客服001_id", user_type: "customer", content_type: 'image'
        }));
        // let that = this
        // guest_socket.emit('sendMsg', JSON.stringify({
        //   room_id: that.u_room, id: that.u_room, status: 'online',
        //   receiver: "custom", sender: "访客001", content: that.imageB64,
        //   create_time: new Date().getTime(), receiver_id: that.customer_id,
        //   sender_id: "访客001_id", user_type: that.user_type, content_type: 'image'
        // }));
      });
    },
    getGuestInfo (id) {
      api_post("http://localhost:5000/customer/getGuestInfo", JSON.stringify({ id }), "post", "json").then(resp => {
        let res = JSON.parse(resp.data)
        this.guestInfo = res
      })
    },
    sendMsg () {
      // if (this.content.trim() === '' || cust_socket == null) return
      if (cust_socket == null) {
        $msg("请选择用户对话")
        return;
      }
      else if (this.content.trim() === '') { return; }
      else {
        switch (this.customValue) {
          case '1': {
            let that = this
            cust_socket.emit('sendMsg', JSON.stringify({
              room_id: that.room_id, id: that.room_id, status: that.status,
              receiver: that.username, sender: "客服001", content: that.content,
              create_time: new Date().getTime(), receiver_id: that.username,
              sender_id: "客服001_id", user_type: "customer", content_type: 'text'
            }));
            this.content = ''
            break;
          }
          default: {
            $msg("客服离线，不能发送消息")
            break;
          }
        }
      }
    },
    guestInfoGrade () {
      if (this.guestInfo.grade === '普通') {
        this.guestInfo.grade = "VIP"
      } else {
        this.guestInfo.grade = "普通"
      }
    },
    saveGuest () {
      // 保存客户信息
      let param = this.guestInfo
      if (!this.guestInfo.ip) return
      api_post("http://localhost:5000/customer/saveGuest", JSON.stringify(param), "post", "json").then(res => {
        $msg(res.msg)
      })

    },
    scrollToBottom () {
      // 回复返回底部
      setTimeout(i => {
        this.$nextTick(() => {
          var scrollTo = this.$refs.chatMiddle
          scrollTo.scrollTop = scrollTo.scrollHeight
        })
      }, 100)
    },
    handleCustom (tab, event) {
      // 左边tabs同事列表
      console.log(tab.name);
      switch (tab.name) {
        case 'second':
          let param = {
            id: 'id1'
          }
          if (tab.index) {
            api_post("http://localhost:5000/customer/getWorkmates", JSON.stringify(param), "post", "json").then(resp => {
              let res = JSON.parse(resp.data)
              res.forEach(element => {
                // console.log(JSON.parse(element))
                this.workmates.push(JSON.parse(element))
              });
            })
          }
          break;
      }
    },
    handleClick (tab, event) {
      console.log(tab, event);
    },
    switchCustomStatus (stus) {
      // 选择客服状态
      let param = {
        id: 'id1',
        status: stus
      }
      api_post("http://localhost:5000/customer/updateStatus", JSON.stringify(param), "post", "json").then(res => {
        // console.log(res)
        if (stus == 1) {
          this._initSocket()
        } else if (cust_socket != null) {
          cust_socket.disconnect();
        }
      })
    }
  },
  computed: {
    isDisabledSend () {
      return this.content.trim() === ''
    }
  },
  created () {
    this._initNewMsgSocket()
  }
}
</script>

<style lang="scss" scoped>
.customerServicePanel {
  width: 100%;
  height: 100%;
  min-width: 980px;
  overflow-y: hidden;
}
.custom-info {
  height: calc(100vh - 60px);
  border-right: 1px solid #eee;
  box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.07);
  .custom-header {
    height: 80px;
    width: 100%;
    padding-top: 20px;
    display: flex;
    align-items: center;

    img {
      margin: 0 20px;
      border-radius: 50%;
      width: 60px;
      height: 60px;
    }
  }
  .custom-tabs {
    width: 100%;

    display: flex;
    flex-direction: column;
    height: calc(100vh - 220px);
    overflow-y: auto;

    // background-color: #eee;
    .custom-chat {
      display: flex;
      width: 100%;
      height: 68px;
      // background-color: #ffb600;
      box-sizing: border-box;
      border-bottom: 1px solid #eee;
      padding: 12px 50px 12px 20px;
      position: relative;
      &:hover {
        background-color: #e4f8f2;
      }
      .custom-chat-img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        margin-right: 10px;
      }
      .custom-chat-item {
        display: flex;
        flex-direction: column;

        overflow: hidden;
        .custom-chat-item-name {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          font-size: 14px;
        }
        .custom-chat-item-text {
          padding-top: 6px;
          white-space: nowrap;
          overflow: hidden;
          font-size: 13px;
          text-overflow: ellipsis;
        }
      }
      .custom-chat-time {
        position: absolute;
        top: 10px;
        right: 14px;
        font-size: 12px;
      }
    }
  }
}
.tabs-item {
  height: calc(100vh - 132px);
  min-width: 260px;
  overflow-y: auto;
}
// 公用聊天样式
.none-history-msg {
  text-align: center;
  font-size: 12px;
  color: #666;
  cursor: pointer;
  padding-top: 10px;
}
.dialog-title {
  display: flex;
  height: 40px;
  line-height: 40px;
  font-size: 16px;
  color: #666;
  margin: 0 20px;
  span {
    font-size: 14px;
    margin: 0 10px;
  }
  &.right {
    flex-direction: row-reverse;
  }
}
.dialog-item {
  display: flex;
  font-size: 14px;
  position: relative;

  &.right {
    justify-content: flex-end;
  }
  .dialog-box {
    max-width: 60%;
    min-width: 30px;
    min-height: 30px;
    line-height: 1.3;
    padding: 7px;
    box-sizing: border-box;
    word-break: break-word;
    background-color: #f5f5f5;
    border-radius: 6px;
    font-size: 14px;
    margin: 0 20px 10px;
    color: #666666;
    position: relative;
    &.right {
      background-color: #eaf6f2;
    }
    .image-size {
      width: 100%;
      height: 100%;
      max-width: 100px;
      max-height: 100px;
    }
    .arrow {
      position: absolute;
      top: 7px;
      width: 0;
      height: 0;
      border: solid 8px;
      background-color: transparent;
      &.left {
        left: -14px;
        border-color: transparent #f5f5f5 transparent transparent;
      }
      &.right {
        right: -14px;
        border-color: transparent transparent transparent #eaf6f2;
      }
    }
  }
}
// 公用聊天样式
.chat-header {
  display: flex;
  height: 80px;
  flex-direction: column;
  .chat-header-title {
    padding-left: 10px;
    line-height: 40px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    vertical-align: middle;
    border-bottom: 1px solid #f0f0f0;
  }
  .chat-header-desc {
    padding-left: 10px;
    line-height: 40px;
    font-size: 14px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    vertical-align: middle;
    border-bottom: 1px solid #f0f0f0;
  }
}
.chat-middle {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 315px);
  overflow: auto;
  width: 100%;
}

.chat-fonter {
  border-top: 1px solid #ddd;
  padding: 30px 15px 15px;
  box-sizing: border-box;
  // background-color: #f5f5f5;
  position: relative;
  font-size: 14px;
  .upload-image {
    position: absolute;
    top: 8px;
    left: 30px;
    font-size: 20px;
  }
  .textarea {
    width: 100%;
    height: 124px;
    outline: none;
    resize: none;
    padding: 8px;
    box-sizing: border-box;
    border: none;
  }
  .send {
    position: absolute;
    bottom: 20px;
    right: 30px;
  }
}
.collapse-custom-li {
  margin-bottom: 10px;
}
.custom-btn {
  margin-left: 5px;
  padding: 3px 10px;
  border: 1px solid transparent; //自定义边框
  outline: none;
  border-radius: 5px;
  &.vip {
    color: #fff;
    font-weight: bold;
    background-color: #ffb600;
  }
}
.collapse-li {
  display: flex;
  margin-bottom: 5px;
  .collapse-name {
    min-width: 60px;
  }
  a {
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
