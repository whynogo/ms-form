# ms-form
在uniapp框架下，根据json自动生成表单和列表，可以运行在微信小程序、H5平台上，其它平台未测试。主要功能有： 
#### 1.已经支持的form-item有：text,textarea,richtext,upload,select,time，date，datetime，numbox，switch，checkbox，外键（表内和外表），可以继续根据需要扩展 
#### 2.可以在json中直接定义form-item的页面码和页面内顺序，ms-form会自动呈现和切换，最后一页提交时才真正一次性向服务器提交所有数据，其它时间都缓存在本地，简化了后端开发 
#### 3.richtext编辑单独独立为一个页面editors.vue，有自己的工具栏，可以完成字体大小颜色等设置和图片上传的功能 
#### 4.用户可以使用forms.vue继承专门的form-driver.js文件，生产高度自动化的表单显示、编辑、更新操作，减少90%上的代码和bug 
#### 5.用户可以使用lists.vue和继承list-driver.js文件，生产高度自动化的列表显示、删除操作，配合forms减少90%上的代码和bug 
#### 6.配合VertxGo后端，可以根据mysql的数据库定义直接自动生成ms-form所需的json，大大加快了CRUD的开发
