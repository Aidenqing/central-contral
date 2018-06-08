//var wsUri = "ws://localhost:4649/Echo";
var wsUri = "ws://192.168.2.23:4649/Echo";
//var wsUri = "ws://echo.websocket.org/";
var output;
var websocket;
var consoleLog;
var presetList = [];
var vioceValue = [50, 50, 50, 50, 50, 50, 50, 50];
//全局變量
var lunboShow = $(this);
var lunboLight = $(this);

function init() {
	output = document.getElementById("output");

	consoleLog = document.getElementById("consoleLog");
	testWebSocket();
}

function colorRGB2Hex(color) {
	var rgb = color.split(',');
	var r = parseInt(rgb[0].split('(')[1]);
	var g = parseInt(rgb[1]);
	var b = parseInt(rgb[2].split(')')[0]);

	var hex = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
	return hex;
}

function testWebSocket() {
	if(websocket == null) {
		websocket = new WebSocket(wsUri);
		websocket.onopen = function(evt) {
			onOpen(evt)
		};
		websocket.onclose = function(evt) {
			onClose(evt)
		};
		websocket.onmessage = function(evt) {
			onMessage(evt)
		};
		websocket.onerror = function(evt) {
			onError(evt)
		};
	}

}

function onOpen(evt) {
	writeToScreen("CONNECTED");
	doSend("WebSocket rocks");
}

function onClose(evt) {
	writeToScreen("DISCONNECTED");
}

//--GetCompNameList") //---(finished)----获取公司名称列表

