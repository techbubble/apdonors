'use strict';
module.exports = function(){
    switch(process.env.NODE_ENV){

        case 'production':
            return {
                port: process.env.PORT || 3000,
                mongodb: {
                    uri: 'mongodb://$OPENSHIFT_MONGODB_DB_HOST:$OPENSHIFT_MONGODB_DB_PORT/'
                },
                companyName: 'Akshaya Patra Foundation',
                projectName: 'Donors',
                systemEmail: 'your@email.addy',
                cryptoKey: 'k3yb0ardc4t',
                requireAccountVerification: false,
                smtp: {
                    from: {
                        name: process.env.SMTP_FROM_NAME || exports.projectName +' Website',
                        address: process.env.SMTP_FROM_ADDRESS || 'your@email.addy'
                    },
                    credentials: {
                        user: process.env.SMTP_USERNAME || 'your@email.addy',
                        password: process.env.SMTP_PASSWORD || 'bl4rg!',
                        host: process.env.SMTP_HOST || 'smtp.gmail.com',
                        ssl: true
                    }
                },
                oauth: {
                    twitter: {
                        key: process.env.TWITTER_OAUTH_KEY || '',
                        secret: process.env.TWITTER_OAUTH_SECRET || ''
                    },
                    facebook: {
                        key: process.env.FACEBOOK_OAUTH_KEY || '',
                        secret: process.env.FACEBOOK_OAUTH_SECRET || ''
                    },
                    github: {
                        key: process.env.GITHUB_OAUTH_KEY || '',
                        secret: process.env.GITHUB_OAUTH_SECRET || ''
                    }
                }
            };

        default:
            return {
                port: process.env.PORT || 8000,
                mongodb: {
                    uri: 'localhost/apdonors'
                },
                companyName: 'Akshaya Patra Foundation',
                projectName: 'Donors',
                systemEmail: 'your@email.addy',
                cryptoKey: 'k3yb0ardc4t',
                requireAccountVerification: false,
                smtp: {
                    from: {
                        name: process.env.SMTP_FROM_NAME || exports.projectName +' Website',
                        address: process.env.SMTP_FROM_ADDRESS || 'your@email.addy'
                    },
                    credentials: {
                        user: process.env.SMTP_USERNAME || 'your@email.addy',
                        password: process.env.SMTP_PASSWORD || 'bl4rg!',
                        host: process.env.SMTP_HOST || 'smtp.gmail.com',
                        ssl: true
                    }
                },
                oauth: {
                    twitter: {
                        key: process.env.TWITTER_OAUTH_KEY || '',
                        secret: process.env.TWITTER_OAUTH_SECRET || ''
                    },
                    facebook: {
                        key: process.env.FACEBOOK_OAUTH_KEY || '',
                        secret: process.env.FACEBOOK_OAUTH_SECRET || ''
                    },
                    github: {
                        key: process.env.GITHUB_OAUTH_KEY || '',
                        secret: process.env.GITHUB_OAUTH_SECRET || ''
                    }
                }
            };

    }
};


