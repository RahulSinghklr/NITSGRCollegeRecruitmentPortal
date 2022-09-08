module.exports=function (app){
   
app.get('/login',function(req,res){
    res.render('Login',{ShowText:null});
})

app.get('/',function(req,res){
   res.redirect('Login')
})
app.get('/login/:UserName/:Password',function(req,res){
    res.render('Login',{ShowText:'Invalid UserName Or Password!'})
})

app.get('/applications/:Username/:Key',function(req,res){
    res.render('Applications',{BSArray:APPLDATAS});
})


app.post('/logout',function(req,res){
    res.redirect('https://nitsri.ac.in/');
  })
  
  

}