function onMessage(evt) {
	//  writeToScreen('<span style="color: blue;">返回数据: ' + evt.data + '</span>');

	//---解析接收到的json 
	var rcvJson = JSON.parse(evt.data);
	//rcvJson.TypeInfo;
	console.log("接收的类型是:" + rcvJson.TypeInfo);

	if(rcvJson.TypeInfo == "PresetNameList") {
		//--获取全部预设名称
	} else if(rcvJson.TypeInfo == "VideoList") {
		//--获取 视频列表
	} else if(rcvJson.TypeInfo == "RespGetAllVideoList") {
		//---列出全部视频
		//---"TypeInfo":"RespGetAllVideoList","Content":"[\"ddddd_企业介绍_3D打印机.mp4\",\"ddddd_企业介绍_device-2017-09-06-102503.mp4\",....

		var videolist = rcvJson.Content;
		//console.log(rcvJson.Content)
		let html = "";
		$("#content-list").empty();
		for(var i = 0; i < videolist.length; i++) {
			//console.log("视频列表中的视频-----: " + videolist[i]);

			html += "<tr>";

			html += "<td class=\"center\">";
			html += "<label>";
			html += "<input type=\"checkbox\" class=\"ace choose-one\" data-value=\"" + videolist[i].ContentName + "\">";
			html += "<span class=\"lbl\"></span>";
			html += "</label>";
			html += "</td>";
			if(videolist[i].ID.length > 20) {
				html += "<td class=\"select4\"><span>#" + (videolist[i].ID.substring(0, 18) + "...") + "</span></td>";
			} else {
				html += "<td class=\"select4\"><span>#" + videolist[i].ID + "</span></td>";
			}

			html += "<td class=\"select4\">" + videolist[i].ContentName + "</td>";
			html += "<td class=\"hidden-480 select4\">" + videolist[i].ContentType + "</td>";
			html += "<td class=\"select4\">" + videolist[i].UploadDate + "</td>";
			html += "</tr>";
		}
		$("#content-list").append(html);
		contentItemClick();
		contentItemMoreClick();
	} else if(rcvJson.TypeInfo == "RespGetVideoListByComname") {
		//根据公司名称获取对应的播放列表
		//---RespGetVideoListByComname
		var videolist = rcvJson.Content;
		let html = "";
		for(var i = 0; i < videolist.length; i++) {
			//console.log("视频列表的视频-----: " + videolist[i]);
			html += "<tr >";

			html += "<td class=\"select0\">";

			html += "<div class=\"inline\">" + videolist[i] + "</div>"

			html += "</td>";
			html += "<td class=\"center\">";
			html += "<label>";
			html += "<input type=\"checkbox\" data-value=\"" + videolist[i] + "\" class=\"ace\">";
			html += "	<span class=\"lbl\"></span>"
			html += "</label>"
			html += "</td>";
			html += "</tr>";
		}
		$("#add-tbody").empty();
		$("#add-tbody").append(html);
		lineAnyChoosed("select0");
	} else if(rcvJson.TypeInfo == "RespGetLightNamelist") {
		var videolist = rcvJson.Content;
		let html = "";
		let htmlMore = "";
		for(var i = 0; i < videolist.length; i++) {
			//console.log("视频列表的视频-----: " + videolist[i]);
			html += "<tr>";

			html += "<td class=\"select1\">";

			html += "<div class=\"inline\">" + videolist[i] + "</div>"

			html += "</td>";
			html += "<td class=\"center\">";
			html += "<label>";
			html += "<input type=\"checkbox\" data-value=\"" + videolist[i] + "\" class=\"ace\">";
			html += "	<span class=\"lbl\"></span>"
			html += "</label>"
			html += "</td>";
			html += "</tr>";

		}
		$("#add-tbody-light").empty();
		$("#add-tbody-light").append(html);
		lineAnyChoosed("select1");
		//渲染专家模式灯光
		renderProLight(videolist);

	} else if(rcvJson.TypeInfo == "RespGetAllContenttype") {
		var videolist = rcvJson.Content;
		let html = "";
		for(var i = 0; i < videolist.length; i++) {
			//console.log("视频列表的视频-----: " + videolist[i]);
			html += "<tr>";

			html += "<td class=\"select2\">";

			html += "<div class=\"inline\">" + videolist[i] + "</div>"

			html += "</td>";
			html += "<td class=\"center\">";
			html += "<label>";
			html += "<input type=\"checkbox\" data-value=\"" + videolist[i] + "\" class=\"ace\">";
			html += "	<span class=\"lbl\"></span>"
			html += "</label>"
			html += "</td>";
			html += "</tr>";
		}
		$("#add-tbody-volume").empty();
		$("#add-tbody-volume").append(html);

		lineAnyChoosed("select2");
		renderVolumeList(videolist);
	} else if(rcvJson.TypeInfo == "RespGetAllVideoListWithComname") {
		var comvideolists = rcvJson.Content;
		for(var i = 0; i < comvideolists.length; i++) {
			//console.log("视频列表中的视频-----: " + comvideolists[i]);

			var cmvideolst = comvideolists[i];
			//cmvideolst.CompName;
			//console.log("公司名称：-----: " + cmvideolst.CompName);

			//VideoList
			var videolstss = cmvideolst.VideoList;
			for(var j = 0; j < videolstss.length; j++) {
				//console.log("公司名称：: " + cmvideolst.CompName + ",  对应的视频文件：" + videolstss[j]);

			}
		}
	} else if(rcvJson.TypeInfo == "RespPresetNameList") {
		//--接收到的全部预设名称
		var prenamelist = rcvJson.Content;
		for(var i = 0; i < prenamelist.length; i++) {
			//console.log("预设名称-----: " + prenamelist[i]);
		}
	} else if(rcvJson.TypeInfo == "RespGetPresetDataByName") {
		var rxPresetData = rcvJson.Content;
		//console.log("根据预设名称 获得预设数据---: " + labelNamelist);
//		console.log("------预设label---: " + rxPresetData.PresetLabel);
//		console.log("------预设name---: " + rxPresetData.PresetName);
//		console.log("------led灯带预设---: " + rxPresetData.PresetLedBelt);
//		console.log("------照明大灯预设---: " + rxPresetData.PresetLight);

		var rxPresetConttlst = rxPresetData.PresetContents;
		if(rxPresetConttlst.length > 0) {
			for(var k = 0; k < rxPresetConttlst.length; k++) {
				//console.log("预设名称-----: " + rxPresetConttlst[k]);

			}
		}

		var rxPresetVolumelst = rxPresetData.PresetVolumes;
		if(rxPresetVolumelst.length > 0) {
			for(var j = 0; j < rxPresetVolumelst.length; j++) {
				var typeVolume = rxPresetVolumelst[j];
//				console.log("展项类型:: " + typeVolume.ContentType);
//				console.log("音量预设值:: " + typeVolume.VolumeValue);
			}
		}

	} else if(rcvJson.TypeInfo == "RespAllPresetNameWithLable") {
		//RespAllPresetNameWithLable
		var labelNamelist = rcvJson.Content;
		//console.log(labelNamelist)

		for(var i = 0; i < labelNamelist.length; i++) {
			//console.log(labelNamelist[i].PresetLabel);
			let arr = labelNamelist[i].PresetNameList;

			if(labelNamelist[i].PresetLabel == "参展") {
				renderExhibition(arr);
			}
			//灯光
			//console.log(labelNamelist)
			if(labelNamelist[i].PresetLabel == "灯光") {
				
			
				let html = "";
				let arr = labelNamelist[i].PresetNameList;
					let Dindex=getIndex(arr,"Dindex");
				let itemLen = Math.ceil(arr.length / 6);
				if(itemLen > 1) {
					html += "<div id=\"carousel-example2\" class=\"carousel slide\" data-ride=\"carousel\">";
					html += "<div class=\"carousel-inner\">";

					//console.log(itemLen);
					for(let k = 0; k < itemLen; k++) {

						if(k == 0) {
							html += "<div class=\"item active\">";
						} else {
							html += "<div class=\"item\">";
						}

						html += "<div class=\"B_inner\">";
						html += "<div class=\"row\" style=\"overflow:hidden;\">";
						if(k != itemLen - 1) {
							//console.log("k1====" + k)
							for(let j = k * 6; j < k * 6 + 6; j++) {
								let val=arr[j].length>4?(arr[j].substring(0,4)+".."):arr[j];
								html += "<div class=\"col-lg-2\">";
								html += "<div class=\"lunbo-part-light\" data-open=\"0\"><img src=\"res/img/d"+Dindex[j]+".png\" class=\"img-thumbnail lunbo_img\"/>";
								html += "<h3>" + val+ "</h3><div class=\"lunbo-oper-form light-more\"><span class=\"caret\"></span><div class=\"lunbo-operation\"><div class=\"editor\" data-value=\""+arr[j]+"\">编辑</div><div class=\"delete\" data-value=\""+arr[j]+"\">删除</div></div></div></div>";
								html += "</div>";
							}
						} else {
							//console.log("k2====" + k)
							for(let j = (itemLen - 1) * 6; j < arr.length; j++) {
	let val=arr[j].length>4?(arr[j].substring(0,4)+".."):arr[j];
								html += "<div class=\"col-lg-2\">";
								html += "<div class=\"lunbo-part-light\" data-open=\"0\"><img src=\"res/img/d"+Dindex[j]+".png\" class=\"img-thumbnail lunbo_img\"/>";
								html += "<h3>" + val+ "</h3><div class=\"lunbo-oper-form light-more\"><span class=\"caret\"></span><div class=\"lunbo-operation\"><div class=\"editor\" data-value=\""+arr[j]+"\">编辑</div><div class=\"delete\" data-value=\""+arr[j]+"\">删除</div></div></div></div>";
								html += "</div>";
							}
						}
						html += "</div>";
						html += "</div>";
						html += "</div>";
					}

					html += "</div>";

					html += "<div class=\"row\">";
					html += "<ol class=\"carousel-indicators\">";
					for(let shotLen = 0; shotLen < itemLen; shotLen++) {
						if(shotLen == 0) {

							html += "<li data-target=\"#carousel-example2\" data-slide-to=\'" + shotLen + "\' class=\"active\"></li>";
						} else {
							html += "<li data-target=\"#carousel-example2\" data-slide-to=\'" + shotLen + "\'></li>";
						}
					}
					html += "</ol>";
					html += "</div>";

					html += "<a class=\"left btn-move btn_l\" href=\"#carousel-example2\" data-slide=\"prev\">";
					html += "<img src=\"res/img/prev.png\" />";
					html += "</a>";
					html += "<a class=\"right btn-move btn_r\" href=\"#carousel-example2\" data-slide=\"next\">";
					html += "<img src=\"res/img/next.png\" />";
					html += "</a>";
					html += "</div>";
				} else {
					html += "<div class=\"flwx\">";
					html += "<div class=\"item\">";
					html += "<div class=\"B_inner\">";
					html += "<div class=\"row\" style=\"overflow:hidden;\">";
					for(let m = 0; m < arr.length; m++) {
	let val=arr[m].length>4?(arr[m].substring(0,4)+"..."):arr[m];
						html += "<div class=\"col-lg-2\">";
						html += "<div class=\"lunbo-part-light\" data-open=\"0\"><img src=\"res/img/d"+Dindex[m]+".png\" class=\"img-thumbnail lunbo_img\"/>";
						html += "<h3>" + val + "</h3><div class=\"lunbo-oper-form light-more\"><span class=\"caret\"></span><div class=\"lunbo-operation\"><div class=\"editor\" data-value=\""+arr[m]+"\">编辑</div><div class=\"delete\" data-value=\""+arr[m]+"\">删除</div></div></div></div>";
						html += "</div>";

					}
					html += "</div>";
					html += "</div>";
					html += "</div>";
				}
				//	console.log(html);
				$("#lightList").empty();
				$("#lightList").append(html);
				caretLightClick();
				$('#carousel-example2').carousel({
					interval: 2000
				})
					$('#carousel-example2').carousel('pause');
				$(".lunbo-part-light").on('click', function(e) {
					tipsshow();
					let that = $(this);
					lunboLight.children('img').removeClass("lunbo_img_active");
					lunboLight = that;
					that.children('img').addClass("lunbo_img_active");
					exePresetCmdByNameCallback(that.children('h3').text())
					setTimeout(function() {
						tipshide()
					}, 1000);
				});
			}

		}

		for(var i = 0; i < labelNamelist.length; i++) {
			//console.log("预设名称-----: " + labelNamelist[i]);
			//PresetLabel
			var prstLabel = labelNamelist[i].PresetLabel;
			//console.log("预设label---: " + prstLabel);
			var preNamelist = labelNamelist[i].PresetNameList;
			for(var j = 0; j < preNamelist.length; j++) {
				//console.log("预设名称--------: " + preNamelist[j]);
			}
		}

	} else if(rcvJson.TypeInfo == "RespCompNameList") {
		//RespCompNameList
		//RespCompNameList
		//: { "TypeInfo": "RespCompNameList",    "Content": [ "ddddd", "test", "溧阳市新力机械铸造有限公司"
		var compNamelist = rcvJson.Content;
		let html = "";
		$("#modal-add-content").text(compNamelist[0]);
		for(var i = 0; i < compNamelist.length; i++) {
			//console.log("---公司名称-----: " + compNamelist[i]);

			html += "<li value=\"" + compNamelist[i] + "\">" + compNamelist[i] + "</li>"
		}
		$("#content-add-ul").empty();
		$("#content-add-ul").append(html);
		getVideoListByComnameCallback(compNamelist[0]);
		$(".modal-name li").on('click', function(e) {
			let val = $(this).attr('value');
			//console.log(val);

			$('#modal-add-content').text(val);
			getVideoListByComnameCallback(val);
		});
		$("#content-name").text(compNamelist[0]);
		$("#content-contrl-li").empty();
		let html2 = "";
		for(var i = 0; i < compNamelist.length; i++) {
			html2 += "<li data-value=\"" + compNamelist[i] + "\">";
			html2 += "<a ><span>" + compNamelist[i] + "</span></a>";
			html2 += "</li>";
		}
		$("#content-contrl-li").append(html2);
		contentControlClick();
		getVideoInfoListByComnameCallback(compNamelist[0]);
	} else if(rcvJson.TypeInfo == "RespAddNewPresetData") {
		//console.log(rcvJson);
		if(rcvJson.Error != 0) {
			alert(rcvJson.Content);
		} else {
			goBack();
		}

	}

	else if (rcvJson.TypeInfo == "CloseAllThread") {
	    // obj["TypeInfo"] = "CloseAllThread";
	    //   obj["Content"] = "CloseAllThread";

	    var msg = {
	        'type': 'CloseAllThread',
	        'val': 'CloseAllThread'
	    };
	    websocket.send(JSON.stringify(msg));
	}

}

