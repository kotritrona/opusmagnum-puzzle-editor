window.addEventListener('load', function(evt) {
	'use strict';
	d3.select("#say-chinese").on("click", sayChinese);
});

function sayChinese() {
	'use strict';
	d3.select("body").style("font-family", "'\u5FAE\u8F6F\u96C5\u9ED1'");
	d3.select("#meta").html(d3.select("#meta").html().replace("Puzzle Name", "\u6807\u9898"));
	d3.select("#toolbox-title").html("\u5de5\u5177\u7bb1");
	d3.select("#reagent-title").html("\u539f\u6599");
	d3.select("#output-title").html("\u4ea7\u54c1");
	d3.select("#reagent-add").html("\u589e\u52a0");
	d3.select("#output-add").html("\u589e\u52a0");
	d3.select("#inst-title").html("\u7269\u4ef6");
	d3.select("#savefile").html("\u4fdd\u5b58\u6587\u4ef6");
	d3.select("#big-title").html("Opus\x20Magnum\u81ea\u5236\u5173\u5361\u7f16\u8f91\u5668");
	var c = ["\u673a\u68b0\u81c2", "\u591a\u91cd\u81c2", "\u6d3b\u585e\u81c2", "\u8f68\u9053", "\u952e\u5408\u7b26\u6587", "\u6d88\u9664\u7b26\u6587", "\u591a\u91cd\u952e\u5408\u7b26\u6587", "\u4e09\u952e\u7b26\u6587", "\u9499\u5316\u7b26\u6587", "\u590d\u5236\u7b26\u6587", "\u6295\u5c04\u7b26\u6587", "\u7eaf\u5316\u7b26\u6587", "\u6cdb\u7075\u7b26\u6587", "\u56de\u6536\u7b26\u6587", "\u4ee5\u592a\u7b26\u6587", "\u6293\u53d6/\u8f6c\u5411\u6307\u4ee4", "\u653e\u4e0b\u6307\u4ee4", "\u8fd8\u539f\u6307\u4ee4", "\u91cd\u590d\u6307\u4ee4", "\u81ea\u8f6c\u6307\u4ee4", "\u8303\u8d1d\u7f57"];
	d3.selectAll(".inst-label").html(function(d, i) {
		return c[i];
	});
	d3.select("#disclaimer").html("<p>\u6ce8\u610f\u4e8b\u9879\uff1a</p><p>\u7528\u8fd9\u79cd\u5de5\u5177\u4fee\u6539\u51fa\u6765\u7684\u5173\u5361\u6709\u53ef\u80fd\u4f1a\u5bfc\u81f4\u6e38\u620f\u5d29\u6e83\u3002<br />\u5982\u679c\u6e38\u620f\u5d29\u6e83\u4e86\u7684\u8bdd\uff0c\u628a\u5bfc\u81f4\u5d29\u6e83\u7684\u6587\u4ef6\u66ff\u6362\u6210\u6b63\u5e38\u7684\u6587\u4ef6\uff08\u6bd4\u5982\u9ed8\u8ba4\u7684\u90a3\u4e2a\uff09\u5373\u53ef\u3002</p><p>\u7279\u522b\u662f\u8fd9\u51e0\u79cd\u60c5\u51b5\u7279\u522b\u5bb9\u6613\u5d29\u6e83\uff1a<br />1. \u653e\u4e86\u4e24\u4e2a\u91cd\u590d\u5143\u7d20\u3002<br />2. \u628a\u91cd\u590d\u5143\u7d20\u653e\u5230\u6709\u95ee\u9898\u7684\u5730\u65b9\u3002<br />3. \u4e0d\u5b8c\u5168\u8fde\u63a5\u7684\u5206\u5b50\uff0c\u53ea\u80fd\u653e\u5728\u53f3\u4e0a\u89d260\xb0\u7684\u533a\u57df\uff0c\u4e0d\u7136\u5bb9\u6613\u5d29\u6e83\u3002<br />4. \u4e00\u4e2a\u952e\u4e24\u8fb9\u90fd\u6ca1\u8fde\u539f\u5b50\u3002<br />5. \u8138\u9ed1\u3002</p><p>\u53e6\u5916\uff0c\u6587\u4ef6\u8981\u653e\u5728{\u6587\u6863\\My Games\\Opus Magnum\\[steam ID]\\custom\\}\u4e0b\u9762\u3002<br />\u7279\u522b\u611f\u8c22d3js, jsbn\u9879\u76ee\u548caperture\u7f16\u5199\u7684steam\u6307\u5357\u3002</p>");
}
