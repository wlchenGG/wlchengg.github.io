# 篝火



<style>
.campfire-hero {
    display: flex;
    align-items: stretch;
    gap: 2rem;
    margin: 2rem 0;
}

.campfire-poem {
    flex: 0 0 42%;
    line-height: 2;
    color: inherit;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.campfire-player {
    flex: 1;
    min-width: 0;
    /* 左侧自动继承当前主题背景色（浅色/深色模式均适配），右侧为播放器主题色 */
    background: linear-gradient(
        to right,
        var(--global-background-color, #ffffff) 0%,
        #ffffff 100%
    );
    border-radius: 0;
    overflow: hidden;
    box-shadow: none;
}

.campfire-player .aplayer {
    margin: 0;
    border-radius: 0;
    background: transparent !important;
    box-shadow: none !important;
}

.campfire-player .aplayer-info,
.campfire-player .aplayer-list {
    background: transparent !important;
}

@media (max-width: 768px) {
    .campfire-hero {
        flex-direction: column;
        gap: 1rem;
    }

    .campfire-poem,
    .campfire-player {
        flex: none;
        width: 80%;
    }
}
</style>

<div class="campfire-hero">
    <div class="campfire-poem">
        <p>
            假如全世界的少女都肯携起手来，<br>
            她们可以在大海周围跳一个回旋舞。<br><br>
            假如全世界的男孩都肯做水手，<br>
            他们可以用他们的船在水上造成一座美丽的桥。<br><br>
            那时人们便可以绕着全世界跳一个回旋舞，<br>
            假如全世界的男女孩都肯携起手来。
        </p>
    </div>
    <div class="campfire-player">
        <div id="aplayer"></div>
    </div>
</div>

<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/aplayer/dist/APlayer.min.css">
<script src="https://cdn.jsdelivr.net/npm/aplayer/dist/APlayer.min.js"></script>

<script>
document.addEventListener("DOMContentLoaded", function () {
    const ap = new APlayer({
        container: document.getElementById('aplayer'),

        fixed: false,
        mini: false,
        autoplay: false,
        theme: '#ddb8b3',
        loop: 'all',
        order: 'list',
        preload: 'auto',
        volume: 0.7,
        mutex: true,
        lrcType: 3,
        listFolded: false,
        listMaxHeight: '',
        storageName: 'aplayer-setting',

        audio: [
            {
                name: '小世界',
                artist: '歌之初乐队',
                url: 'https://music.163.com/song/media/outer/url?id=2089729192.mp3',
                cover: 'https://p1.music.126.net/nrkkraN7jkXiEc6bUj3YnQ==/109951168974029682.jpg?param=130y130',
                lrc: 'https://music.163.com/api/song/media?id=2089729192'
            },
            {
                name: '93',
                artist: 'Flora Cash',
                url: 'https://music.163.com/song/media/outer/url?id=2672607235.mp3',
                cover: 'https://p2.music.126.net/wHKNhhtEvp16GpFZrTMPSg==/109951170527953876.jpg?param=130y130',
                lrc: 'https://music.163.com/api/song/media?id=2672607235'
            }
        ]
    });
});
</script>

{{< friend name="CaesarCaser" url="https://wushangyang.cn/" avatar="https://wushangyang.cn/images/avatar.jpg" bio="一壶浊酒喜相逢，来一杯吗" >}}
{{< friend name="Ying Li" url="https://yingli.site/" avatar="https://yingli.site/images/ly.jpg" bio="Tomorrow is another day!" >}}
{{< friend name="KalosAner Blog" url="https://kalosaner.github.io/" avatar="https://avatars.githubusercontent.com/u/65274820" bio="欲速则不达" >}}
{{< friend name="Xiangyi Chen" url="https://xiangyichen.cn/" avatar="https://xiangyichen.cn/authors/admin/avatar_hu7e9cfe221d7b3dd316b78b3ab1e4fa20_203168_270x270_fill_q75_lanczos_center.jpg" bio="Hi, there ~" >}}
{{< friend name="张琪's Blog" url="https://zhangqiblog.top" avatar="https://zhangqiblog.top/uploads/panda.png" bio="自信 学习 行动 自省" >}}
{{< friend name="咸蛋超人" url="https://forrestk3.github.io/" avatar="https://forrestk3.github.io/images/avatar.jpg" bio="Now or Never" >}}
{{< friend name="折影轻梦" url="https://nexmoe.com/" avatar="https://cravatar.cn/avatar/c7fd185f8c967dec20c29c75a40b9e09?s=500" bio="为热爱战斗着，努力学着变得勇敢" >}}
{{< friend name="饼藏的情敌" url="https://zjhzzy.github.io" avatar="https://q.qlogo.cn/g?b=qq&nk=822627809&s=640" bio="在追求梦想的路上，坚持不懈" >}}
{{< friend name="夜轻Blog" url="https://blog.yeqing.net/" avatar="https://blog.yeqing.net/upload/ea055268c8792945de3b9c8d00e1cd08.jpeg" bio="一个人" >}}
{{< friend name="PuddingKC's Blog" url="https://www.puddingkc.com/" avatar="https://www.puddingkc.com/img/avatar.webp" bio="愿你所热爱的依旧不减当年。" >}}
{{< friend name="V2 方圆" url="https://v2fy.com/" avatar="/images/v2fy.png" bio="很全很赞的工具资源导航" >}}
{{< friend name="PCloud" url="https://github.com/HEIGE-PCloud/" avatar="https://avatars.githubusercontent.com/u/52968553?v=4" bio="This is PCloud~💤" >}}



{{< admonition type=tip title="友链互换，请按以下格式留言 😎" open=true >}}
name= "Wlcheng' Life"

url= "https://wlcheng.cc"

avatar= "https://wlcheng.cc/images/avatar.png"

bio= "来日方长，何惧车遥马慢"
{{< /admonition >}}


