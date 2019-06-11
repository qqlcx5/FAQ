#  FAQ（智能客服）

- 项目区分 **客户端聊天界面** **后台管理系统** 两大模块，UI框架采用 ``element-ui``。

  - 客户端聊天界面
    1. 路由地址 ``/index``
    2. 输入框有自定义了事件，绑定了防抖函数
    3. 新开了 移动端界面的适配（采用 ``Sockit.IO即时通讯``）

  - 后台管理系统
    1. 具有权限功能，导航守卫阶段拦截，权限用户信息存储在 本地 ``sessionStorage``
    2. 富文本采用了 ``wangeditor``，拆分了获取代码的组件
    3. **IM** 系统需要开发从头开发

- 源码地址： http://192.168.102.10/svn/HMAI/SCL/05_Code/trunk/FRONT_END

- 部署地址：http://192.168.102.10/svn/HMAI/SCL/05_Code/trunk/BDM360_FAQ/rest_api

  部署方式采用后端部署，只需将打包后的文件覆盖至此位置即可

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

    



