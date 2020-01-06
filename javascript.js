class Task{
    constructor (id, content, active){
        this.id = id;
        this.content = content;
        this.active = active;
    }
}

let list = localStorage.getItem('tasksList') ? JSON.parse(localStorage.getItem('tasksList')) : [];
let listType = localStorage.getItem('listType') ? localStorage.getItem('listType') : 'all';
let activeTasksCounter = 0;
let autoId = localStorage.getItem('autoId') ? +localStorage.getItem('autoId') : 0;
let tasksStatus = true;

// start init page
document.addEventListener("DOMContentLoaded", function () {
    switch(listType){
        case 'all' : showAllTasks(); break;
        case 'active' : showActiveTasks(); break;
        case 'completed' : showCompletedTasks(); break;        
    }
    if(list.length > 0){
        for(let i = 0; i < list.length; i++){
            if(list[i].active === false){
                activeTasksCounter++;
            }
        }
        updateActiveTasksCounter();
        displayButtons();
    }
    else{
        hiddenButtons();
    }
});

//write a new task on upper input
function writeTask(event, value){
    if(event.code == "Enter"){
        list.length == 0 ? displayButtons() : 0;
        let myTask = new Task(autoId, value, false);
        list.push(myTask);
        localStorage.setItem('tasksList', JSON.stringify(list));
        document.getElementById('newTask').value = '';
        addTaskToContainer(makeTask(myTask));
        activeTasksCounter++;
        updateActiveTasksCounter();
        autoId++;
        localStorage.setItem('autoId', autoId);
    }
}

// create div for task and return it to activer
function makeTask(task){
    const taskDiv = document.createElement('div');
    taskDiv.setAttribute('id', task.id);
    const remove = document.createElement('label');
    remove.innerText = 'X';
    remove.addEventListener('click', deleteTask);
    const input = document.createElement('input');
    input.setAttribute('type', 'text');
    input.setAttribute('class', task.active === true ? 'completedTask' : 'activeTask');
    input.addEventListener('change',changeTaskContent)
    const checkbox = document.createElement('input');
    checkbox.setAttribute('type', 'checkbox');
    task.active == true ? checkbox.setAttribute('checked', 'true') : 0;
    checkbox.addEventListener('change',changeTaskStatus);
    input.value = task.content;
    taskDiv.appendChild(checkbox);
    taskDiv.appendChild(input);
    taskDiv.appendChild(remove);
    return taskDiv;
}

// print tasks by parameters

// create divs to all tasks
function showAllTasks(){
    emptyTasksContainer();
    if(list){
        localStorage.setItem('listType', 'all');      
        for(let i = 0 ; i < list.length; i++){
            addTaskToContainer(makeTask(list[i]));
        }
    }
}

// create divs to active tasks
function showActiveTasks(){
    emptyTasksContainer();
    localStorage.setItem('listType', 'active');    
    if(list){
        for(let i = 0 ; i < list.length; i++){
            if(list[i].active === false){
                addTaskToContainer(makeTask(list[i]));
            }
        }
    }
}

// create divs to completed tasks
function showCompletedTasks(){
    emptyTasksContainer();
    localStorage.setItem('listType', 'completed');
    if(list){
        const div = document.createElement('div');
        for(let i = 0 ; i < list.length; i++){
            if(list[i].active === true){
                addTaskToContainer(makeTask(list[i]));
            }
        }
    }
}

// active tasks counter

// update actice tasks counter on dom
function updateActiveTasksCounter(){
    document.getElementById('leftItems').innerText = activeTasksCounter + ' items left';
}

// update display to footer on dom
function displayButtons(){
    let footer = document.getElementById('footer');    
    footer.removeAttribute('hidden');
    let label = document.getElementById('changeStatus');
    label.removeAttribute('hidden');
}

