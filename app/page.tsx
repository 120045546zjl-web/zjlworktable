import Workspace from "./Workspace";
const sections=["今日","收集箱","项目","日历","复盘","设置"] as const;
export default async function Home({searchParams}:{searchParams:Promise<{section?:string}>}){const {section}=await searchParams;return <Workspace initialActive={sections.includes(section as typeof sections[number])?section!:"今日"}/>}
