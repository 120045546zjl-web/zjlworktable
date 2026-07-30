import Workspace from "./Workspace";

const sections = ["\u603b\u89c8", "\u6211\u7684\u4efb\u52a1", "\u9879\u76ee", "\u65e5\u5386", "\u7b14\u8bb0", "\u8bbe\u7f6e"] as const;

export default async function Home({ searchParams }: { searchParams: Promise<{ section?: string }> }) {
  const { section } = await searchParams;
  const initialActive = sections.includes(section as (typeof sections)[number]) ? section! : "\u603b\u89c8";
  return <Workspace initialActive={initialActive} />;
}