//轮播图倒三角点击
function caretClick(){
	$(".lunbo-oper-form span").on('click', function(e) {
		
		e.stopPropagation();
		if($(this).hasClass('caret-down')){
			$(this).removeClass('caret-down');
		$(this).parent().find('.lunbo-operation').css('display','none');	
		}else{
			$(this).addClass('caret-down');
			$(this).parent().find('.lunbo-operation').css('display','block');	
	
		}
	});
	editPreset();
	deletePreset();
}
function caretLightClick(){
	$(".light-more span").on('click', function(e) {
		
		e.stopPropagation();
		if($(this).hasClass('caret-down')){
			$(this).removeClass('caret-down');
		$(this).parent().find('.lunbo-operation').css('display','none');	
		}else{
			$(this).addClass('caret-down');
			$(this).parent().find('.lunbo-operation').css('display','block');	
	
		}
	});
	editPreset();
	deletePreset();
}
function editPreset(){
	$(".lunbo-operation .editor").on('click', function(e) {
			e.stopPropagation();
	window.location='update.html?keyword='+$(this).data('value');
	});
}
function deletePreset(){
	
	$(".lunbo-operation .delete").on('click', function(e) {
			e.stopPropagation();
	tipsshow();	
	//发送删除协议
	
	getAllPresetNameWithLabelCallback();
	setTimeout(function() {
			tipshide()
		}, 1000);
	});
}
function getUrlParam(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); // 构造一个含有目标参数的正则表达式对象  
	var r = window.location.search.substr(1).match(reg); // 匹配目标参数  
	if(r != null) return unescape(r[2]);
	return null; // 返回参数值  
}

