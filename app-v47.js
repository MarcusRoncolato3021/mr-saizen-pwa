(() => {
"use strict";

/* =========================================================================
   MR Saizen Method — v47
   ========================================================================= */

const APP_VERSION = "v47";
const KEY = "mr-saizen-state-v3"; // mesma chave de antes: nenhum dado é perdido
const app = document.getElementById("app");

// Qualquer erro inesperado mostra uma tela com botão de recarregar,
// em vez de deixar o app preso em "Atualizando MR Saizen…".
window.addEventListener("error", e => {
  console.error(e.error || e.message);
  app.innerHTML = `<div class="wrap"><div class="card"><div class="h2">Erro ao carregar o app</div><p class="muted">${esc(e.message || "Erro desconhecido")}</p><button class="btn" onclick="location.reload()">Recarregar</button></div></div>`;
});

/* -------------------------------------------------------------------------
   Programa (inalterado)
   ------------------------------------------------------------------------- */
const PROGRAM={"1":{"name":"Base","note":"Entrada controlada, menor fadiga global.","days":{"1":"u1","2":"l1","4":"u2","5":"l2","6":"arms"}},"2":{"name":"Build 1","note":"Primeiro aumento concentrado nos grupos de maior prioridade.","days":{"1":"u2","2":"l2","4":"u1","5":"l1","6":"arms"}},"3":{"name":"Build 2","note":"Costas chegam antes ao teto por prioridade e frequência nos uppers.","days":{"1":"u1","2":"l1","4":"u2","5":"l2","6":"arms"}},"4":{"name":"Overload 1","note":"Grupos Tier III chegam ao teto; Tier I permanece controlado.","days":{"1":"u2","2":"l2","4":"u1","5":"l1","6":"arms"}},"5":{"name":"Overload 2","note":"Mantém teto dos grupos prioritários sem exceder tiers máximos.","days":{"1":"u1","2":"l1","4":"u2","5":"l2","6":"arms"}},"6":{"name":"Peak Week","note":"Maior exigência geral da periodização, sem exceder o tier máximo.","days":{"1":"u2","2":"l2","4":"u1","5":"l1","6":"arms"}},"7":{"name":"Deload de Volume","note":"Redução clara de volume, mantendo estrutura e exercícios principais.","days":{"1":"u1","2":"l1","4":"u2","5":"l2","6":"arms"}}};
const BASE={"u1":[["Pulldown Aberto Pronado","4–6"],["Remada Articulada Sagital","4–6"],["T-Bar com Apoio","4–6"],["Desenvolvimento Máquina","4–6"],["Elevação Lateral Máquina","5–9"],["Supino Pegada Neutra","4–6"],["Voador Máquina","5–9"],["Rosca Inclinado 45°","5–9"]],"u2":[["Remada Articulada Sagital","4–6"],["Remada Curvada","4–6"],["Desenvolvimento Máquina","4–6"],["Elevação Lateral Máquina","5–9"],["Pullover com Halter","4–6"],["Press Transversal","4–6"],["Voador Máquina","5–9"],["Rosca Scott","5–9"]],"l1":[["Cadeira Abdutora","5–9"],["Glute Bridge","4–6"],["Leg Press 45","4–6"],["Cadeira Flexora","5–9"],["Mesa Flexora","5–9"],["Panturrilha em Pé","5–9"],["Leg Unilateral","4–6"],["Cadeira Extensora — pico na fase alongada","5–9"],["Tríceps Unilateral no Cabo","5–9"]],"l2":[["Rack Pull","4–6"],["Cadeira Flexora","5–9"],["Mesa Flexora","5–9"],["Cadeira Abdutora","5–9"],["Elevação Pélvica","4–6"],["Panturrilha em Pé","5–9"],["Split Squat no Smith","4–6"],["Cadeira Extensora — pico na fase contraída","5–9"],["Pullover com Halter","4–6"]],"arms":[["Supino para Tríceps","4–6"],["Francês no Cabo","4–6"],["Tríceps Testa no Cabo","4–6"],["Rosca Concentrado","4–6"],["Rosca Bayesiana","4–6"],["Rosca Martelo","4–6"]]};
// Método conferido exercício por exercício com a periodização original (7 semanas).
// C = Cluster, S = Straight. Braços de sábado é sempre Straight.
const METHODS={
  "1":{"u1":"SSSSSSSS","l1":"SSSSSSSSS","u2":"CSCCSCCC","l2":"SCCCSCSCS","arms":"SSSSSS"},
  "2":{"u2":"SSSSSSSS","l2":"SSSSSSSSS","u1":"CCCCCCCC","l1":"CSCCCCSCS","arms":"SSSSSS"},
  "3":{"u1":"SSSSSSSS","l1":"SSSSSSSSS","u2":"CSCCSCCC","l2":"SCCCSCSCS","arms":"SSSSSS"},
  "4":{"u2":"SSSSSSSS","l2":"SSSSSSSSS","u1":"CCCCCCCC","l1":"CSCCCCSCS","arms":"SSSSSS"},
  "5":{"u1":"SSSSSSSS","l1":"SSSSSSSSS","u2":"CSCCSCCC","l2":"SCCCSCSCS","arms":"SSSSSS"},
  "6":{"u2":"SSSSSSSS","l2":"SSSSSSSSS","u1":"CCCCCCCC","l1":"CSCCCCSCS","arms":"SSSSSS"},
  "7":{"u1":"SSSSSSSS","l1":"SSSSSSSSS","u2":"CSCCSCCC","l2":"SCCCSCSCS","arms":"SSSSSS"}
};
const SETS={"1":{"u1":[1,1,1,1,1,1,1,1],"l1":[1,1,1,1,1,1,1,1,1],"u2":[1,1,1,1,1,1,1,1],"l2":[1,1,1,1,1,1,1,1,1],"arms":[1,1,1,1,1,1]},"2":{"u1":[1,1,1,1,1,1,1,1],"l1":[1,2,1,1,1,1,1,1,1],"u2":[2,1,2,2,1,1,1,1],"l2":[1,2,2,2,2,1,1,1,1],"arms":[1,1,1,1,1,1]},"3":{"u1":[2,2,2,2,2,2,1,1],"l1":[2,2,1,2,2,1,1,1,1],"u2":[1,2,1,1,2,1,1,1],"l2":[1,1,1,1,2,1,1,1,2],"arms":[1,1,1,1,1,1]},"4":{"u1":[1,1,1,1,1,1,1,1],"l1":[1,2,1,1,1,1,1,1,1],"u2":[2,2,2,2,2,1,1,1],"l2":[2,2,2,2,2,1,1,1,2],"arms":[1,1,1,1,1,1]},"5":{"u1":[2,2,2,2,2,2,2,1],"l1":[2,2,1,2,2,1,1,1,1],"u2":[1,2,1,1,2,1,1,1],"l2":[2,1,1,1,2,1,1,1,2],"arms":[1,1,1,1,1,1]},"6":{"u1":[1,1,1,1,1,1,1,1],"l1":[1,2,1,1,1,1,1,1,1],"u2":[2,2,2,2,2,2,2,1],"l2":[2,1,1,1,2,1,1,1,2],"arms":[1,1,1,1,1,1]},"7":{"u1":[1,1,1,1,1,1,1,1],"l1":[1,1,1,1,1,1,1,1,1],"u2":[1,1,1,1,1,1,1,1],"l2":[1,1,1,1,1,1,1,1,1],"arms":[1,1,1,1,1,1]}};
const CANONICAL_WEEK_ORDER={1:["u1","l1","u2","l2","arms"],2:["u2","l2","u1","l1","arms"],3:["u1","l1","u2","l2","arms"],4:["u2","l2","u1","l1","arms"],5:["u1","l1","u2","l2","arms"],6:["u2","l2","u1","l1","arms"],7:["u1","l1","u2","l2","arms"]};
const DAYS=[1,2,4,5,6]; // Seg, Ter, Qui, Sex, Sáb (faltava na v44 e travava o app)
const DAYNAMES={0:"Dom",1:"Seg",2:"Ter",3:"Qua",4:"Qui",5:"Sex",6:"Sáb"};
const LABEL={u1:"Upper 1",u2:"Upper 2",l1:"Lower 1",l2:"Lower 2",arms:"Braços"};
const WORKOUT_KEYS=["u1","u2","l1","l2","arms"];
const CYCLE_DAYS=49; // 7 semanas

/* -------------------------------------------------------------------------
   Conferência da periodização (proteção contra edição acidental da tabela)
   ------------------------------------------------------------------------- */
const EXPECTED_SETS={
  "1":{u1:[1,1,1,1,1,1,1,1],l1:[1,1,1,1,1,1,1,1,1],u2:[1,1,1,1,1,1,1,1],l2:[1,1,1,1,1,1,1,1,1]},
  "2":{u1:[1,1,1,1,1,1,1,1],l1:[1,2,1,1,1,1,1,1,1],u2:[2,1,2,2,1,1,1,1],l2:[1,2,2,2,2,1,1,1,1]},
  "3":{u1:[2,2,2,2,2,2,1,1],l1:[2,2,1,2,2,1,1,1,1],u2:[1,2,1,1,2,1,1,1],l2:[1,1,1,1,2,1,1,1,2]},
  "4":{u1:[1,1,1,1,1,1,1,1],l1:[1,2,1,1,1,1,1,1,1],u2:[2,2,2,2,2,1,1,1],l2:[2,2,2,2,2,1,1,1,2]},
  "5":{u1:[2,2,2,2,2,2,2,1],l1:[2,2,1,2,2,1,1,1,1],u2:[1,2,1,1,2,1,1,1],l2:[2,1,1,1,2,1,1,1,2]},
  "6":{u1:[1,1,1,1,1,1,1,1],l1:[1,2,1,1,1,1,1,1,1],u2:[2,2,2,2,2,2,2,1],l2:[2,1,1,1,2,1,1,1,2]},
  "7":{u1:[1,1,1,1,1,1,1,1],l1:[1,1,1,1,1,1,1,1,1],u2:[1,1,1,1,1,1,1,1],l2:[1,1,1,1,1,1,1,1,1]}
};
function validatePeriodization(){
  const expectedLengths={u1:8,u2:8,l1:9,l2:9,arms:6};
  for(const w of Object.keys(METHODS)){
    for(const [key,len] of Object.entries(expectedLengths)){
      if((METHODS[w][key]||"").length!==len) throw new Error(`Método inválido: semana ${w} ${key}`);
      if((SETS[w][key]||[]).length!==len) throw new Error(`Volume inválido: semana ${w} ${key}`);
    }
    // Treino extra de sábado: sempre 1 straight set por exercício.
    if(SETS[w].arms.some(n=>n!==1)||METHODS[w].arms!=="SSSSSS") throw new Error(`Braços inválido na semana ${w}`);
  }
  for(const [w,sets] of Object.entries(EXPECTED_SETS))
    for(const [key,arr] of Object.entries(sets))
      if(JSON.stringify(SETS[w][key])!==JSON.stringify(arr)) throw new Error(`Volume inválido: semana ${w} ${key}`);
  for(const w of Object.keys(CANONICAL_WEEK_ORDER)){
    const actual=DAYS.map(d=>PROGRAM[w].days[d]);
    if(actual.join(",")!==CANONICAL_WEEK_ORDER[w].join(",")) throw new Error(`Ordem inválida na semana ${w}`);
  }
  // Semana 7 (Deload de Volume): U1, L1 e Braços 100% Straight; U2 e L2 mistos.
  if(METHODS["7"].u1!=="SSSSSSSS"||METHODS["7"].l1!=="SSSSSSSSS"||METHODS["7"].u2!=="CSCCSCCC"||METHODS["7"].l2!=="SCCCSCSCS") throw new Error("Semana 7: método inválido");
}
validatePeriodization();

/* -------------------------------------------------------------------------
   Estado
   ------------------------------------------------------------------------- */
let state=loadState();
let route="home";
let workout=null;
let viewWeek=null;          // semana escolhida no seletor — vale só enquanto o app está aberto
let lastRenderedRoute=null;
let lastSeenDay=todayISO();

function defaultState(){return {startDate:"2026-08-10",cycle:1,restStraight:120,restBetweenExercises:120,clusterRest:20,warmupPct:50,feederPct:75,logs:{},notes:{},edits:{},names:{},setup:{},completed:{},cycles:[{id:1,name:"Ciclo 1",startDate:"2026-08-10"}],cycleCompleted:false};}
function normalizeState(s){
  s={...defaultState(),...s};
  s.logs=s.logs||{};s.notes=s.notes||{};s.edits=s.edits||{};s.completed=s.completed||{};s.cycles=s.cycles||[];
  s.names=s.names||{};s.setup=s.setup||{};
  Object.values(s.logs).forEach(l=>{if(!l.cycle)l.cycle=s.cycle||1;});
  if(!s.cycles.length)s.cycles=[{id:s.cycle||1,name:`Ciclo ${s.cycle||1}`,startDate:s.startDate}];
  if(typeof s.cycleCompleted!=="boolean")s.cycleCompleted=false;
  delete s.viewWeek;
  // Até a v45 o nome editado valia só para uma semana. Agora vale para todas:
  // os nomes já editados são levados para o novo formato (o mais recente vence).
  if(!Object.keys(s.names).length){
    for(let w=1;w<=7;w++){
      const ew=s.edits?.[w]||{};
      for(const key of Object.keys(ew)) for(const i of Object.keys(ew[key]||{})){
        const n=ew[key][i]?.name;
        if(n){(s.names[key]??={})[i]=n;}
      }
    }
  }
  return s;
}
function loadState(){
  try{
    const raw=localStorage.getItem(KEY);
    return normalizeState(raw?JSON.parse(raw):{});
  }catch(e){return defaultState();}
}
function save(){
  try{localStorage.setItem(KEY,JSON.stringify(state));}
  catch(e){console.error("Falha ao salvar",e);}
}

/* -------------------------------------------------------------------------
   Datas e ciclo
   ------------------------------------------------------------------------- */
function localDate(s){const [y,m,d]=s.split("-").map(Number);return new Date(y,m-1,d);}
function dateISO(d){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;}
function addDays(iso,n){const d=localDate(iso);d.setDate(d.getDate()+n);return dateISO(d);}
function daysBetween(fromISO,toISO){return Math.round((localDate(toISO)-localDate(fromISO))/86400000);}
function fmt(s){return localDate(s).toLocaleDateString("pt-BR",{day:"2-digit",month:"2-digit"});}
function todayISO(){return dateISO(new Date());}
function cycleEndDate(){return addDays(state.startDate,CYCLE_DAYS-1);}

// A periodização se repete automaticamente a cada 7 semanas (49 dias).
function syncCycleWithDate(){
  const diff=daysBetween(state.startDate,todayISO());
  if(diff<CYCLE_DAYS)return;
  const advance=Math.floor(diff/CYCLE_DAYS);
  for(let i=0;i<advance;i++){
    const id=Number(state.cycle||1)+1;
    const start=addDays(state.startDate,CYCLE_DAYS);
    state.cycle=id;
    state.startDate=start;
    if(!state.cycles.some(c=>Number(c.id)===id))state.cycles.push({id,name:`Ciclo ${id}`,startDate:start});
  }
  state.cycleCompleted=false;
  save();
}
function startNewCycle(){
  const id=Number(state.cycle||1)+1;
  const start=addDays(state.startDate,CYCLE_DAYS);
  state.cycle=id;
  state.startDate=start;
  state.cycleCompleted=false;
  if(!state.cycles.some(c=>Number(c.id)===id))state.cycles.push({id,name:`Ciclo ${id}`,startDate:start});
  viewWeek=null;
  save();go("home");
}
function weekInfo(date=new Date()){
  const diff=daysBetween(state.startDate,dateISO(date));
  return {week:Math.max(1,Math.min(7,Math.floor(diff/7)+1)),diff};
}
function workoutForDate(date=new Date()){
  const {week,diff}=weekInfo(date);
  if(diff<0||diff>=CYCLE_DAYS)return null; // fora do ciclo atual
  return PROGRAM[week].days[date.getDay()]||null;
}

/* -------------------------------------------------------------------------
   Exercícios
   ------------------------------------------------------------------------- */
function workoutMethod(week,key,i){
  const code=METHODS?.[String(week)]?.[key]?.[i];
  if(code!=="C"&&code!=="S") throw new Error(`Método não definido: semana ${week} ${key} exercício ${i+1}`);
  return code==="C"?"cluster":"straight";
}
function exerciseName(key,i){return state.names?.[key]?.[i]||BASE[key][i][0];}
function exercisesFor(week,key){
  return BASE[key].map((x,i)=>({name:exerciseName(key,i),range:x[1],method:workoutMethod(week,key,i),sets:SETS[week][key][i]}));
}
function weekCardMethod(week,key){
  const ms=exercisesFor(week,key).map(e=>e.method);
  if(ms.every(m=>m==="straight")) return "Straight";
  if(ms.every(m=>m==="cluster")) return "Cluster";
  return "Misto";
}
function isCompleted(date,week,key){
  const id=`${date}|${week}|${key}`;
  return !!(state.completed[`${id}|c${state.cycle}`]||state.completed[id]);
}
// "done" = concluído · "started" = algum set registrado · "none" = nada feito
function workoutStatus(date,week,key){
  if(isCompleted(date,week,key))return "done";
  const any=Object.values(state.logs).some(l=>l.date===date&&Number(l.week)===Number(week)&&l.key===key&&l.completed);
  return any?"started":"none";
}

/* -------------------------------------------------------------------------
   Registros (logs)
   ------------------------------------------------------------------------- */
// Sets pré-preenchidos só contam como sessão realizada depois de editados ou registrados.
function isRealLog(l){return !(l.prefilled&&!l.completed);}
function hasValue(l){return String(l.weight??"")!==""||String(l.reps??"")!=="";}
function num(v){const n=parseFloat(String(v??"").replace(",","."));return Number.isFinite(n)?n:null;}
function kg(n){return n==null?"—":n.toLocaleString("pt-BR",{maximumFractionDigits:2});}
function weightText(w){const n=num(w);return n==null?(String(w??"")||"—"):kg(n);}
const DECISION={up:"↑ Subir",keep:"= Manter"};
const DECISION_SHORT={up:"↑",keep:"="};

function logId(kind,number,block=0){return `${workout.date}|${workout.week}|${workout.key}|${workout.index}|${kind}|${number}|${block}`;}

// Todas as sessões registradas de um exercício (mesmo treino, mesma posição),
// em ordem cronológica, incluindo ciclos anteriores.
function sessionsAt(key,index){
  const by={};
  Object.values(state.logs).forEach(l=>{
    if(l.key===key&&Number(l.index)===Number(index)&&(l.kind==="work"||l.kind==="cluster")&&String(l.reps??"")!==""&&isRealLog(l))(by[l.date]??=[]).push(l);
  });
  return Object.entries(by).map(([date,logs])=>{
    const ws=logs.map(l=>num(l.weight)).filter(n=>n!=null);
    return {date,week:Number(logs[0].week),cycle:Number(logs[0].cycle||1),logs,
      method:logs.some(l=>l.kind==="cluster")?"cluster":"straight",
      top:ws.length?Math.max(...ws):null};
  }).sort((a,b)=>a.date.localeCompare(b.date));
}
function prevSession(key,index,before){const s=sessionsAt(key,index).filter(x=>x.date<before);return s[s.length-1]||null;}
function sessLabel(s){return (Number(s.cycle)!==Number(state.cycle)?`Ciclo ${s.cycle} · `:"")+`Sem ${s.week}`;}
// Agrupa os sets de uma sessão: straight = um por set; cluster = 3 blocos por set.
function setGroups(logs){
  const out=[];
  logs.filter(l=>l.kind==="work").sort((a,b)=>(a.number||0)-(b.number||0)).forEach(l=>
    out.push({kind:"work",number:Number(l.number),text:`${weightText(l.weight)} kg × ${l.reps||"—"}`,next:l.next}));
  const g={};
  logs.filter(l=>l.kind==="cluster").forEach(l=>(g[l.number]??=[]).push(l));
  Object.keys(g).sort((a,b)=>a-b).forEach(n=>{
    const bl=g[n].sort((a,b)=>(a.block||0)-(b.block||0));
    const ws=[...new Set(bl.map(x=>String(x.weight??"")))];
    const total=bl.reduce((s,x)=>s+(parseInt(x.reps,10)||0),0);
    const text=ws.length===1?`${weightText(ws[0])} kg × ${bl.map(x=>x.reps||"—").join("/")}`:bl.map(x=>`${weightText(x.weight)}×${x.reps||"—"}`).join(" / ");
    out.push({kind:"cluster",number:Number(n),text,total,next:bl.find(x=>x.next)?.next});
  });
  return out;
}
function summaryText(logs){return setGroups(logs).map(g=>g.text+(g.next?` ${DECISION_SHORT[g.next]}`:"")).join(" · ");}
// Referência de um set: o mesmo set (mesmo método e número) na sessão anterior mais recente.
function setRef(kind,number){
  const sess=sessionsAt(workout.key,workout.index).filter(s=>s.date<workout.date).reverse();
  for(const s of sess){
    const g=setGroups(s.logs).find(g=>g.kind===kind&&g.number===Number(number));
    if(g)return {...g,label:sessLabel(s)};
  }
  return null;
}
function previousLogFor(d){
  return Object.values(state.logs).filter(x=>
    x.key===d.key&&Number(x.index)===Number(d.index)&&x.kind===d.kind&&
    String(x.number||"")===String(d.number||"")&&String(x.block||"")===String(d.block||"")&&
    x.date<d.date&&isRealLog(x)&&hasValue(x)
  ).sort((a,b)=>b.date.localeCompare(a.date))[0]||null;
}
function roundLoad(x){return Math.round(x/2.5)*2.5;}
function getLog(id,d){
  if(!state.logs[id]){
    const previous=previousLogFor(d);
    let weight=previous?.weight??"", reps=previous?.reps??"";
    // Aquecimento e feeder: % da maior carga de trabalho da sessão anterior.
    if(d.kind==="warmup"||d.kind==="feeder"){
      // Prefere a última sessão com o mesmo método de hoje (no cluster a carga costuma ser menor).
      const method=workoutMethod(d.week,d.key,d.index);
      const before=sessionsAt(d.key,d.index).filter(x=>x.date<d.date&&x.top!=null);
      const ps=[...before].reverse().find(x=>x.method===method)||before[before.length-1];
      const pct=Number(d.kind==="warmup"?state.warmupPct:state.feederPct)||0;
      if(ps?.top&&pct>0){const w=roundLoad(ps.top*pct/100);if(w>0)weight=kg(w);}
    }
    state.logs[id]={id,...d,cycle:state.cycle,weight,reps,completed:false};
    if(weight!==""||reps!=="")state.logs[id].prefilled=true;
  }
  return state.logs[id];
}
function lastNote(key,index,before){
  const notes=Object.entries(state.notes).map(([k,v])=>{
    const p=k.split("|");
    return {date:p[0],key:p[2],index:p[3],v};
  }).filter(x=>x.key===key&&String(x.index)===String(index)&&x.date<before&&String(x.v||"").trim()!=="")
    .sort((a,b)=>b.date.localeCompare(a.date));
  return notes[0]||null;
}
function noteKey(){return `${workout.date}|${workout.week}|${workout.key}|${workout.index}`;}

/* -------------------------------------------------------------------------
   Layout e navegação
   ------------------------------------------------------------------------- */
function esc(s){return String(s??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");}
function pill(m){return `<span class="pill ${m}">${m==="cluster"?"CLUSTER":"STRAIGHT"}</span>`;}
function formatTime(seconds){const s=Number(seconds)||0;return `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;}

function nav(){
  const active=(...r)=>r.includes(route)?"active":"";
  return `<nav class="nav"><div class="navin"><button type="button" class="${active("home","overview","workout")}" data-nav="home">🏠<span>Início</span></button><button type="button" class="${active("history","summary")}" data-nav="history">📊<span>Histórico</span></button><button type="button" class="${active("settings")}" data-nav="settings">⚙️<span>Config.</span></button></div></nav>`;
}
function layout(content,header=""){
  document.body.classList.toggle("workout-page",route==="workout");
  app.innerHTML=`<div class="wrap">${header}${content}</div>${nav()}`;
  const ex=document.getElementById("exit");if(ex)ex.onclick=()=>go("home");
  const list=document.getElementById("viewOverview");if(list)list.onclick=()=>show("overview");
  if(route!==lastRenderedRoute)window.scrollTo({top:0,behavior:"instant"});
  lastRenderedRoute=route;
}
function bindNav(){
  document.addEventListener("click",e=>{
    const b=e.target.closest?.("[data-nav]");
    if(!b)return;
    e.preventDefault();
    go(b.dataset.nav);
  },true);
}
// iPhone: com o teclado aberto, elementos fixos sobem junto com ele e às vezes
// ficam presos no meio da tela depois que ele fecha. Enquanto você digita, o
// menu some; ao fechar o teclado ele volta e a posição é recalculada.
function bindKeyboardGuard(){
  const isField=el=>!!el&&((el.tagName==="INPUT"&&!["file","checkbox","radio","button"].includes(el.type))||el.tagName==="TEXTAREA");
  const reanchor=()=>{window.scrollBy(0,1);window.scrollBy(0,-1);};
  document.addEventListener("focusin",e=>{if(isField(e.target))document.body.classList.add("typing");});
  document.addEventListener("focusout",()=>{
    setTimeout(()=>{if(!isField(document.activeElement)){document.body.classList.remove("typing");reanchor();}},150);
  });
  const vv=window.visualViewport;
  if(vv){
    let wasOpen=false;
    vv.addEventListener("resize",()=>{
      const open=vv.height<window.innerHeight*0.78;
      document.body.classList.toggle("keyboard",open);
      if(wasOpen&&!open)reanchor();
      wasOpen=open;
    });
  }
}
function go(r){
  if(!["home","history","settings"].includes(r))return;
  if(document.activeElement&&document.activeElement.blur)document.activeElement.blur();
  route=r;
  render();
}
function show(r){route=r;render();}
function render(){
  syncCycleWithDate();
  if(route==="home")renderHome();
  else if(route==="history")renderHistory();
  else if(route==="summary")renderSummary();
  else if(route==="settings")renderSettings();
  else if(route==="overview"&&workout)renderOverview();
  else if(route==="workout"&&workout)renderWorkout();
  else{route="home";renderHome();}
}
function pageHead(eyebrow,title,extra=""){
  return `<header class="page-head"><div class="eyebrow">${eyebrow}</div><div class="h1">${title}</div>${extra}</header>`;
}

/* -------------------------------------------------------------------------
   Início
   ------------------------------------------------------------------------- */
function statusBadge(status,late,isToday){
  if(status==="done")return `<span class="badge done">✓ Feito</span>`;
  if(late)return `<span class="badge warn">${status==="started"?"Incompleto":"Pendente"}</span>`;
  if(status==="started")return `<span class="badge warn">Em andamento</span>`;
  if(isToday)return `<span class="badge today">Hoje</span>`;
  return "";
}
function renderHome(){
  const info=weekInfo();
  const selectedWeek=Math.max(1,Math.min(7,Number(viewWeek)||info.week));
  const isCurrent=selectedWeek===info.week;
  const p=PROGRAM[selectedWeek];
  const ws=addDays(state.startDate,(selectedWeek-1)*7);
  const we=addDays(ws,6);
  const today=todayISO();

  // Lista da semana selecionada
  let rows="";
  for(const d of DAYS){
    const date=addDays(ws,d-1);
    const key=p.days[d];
    const status=workoutStatus(date,selectedWeek,key);
    const late=isCurrent&&date<today&&status!=="done";
    rows+=`<button type="button" class="day-row ${date===today?"is-today":""} ${status==="done"?"is-done":""}" data-open="${selectedWeek}|${key}|${date}">
      <span class="day-date"><b>${DAYNAMES[d]}</b><small>${fmt(date)}</small></span>
      <span class="day-main"><span class="day-title">${LABEL[key]}</span><span class="day-meta">${weekCardMethod(selectedWeek,key)} · ${BASE[key].length} exercícios</span></span>
      ${statusBadge(status,late,date===today)}<span class="chev">›</span></button>`;
  }

  // Card "Hoje" (sempre sobre a semana atual, independente da semana em visualização)
  const curWs=addDays(state.startDate,(info.week-1)*7);
  const pend=[];
  if(info.diff>=0&&info.diff<CYCLE_DAYS)for(const d of DAYS){
    const date=addDays(curWs,d-1);const key=PROGRAM[info.week].days[d];
    if(date<today){const st=workoutStatus(date,info.week,key);if(st!=="done")pend.push({d,date,key,st});}
  }
  const todayKey=workoutForDate(new Date());
  let todayCard="";
  if(todayKey||pend.length){
    let main="";
    if(todayKey){
      const st=workoutStatus(today,info.week,todayKey);
      const cta=st==="done"?"Revisar treino":st==="started"?"Continuar treino":"Começar treino";
      main=`<div class="today-title">${LABEL[todayKey]}${st==="done"?' <span class="badge done">✓ Feito</span>':""}</div>
        <div class="muted">${BASE[todayKey].length} exercícios · ${weekCardMethod(info.week,todayKey)}</div>
        <button type="button" class="btn block ${st==="done"?"secondary":""}" data-open="${info.week}|${todayKey}|${today}">${cta}</button>`;
    }else{
      main=`<div class="today-title">Descanso</div><div class="muted">Sem treino programado hoje.</div>`;
    }
    const pendHtml=pend.map(x=>`<button type="button" class="pending-row" data-open="${info.week}|${x.key}|${x.date}"><span><span class="badge warn">${x.st==="started"?"Incompleto":"Pendente"}</span> ${LABEL[x.key]} · ${DAYNAMES[x.d]} ${fmt(x.date)}</span><span class="pending-cta">Fazer ›</span></button>`).join("");
    todayCard=`<section class="today-card"><div class="eyebrow">Hoje · ${DAYNAMES[new Date().getDay()]} ${fmt(today)}</div>${main}${pendHtml?`<div class="pending-list">${pendHtml}</div>`:""}</section>`;
  }

  // Resumo do ciclo: na semana de deload e no início do ciclo seguinte.
  let summaryCard="";
  if(info.week===7)summaryCard=`<button type="button" class="cta-row" data-summary="${state.cycle}"><span><b>🏁 Fim do Ciclo ${state.cycle}</b><small>Semana de deload — veja como foi o ciclo</small></span><span class="chev">›</span></button>`;
  else if(info.week===1&&Number(state.cycle)>1)summaryCard=`<button type="button" class="cta-row" data-summary="${state.cycle-1}"><span><b>Resumo do Ciclo ${state.cycle-1}</b><small>Revise antes de começar o novo ciclo</small></span><span class="chev">›</span></button>`;

  const header=`<header class="top"><div class="brand">MR. SAIZEN METHOD</div><div class="top-meta">Ciclo ${state.cycle}</div></header>`;
  layout(`${todayCard}${summaryCard}
  <section class="week-card">
    <div class="week-head">
      <div><div class="eyebrow">Semana ${selectedWeek} de 7${isCurrent?" · atual":""}</div><div class="h1">${p.name}</div><div class="muted">${fmt(ws)} → ${fmt(we)}</div></div>
    </div>
    <p class="week-note">${p.note}</p>
    <div class="weekbar">${[1,2,3,4,5,6,7].map(w=>`<button type="button" class="week-switch ${selectedWeek===w?"active":""} ${info.week===w?"current":""}" data-week-select="${w}" aria-label="Semana ${w}">${w}</button>`).join("")}</div>
    ${!isCurrent?`<button type="button" class="link-btn" data-week-select="${info.week}">↺ Voltar para a semana atual</button>`:""}
  </section>
  <div class="day-list">${rows}</div>`,header);

  document.querySelectorAll("[data-open]").forEach(b=>b.onclick=()=>{const [w,k,d]=b.dataset.open.split("|");startWorkout(Number(w),k,d);});
  document.querySelectorAll("[data-summary]").forEach(b=>b.onclick=()=>{state.summaryCycle=Number(b.dataset.summary);show("summary");});
  document.querySelectorAll("[data-week-select]").forEach(b=>b.onclick=()=>{viewWeek=Number(b.dataset.weekSelect);renderHome();});
}

/* -------------------------------------------------------------------------
   Visão geral do treino
   ------------------------------------------------------------------------- */
function startWorkout(week,key,date){
  week=Math.max(1,Math.min(7,Number(week)||1));
  if(!BASE[key])throw new Error("Treino inválido");
  workout={week,key,date,index:0};
  show("overview");
}
function exerciseProgress(i){
  const relevant=Object.values(state.logs).filter(l=>l.date===workout.date&&Number(l.week)===workout.week&&l.key===workout.key&&Number(l.index)===i&&(l.kind==="work"||l.kind==="cluster"));
  if(relevant.length&&relevant.every(l=>l.completed))return "done";
  return relevant.some(l=>l.completed)?"progress":"pending";
}
function renderOverview(){
  const exs=exercisesFor(workout.week,workout.key);
  const p=PROGRAM[workout.week];
  const today=todayISO();
  const prog=exs.map((_,i)=>exerciseProgress(i));
  const doneCount=prog.filter(x=>x==="done").length;
  const firstOpen=Math.max(0,prog.findIndex(x=>x!=="done"));
  let cards="";
  exs.forEach((e,i)=>{
    // Referência = última sessão com o mesmo método de hoje (como dentro do treino).
    const before=sessionsAt(workout.key,i).filter(x=>x.date<workout.date);
    const ps=[...before].reverse().find(x=>x.method===e.method)||before[before.length-1];
    const note=lastNote(workout.key,i,workout.date)?.v||"";
    cards+=`<button type="button" class="ex-card ${prog[i]}" data-overview-index="${i}">
      <span class="ex-num">${prog[i]==="done"?"✓":i+1}</span>
      <span class="ex-body">
        <span class="ex-name">${esc(e.name)}</span>
        <span class="ex-meta">${e.sets} ${e.sets===1?"set":"sets"} · ${e.method==="cluster"?"Cluster":"Straight"} · ${e.range} reps</span>
        ${ps?`<span class="ex-last">${esc(sessLabel(ps))}: <b>${esc(summaryText(ps.logs))}</b></span>`:""}
        ${note?`<span class="ex-note">📝 ${esc(note)}</span>`:""}
      </span>
    </button>`;
  });
  const late=workout.date<today&&workoutStatus(workout.date,workout.week,workout.key)!=="done";
  const dateLine=late?`Planejado para ${fmt(workout.date)} · feito hoje (${fmt(today)})`:fmt(workout.date);
  const cta=doneCount===exs.length?"Revisar treino":doneCount||prog.includes("progress")?"▶ Continuar treino":"▶ Começar treino";
  layout(`${pageHead(`Semana ${workout.week} · ${p.name}`,LABEL[workout.key],`<div class="muted">${dateLine}</div>`)}
  <div class="progress-line"><div class="progress"><i style="width:${Math.round(doneCount/exs.length*100)}%"></i></div><span>${doneCount}/${exs.length}</span></div>
  <button class="btn block" id="overviewContinue">${cta}</button>
  <div class="ex-list">${cards}</div>`);
  document.getElementById("overviewContinue").onclick=()=>{workout.index=doneCount===exs.length?0:firstOpen;show("workout");};
  document.querySelectorAll("[data-overview-index]").forEach(b=>b.onclick=()=>{
    workout.index=Number(b.dataset.overviewIndex);
    show("workout");
  });
}

/* -------------------------------------------------------------------------
   Treino (exercício a exercício)
   ------------------------------------------------------------------------- */
function restButton(seconds,extraClass="",autoNext=false){
  return `<button type="button" class="timer-btn ${extraClass}" data-shortcut-rest="${seconds}" ${autoNext?'data-auto-next="true"':""}>⏱ Descanso ${formatTime(seconds)}${autoNext?" · próximo exercício":""}</button>`;
}
// Marcação "Manter / Subir" para a próxima semana, logo após registrar o set.
function decideRow(id,cur){
  return `<div class="decide"><span>Próxima semana</span><button type="button" class="chip ${cur==="keep"?"on":""}" data-decide="${id}" data-val="keep">= Manter</button><button type="button" class="chip up ${cur==="up"?"on":""}" data-decide="${id}" data-val="up">↑ Subir</button></div>`;
}
function refLine(ref,extra=""){
  if(!ref)return "";
  return `<div class="set-ref">${esc(ref.label)}: <b>${esc(ref.text)}</b>${extra}${ref.next?` <span class="dec dec-${ref.next}">${DECISION[ref.next]}</span>`:""}</div>`;
}
// Linha de entrada: KG · REPS · ✓ (registrar)
function inputRow(id,l,{raise=false,clusterAttr="",tag=""}={}){
  return `<div class="entry ${l.completed?"is-done":""}">${tag}
    <label class="inp ${raise?"raise":""}"><input data-log="${id}" data-field="weight" inputmode="decimal" ${clusterAttr} value="${esc(l.weight)}" placeholder="—"><span>${raise?"kg ↑":"kg"}</span></label>
    <label class="inp"><input data-log="${id}" data-field="reps" inputmode="numeric" value="${esc(l.reps)}" placeholder="—"><span>reps</span></label>
    <button type="button" class="check ${l.completed?"on":""}" data-complete="${id}" aria-label="${l.completed?"Registrado — tocar para desfazer":"Registrar"}">✓</button>
  </div>`;
}
function prepRow(e,kind){
  const id=logId(kind,0);
  const l=getLog(id,{date:workout.date,week:workout.week,key:workout.key,index:workout.index,exercise:e.name,kind,number:0});
  const pct=kind==="warmup"?state.warmupPct:state.feederPct;
  const tag=`<span class="entry-tag"><b>${kind==="warmup"?"Aquec.":"Feeder"}</b><small>${pct?`≈${pct}% · `:""}${kind==="warmup"?"15":"4–6"}</small></span>`;
  return inputRow(id,l,{tag});
}
function singleSet(e,number,min,max,isFinalWork){
  const id=logId("work",number);
  const l=getLog(id,{date:workout.date,week:workout.week,key:workout.key,index:workout.index,exercise:e.name,kind:"work",number});
  const ref=setRef("work",number);
  return `<div class="set-card ${l.completed?"is-done":""}">
    <div class="set-head"><b>Set ${number}</b><span>${min}–${max} reps</span></div>
    ${refLine(ref)}
    ${inputRow(id,l,{raise:ref?.next==="up"&&!l.completed})}
    ${l.completed?decideRow(id,l.next)+restButton(state.restStraight,isFinalWork?"auto-next-rest":"",isFinalWork):""}
  </div>`;
}
function clusterTotal(number){
  let t=0,any=false;
  for(let b=1;b<=3;b++){const l=state.logs[logId("cluster",number,b)];const r=parseInt(l?.reps,10);if(Number.isFinite(r)){t+=r;any=true;}}
  return any?t:null;
}
function clusterSet(e,s){
  const ref=setRef("cluster",s);
  const isLastSet=s===e.sets;
  let blocks="";
  let allDone=true;
  for(let b=1;b<=3;b++){
    const id=logId("cluster",s,b);
    const l=getLog(id,{date:workout.date,week:workout.week,key:workout.key,index:workout.index,exercise:e.name,kind:"cluster",number:s,block:b});
    if(!l.completed)allDone=false;
    blocks+=inputRow(id,l,{
      raise:b===1&&ref?.next==="up"&&!l.completed,
      clusterAttr:b===1?`data-cluster-weight="${s}"`:`data-cluster-weight-target="${s}"`,
      tag:`<span class="entry-tag"><b>B${b}</b></span>`
    });
    if(l.completed&&b<3)blocks+=restButton(state.clusterRest,"slim");
    if(l.completed&&b===3)blocks+=decideRow(id,l.next)+restButton(state.restStraight,`cluster-final-rest ${isLastSet?"auto-next-rest":""}`,isLastSet);
  }
  const total=clusterTotal(s);
  return `<div class="set-card cluster ${allDone?"is-done":""}">
    <div class="set-head"><b>Set ${s}</b><span>3 blocos · ${e.range} reps · total <b data-cluster-total="${s}">${total??"—"}</b></span></div>
    ${refLine(ref,ref?` = ${ref.total} reps`:"")}
    ${blocks}
  </div>`;
}
function bindSetEvents(){
  document.querySelectorAll("[data-log]").forEach(i=>{
    const saveInput=()=>{
      const l=state.logs[i.dataset.log];
      if(!l)return;
      l[i.dataset.field]=i.value;
      delete l.prefilled;
      const parts=i.dataset.log.split("|");
      // Cluster: carga do Bloco 1 replicada nos Blocos 2 e 3.
      if(i.dataset.field==="weight"&&i.dataset.clusterWeight){
        for(let b=2;b<=3;b++){
          const otherId=[...parts.slice(0,-1),String(b)].join("|");
          const other=state.logs[otherId]||getLog(otherId,{date:workout.date,week:workout.week,key:workout.key,index:workout.index,exercise:l.exercise||"",kind:"cluster",number:Number(parts[5])||1,block:b});
          other.weight=i.value;
        }
        document.querySelectorAll(`[data-cluster-weight-target="${i.dataset.clusterWeight}"]`).forEach(t=>{if(t!==i)t.value=i.value;});
      }
      // Cluster: soma das reps dos 3 blocos, atualizada enquanto digita.
      if(i.dataset.field==="reps"&&l.kind==="cluster"){
        const el=document.querySelector(`[data-cluster-total="${l.number}"]`);
        if(el){const t=clusterTotal(l.number);el.textContent=t??"—";}
      }
      save();
    };
    i.oninput=saveInput;
    i.onchange=saveInput;
  });
  document.querySelectorAll("[data-complete]").forEach(b=>b.onclick=()=>{
    const l=state.logs[b.dataset.complete];
    if(!l)return;
    l.completed=!l.completed;
    delete l.prefilled;
    if(l.completed)l.doneOn=todayISO();
    save();
    renderWorkout();
  });
  document.querySelectorAll("[data-decide]").forEach(b=>b.onclick=()=>{
    const l=state.logs[b.dataset.decide];
    if(!l)return;
    if(l.next===b.dataset.val)delete l.next;else l.next=b.dataset.val;
    save();
    renderWorkout();
  });
  document.querySelectorAll("[data-shortcut-rest]").forEach(b=>b.onclick=()=>openShortcut(Number(b.dataset.shortcutRest)));
}
function renderWorkout(){
  const exs=exercisesFor(workout.week,workout.key);
  workout.index=Math.max(0,Math.min(exs.length-1,workout.index));
  const e=exs[workout.index];
  const previousNote=lastNote(workout.key,workout.index,workout.date);
  const p=e.range.split("–").map(Number);
  const setup=state.setup[e.name]||"";
  // "Sessão anterior" só quando não há referência set a set (ex.: método mudou).
  const kind=e.method==="cluster"?"cluster":"work";
  let hasSetRef=false;
  for(let s=1;s<=e.sets&&!hasSetRef;s++)if(setRef(kind,s))hasSetRef=true;
  const ps=prevSession(workout.key,workout.index,workout.date);
  const lastLine=hasSetRef?"":`<div class="last-line"><span>${ps?`Anterior · ${esc(sessLabel(ps))} · ${ps.method==="cluster"?"Cluster":"Straight"}`:"Anterior"}</span><b>${ps?esc(summaryText(ps.logs)):"Sem histórico"}</b></div>`;
  const pct=Math.round(workout.index/exs.length*100);

  const header=`<header class="wbar">
    <button type="button" class="wbar-btn" id="viewOverview" aria-label="Lista de exercícios">☷</button>
    <div class="wbar-mid"><b>${LABEL[workout.key]}</b><span>Semana ${workout.week} · ${workout.index+1} de ${exs.length}</span></div>
    <button type="button" class="wbar-btn" id="exit">Sair</button>
    <div class="wbar-progress"><i style="width:${pct}%"></i></div>
  </header>`;

  let html=`<section class="ex-head">
    <div class="ex-title">${esc(e.name)}</div>
    <div class="ex-sub">${pill(e.method)}<span>${e.sets} ${e.sets===1?"work set":"work sets"} · ${e.range} reps · descanso ${e.method==="cluster"?`${state.clusterRest}s entre blocos`:formatTime(state.restStraight)}</span></div>
    ${setup?`<div class="ex-setup">⚙️ ${esc(setup)}</div>`:""}
    <div class="ex-links"><button type="button" class="link-btn" id="setupEx">${setup?"Editar ajustes":"+ Ajustes da máquina"}</button><button type="button" class="link-btn" id="editEx">Renomear</button></div>
  </section>
  ${lastLine}
  <section class="block">
    <div class="block-title">Preparação</div>
    <div class="set-card prep">${prepRow(e,"warmup")}${prepRow(e,"feeder")}</div>
  </section>
  <section class="block">
    <div class="block-title">Work sets</div>`;
  for(let s=1;s<=e.sets;s++) html+=e.method==="cluster"?clusterSet(e,s):singleSet(e,s,p[0],p[1],s===e.sets);
  html+=`</section>
  ${previousNote?`<section class="previous-note"><div class="eyebrow">Nota de ${fmt(previousNote.date)}</div><div class="previous-note-text">${esc(previousNote.v)}</div></section>`:""}
  <section class="block"><div class="block-title">Observação de hoje</div><textarea id="note" rows="2" class="input" placeholder="Ex.: não subir carga · melhorar execução...">${esc(state.notes[noteKey()]||"")}</textarea></section>
  <div class="workout-footer">${workout.index>0?'<button class="btn secondary" id="prev">←</button>':''}${workout.index<exs.length-1?'<button class="btn" id="next">Próximo exercício →</button>':'<button class="btn" id="finish">✓ Concluir treino</button>'}</div>`;

  layout(html,header);
  save();

  const moveTo=idx=>{workout.index=idx;renderWorkout();window.scrollTo({top:0,behavior:"instant"});};
  document.getElementById("editEx").onclick=()=>{
    const n=prompt("Nome do exercício (vale para todas as semanas)",e.name);
    if(n&&n.trim()){
      (state.names[workout.key]??={})[workout.index]=n.trim();
      save();renderWorkout();
    }
  };
  document.getElementById("setupEx").onclick=()=>{
    const n=prompt("Ajustes da máquina (ex.: banco posição 2 · pino 4). Deixe vazio para apagar.",setup);
    if(n===null)return;
    if(n.trim())state.setup[e.name]=n.trim();else delete state.setup[e.name];
    save();renderWorkout();
  };
  document.getElementById("note").oninput=ev=>{state.notes[noteKey()]=ev.target.value;save();};
  const prevBtn=document.getElementById("prev"),next=document.getElementById("next"),finish=document.getElementById("finish");
  if(prevBtn)prevBtn.onclick=()=>moveTo(workout.index-1);
  if(next)next.onclick=()=>moveTo(workout.index+1);
  if(finish)finish.onclick=()=>{
    state.completed[`${workout.date}|${workout.week}|${workout.key}|c${state.cycle}`]=todayISO();
    save();go("home");
  };
  bindSetEvents();
  document.querySelectorAll("[data-auto-next]").forEach(btn=>btn.onclick=()=>{
    openShortcut(Number(btn.dataset.shortcutRest)||120);
    if(workout.index<exs.length-1)moveTo(workout.index+1);
  });
}

/* -------------------------------------------------------------------------
   Histórico
   ------------------------------------------------------------------------- */
const METHOD_COLOR={straight:"#1fa874",cluster:"#a66bf2"};
const openHistory=new Set(); // exercícios com as semanas abertas (só enquanto o app está aberto)
function historyCycles(){return state.cycles.slice().sort((a,b)=>Number(b.id)-Number(a.id));}
function historyPerformance(logs,method){
  if(!logs.length)return `<span class="history-empty">—</span>`;
  const dec=n=>n?` <span class="dec dec-${n}">${DECISION_SHORT[n]}</span>`:"";
  if(method==="cluster"){
    const groups={};
    logs.forEach(l=>(groups[l.number]??=[]).push(l));
    return Object.keys(groups).sort((a,b)=>Number(a)-Number(b)).map(n=>{
      const g=setGroups(groups[n])[0];
      return `<div class="history-set"><span>C${n}</span><strong>${esc(g.text)} <small class="history-total">(${g.total})</small>${dec(g.next)}</strong></div>`;
    }).join("");
  }
  return logs.map(l=>`<div class="history-set"><span>S${l.number}</span><strong>${esc(weightText(l.weight))} kg × ${esc(l.reps)||"—"}${dec(l.next)}</strong></div>`).join("");
}
// Gráfico da maior carga de cada sessão, em sequência (vários ciclos).
function sparkline(sessions,uid){
  const pts=sessions.filter(s=>s.top!=null).slice(-14);
  if(pts.length<2)return "";
  const W=300,H=70,padX=10,padTop=16,padBottom=8;
  const vals=pts.map(s=>s.top);
  let lo=Math.min(...vals),hi=Math.max(...vals);
  if(hi===lo){lo-=2.5;hi+=2.5;}
  const x=i=>padX+i*(W-2*padX)/(pts.length-1);
  const y=v=>padTop+(hi-v)*(H-padTop-padBottom)/(hi-lo);
  let seps="";
  pts.forEach((s,i)=>{if(i>0&&s.cycle!==pts[i-1].cycle){const sx=(x(i)+x(i-1))/2;seps+=`<line x1="${sx}" x2="${sx}" y1="4" y2="${H-2}" class="spark-sep"/><text x="${sx+3}" y="10" class="spark-cyc">C${s.cycle}</text>`;}});
  const path=pts.map((s,i)=>`${i?"L":"M"}${x(i).toFixed(1)},${y(s.top).toFixed(1)}`).join(" ");
  const dots=pts.map((s,i)=>`<circle cx="${x(i).toFixed(1)}" cy="${y(s.top).toFixed(1)}" r="4" fill="${METHOD_COLOR[s.method]}" class="spark-dot"/>`).join("");
  const hits=pts.map((s,i)=>`<circle cx="${x(i).toFixed(1)}" cy="${y(s.top).toFixed(1)}" r="13" class="spark-hit" data-spark="${uid}" data-cap="${esc(`Ciclo ${s.cycle} · Sem ${s.week} · ${s.method==="cluster"?"Cluster":"Straight"} · ${summaryText(s.logs)}`)}"/>`).join("");
  const last=pts[pts.length-1];
  const label=`<text x="${x(pts.length-1)-6}" y="${Math.max(11,y(last.top)-8)}" text-anchor="end" class="spark-label">${kg(last.top)} kg</text>`;
  const first=`<text x="${x(0)+6}" y="${Math.max(11,y(pts[0].top)-8)}" class="spark-label muted-label">${kg(pts[0].top)}</text>`;
  return `<div class="spark"><svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" role="img" aria-label="Evolução da maior carga por sessão">${seps}<path d="${path}" class="spark-line"/>${dots}${first}${label}${hits}</svg><div class="spark-cap" id="cap-${uid}">Toque num ponto para ver a sessão</div></div>`;
}
function deltaText(cur,prev){
  if(cur==null||prev==null)return "";
  const d=Math.round((cur-prev)*100)/100;
  if(d===0)return `<span class="delta">mesma carga</span>`;
  return `<span class="delta ${d>0?"up":"down"}">${d>0?"+":"−"}${kg(Math.abs(d))} kg</span>`;
}
function renderHistory(){
  const cycles=historyCycles();
  const cycleId=Number(state.historyCycle||state.cycle||1);
  const cycle=cycles.find(c=>Number(c.id)===cycleId)||cycles[0]||{id:1};
  const cid=Number(cycle.id);
  const selected=WORKOUT_KEYS.includes(state.historyWorkout)?state.historyWorkout:"u1";
  const exs=exercisesFor(1,selected);
  const tabs=WORKOUT_KEYS.map(k=>`<button class="seg-btn ${selected===k?"active":""}" data-history-workout="${k}">${LABEL[k]}</button>`).join("");
  const cycleTabs=cycles.map(c=>`<button class="chip ${Number(c.id)===cid?"on":""}" data-history-cycle="${c.id}">Ciclo ${c.id}</button>`).join("");
  let cards="";
  exs.forEach((e,i)=>{
    const uid=`${selected}-${i}`;
    const all=sessionsAt(selected,i);
    const inCycle=all.filter(s=>s.cycle===cid);
    const latest=inCycle[inCycle.length-1];
    const latestPrev=latest?[...all].filter(x=>x.date<latest.date&&x.method===latest.method&&x.top!=null).pop():null;
    const open=openHistory.has(uid);
    let weeks="";
    if(open){
      for(let week=1;week<=7;week++){
        const s=inCycle.find(x=>x.week===week);
        const prevS=s?[...all].filter(x=>x.date<s.date&&x.method===s.method&&x.top!=null).pop():null;
        const prevCycle=all.find(x=>x.cycle===cid-1&&x.week===week);
        const method=s?.method||exercisesFor(week,selected)[i].method;
        weeks+=`<div class="history-week ${s?"filled":""}"><div class="history-week-label">Sem ${week} ${s?deltaText(s.top,prevS?.top):""}<small>${method==="cluster"?"Cluster":"Straight"}</small></div><div class="history-week-value">${historyPerformance(s?s.logs.slice().sort((a,b)=>(a.number||0)-(b.number||0)||(a.block||0)-(b.block||0)):[],method)}${prevCycle?`<div class="history-prev">Ciclo ${cid-1}: ${esc(summaryText(prevCycle.logs))}</div>`:""}</div></div>`;
      }
    }
    cards+=`<section class="hist-card ${inCycle.length?"has-data":""}">
      <div class="hist-head"><span class="ex-num">${i+1}</span><div class="hist-main"><div class="ex-name">${esc(e.name)}</div>${latest?`<div class="ex-meta">Sem ${latest.week}: ${esc(summaryText(latest.logs))} ${deltaText(latest.top,latestPrev?.top)}</div>`:`<div class="ex-meta">Sem registros neste ciclo</div>`}</div></div>
      ${sparkline(all,uid)}
      ${inCycle.length||all.some(x=>x.cycle===cid-1)?`<button type="button" class="hist-toggle" data-hist-toggle="${uid}">${open?"Ocultar semanas ▴":"Ver semana a semana ▾"}</button>`:""}
      ${open?`<div class="history-weeks">${weeks}</div>`:""}
    </section>`;
  });
  layout(`${pageHead("Histórico","Evolução")}
  <div class="chip-row">${cycleTabs}<button class="chip accent" id="openSummary">🏁 Resumo</button></div>
  <div class="seg">${tabs}</div>
  <div class="legend"><span><i style="background:${METHOD_COLOR.straight}"></i>Straight</span><span><i style="background:${METHOD_COLOR.cluster}"></i>Cluster</span><span><b class="dec-up">↑</b> subir · <b>=</b> manter</span></div>
  <div class="hist-list">${cards}</div>`);
  document.querySelectorAll("[data-history-workout]").forEach(b=>b.onclick=()=>{state.historyWorkout=b.dataset.historyWorkout;save();renderHistory();});
  document.querySelectorAll("[data-history-cycle]").forEach(b=>b.onclick=()=>{state.historyCycle=Number(b.dataset.historyCycle);save();renderHistory();});
  document.querySelectorAll("[data-hist-toggle]").forEach(b=>b.onclick=()=>{const u=b.dataset.histToggle;openHistory.has(u)?openHistory.delete(u):openHistory.add(u);const y=window.scrollY;renderHistory();window.scrollTo({top:y,behavior:"instant"});});
  document.getElementById("openSummary").onclick=()=>{state.summaryCycle=cid;show("summary");};
  bindSpark();
}
function bindSpark(){
  document.querySelectorAll("[data-spark]").forEach(c=>{
    const showCap=()=>{
      const cap=document.getElementById("cap-"+c.dataset.spark);
      if(cap)cap.textContent=c.dataset.cap;
      const svg=c.closest("svg");
      svg.querySelectorAll(".spark-dot").forEach(d=>d.classList.toggle("sel",d.getAttribute("cx")===c.getAttribute("cx")));
    };
    c.addEventListener("click",showCap);
    c.addEventListener("pointerenter",showCap);
  });
}

/* -------------------------------------------------------------------------
   Resumo do ciclo
   ------------------------------------------------------------------------- */
function cycleExerciseStats(key,i,cid){
  const all=sessionsAt(key,i);
  const cur=all.filter(s=>s.cycle===cid&&s.top!=null);
  const prev=all.filter(s=>s.cycle===cid-1&&s.top!=null);
  if(!cur.length)return null;
  const peak=Math.max(...cur.map(s=>s.top));
  const prevPeak=prev.length?Math.max(...prev.map(s=>s.top)):null;
  // Última marcação Manter/Subir do ciclo — o ponto de partida do próximo.
  let lastDecision=null;
  for(const s of cur.slice().reverse()){const g=setGroups(s.logs).find(g=>g.next);if(g){lastDecision={next:g.next,week:s.week};break;}}
  return {start:cur[0].top,startWeek:cur[0].week,peak,prevPeak,lastDecision,sessions:cur.length};
}
function renderSummary(){
  const cycles=historyCycles();
  const cid=Number(state.summaryCycle||state.cycle);
  const cycle=cycles.find(c=>Number(c.id)===cid)||{id:cid,startDate:state.startDate};
  const selected=WORKOUT_KEYS.includes(state.summaryWorkout)?state.summaryWorkout:"u1";
  // Números gerais do ciclo
  const doneSessions=new Set(Object.values(state.logs).filter(l=>Number(l.cycle||1)===cid&&(l.kind==="work"||l.kind==="cluster")&&l.completed).map(l=>`${l.date}|${l.key}`)).size;
  let up=0,total=0,beatPrev=0,withPrev=0;
  for(const k of WORKOUT_KEYS)BASE[k].forEach((_,i)=>{
    const st=cycleExerciseStats(k,i,cid);
    if(!st)return;
    total++;if(st.peak>st.start)up++;
    if(st.prevPeak!=null){withPrev++;if(st.peak>st.prevPeak)beatPrev++;}
  });
  const rows=exercisesFor(1,selected).map((e,i)=>{
    const st=cycleExerciseStats(selected,i,cid);
    if(!st)return `<div class="summary-row"><div class="summary-name">${esc(e.name)}</div><div class="history-empty">Sem registros neste ciclo</div></div>`;
    const gain=st.peak-st.start;
    const vsPrev=st.prevPeak!=null?st.peak-st.prevPeak:null;
    return `<div class="summary-row">
      <div class="summary-name">${esc(e.name)}</div>
      <div class="summary-line"><span>Semana ${st.startWeek} → pico do ciclo</span><strong>${kg(st.start)} → ${kg(st.peak)} kg${gain?` <em>(${gain>0?"+":""}${kg(gain)})</em>`:""}</strong></div>
      ${vsPrev!=null?`<div class="summary-line"><span>vs. pico do Ciclo ${cid-1} (${kg(st.prevPeak)} kg)</span><strong>${vsPrev>0?"+":vsPrev<0?"−":""}${vsPrev?kg(Math.abs(vsPrev))+" kg":"igual"}</strong></div>`:""}
      ${st.lastDecision?`<div class="summary-line"><span>Última marcação · Sem ${st.lastDecision.week}</span><strong class="dec-${st.lastDecision.next}">${DECISION[st.lastDecision.next]}</strong></div>`:""}
    </div>`;
  }).join("");
  const tabs=WORKOUT_KEYS.map(k=>`<button class="seg-btn ${selected===k?"active":""}" data-summary-workout="${k}">${LABEL[k]}</button>`).join("");
  const cycleTabs=cycles.map(c=>`<button class="chip ${Number(c.id)===cid?"on":""}" data-summary-cycle="${c.id}">Ciclo ${c.id}</button>`).join("");
  const start=cycle.startDate||state.startDate;
  layout(`${pageHead("Resumo do ciclo",`Ciclo ${cid}`,`<div class="muted">${fmt(start)} → ${fmt(addDays(start,CYCLE_DAYS-1))}</div>`)}
  <div class="chip-row">${cycleTabs}</div>
  <div class="summary-stats">
    <div class="stat"><b>${doneSessions}<small>/35</small></b><span>treinos registrados</span></div>
    <div class="stat"><b>${up}<small>/${total||0}</small></b><span>exercícios subiram carga no ciclo</span></div>
    <div class="stat"><b>${withPrev?`${beatPrev}<small>/${withPrev}</small>`:"—"}</b><span>${withPrev?`superaram o pico do Ciclo ${cid-1}`:"sem ciclo anterior para comparar"}</span></div>
  </div>
  <div class="seg">${tabs}</div>
  <div class="card summary-card">${rows}</div>
  <button class="btn secondary block" id="backHistory">← Voltar ao histórico</button>`);
  document.querySelectorAll("[data-summary-workout]").forEach(b=>b.onclick=()=>{state.summaryWorkout=b.dataset.summaryWorkout;save();renderSummary();});
  document.querySelectorAll("[data-summary-cycle]").forEach(b=>b.onclick=()=>{state.summaryCycle=Number(b.dataset.summaryCycle);save();renderSummary();});
  document.getElementById("backHistory").onclick=()=>go("history");
}

/* -------------------------------------------------------------------------
   Configurações
   ------------------------------------------------------------------------- */
function clearCurrentCycle(){
  const start=state.startDate,end=cycleEndDate();
  const inCycle=k=>{const d=String(k).split("|")[0];return d>=start&&d<=end;};
  for(const [id,l] of Object.entries(state.logs)) if(Number(l.cycle||1)===Number(state.cycle)) delete state.logs[id];
  for(const k of Object.keys(state.notes)) if(inCycle(k)) delete state.notes[k];
  for(const k of Object.keys(state.completed)) if(inCycle(k)) delete state.completed[k];
}
function exportBackup(){
  const name=`mr-saizen-backup-${todayISO()}.json`;
  const blob=new Blob([JSON.stringify(state,null,1)],{type:"application/json"});
  const file=typeof File==="function"?new File([blob],name,{type:"application/json"}):null;
  if(file&&navigator.canShare?.({files:[file]})){
    navigator.share({files:[file],title:"Backup MR Saizen"}).catch(()=>{});
    return;
  }
  const a=document.createElement("a");
  a.href=URL.createObjectURL(blob);a.download=name;
  document.body.appendChild(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(a.href),2000);
}
function importBackup(file){
  const reader=new FileReader();
  reader.onload=()=>{
    try{
      const data=JSON.parse(reader.result);
      if(!data||typeof data!=="object"||!data.startDate||typeof data.logs!=="object") throw new Error("Arquivo não parece um backup do MR Saizen.");
      if(!confirm("Substituir os dados atuais por este backup?"))return;
      state=normalizeState(data);
      viewWeek=null;
      save();go("home");
    }catch(err){alert("Não foi possível importar: "+err.message);}
  };
  reader.readAsText(file);
}
function renderSettings(){
  const info=weekInfo();
  layout(`${pageHead("Ajustes","Configurações")}<div class="card"><div class="stack"><div class="field"><label>Início do ciclo</label><input id="start" type="date" class="input" value="${state.startDate}"></div><div class="formgrid"><div class="field"><label>Descanso Straight (s)</label><input id="straight" type="number" inputmode="numeric" class="input" value="${state.restStraight}"></div><div class="field"><label>Entre exercícios (s)</label><input id="between" type="number" inputmode="numeric" class="input" value="${state.restBetweenExercises}"></div></div><div class="field"><label>Cluster entre blocos (s)</label><input id="cluster" type="number" inputmode="numeric" class="input" value="${state.clusterRest}"></div><div class="formgrid"><div class="field"><label>Aquecimento (% da carga)</label><input id="warmupPct" type="number" inputmode="numeric" class="input" value="${state.warmupPct}"></div><div class="field"><label>Feeder (% da carga)</label><input id="feederPct" type="number" inputmode="numeric" class="input" value="${state.feederPct}"></div></div><button class="btn" id="saveSettings">Salvar</button></div></div><div class="card"><div class="h2">Dados locais</div><div class="muted">Você pode apagar os registros do ciclo atual sem apagar o treino programado nem os ciclos anteriores.</div><button class="btn secondary" id="clearLogs" style="margin-top:10px">Limpar registros do ciclo</button></div><div class="card"><div class="h2">Backup</div><div class="muted">Os registros ficam só neste aparelho. Exporte um backup de vez em quando (ex.: salvar no app Arquivos/iCloud) para não perder o histórico se trocar de celular ou apagar o app.</div><div class="row-actions" style="justify-content:flex-start;margin-top:10px"><button class="btn secondary" id="exportBackup">Exportar backup</button><button class="btn secondary" id="importBackup">Importar backup</button><input id="importFile" type="file" accept="application/json,.json" hidden></div></div><div class="card"><div class="h2">Ciclo ${state.cycle}</div><div class="muted">Semana atual: ${info.week} — ${PROGRAM[info.week].name} · ${fmt(state.startDate)} → ${fmt(cycleEndDate())}</div><div class="muted" style="margin-top:8px">Ao terminar a Semana 7, o método volta automaticamente para a Semana 1 no próximo ciclo. Cargas, repetições e observações dos ciclos anteriores permanecem no histórico e são usadas como referência para a próxima sessão.</div><button class="btn secondary" id="newCycle" style="margin-top:10px">Iniciar próximo ciclo agora</button></div><div class="card"><div class="h2">Atalho do iOS</div><p class="muted">Crie um Atalho chamado <strong>MR Saizen Timer</strong>. O app <strong>não inicia o descanso automaticamente</strong>; você toca no botão de descanso e ele abre o Atalho, passando a duração em segundos.</p><button class="btn secondary" id="testShortcut">Testar Atalho · 20s</button></div><div class="notice">Os registros ficam salvos localmente neste dispositivo. A progressão de carga é decidida por você. · MR Saizen ${APP_VERSION}</div>`);

  document.getElementById("saveSettings").onclick=()=>{
    let start=document.getElementById("start").value||state.startDate;
    const dow=localDate(start).getDay();
    if(dow!==1){
      const monday=addDays(start,dow===0?-6:1-dow);
      if(confirm(`A data escolhida não é segunda-feira. Ajustar o início para segunda, ${fmt(monday)}?`))start=monday;
    }
    if(start!==state.startDate){
      state.startDate=start;
      const c=state.cycles.find(c=>Number(c.id)===Number(state.cycle));
      if(c)c.startDate=start;
      viewWeek=null;
    }
    state.restStraight=Math.max(1,Number(document.getElementById("straight").value)||120);
    state.restBetweenExercises=Math.max(1,Number(document.getElementById("between").value)||120);
    state.clusterRest=Math.max(1,Number(document.getElementById("cluster").value)||20);
    state.warmupPct=Math.min(100,Math.max(0,Number(document.getElementById("warmupPct").value)||0));
    state.feederPct=Math.min(100,Math.max(0,Number(document.getElementById("feederPct").value)||0));
    save();go("home");
  };
  document.getElementById("clearLogs").onclick=()=>{
    if(confirm("Apagar cargas, reps, observações e registros deste ciclo? O treino programado e os ciclos anteriores não serão apagados.")){
      clearCurrentCycle();save();go("home");
    }
  };
  document.getElementById("exportBackup").onclick=exportBackup;
  const fileInput=document.getElementById("importFile");
  document.getElementById("importBackup").onclick=()=>fileInput.click();
  fileInput.onchange=()=>{if(fileInput.files[0])importBackup(fileInput.files[0]);};
  document.getElementById("newCycle").onclick=()=>{
    if(confirm(`Encerrar o Ciclo ${state.cycle} e começar o Ciclo ${Number(state.cycle)+1}?`))startNewCycle();
  };
  document.getElementById("testShortcut").onclick=()=>openShortcut(20);
}

/* -------------------------------------------------------------------------
   Atalho do iOS (timer de descanso)
   ------------------------------------------------------------------------- */
function openShortcut(seconds){
  const duration=Number(seconds)||120;
  const url="shortcuts://run-shortcut?name="+encodeURIComponent("MR Saizen Timer")+"&input=text&text="+encodeURIComponent(String(duration));
  window.location.assign(url);
}

/* -------------------------------------------------------------------------
   Início do app
   ------------------------------------------------------------------------- */
document.addEventListener("visibilitychange",()=>{
  if(document.visibilityState!=="visible")return;
  const today=todayISO();
  if(today===lastSeenDay)return;
  lastSeenDay=today;
  viewWeek=null;
  if(route==="home")render();
});
bindNav();
bindKeyboardGuard();
render();
})();
