#  FAQ（智能客服）

- 项目区分 **客户端聊天界面** **后台管理系统** 两大模块，UI框架采用 ``element-ui``。

  - 客户端聊天界面
	- 核心
	基于 `Sockit.IO即时通讯`
	- 发送图片
	基于 HTML5 `FileReader()`API将图片转成base64
	- 访客端聊天界面功能优化
		1. 滚动条美化
		2. 发送消息，消息置底
		3. 接收消息，标签栏消息闪烁
		4. 异步更新数据
	- 客服端聊天界面
		1. 接受消息，如果是同一用户，重叠消息，显示最新消息
		2. 获取用户的IP、浏览器、操作系统信息
		3. 查看用户和同事的对话消息
  - 聊天部分展示
  ![faq](https://github.com/qqlcx5/FAQ/blob/master/src/assets/img/faq.gif)
  - 后台管理系统
    1. 具有权限功能，导航守卫阶段拦截，权限用户信息存储在 本地 ``sessionStorage``
    2. 富文本采用了 ``wangeditor``，拆分了获取代码的组件

- 工具库

  - 公共函数：``/src/js/common.js``
  - 处理大数据的查询接口参数：``/src/js/queryParam.js``
  - 处理请求返回的数据格式，针对各个图表``/src/js/polar.js``

- 图片处理

  大图采用webP格式（后续兼容需重新处理格式）

  icon使用sprite处理。采用webpack的``SpritesPlugin``自动处理

  部分icon使用压缩后的svg，使用``vue-sv-icon``插件

  还有``font-awesome``

- 其他

  - ECharts：使用了vue-echarts

    



