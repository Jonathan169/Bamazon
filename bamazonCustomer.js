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
    showP()
})
function home(){
    inq.prompt([
        {
            type:"input",
            message:"What is the ID of the item you want",
            name:"ID"
        },
        {
            type:"input",
            message:"Great, how many would you like?",
            name:"amount"
        }
    ]).then(function (res){
        connection.query(`SELECT*FROM products where id=${res.ID};`,function(err,resp){
            if(err)throw err;
            console.log("\n------------------------------------------------------\n")
            id=[[resp[0].id,resp[0].product_name,resp[0].department,resp[0].price,resp[0].stocked]]
            if((resp[0].stocked-res.amount)>=0){
                var newamount=resp[0].stocked-res.amount;
                connection.query(`UPDATE products SET stocked=${newamount} where id=${resp[0].id}`,function (){
                    console.log("Your purchase was "+(res.amount*resp[0].price)+"$\n")
                    console.table(["ID","Product Name","Department","Price","Left in Stock"],id)
                    home()
                })
            }
            else{
                console.log("Sorry not enough Inventory to fill the order")
            }
        })
    })
}

function showP(){
    connection.query("SELECT*FROM products;",function(err,res){
            if(err) throw err;
            console.log("Products\n------------------------------------------------------")
            id=[];
            for(let i=0;i<res.length;i++){
                id.push([res[i].id,res[i].product_name,res[i].department,res[i].price,res[i].stocked])
            }
            console.table(["ID","Product Name","Department","Price","Left in Stock"],id)
            console.log("------------------------------------------------------\n")
            home()
    })
}



