# Bopomofo.js
H5可以使用的汉字转拼音库
1. 实现汉字转拼音
2. 实现汉语单词转拼音
3. 实现汉语句子转拼音，在一定程度解决多音字问题

# 拼音搜索引擎
官网在线搜索：[pinyin.rnkrsoft.com](https://pinyin.rnkrsoft.com) ，当发现不能正确解析词语读音，可以来这里维护词库，向我们提出申请。

## 原理
1. 获取当前汉字的unicode值，如果在[19968,40869]中文区间，则执行第2步，否则直接输出（可能为符号，数字，英文字母或其他语系）
2. 检查当前汉字是否在多音字库中，如果存在返回该汉字发音的拼音和汉字序列数组，将当前句子上下文进行序列匹配，如果能够匹配，则为该发音。如果无返回，则进入第三步
3. 维护一个拼音与汉字映射的字库，遍历字库查找该拼音发音的汉字序列，将当前汉字与汉字序列进行检查是否在其中，如果在其中则返回该拼音。

## API

```js
/**
 * 将汉字句子转换拼音，支持声母带音调，数字音调，无音调三种格式
 * @param {Object} words 句子
 * @param {Object} toneType 拼音样式 0-声母带音调，1-数字音调在最后，2-无音调，默认值0
 * @param {Object} upper 是否大写,默认为假（小写）
 * @param {Object} cap 是否首字母大写,在upper为假时有效,默认为假（小写）
 * @param {Object} split 分割符号，默认一个空格
 * @return 拼音
 */
function pinyin(words, toneType, upper, cap, split) {
    //输出拼音
}
```



例如：

```js
var v1 = pinyin('中国人！',0, false, false, ' ');
console.log(v1);//控制台输出 zhōng guó rén！
var v2 = pinyin('患难与共的兄弟！！',1, false, false, ' ');
console.log(v2);//控制台输出 huan4 nan4 yu3 gong4 de0 xiong1 di4！！
var v3 = pinyin('this is a pinyin library!这是一个汉语拼音库！！',2, false, false, ' ');
console.log(v3);//控制台输出 this is a pinyin library! zhe shi yi ge han yu pin yin ku！！
```

##  Bopomofo-jquery.js
Bopomofo.js在jQuery下的集成，通过$.bopomofo.pinyin();调用汉语转换为拼音。通过jQuery构建bopomofo对象，并调用pinyin()函数。

```js
	var bopomofo = $.bopomofo();
{
	var v1 = bopomofo.pinyin('中国人！');
	console.log(v1);
	assertEquals('zhōng guó rén！', v1);
}
{
	var v1 = bopomofo.pinyin('中国人！',0);
	console.log(v1);
	assertEquals('zhōng guó rén！', v1);
}
{
	var v1 = bopomofo.pinyin('中国人！',0, false);
	console.log(v1);
	assertEquals('zhōng guó rén！', v1);
}
{
	var v1 = bopomofo.pinyin('中国人！',0, true);
	console.log(v1);
	assertEquals('ZHŌNG GUÓ RÉN！', v1);
}
{
	var v1 = bopomofo.pinyin('中国人！',0, false, false);
	console.log(v1);
	assertEquals('zhōng guó rén！', v1);
}
{
	var v1 = bopomofo.pinyin('中国人！',0, true, false);
	console.log(v1);
	assertEquals('ZHŌNG GUÓ RÉN！', v1);
}
{
	var v1 = bopomofo.pinyin('中国人！',0, true, true);
	console.log(v1);
	assertEquals('ZHŌNG GUÓ RÉN！', v1);
}
{
	var v1 = bopomofo.pinyin('中国人！',0, false, true);
	console.log(v1);
	assertEquals('Zhōng Guó Rén！', v1);
}
{
	var v1 = bopomofo.pinyin('中国人！',0, false, false, ',');
	console.log(v1);
	assertEquals('zhōng,guó,rén！', v1);
}
{
	var v1 = bopomofo.pinyin('中国人！',0, false, true, ',');
	console.log(v1);
	assertEquals('Zhōng,Guó,Rén！', v1);
}
{
	var v1 = bopomofo.pinyin('中国人！',0, true, true, ',');
	console.log(v1);
	assertEquals('ZHŌNG,GUÓ,RÉN！', v1);
}
{
	var v1 = bopomofo.pinyin('患难与共的兄弟！！');
	console.log(v1);
	assertEquals('huàn nàn yǔ gòng de xiōng dì！！', v1);
}
{
	var v1 = bopomofo.pinyin('患难与共的兄弟！！',1);
	console.log(v1);
	assertEquals('huan4 nan4 yu3 gong4 de0 xiong1 di4！！', v1);
}
{
	var v1 = bopomofo.pinyin('患难与共的兄弟！！',1, false);
	console.log(v1);
	assertEquals('huan4 nan4 yu3 gong4 de0 xiong1 di4！！', v1);
}
{
	var v1 = bopomofo.pinyin('患难与共的兄弟！！',1, false, false);
	console.log(v1);
	assertEquals('huan4 nan4 yu3 gong4 de0 xiong1 di4！！', v1);
}
{
	var v1 = bopomofo.pinyin('患难与共的兄弟！！',1, false, false, ',');
	console.log(v1);
	assertEquals('huan4,nan4,yu3,gong4,de0,xiong1,di4！！', v1);
}
{
	var v1 = bopomofo.pinyin('this is a pinyin library!这是一个汉语拼音库！！');
	console.log(v1);
	assertEquals('this is a pinyin library! zhè shì yī gè hàn yǔ pīn yīn kù！！', v1);
}
{
	var v1 = bopomofo.pinyin('this is a pinyin library!这是一个汉语拼音库！！',2);
	console.log(v1);
	assertEquals('this is a pinyin library! zhe shi yi ge han yu pin yin ku！！', v1);
}
{
	var v1 = bopomofo.pinyin('this is a pinyin library!这是一个汉语拼音库！！',2, false);
	console.log(v1);
	assertEquals('this is a pinyin library! zhe shi yi ge han yu pin yin ku！！', v1);
}
{
	var v1 = bopomofo.pinyin('this is a pinyin library!这是一个汉语拼音库！！',2, false, false);
	console.log(v1);
	assertEquals('this is a pinyin library! zhe shi yi ge han yu pin yin ku！！', v1);
}
{
	var v1 = bopomofo.pinyin('this is a pinyin library!这是一个汉语拼音库！！',2, false, false, ',');
	console.log(v1);
	assertEquals('this is a pinyin library!,zhe,shi,yi,ge,han,yu,pin,yin,ku！！', v1);
}
```