function goBack() {
	window.location = getUrlParam("fromId") == 0 ? "index.html" : "pro-index.html"
}

function onError(evt) {
	writeToScreen('<span style="color: red;">ERROR:</span> ' + evt.data);
}

function doSend(message) {
	writeToScreen("SENT: " + message);
	websocket.send(message);
}

function writeToScreen(message) {
	//  var pre = document.createElement("p");
	//  pre.style.wordWrap = "break-word";
	//  pre.innerHTML = message;
	//  //output.appendChild(pre);
	//  consoleLog.appendChild(pre);
	//  consoleLog.scrollTop = consoleLog.scrollHeight;
	//  while (consoleLog.childNodes.length > 25) {
	//      consoleLog.removeChild(consoleLog.firstChild);
	//  }
}

function clearConsoleLog(el) {
	while(consoleLog.childNodes.length > 0) {
		consoleLog.removeChild(consoleLog.lastChild);
	}
}

function getDataFromSqlCallback(el) {
	if(websocket != null) {

		//console.log("websocket 已经opennn");

		var msg = {
			//'type': 'GET_LABEL_DATA',
			'type': 'GetLabelData',
			'val': '参展'
		};
		websocket.send(JSON.stringify(msg));
	} else {
		//console.log("websocket 已经关闭");
	}
}

function getVideoListCallback(el) {
	if(websocket != null) {

		//console.log("websocket 已经opennn");

		var msg = {
			//'type': 'GET_LABEL_DATA',
			'type': 'GetVideoList',
			'val': 'NULL'
		};
		websocket.send(JSON.stringify(msg));
	} else {
		//console.log("websocket 已经关闭");
	}
}

//getVideoListCallback

function getPresetInfoCallback(el) {
	if(websocket != null) {

		console.log("websocket 已经opennn");

		var msg = {
			//'type': 'GET_LABEL_DATA',
			'type': 'GetPresetDataByName',
			'val': '参展预设测试22'
		};
		websocket.send(JSON.stringify(msg));
	} else {
		console.log("websocket 已经关闭");
	}
}
//---执行换展 播放 指定的播放文件列表
function exeDispListCmdCallback(val) {
	if(websocket != null) {
		console.log("websocket 已经opennn");
		var msg = {
			'type': 'ExeDispListCmd',
			'val': val
		};
		websocket.send(JSON.stringify(msg));
	} else {
		console.log("websocket 已经关闭");
	}
}
//---增加新预设
function addNewPresetDataCallback(PresetLabel, PresetName, PresetLedBelt, PresetLight, PresetContents, PresetVolumes) {
	if(websocket != null) {

		console.log("websocket 已经opennn");
		//console.log(presetLable);
		//console.log(PresetName);
		//console.log(PresetLedBelt);
		//console.log(PresetLight);
		//console.log(PresetContents);
		//console.log(PresetVolumes);
		var msg = {
			//'type': 'GET_LABEL_DATA',
			'type': 'AddNewPresetData',
			'val': {
				"PresetLabel": PresetLabel,
				"PresetName": PresetName,
				"PresetLedBelt": PresetLedBelt,
				"PresetLight": PresetLight,
				"PresetContents": PresetContents,
				"PresetVolumes": PresetVolumes
				//				[{
				//						"ContentType": "三分屏",
				//						"VolumeValue": "15"
				//					},
				//					{
				//						"ContentType": "质量方针",
				//						"VolumeValue": "12"
				//					},
				//					{
				//						"ContentType": "核心设备",
				//						"VolumeValue": "77"
				//					}
				//				]

			}
		};
		websocket.send(JSON.stringify(msg));
	} else {
		console.log("websocket 已经关闭");
	}
}

//---通过文本输入框中的值来查询
function getPresetDataByNameCallback(el) {
	//var newPerson = $("#addPersonTxt").val();
	//if (newPerson == "") return;
	//people.push(newPerson);
	//$("#addPersonTxt").val("");
	//if (socket != null) {
	//    var msg = {
	//        'type': 'ADD_PERSON',
	//        'val': newPerson
	//    };
	//    socket.send(JSON.stringify(msg));
	//}

	var presetName = $("#inpPresetName").val();
	if(presetName == "") return;

	$("#inpPresetName").val("");

	if(websocket != null) {

		console.log("websocket 已经opennn");

		var msg = {
			//'type': 'GET_LABEL_DATA',
			'type': 'GetPresetDataByName',
			'val': presetName
		};
		websocket.send(JSON.stringify(msg));
	} else {
		console.log("websocket 已经关闭");
	}
}

