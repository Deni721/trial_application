"use strict";

let MOCK_API = "https://6a0847ddfa9b27c848facfb1.mockapi.io/user";
let users = document.querySelector("[data-container-users]");
let forma = document.querySelector("[data-form]");
let btnForm=document.querySelector("[data-btn-form]");
let inputForm=document.querySelectorAll('.input-form');
let dial=document.querySelector('[data-dialog]');
let arrAllUsers = [];

const getUsers = async () => {
  arrAllUsers=[];
  try {
    let req = await fetch(MOCK_API);
    let resp = await req.json();
    
    if (req.status===200) {
      arrAllUsers.push(...resp);
      users.innerHTML="";
      displayAllUsers(arrAllUsers);
    } else {
      throw new Error("Ошибка при получении пользователя");
    }
    
  } catch (err) {
    console.log(err);
  }
};

const displayAllUsers = (arr) => {
  arr.forEach((elem) => {
    let card = document.createElement("div");
    card.classList.add("card");

    let name = document.createElement("h1");
    name.textContent = elem.name;
    
    let img = document.createElement("img");
    
    img.src = elem.avatar;
    img.alt = "avatar user";
    
    let btnFormDel=document.createElement('button');
    btnFormDel.classList.add('btn-form-del');
    btnFormDel.textContent='❌';
    btnFormDel.dataset.id=elem.id;
    
btnFormDel.addEventListener('click',(ev)=>{
  deleteUsers(ev.target.dataset.id)
})

    let btnFormUpd=document.createElement('button');
    btnFormUpd.classList.add('btn-form-upd');
    btnFormUpd.textContent='🔧';
    btnFormUpd.dataset.id=elem.id;

    btnFormUpd.addEventListener('click',()=>{
      dial.innerHTML='';
      dial.classList.add("dialog")
      let btnDial=document.createElement('button');
      btnDial.type='submit';
      btnDial.textContent="Close";
 
      btnDial.addEventListener('click',()=>{
        dial.close();
        dial.classList.remove('dialog')
      })

      let formDial=document.createElement('form');
      formDial.innerHTML=`
<label for="name">Name:</label>  
<input type="text" id="name" name="name" data-form-name required  class="input-form" style="width:100%"><br>
<label for="citi"> City:</label>
<input type="text" id="citi" name="citi" data-form-city required class="input-form" style="width:100%"><br>
<label for="email">Email:</label>
<input style="width:100%" type="email" id="email" name="email" required data-form-email class="input-form">`;
       formDial.append(btnDial);
       dial.append(formDial);

       formDial.addEventListener('submit',(ev)=>{
        ev.preventDefault();
       let dataFormDialog=Object.fromEntries(new FormData(formDial));
       let obj={
        name:dataFormDialog.name,
        citi:dataFormDialog.citi,
        email:dataFormDialog.email,
        avatar:''
       }

       UpdateUser(btnFormUpd.dataset.id,obj)
      })

    })

    let citi = document.createElement("p");
    citi.textContent = elem.citi;
    
    let email = document.createElement("p");
    email.innerHTML = elem.email;

    card.append(img,name, citi, email,btnFormDel,btnFormUpd);
    users.append(card);
    
  });
};

const createUser=async ()=>{
  try{
    
    let dataForm=Object.fromEntries(new FormData(forma));
    let req= await fetch(MOCK_API,{
      method:"POST",
      body:JSON.stringify(dataForm),
      headers:{
        'Content-type':'application/json'
      }
    });
    
    if (req.status===201){
      arrAllUsers.push(dataForm);
      getUsers();
    }else{
      throw new Error('Ошибка при создания пользователя');
  }

}catch(err){
  console.log(err.message)
}

}

const deleteUsers=async (id)=>{
  
  try{

    let req=await fetch(`${MOCK_API}/${id}`,{
      method:'DELETE'
    })

    if(req.status===200){
    let resp=await req.json()
    console.log(resp,resp.status)
    
    arrAllUsers=arrAllUsers.filter(elem=>{
      if(elem.id!==id){
        return elem
      }
    });
    
    getUsers();
  }else{
    throw new Error('Ошибка при удалении пользователя')
  }

  }catch(err){
    console.log(err)
  }
}

const UpdateUser=async (id,newDataForm)=>{
try{

let req=await fetch(`${MOCK_API}/${id}`,{
  method:'PUT',
  body:JSON.stringify({
    name:newDataForm.name,
    city:newDataForm.citi,
    email:newDataForm.email
  }),
  headers:{
    'Content-type':'application/json'
  }
});

let resp=await req.json()

if(req.status===200){

arrAllUsers=arrAllUsers.map(elem=>{
  if(+elem.id===Number(resp.id)){
    elem.name=newDataForm.name;
    elem.citi=newDataForm.citi;
    elem.email=newDataForm.email;
    console.log('обновл элемент',elem)
     return elem
  }
  return elem
})
console.log(arrAllUsers)
users.innerHTML='';
displayAllUsers(arrAllUsers);
console.log('END!!')
}else{
  throw new Error('Ошибка при обновлении данных пользователя')
}

}catch(err){
  console.log(err.message)
}

}


forma.addEventListener('submit',(ev)=>{
  ev.preventDefault();
  createUser()
  
  inputForm.forEach(elem=>{
    elem.value='';
  })
  
})

getUsers();
  
 
  