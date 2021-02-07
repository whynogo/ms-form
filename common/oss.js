// #ifndef MP-WEIXIN		
const AliOss = require('ali-oss')
import md5 from 'js-md5'
import fly from '@/common/request'

/**
 * 生成随机文件名称
 * 规则八位随机字符，加下划线连接时间戳
 */
export const getFileNameUUID = () => {
	function rx() {
		return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
	}
	return `${+new Date()}_${rx()}${rx()}`
}




export function ossClient(data) { // data后端提供数据
	return new AliOss({
		region: data.region,
		accessKeyId: data.accessKeyId,
		accessKeySecret: data.accessKeySecret,
		bucket: data.bucket
	})
}

export function getAliOSSConfig(params) {
	return fly.post('config/oss', params);
}

export async function ossUploadBlob(blob, path, successCb, failCb) {
	getAliOSSConfig().then(rsp => {
		var client = ossClient(rsp.data)
		// blob转arrayBuffer
		const reader = new FileReader()
		reader.readAsArrayBuffer(blob)
		reader.onload = function(event) {
			// 文件名
			var filename = path + '/' + md5(getFileNameUUID()) + '.png' // 都是加了productId作为路径

			// arrayBuffer转Buffer
			const buffer = new Buffer(event.target.result)

			// 上传
			client.put(filename, buffer).then(function(result) {
				console.log(result)
				successCb(result)
				/* e.g. result = {
				    name: "Uploads/file/20171125/1511601396119.png",
				    res: {status: 200, statusCode: 200, headers: {…}, size: 0, aborted: false, …},
				    url: "http://bucket.oss-cn-shenzhen.aliyuncs.com/Uploads/file/20171125/1511601396119.png"
				} */
			}).catch(function(err) {
				console.log(err)
				if (typeof failCb == "function")
					failCb(path, err)
			})
		}
	})
}



export async function ossUploadFile(file, successCb, progressCb, failCb) {
	console.log("file->", file)
	const temporary = file.file.name.lastIndexOf('.')
	const filename = file.file.name
	const fileNameLength = file.file.name.length
	const fileFormat = file.file.name.substring(
		temporary + 1,
		fileNameLength
	)
	//生成随机的文件名，保留文件后缀
	const fileName = getFileNameUUID() + '.' + fileFormat
	//利用阿里的接口上传文件
	ossClient(that.ossCfg).multipartUpload(`${fileName}`, file.file, {
			progress: function(p) {
				// p进度条的值
				console.log("ossUploadFile", p)
				if (typeof failCb == "function")
					progressCb(filename, Math.floor(p * 100))
			}
		})
		.then(ret => {
			console.log("ossUploadFile success", filename, ret)
			successCb(filename, ret)
		})
		.catch(err => {
			console.log('err:', err)
			if (typeof failCb == "function")
				failCb(filename, err)
		})
}


export async function uniUploadFile(file, successCb, progressCb, failCb) {
	ossUploadFile(file, successCb, function(filename, progress) {
		if (typeof failCb == "function")
			progressCb(filename, progress)
	}, function(filename, err) {
		if (typeof failCb != "function")
			uni.showToast({
				title: '文件上传失败，请重试',
				duration: 2000
			});
	})
}


function h5_url_to_blob(url) {
	return new Promise((resolve, reject) => {
		var xhr = new XMLHttpRequest();
		xhr.open('GET', url, true);
		xhr.responseType = 'blob';
		xhr.onload = function(e) {
			if (this.status == 200) {
				var Blob = this.response;
				// console.log(myBlob)
				resolve(Blob)
				// myBlob现在是对象URL指向的blob。 
			}
		};
		xhr.send();
	})
}

export function uniUploadBlobUrl(blobUrl, path, successCb, progressCb, failCb) {
	h5_url_to_blob(blobUrl).then(blob => {
		console.log("blob->", blob)
		ossUploadBlob(blob, path, successCb, function(filename, err) {
			if (typeof failCb != "function")
				uni.showToast({
					title: '文件上传失败，请重试',
					duration: 2000
				});
		})
	}, err => {
		console.log('发生错误！', error);
	}).catch(function(error) {
		// 处理 getJSON 和 前一个回调函数运行时发生的错误
		console.log('发生错误！', error);
	});

}

// #endif
