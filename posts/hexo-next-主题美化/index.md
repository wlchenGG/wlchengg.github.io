# Hexo NexT 主题美化



本文记录对 Hexo 博客所做的初次配置。

<!--more-->

### 主题设置

#### 侧边菜单栏
<div align="center"><img src="https://fastly.jsdelivr.net/gh/wlchenGG/PicBed/images_for_blogs/Hexo-NexT-主题美化_20210724005042_2021-07-24-00-50-44.png" alt="Hexo-NexT-主题美化_20210724005042_2021-07-24-00-50-44" width="75%" align="center"/></div>

#### 侧边栏头像
<div align="center"><img src="https://fastly.jsdelivr.net/gh/wlchenGG/PicBed/images_for_blogs/Hexo-NexT-主题美化_20210724004758_2021-07-24-00-47-59.png" alt="Hexo-NexT-主题美化_20210724004758_2021-07-24-00-47-59" width="75%" align="center"/></div>

#### 侧边栏插入网易云音乐外链

##### 单曲外链

打开单曲主页，生成外链：
<div align="center"><img src="https://fastly.jsdelivr.net/gh/wlchenGG/PicBed/images_for_blogs/Hexo-NexT-主题美化_20210724160017_2021-07-24-16-00-19.png" alt="Hexo-NexT-主题美化_20210724160017_2021-07-24-16-00-19" width="75%" align="center"/></div>

复制外链 HTML 代码：
<div align="center"><img src="https://fastly.jsdelivr.net/gh/wlchenGG/PicBed/images_for_blogs/Hexo-NexT-主题美化_20210724160118_2021-07-24-16-01-20.png" alt="Hexo-NexT-主题美化_20210724160118_2021-07-24-16-01-20" width="75%" align="center"/></div>

将代码至于标签下：
```html
<div class="sidebar-inner>
  <!--网易云插件-->
  <iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="//music.163.com/outchain/player?type=2&id=25780279&auto=1&height=66"></iframe>
</div>
```

##### 歌单外链

<div align="center"><img src="https://fastly.jsdelivr.net/gh/wlchenGG/PicBed/images_for_blogs/Hexo-NexT-主题美化_20210724153821_2021-07-24-15-38-22.png" alt="Hexo-NexT-主题美化_20210724153821_2021-07-24-15-38-22" width="75%" align="center"/></div>

