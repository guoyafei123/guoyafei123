var express=require('express');
var mysql=require('mysql');
var bodyParser=require('body-parser');
var app=express();
var user=express.Router();
app.use(bodyParser.urlencoded({}));
app.use('/user',user);
var pool=mysql.createPool({
    host:'localhost',
    user:'root',
    password:'g123456789',
    database:'lesson',
    port:3306
})
user.post('/login',function(req,res){
    var user=req.body.user;
    var pass=req.body.pass;
    if(user!=''&&pass!=''){
        pool.getConnection(function(err,connection){
            if(err){
                console.log('connection:::'+err);
                return
            }
            connection.query('select * from login where user=?',[user],function(err,data){
                if(err){
                    console.log('mysql:::'+err);
                    return
                }
                if(data==''){
                    res.send('用户名不存在')
                }else{
                    if(data[0].pass==pass){
                        res.send('登录成功');
                    }else{
                        res.send('用户名或密码错误')
                    }
                }
                connection.end()
            })
        })
    }
})
user.post('/Registered',function(req,res){
    var user=req.body.user;
    var pass=req.body.pass;
    var users=/^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;
    var password=/^(\w){15,20}$/;
    if((users.test(user))&&(password.test(pass))){
        pool.getConnection(function(err,connection){
            if(err){
                console.log('connection:::'+err);
                return
            }
            connection.query('select * from login where user=?',[user],function(err,data){
                if(err){
                    console.log('mysql:::'+err);
                    return
                }
                if(data==''){
                    connection.query('insert into login (user,pass) values (?,?)',[user,pass],function(err,data){
                        if(err){
                            console.log('mysql:::'+err);
                            return
                        }
                        res.send('注册成功')
                    })
                }else{
                    res.send('用户名已存在')
                }
                connection.end()
            })
        })
    }
})
app.use(express.static('./'));
app.listen(8000,function(){
    console.log('启动...')
})
