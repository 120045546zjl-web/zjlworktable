"use client";

import { useMemo, useState } from "react";

type Task = { id: number; title: string; time: string; done: boolean; tone: string };
const seed: Task[] = [
  { id: 1, title: "完成个人工作台的第一版", time: "今天 · 11:30", done: true, tone: "purple" },
  { id: 2, title: "整理本周项目优先级", time: "今天 · 14:00", done: false, tone: "orange" },
  { id: 3, title: "给产品团队同步进展", time: "今天 · 16:30", done: false, tone: "blue" },
  { id: 4, title: "阅读设计系统更新", time: "明天", done: false, tone: "pink" },
];
const nav = ["总览", "目录", "我的任务", "项目", "日历", "笔记"];

export default function Home() {
  const [active, setActive] = useState("总览");
  const [tasks, setTasks] = useState(seed);
  const [focus, setFocus] = useState(false);
  const done = useMemo(() => tasks.filter((task) => task.done).length, [tasks]);
  const addTask = () => setTasks((list) => [...list, { id: Date.now(), title: "新的待办事项", time: "今天", done: false, tone: "purple" }]);
  return <main className={focus ? "workspace focus" : "workspace"}>
    <aside className="sidebar">
      <a className="brand" href="#top"><i>m</i><span>Mori</span></a>
      <p className="label">工作空间</p>
      <nav>{nav.map((item, index) => <button key={item} className={active === item ? "nav active" : "nav"} onClick={() => setActive(item)}><b>{["◫", "☷", "✓", "◇", "□", "✦"][index]}</b><span>{item}</span></button>)}</nav>
      <div className="side-bottom"><div className="quote"><em>✦</em><p>让每一天都有一点进展。</p><button onClick={() => setFocus(!focus)}>{focus ? "退出专注" : "开启专注"}</button></div><div className="profile"><i>Z</i><span><strong>ZJL</strong><small>个人空间</small></span><b>···</b></div></div>
    </aside>
    <section className="content" id="top">
      <header><div className="mobile-brand"><i>m</i> Mori</div><div className="today">☼　星期三，7月30日</div><div className="actions"><button aria-label="搜索">⌕</button><button aria-label="通知">♧</button><button className="create" onClick={addTask}>＋ <span>新建</span></button></div></header>
      <div className="intro"><div><p className="eyebrow">{active} / 今日</p><h1>早上好，ZJL <em>✦</em></h1><p>把注意力留给真正重要的事。</p></div><div className="progress"><svg viewBox="0 0 42 42"><circle cx="21" cy="21" r="16"/><circle className="value" cx="21" cy="21" r="16" pathLength="100"/></svg><b>68<small>%</small></b></div></div>
      <div className="grid">
        <article className="panel focus-card"><div className="heading"><div><p className="eyebrow">TODAY&apos;S FOCUS</p><h2>今日重点</h2></div><button>···</button></div><div className="focus-body"><span>01</span><div><label>设计</label><h3>完成个人工作台的第一版</h3><p>把核心信息、任务流和项目状态放在一个更从容的界面里。</p></div><button>↗</button></div><footer><span>● ●　与自己约定</span><span>预计 2 小时</span></footer></article>
        <article className="panel agenda"><div className="heading"><div><p className="eyebrow">UP NEXT</p><h2>日程</h2></div><button className="link">查看全部</button></div><div className="time">10:30</div><div className="event green"><b>专注设计时间</b><span>10:30 – 12:00</span></div><div className="time">14:00</div><div className="event peach"><b>项目同步会</b><span>线上 · 30 分钟</span></div></article>
        <article className="panel tasks"><div className="heading"><div><p className="eyebrow">MY TASKS</p><h2>待办事项 <small>{done}/{tasks.length}</small></h2></div><button className="link">全部任务</button></div><div className="task-list">{tasks.map((task) => <button className={task.done ? "task done" : "task"} key={task.id} onClick={() => setTasks((list) => list.map((x) => x.id === task.id ? { ...x, done: !x.done } : x))}><i className={task.tone}>{task.done ? "✓" : ""}</i><span><b>{task.title}</b><small>{task.time}</small></span><em>···</em></button>)}</div><button className="add-task" onClick={addTask}>＋ 添加任务</button></article>
        <article className="panel projects"><div className="heading"><div><p className="eyebrow">IN PROGRESS</p><h2>进行中的项目</h2></div><button>···</button></div><Project icon="▰" name="个人品牌网站" info="设计 · 本周截止" percent={82} color="coral"/><Project icon="⌁" name="灵感资料库" info="整理 · 进行中" percent={45} color="cyan"/></article>
      </div>
    </section>
  </main>;
}
function Project({icon,name,info,percent,color}:{icon:string;name:string;info:string;percent:number;color:string}) { return <div className="project"><div className={`project-icon ${color}`}>{icon}</div><div><b>{name}</b><small>{info}</small></div><strong>{percent}%</strong><p><i className={color} style={{width:`${percent}%`}}/></p></div> }

