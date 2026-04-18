import { AppShell } from "@/components/layout/app-shell"
import { ChatWorkspace } from "@/components/blocks/chat-workspace"

export default function Home() {
  return (
    <AppShell className="max-w-[1400px]">
      <ChatWorkspace />
    </AppShell>
  )
}
