
// #ifndef MP-WEIXIN		
import {
	uniUploadBlobUrl
} from '@/common/oss.js';
// #endif
// #ifdef MP-WEIXIN
import {
	wxOssUploadFile
} from '@/common/wx-oss-upload.js';
// #endif


import {
	isEmpty,
	convertUTCTimeToLocalTime,
	orderCall,
	orderRun,
	confirmDo,
	toAsync,
	today,
	compareDate,
	delayToast,
	reloadToast
} from '@/common/util.js';

import {
	checkLogin,
	loginTo,
	getUserId,
	goto,
	naviTo,
	closeTo
} from '@/common/route.js';

var TEST_LIST=false

export class EditorDriver{
	constructor(name,buttonLabel,content) {
		this.name=name
		this.directory="reservation"
		this.buttonLabel=buttonLabel
		this.content=content
		g_editorDrivers[name]=this
	}
	
	setEditorContent(content){
	 	this.content=new String(content)
	 }
	
	fectchEditorContent(){
		return this
	}
}

var g_editorDrivers={}	
export function fectchEditorContent(name){
	console.log("fectchEditorContent=>",name)
	return g_editorDrivers[name].fectchEditorContent()
}

export function getEditorContent(name){
	console.log("getEditorContent",name)
	//因为cus-form可能在editor没注册前就采集数据
	if(name in g_editorDrivers)
		return g_editorDrivers[name].content
	else
		return null
}

export function setEditorContent(name,content){
	console.log("setEditorContent=>",name)
	g_editorDrivers[name].setEditorContent(content)
}	

export function releaseList(name){
	g_ListDrivers[name]=null
}
		
