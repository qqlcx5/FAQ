<template>
  <div class="clientIM-box">
    <section class="clientIM">
      <header>
        <img class="service"
             src="../assets/img/icon/gift.png"
             alt="">
        <el-select v-model="customer_id"
                   placeholder="请选择"
                   @change="selCustomer">
          <el-option v-for="item in customer_list"
                     :key="item.id"
                     :label='item.state'
                     :value="item.id">
          </el-option>
        </el-select>
      </header>
      <section class="middle-content"
               ref="middleContent">
        <ul>
          <li class="none-history-msg"
              @click='selectedChatMsg'>获取更多历史消息</li>

          <li v-for="(item,index) in chatList"
              :key="index">
            <div>
              <div class="dialog-title"
                   :class="[item.user_type === 'guest'?'right':'']">
                {{item.sender}}<span>{{item.create_time}}</span>
              </div>
              <div class="dialog-item "
                   :class="[item.user_type === 'guest'?'right':'']">
                <div class="dialog-box ">
                  <!-- <span v-html="item.content">{{item.content}}</span> -->
                  <img :src="item.image"
                       v-if="item.image"
                       class="image-size">
                  <span v-else
                        v-html="item.content">{{item.content}}</span>
                  <div class="arrow "
                       :class="[item.user_type === 'guest'?'right':'left']">
                  </div>
                  <el-tag size="mini"
                          class="dialog-tag"
                          :hit='false'
                          :class="[item.user_type === 'guest'?'right':'left']">{{item.status === "online" ? "已读" : '未读'}}</el-tag>
                </div>

              </div>
            </div>
          </li>
        </ul>
      </section>

      <section class="fonter">
        <el-row type="flex"
                class="row-bg">
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
                     @click="sendMsg">发送</el-button>
        </el-row>
      </section>
    </section>

  </div>
</template>

<script>
import { $formatDateTime, $msg, $getBase64 } from '@/js/common.js'
import {  $getBrowserInfo,
  $getOS} from '@/js/pcInfo'
