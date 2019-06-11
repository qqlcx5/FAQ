const path = require('path');
const SpritesPlugin = require('webpack-spritesmith'); //处理sprit

const templateFunction = function (data) {
  //sprit
  // console.log(data.sprites);
  const shared = '.w-icon { background-image: url(I); }'.replace(
    'I',
    data.sprites[0].image
  );
  // 注意：此处默认图标使用的是二倍图
  const perSprite = data.sprites
    .map(function (sprite) {
      // background-size: SWpx SHpx;
      return '.w-icon-N {width: SWpx; height: SHpx; }\n.w-icon-N .w-icon, .w-icon-N.w-icon { width: Wpx; height: Hpx; background-position: Xpx Ypx; } '
        .replace(/N/g, sprite.name)
        .replace(/SW/g, sprite.width / 2)
        .replace(/SH/g, sprite.height / 2)
        .replace(/W/g, sprite.width)
        .replace(/H/g, sprite.height)
        .replace(/X/g, sprite.offset_x)
        .replace(/Y/g, sprite.offset_y);
    })
    .join('\n');

  return shared + '\n' + perSprite;
};

module.exports = {
  baseUrl: './',

  assetsDir: 'static', //静态打包至static,
  outputDir: 'dist',
  devServer: {
    port: '9190',
    proxy: {
      '/': {
        target: 'http://192.168.102.54:8090',
        ws: false
      }
    }
  },
  css: {
    sourceMap: true
  },
  configureWebpack: {
    plugins: [
      new SpritesPlugin({
        //输入
        src: {
          cwd: path.resolve(__dirname, './src/assets/img/icon'),
          glob: '*.png'
        },
        // 输出
        target: {
          image: path.resolve(__dirname, './src/assets/sass/sprite.png'),
          css: [
            [
              path.resolve(__dirname, './src/assets/sass/sprite.scss'),
              {
                format: 'function_based_template'
              }
            ]
          ]
        },
        customTemplates: {
          function_based_template: templateFunction
        },
        // 样式文件中调用雪碧图地址写法
        apiOptions: {
          cssImageRef: '~@/assets/sass/sprite.png?v=' + Date.parse(new Date())
        },
        spritesmithOptions: {
          algorithm: 'binary-tree',
          padding: 4
        }
      })
    ]
  },
  // chainWebpack: config=>{
  //   config.module.rule('vue')
  //   .use('vue-loaderr')
  //       .loader('vue-loader')
  //       .tap(options => {
  //         return {
  //           ...options,
  //           cssModules: {
  //             localIdentName: '[path][name]---[local]---[hash:base64:5]',
  //             camelCase: true
  //           }
  //         }
  //       })
  // },
  transpileDependencies: [/\bvue-echarts\b/, /\bresize-detector\b/]
};