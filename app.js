const express = require('express')
const app = express();
const fs = require('fs');
const data = require('./data');
const { receiveMessageOnPort } = require('worker_threads');
const { error } = require('console');


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Internal Server Error: ' + err.message);
  });


// get method to for homepage
app.get('/',(req,res)=>{
    
    res.status(200).send("Rest Apis")
})



// get method to fetch the data
app.get('/users',(req,res)=>{
    res.status(200).send(data)
})


// get method to fetch data through request parameters
app.get('/users/:id',(req,res)=>{
   const {id} = req.params
   const index = data.findIndex(item=>item.id ===Number(id))

   if(index ===-1)
        res.status(200).send("Users doesn't Exists")
   res.status(200).send(data[index])

})




// Post method to insert dummy data 
app.post('/users/add',(req,res)=>{


    // dummy data 
    const uid = Number(data.length+1);
    const name = 'Rehnuma';
    const add = 'Faridabad'



    const newData = data.push({id:uid,name:name,address:add})  // pushing data to array 


    // writing the modified js object to file
    fs.writeFile('./data.json',JSON.stringify(data),'utf-8',(err)=>{
        if(err){
            console.log(err)
            res.status(500).send('Operation failed')
        }
        else{
            console.log('Post  Succesfull')
            res.status(201).send(data.find(item=>item.id === uid))}
    })
    

})


// put request to modify the data
app.put('/users/:uid', (req, res) => { 

    // New data to be manipulated 
    const userID = Number(req.params.uid)  
    const name ='help';
    const address = 'Nope';
    
    
    
    const ind = data.findIndex(item =>item.id===Number(userID))
    if(ind===-1)
        res.status(200).send('User not found')


    data[ind] = {id:userID,name:name,address:address};   //updating the data

    res.status(200).send(`Modoified ->${JSON.stringify(data[ind])}`)   



// writing the data to file for update
    fs.writeFile('./data.json',JSON.stringify(data),'utf-8',(err)=>{
        if(err){
            console.log(err)
            res.status(500).send('Operation failed')
        }
        else{
            console.log('Modification  Succesfull')
            res.status(201).send(data.find(item=>item.id === uid))}
    })

  })






// patch request to modify the data
app.patch('/users/:uName', (req, res) => { 

    const {uName} =req.params  
    const ind = data.findIndex(item =>item.name===uName)
    if(ind==-1)
        res.send('User not found').status(200)
    
    data[ind].name= "Karan"  // here input the datta to be updated


    // write the data to update the json in file
    fs.writeFile('./data.json',JSON.stringify(data),'utf-8',(err)=>{
        if(err){
            console.log(err)
            res.status(500).send('Operation failed')
        }
        else{
            console.log('Patch  Succesfull')
            res.status(201).send(JSON.stringify(data[ind]))}
    })

  })

app.delete('/users/:id',(req,res)=>{
    const {id} = req.params
    const index = data.findIndex(item=>item.id ===Number(id))
    if(index === -1)
        res.status(200).send("User not found")

    data.splice(index,1);

    // write the data to update the json in file
    fs.writeFile('./data.json',JSON.stringify(data),'utf-8',(err)=>{
        if(err){
            console.log(err)
            res.status(500).send('Operation failed')
        }
        else{
            console.log('Delete  Succesfull')
            res.status(201).send('Deleted')}
    })
})



// using post with query string to add data 
// design this if u got time



// used basically for cross origin resource sharing
app.options('/users', (req, res) => {
    res.header('Allow', 'GET, POST, PUT, OPTIONS,');
    console.log(res)
    res.status(200).send("Options");
  });



app.listen(5000,()=>{
    console.log('Server is running at http://127.0.0.1:5000')
})