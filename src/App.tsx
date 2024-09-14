import GameOfLife from "./components/GameOfLife"

const App = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-[lightgreen] to-[teal]">
      <div className="container flex flex-col items-center justify-center gap-3 p-4">
        <h1 className="text-2xl font-bold text-white">
          Conway&apos;s Game of Life
        </h1>
        <GameOfLife />
      </div>
    </main>
  )
}

export default App