import React, { useEffect, useState } from "react";
import { api } from "../api";
import { connectInvestigationSocket } from "../websocket";

function App() {
  const [wallet, setWallet] = useState("");
  const [chain, setChain] = useState("ethereum");
  const [investigationId, setInvestigationId] = useState(null);

  const [status, setStatus] = useState("READY");
  const [result, setResult] = useState(null);
  const [alerts, setAlerts] = useState([]);

  const [loading, setLoading] = useState(false);
  const [monitoring, setMonitoring] = useState(false);
  const [error, setError] = useState("");

  async function startInvestigation(event) {
    event.preventDefault();

    setLoading(true);
    setError("");
    setResult(null);
    setAlerts([]);

    try {
      const data = await api.createInvestigation({
        source_wallet: wallet.trim(),
        chain: chain,
        max_hops: 5,
        minimum_value: 0,
        time_window_days: 30
      });

      const id = data.investigation_id || data.id;

      setInvestigationId(id);
      setStatus(data.status || "CREATED");

      if (id) {
        await loadInvestigation(id);
      }
    } catch (err) {
      setError(err.message);
      setStatus("FAILED");
    } finally {
      setLoading(false);
    }
  }

  async function loadInvestigation(id) {
    try {
      const data = await api.getInvestigation(id);

      setResult(data);

      if (data.investigation?.status) {
        setStatus(data.investigation.status);
      }
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    if (!investigationId) {
      return;
    }

    const socket = connectInvestigationSocket(
      investigationId,

      (message) => {
        console.log("WebSocket event:", message);

        if (message.status) {
          setStatus(message.status);
        }

        if (
          message.alert_id ||
          message.alert_type ||
          message.type === "alert"
        ) {
          setAlerts((previous) => [message, ...previous]);
        }

        if (message.type === "investigation_completed") {
          loadInvestigation(investigationId);
        }
      },

      (error) => {
        console.error("WebSocket error:", error);
      },

      () => {
        console.log("WebSocket connection closed");
      }
    );

    return () => {
      socket.close();
    };
  }, [investigationId]);

  async function toggleMonitoring() {
    if (!investigationId) {
      return;
    }

    try {
      if (monitoring) {
        await api.stopMonitoring(investigationId);
        setMonitoring(false);
      } else {
        await api.startMonitoring(investigationId);
        setMonitoring(true);
      }
    } catch (err) {
      setError(err.message);
    }
  }

  const riskScore =
    result?.risk_assessment?.risk_score ??
    result?.risk?.risk_score ??
    "--";

  const attribution =
    result?.attribution?.confidence ??
    result?.attribution?.attribution_confidence ??
    "--";

  return (
    <div className="app">
      <header className="header">
        <p className="eyebrow">BLOCKCHAIN FORENSICS PLATFORM</p>

        <h1>CryptoTrace Investigator</h1>

        <p>
          Trace cryptocurrency fund flows, analyze risk and preserve
          investigation evidence.
        </p>
      </header>

      <section className="card">
        <h2>New Investigation</h2>

        <form onSubmit={startInvestigation} className="form">
          <div>
            <label>Subject Wallet</label>

            <input
              type="text"
              placeholder="0x..."
              value={wallet}
              onChange={(event) => setWallet(event.target.value)}
              required
            />
          </div>

          <div>
            <label>Blockchain</label>

            <select
              value={chain}
              onChange={(event) => setChain(event.target.value)}
            >
              <option value="ethereum">Ethereum</option>
              <option value="polygon">Polygon</option>
              <option value="bsc">BNB Smart Chain</option>
            </select>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Starting..." : "Start Investigation"}
          </button>
        </form>

        {error && <div className="error">{error}</div>}
      </section>

      <div className="dashboard-grid">
        <section className="card">
          <h2>Investigation Status</h2>

          <div className="big-value">{status}</div>

          {investigationId && (
            <p className="small">
              Investigation ID: {investigationId}
            </p>
          )}
        </section>

        <section className="card">
          <h2>Risk Score</h2>

          <div className="big-value">{riskScore}</div>

          <p>
            {result?.risk_assessment?.risk_level || "Not available"}
          </p>
        </section>

        <section className="card">
          <h2>Attribution Confidence</h2>

          <div className="big-value">{attribution}</div>

          <p>
            {result?.attribution?.level || "Not available"}
          </p>
        </section>
      </div>

      <section className="card">
        <div className="section-heading">
          <h2>Real-Time Monitoring</h2>

          {investigationId && (
            <button onClick={toggleMonitoring}>
              {monitoring
                ? "Stop Monitoring"
                : "Activate Monitoring"}
            </button>
          )}
        </div>

        <p>
          Monitoring status:{" "}
          <strong>{monitoring ? "ACTIVE" : "INACTIVE"}</strong>
        </p>
      </section>

      <section className="card">
        <h2>Fund Flow</h2>

        <pre>
          {JSON.stringify(
            result?.fund_flow || result?.graph || {},
            null,
            2
          )}
        </pre>
      </section>

      <section className="card">
        <h2>Exchange Intelligence</h2>

        <pre>
          {JSON.stringify(
            result?.exchange_matches || [],
            null,
            2
          )}
        </pre>
      </section>

      <section className="card">
        <h2>Evidence</h2>

        <pre>
          {JSON.stringify(result?.evidence || [], null, 2)}
        </pre>
      </section>

      <section className="card">
        <h2>Real-Time Alerts</h2>

        {alerts.length === 0 ? (
          <p>No new alerts.</p>
        ) : (
          alerts.map((alert, index) => (
            <div
              className="alert"
              key={alert.alert_id || index}
            >
              <strong>
                {alert.alert_type || alert.type || "ALERT"}
              </strong>

              <p>
                {alert.transaction_hash ||
                  "Transaction information unavailable"}
              </p>
            </div>
          ))
        )}
      </section>
    </div>
  );
}

export default App;