// update display - hidden to footer on dom
function hiddenButtons(){
    if(list){
        let footer = document.getElementById('footer');    
        footer.setAttribute('hidden', 'true');
        let label = document.getElementById('changeStatus');
        label.setAttribute('hidden','true');
    }
}

// tasks container

// empty tasks container on dom
function emptyTasksContainer(){
    let container = document.getElementById("tasksContainer");
    container.innerHTML = '';
}

// add task div to dom
function addTaskToContainer(taskDiv){
    let container = document.getElementById("tasksContainer");
    container.appendChild(taskDiv);
}

// remove task div from dom
function removeTaskFromContainer(id){
    document.getElementById(+id).remove();
}

// other changes on tasks

// content of task
function changeTaskContent(){
    const id = event.srcElement.parentElement.getAttribute('id');
    const text = event.srcElement.parentElement.getElementsByTagName('input')[1];
    const task = list.find(i => i.id === +id);
    task.content = text.value;
    localStorage.setItem('tasksList', JSON.stringify(list));
}

function changeTaskToActive(task){
    taskDiv = document.getElementById(task.id);
    checkbox = taskDiv.getElementsByTagName('input')[0];
    text = taskDiv.getElementsByTagName('input')[1];
    id = taskDiv.getAttribute('id');
    task.active = tasksStatus;
    activeTasksCounter++;
    checkbox.removeAttribute('checked');
    document.getElementById(id).checked = false;
    text.setAttribute('class', 'activeTask');            
}

function changeTaskToCompleted(task){
    taskDiv = document.getElementById(task.id);
    checkbox = taskDiv.getElementsByTagName('input')[0];
    text = taskDiv.getElementsByTagName('input')[1];
    id = taskDiv.getAttribute('id');
    task.active = tasksStatus;
    checkbox.setAttribute('checked', 'true');
    text.setAttribute('class','completedTask');            
}


// status of task
function changeTaskStatus(){
    taskDiv = event.srcElement.parentElement;
    checkbox = taskDiv.getElementsByTagName('input')[0];
    text = taskDiv.getElementsByTagName('input')[1];
    id = taskDiv.getAttribute('id');
    const task = list.find(i => i.id === +id);
    task.active = !task.active;
    if (task.active === true){
        activeTasksCounter--;
        checkbox.removeAttribute('checked');
        text.setAttribute('class','completedTask');            
    }
    else{
        activeTasksCounter++;
        checkbox.setAttribute('checked', 'true');
        text.setAttribute('class', 'activeTask');            
    }
    updateActiveTasksCounter();    
    // text.setAttribute('class', task.active === true ? 'completedTask' : 'activeTask');    
    localStorage.setItem('tasksList', JSON.stringify(list));
}

// change status to the all list
function changeStatus(){
    if(list){
        activeTasksCounter = 0;
        tasksStatus = !tasksStatus;
        for(let i = 0 ; i < list.length; i++){
            tasksStatus == true ? changeTaskToCompleted(list[i]) : changeTaskToActive(list[i]);
        }
    }
    updateActiveTasksCounter();    
    localStorage.setItem('tasksList', JSON.stringify(list));
}

// delete task by X button (from list and dom)
function deleteTask(){
    id = event.srcElement.parentElement.getAttribute('id');
    let task = list.find(i => i.id === +id);
    task.active === true ? activeTasksCounter-- : activeTasksCounter;
    list.splice(list.indexOf(task),1);
    localStorage.setItem('tasksList', JSON.stringify(list));    
    removeTaskFromContainer(id);
    updateActiveTasksCounter();
    list.length == 0 ? hiddenButtons() : 0;
}

// clear list and dom from completed tasks
function clearCompleted(){
    if(list){
       
        for(let i = 0 ; i < list.length; i++){
            if(list[i].active === true){ 
                removeTaskFromContainer(list[i].id);
                list.splice(i,1);
                i--;
            }
        }
    }
    localStorage.setItem('tasksList', JSON.stringify(list));    
    list.length == 0 ? hiddenButtons() : 0;
}