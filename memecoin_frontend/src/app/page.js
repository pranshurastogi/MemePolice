import RiskChecker from "./components/RiskChecker";
import Header from "./components/Header"; // Import the Header component

export default function Home() {
  return (
    <div>
      <Header /> {/* Include the Header at the top */}
      <main className="main-content">
        <div className="left-content">
          <RiskChecker />
        </div>
        <div className="right-content">
          {/* <h2>Recent Searches</h2> */}
          {/* Future content like recent searches will go here */}
        </div>
      </main>
    </div>
  );
}
