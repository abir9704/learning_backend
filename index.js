//creating an express server 
//first you need express

import express from 'express';

import cors from "cors";

import pkg from 'pg';

const {Pool} = pkg;


//then you need to name a server, this time i names this server titan

const titan= express();



//then you need a port for running the server , so first define it

const port= 5000;

//following line actually converts json to object
titan.use(express.json());

titan.use(cors());
// now we are using postgressql for our database. first we need to import package



//after importing the package we need to destracture a class from it actually this class can establish multiple connection


const pool = new Pool({
  user:'postgres',
  host: "localhost",
  database:"playerscore",
  password:"sqlsetup909",
  port: 5432,
});

//now we will write some optional code only for testing we are connected backend with database(postgress) or not

pool.connect()
  .then(() => console.log("DB Connected"))
  .catch(err => console.log(err));



titan.get('/',(req,res)=>{
  res.send("hello titan");
})

titan.get('/shooter',async(req,res)=>{
  const result = await pool.query("SELECT *FROM score ORDER BY id ASC");
  res.json(result.rows);
})

titan.post('/playerpoint',async(req,res)=>{

  const {name,points}= req.body;

  const result = await pool.query(
    "INSERT INTO score VALUES (DEFAULT, $1, $2) RETURNING *",
    [name,points]
  );

    res.json(result.rows[0]);




})

//always remember url theke je data pai jemon playerpoint/:id eikhane id holo params 
// easy way to remember- pool.query("SQL QUERY", [VALUES])
titan.patch("/playerpoint/:id",async(req,res)=>{
  const result = await pool.query(
    `UPDATE score
     SET points=points+3
     WHERE id = $1
     RETURNING *`,
    [req.params.id]
  );

  res.json(result.rows[0]);
})

//now i have to make veey important api which is delete api

titan.delete("/deleteplayer/:id", async(req,res)=>{
  const result = await pool.query(
    `Delete from score
    WHERE id=$1
    RETURNING *`,
    [req.params.id]
  );
  res.json(result.rows[0]);
})



//to running the the server you must listen 
titan.listen(port, ()=>{
  console.log(`titan is running on port ${port}`);
})