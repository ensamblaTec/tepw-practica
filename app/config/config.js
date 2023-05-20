// define default config, but allow overrides from ENV vars
require('dotenv').config();
let config = {
  APP_DB_HOST: "db-instance-students.c4sz2v2pmin0.us-east-1.rds.amazonaws.com",
  APP_DB_USER: "'students_usr'@'db-instance-students.c4sz2v2pmin0.us-east-1.rds.amazonaws.com'",
  APP_DB_PASSWORD: "i4?|[<xz)WMVl)]J",
  APP_DB_NAME: "students"
}

var AWS = require('aws-sdk');
var client = new AWS.SecretsManager({
    region: "us-east-1"
});

const secretName = "Mydbsecret";

//let APP_DB_USER;

client.getSecretValue({SecretId: secretName}, function(err, data) {
    if (err) {
	  config.APP_DB_HOST = process.env.APP_DB_HOST
	  config.APP_DB_NAME = process.env.APP_DB_NAME
	  config.APP_DB_PASSWORD = process.env.APP_DB_PASSWORD
	  config.APP_DB_USER = process.env.APP_DB_USER
	  config.APP_PORT = process.env.APP_PORT
      console.log('Secrets not found. Reading from environment variables..')
          //  throw err;
    }
    else {
        if ('SecretString' in data) {
            secret = JSON.parse(data.SecretString);
            for(const envKey of Object.keys(secret)) {
                process.env[envKey] = secret[envKey];
              //  console.log(` Value for key '${envKey}' `);
              //  console.log(` secret[envKey] '${secret[envKey]}'`);
                if (envKey == 'user') {
                  config.APP_DB_USER = secret[envKey]
			console.log(`[CONFIG]: ${secret[envKey]}`)
                } else if (envKey == 'password') {
                  config.APP_DB_PASSWORD = secret[envKey]
                } else if (envKey == 'host') {
                  config.APP_DB_HOST = secret[envKey]
                } else if (envKey == 'db') {
                  config.APP_DB_NAME= secret[envKey]
                }
        }
		
        }

    }
    // console log in case of error
    //console.log(err);
});


Object.keys(config).forEach(key => {
  if(process.env[key] === undefined){
    console.log(`[NOTICE] Value for key '${key}' not found in ENV, using default value.  See app/config/config.js`)
  } else {
    config[key] = process.env[key]
	  console.log(`[OBJECT]: ${process.env[key]}`)
  }
});

module.exports = config;
