const taskContainer = document.querySelector(".task_container");

let globalTaskData = [];

const generateHTML = (taskData) => `<div id=${taskData.id} class="col-md-6 col-lg-4 my-4">
<div class="card">
<div class="card-header d-flex justify-content-end gap-2">
  <button class="btn btn-outline-info" name = ${taskData.id} onclick = "editCard.apply(this, arguments)">
    <i class="fas fa-pencil-alt" name = ${taskData.id}></i>
  </button>
  <button class="btn btn-outline-danger" name = ${taskData.id} onclick = "deleteCard.apply(this, arguments)">
    <i class="far fa-trash-alt" name = ${taskData.id} ></i>
  </button>
</div>
<div class="card-body">
  <img src = ${taskData.image} class = "card-img" alt = "image"  />
  <h5 class="card-title mt-3">${taskData.title}</h5>
  <p class="card-text">${taskData.description}</p>
  <span class="badge bg-primary">${taskData.type}</span>
</div>
<div class="card-footer">
  <button class="btn btn-outline-primary" name = ${taskData.id}>Open Task</button>
</div>
</div>
</div>`

const saveToLocalStorage = () => localStorage.setItem("taskyCA", JSON.stringify({card : globalTaskData}));

const insertToDOM = (content) =>   taskContainer.insertAdjacentHTML("beforeend",content);

const addNewCard = () => {
    // get task data
    const taskData = {
        id: `${Date.now()}`,
        title: document.getElementById("tasktitle").value,
        image: document.getElementById("imageURL").value,
        type: document.getElementById("taskType").value,
        description: document.getElementById("taskDescription").value,
    };

    globalTaskData.push(taskData);

    //update the local storage
    saveToLocalStorage();
    // Generate HTML code
    const newCard = generateHTML(taskData);
    // inject it to DOM
    insertToDOM(newCard);
    // Clear form
  document.getElementById("tasktitle").value = "";
  document.getElementById("imageURL").value = "";
  document.getElementById("taskType").value = "";
  document.getElementById("taskDescription").value = "";

return;

};

const loadExistingCards = () => {
  //check local storage
  const getData = localStorage.getItem("taskyCA");
 //retrieve data if exists
  if(!getData) return;

  const taskCards = JSON.parse(getData);

  globalTaskData = taskCards.card;

  globalTaskData.map((taskData) => {
    //generate HTML code for those data
    const newCard = generateHTML(taskData);
    //Inject to the DOM
    insertToDOM(newCard);

  });
  return;
};

const deleteCard = (event) => {
  const targetID = event.target.getAttribute("name");
  const elementType = event.target.tagName;


  const removeTask = globalTaskData.filter((task) => task.id !== targetID);
  globalTaskData = removeTask;
  //update the local storage
  saveToLocalStorage();

  //access DOM to remove card.
  if(elementType === "BUTTON"){
    return taskContainer.removeChild(event.target.parentNode.parentNode.parentNode);
  }
  else{
    return taskContainer.removeChild(event.target.parentNode.parentNode.parentNode.parentNode);
  }
};

const editCard = (event) => {
  const targetID = event.target.getAttribute("name");
  const elementType = event.target.tagName;

  let taskTitle;
  let taskType;
  let taskDescription;
  let parentElement;
  let submitButton;

  if(elementType==="BUTTON"){
    parentElement = event.target.parentNode.parentNode;
  }
  else{
    parentElement = event.target.parentNode.parentNode.parentNode;
  }

  taskTitle = parentElement.childNodes[3].childNodes[3];
  taskDescription = parentElement.childNodes[3].childNodes[5];
  taskType = parentElement.childNodes[3].childNodes[7];
  submitButton = parentElement.childNodes[5].childNodes[1];

  taskTitle.setAttribute("contenteditable", "true");
  taskDescription.setAttribute("contenteditable", "true");
  taskType.setAttribute("contenteditable", "true");
  submitButton.setAttribute("onclick", "saveEdit.apply(this, arguments)");
  submitButton.innerHTML = "Save Changes";
}

const saveEdit = (event) => {
  const targetID = event.target.getAttribute("name");
  const elementType = event.target.tagName;

  let parentElement;

  if(elementType==="BUTTON"){
    parentElement = event.target.parentNode.parentNode;
  }
  else{
    parentElement = event.target.parentNode.parentNode.parentNode;
  }

  const taskTitle = parentElement.childNodes[3].childNodes[3];
  const taskDescription = parentElement.childNodes[3].childNodes[5];
  const taskType = parentElement.childNodes[3].childNodes[7];
  const submitButton = parentElement.childNodes[5].childNodes[1];

  const updatedData = {
    title: taskTitle.innerHTML,
    type: taskType.innerHTML,
    description: taskDescription.innerHTML
  }

  const updateGlobalTasks = globalTaskData.map((task) => {
    if(task.id === targetID){
      return {...task, ...updatedData};
    }
    return task;
  });
  globalTaskData = updateGlobalTasks;

  saveToLocalStorage();

  taskTitle.setAttribute("contenteditable", "false");
  taskDescription.setAttribute("contenteditable", "false");
  taskType.setAttribute("contenteditable", "false");
  submitButton.innerHTML = "Open Task";
}