//---执行预设命令 发送命令
function exePresetCmdByNameCallback(presetName) {
	//inpExePresetName

	if(presetName == "") return;

	if(websocket != null) {

		console.log("websocket 已经opennn");

		var msg = {
			'type': 'ExePresetCmdByName',
			'val': presetName
		};
		websocket.send(JSON.stringify(msg));
	} else {
		console.log("websocket 已经关闭");
	}
}

//---列出全部预设名称
function getAllPresetInfoFromSqlCallback(el) {

	//GetAllPresetName
	if(websocket != null) {
		writeToScreen('<span style="color: green;">列出全部预设名称  </span>');

		var msg = {
			'type': 'GetAllPresetName',
			'val': 'NULL'
		};
		websocket.send(JSON.stringify(msg));
	} else {
		console.log("websocket 已经关闭");
	}
}

//列出全部预设名称+预设标签 
function getAllPresetNameWithLabelCallback(el) {
	//GetAllPresetName
	if(websocket != null) {
		//      writeToScreen('<span style="color: green;">列出全部预设名称+预设标签  </span>');

		var msg = {
			'type': 'GetAllPresetNameWithLable',
			'val': 'NULL'
		};
		//添加事件监听
		websocket.addEventListener('open', function() {
			websocket.send(JSON.stringify(msg));
		});

	} else {
		console.log("websocket 已经关闭 --GetAllPresetName");
	}
}

//---获取指定公司名称对应的播放列表
function getVideoListByComnameCallback(compName) {
	//---获取指定公司名称对应的播放列表
	//GetVideoListByComname
	if(websocket != null) {

		var msg = {
			'type': 'GetVideoListByComname',
			'val': compName
		};
		websocket.send(JSON.stringify(msg));
	} else {
		console.log("websocket 已经关闭");
	}
}

//--获取公司名称列表
function getCompnameListCallback(el) {
	////--GetCompNameList") //---(finished)----获取公司名称列表
	if(websocket != null) {
		writeToScreen('<span style="color: green;">列出全部预设名称+预设标签  </span>');

		var msg = {
			'type': 'GetCompNameList',
			'val': 'NULL'
		};
		websocket.addEventListener('open', function() {
			websocket.send(JSON.stringify(msg));
		});
	} else {
		console.log("websocket 已经关闭");
	}
}

//----列出全部视频
function getAllVideoListCallback(el) {
	if(websocket != null) {
		writeToScreen('<span style="color: green;">发送 列出全部视频  </span>');

		var msg = {
			'type': 'GetAllVideoList',
			'val': 'NULL'
		};
		websocket.send(JSON.stringify(msg));
	} else {
		console.log("websocket 已经关闭");
	}
}

//--列出全部公司名称 + 视频列表
function getAllVideoListWithComnameCallback(el) {
	//GetAllVideoListWithComname
	//GetAllVideoListWithComname
	if(websocket != null) {

		console.log("websocket 已经opennn");

		var msg = {
			'type': 'GetAllVideoListWithComname',
			'val': 'NULL'
		};
		websocket.send(JSON.stringify(msg));
	} else {
		console.log("websocket 已经关闭");
	}
}

//--列出 展项类型 比如企业介绍 资质等，本质还是IP地址
function getAllContenttypeCallback(el) {
	if(websocket != null) {

		console.log("websocket 已经opennn");

		var msg = {
			'type': 'GetAllAllContenttype',
			'val': 'NULL'
		};
		websocket.addEventListener('open', function() {
			websocket.send(JSON.stringify(msg));
		});
	} else {
		console.log("websocket 已经关闭");
	}
}

//---获取照明灯光名称列表
function getLightNamelistCallback(el) {
	//GetLightNamelist
	if(websocket != null) {
		console.log("websocket 已经opennn");
		var msg = {
			'type': 'GetLightNamelist',
			'val': 'NULL'
		};
		websocket.addEventListener('open', function() {
			websocket.send(JSON.stringify(msg));
		});
	} else {
		console.log("websocket 已经关闭");
	}
}

function getVideoInfoListByComnameCallback(val) {
	////根据公司名称 获取视频详细列表
	//GetVideoInfoListByComname
	console.log(val);
	if(websocket != null) {

		var msg = {
			'type': 'GetVideoInfoListByComname',
			'val': val
		};
		//      console.log(val);
		//	websocket.addEventListener('open', function() {
		//			websocket.send(JSON.stringify(msg));
		//		});
		websocket.send(JSON.stringify(msg));
	} else {
		console.log("websocket 已经关闭");
	}
}

//音量控制
////--音量控制--对某个IP对应的音量控制 表现为对某个展项类型的音量控制
function setVolumeCtrlCallback(name, val) {
	//	console.log(name+val)
	//GetLightNamelist
	if(websocket != null) {
		console.log("websocket 已经opennn");
		var msg = {
			'type': 'SetVolumeCtrl',
			'val': {
				'ContentType': name,
				'VolumeValue': val,
			}
		};
		websocket.send(JSON.stringify(msg));
	} else {
		console.log("websocket 已经关闭");
	}
}

function setVolumeCtrlListCallback(data) {
	//	console.log(name+val)
	//GetLightNamelist
	if(websocket != null) {
		console.log("websocket 已经opennn");
		var msg = {
			'type': 'SetVolumeCtrlList',
			'val': data
		};
		websocket.send(JSON.stringify(msg));
	} else {
		console.log("websocket 已经关闭");
	}
}
//--对某个大灯控制 对某个灯的亮灭
function setLightControlCallback(val) { //"SetLightCtrl"
	console.log(val);
	// //val='01' 表示对第0个灯打开  第1位数字表示灯的序号（即对哪个灯控制），第2个数字表示灯的状态(开灯还是关灯 0表示关灯 1表示开灯)  
	if(websocket != null) {
		console.log("websocket 已经opennn");
		var msg = {
			'type': 'SetLightCtrl',
			'val': val
		};
		websocket.send(JSON.stringify(msg));
	} else {
		console.log("websocket 已经关闭");
	}
}

