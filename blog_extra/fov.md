>  空空如也 有的时候也指脑子

### 前言
最一开始是看 [roguelike](http://www.roguebasin.com/index.php/Articles) 系列，有点好奇是怎么实现的，就在这里记录下。
全文参考了[这篇文章](https://legends2k.github.io/2d-fov/design.html)(其实就是翻译一下，文化人的事能叫抄吗🤪)


-----
首先考虑最简单的模型，检测**一条射线与一条线段**相交。  
一种常用的判定方法是用二者的参数方程。  

线段的两个顶点 A$(x_0, y_0)$ B$(x_1, y_1)$
$$ \begin{cases}
    x_{segment} = x_0 + (x_1 - x_0) t_1 \\
    y_{segment} = y_0 + (y_1 - y_0) t_1 \\
\end{cases}
(0 < t_1 < 1)
$$

射线的一个顶点C$(x_2, y_2)$ 另外一个点D$(x_3, y_3)$ 可以取射线上的任意一点
$$ \begin{cases}
    x_{ray} = x_2 + (x_3 - x_2) t_2 \\
    y_{ray} = y_2 + (y_3 - y_2) t_2 \\
\end{cases}
(t_2 > 0)
$$
二者相交的条件就是 
$$ 
\begin{cases}
    x_{segment} = x_{ray} \\
    y_{segment} = y_{ray} \\
\end{cases}
$$
方程联立解出有效的$t_1$, $t_2$，那么就可以说明射线与线段相交了。








----
#### 直线的参数方程
定义 定点A$(x_0,y_0)$，$\theta$ 为直线与x轴正方向夹角，那么动点P$(x, y)$ 与参数$t$ 构成的方程为：
$$ \begin{cases}
    x = x_0 + t \cos \theta \\
    y = y_0 + t \sin \theta \\
\end{cases} $$
所有的这样的点P构成了这条直线





