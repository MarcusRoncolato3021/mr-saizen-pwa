(() => {
"use strict";
const PROGRAM={"1":{"name":"Base","note":"Entrada controlada, menor fadiga global.","days":{"1":"u1","2":"l1","4":"u2","5":"l2"}},"2":{"name":"Build 1","note":"Primeiro aumento concentrado nos grupos de maior prioridade.","days":{"1":"u2","2":"l2","4":"u1","5":"l1"}},"3":{"name":"Build 2","note":"Costas chegam antes ao teto por prioridade e frequência nos uppers.","days":{"1":"u1","2":"l1","4":"u2","5":"l2"}},"4":{"name":"Overload 1","note":"Grupos Tier III chegam ao teto; Tier I permanece controlado.","days":{"1":"u2","2":"l2","4":"u1","5":"l1"}},"5":{"name":"Overload 2","note":"Mantém teto dos grupos prioritários sem exceder tiers máximos.","days":{"1":"u1","2":"l1","4":"u2","5":"l2"}},"6":{"name":"Peak Week","note":"Maior exigência geral da periodização, sem exceder o tier máximo.","days":{"1":"u2","2":"l2","4":"u1","5":"l1"}},"7":{"name":"Deload de Volume","note":"Redução clara de volume, mantendo estrutura e exercícios principais.","days":{"1":"u1","2":"l1","4":"u2","5":"l2"}}};
const BASE={"u1":[["Pulldown Aberto Pronado","4–6"],["Remada Articulada Sagital","4–6"],["T-Bar com Apoio","4–6"],["Desenvolvimento Máquina","4–6"],["Elevação Lateral Máquina","5–9"],["Supino Pegada Neutra","4–6"],["Voador Máquina","5–9"],["Rosca Inclinado 45°","5–9"]],"u2":[["Remada Articulada Sagital","4–6"],["Remada Curvada","4–6"],["Desenvolvimento Máquina","4–6"],["Elevação Lateral Máquina","5–9"],["Pullover com Halter","4–6"],["Press Transversal","4–6"],["Voador Máquina","5–9"],["Rosca Scott","5–9"]],"l1":[["Cadeira Abdutora","5–9"],["Glute Bridge","4–6"],["Leg Press 45","4–6"],["Cadeira Flexora","5–9"],["Mesa Flexora","5–9"],["Panturrilha em Pé","5–9"],["Leg Unilateral","4–6"],["Cadeira Extensora — pico na fase alongada","5–9"],["Tríceps Unilateral no Cabo","5–9"]],"l2":[["Rack Pull","4–6"],["Cadeira Flexora","5–9"],["Mesa Flexora","5–9"],["Cadeira Abdutora","5–9"],["Elevação Pélvica","4–6"],["Panturrilha em Pé","5–9"],["Split Squat no Smith","4–6"],["Cadeira Extensora — pico na fase contraída","5–9"],["Pullover com Halter","4–6"]]};
const CLUSTER={"u1":[1,1,1,1,1,1,1,1],"u2":[1,0,1,1,0,1,1,1],"l1":[1,0,1,1,1,1,0,1,0],"l2":[0,1,1,1,0,1,0,1,0]};
const SETS={"1":{"u1":[1,1,1,1,1,1,1,1],"l1":[1,1,1,1,1,1,1,1,1],"u2":[1,1,1,1,1,1,1,1],"l2":[1,1,1,1,1,1,1,1,1]},"2":{"u1":[1,1,1,1,1,1,1,1],"l1":[1,2,1,1,1,1,1,1,1],"u2":[2,1,2,2,1,1,1,1],"l2":[1,2,2,2,2,1,1,1,1]},"3":{"u1":[2,2,2,2,2,2,1,1],"l1":[2,2,1,2,2,1,1,1,1],"u2":[1,2,1,1,2,1,1,1],"l2":[1,1,1,1,2,1,1,1,2]},"4":{"u1":[1,1,1,1,1,1,1,1],"l1":[1,2,1,1,1,1,1,1,1],"u2":[2,2,2,2,2,1,1,1],"l2":[2,2,2,2,2,1,1,1,2]},"5":{"u1":[2,2,2,2,2,2,2,1],"l1":[2,2,1,2,2,1,1,1,1],"u2":[1,2,1,1,2,1,1,1],"l2":[2,2,2,2,2,1,1,1,2]},"6":{"u1":[1,1,1,1,1,1,1,1],"l1":[1,2,1,1,1,1,1,1,1],"u2":[2,2,2,2,2,2,2,1],"l2":[2,2,2,2,2,1,1,1,2]},"7":{"u1":[1,1,1,1,1,1,1,1],"l1":[1,1,1,1,1,1,1,1,1],"u2":[1,1,1,1,1,1,1,1],"l2":[1,1,1,1,1,1,1,1,1]}};
const DAYS=[1,2,4,5];
const DAYNAMES={0:"Dom",1:"Seg",2:"Ter",3:"Qua",4:"Qui",5:"Sex",6:"Sáb"};
const LABEL={u1:"Upper 1",u2:"Upper 2",l1:"Lower 1",l2:"Lower 2"};
const KEY="mr-saizen-state-v3";
const app=document.getElementById("app");
let state=loadState(), route="home", workout=null, timer=null, timerSeconds=0;
function defaultState(){return {startDate:"2026-08-10",cycle:1,restStraight:120,restBetweenExercises:120,clusterRest:20,logs:{},notes:{},edits:{},completed:{},cycles:[{id:1,name:"Ciclo 1",startDate:"2026-08-10"}],cycleCompleted:false};}
function loadState(){
 try{
  const raw=localStorage.getItem(KEY);
  const s=raw?{...defaultState(),...JSON.parse(raw)}:defaultState();
  s.logs=s.logs||{};
  Object.values(s.logs).forEach(l=>{if(!l.cycle)l.cycle=s.cycle||1;});
  s.notes=s.notes||{};s.completed=s.completed||{};s.cycles=s.cycles||[];
  if(!s.cycles.length)s.cycles=[{id:s.cycle||1,name:`Ciclo ${s.cycle||1}`,startDate:s.startDate}];
  if(typeof s.cycleCompleted!=="boolean")s.cycleCompleted=false;
  return s;
 }catch(e){return defaultState();}
}
function save(){localStorage.setItem(KEY,JSON.stringify(state));}
function localDate(s){const [y,m,d]=s.split("-").map(Number);return new Date(y,m-1,d);}
function dateISO(d){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;}
function fmt(s){return localDate(s).toLocaleDateString("pt-BR",{day:"2-digit",month:"2-digit"});}
function todayISO(){return dateISO(new Date());}
function weekInfo(date=new Date()){const start=localDate(state.startDate), d=new Date(date.getFullYear(),date.getMonth(),date.getDate()), diff=Math.floor((d-start)/86400000);return {week:Math.max(1,Math.min(7,Math.floor(diff/7)+1)),diff};}
function workoutForDate(date=new Date()){const w=weekInfo(date).week;return PROGRAM[w].days[date.getDay()]||null;}
function workoutMethod(week,key,i){const day=Object.keys(PROGRAM[week].days).find(d=>PROGRAM[week].days[d]===key);return (day==="4"||day==="5")&&CLUSTER[key][i]===1?"cluster":"straight";}
function exercisesFor(week,key){return BASE[key].map((x,i)=>({name:state.edits?.[week]?.[key]?.[i]?.name||x[0],range:x[1],method:workoutMethod(week,key,i),sets:SETS[week][key][i]}));}
function esc(s){return String(s??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");}
function pill(m){return `<span class="pill ${m}">${m==="cluster"?"CLUSTER":"STRAIGHT"}</span>`;}
function layout(content){document.body.className=route==="workout"?"workout-page":"";app.innerHTML=`<div class="wrap"><header class="top"><div><div class="brand">MR. SAIZEN METHOD</div><div class="sub">${route==="workout"?"Treino em andamento":"Diário de treino · 7 semanas"}</div></div>${route==="workout"?'<button class="btn secondary small" id="exit">Sair</button>':""}</header>${content}</div>${nav()}`;const ex=document.getElementById("exit");if(ex)ex.onclick=()=>go("home");}
function nav(){return `<nav class="nav"><div class="navin"><button class="${route==="home"?"active":""}" data-nav="home">🏠<br><span>Início</span></button><button class="${route==="history"?"active":""}" data-nav="history">📊<br><span>Histórico</span></button><button class="${route==="settings"?"active":""}" data-nav="settings">⚙️<br><span>Config.</span></button></div></nav>`;}
function bindNav(){document.querySelectorAll("[data-nav]").forEach(b=>b.onclick=()=>go(b.dataset.nav));}
function go(r){route=r;render();}
function render(){if(route==="home"){if(state.cycleCompleted)renderCycleCompleted();else renderHome();}else if(route==="history")renderHistory();else if(route==="settings")renderSettings();else renderWorkout();bindNav();}
function cycleEndDate(){
 const d=localDate(state.startDate);d.setDate(d.getDate()+48);return dateISO(d);
}
function startNewCycle(){
 const raw=prompt("Data de início do novo ciclo (AAAA-MM-DD)",todayISO());
 if(!raw)return;
 if(!/^\\d{4}-\\d{2}-\\d{2}$/.test(raw)||isNaN(localDate(raw).getTime())){
   alert("Data inválida. Use o formato AAAA-MM-DD.");return;
 }
 const id=(state.cycle||1)+1;
 state.cycle=id;
 state.startDate=raw;
 state.cycleCompleted=false;
 state.cycles=state.cycles||[];
 state.cycles.push({id,name:`Ciclo ${id}`,startDate:raw});
 save();go("home");
}
function renderCycleCompleted(){
 layout(`<section class="hero cycle-complete">
   <div class="eyebrow">Ciclo ${state.cycle}</div>
   <div class="h1">🏁 Ciclo concluído</div>
   <p class="muted">Você completou as 7 semanas do método. O histórico deste ciclo foi preservado.</p>
   <div class="card"><div class="h2">Próximo ciclo</div><div class="muted">Ao iniciar, escolha a data em que a Semana 1 começará. O histórico anterior não será apagado.</div><button class="btn" id="newCycleHero" style="margin-top:12px">Iniciar novo ciclo</button></div>
   <div class="notice">Ciclo ${state.cycle} · ${fmt(state.startDate)} → ${fmt(cycleEndDate())}</div>
 </section>`);
 document.getElementById("newCycleHero").onclick=startNewCycle;
}
function openIOSShortcutTimer(seconds){
  const duration = Number(seconds) || 120;
  const shortcutName = "MR Saizen Timer";
  const url = "shortcuts://run-shortcut?name=" +
    encodeURIComponent(shortcutName) +
    "&input=" + encodeURIComponent(String(duration));
  window.location.href = url;
}
function renderHome(){const info=weekInfo(), p=PROGRAM[info.week], start=localDate(state.startDate), ws=new Date(start);ws.setDate(start.getDate()+(info.week-1)*7);const we=new Date(ws);we.setDate(ws.getDate()+6);let cards="";for(const d of DAYS){const dt=new Date(ws);dt.setDate(ws.getDate()+(d===1?0:d===2?1:d===4?3:4));const key=p.days[d], id=`${dateISO(dt)}|${info.week}|${key}`, done=!!state.completed[id];cards+=`<div class="card"><div class="row"><div><div class="h2">${LABEL[key]}</div><div class="muted">${DAYNAMES[d]} · ${fmt(dateISO(dt))} · ${d<=2?"Straight":"Cluster"}</div></div><button class="btn small" data-open="${info.week}|${key}|${dateISO(dt)}">${done?"Revisar":"Abrir"}</button></div></div>`;}
const todayKey=workoutForDate(new Date());layout(`<section class="hero"><div class="eyebrow">Ciclo ${state.cycle}</div><div class="h1">Semana ${info.week} — ${p.name}</div><div class="muted">${fmt(dateISO(ws))} → ${fmt(dateISO(we))}</div><p class="muted">${p.note}</p><div class="weekbar">${[0,1,2,3,4,5,6].map(i=>{const d=new Date(ws);d.setDate(ws.getDate()+i);const dow=d.getDay();return `<div class="day ${dateISO(d)===todayISO()?"active":""} ${!p.days[dow]?"rest":""}">${DAYNAMES[dow]}<br>${d.getDate()}</div>`;}).join("")}</div></section><div class="section eyebrow">Treinos da semana</div><div class="grid">${cards}</div>${todayKey?`<div class="section eyebrow">Hoje</div><div class="card"><div class="row"><div><div class="h2">${LABEL[todayKey]}</div><div class="muted">Treino programado para hoje</div></div><button class="btn" data-open="${info.week}|${todayKey}|${todayISO()}">Iniciar</button></div></div>`:""}`);document.querySelectorAll("[data-open]").forEach(b=>b.onclick=()=>{const [w,k,d]=b.dataset.open.split("|");startWorkout(Number(w),k,d);});}
function startWorkout(week,key,date){workout={week,key,date,index:0};route="workout";renderWorkout();bindNav();}
function noteKey(){return `${workout.date}|${workout.week}|${workout.key}|${workout.index}`;}
function logId(kind,number,block=0){return `${workout.date}|${workout.week}|${workout.key}|${workout.index}|${kind}|${number}|${block}`;}
function exerciseNoteKey(){return `${workout.key}|${workout.index}`;}
function lastExerciseNote(){
 const prefix=exerciseNoteKey()+"|";
 const notes=Object.entries(state.notes||{}).map(([k,v])=>{
   const parts=k.split("|");
   return {k,v,date:parts[0],week:parts[1],key:parts[2],index:parts[3]};
 }).filter(x=>x.k.startsWith(prefix)===false && x.key===workout.key && String(x.index)===String(workout.index) && x.date<workout.date && String(x.v||"").trim()!=="")
 .sort((a,b)=>b.date.localeCompare(a.date));
 return notes[0]||null;
}

function previousLogFor(defaults){
 const candidates=Object.values(state.logs||{}).filter(x=>
   x.exercise===defaults.exercise &&
   x.kind===defaults.kind &&
   String(x.number||"")===String(defaults.number||"") &&
   String(x.block||"")===String(defaults.block||"") &&
   x.date<defaults.date &&
   (x.weight!=="" || x.reps!=="")
 ).sort((a,b)=>b.date.localeCompare(a.date));
 return candidates[0]||null;
}
function getLog(id,defaults){
 if(!state.logs[id]){
   const previous=previousLogFor(defaults);
   state.logs[id]={
     id,...defaults,cycle:state.cycle,
     weight:previous?.weight??"",
     reps:previous?.reps??"",
     completed:false
   };
 }
 return state.logs[id];
}
function singleSet(e,kind,number,min,max){
const id=logId(kind,number),
l=getLog(id,{date:workout.date,week:workout.week,key:workout.key,index:workout.index,exercise:e.name,kind,number}),
title=kind==="warmup"?"Aquecimento":kind==="feeder"?"Feeder":`Work set ${number}`,
target=min===max?`${min}`:`${min}–${max}`,
isWork=kind==="work";
return `<div class="set-row ${l.completed?"is-done":""}">
  <div class="set-row-top">
    <div class="set-name">${kind==="warmup"?"🔥 ":""}${title}</div>
    <span class="pill">${target} reps</span>
  </div>
  <div class="set-inputs">
    <div class="field"><label>KG</label><input class="input" data-log="${id}" data-field="weight" inputmode="decimal" value="${esc(l.weight)}"></div>
    <div class="field"><label>REPS</label><input class="input" data-log="${id}" data-field="reps" inputmode="numeric" value="${esc(l.reps)}"></div>
  </div>
  <div class="set-actions">
    <button class="status-btn ${l.completed?"saved":"primary"}" data-complete="${id}">${l.completed?"✓ Salvo":"Registrar"}</button>
    ${isWork&&l.completed?`<button class="timer-btn" data-shortcut-rest="${state.restStraight}">⏱️ Iniciar descanso · <b>${formatTime(state.restStraight)}</b></button>`:""}
  </div>
</div>`;
}
function clusterSet(e,s){
let html=`<div class="cluster-set"><div class="cluster-head"><div class="set-name">Work set ${s}</div><span class="pill cluster">3 blocos · ${e.range}</span></div>`;
for(let b=1;b<=3;b++){
const id=logId("cluster",s,b),
l=getLog(id,{date:workout.date,week:workout.week,key:workout.key,index:workout.index,exercise:e.name,kind:"cluster",number:s,block:b});
html+=`<div class="cluster-block ${l.completed?"is-done":""}">
  <div class="cluster-block-top"><span>Bloco ${b}</span><span class="muted">${e.range} reps</span></div>
  <div class="set-inputs"><div class="field"><label>KG</label><input class="input" data-log="${id}" data-field="weight" ${b===1?`data-cluster-weight="${s}"`:`data-cluster-weight-target="${s}"`} inputmode="decimal" value="${esc(l.weight)}"></div><div class="field"><label>REPS</label><input class="input" data-log="${id}" data-field="reps" inputmode="numeric" value="${esc(l.reps)}"></div></div>
  <div class="set-actions">
    <button class="status-btn ${l.completed?"saved":"primary"}" data-complete="${id}">${l.completed?"✓ Salvo":"Registrar"}</button>
    ${l.completed&&b<3?`<button class="timer-btn" data-shortcut-rest="${state.clusterRest}">⏱️ Iniciar descanso · <b>${formatTime(state.clusterRest)}</b></button>`:""}
    ${l.completed&&b===3?`<button class="timer-btn cluster-final-rest" data-shortcut-rest="${state.restStraight}">⏱️ Iniciar descanso · <b>${formatTime(state.restStraight)}</b></button>`:""}
  </div>
</div>`;
}
return html+`</div>`;
}

function bindSetEvents(){
document.querySelectorAll("[data-log]").forEach(i=>{
  const saveInput=()=>{
    const l=state.logs[i.dataset.log];
    if(!l)return;
    l[i.dataset.field]=i.value;

    // Cluster: the three blocks use the same load. Typing the load in
    // Block 1 immediately mirrors it to Blocks 2 and 3, while reps remain
    // independent for each block.
    if(i.dataset.field==="weight" && i.dataset.clusterWeight){
      const parts=i.dataset.log.split("|");
      if(parts.length===7){
        for(let b=2;b<=3;b++){
          const otherId=[...parts.slice(0,-1),String(b)].join("|");
          const other=state.logs[otherId]||getLog(otherId,{
            date:workout.date,week:workout.week,key:workout.key,index:workout.index,
            exercise:l.exercise||"",kind:"cluster",number:Number(parts[5])||1,block:b
          });
          other.weight=i.value;
        }
      }
    }
    save();
    if(i.dataset.clusterWeight){
      document.querySelectorAll(`[data-cluster-weight-target="${i.dataset.clusterWeight}"]`).forEach(target=>{
        if(target!==i)target.value=i.value;
      });
    }
  };
  i.oninput=()=>{
    if(i.dataset.field==="weight" && i.dataset.clusterWeight)saveInput();
  };
  i.onchange=saveInput;
});
document.querySelectorAll("[data-complete]").forEach(b=>b.onclick=()=>{
 const l=state.logs[b.dataset.complete];
 if(l){
   l.completed=!l.completed;
   save();
   renderWorkout();
 }
});
document.querySelectorAll("[data-shortcut-rest]").forEach(b=>b.onclick=()=>openShortcut(Number(b.dataset.shortcutRest)));
}
function lastSession(name,before){const arr=Object.values(state.logs).filter(l=>l.exercise===name&&l.kind==="work"&&l.date<before&&l.reps!=="").sort((a,b)=>b.date.localeCompare(a.date)||(b.number||0)-(a.number||0));if(!arr.length)return null;const d=arr[0].date,same=arr.filter(x=>x.date===d&&x.exercise===name).sort((a,b)=>(a.number||0)-(b.number||0));return {summary:same.map(x=>`${x.weight||"—"} kg × ${x.reps||"—"}`).join(" · ")};}
let workoutFooterLockCleanup=null;
function lockWorkoutFooter(el){
  if(workoutFooterLockCleanup) workoutFooterLockCleanup();
  const getScroller=()=>document.scrollingElement||document.documentElement;
  const update=()=>{
    if(!document.body.classList.contains("workout-page")||!document.body.contains(el)) return;
    const sc=getScroller();
    const vv=window.visualViewport;
    const scrollY=sc.scrollTop||window.pageYOffset||0;
    const viewportH=vv?vv.height:window.innerHeight;
    const safeBottom=parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--safe-bottom"))||0;
    const h=el.offsetHeight;
    const top=scrollY+viewportH-h-safeBottom-7;
    el.style.position="absolute";
    el.style.top=Math.max(0,top)+"px";
    el.style.bottom="auto";
    el.style.left="13px";
    el.style.right="13px";
    el.style.transform="none";
  };
  update();
  const sc=getScroller();
  const events=[];
  const onScroll=()=>requestAnimationFrame(update);
  const onResize=()=>requestAnimationFrame(update);
  window.addEventListener("scroll",onScroll,{passive:true});
  window.addEventListener("resize",onResize,{passive:true});
  if(window.visualViewport){
    window.visualViewport.addEventListener("resize",onResize,{passive:true});
    window.visualViewport.addEventListener("scroll",onResize,{passive:true});
  }
  workoutFooterLockCleanup=()=>{
    window.removeEventListener("scroll",onScroll);
    window.removeEventListener("resize",onResize);
    if(window.visualViewport){
      window.visualViewport.removeEventListener("resize",onResize);
      window.visualViewport.removeEventListener("scroll",onResize);
    }
    workoutFooterLockCleanup=null;
  };
}

function renderWorkout(){
const e=exercisesFor(workout.week,workout.key)[workout.index],
exs=exercisesFor(workout.week,workout.key),
last=lastSession(e.name,workout.date),
previousNote=lastExerciseNote(),
p=e.range.split("–").map(Number);

let html=`<section class="workout-head">
  <div class="eyebrow">Semana ${workout.week} · ${PROGRAM[workout.week].name}</div>
  <div class="workout-title-row"><div><div class="h1">${LABEL[workout.key]}</div><div class="workout-progress">${workout.index+1} / ${exs.length}</div></div>${pill(e.method)}</div>
</section>

<section class="exercise-strip">
  <div><div class="exercise-title">${esc(e.name)}</div><div class="exercise-sub">${e.sets} ${e.sets===1?"work set":"work sets"} · meta ${e.range}</div></div>
  <button class="edit-link" id="editEx">Editar</button>
</section>

<div class="last-line"><span>Última sessão</span><strong>${last?esc(last.summary):"Sem histórico"}</strong></div>

<section class="prep-section">
  <div class="section-line"><div class="section-title">Preparação</div><span>antes do 1º work set</span></div>
  ${singleSet(e,"warmup",0,15,15)}
  ${singleSet(e,"feeder",0,4,6)}
</section>

<section class="work-section">
  <div class="section-line"><div class="section-title">Work sets</div><span class="method-label ${e.method==="cluster"?"cluster":"straight"}">${e.method==="cluster"?"CLUSTER":"STRAIGHT"}</span></div>
  <div class="rest-rule">Descanso manual · ${e.method==="cluster"?`${state.clusterRest}s entre blocos`:`${formatTime(state.restStraight)} entre sets`}</div>`;
for(let s=1;s<=e.sets;s++) html+=e.method==="cluster"?clusterSet(e,s):singleSet(e,"work",s,p[0],p[1]);
html+=`</section>

${previousNote?`<section class="previous-note"><div class="eyebrow">NOTA DA ÚLTIMA SESSÃO · ${fmt(previousNote.date)}</div><div class="previous-note-text">${esc(previousNote.v)}</div></section>`:""}

<section class="today-note"><div class="section-title">Observação de hoje</div><textarea id="note" rows="2" class="input" placeholder="Ex.: não subir carga · banco posição 2 · melhorar execução...">${esc(state.notes[noteKey()]||"")}</textarea></section>

<div class="workout-footer">${workout.index>0?'<button class="btn secondary" id="prev">← Anterior</button>':''}${workout.index<exs.length-1?'<button class="btn" id="next">Próximo →</button>':'<button class="btn" id="finish">✓ Concluir</button>'}</div>`;

layout(html);
document.getElementById("editEx").onclick=()=>{
const n=prompt("Nome do exercício",e.name);
if(n&&n.trim()){state.edits[workout.week]??={};state.edits[workout.week][workout.key]??={};state.edits[workout.week][workout.key][workout.index]={name:n.trim()};save();renderWorkout();}
};
document.getElementById("note").oninput=ev=>{state.notes[noteKey()]=ev.target.value;save();};
const prevBtn=document.getElementById("prev"),next=document.getElementById("next"),finish=document.getElementById("finish");
if(prevBtn)prevBtn.onclick=()=>{workout.index--;renderWorkout();window.scrollTo({top:0,behavior:"instant"});};
if(next)next.onclick=()=>{workout.index++;renderWorkout();window.scrollTo({top:0,behavior:"instant"});};
if(finish)finish.onclick=()=>{
 state.completed[`${workout.date}|${workout.week}|${workout.key}|c${state.cycle}`]=true;
 if(workout.week===7){
   state.cycleCompleted=true;
 }
 save();go("home");
};
bindSetEvents();
}

function renderHistory(){const names=[...new Set(Object.values(state.logs).map(l=>l.exercise).filter(Boolean))].sort();let html=`<div class="card"><div class="h2">Histórico por exercício</div><div class="muted">Comparação automática: somente carga e repetições.</div></div>`;if(!names.length)html+=`<div class="card empty">Você ainda não registrou nenhuma série de trabalho.</div>`;for(const name of names){const arr=Object.values(state.logs).filter(l=>l.exercise===name&&(l.kind==="work"||l.kind==="cluster")&&l.reps!=="").sort((a,b)=>b.date.localeCompare(a.date)||(b.number||0)-(a.number||0)||(b.block||0)-(a.block||0));html+=`<div class="card"><div class="h2">${esc(name)}</div>${arr.slice(0,20).map(l=>`<div class="exercise"><div><div class="exercise-name">${fmt(l.date)} · Ciclo ${l.cycle||1} · Semana ${l.week}</div><div class="exercise-meta">${l.weight||"—"} kg × ${l.reps||"—"}${l.kind==="cluster"?` · bloco ${l.block}`:""}</div></div>${pill(l.kind==="cluster"?"cluster":"straight")}</div>`).join("")}</div>`;}layout(html);}
function renderSettings(){const info=weekInfo();layout(`<div class="card"><div class="h2">Configurações</div><div class="stack"><div class="field"><label>Início do ciclo</label><input id="start" type="date" class="input" value="${state.startDate}"></div><div class="formgrid"><div class="field"><label>Descanso Straight (s)</label><input id="straight" type="number" class="input" value="${state.restStraight}"></div><div class="field"><label>Entre exercícios (s)</label><input id="between" type="number" class="input" value="${state.restBetweenExercises}"></div></div><div class="field"><label>Cluster entre blocos (s)</label><input id="cluster" type="number" class="input" value="${state.clusterRest}"></div><button class="btn" id="saveSettings">Salvar</button></div></div><div class="card"><div class="h2">Dados locais</div><div class="muted">Os registros desta versão ficam separados dos dados de teste anteriores. Você pode apagar os registros do ciclo atual sem apagar o treino programado.</div><button class="btn secondary" id="clearLogs" style="margin-top:10px">Limpar registros do ciclo</button></div><div class="card"><div class="h2">Ciclo ${state.cycle}</div><div class="muted">${state.cycleCompleted?"Ciclo concluído — pronto para iniciar o próximo.":`Semana atual: ${info.week} — ${PROGRAM[info.week].name}`}</div><button class="btn" id="newCycle" style="margin-top:10px">Iniciar novo ciclo</button></div><div class="card"><div class="h2">Atalho do iOS</div><p class="muted">Crie um Atalho chamado <strong>MR Saizen Timer</strong>. O app <strong>não inicia o descanso automaticamente</strong>; você toca no botão de descanso e ele abre o Atalho, passando a duração em segundos.</p><button class="btn secondary" id="testShortcut">Testar Atalho · 20s</button></div><div class="notice">Os registros ficam salvos localmente neste dispositivo. A progressão de carga é decidida por você.</div>`);document.getElementById("saveSettings").onclick=()=>{state.startDate=document.getElementById("start").value||state.startDate;state.restStraight=Math.max(1,Number(document.getElementById("straight").value)||120);state.restBetweenExercises=Math.max(1,Number(document.getElementById("between").value)||120);state.clusterRest=Math.max(1,Number(document.getElementById("cluster").value)||20);save();go("home");};document.getElementById("clearLogs").onclick=()=>{
 if(confirm("Apagar cargas, reps, observações e registros deste ciclo? O treino programado não será apagado.")){
   state.logs={};state.notes={};state.completed={};save();go("home");
 }
};
document.getElementById("newCycle").onclick=startNewCycle;document.getElementById("testShortcut").onclick=()=>openShortcut(20);}
function formatTime(seconds){const s=Number(seconds)||0;return `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;}
function notify(){try{navigator.vibrate?.([180,80,180]);}catch(e){}}
function openShortcut(seconds){
 const duration=Number(seconds)||120;
 const url="shortcuts://run-shortcut?name="+encodeURIComponent("MR Saizen Timer")+"&input=text&text="+encodeURIComponent(String(duration));
 window.location.assign(url);
}
window.addEventListener("error",e=>{console.error(e.error||e.message);app.innerHTML=`<div class="wrap"><div class="card"><div class="h2">Erro ao carregar o app</div><p class="muted">${esc(e.message||"Erro desconhecido")}</p><button class="btn" onclick="location.reload()">Recarregar</button></div></div>`;});
if("serviceWorker" in navigator)window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));
render();
})();
