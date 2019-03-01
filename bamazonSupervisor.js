const mysql=require("mysql");
const cTable = require('console.table');
const inq=require("inquirer")
var id=[];
var connection= mysql.createConnection({
    host:"localhost",
    port:8889,
    user:"root",
    password:"root",
    database:'bamazon_db'
})
connection.connect(function(err,res){
    console.log("Connection ID: "+ connection.threadId+"\n")
    home()
})
//prompt
function home(){
    inq.prompt([
        {
            type:"list",
            message:"Supervisor Options",
            choices:["View Product Sales by Department","View Products","Add new product","Add new department"],
            name:"action"
        }
    ]).then(function (res){
        if(res.action==="View Products"){
            display("SELECT*FROM products;",home)
        }
        else if(res.action==="View Product Sales by Department"){
            display(`SELECT*FROM products where stocked<=(fully_stocked/4);`)
        }
        else if(res.action==="Add new department"){
            display(`SELECT*FROM products where stocked<=(fully_stocked/4);`,stocki)
        }
        else if(res.action==="Add new product"){
            add()
        }
    })
}
//functions
function display(que,func,other){
    connection.query(que,function(err,res){
            if(err) throw err;
            // if(other)
            id=[];
            for(let i=0;i<res.length;i++){
                id.push([res[i].id,res[i].product_name,res[i].department,res[i].price,res[i].stocked,res[i].fully_stocked])
            }
            console.log("Products\n------------------------------------------------------")
            console.table(["ID","Product Name","Department","Price","Left in Stock","Fully stocked amount"],id)
            console.log("------------------------------------------------------\n")
            if(func){func()}
        })
}
