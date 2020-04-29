const express = require('express')
const bodyParser = require('body-parser');
const mysql = require('mysql')

const app = express()
app.set('view engine', 'ejs')

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))

const con = mysql.createConnection({
  host     : 'localhost',
  user     : 'admin',
  password : 'admin',
  database : 'kda_test'
})

con.connect((err)=>{
  if(err){console.log(err.message)}
  console.log('Connected successfully to the database');
})


app.get('/',(req,res)=>{
  con.query(`select * from student`,(err,result)=>{
    res.render("home",{
      data:result
    })
  })
})

app.get('/student/:id',(req,res)=>{
  con.query(`select * from student where id=?`,req.params.id,(err,result)=>{
    res.render("single",{
      data:result[0]
    })
  })
})

app.post('/student',(req,res)=>{
  con.query(`update student set nom=?, prenom=? where id=?`,[req.body.nom,req.body.prenom,req.body.id],(err)=>{
    if(err){console.log(err.message)}
    res.redirect('/');
  })
})


app.get('/delete/:id',(req,res)=>{
  con.query(`delete from student where id=?`,req.params.id,(err,result)=>{
    res.redirect('/');
  })
})

app.post('/add-student',(req,res)=>{
  const post = {
    nom :req.body.nom,
    prenom:req.body.prenom
  }
  con.query(`insert into student set ?`,post,(err)=>{
    if(err){console.log(err.message)}
    res.redirect('/');
  })
})




const PORT = 4000
app.listen(PORT,()=>{
  console.log(`Server runing on port ${PORT}`)
})
