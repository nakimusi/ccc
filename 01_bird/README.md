关注公众号，发送 **像素小鸟** 获取源码。

## 玩法介绍

公众号开通了小半年，一直也不知道写点什么，身为一个只会撸码的程序猿，每天写bug，改bug，成了一个循环。写文章这种事，好像离我很遥远。最近一段时间关注了很多技术号，在拜读各位大神的文章时，受到了不少启发。所以也就想着分享一些自己做的东西。

说干就干，趁着这个周末不加班，写了个小游戏，分享给大家。本来准备了一大段FlappyBird的介绍，但想想又删掉了，这么经典的游戏，直接开撸就好了。



## 游戏预览

![游戏预览](https://wuwei-1257813325.cos.ap-chengdu.myqcloud.com/wwww/01_bird_01.gif)





## 功能模块

![模块说明](https://wuwei-1257813325.cos.ap-chengdu.myqcloud.com/wwww/02_bird_02.png)



## 小鸟

小鸟由三张静态图组成，运行时不断的切换显示三张图片，达到小鸟飞翔的效果。

<img src="https://wuwei-1257813325.cos.ap-chengdu.myqcloud.com/wwww/01_bird_06.png"  />

在小鸟节点上添加一个静态刚体组件，目的是在刚进入游戏时小鸟处于静止状态，不会下落。当开始游戏时，会把刚体组件设置为动态，此时小鸟就会受到重力的作用不断的下落。

![代码示例](https://wuwei-1257813325.cos.ap-chengdu.myqcloud.com/wwww/01_bird_03.png)

点击屏幕会时，会给小鸟一个向上的冲力，小鸟受到冲力的作用就会向上移动一段距离，不断点击屏幕，不断的给小鸟添加冲力，小鸟就会越飞越高啦。

![代码示例](https://wuwei-1257813325.cos.ap-chengdu.myqcloud.com/wwww/01_bird_07.png)



## 地面

地面节点由两张草地图片拼接而成，游戏开始运行时，控制两张图片不断向左移动，当一张图移出屏幕后，就把坐标重置另一张图后面，达到地面不断滚动的效果。

在两张草地图片上分别挂一个静态刚体组件，目的是使草地不受重力影响，同时小鸟和草地碰撞后会触发碰撞检测回调，此时就会判定为游戏结束。

<img src="https://wuwei-1257813325.cos.ap-chengdu.myqcloud.com/wwww/01_bird_04.png"  />

![地面移动代码示例](https://wuwei-1257813325.cos.ap-chengdu.myqcloud.com/wwww/01_bird_08.png)



## 管道

管道节点由两组组成，每组有上下两根管道，中间留有200像素的空隙。游戏开始时，两组管道不断向左移动，造成小鸟向前飞的错觉。当一组管道移出屏幕后，把坐标重置到另一组管道的后面，达到不断滚动的效果。

在每个管道节点上分别挂一个静态刚体组件，使管道不受重力影响，同时小鸟和管道碰撞后会触发碰撞检测回调，此时就会判定为游戏结束。

<img src="https://wuwei-1257813325.cos.ap-chengdu.myqcloud.com/wwww/01_bird_05.png"  />

![管道移动代码示例](https://wuwei-1257813325.cos.ap-chengdu.myqcloud.com/wwww/01_bird_09.png)



## 结束界面

结束界面主要显示了两个内容，一个是本场获得分数，一个是历史最高分数，还有一个重新开始的按钮，当点这个按钮的时候，把管道，小鸟，地面都重置为初始状态

![](https://wuwei-1257813325.cos.ap-chengdu.myqcloud.com/wwww/01_bird_10.png)



## 源码

此游戏使用 CocosCreator 2.4.2开发，欢迎体验：

桌面端：http://119.29.119.86/bird/

手机端：http://119.29.119.86/mbird/

长按下方二维码，关注公众号，发送 **像素小鸟** 获取源码。



<img src="https://wuwei-1257813325.cos.ap-chengdu.myqcloud.com/wwww/common_ggh.png" style="zoom:80%;" />

