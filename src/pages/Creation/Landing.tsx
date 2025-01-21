import { Tabs } from "../Creation"

export default function Landing({ forward }: { 
  forward: (tab: Tabs) => void
}) {
  return (
    <main className="flex flex-col justify-between min-h-screen px-8 py-6">
      <img src="/favicon.png" className="rounded-full"/>
      <h1 className="text-4xl font-extrabold tracking-tight text-center">
        Welcome to Kaspian Wallet!
      </h1>
      <div className="flex flex-col gap-1">
        <button className="btn btn-primary" onClick={() => forward(Tabs.Password)}>Create new wallet</button>
        <button className="btn btn-ghost" onClick={() => forward(Tabs.Import)}>I already have a wallet</button>
      </div>
    </main>
  )
}