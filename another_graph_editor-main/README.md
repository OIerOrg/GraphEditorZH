# 另一个图编辑器

一个受到 [CS Academy 的图编辑器](https://csacademy.com/app/graph_editor/) 启发的图编辑器，专为竞赛编程设计。

使用 React、Typescript、Tailwind CSS 和 HTML Canvas 制作。

<p align="center">
    <img src="screenshots/main.png?" />
</p>

<p align="center">
<em>多组件图示例</em>
</p>

## 特性

- 常见输入格式：
  - 边的列表 `u v [w]`，表示从节点 `u` 到节点 `v` 的一条边，其中 `w` 是可选的边标签。
  - Leetcode 风格的邻接列表字符串，如 `[[2,4],[1,3],[2,1],[4,3]]`；确保字符串内不要有空格。
  - 父子数组，其中 `p[i]` 和 `c[i]` 表示从节点 `p[i]` 到 `c[i]` 的边。
  - 假设有非零数量的节点，你还可以给每个节点标记。这在提供一个数组 `a` 时很有用，其中 `a[i]` 对应于节点 `i` 的值。
- 标签偏移（将零索引的输入转换为一索引，反之亦然）
- 暗色/浅色主题
- 无向/有向模式
- 普通/树模式
- 显示/隐藏桥和割点
- 显示/隐藏组件

<p align="center">
    <img src="screenshots/parentChild.png?" />
</p>

<p align="center">
<em>父子输入格式示例</em>
</p>

<p align="center">
    <img src="screenshots/leetcode.png?" />
</p>

<p align="center">
<em>Leetcode 风格的邻接列表同样适用于边</em>
</p>

> [!NOTE]
> *树模式* 和 *桥* 仅适用于无向图。

> [!NOTE]
> 对于有向图，显示的是 **强连通分量**。

## 配置

除了浅色/深色主题，还有三个滑块可用于调整 *节点半径*、*线条粗细* 和 *边长*。你的配置将保留在刷新后。

> [!NOTE]
> 当节点半径改变时，字体大小会相应缩放以保持可读性。

默认情况下，图处于 *力导向模式*，其中边缘将所有内容结合在一起，而节点相互排斥，创建出类似太空的效果。要禁用此行为，只需切换 *锁定模式*。

## 使用

根据需要调整输入格式，然后输入数据！

> [!IMPORTANT]
> 如果你来自像 [Codeforces](https://codeforces.com/) 这样的平台，输入数据包含 `n m`，表示顶点和边的数量，请 **省略** 这些数据在粘贴测试用例时。
> 同样，如果你有一个数组 `p`，其中 `p[i]` 代表 `i` 的父节点，请确保父数组与子数组对齐。

> [!TIP]
> 输入单个节点时，输入 `u` 或 `u u`。

> [!TIP]
> 当输入节点标签时，如果要跳过特定节点，请使用字符 `_` 作为占位符。

### 树模式

在此模式下，输入数据中出现的 *第一个* 节点将成为根节点。

<p align="center">
    <img src="screenshots/twoRootBefore.png?" />
</p>

<p align="center">
<em>节点 1 是原始根节点</em>
</p>

要设置一个任意根节点，比如节点 2，进入 *根节点* 部分，输入 `2`，它将成为树的根节点。在有多个树的情况下，只需输入所有根节点的逗号分隔列表。需要注意的是，如果在 *根节点* 部分输入两个属于同一棵树的节点，先输入的节点将优先，即如果你输入 `2 1`，那么节点 2 是根节点，但如果你输入 `1 2`，那么节点 1 是根节点。

<p align="center">
    <img src="screenshots/twoRootAfter.png?" />
</p>

<p align="center">
<em>节点 2 是新的根节点</em>
</p>

如果图不是一棵树，会显示 **DFS 树**，其中 *回边* 显示为虚线。

<p align="center">
    <img src="screenshots/dfsTree.png?" />
</p>

<p align="center">
<em>显示桥和割点的 DFS 树</em>
</p>

## 鸣谢

- [CS Academy 的图编辑器](https://csacademy.com/app/graph_editor/)
- [Codeforces](https://codeforces.com/)
- [Atcoder](https://atcoder.jp/)
- [USACO 指南](https://usaco.guide/)
- [-is-this-fft- 的 DFS 树博客](https://codeforces.com/blog/entry/68138)
- [英文版原项目](https://github.com/anAcc22/another_graph_editor)