import io from 'socket.io-client'
import { api_post } from '@/api/index'
let title = document.getElementsByTagName("title");
let guest_socket
export default {
  name: 'clientIM',
  data () {
    return {
      content: "", //发送内容
      customer_list: [],//所有客服列表
      customer_id: 'id1', // 默认客服的Id
      chatList: [],  //对话列表
      u_room: '',
      user_type: "guest",
      customStatus: 'online',
      pageNo: 1,
      imageB64: '',
      isNowPage: 1

    }
  },
  computed: {
    isDisabledSend () {
      return this.content.trim() === ''
    },
  },
  methods: {
    getFile (file, fileList) {
      $getBase64(file.raw).then(res => {
        this.imageB64 = res
        // console.log(res)
        let that = this
        guest_socket.emit('sendMsg', JSON.stringify({
          room_id: that.u_room, id: that.u_room, status: 'online',
          receiver: "custom", sender: "访客001", content: that.imageB64,
          create_time: new Date().getTime(), receiver_id: that.customer_id,
          sender_id: "访客001_id", user_type: that.user_type, content_type: 'image'
        }));
      });
    },
    _initSocket () {
      let host = document.domain
      guest_socket = io.connect('http://' + host + ':5000/chats');
      console.log("访客端连接成功")
      // 发送相关参数，加入房间
      let that = this
      let username = "用户"
      guest_socket.on('connect', function () {
        guest_socket.emit('join', { username, customer_id: that.customer_id, user_type: that.user_type });
      });
      // 遍历客服列表
      guest_socket.on('join_resp', data => {
        let res = JSON.parse(data.message)
        this.u_room = res.u_room
        if (res.customer_users != null) {
          let customer_list = res.customer_users
          customer_list.forEach((item, index) => {
            if (item.status === 'online') {
              customer_list[index].state = customer_list[index].name + '（在线）'
            }
            else {
              customer_list[index].state = customer_list[index].name + '（离线）'
            }
          });
          this.customer_list = customer_list
          // console.log(this.customer_list)
        }
      })
      // 接收服务端消息
      guest_socket.on('msg_receive', data => {
        console.log("服务端返回消息: ", data)
        let res = JSON.parse(data);
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
          image,
          status: res.status
        })
        // console.log(this.isNowPage, 'msg_receive_this.isNowPage')
        if (!this.isNowPage) {
          this.a = setInterval(() => {
            title[0].innerHTML = "【新消息！】" + res.sender + "发消息过来";
            this.b = setTimeout(() => {
              title[0].innerHTML = '海迈智能客服机器人管理系统'
            }, 1000)
          }, 2000)
        }
        this.scrollToBottom()
      });
      guest_socket.on('connecting', function () {
        // console.log("正在连接");
        $msg("正在连接")
      });
      guest_socket.on('connect_failed', function () {
        // console.log("连接失败");
        $msg("连接失败")
      });
      guest_socket.on('reconnect', function () {
        // console.log("成功重连");
        $msg("成功重连")
      });
      guest_socket.on('reconnecting', function () {
        // console.log("正在重连");
        $msg("正在重连")
      });
      guest_socket.on('reconnect_failed', function () {
        // this.socketStatus = 0;
        // console.log("重连失败");
        $msg("重连失败")
      });
      guest_socket.on('disconnect', function () {
        // this.socketStatus = 0;
        // console.log("断开连接");
        $msg("断开连接")
      });

    },
    sendMsg () {
      if (this.content.trim() === '') return
      let t = this.customer_list.findIndex((v) => {
        return v.id === this.customer_id
      })
      // console.log(this.customer_list[t].status)
      let status = this.customer_list[t].status
      status === "online" ? 'online' : 'offline'
      console.log(status)
      let that = this
      guest_socket.emit('sendMsg', JSON.stringify({
        room_id: that.u_room, id: that.u_room, status,
        receiver: "custom", sender: "访客001", content: that.content,
        create_time: new Date().getTime(), receiver_id: that.customer_id,
        sender_id: "访客001_id", user_type: that.user_type, content_type: 'text'
      }));
      this.content = ''
    },
    scrollToBottom () {
      // 回复返回底部
      setTimeout(() => [
        this.$nextTick(() => {
          var scrollTo = this.$refs.middleContent
          scrollTo.scrollTop = scrollTo.scrollHeight
        })
      ], 100)

    },

    selCustomer (id) {
      if (this.customer_id == id) return
      this.customer_id = id
      this._postGuestInfo(this.u_room.split(":")[1])
      this._initSocket()
    },
    _postGuestInfo (ip) {
      // 选择客服将得到用户设备等信息发送
      let param = {
        browser: $getBrowserInfo()[1],
        os: $getOS(),
        // ip: $getOuterIP(),
        ip,
        launch_page: document.URL,
        from_page: document.referer,
        name: "127.0.0.1"
      }
      // let param = this.param
      // console.log(param, "param")
      api_post("http://localhost:5000/customer/saveGuest", JSON.stringify(param), "post", "json").then(resp => {
        // console.log(resp)
      })
    },
    selectedChatMsg () {
      // 选中列表时，得到最新消息
      let param = {
        room_id: this.u_room,
        page_no: this.pageNo++,
        page_size: 10
      };

      api_post("http://localhost:5000/scustomer/getHistoryMsg", JSON.stringify(param), "post", "json").then(resp => {
        // console.log(resp)
        let Marr = JSON.parse(resp.data);

        Marr.forEach(v => {
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
          this.chatList.unshift({
            content,
            create_time,
            sender: res.sender,
            user_type,
            image
          })
        })
      })
    },
    isCurrentPage () {
      // html5 api 当前页面
      document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
          // console.log("其他页面")
          this.isNowPage = 0
        } else {
          // console.log("now页面")
          this.isNowPage = 1
          clearTimeout(this.b)
          clearInterval(this.a)
          title[0].innerHTML = '海迈智能客服机器人管理系统'
        }
      })
    }
  },
  created () {
    this._initSocket()
    this.isCurrentPage()
  }
}
</script>
<style lang="scss" scoped>
.clientIM-box {
  height: 100vh;
  width: 100%;
  overflow: hidden;
  .clientIM {
    display: flex;
    flex-direction: column;
    min-width: 300px;
    header {
      height: 60px;
      line-height: 60px;
      width: 100%;
      background-color: #ddd;
      .service {
        margin: 0 20px;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        vertical-align: middle;
      }
    }
    .middle-content {
      display: flex;
      flex-direction: column;
      height: calc(100vh - 220px);
      overflow: auto;

      .none-history-msg {
        text-align: center;
        font-size: 12px;
        color: #666;
        cursor: pointer;
        margin-top: 10px;
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
          min-height: 30px;
          line-height: 20px;
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
          .dialog-tag {
            position: absolute;
            bottom: 0px;

            &.left {
              right: -50px;
            }
            &.right {
              left: -50px;
            }
          }
        }
      }
    }
    .fonter {
      .row-bg {
        border-top: 1px solid #ddd;
        padding: 15px;
        // background-color: #f5f5f5;
        position: relative;
        .upload-image {
          position: absolute;
          top: 10px;
          left: 20px;
          font-size: 20px;
        }
        .textarea {
          width: 100%;
          height: 124px;
          outline: none;
          resize: none;
          padding: 20px 5px 5px;
          box-sizing: border-box;
          border: none;
        }
        .send {
          position: absolute;
          bottom: 20px;
          right: 30px;
        }
      }
    }
  }
}
</style>
