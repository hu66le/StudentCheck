const express = require('express')  // готовые функции
const mysql = require('mysql2')     // библиотека для работы с базой данных
const cors = require('cors')// политика без-а 
const app = express() //  константу app, вызывает express()
const PORT = 4000     //для обращения фронта к беку

// подключ к базе данных
const connection = mysql.createConnection({
    host: "localhost", //адрес базы данных
    user: "root",
    database: "stch", //название бд
    password: "root"
});

app.use(cors())

let groupId = 0;
let students = []
let attendances = []



app.get('/get/statistic/', async (request, response) => {
    // параметры запроса, которые приходят с клиента(фронта)
    let CardId = request.query.cardid // query параметтр с запроса
    let lessonId = request.query.lessonid
    let visitsCount = 0;
    let lessonsCount = 0;
    // SQL-запросы к бд, SELECT- выбирает, * все поля данной таблицы, после FROM название таблицы
    // WHERE условие по которому выбираю 
    const attentionsCountSQL = `SELECT * FROM attendance WHERE CardId=${CardId} AND LessonId=${lessonId}`
    // Получааюю количество пар этого предмета в семестре
    const lessonsCountSQL = `SELECT Lessons_Count FROM lessons WHERE Id=${lessonId}`

    connection.connect(async function (err) {
        connection.query(attentionsCountSQL, function (err, data) {
            if (err) return console.log(err);
            visitsCount = data.length
        });
    })

    connection.query(lessonsCountSQL, function (err, data) {
        lessonsCount = data[0].Lessons_Count
        response.send(`Студент посетил ${visitsCount} из ${lessonsCount} пар в семестре, это ${(visitsCount / (lessonsCount / 100))} %`)
    });
})
//
// const object=[
//     {Count:40, Id:10, },
//     {Count:40, Id:11, },
//     {Count:40, Id:12, },
// ]

// object[0].Count

app.get('/get/group-statistic', async (request, response) => {
    let groupId = request.query.groupid
    let timitableId = request.query.timitableid
    let studentsCount = 0;
    let sql = `SELECT students_count FROM groups_attendance WHERE timitableId=${timitableId} AND groupId=${groupId}`
    let getGroupStudentsCountSQL = `SELECT Students_Count FROM groups WHERE Id=${groupId}`
    let studentsCountInGroup = 0;

    connection.query(sql, (err, data) => {
        studentsCount = data[0].students_count
    })

    connection.query(getGroupStudentsCountSQL, (err, data) => {
        studentsCountInGroup = data[0].Students_Count
        response.send(`На паре было ${studentsCount} из ${studentsCountInGroup}, это ${studentsCount / (studentsCountInGroup / 100)} %`)
    })
})


app.get('/get', async (request, response) => {
    getAttendances(request.query.timitableId)
    response.send('Количество студентов, посетивших пару:' + attendances.length)
})



app.get('/get-students', (request, response) => {
    let timitableId = request.query.timitableId
    let groupSql = `SELECT GroupId from timitable WHERE Id=${timitableId}`
    let studentsSql = ``
    connection.query(groupSql, (err, data) => {
        groupId = parseInt(data[0].GroupId)
        studentsSql = `SELECT * from students WHERE GroupId=${groupId}`
        connection.execute(studentsSql, (err, data) => {
            students = data
            let studentStatus = []
            students.forEach((student) => {
                getAttendances(timitableId)
                attendances.forEach((attendance) => {
                    if (attendance.CardId == student.CardCode) {
                        studentStatus.push({ 'Name': student.Name, 'LastName': student.SurName, 'Status': true })
                    } else {
                        studentStatus.push({ 'Name': student.Name, 'LastName': student.SurName, 'Status': false })
                    }
                })
            })
            response.send(studentStatus)
        })
    })
})


function getAttendances(timitableId) {
    let sql = `SELECT * from attendance WHERE TimitableId=${timitableId}`
    connection.query(sql, (err, data) => {
        attendances = data
    })
}

app.get('/api/groups', (req, res) => {
    let sql = "SELECT * FROM groups";
    connection.query(sql, (err, data) => {
        res.send(data)
    })
})

app.get('/api/students/:id', (req, res) => {
    const id = req.params.id
    console.log(id)
    let sql = `SELECT * FROM students WHERE GroupId=${id}`;
    connection.query(sql, (err, data) => {
        console.log(data)
        res.send(data)
    })
})

app.listen(PORT)