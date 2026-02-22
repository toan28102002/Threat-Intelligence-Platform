import React, { useEffect, useState } from "react";
import axios from "axios";
import Chart from "chart.js/auto";

const BACKEND = "http://localhost:5050";

type Threat = {
  name: string;
  vulnerability: string;
  risk_score: number;
};

type TVA = {
  threat: string;
  vulnerability: string;
  asset: string;
  asset_id: string;
  threat_name: string;
  vulnerability_description: string;
  likelihood: string;
  impact: string;
};

type Alert = {
  id: number;
  message: string;
  level: string;
  created_at: string;
};

export default function ThreatDashboard() {
  const [threats, setThreats] = useState<Threat[]>([]);
  const [selectedIP, setSelectedIP] = useState("");
  const [osint, setOsint] = useState<any>(null);
  const [tva, setTva] = useState<TVA[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [prioritization, setPrioritization] = useState<any>(null);

  useEffect(() => {
    axios
      .get(`${BACKEND}/api/threats`)
      .then((res) => {
        console.log("Threats data:", res.data);
        setThreats(res.data);
        if (res.data.length > 0) {
          setSelectedIP(res.data[0].name);
        }
      })
      .catch((err) => {
        console.error("Error fetching threats:", err);
        setThreats([]);
      });
  }, []);

  useEffect(() => {
    if (selectedIP) {
      axios
        .get(`${BACKEND}/api/threat-info/${selectedIP}`)
        .then((res) => {
          console.log("OSINT data:", res.data);
          setOsint(res.data);
        })
        .catch((err) => {
          console.error(`Error fetching OSINT for ${selectedIP}:`, err);
          setOsint(null);
        });
    }
  }, [selectedIP]);

  useEffect(() => {
    axios.get(`${BACKEND}/api/tva`).then((res) => setTva(res.data));
    axios.get(`${BACKEND}/api/alerts`).then((res) => setAlerts(res.data));
  }, []);

  useEffect(() => {
    const ctx = (
      document.getElementById("riskChart") as HTMLCanvasElement
    )?.getContext("2d");
    if (!ctx || threats.length === 0) return;
    const chart = new Chart(ctx, {
      type: "line",
      data: {
        labels: threats.map((_, i) => `Threat ${i + 1}`),
        datasets: [
          {
            label: "Risk Score Trend",
            data: threats.map((t) => t.risk_score),
            borderColor: "#ff4d4f",
            backgroundColor: "rgba(255,77,79,0.1)",
            tension: 0.4,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        scales: { y: { min: 0, max: 100 } },
      },
    });
    return () => chart.destroy();
  }, [threats]);

  const handleAnalyzeRisk = () => {
    axios
      .post(`${BACKEND}/api/analyze-risk`, { sample: true })
      .then((res) => setAnalysisResult(res.data));
  };

  const handlePrioritizeRisk = () => {
    axios
      .post(`${BACKEND}/api/prioritize-risks`, { sample: true })
      .then((res) => setPrioritization(res.data));
  };

  const handleTestAlert = () => {
    axios
      .post(`${BACKEND}/api/alert-threat`, {
        ip: "203.0.113.10",
        riskScore: 95,
        details: "Test alert triggered from frontend",
      })
      .then(() => alert("Test alert sent!"));
  };

  return (
    <div
      style={{
        padding: "2rem",
        fontFamily: "Arial, sans-serif",
        background: "#001f3f",
        minHeight: "100vh",
        color: "black",
      }}
    >
      <h1 style={{ color: "white", textAlign: "center" }}>
        🛡️ Threat Intelligence Dashboard
      </h1>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "2rem",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            flex: "1 1 45%",
            background: "#fff",
            borderRadius: 10,
            padding: 20,
            boxShadow: "0 0 10px rgba(0,0,0,0.3)",
          }}
        >
          <h2>🚨 Threat Overview</h2>
          {threats.length > 0 ? (
            <>
              <table style={{ width: "100%" }}>
                <thead>
                  <tr>
                    <th>IP</th>
                    <th>Vulnerability</th>
                    <th>Risk Score</th>
                  </tr>
                </thead>
                <tbody>
                  {threats.map((t, i) => (
                    <tr
                      key={i}
                      style={{
                        cursor: "pointer",
                        background:
                          t.name === selectedIP ? "#f0f0f0" : "transparent",
                      }}
                      onClick={() => setSelectedIP(t.name)}
                    >
                      <td>{t.name}</td>
                      <td>{t.vulnerability}</td>
                      <td>{t.risk_score}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <canvas id="riskChart" height="120"></canvas>
            </>
          ) : (
            <div
              style={{ textAlign: "center", padding: "2rem", color: "#666" }}
            >
              No threat data available. Try running fetch_osint.js to populate
              the database.
            </div>
          )}
        </div>

        <div
          style={{
            flex: "1 1 45%",
            background: "#f8f9fa",
            borderRadius: 10,
            padding: 20,
            boxShadow: "0 0 10px rgba(0,0,0,0.3)",
          }}
        >
          <h2>🔍 OSINT for {selectedIP || "No IP Selected"}</h2>
          {selectedIP ? (
            osint ? (
              <pre
                style={{
                  background: "#eee",
                  padding: "1rem",
                  borderRadius: 5,
                  overflow: "auto",
                  maxHeight: "300px",
                }}
              >
                {JSON.stringify(osint, null, 2)}
              </pre>
            ) : (
              <div
                style={{ textAlign: "center", padding: "2rem", color: "#666" }}
              >
                Loading OSINT data or no data available for this IP.
              </div>
            )
          ) : (
            <div
              style={{ textAlign: "center", padding: "2rem", color: "#666" }}
            >
              Select an IP from the Threat Overview to view OSINT data.
            </div>
          )}
        </div>

        <div
          style={{
            flex: "1 1 90%",
            background: "#fff3cd",
            borderRadius: 10,
            padding: 20,
            boxShadow: "0 0 10px rgba(0,0,0,0.3)",
          }}
        >
          <h2>📊 TVA Mapping</h2>
          <table style={{ width: "100%", fontSize: "0.9rem" }}>
            <thead>
              <tr>
                <th>Threat</th>
                <th>Vulnerability</th>
                <th>Asset</th>
                <th>Asset ID</th>
                <th>Threat Name</th>
                <th>Vulnerability Description</th>
                <th>Likelihood</th>
                <th>Impact</th>
              </tr>
            </thead>
            <tbody>
              {tva.map((item, i) => (
                <tr key={i}>
                  <td>{item.threat}</td>
                  <td>{item.vulnerability}</td>
                  <td>{item.asset}</td>
                  <td>{item.asset_id}</td>
                  <td>{item.threat_name}</td>
                  <td>{item.vulnerability_description}</td>
                  <td>{item.likelihood}</td>
                  <td>{item.impact}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div
          style={{
            flex: "1 1 90%",
            background: "#d4edda",
            borderRadius: 10,
            padding: 20,
            boxShadow: "0 0 10px rgba(0,0,0,0.3)",
          }}
        >
          <h2>📢 Alerts</h2>
          <ul>
            {alerts.map((a) => (
              <li key={a.id}>
                <strong>{a.level}</strong>: {a.message} <em>{a.created_at}</em>
              </li>
            ))}
          </ul>
        </div>

        <div
          style={{ flex: "1 1 100%", textAlign: "center", paddingTop: "1rem" }}
        >
          <h2 style={{ color: "white" }}>🧪 Security Analysis Actions</h2>
          <button onClick={handleAnalyzeRisk}>Run Analyze Risk</button>
          <button onClick={handlePrioritizeRisk} style={{ marginLeft: 10 }}>
            Prioritize Risks
          </button>
          <button onClick={handleTestAlert} style={{ marginLeft: 10 }}>
            Send Test Alert
          </button>

          {analysisResult && (
            <pre style={{ marginTop: 10, color: "white" }}>
              {JSON.stringify(analysisResult, null, 2)}
            </pre>
          )}
          {prioritization && (
            <pre style={{ marginTop: 10, color: "white" }}>
              {JSON.stringify(prioritization, null, 2)}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}