如果出现以上的版权限制，按照[链接](https://blog.51cto.com/u_13640625/3033164)进行以下操作，：
<div align="center"><img src="https://fastly.jsdelivr.net/gh/wlchenGG/PicBed/images_for_blogs/Hexo-NexT-主题美化_20210724154510_2021-07-24-15-45-12.png" alt="Hexo-NexT-主题美化_20210724154510_2021-07-24-15-45-12" width="75%" align="center"/></div>

组合成外链地址：https://music.163.com/#/outchain/0/37673790/
但很遗憾，弹出**生成失败**的提示，应该是版权限制。
挖个坑，有时间来补充解决方案。

##### Pjax 实现背景音乐全局播放

页面跳转刷新时，音乐不间断播放。
打开主题目录下 themes/next/layout/_layout.njk 文件，
在 **\</head>** 标签前添加以下代码，并保存。
```html
  <head>
  <!--pjax：防止跳转页面音乐暂停-->
  <script src="https://fastly.jsdelivr.net/npm/pjax@0.2.8/pjax.js"></script>
  </head>
```

主题配置文件_config.yml里，打开 pjax 开关。
```yml
# Easily enable fast Ajax navigation on your website.
# For more information: https://github.com/next-theme/pjax
pjax: true
```
**参考：**

[Hexo NexT 博客增加网易云音乐](http://nineone.online/2018/06/11/2018/Hexo%20NexT%20%E5%8D%9A%E5%AE%A2%E5%A2%9E%E5%8A%A0%E7%BD%91%E6%98%93%E4%BA%91%E9%9F%B3%E4%B9%90/)

[Hexo + Next 主题实现全局播放背景音乐](https://iluis.gitee.io/2020/04/09/Hexo%E5%AE%9E%E7%8E%B0%E5%85%A8%E5%B1%80%E6%92%AD%E6%94%BE%E8%83%8C%E6%99%AF%E9%9F%B3%E4%B9%90/)

#### 主页文章阴影效果

打开 \themes\next\source\css\\_commom\components\posts\index.styl，修改 .use-motion 下的 .post-block 代码，如下：

```styl
// 主页添加阴影效果
.use-motion {
  if (hexo-config('motion.transition.post_block')) {
    .post-block {
      visibility: hidden;
      margin-top: 60px;
      margin-bottom: 60px;
      padding: 25px;
      background: rgba(255,255,255,0.9) none repeat scroll !important;
      -webkit-box-shadow: 0 0 5px rgba(202, 203, 203, .5);
      -moz-box-shadow: 0 0 5px rgba(202, 203, 204, .5);
    }
    .pagination, .comments {
      visibility: hidden;
    }
  }
```

效果如下：

<div align="center"><img src="https://i.loli.net/2021/07/26/P18x7EitRoh6fNb.png" alt="Hexo-NexT-主题美化_20210726224616_2021-07-26-22-46-17" width="75%" align="center"/></div>

#### 修改文章底部标签图标样式

打开 themes/next/_config.yml，搜索并将 tag_icon 项打开。原样式为"#"。

```yml
tag_icon: true
```
<div align="center"><img src="https://i.loli.net/2021/07/26/scn2FAldJg4e1Ou.png" alt="Hexo-NexT-主题美化_20210726224932_2021-07-26-22-49-33" width="75%" align="center"/></div>

#### 文章置顶（作废）

打开 `themes\next\layout\_macro\post.njk`，在 `post-meta-container`中添加以下代码：
```
{% if post.top %}
<i class="fa fa-thumb-tack"></i>
<font color=7D26CD>置顶</font>
<span class="post-meta-divider">|</span>
{% endif %}
```

<div align="center"><img src="https://i.loli.net/2021/07/27/xAfiQWFwpKogMVv.png" alt="Hexo-NexT-主题美化_20210727001828_2021-07-27-00-18-30" width="75%" align="center"/></div>

#### 文章手动排序

打开 `node_modules/hexo-generator-index/lib/generator.js`，修改代码为：

```javascript
"use strict";

const pagination = require("hexo-pagination");
const { sort } = require("timsort");

module.exports = function (locals) {
  var config = this.config;
  var posts = locals.posts;
  posts.data = posts.data.sort(function (a, b) {
    if (a.top && b.top) {
      // 两篇文章top都有定义
      if (a.top == b.top) return b.date - a.date;
      // 若top值一样则按照文章日期降序排
      else return b.top - a.top; // 否则按照top值降序排
    } else if (a.top && !b.top) {
      // 以下是只有一篇文章top有定义，那么将有top的排在前面（这里用异或操作居然不行233）
      return -1;
    } else if (!a.top && b.top) {
      return 1;
    } else return b.date - a.date; // 都没定义按照文章日期降序排
  });

  var paginationDir = config.pagination_dir || "page";
  var path = config.index_generator.path || "";

  return pagination("", posts, {
    perPage: config.index_generator.per_page,
    layout: ["index", "archive"],
    format: paginationDir + "/%d/",
    data: {
      __index: true,
    },
  });
};
```

<div align="center"><img src="https://i.loli.net/2021/07/27/CaviJ7cOVpBLfqH.png" alt="Hexo-NexT-主题美化_20210727002324_2021-07-27-00-23-25" width="75%" align="center"/></div>

在博文源文件头部加上 `top` 标识，数字越大，优先级越高：
<div align="center"><img src="https://i.loli.net/2021/07/27/xlhWeXnczkLVEdI.png" alt="Hexo-NexT-主题美化_20210727003736_2021-07-27-00-37-38" width="75%" align="center"/></div>

**参考：**
[hexo 博文置顶方法——大专栏](https://www.dazhuanlan.com/2020/03/08/5e63fc7f2febe/)

#### 折叠过长代码块（按[参考](https://www.toimc.com/hexo-usage-2/)未成功）

##### 添加 `code-unfold.js` 文件

新建以下代码折叠脚本文件，放在 `themes/next/source/js/`下。
```javascript
var CODE_MAX_HEIGHT = 200;
var containers = [];

// 展开
$('body').on('click', '.js_unfold_code_btn', function () {
  $(this).closest('.js_highlight_container').addClass('on');
});
// 收起
$('body').on('click', '.js_retract_code_btn', function () {
  var $container = $(this).closest('.js_highlight_container').removeClass('on');
  var winTop = $(window).scrollTop();
  var offsetTop = $container.offset().top;
  $(this).css('top', 0);
  if (winTop > offsetTop) {
    // 设置滚动条位置
    $('body, html').animate({
      scrollTop: $container.offset().top - CODE_MAX_HEIGHT
    }, 600);
  }
});
// 滚动事件，触发动画效果
$(window).on('scroll', function () {
  var scrollTop = $(window).scrollTop();
  var temp = [];
  for (let i = 0; i < containers.length; i++) {
    var item = containers[i];
    var { $container, height, $hide, hasHorizontalScrollbar } = item;
    if ($container.closest('body').length === 0) {
      // 如果 $container 元素已经不在页面上, 则删除该元素
      // 防止pjax页面跳转之后，元素未删除
      continue;
    }
    temp.push(item);
    if (!$container.hasClass('on')) {
      continue;
    }
    var offsetTop = $container.offset().top;
    var hideBtnHeight = $hide.outerHeight();
    // 减去按钮高度，减去底部滚动条高度
    var maxTop = parseInt(height - (hasHorizontalScrollbar ? 17 : 0) - hideBtnHeight);
    let top = parseInt(
      Math.min(
        Math.max(scrollTop - offsetTop, 0), // 如果小于 0 ，则取 0
        maxTop,// 如果大于 height ，则取 height
      )
    );
    // 根据 sin 曲线设置"收起代码"位置
    var halfHeight = parseInt($(window).height() / 2 * Math.sin((top / maxTop) * 90 * (2 * Math.PI/360)));
    $hide.css('top', Math.min(top + halfHeight, maxTop));
  }
  containers = temp;
});

// 添加隐藏容器
function addCodeWrap($node) {
  var $container = $node.wrap('<div class="js_highlight_container highlight-container"><div class="highlight-wrap"></div></div>').closest('.js_highlight_container');

  // 底部 "展开代码" 与 侧边栏 "收起代码"
  var $btn = $(`
    <div class="highlight-footer">
      <a class="js_unfold_code_btn show-btn" href="javascript:;">展开代码<i class="fa fa-angle-down" aria-hidden="true"></i></a>
    </div>
    <a class="js_retract_code_btn hide-btn" href="javascript:;"><i class="fa fa-angle-up" aria-hidden="true"></i>收起代码</a>
  `);

  $container.append($btn);
  return $container;
};

function codeUnfold () {
  $('.highlight').each(function () {
    // 防止重复渲染
    if (this.__render__ === true) {
      return true;
    }
    this.__render__ = true;
    var $this = $(this);
    var height = $(this).outerHeight();
    if (height > CODE_MAX_HEIGHT) {
      // 添加展开&收起容器
      var $container = addCodeWrap($this, height);
      containers.push({
        $container,
        height,
        $hide: $container.find('.js_retract_code_btn'),
        hasHorizontalScrollbar: this.scrollWidth > this.offsetWidth,
      });
    }
  });
};
```
##### 添加 `JQuery`

在`next`主题中全局引用 `code-unfold.js`：

在文件 `themes/next/layout/_scripts/index.njk`最后添加以下代码：
```
{{- next_js('code-unfold.js') }}
```
在文件 `themes/next/source/js/next-boot.js`中：
```javascript
NexT.boot.refresh = function () {
  // 函数体内末尾添加下面一行代码
  codeUnfold()
```

##### 添加样式

创建文件 `themes/next/source/css/_commom/components/highlight.styl`：
```styl
// 展开收起效果
.highlight-container
  position: relative
  background-color: highlight-background
  &.on
    .highlight-footer
      display: none
    .hide-btn
      display: flex
    .highlight-wrap
      max-height: none
  .highlight-wrap
    overflow: hidden
    max-height: 200px
  .highlight-footer
    position absolute
    width: 100%
    left: 0
    bottom: 0
    height: 60px
    background-image: 'linear-gradient(-180deg, rgba(255,255,255,0) 0%, %s 65%)' % highlight-background;
    text-align: center
  .show-btn
    font-size: 12px
    color: #fff
    position: absolute
    left: 50%
    transform: translateX(-50%)
    bottom: 0
    line-height: 2em
    text-decoration: none
    padding: 0 0.8em
    text-align: center
    border-radius: 4px 4px 0
    &:hover
      text-decoration: none
  .hide-btn
    color: #fff
    font-size: 12px
    width: 22px
    position: absolute
    left: -21px
    top: 0
    line-height: 1em
    text-decoration: none
    text-align: center
    display: none
    flex-direction: column
    background-color: highlight-background
    border-radius: 4px 0 0 4px
    padding: 0.1em 0 0.6em
    transition: top ease 0.35s
  .fa-angle-up,
  .fa-angle-down
    font-style: normal
    color: #fff
  .fa-angle-up:before
    content:"\f106"
  .fa-angle-down:before
    content:"\f107"
    margin-left: 0.5em
  .js_unfold_code_btn, .js_retract_code_btn
    background: rgba(0,0,0,0.5)
    border-bottom: none !important
    &:hover
      border-bottom-color: none !important
```

在 `themes/next/source/css/_commom/components/index.styl` 中引用样式：
```styl
// 添加这一行
@import 'highlight';
```

**参考：**
[hexo 博客代码折叠功能——Coding World](https://www.toimc.com/hexo-usage-2/)

#### 腾讯公益404页面

新建 **404.html** 页面，写入以下代码，将文件存入主题的 source 目录下。

```html
<!DOCTYPE HTML>
<html>
<head>
  <meta http-equiv="content-type" content="text/html;charset=utf-8;"/>
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
  <meta name="robots" content="all" />
  <meta name="robots" content="index,follow"/>
  <link rel="stylesheet" type="text/css" href="https://qzone.qq.com/gy/404/style/404style.css">
</head>
<body>
  <script type="text/plain" src="http://www.qq.com/404/search_children.js"
          charset="utf-8" homePageUrl="/"
          homePageName="回到我的主页">
  </script>
  <script src="https://qzone.qq.com/gy/404/data.js" charset="utf-8"></script>
  <script src="https://qzone.qq.com/gy/404/page.js" charset="utf-8"></script>
</body>
</html>
```

#### 页脚展示建站时间


<div align="center"><img src="https://fastly.jsdelivr.net/gh/wlchenGG/PicBed/images_for_blogs/Hexo-NexT-主题美化_20210724012910_2021-07-24-01-29-12.png" alt="Hexo-NexT-主题美化_20210724012910_2021-07-24-01-29-12" width="75%" align="center"/></div>

#### 字数与阅读时长统计

站点配置文件
``` yml
symbols_count_time:
  time: true                   # 文章阅读时长
  symbols: true                # 文章字数统计
  total_time: true             # 站点总阅读时长
  total_symbols: true          # 站点总字数统计
  exclude_codeblock: true      # 排除代码字数统计
```


主题配置文件
``` yml
symbols_count_time:
  separated_meta: false   # 是否另起一行显示（即不和发表时间等同一行显示）
  item_text_post: true    # 首页文章统计数量前是否显示文字描述（本文字数、阅读时长）
  item_text_total: true   # 页面底部统计数量前是否显示文字描述（站点总字数、站点阅读时长）
```

#### 博客配置

##### PicGo 插入图片格式

将 Picgo 的 Custom Output Format 属性值设置为以下代码段
```html
<div align="center"><img src="${url}" alt="${uploadedName}" width="75%" align="center"/></div>
```
如下图所示：
<div align="center"><img src="https://fastly.jsdelivr.net/gh/wlchenGG/PicBed/images_for_blogs/Hexo-NexT-主题美化_20210724151157_2021-07-24-15-11-58.png" alt="Hexo-NexT-主题美化_20210724151157_2021-07-24-15-11-58" width="75%" align="center"/></div>



#### 常见问题

##### 主题在本地能渲染，而部署到Github后丢失主题

作为个人主页时，
<div align="center"><img src="https://fastly.jsdelivr.net/gh/wlchenGG/PicBed/images_for_blogs/Hexo-NexT-主题美化_20210724144005_2021-07-24-14-40-06.png" alt="Hexo-NexT-主题美化_20210724144005_2021-07-24-14-40-06" width="75%" align="center"/></div>

作为项目主页时，
<div align="center"><img src="https://i.loli.net/2021/07/28/jKweLPFbaMqu93N.png" alt="20210728031654" width="75%" align="center"/></div>

### 参考

[Hexo Next 主题详细配置之一]( https://www.techgrow.cn/posts/755ff30d.html)——Clay

