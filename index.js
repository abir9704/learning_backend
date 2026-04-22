import express from "express";
import cors from "cors";

import pkg from "pg";

const { Pool } = pkg;

const app=express();
const port = 5000;
app.use(cors());

app.use(express.json());


const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "playerscore",
  password: "sqlsetup909",
  port: 5432,
});

pool.connect()
  .then(() => console.log("DB Connected"))
  .catch(err => console.log(err));


app.get('/',(req,res)=>{
    res.send('Hello world');
})

app.post('/playerpoint',async(req,res)=>{
    const {name,points}=req.body;

  const result = await pool.query(
  "INSERT INTO score VALUES (DEFAULT, $1, $2) RETURNING *",
  [name, points]
);

  res.json(result.rows[0]);
})



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})