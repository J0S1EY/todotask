const express = require('express')
const cors = require('cors')
const dataservice = require('./dataServices');
const { request, response } = require('express');
const toDo = express();
const jwt = require('jsonwebtoken')

toDo.listen(3000, () => {
    console.log('To-Do server started at port 3000')
})

toDo.use(express.json())
toDo.use(cors({ origin: 'http://localhost:4200' }))

// register user
toDo.post('/signup', (request, response) => {
    // console.log(request.body.username, request.body.password )
    dataservice.signup(request.body.username, request.body.password).then((result) => {
        response.status(result.statusCode).json(result)
    })
})

// login user
toDo.post('/login', (request, response) => {
    // console.log(request.body.user, request.body.pswd)
    dataservice.login(request.body.user, request.body.pswd).then((result) => {
        response.status(result.statusCode).json(result)
    })
})

//router specific middleware for token validation

const jwtMiddleware = (req, res, next) => {
    // console.log('routerMiddleware active');
    let token = req.headers['todojwt']
    // console.log("token " + token)
    try {
        data = jwt.verify(token, 'mytodo')
        // console.log("jwt" + data);
        user = data.jwtuser
        pswd = data.jwtpswd
        next()
    } catch {
        res.status(404).json({
            status: false,
            message: "login again"
        })
    }
}
//add new task & using jwt authantication
toDo.post('/newtask', jwtMiddleware, (request, response) => {
    dataservice.newTask(user, pswd, request.body.taskId, request.body.title, request.body.task).then((result) => {
        response.status(result.statusCode).json(result)
    })
})

// get all task
toDo.get('/get-task', jwtMiddleware, (request, response) => {
    dataservice.gettaskList(user, pswd,).then((result) => {
        response.status(result.statusCode).json(result)
        //console.log("index", result)
    })
})

// task completation
toDo.put('/task-status', jwtMiddleware, (request, response) => {
    //console.log("task-Complete index task id", request.body.indexNum, request.body.status)
    dataservice.taskStatus(user, pswd, request.body.objId, request.body.status).then((result) => {
        response.status(result.statusCode).json(result)

    })
})

// task delete

toDo.delete('/task-delete/:id', jwtMiddleware, (request, response) => {
    dataservice.taskDelete(user, request.params.id).then((result) => {
        response.status(result.statusCode).json(result)
    })
})

// task multiple delete

toDo.delete('/task-multiple-delete',jwtMiddleware, (req, res) => {
    const taskIds = req.body.ids; 
    dataservice.deleteMultipleTasks(user,taskIds).then(result => {
        res.status(200).send({ message: 'Tasks deleted successfully', result });
    }).catch(error => {
        res.status(500).send({ message: 'Error deleting tasks', error });
    });
});

