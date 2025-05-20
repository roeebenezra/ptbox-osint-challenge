import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [domain, setDomain] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [scans, setScans] = useState([]);
  const [selectedScan, setSelectedScan] = useState(null);
  const [scanStatus, setScanStatus] = useState(null); // 'running' | 'done' | null
  const [activeDomain, setActiveDomain] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (error) {
      const timeout = setTimeout(() => setError(null), 5000); // 5 seconds
      return () => clearTimeout(timeout); // cleanup
    }
  }, [error]);


  // Fetch scan history
  const fetchScans = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/scans");
      setScans(res.data);
    } catch (err) {
      console.error("Failed to fetch scans:", err);
      setError("⚠️ Could not load scan history.");
    }
  };

  useEffect(() => {
    fetchScans();
  }, []);


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!domain) return;

    try {
      setLoading(true);
      setScanStatus("running");
      setActiveDomain(domain);

      const res = await axios.post("http://localhost:8000/api/scan", { domain });
      setResponse(res.data);
      fetchScans();
      setScanStatus("done");
    } catch (error) {
      console.error("Scan failed:", error);
      setResponse(null);
      setError("🚫 Failed to start scan. Please check your domain or try again.");
      setScanStatus("error");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (id) => {
    try {
      const res = await axios.get(`http://localhost:8000/api/scan/${id}`);
      setSelectedScan(res.data);
    } catch (err) {
      console.error("Failed to fetch scan details:", err);
      setSelectedScan(null);
      setError("❌ Could not load scan details.");
    }
  };


  return (
    <div style={{
      padding: "1rem",
      maxWidth: "600px",
      margin: "0 auto",
      fontFamily: "sans-serif"
    }}>
      <h1>PTBOX OSINT Scanner</h1>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
        <input
          type="text"
          placeholder="Enter domain (e.g. example.com)"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          style={{ flex: "1 1 200px", minWidth: "0", padding: "0.5rem" }}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Scanning..." : "Start Scan"}
        </button>
      </form>


      {scanStatus === "running" && (
        <p style={{ color: "yellow", marginTop: "1rem" }}>
          Scanning <strong>{activeDomain}</strong>... please wait.
        </p>
      )}

      {scanStatus === "done" && (
        <p style={{ color: "green", marginTop: "1rem" }}>
          ✅ Scan complete for <strong>{activeDomain}</strong>
        </p>
      )}

      {scanStatus === "error" && (
        <p style={{ color: "red", marginTop: "1rem" }}>
          ❌ Scan failed for <strong>{activeDomain}</strong>
        </p>
      )}

      {error && (
        <div style={{ color: "red", marginTop: "1rem" }}>
          {error}
        </div>
      )}

      {response && (
        <div style={{ marginTop: "2rem" }}>
          <h2>Latest Scan Result</h2>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}

      <div style={{ marginTop: "3rem" }}>
        <h2>Scan History</h2>
        {scans.length === 0 ? (
          <p>No scans yet.</p>
        ) : (
          <ul>
            {scans.map((scan) => (
              <li key={scan.id} style={{ marginBottom: "0.5rem" }}>
                <strong>{scan.domain}</strong> – {new Date(scan.started_at).toLocaleString()}
                <button
                  style={{ marginLeft: "1rem" }}
                  onClick={() => handleViewDetails(scan.id)}
                >
                  View
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      {selectedScan && (
        <div style={{ marginTop: "2rem" }}>
          <h2>Scan #{selectedScan.id}: {selectedScan.domain}</h2>
          <a
            href={`http://localhost:8000/api/scan/${selectedScan.id}/export`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              marginTop: "1rem",
              padding: "0.5rem 1rem",
              background: "#4CAF50",
              color: "white",
              textDecoration: "none",
              borderRadius: "4px"
            }}
          >
            Download Excel
          </a>

          <p><strong>Started:</strong> {new Date(selectedScan.started_at).toLocaleString()}</p>
          <p><strong>Subdomains:</strong> {selectedScan.summary?.subdomain_count}</p>
          <p><strong>Emails:</strong> {selectedScan.summary?.email_count}</p>

          <h3>Subdomains</h3>
          <ul>
            {selectedScan.artifacts?.subdomains.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>

          {selectedScan.artifacts?.emails?.length > 0 && (
            <>
              <h3>Emails</h3>
              <ul>
                {selectedScan.artifacts.emails.map((e, i) => (
                  <li key={i}>{e}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
