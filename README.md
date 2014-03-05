# 智能提示
智能提示对与搜索非常重要，相对于机器学习来说，可以称为 **集体学习**，用集体智慧来识别用户查询，用很小的成本换来较大的收益

数据采用utf-8编码，可以支持中文，英文或者任意语言

nodejs能够稳定运行在生成环境，推荐使用pm2部署


### 使用方法
- `git clone git@code.csdn.net:lutaf/autocomplete.git`
-  node main.js
-  浏览器 访问  http://127.0.0.1:7000/

### 数据格式
data/eng.txt 有一份demo数据
- 文本文件，一行一条数据
- 词语和权重值用 tab分隔

### 安装pm2

```bash
npm install pm2 -g
pm2 start main.js -i 4
``` 

