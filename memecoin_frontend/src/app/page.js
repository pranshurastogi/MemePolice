import RiskChecker from "./components/RiskChecker";

export default function Home() {
  return (
    <main className="main-content">
      <div className="left-content">
        <RiskChecker />
      </div>
      <div className="right-content">
        {/* Your recent searches or other content will go here */}
      </div>
    </main>
  );
}
