import RiskChecker from "./components/RiskChecker";

export default function Home() {
  return (
    <main className="main-content flex justify-between min-h-screen p-10">
      <div className="flex-1 pr-5">
        <RiskChecker />
      </div>
      <div className="w-1/3">
        {/* Recent Searches will be rendered within RiskChecker */}
      </div>
    </main>
  );
}
