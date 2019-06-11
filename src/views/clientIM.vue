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
          <li class="none-history-msg">无更多历史消息</li>
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
                  <span v-html="item.content">{{item.content}}</span>
                  <div class="arrow "
                       :class="[item.user_type === 'guest'?'right':'left']"></div>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </section>
      <section class="fonter">
        <el-row type="flex"
                class="row-bg">
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
import { $formatDateTime, $msg } from '@/js/common.js'
import {  $getBrowserInfo,
  $getOS} from '@/js/pcInfo'
import io from 'socket.io-client'
import { api_post } from '@/api/index'
let guest_socket
export default {
  name: 'clientIM',
  data () {
    return {
      content: "", //发送内容
      customer_list: [],//所有客服列表
      customer_id: 'id1', // 默认客服的Id
      chatList: [],  //对话列表
      u_name: '',
      u_room: '',
      user_type: "guest"
    }
  },
  computed: {
    isDisabledSend () {
      return this.content.trim() === ''
    }
  },
  methods: {
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
        this.u_name = res.u_name
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
          console.log(this.customer_list)
        }
      })
      // 接收服务端消息
      guest_socket.on('msg_receive', data => {
        console.log("服务端返回消息: ", data)
        let res = JSON.parse(data);
        let create_time = $formatDateTime(new Date(res.create_time)).slice(-5)
        let content = (res.content).replace(/\r?\n/g, '<br />')
        this.chatList.push({
          content,
          create_time,
          sender: res.sender,
          user_type: res.user_type
        })
        this.content = ''
        this.scrollToBottom()
        
        // let title = document.getElementsByTagName("title");
        // title[0].innerHTML = '改成你想要的字';
        // console.log(title, 'title')
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
      // if (!this.isDisabledSend) return
      let that = this
      guest_socket.emit('sendMsg', JSON.stringify({
        room_id: that.u_room, id: that.u_room, status: 'online',
        receiver: "custom", sender: "访客001", content: that.content,
        create_time: new Date().getTime(), receiver_id: that.customer_id,
        sender_id: "访客001_id", user_type: that.user_type, content_type: 'text'
      }));

    },
    scrollToBottom () {
      // 回复返回底部
      this.$nextTick(() => {
        var scrollTo = this.$refs.middleContent
        scrollTo.scrollTop = scrollTo.scrollHeight
      })
    },

    selCustomer (id) {
      // console.log(id);
      this.customer_id = id
      this._initSocket()
      this._postGuestInfo(this.u_room.split(":")[1])
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
      console.log(param, "param")
      api_post("http://localhost:5000/customer/saveGuest", JSON.stringify(param), "post", "json").then(resp => {
        console.log(resp)
      })
    },
  },
  created () {
    this._initSocket()

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
    }
    .fonter {
      .row-bg {
        border-top: 1px solid #ddd;
        padding: 15px;
        // background-color: #f5f5f5;
        position: relative;
        .textarea {
          width: 100%;
          height: 124px;
          outline: none;
          resize: none;
          padding: 10px;
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