function renderPresetList() {

	$("#content-preset").empty();
	presetList = addPresetName();
	if(presetList == "" || presetList == undefined) return;
	let len = presetList.length
	let html = "";
	for(let i = 0; i < len; i++) {
//		let val = presetList[i].split('_');
//		let type=0;
//		if(val[1]=="灯光"){
//			type=1;
//		}
		html += "<div class=\"col-md-3 col-sm-6 \">";
		html += "<div class=\"can-lable\">";
		html += "<div class=\"cookie-span\">" + presetList[i] + "</div>";
		html += "<img src=\"res/img/x.png\" data-id=\"" + i + "\"/>";
		html += "</div>";
		html += "</div>";
	}
	$("#content-preset").append(html);
	deleteLable();
	sendPrestName();
	sendCookieEx();
}
function sendCookieEx() {
	$(".cookie-span").on('click', function(e) {
	let val=$(this).text();
		tipsshow();
		let flg=false;
		$(".lunbo-part-show").each(function(){
			let eval=$(this).find('h3').text();
	   if(eval==val){
	   	flg=true;
	   	let that = $(this);
			lunboShow.children('img').removeClass("lunbo_img_active");
			lunboShow = that;
			that.children('img').addClass("lunbo_img_active");
	   }
	  	});
		if(!flg){
			$(".lunbo-part-light").each(function(){
			let eval=$(this).find('h3').text();
	   if(eval==val){
	   	flg=true;
	   	let that = $(this);
			lunboShow.children('img').removeClass("lunbo_img_active");
			lunboShow = that;
			that.children('img').addClass("lunbo_img_active");
	   }
	  	});
		}

		
		exePresetCmdByNameCallback(val);
		setTimeout(function() {
			tipshide()
		}, 1000);
	})
}
function addPresetName() {
	let list = $.cookie('presetList');
	if(list == "" || list == undefined) return;
	presetList = list.split(',');
	$.cookie('presetList', null);
	let len = presetList.length
	if(len > 4) {
		presetList = presetList.slice(len - 4, len);
	}
	$.cookie('presetList', presetList);

	return presetList;
}

function deleteLable() {
	$(".can-lable img").on('click', function(e) {
		let i = $(this).data("id");
		presetList = $.cookie('presetList').split(',');
		//console.log(presetList)
		$.cookie('presetList', null);
		presetList.splice(i, 1);
		$.cookie('presetList', presetList);
		renderPresetList();
	})
}

function sendPrestName() {

	$(".can-lable span").on('click', function(e) {
		let value = $(this).text();
		//console.log(value)
		exePresetCmdByNameCallback(value);
	})
}

function contentControlClick() {

	//	$('.choose-all').prop("checked", false);
	$("#content-contrl-li li").on('click', function(e) {
		$('.choose-all').prop("checked", false)

		let val = $(this).data("value");
		getVideoInfoListByComnameCallback(val);
		if(val.length > 6) {
			val = val.substring(0, 6) + "...";
		}
		$("#content-name").text(val)

		//console.log(val)
	})
}

function renderProLight(list) {
	//console.log(list);
	let len = list.length;
	let ln = Math.floor(len / 2);
	$("#light-list").empty();
	let html = "";
	for(let i = 0; i < ln; i++) {
		html += "<div class=\"row\">";

		html += "<div class=\"col-md-6 \">";
		html += "<div class=\"inline c-sign-photo c-add-item1 \" data-open=\"0\" data-type=\"light-sign\" data-value=\"" + (i * 2) + "\">";
		html += "<img src=\"res/img/qianmhui.png\" />";
		html += "<span>" + list[i * 2] + "</span>";
		html += "</div>";

		html += "</div>";
		html += "<div class=\"col-md-6\">";
		html += "<div class=\"inline c-floor-exit c-add-item1\" data-open=\"0\" data-type=\"light-floor\" data-value=\"" + (i * 2 + 1) + "\">";
		html += "<img src=\"res/img/loudao.png\" />";
		html += "<span>" + list[i * 2 + 1] + "</span>";
		html += "</div>";

		html += "</div>";
		//	html+="<div class=\"col-md-4\">";
		//	html+="<div class=\"inline c-floor-light c-add-item1\" data-open=\"0\" data-type=\"light-size\" data-value=\""+i*3+2+"\">";
		//	html+="<img src=\"res/img/deng.png\" />";
		//	html+="<span>"+list[i*3+2]+"</span>";
		//	html+="</div>";
		//	html+="</div>";
		html += "</div>";
	}
	let left = len % 2;
	//console.log(left)
	if(left == 1) {

		html += "<div class=\"row\">";

		html += "<div class=\"col-md-6 \">";
		html += "<div class=\"inline c-sign-photo c-add-item1 \" data-open=\"0\" data-type=\"light-sign\" data-value=\"" + (len - 1) + "\">";
		html += "<img src=\"res/img/qianmhui.png\" />";
		html += "<span>" + list[len - 1] + "</span>";
		html += "</div>";

		html += "</div>";
		html += "</div>";
	}
	//	console.log(html);
	$("#light-list").append(html);
	$(".c-add-item1").on('click', function(e) {
		changeLight(this, 'c-add-item1-active');

	});

}

