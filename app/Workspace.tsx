"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type Priority = "low" | "medium" | "high";
type Task = { id: string; title: string; note: string; due: string; category: string; priority: Priority; duration: string; done: boolean };
type Schedule = { id: string; title: string; note: string; due: string; category: string; priority: Priority };
type Note = { id: string; title: string; note: string; due: string; category: string; priority: Priority };
type Goal = { id: string; title: string; note: string; due: string; category: string; priority: Priority; progress: number };
type Kind = "task" | "schedule" | "note" | "goal";
type Editable = Task | Schedule | Note | Goal;

const defaults = {
  tasks: [
    { id: "t1", title: "???????????", note: "???????????", due: "?? 11:30", category: "??", priority: "high", duration: "2 ??", done: true },
    { id: "t2", title: "?????????", note: "", due: "?? 14:00", category: "??", priority: "medium", duration: "30 ??", done: false },
    { id: "t3", title: "?????????", note: "", due: "?? 16:30", category: "??", priority: "medium", duration: "30 ??", done: false },
  ] satisfies Task[],
  schedules: [
    { id: "s1", title: "??????", note: "", due: "?? 10:30 ? 12:00", category: "??", priority: "medium" },
    { id: "s2", title: "?????", note: "?? ? 30 ??", due: "?? 14:00", category: "??", priority: "medium" },
  ] satisfies Schedule[],
  notes: [
    { id: "n1", title: "???????????", note: "???????????????", due: "??", category: "??", priority: "low" },
    { id: "n2", title: "??????????", note: "?????????????????", due: "??", category: "??", priority: "low" },
  ] satisfies Note[],
  goals: [
    { id: "g1", title: "??????", note: "?? ? ????", due: "??", category: "??", priority: "high", progress: 82 },
    { id: "g2", title: "?????", note: "?? ? ???", due: "??", category: "??", priority: "medium", progress: 45 },
  ] satisfies Goal[],
};
const nav = ["??", "????", "??", "??", "??"];
const icons = ["?", "?", "?", "?", "?"];
const labels: Record<Kind, string> = { task: "??", schedule: "??", note: "??", goal: "??" };
const keyFor: Record<Kind, keyof typeof defaults> = { task: "tasks", schedule: "schedules", note: "notes", goal: "goals" };

function useStored<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const [ready, setReady] = useState(false);
  useEffect(() => { try { const raw = localStorage.getItem(key); if (raw) setValue(JSON.parse(raw)); } catch {} finally { setReady(true); } }, [key]);
  useEffect(() => { if (ready) localStorage.setItem(key, JSON.stringify(value)); }, [key, value, ready]);
  return [value, setValue] as const;
}

