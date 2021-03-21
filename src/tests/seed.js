const db = require('../models/db')
const Slot = require('../models/Slot')
const User = require('../models/User')
const Subject = require('../models/Subject')
const faker = require('faker')
const result = require('dotenv').config()

if (process.env.NODE_ENV){
  const result = require('dotenv').config()
  console.log("Hii")
  if (result.error) {
    throw result.error
  }
}

db.connectToDB();
faker.seed(123);

let users = []
let subjects = []
for (let i =0;i<10;i++){
    let tempUser = {
        name: faker.name.findName(),
        // gives number is7-9 digit
        tid: faker.finance.routingNumber()
    }
    
    let tempSubject = {
        // SubjectNAme hehe
        name:faker.company.companyName(),
        fname:faker.name.firstName()+faker.name.lastName(),
        classRoom:faker.random.word()
    }
    users.push(tempUser)
    subjects.push(tempSubject)
}

// console.log(users)
// console.log(subjects)
let req_users;
User.insertMany(users,(err,data)=>{
    if(err){
        throw err
    }
    req_users = data

})

let req_subj;
Subject.insertMany(subjects,(err,data)=>{
    if(err){
        throw err
    }
    req_subj = data
})

// let slots = []
for(let j=0;j<3;j++){
    let tempSlot = {
        name:faker.name.firstName()
    }
    slots.push(tempSlot)
}

let req_slots=[];
slots.forEach(slot=>{
    Slot.create({...slot},(err,data)=>{
      if(err){
          throw err
      } 
      console.log(data)
      req_slots.push(data)
    })
})

// Slot.find({},(err,slot)=>{
//     if (err) throw error
// })