function changeLight(obj, str) {

	let that = $(obj);
	let type = that.data('open');
	let strs = that.data('type');

//	console.log("data ====" + that.text());
//	console.log("data open==" + type);
//	console.log("data type== "+strs);
	let url = ImgPath + getImgUrl(type, strs);

	if(type == 0) {
		that.addClass(str);
		that.data('open', '1');
	} else {
		that.removeClass(str);
		that.data('open', "0");
	}
	let pos = that.data("value");
	let open = that.data("open");
//	console.log("position==" + pos);
//	console.log("status==" + open);
	setLightControlCallback("" + pos + open);
	//console.log(that.children('img'));
	that.children('img').attr('src', url)
}

function getImgUrl(type, strs) {
	let url = "";
//	console.log(strs);
//	console.log(type);
	if(type == 0) {
		switch(strs) {
			case "light-sign":
				url = "qianm.png";
				break;
			case "light-size":
				url = "dengcheng.png";
				break;
			case "light-floor":
				url = "loudaocheng.png";
				break;
			case "light-led":
				url = "ledcheng.png";
				break;
			case "light-lamp":
				url = "dnegdaicheng.png";
				break;

		}
	} else {
		switch(strs) {
			case "light-sign":
				url = "qianmhui.png";
				break;
			case "light-size":
				url = "deng.png";
				break;
			case "light-floor":
				url = "loudao.png";
				break;
			case "light-led":
				url = "led.png";
				break;
			case "light-lamp":
				url = "dnegdai.png";
				break;
		}
	}
	return url;
}

function renderVolumeList(list) {
	let html = ""
	html += "<div class=\"flex-light-item\">";
	html += "<div class=\"slide-light-item\" style=\"padding-left: 20px;\">";
	html += "<img src=\"res/img/kedu.png\" style=\"vertical-align: top;margin-top: 4px;height: 473px;\" />";
	html += "<div class=\"help-block  voice-slider\" data-value=\"" + list[0] + "\" id=\"input-voice-slider1\" style=\"margin-top: 11px;\"></div>";
	html += "</div>";
	html += "<div class=\"span\">" + list[0] + "</div></div>";
	if(list.length > 1) {
		for(let i = 1; i < list.length; i++) {
			let val = list[i].length > 4 ? list[i].substring(0, 4) : list[i]
			html += "<div class=\"flex-light-item\">";
			html += "<div class=\"slide-light-item\">";
			html += "<img src=\"res/img/yinglingkedu.png\" style=\"vertical-align: top;margin-top: 4px;\" />";
			html += "<div class=\"help-block voice-slider\" data-value=\"" + val + "\"></div>";
			html += "</div><div class=\"span\">" + val + "</div></div>";
		}
	}
	$("#volume-list").append(html);
	initVoice();
}

function initVoice() {
	$('.slide-light-item .help-block').css('width', '25px').each(function(index) {
		//console.log(vioceValue);
		$(this).empty().slider({
			value: vioceValue[index],
			range: "min",
			min: 1,
			max: 100,
			step: 1,
			animate: true,
			orientation: "vertical",
			slide: function() {

				setVolumeCtrlCallback($(this).data("value"), $(this).slider("value"))
			}
		});
	})
}

function contentItemMoreClick() {
	$(".select4").on('click', function(e) {
		//$(this)..siblings(".center")
		//				if($(this).is(':checked')) {
		//					$(this).parent().parent().parent().css('color', "#E77817")
		//				} else {
		//					$(this).parent().parent().parent().css('color', "#393939")
		//				}
		let flg = $(this).siblings(".center").find("input").prop('checked');
		$(this).siblings(".center").find("input").prop('checked', !flg);
		if(!flg) {
			$(this).parent().css('color', "#E77817")
		} else {
			$(this).parent().css('color', "#393939")
		}
	});
}

function contentItemClick() {
	$(".choose-one").on('click', function(e) {

		if($(this).is(':checked')) {
			$(this).parent().parent().parent().css('color', "#E77817")
		} else {
			$(this).parent().parent().parent().css('color', "#393939")
		}
	});
}

function closeWindow() {
	if(navigator.userAgent.indexOf("Firefox") != -1 || navigator.userAgent.indexOf("Chrome") != -1) {
		window.location.href = "about:blank";
		window.close();
	} else {
		window.opener = null;
		window.open("", "_self");
		window.close();
	}
}
//--setLedBeltColor
//---设置LED灯带的色彩   "SetLedBeltColor" ---设置LED灯带的色彩
//  'val': 'AB198C' 表示Red=AB  Green=19  Blue=8C
function setLedBeltColorCallback(val) {
	if(websocket != null) {
		console.log("websocket 已经opennn");
		var msg = {
			'type': 'SetLedBeltColor',
			'val': val
		};
		websocket.send(JSON.stringify(msg));
	} else {
		console.log("websocket 已经关闭");
	}
}

function lineAnyChoosed(str) {
	str = "." + str;
	$(str).on('click', function(e) {
		//console.log($(this).next().find("input").prop('checked'));
		$(this).next().find("input").prop('checked', !$(this).next().find("input").prop('checked'))
	});
}

function goIndex() {
	window.location = "index.html";
}

function goProIndex() {
	window.location = "pro-index.html"
}

function tipshide() {
	$("#tips-load").hide();
}

function tipsshow() {
	$("#tips-load").show();
}

