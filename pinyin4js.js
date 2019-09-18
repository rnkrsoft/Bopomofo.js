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
	(upper == undefined || upper == null) ? upper = false : upper;
	(cap == undefined || cap == null) ? cap = false : cap;
	(split == undefined || split == null) ? ' ' : split;
	var result = [];
	//0为不需要处理，1为单音字，2为已处理的多音字
	var types = [];
	var lastPolyphoneIndex = 0;
	var name;
	var reg = new RegExp('[a-zA-Z0-9\- ]');
	for (var i = 0, len = words.length; i < len; ) {
		var _char = words.substr(i, 1);
		var unicode = _char.charCodeAt(0);
		//如果unicode在符号，英文，数字或其他语系，则直接返回
		if (unicode > 40869 || unicode < 19968) {
			result.push(_char);
			types.push(0);
		} else {//如果是支持的中文，则获取汉字的所有拼音
			var pys = getPinyins(_char);
			if(pys.length == 1){//单音字
				var py = pys[0];
				result.push(py);
				types.push(1);
			}else if(pys.length > 1){//多音字，需要进行特殊处理
				//
				var data = getPolyphoneWord(words, _char, i, lastPolyphoneIndex);
				if(data != null){
					for (var k = 0; k < data.words.length; k++) {
						result[i - data.offset + k] = data.words[k];
						types[i - data.offset + k] = 2;
					}
					//修正偏移，有可能当前字是词组中非第一个字
					i = i - data.offset + data.words.length - 1 ;
					//最后处理过的多音字位置，以防止一个多音字词组有多个多音字，例如患难与共，难和共都是多音字
					lastPolyphoneIndex = i;
				}else{//没有找到多音字的词组，默认使用第一个发音
					var py = pys[0];
					result.push(py);
					types.push(1);
				}
			}else{//未发现
				result.push(_char);
				types.push(0);
			}
		}
		i++;
	}
	return handlePinyin(result, types, toneType, upper, cap, split);
}
/**
 * 进行拼音处理
 * @param {Object} result
 * @param {Object} types
 * @param {Object} toneType
 * @param {Object} upper
 * @param {Object} cap
 * @param {Object} split
 */
function handlePinyin(result, types, toneType, upper, cap, split){
	//aeiouü
	var vowels = "aeiouv";
	var toneVowels = "āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ";
	var pys = "";
	for (var i = 0; i < result.length; i++) {
		var py = result[i];
		var type = types[i];
		var py1 = '';
		if(type == 1 || type == 2){//如果是拼音或者多音字
			if(toneType == 1 || toneType == 2){//如需要数字声调或者无声调
				var tone = -1;//音调数字形式
				for(var idx in py){
					var k = -1;
					var w = py[idx];
					//寻找在有声调声母中的位置
					if((k = toneVowels.indexOf(w)) > -1){
						tone = (k % 4);
						//计算当前声母在无音调声母的位置
						var pos = parseInt(k / 4);
						py1+=vowels[pos];
					}else{
						//原样
						py1+=w;
					}
				}
				//如果是带音调数字形式，则将音调添加到末尾
				py1 = py1 + (toneType == 1 ? tone + 1 : '');
			}else{
				py1 = py;
			}
			if (upper) {
				py1 = py1.toUpperCase();
			} else {
				py1 = cap ? capitalize(py1) : py1;
			}
			py1 = split.length > 0 && pys.length > 0 ? split + py1 : py1;
		}else{//如果不需要处理的非拼音
			py1 = py;
		}
		pys += py1;
	}
	return pys;
}
/**
 * 获取多音字词，返回时返回替换起始位置和结束位置
 * @param {Object} words 句子 
 * @param {Object} current 当前字
 * @param {Object} pos 当前汉字的位置
 * @param {Object} type 拼音样式 0-声母带音调，1-音调在最后，2-无音调，默认值0
 */
function getPolyphoneWord(words, current, pos, lastPolyphoneIndex, type){
	var pinyinSeparator = ","; // 拼音分隔符
	for(var w in window.polyphones){
		var len = w.length;
		var beginPos = pos - len;
		beginPos = Math.max(lastPolyphoneIndex, beginPos);
		var endPos = Math.min(pos + len, words.length);
		var temp = words.slice(beginPos, endPos);
		var index = -1;
		if((index = temp.indexOf(w)) > -1){
			//当前汉字在多音字词组的偏移位置，用于修正词组的替换
			var offset = w.indexOf(current);
			return {words: window.polyphones[w].split(pinyinSeparator), offset: offset};
		}
	}
	return null;
}
/**
 * 获取一个汉字的所有拼音
 * @param {Object} hanzi 汉字
 * @param {Object} type 0-声母带音调，1-音调在最后，2-无音调，默认值0
 */
function getPinyins(hanzi){
	var pinyinSeparator = ","; // 拼音分隔符
	var pys = window.pinyins[hanzi];
	var result = [];
	if(!pys){//如果不存在拼音
		return result;
	}
	var pysArray = pys.split(pinyinSeparator);
	return pysArray;
}

/**
 * 单个汉字拼音，进行首字母大写
 * @param {Object} py 单个汉字拼音
 */
function capitalize(py){
	if(py.length>0){
		var first = py.substr(0, 1).toUpperCase();
		var spare = py.substr(1, py.length);
		return first + spare;
	}else{
		return word;
	}
}