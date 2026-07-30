"use client";

import { useMemo, useState } from "react";

type Task = { id: number; title: string; time: string; done: boolean; tone: string };
const seed: Task[] = [
  { id: 1, title: "完成个人工作台的第一版", time: "今天 · 11:30", done: true, tone: "purple" },
  { id: 2, title: "整理本周项目优先级", time: "今天 · 14:00", done: false, tone: "orange" },
  { id: 3, title: "给产品团队同步进展", time: "今天 · 16:30", done: false, tone: "blue" },
  { id: 4, title: "阅读设计系统更新", time: "明天", done: false, tone: "pink" },
];
const nav = ["总览", "我的任务", "项目", "日历", "笔记"];
const icons = ["\u25a6", "\u2713", "\u25c8", "\u25a3", "\u270e"];

export default function Workspace({ initialActive }: { initialActive: string }) {
  const [active, setActive] = useState(initialActive);
  const [compact, setCompact] = useState(false);
  const [sidebar, setSidebar] = useState(true);
  const [soft, setSoft] = useState(true);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [tasks, setTasks] = useState(seed);
  const done = useMemo(() => tasks.filter((task) => task.done).length, [tasks]);
  const addTask = () => setTasks((list) => [...list, { id: Date.now(), title: "新的待办事项", time: "今天", done: false, tone: "purple" }]);
  const toggle = (id: number) => setTasks((list) => list.map((task) => task.id === id ? { ...task, done: !task.done } : task));
  const select = (event: React.MouseEvent<HTMLAnchorElement>, item: string) => { event.preventDefault(); setActive(item); };
  return <main className={`workspace ${compact ? "compact" : ""} ${sidebar ? "" : "sidebar-hidden"} ${soft ? "" : "square"} ${mobileMenu ? "mobile-menu-open" : ""}`}>
    <aside className="sidebar">
      <a className="brand" href="?section=%E6%80%BB%E8%A7%88" onClick={(event) => select(event, "\u603b\u89c8")}><i>亮</i><span>亮的工作台</span></a>
      <p className="label">工作空间</p>
      <nav>{nav.map((item, index) => <a key={item} className={active === item ? "nav active" : "nav"} href={`?section=${encodeURIComponent(item)}`} onClick={(event) => { select(event, item); setMobileMenu(false); }}><b>{icons[index]}</b><span>{item}</span></a>)}</nav>
    </aside>
    <section className="content" id="top">
      <header><div className="mobile-brand"><i>亮</i> 亮的工作台</div><div className="today">☼　星期三，7月30日</div></header>
      {active === "总览" ? <Overview tasks={tasks} done={done} toggle={toggle} addTask={addTask} /> : <SectionPage title={active} tasks={tasks} done={done} toggle={toggle} addTask={addTask} compact={compact} setCompact={setCompact} sidebar={sidebar} setSidebar={setSidebar} soft={soft} setSoft={setSoft} />}
    </section>
  </main>;
}
function Overview({tasks,done,toggle,addTask}:{tasks:Task[];done:number;toggle:(id:number)=>void;addTask:()=>void}) { return <><div className="intro"><div><p className="eyebrow">总览 / 今日</p><h1>早上好，ZJL <em>✦</em></h1><p>把注意力留给真正重要的事。</p></div><div className="progress"><svg viewBox="0 0 42 42"><circle cx="21" cy="21" r="16"/><circle className="value" cx="21" cy="21" r="16" pathLength="100"/></svg><b>68<small>%</small></b></div></div><div className="grid"><article className="panel focus-card"><div className="heading"><div><p className="eyebrow">TODAY&apos;S FOCUS</p><h2>今日重点</h2></div></div><div className="focus-body"><span>01</span><div><label>设计</label><h3>完成个人工作台的第一版</h3><p>把核心信息、任务流和项目状态放在一个更从容的界面里。</p></div></div><footer><span>● ●　与自己约定</span><span>预计 2 小时</span></footer></article><article className="panel agenda"><div className="heading"><div><p className="eyebrow">UP NEXT</p><h2>日程</h2></div></div><div className="time">10:30</div><div className="event green"><b>专注设计时间</b><span>10:30 – 12:00</span></div><div className="time">14:00</div><div className="event peach"><b>项目同步会</b><span>线上 · 30 分钟</span></div></article><TaskPanel tasks={tasks} done={done} toggle={toggle} addTask={addTask}/><ProjectPanel/></div></> }
function TaskPanel({tasks,done,toggle,addTask}:{tasks:Task[];done:number;toggle:(id:number)=>void;addTask:()=>void}) { return <article className="panel tasks"><div className="heading"><div><p className="eyebrow">MY TASKS</p><h2>待办事项 <small>{done}/{tasks.length}</small></h2></div></div><div className="task-list">{tasks.map((task) => <button className={task.done ? "task done" : "task"} key={task.id} onClick={() => toggle(task.id)}><i className={task.tone}>{task.done ? "✓" : ""}</i><span><b>{task.title}</b><small>{task.time}</small></span></button>)}</div><button className="add-task" onClick={addTask}>＋ 添加任务</button></article> }
function ProjectPanel(){return <article className="panel projects"><div className="heading"><div><p className="eyebrow">IN PROGRESS</p><h2>进行中的项目</h2></div></div><Project icon="▰" name="个人品牌网站" info="设计 · 本周截止" percent={82} color="coral"/><Project icon="⌁" name="灵感资料库" info="整理 · 进行中" percent={45} color="cyan"/></article>}
function Project({icon,name,info,percent,color}:{icon:string;name:string;info:string;percent:number;color:string}) { return <div className="project"><div className={`project-icon ${color}`}>{icon}</div><div><b>{name}</b><small>{info}</small></div><strong>{percent}%</strong><p><i className={color} style={{width:`${percent}%`}}/></p></div> }
function SectionPage({title,tasks,done,toggle,addTask,compact,setCompact,sidebar,setSidebar,soft,setSoft}:{title:string;tasks:Task[];done:number;toggle:(id:number)=>void;addTask:()=>void;compact:boolean;setCompact:(x:boolean)=>void;sidebar:boolean;setSidebar:(x:boolean)=>void;soft:boolean;setSoft:(x:boolean)=>void}) { const copy:Record<string,[string,string]>={"我的任务":["待办事项","集中处理今天和接下来的任务。"],"项目":["项目空间","查看正在推进的工作与进度。"],"日历":["日历","让计划和时间安排保持清晰。"],"笔记":["笔记","记录灵感、决定和下一步。"]}; const [heading,desc]=copy[title] ?? ["设置","调整工作台的外观和布局。"]; if(title === "设置") return <div className="section-page"><p className="eyebrow">工作空间 / 设置</p><h1>设置</h1><p className="section-desc">调整工作台的外观和布局。</p><div className="settings-panel"><Setting label="紧凑布局" detail="缩小卡片与内容之间的间距。" value={compact} onChange={setCompact}/><Setting label="显示侧边栏" detail="隐藏后保留左上角工作台入口。" value={sidebar} onChange={setSidebar}/><Setting label="柔和圆角" detail="关闭后使用更利落的直角卡片。" value={soft} onChange={setSoft}/></div></div>; return <div className="section-page"><p className="eyebrow">工作空间 / {title}</p><h1>{heading}</h1><p className="section-desc">{desc}</p>{title === "我的任务" ? <TaskPanel tasks={tasks} done={done} toggle={toggle} addTask={addTask}/> : title === "项目" ? <div className="single-panel"><ProjectPanel/></div> : title === "日历" ? <div className="day-list"><div><b>10:30</b><span>专注设计时间</span><small>10:30 – 12:00</small></div><div><b>14:00</b><span>项目同步会</span><small>线上 · 30 分钟</small></div><div><b>16:30</b><span>整理本周优先级</span><small>30 分钟</small></div></div> : <div className="notes"><button>＋ 新建笔记</button><article><small>今天</small><h3>产品灵感与待验证的想法</h3><p>把值得继续推敲的事情先记下来。</p></article><article><small>本周</small><h3>个人工作台的优化方向</h3><p>让信息更少一点，下一步更明确一点。</p></article></div>}</div> }

function Setting({label,detail,value,onChange}:{label:string;detail:string;value:boolean;onChange:(x:boolean)=>void}){return <div className="setting"><div><b>{label}</b><small>{detail}</small></div><button className={value?"switch on":"switch"} onClick={()=>onChange(!value)} aria-label={label}><i/></button></div>}

