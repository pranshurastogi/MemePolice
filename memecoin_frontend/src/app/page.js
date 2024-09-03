import RiskChecker from "./components/RiskChecker";
import AttestationForm from "./components/AttestationForm"; // Import the AttestationForm component

export default function Home() {
  return (
    <main className="main-content">
      <div className="left-content">
        <RiskChecker />
      </div>
      <div className="right-content">
        {/* AttestationForm will be rendered here */}
        <AttestationForm />
      </div>
    </main>
  );
}
