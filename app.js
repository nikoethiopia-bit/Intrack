const sections = {
  math:17,
  bio:12,
  eng:10,
  phy:10,
  sat:6,
  chem:10
};

const totalTasks = 65;

// Generate checkboxes automatically
function createCheckboxes(){
  for(let section in sections){
    let container = document.getElementById(section+"Boxes");
    for(let i=0;i<sections[section];i++){
      let box = document.createElement("input");
      box.type="checkbox";
      box.dataset.section=section;
      box.dataset.index=i;
      box.addEventListener("change",updateProgress);
      container.appendChild(box);
    }
  }
}

// Update section bars and overall donut
function updateProgress(){
  let totalChecked = 0;

  for(let section in sections){
    let boxes = document.querySelectorAll(`#${section}Boxes input`);
    let checked = 0;
    boxes.forEach(box=>{
      if(box.checked) checked++;
    });
    totalChecked += checked;
    let percent = (checked/sections[section])*100;
    document.getElementById(section+"Progress").style.width = percent+"%";
  }

  updateDonut(totalChecked);
  saveState();
}

// Update the main donut graph
function updateDonut(totalChecked){
  const percent = (totalChecked / totalTasks) * 100;
  document.getElementById("overallPercent").textContent = Math.round(percent)+"%";
  document.getElementById("overallCount").textContent = totalChecked+" / "+totalTasks+" Tasks";

  const circle = document.querySelector(".donut-progress");
  const radius = 90;
  const circumference = 2 * Math.PI * radius;

  circle.style.strokeDasharray = circumference;
  const offset = circumference * (1 - percent/100);
  circle.style.transition = "stroke-dashoffset 0.8s ease";
  circle.style.strokeDashoffset = offset;
  circle.style.stroke = "url(#gradient)";
}

// Save to localStorage
function saveState(){
  let data = {};
  for(let section in sections){
    let boxes = document.querySelectorAll(`#${section}Boxes input`);
    data[section] = [];
    boxes.forEach(box=> data[section].push(box.checked));
  }
  localStorage.setItem("trackerData",JSON.stringify(data));
}

// Load saved progress
function loadState(){
  let saved = localStorage.getItem("trackerData");
  if(!saved) return;
  let data = JSON.parse(saved);
  for(let section in data){
    let boxes = document.querySelectorAll(`#${section}Boxes input`);
    boxes.forEach((box,i)=> box.checked = data[section][i]);
  }
  updateProgress();
}

// Create checkboxes and load saved progress
createCheckboxes();
loadState();
updateProgress();

// Register service worker
if("serviceWorker" in navigator){
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("service-worker.js");
  });
}