const base64 = require("@/common/base64.js").Base64;
require('@/common/hmac.js');
require('@/common/sha1.js');
const Crypto = require('@/common/crypto.js');

import {getRandFileName} from '@/common/util.js'
import {CONFIG} from "@/common/config.js"
const env = CONFIG.ossConfig;

/*
 *上传文件到阿里云oss
 *@param - filePath :图片的本地资源路径
  @param - path :上传oss哪个路径下
 *@param - successc:成功回调
 *@param - failc:失败回调
 */
export function wxOssUploadFile(filePath, path, successc, failc) {
  if (!filePath || filePath.length < 9) {
    wx.showModal({
      title: '图片错误',
      content: '请重试',
      showCancel: false,
    })
    return;
  }
  //存放图片命名格式：自定义时间戳给图片名字(可以自己改)
  const aliyunFileKey = getRandFileName(filePath,path).substr(1)//删除 斜杠，oss不允许斜杠开头
  console.log("filename=>",aliyunFileKey)

  const aliyunServerURL = env.uploadImageUrl; //OSS地址，https
  const accessid = env.OSSAccessKeyId;
  const policyBase64 = getPolicyBase64();
  const signature = getSignature(policyBase64);

  wx.uploadFile({
    url: aliyunServerURL, //开发者服务器 url
    filePath: filePath, //要上传文件资源的路径
    name: 'file', //必须填file
    formData: {
      'key': aliyunFileKey,
      'policy': policyBase64,
      'OSSAccessKeyId': accessid,
      'signature': signature,
      'success_action_status': '200',
    },
    success: function(res) {
      if (res.statusCode != 200) {
        failc(new Error('上传错误:' + JSON.stringify(res)))
        return;
      }
	  console.log("res=>",res)
	  var result={name:aliyunFileKey,url:aliyunServerURL +'/'+ aliyunFileKey}
      successc(result);
    },
    fail: function(err) {
      err.wxaddinfo = aliyunServerURL;
      failc(err);
    },
  })
}

const getPolicyBase64 = function() {
  let date = new Date();
  date.setHours(date.getHours() + env.timeout);
  let srcT = date.toISOString();
  const policyText = {
    "expiration": srcT, //设置该Policy的失效时间，超过这个失效时间之后，就没有办法通过这个policy上传文件了 
    "conditions": [
      ["content-length-range", 0, 5 * 1024 * 1024] // 设置上传文件的大小限制,5mb
    ]
  };

  const policyBase64 = base64.encode(JSON.stringify(policyText));
  return policyBase64;
}

const getSignature = function(policyBase64) {
  const accesskey = env.AccessKeySecret;
  const bytes = Crypto.HMAC(Crypto.SHA1, policyBase64, accesskey, {
    asBytes: true
  });
  const signature = Crypto.util.bytesToBase64(bytes);
  return signature;
}

