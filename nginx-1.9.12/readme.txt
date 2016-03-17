 curl  "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wx7a12cef1adb45afa&secret=fcc01a871483fbcbb6ceed972d614371"
{"access_token":"YPqFu3EEWm6v9JprfKdtVBnimjJmNqurqo7oak_eKwKN6iVps4EN7zNSpM6zsw2NvrCxyE0Lk_5VRqxwaQ9J-e3vxIB5MRV4jWssKNPVGq7-OtLj9EUWCHpz0Ue8VwzSIKSdAIAOQY","expires_in":7200}
MnB46LqdSJt8_KuMHlQ645eyHGNu-Cazdfgejtfvkrjll8Pv93lk7L4UpbQjsxvdNSMju-xHV-nZFqIvov1Wl5S4AcDUvdvqfZtUZIKg-gVQiMko49nBt-CCjsahOVNUYVIeAEAURE

{"button":[{"type":"click","name":"名片库","key":"V1001_CARDS"},{"name":"菜单","sub_button":[{"type":"view","name":"九维","url":"http://www.9ware.com/"},{"type":"click","name":"赞一下我们","key":"V1001_GOOD"}]}]} 
curl --data '{"button":[{"type":"click","name":"名片库","key":"V1001_CARDS"},{"name":"菜单","sub_button":[{"type":"view","name":"九维","url":"http://www.9ware.com/"},{"type":"click","name":"赞一下我们","key":"V1001_GOOD"}]}]}'  "https://api.weixin.qq.com/cgi-bin/menu/create?access_token=YPqFu3EEWm6v9JprfKdtVBnimjJmNqurqo7oak_eKwKN6iVps4EN7zNSpM6zsw2NvrCxyE0Lk_5VRqxwaQ9J-e3vxIB5MRV4jWssKNPVGq7-OtLj9EUWCHpz0Ue8VwzSIKSdAIAOQY"

curl "https://api.weixin.qq.com/cgi-bin/menu/create?access_token=YPqFu3EEWm6v9JprfKdtVBnimjJmNqurqo7oak_eKwKN6iVps4EN7zNSpM6zsw2NvrCxyE0Lk_5VRqxwaQ9J-e3vxIB5MRV4jWssKNPVGq7-OtLj9EUWCHpz0Ue8VwzSIKSdAIAOQY" --data-urlencode '{
{"button":[
	{"name":"关注名片","sub_button":[
		{"type":"click","name":"公告","key":"V1001_INFO"},
		{"type":"click","name":"关注查询","key":"V1001_SEARCH"},
		{"type":"click","name":"识别名片","key":"V1001_UPLOAD"},
		{"type":"click","name":"企业名录","key":"V1001_COMPANY"}
		]
	},
	{"name":"名片管理","sub_button":[
		{"type":"click","name":"个人名片管理","key":"V1002_PERSONAL_CARD"},
		{"type":"click","name":"成为VIP客户","key":"V1002_VIP"},
		{"type":"click","name":"公司信息管理","key":"V1002_COMPANY_CARD"}
		]
	},
	{"name":"帮助","sub_button":[
		{"type":"view","name":"名扬四海","url":"http://www.9ware.cn/"},
		{"type":"click","name":"招贤纳才","key":"V1003_HIRE"},
		{"type":"click","name":"关于","key":"V1003_ABOUT"}
		]
	}
]
}
