
        require('dotenv').config(); 
    let cors = require('cors');
    let express = require('express'),
    app = express();
    path = require('path'),
    jwt = require('jsonwebtoken'),
    bodyParser = require('body-parser'),
    passport = require('passport'),
    JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
    
    
       
    let User = require('./database/user');
    let jwtOptions = {};
    jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    jwtOptions.secretOrKey = process.env.SECRET;

    
    let myStrategy = new JwtStrategy(jwtOptions, (payload, done) => {
        let email = payload.email;
        let name = payload.name;
        User.findByEmail(email)
            .then(user => {
                if (user.name == name) {
                    done(null, user);
                }
            })
            .catch(err => done(err, null));
    });
    app.use(cors());
    app.use(express.static(path.join(__dirname, './assets')));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    passport.use(myStrategy);

    let userRoute = require("./routes/user")(express, jwt);
    let adminRoute = require('./routes/admin')(express, passport);
    let guestRoute = require('./routes/guest')(express);

    app.use("/user", userRoute);
	app.use("/admin", adminRoute);
    app.use("/", guestRoute);
    
    app.listen(process.env.PORT, () => {
        console.log("server is running at" + process.env.PORT);
    });
        
    