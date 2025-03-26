import { Progress } from "~/components/ui/progress";

type Props = {
    isPro: boolean,
    chatCount: number
}

export default function ProgressSection({isPro, chatCount}: Props) {

    const maxChats = isPro ? 20 : 7
    const progressValue = Math.min((chatCount / maxChats) * 100, 100)

  return <div className="flex flex-col items-center gap-2 border py-2 px-3 rounded-lg bg-secondary dark:bg-white/10">
        <p className="text-2xl font-semibold"><span className="uppercase text-lg">Chats created: </span>{chatCount} / {maxChats} </p>
        <Progress value={progressValue} className="dark:bg-white/10 h-2.5"/>
  </div>
}