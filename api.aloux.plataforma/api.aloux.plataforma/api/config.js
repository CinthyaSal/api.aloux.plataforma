
var config =
{
	appname: 'alouxPlataforma',
	serverpath: '/api',
	port: process.env.PORT,
	lang: 'es',
	verbose: true,
	database:
	{
		component: 'mongodb',
		server: process.env.DB
	},
	auth:
	{
		component: 'mongodb_user',
		secret: process.env.AUTH_SECRET
	}
};

module.exports = config;
