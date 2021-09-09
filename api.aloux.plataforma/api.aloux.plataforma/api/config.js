
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
	},
	aws: 
	{
		BUCKET_NAME: process.env.BUCKET_AWS,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
		accessKeyId:  process.env.AWS_ACCESS_KEY_ID,
		region: 'us-east-1'		
	}
};

module.exports = config;
