let groups=[];
let students=[];

getGroups();

function getGroups(){
    const Url='http://localhost:4000/api/groups';
    const zapros=new XMLHttpRequest();
    zapros.open('GET',Url);
    zapros.onload=function(){
        groups=JSON.parse(zapros.response);
        console.log(groups);
        otrisovkaGroups();
    }
    zapros.send()
}

function otrisovkaGroups(){
    let string=``
    groups.forEach((group,index)=>{
        string+=`<button onclick="getStudents(${group.Id})" id="${group.Id}">${group.GroupName}</button> `
    })

    
    $('.wrapper').html(string)

}
function getStudents(Id){
    const Url=`http://localhost:4000/api/students/${Id}`;
    const zapros=new XMLHttpRequest();
    zapros.open('GET',Url);
    zapros.onload=function(){
        students=JSON.parse(zapros.response);
        console.log(students);
        otrisovkaStudents();
    }
    zapros.send()
}
function otrisovkaStudents(){
    let string=``
    students.forEach((student,index)=>{
        string+=`<a href="#" id="${student.Id}">${student.Surname} ${student.Name}</a><br>`
    })

    $('.students').html(string)

}