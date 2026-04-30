const el = id => document.getElementById(id);
const els = sel => document.querySelectorAll(sel);

/* STATE */
let state = JSON.parse(localStorage.getItem("fitflex")) || {
  theme:"dark",
  workouts:0,
  calories:0,
  history:[]
};

let currentWorkout=null;

/* WORKOUTS */
const WORKOUTS = [
  {name:"Push-ups",calories:8},
  {name:"Squats",calories:10},
  {name:"Plank",calories:6},
  {name:"Jumping Jacks",calories:12}
];

/* THEME */
function applyTheme(){
  document.body.classList.remove("light","dark");
  document.body.classList.add(state.theme);
}

el("themeToggle").onclick = ()=>{
  state.theme = state.theme==="dark"?"light":"dark";
  applyTheme();
  save();
};

/* SAVE */
function save(){
  localStorage.setItem("fitflex", JSON.stringify(state));
}

/* LOAD DASHBOARD */
function loadDashboard(){
  el("statWorkouts").textContent = state.workouts;
  el("statCalories").textContent = state.calories;
}

/* LOAD WORKOUTS */
function loadWorkouts(){
  const grid = el("workoutGrid");
  grid.innerHTML="";

  WORKOUTS.forEach(w=>{
    const div=document.createElement("div");
    div.className="workout-card";
    div.textContent=w.name;

    div.onclick=()=>{
      currentWorkout=w;
      completeWorkout();
    };

    grid.appendChild(div);
  });
}

/* COMPLETE */
function completeWorkout(){
  state.workouts++;
  state.calories += currentWorkout.calories;

  state.history.push(new Date().toLocaleString()+" - "+currentWorkout.name);

  save();
  loadDashboard();
  loadHistory();
  loadChart();
}

/* HISTORY */
function loadHistory(){
  const list=el("historyList");
  list.innerHTML="";

  state.history.forEach(h=>{
    const li=document.createElement("li");
    li.textContent=h;
    list.appendChild(li);
  });
}

/* BMI */
el("calcBMI").onclick = ()=>{
  const h = el("height").value/100;
  const w = el("weight").value;

  if(!h||!w) return;

  const bmi=(w/(h*h)).toFixed(1);
  el("bmiResult").textContent="BMI: "+bmi;
};

/* CHART */
let chart;
function loadChart(){
  const ctx=document.getElementById("weekChart");

  if(chart) chart.destroy();

  const data=[0,0,0,0,0,0,0];

  state.history.forEach(h=>{
    const d=new Date(h.split(" - ")[0]).getDay();
    data[d]++;
  });

  chart=new Chart(ctx,{
    type:"bar",
    data:{
      labels:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],
      datasets:[{label:"Workouts",data:data}]
    }
  });
}

/* TABS */
els(".tab").forEach(btn=>{
  btn.onclick=()=>{
    els(".page").forEach(p=>p.classList.remove("active"));
    els(".tab").forEach(t=>t.classList.remove("active"));

    btn.classList.add("active");
    document.querySelector(btn.dataset.target).classList.add("active");
  };
});

/* INIT */
applyTheme();
loadDashboard();
loadWorkouts();
loadHistory();
loadChart();