function getIndex(arr, str) {
	let indexs = $.cookie(str);

	//				Cindex.push(6);
	//console.log(indexs);
	if(!indexs) {
		indexs=[];
		if(str=="Cindex"){
			for(var i = 0; i < arr.length; i++) {
				let index = Math.floor(Math.random() * 6 + 1);
				indexs.push(index)
			}		
		}else{
			for(var i = 0; i < arr.length; i++) {
				let index = Math.floor(Math.random() * 2 + 1);
				indexs.push(index)
			}		
		}
		$.cookie(str, indexs);
	}else{
		indexs = indexs.split(',')
	}
//console.log($.cookie(str))
	return indexs;
}
function setIndex(str) {
	//console.log(str);
	let indexs = $.cookie(str);

	//				Cindex.push(6);
	let index=0	
if(str=="Cindex"){
	
 index = Math.floor(Math.random() * 6 + 1);
}else{
	 index = Math.floor(Math.random() * 2 + 1);
}
	indexs=indexs+","+index;
		$.cookie(str, indexs);
	//console.log(indexs)
	return indexs;
}
function renderExhibition(arr) {
	let html = "";
	//let arr = labelNamelist[i].PresetNameList;
	let Cindex = getIndex(arr, "Cindex");
	let itemLen = Math.ceil(arr.length / 6);
	if(itemLen > 1) {
		html += "<div id=\"carousel-example\" class=\"carousel slide\" data-ride=\"carousel\">";
		html += "<div class=\"carousel-inner\">";

		//console.log(itemLen);
		for(let k = 0; k < itemLen; k++) {

			if(k == 0) {
				html += "<div class=\"item active\">";
			} else {
				html += "<div class=\"item\">";
			}

			html += "<div class=\"B_inner\">";
			html += "<div class=\"row\" style=\"overflow:hidden;\">";
			if(k != itemLen - 1) {
				//console.log("k1====" + k)
				for(let j = k * 6; j < k * 6 + 6; j++) {

					html += "<div class=\"col-lg-2\">";
					html += "<div class=\"lunbo-part-show\" data-open=\"0\"><img src=\"res/img/c" + Cindex[j] + ".png\" class=\"img-thumbnail lunbo_img\"/>";
					html += "<h3>" + arr[j] + "</h3><div class=\"lunbo-oper-form\"><span class=\"caret\"></span><div class=\"lunbo-operation\"><div class=\"editor\" data-value=\""+arr[j]+"\">编辑</div><div class=\"delete\" data-value=\""+arr[j]+"\">删除</div></div></div></div>";
					html += "</div>";
				}
			} else {
				//console.log("k2====" + k)
				for(let j = (itemLen - 1) * 6; j < arr.length; j++) {

					html += "<div class=\"col-lg-2\">";
					html += "<div class=\"lunbo-part-show\" data-open=\"0\"><img src=\"res/img/c" + Cindex[j] + ".png\" class=\"img-thumbnail lunbo_img\"/>";
					html += "<h3>" + arr[j] + "</h3><div class=\"lunbo-oper-form\"><span class=\"caret\"></span><div class=\"lunbo-operation\"><div class=\"editor\" data-value=\""+arr[j]+"\">编辑</div><div class=\"delete\" data-value=\""+arr[j]+"\">删除</div></div></div></div>";
					html += "</div>";
				}
			}
			html += "</div>";
			html += "</div>";
			html += "</div>";
		}

		html += "</div>";

		html += "<div class=\"row\">";
		html += "<ol class=\"carousel-indicators\">";
		for(let shotLen = 0; shotLen < itemLen; shotLen++) {
			if(shotLen == 0) {

				html += "<li data-target=\"#carousel-example\" data-slide-to=\'" + shotLen + "\' class=\"active\"></li>";
			} else {
				html += "<li data-target=\"#carousel-example\" data-slide-to=\'" + shotLen + "\'></li>";
			}
		}
		html += "</ol>";
		html += "</div>";

		html += "<a class=\"left btn-move btn_l\" href=\"#carousel-example\" data-slide=\"prev\">";
		html += "<img src=\"res/img/prev.png\" />";
		html += "</a>";
		html += "<a class=\"right btn-move btn_r\" href=\"#carousel-example\" data-slide=\"next\">";
		html += "<img src=\"res/img/next.png\" />";
		html += "</a>";
		html += "</div>";
	} else {
		html += "<div class=\"flwx\">";
		html += "<div class=\"item\">";
		html += "<div class=\"B_inner\">";
		html += "<div class=\"row\" style=\"overflow:hidden;\">";
		for(let m = 0; m < arr.length; m++) {

			html += "<div class=\"col-lg-2\">";
			html += "<div class=\"lunbo-part-show\" data-open=\"0\"><img src=\"res/img/c" + Cindex[m] + ".png\" class=\"img-thumbnail lunbo_img\"/>";
			html += "<h3>" + arr[m] + "</h3><div class=\"lunbo-oper-form\"><span class=\"caret\"></span><div class=\"lunbo-operation\"><div class=\"editor\" data-value=\""+arr[m]+"\">编辑</div><div class=\"delete\" data-value=\""+arr[m]+"\">删除</div></div></div></div>";
			html += "</div>";

		}
		html += "</div>";
		html += "</div>";
		html += "</div>";
	}
	//	console.log(html);
	$("#canzanList").empty();
	$("#canzanList").append(html);
	caretClick();
	$('#carousel-example').carousel({
		interval: 2000
	})
	$('#carousel-example').carousel('pause');
	$(".lunbo-part-show").on('click', function(e) {
		tipsshow();
		let that = $(this);
		lunboShow.children('img').removeClass("lunbo_img_active");
		lunboShow = that;
		that.children('img').addClass("lunbo_img_active");
		//console.log(that.children('h3').text())
		exePresetCmdByNameCallback(that.children('h3').text());
		setTimeout(function() {
			tipshide()
		}, 1000);
	});
}
function rgbToHsl(r, g, b) {
    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if (max == min){ 
        h = s = 0; // achromatic
    } else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return [h, s, l];
}
window.addEventListener("load", init, false);