const config = { 
    production:{
        SECRET: process.env.SECRET,
        DATABASE: process.env.MONGODB_URI
    },
    default:{
        SECRET:'supersecretpassword',
        DATABASE: 'mongodb+srv://admin:testing123@cluster0.3nee9.mongodb.net/authApp?retryWrites=true&w=majority'
    }
}

exports.get = function get(env){
    return config[env] || config.default
}

