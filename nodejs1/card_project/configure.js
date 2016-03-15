
module.exports = ({
img: {
	base_path: '/home/dev-game/code/ThreeWords/Server/image/'
},
log_function: 'console', // 'console', 'dailyfile'
log_level: 'log', // 'log', 'trace', 'debug', 'info', 'warn', 'error'
log_path: './log',
http: {
	host: ['threewords.jiejiaodai.com'],
	listen_port: 9001
	},
database: {
	host: 'localhost',
	db: 'carddb',
	user: 'root',
	password: 'p123456'
	}
})