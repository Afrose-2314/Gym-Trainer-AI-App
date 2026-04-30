const el = id => document.getElementById(id);

/* ---------- STATE ---------- */
let state = JSON.parse(localStorage.getItem("fitflex")) || {
  theme:"dark",
  workouts:0,
  calories:0,
  history:[],
  week:[0,0,0,0,0,0,0]
};

let timer=null;
let timeLeft=30;
let currentWorkout=null;

/* ---------- SAVE ---------- */
function save(){
  localStorage.setItem("fitflex", JSON.stringify(state));
}

/* ---------- THEME ---------- */
function applyTheme(){
  document.body.classList.remove("light","dark");
  document.body.classList.add(state.theme);
}

el("themeToggle").onclick = ()=>{
  state.theme = state.theme==="dark"?"light":"dark";
  applyTheme();
  save();
};

/* ---------- LOGIN ---------- */
function enterApp(){
  const name = el("username").value;
  if(!name) return alert("Enter name");

  el("welcome").style.display="none";
  el("app").style.display="block";
}

/* ---------- LOAD ---------- */
function load(){
  el("workouts").textContent = state.workouts;
  el("calories").textContent = state.calories;

  const list = el("history");
  list.innerHTML="";
  state.history.forEach(h=>{
    const li=document.createElement("li");
    li.textContent=h;
    list.appendChild(li);
  });

  loadChart();
}

/* ---------- BMI ---------- */
el("calcBMI").onclick = ()=>{
  const h = el("height").value/100;
  const w = el("weight").value;

  if(!h || !w) return;

  const bmi = (w/(h*h)).toFixed(1);

  let status="";
  if(bmi<18.5) status="Underweight";
  else if(bmi<25) status="Normal";
  else status="Overweight";

  el("bmiResult").textContent = `BMI: ${bmi} (${status})`;
};

/* ---------- AI WORKOUT ---------- */
function generateAIWorkout(){
  const goal = el("goal").value;

  let workouts;

  if(goal==="loss"){
    workouts=["Jumping Jacks","Burpees","High Knees"];
  }else if(goal==="gain"){
    workouts=["Pushups","Squats","Plank"];
  }else{
    workouts=["Pushups","Jumping Jacks","Plank"];
  }

  const ul = el("aiPlan");
  ul.innerHTML="";

  workouts.forEach(w=>{
    const li=document.createElement("li");
    li.textContent=w;

    li.onclick=()=>{
      currentWorkout=w;
      completeWorkout();
    };

    ul.appendChild(li);
  });
}

/* ---------- TIMER ---------- */
function updateTimer(){
  el("timer").textContent = "00:" + String(timeLeft).padStart(2,"0");
}

function startTimer(){
  if(timer) return;

  timer=setInterval(()=>{
    timeLeft--;
    updateTimer();

    if(timeLeft<=0){
      clearInterval(timer);
      timer=null;
      alert("Time up!");
    }
  },1000);
}

function pauseTimer(){
  clearInterval(timer);
  timer=null;
}

/* ---------- COMPLETE ---------- */
function completeWorkout(){
  state.workouts++;
  state.calories += 10;

  state.history.push(currentWorkout+" done");

  const day = new Date().getDay();
  state.week[day]++;

  save();
  load();
}

/* ---------- CHART ---------- */
let chart;

function loadChart(){
  const ctx = document.getElementById("chart");

  if(chart) chart.destroy();

  chart = new Chart(ctx,{
    type:"bar",
    data:{
      labels:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],
      datasets:[{
        label:"Workouts",
        data:state.week
      }]
    }
  });
}

/* ---------- EXPORT ---------- */
el("exportData").onclick = ()=>{
  const blob = new Blob([JSON.stringify(state,null,2)],{type:"application/json"});
  const a=document.createElement("a");
  a.href=URL.createObjectURL(blob);
  a.download="fitflex.json";
  a.click();
};

/* ---------- INIT ---------- */
applyTheme();
load();
updateTimer();