export default function Workspace({ initialActive }: { initialActive: string }) {
  const [active, setActive] = useState(initialActive);
  const [tasks, setTasks] = useStored<Task[]>("workspace.tasks", defaults.tasks);
  const [schedules, setSchedules] = useStored<Schedule[]>("workspace.schedules", defaults.schedules);
  const [notes, setNotes] = useStored<Note[]>("workspace.notes", defaults.notes);
  const [goals, setGoals] = useStored<Goal[]>("workspace.goals", defaults.goals);
  const [editor, setEditor] = useState<{ kind: Kind; item?: Editable } | null>(null);
  const [confirm, setConfirm] = useState<{ kind: Kind; id: string; title: string } | null>(null);
  const [toast, setToast] = useState<{ text: string; undo?: () => void } | null>(null);
  const done = useMemo(() => tasks.filter((task) => task.done).length, [tasks]);
  useEffect(() => { if (!toast) return; const timer = setTimeout(() => setToast(null), 4200); return () => clearTimeout(timer); }, [toast]);
  useEffect(() => { const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") { setEditor(null); setConfirm(null); } }; window.addEventListener("keydown", onKey); return () => window.removeEventListener("keydown", onKey); }, []);

  const addOrUpdate = (kind: Kind, item: Editable) => {
    const set = ({ task: setTasks, schedule: setSchedules, note: setNotes, goal: setGoals } as const)[kind] as (fn: (items: Editable[]) => Editable[]) => void;
    set((items) => items.some((entry) => entry.id === item.id) ? items.map((entry) => entry.id === item.id ? item : entry) : [...items, item]);
    setEditor(null); setToast({ text: "???" });
  };
  const remove = () => {
    if (!confirm) return;
    const { kind, id, title } = confirm; const set = ({ task: setTasks, schedule: setSchedules, note: setNotes, goal: setGoals } as const)[kind] as (fn: (items: Editable[]) => Editable[]) => void;
    let removed: Editable | undefined;
    set((items) => { removed = items.find((item) => item.id === id); return items.filter((item) => item.id !== id); });
    setConfirm(null); setToast({ text: `????${title}?`, undo: () => { if (removed) addOrUpdate(kind, removed); } });
  };
  const toggleTask = (task: Task) => { const next = { ...task, done: !task.done }; setTasks((items) => items.map((item) => item.id === task.id ? next : item)); setToast({ text: next.done ? "?????" : "???????", undo: next.done ? () => setTasks((items) => items.map((item) => item.id === task.id ? task : item)) : undefined }); };
  const select = (event: React.MouseEvent<HTMLAnchorElement>, item: string) => { event.preventDefault(); setActive(item); };

  const shared = { tasks, schedules, notes, goals, done, setEditor, setConfirm, toggleTask };
  return <main className="workspace"><aside className="sidebar"><a className="brand" href="?section=%E6%80%BB%E8%A7%88" onClick={(event) => select(event, "??")}><i>?</i><span>?????</span></a><p className="label">????</p><nav>{nav.map((item, index) => <a key={item} className={active === item ? "nav active" : "nav"} href={`?section=${encodeURIComponent(item)}`} onClick={(event) => select(event, item)}><b>{icons[index]}</b><span>{item}</span></a>)}</nav></aside><section className="content"><header><div className="mobile-brand"><i>?</i>?????</div><div className="today">????7?30?</div></header>{active === "??" ? <Overview {...shared} /> : <Section title={active} {...shared} />}</section>{editor && <Editor kind={editor.kind} item={editor.item} onClose={() => setEditor(null)} onSave={(item) => addOrUpdate(editor.kind, item)} />}{confirm && <Confirm title={confirm.title} onClose={() => setConfirm(null)} onConfirm={remove} />}{toast && <div className="toast" role="status">{toast.text}{toast.undo && <button onClick={() => { toast.undo?.(); setToast(null); }}>??</button>}</div>}</main>;
}

function Overview(props: Shared) { return <><div className="intro"><div><p className="eyebrow">?? / ??</p><h1>????ZJL</h1><p>?????????????</p></div><div className="progress"><b>{Math.round(props.done / Math.max(props.tasks.length, 1) * 100)}%</b></div></div><div className="grid"><Focus /><SchedulePanel {...props}/><TaskPanel {...props}/><GoalPanel {...props}/></div></>; }
function Focus(){ return <article className="panel focus-card"><p className="eyebrow">TODAY&apos;S FOCUS</p><h2>????</h2><div className="focus-body"><span>01</span><div><label>??</label><h3>???????????</h3><p>??????????????????????????</p></div></div><footer><span>?????</span><span>?? 2 ??</span></footer></article>; }
type Shared = { tasks: Task[]; schedules: Schedule[]; notes: Note[]; goals: Goal[]; done: number; setEditor: (value: {kind: Kind; item?: Editable}) => void; setConfirm: (value: {kind: Kind; id: string; title: string}) => void; toggleTask: (task: Task) => void };
function PanelHeader({ title, kind, count, onAdd }: {title: string; kind: Kind; count?: string; onAdd: () => void}) { return <div className="heading"><div><p className="eyebrow">{kind === "task" ? "MY TASKS" : kind === "schedule" ? "UP NEXT" : kind === "goal" ? "IN PROGRESS" : "NOTES"}</p><h2>{title} {count && <small>{count}</small>}</h2></div><button className="primary-button" onClick={onAdd}>+ ??{labels[kind]}</button></div>; }
function TaskPanel({tasks, done, setEditor, setConfirm, toggleTask}: Shared){ return <article className="panel tasks"><PanelHeader title="????" kind="task" count={`${done}/${tasks.length}`} onAdd={() => setEditor({kind:"task"})}/>{tasks.length ? <div className="task-list">{tasks.map((task) => <div className={`task-row ${task.done ? "done" : ""}`} key={task.id}><button className="task-check" aria-label={task.done ? "??????" : "?????"} onClick={() => toggleTask(task)}>{task.done ? "?" : ""}</button><button className="task-main" onClick={() => setEditor({kind:"task", item:task})}><b>{task.title}</b><small>{task.category} ? {task.due} ? {task.duration}</small></button><ItemActions item={task} kind="task" setEditor={setEditor} setConfirm={setConfirm}/></div>)}</div> : <Empty text="??????????????" onClick={() => setEditor({kind:"task"})}/>}</article>; }
function SchedulePanel({schedules, setEditor, setConfirm}: Shared){ return <article className="panel agenda"><PanelHeader title="??" kind="schedule" onAdd={() => setEditor({kind:"schedule"})}/><div className="schedule-list">{schedules.map((item) => <ItemCard key={item.id} item={item} kind="schedule" setEditor={setEditor} setConfirm={setConfirm}/>)}</div></article>; }
function GoalPanel({goals, setEditor, setConfirm}: Shared){ return <article className="panel projects"><PanelHeader title="??????" kind="goal" onAdd={() => setEditor({kind:"goal"})}/><div>{goals.map((item) => <div className="goal" key={item.id}><div><b>{item.title}</b><small>{item.note}</small></div><strong>{item.progress}%</strong><ItemActions item={item} kind="goal" setEditor={setEditor} setConfirm={setConfirm}/><p><i style={{width:`${item.progress}%`}}/></p></div>)}</div></article>; }
function ItemCard({item,kind,setEditor,setConfirm}:{item:Schedule|Note;kind:Kind;setEditor:Shared["setEditor"];setConfirm:Shared["setConfirm"]}){ return <div className="item-card"><button onClick={() => setEditor({kind,item})}><b>{item.title}</b><small>{item.due}{item.note ? ` ? ${item.note}` : ""}</small></button><ItemActions item={item} kind={kind} setEditor={setEditor} setConfirm={setConfirm}/></div>; }
function ItemActions({item,kind,setEditor,setConfirm}:{item:Editable;kind:Kind;setEditor:Shared["setEditor"];setConfirm:Shared["setConfirm"]}){ return <div className="item-actions"><button aria-label="??" onClick={() => setEditor({kind,item})}>??</button><button aria-label="??" onClick={() => setConfirm({kind,id:item.id,title:item.title})}>??</button></div>; }
function Empty({text,onClick}:{text:string;onClick:()=>void}){ return <div className="empty"><p>{text}</p><button className="primary-button" onClick={onClick}>+ ??</button></div>; }
function Section({title,...props}: Shared & {title:string}) { if(title === "????") return <div className="section-page"><p className="eyebrow">???? / ????</p><h1>????</h1><p className="section-desc">??????????????</p><TaskPanel {...props}/></div>; if(title === "??") return <div className="section-page"><p className="eyebrow">???? / ??</p><h1>????</h1><p className="section-desc">?????????????</p><GoalPanel {...props}/></div>; if(title === "??") return <div className="section-page"><p className="eyebrow">???? / ??</p><h1>??</h1><p className="section-desc">?????????????</p><SchedulePanel {...props}/></div>; if(title === "??") return <div className="section-page"><p className="eyebrow">???? / ??</p><h1>??</h1><p className="section-desc">????????????</p><article className="panel notes"><PanelHeader title="????" kind="note" onAdd={() => props.setEditor({kind:"note"})}/>{props.notes.map((item) => <ItemCard key={item.id} item={item} kind="note" setEditor={props.setEditor} setConfirm={props.setConfirm}/>)}</article></div>; return <div className="section-page"><p className="eyebrow">???? / ??</p><h1>??</h1><p className="section-desc">?????????????????</p></div>; }
function Editor({kind,item,onClose,onSave}:{kind:Kind;item?:Editable;onClose:()=>void;onSave:(item:Editable)=>void}){ const base = item ?? {id:crypto.randomUUID(),title:"",note:"",due:"",category:"",priority:"medium" as Priority,...(kind === "task" ? {duration:"30 ??",done:false} : kind === "goal" ? {progress:0} : {})}; const [form,setForm]=useState(base); const change=(field:string,value:string|number)=>setForm((previous)=>({...previous,[field]:value})); const save=(event:FormEvent)=>{event.preventDefault();if(!form.title.trim())return;onSave(form as Editable);}; return <div className="modal-backdrop" role="presentation"><form className="modal" onSubmit={save}><header><div><p className="eyebrow">{item ? "??" : "??"}{labels[kind]}</p><h2>{item ? "????" : `??${labels[kind]}`}</h2></div><button type="button" className="icon-button" aria-label="??" onClick={onClose}>?</button></header><div className="form-fields"><label>??<input autoFocus value={form.title} onChange={(event)=>change("title",event.target.value)} placeholder={`??${labels[kind]}??`}/></label><label>??/??<textarea value={form.note} onChange={(event)=>change("note",event.target.value)} placeholder="????"/></label><div className="form-grid"><label>????<input value={form.due} onChange={(event)=>change("due",event.target.value)} placeholder="????? 14:00"/></label><label>??<input value={form.category} onChange={(event)=>change("category",event.target.value)} placeholder="?????"/></label></div><div className="form-grid"><label>???<select value={form.priority} onChange={(event)=>change("priority",event.target.value)}><option value="low">?</option><option value="medium">?</option><option value="high">?</option></select></label>{kind === "task" && <label>????<input value={(form as Task).duration} onChange={(event)=>change("duration",event.target.value)} placeholder="30 ??"/></label>}{kind === "goal" && <label>?? %<input type="number" min="0" max="100" value={(form as Goal).progress} onChange={(event)=>change("progress",Number(event.target.value))}/></label>}</div></div><footer><button type="button" className="secondary-button" onClick={onClose}>??</button><button className="primary-button" type="submit">??</button></footer></form></div>; }
function Confirm({title,onClose,onConfirm}:{title:string;onClose:()=>void;onConfirm:()=>void}){ return <div className="modal-backdrop"><div className="confirm" role="dialog" aria-modal="true"><h2>?????</h2><p>?{title}??????????</p><div><button className="secondary-button" onClick={onClose}>??</button><button className="danger-button" onClick={onConfirm}>??</button></div></div></div>; }
