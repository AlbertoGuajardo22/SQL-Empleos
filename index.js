const db = require('./db/connection')
const express = require('express')
const PORT = 3000
const inquirer = require('inquirer');
const { v4: uuidv4 } = require('uuid');
const { query } = require('express');
const app = express()
app.use((req, res)=> {
    res.status(404).end();
})

db.connect(err => {
    if(err) throw err
    console.log('Database connected')
    app.listen(PORT, ()=> {
        console.log(`Express server running on ${PORT}`)
        Menu()
    })
})

const Menu = () =>{
    inquirer.prompt([
        {
            type:'list',
            name:'Menu',
            message:'Elige una opcion',
            choices: [
                "Ver departamentos",
                "Ver roles",
                "Ver empleados",
                "Agregar departamento",
                "Agregar un rol",
                "Agregar un empleado",
                "Actualiar un rol de empleado",
                "Salir"
            ]
        }
    ])
    .then(answers => {
        if(answers.Menu === 'Ver departamentos'){
            const sql = `SELECT * FROM Departments`
            db.query(sql, (err, rows)=> {
                if(err) throw err;
                if(rows.length>0){
                    console.log('\n')
                    console.table(rows)
                }
            })
            Menu()
        }
        if(answers.Menu === 'Ver roles'){
            //cargo, identifcador de rol, departamento, salario para ese rol
            const sql = `
            SELECT 
                r.id AS roleid,
                r.name AS  roleName,
                r.salary  AS roleSalary,
                d.name AS departmentName
                FROM roles r 
                INNER JOIN Departments d ON r.department = d.ID 
            `
            db.query(sql, (err, rows)=> {
                if(err) throw err
                if(rows.length>0){
                    console.log('\n')
                    console.table(rows)
                }
            })
            Menu()
        }
        if(answers.Menu === 'Ver empleados'){
            const sql = `
                SELECT 
                e.id as id,
                e.name as name,
                e.lastName as lastName ,
                r.name as roleName,
                r.salary as salary ,
                d.name as department,
                e2.name as managerName,
                e2.lastName as managerLastName
                from employees e 
                left join roles r on e.role = r.ID 
                left join departments d on r.department = d.ID 
                left join employees e2 on e.manager = e2.ID 
            `
            db.query(sql, (err, rows)=> {
                if(err) throw err
                if(rows.length>0){
                    console.log('\n')
                    console.table(rows)
                }
            })
            Menu()
        }
        if(answers.Menu === 'Agregar departamento'){
            inquirer.prompt([
               {
                type:'input',
                name:'name',
                message:'Ingresa el nombre del departamento',
               }
            ])
            .then(res=> {
                const sql = `INSERT INTO Departments (ID,name) VALUES (?,?)`
                const data = [uuidv4(),res.name]
                db.query(sql, data, err=>{
                    if(err) throw err
                    console.log("department added")
                    Menu()
                })
            })
        }
        if(answers.Menu === 'Agregar un rol'){
             //cargo, identifcador de rol, departamento, salario para ese rol
            inquirer.prompt([
                {
                    type:'input',
                    name:'name',
                    message:'Ingresa el nombre del rol',
                },
                {
                    type:'input',
                    name:'salary',
                    message: 'Ingresa el salario'
                }
             ])
             .then(res=> {
                    const postData = [uuidv4(),res.name,res.salary]
                    const dSql = `SELECT * FROM Departments`
                    db.query(dSql,(err,rows)=>{
                        if(err) throw err
                        const data = rows.map(d=> ({value:d.ID, name: d.name}))
                        inquirer.prompt([
                            {
                                type:'list',
                                name:'department',
                                message:'Que departamento desea asignar?',
                                choices: data
                            }
    
                        ])
                        .then(res=>{
                            postData.push(res.department)
                            const insert = `INSERT INTO Roles (ID, name, salary, department) values (?,?,?,?)`
                            db.query(insert, postData, err=>{
                                if(err) throw err
                                console.log('New Rol Created')
                                Menu()
                            })
                        })
                    })
                    
                    /*const sql = `INSERT INTO Departments (ID,name) VALUES (?,?)`
                    const data = [uuidv4(),res.name]
                    db.query(sql, data, err=>{
                        if(err) throw err
                        console.log("department added")
                        Menu()
                    })*/
             })
        }
        if(answers.Menu === 'Agregar un empleado'){
            inquirer.prompt([
                {
                    type:'input',
                    name:'name',
                    message:'Ingresa el nombre del empleado',
                },
                {
                    type:'input',
                    name:'lastName',
                    message: 'Ingresa el apellido del empleado'
                }
             ])
             .then(res=> {
                    const postData = [uuidv4(),res.name,res.lastName]
                    const rSql = `SELECT * FROM Roles`
                    db.query(rSql,(err,rows)=>{
                        if(err) throw err
                        const rolesData = rows.map(d=> ({value:d.ID, name: d.name}))
                        inquirer.prompt([
                            {
                                type:'list',
                                name:'rol',
                                message:'Que rol tendra el empleado?',
                                choices: rolesData
                            }
    
                        ])
                        .then(res=>{
                            postData.push(res.rol)
                            const eSql = `SELECT * FROM Employees`
                            
                            db.query(eSql, (err,rows)=>{
                                if(err) throw err
                                const managerData = rows.map(d=> ({value:d.ID, name: d.name+" "+d.lastName}))
                                managerData.push({value: null,name: "No manager" });
                                inquirer.prompt([
                                    {
                                        type:'list',
                                        name:'manager',
                                        message: 'Ingresa un manager',
                                        choices: managerData
                                    }
                                ])
                                .then(res=>{
                                    if(!res.manager){
                                        postData.push(null)
                                    }else{
                                        postData.push(res.manager)
                                    }
                                    
                                    const insert = `INSERT INTO Employees (ID, name, lastName, role, manager) values (?,?,?,?,?)`
                                    db.query(insert, postData, err=>{
                                    if(err) throw err
                                    console.log('New Employee Created')
                                    Menu()
                                })
                               
                            })
                            })
                            
                        })
                    })
                    
                    /*const sql = `INSERT INTO Departments (ID,name) VALUES (?,?)`
                    const data = [uuidv4(),res.name]
                    db.query(sql, data, err=>{
                        if(err) throw err
                        console.log("department added")
                        Menu()
                    })*/
             })
        }
        if(answers.Menu === 'Actualiar un rol de empleado'){
            const sql = `SELECT * FROM Employees`
            db.query(sql, (err,rows)=>{
                if(err) throw err
                const employees = rows.map(d=> ({value:d.ID, name: d.name+" "+d.lastName}))
                inquirer.prompt([
                    {
                        type:'list',
                        name:'employee',
                        message:'Que empleado deseas modificar?',
                        choices:employees
                    }
                ])
                .then(res=>{
                    const data = [res.employee]
                    const rSql = `SELECT * FROM Roles`
                    db.query(rSql, (err,rows)=>{
                        const roles = rows.map(r=> ({value:r.ID, name: r.name}))
                        inquirer.prompt([
                            {
                                type:'list',
                                name:'role',
                                message:'Que rol deseas asignar?',
                                choices:roles
                            }
                        ])
                        .then(res=>{
                            const updateData = [res.role, data[0]]
                            const update = `UPDATE Employees SET role = ? WHERE id = ?`
                            db.query(update, updateData, (err)=>{
                                if(err) throw err
                                console.log('Employee role updated')
                                Menu()
                            })
                        })
                    })
                    

                })
            })
        }
        if(answers.Menu === 'Salir'){
            
        }
        
    })
}