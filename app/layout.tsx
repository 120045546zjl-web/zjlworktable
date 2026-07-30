import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata={title:"行动工作台",description:"今日行动优先的个人任务管理工作台"};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="zh-CN"><body>{children}</body></html>}
