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
//Prompts
function home(){
    inq.prompt([
        {
            type:"list",
            message:"Manager Options",
            choices:["View Products","View low inventory","Add to invetory","Add new product"],
            name:"action"
        }
    ]).then(function (res){
        if(res.action==="View Products"){
            display("SELECT*FROM products;",home)
        }
        else if(res.action==="View low inventory"){
            display(`SELECT*FROM products where stocked<=(fully_stocked/4);`)
        }
        else if(res.action==="Add to invetory"){
            display(`SELECT*FROM products where stocked<=(fully_stocked/4);`,stocki)
        }
        else if(res.action==="Add new product"){
            add()
        }
    })
}
function add(){
    inq.prompt([
        {
            type:'input',
            message:'Whats the name of the Item?',
            name:'name'
        },
        {
            type:'input',
            message:'Whats the Department for the Item?',
            name:'dep'
        },
        {
            type:'input',
            message:'Whats the Price for the Item?',
            name:'price'
        },
        {
            type:'input',
            message:'How much of the Item do we have',
            name:'stocked'
        },
        {
            type:'input',
            message:"Whats the Max amount we'll have at one time",
            name:'fully'
        },
    ]).then(function(res){
        var price=parseFloat(res.price);var stocked=parseFloat(res.stocked);var fully=parseFloat(res.fully)
        connection.query(`INSERT INTO products(product_name,department,price,stocked,fully_stocked)
        VALUES ("${res.name}","${res.dep}",${price},${stocked},${fully});`,function(err,resp){
            if(err)throw err;
            display(`SELECT*FROM products where Product_name='${res.name}';`,home)
        })
    })
}
//functions
function display(que,func){
    connection.query(que,function(err,res){
            if(err) throw err;
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
function stocki(){
    inq.prompt([
        {
            type:'input',
            message:'Which would you like to stock',
            name:'stock'
        }
    ]).then(function(res){
        connection.query(`UPDATE products SET stocked=fully_stocked WHERE ID=${res.stock};`,function(res){
        })
        console.log("Updated: \n\n")
        display(`SELECT*FROM products WHERE ID=${res.stock};`,home)
    })
}
