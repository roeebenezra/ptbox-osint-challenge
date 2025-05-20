import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "/api";

function App() {
  const [domain, setDomain] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [scans, setScans] = useState([]);
  const [selectedScan, setSelectedScan] = useState(null);
  const [scanStatus, setScanStatus] = useState(null); // 'running' | 'done' | null
  const [activeDomain, setActiveDomain] = useState(null);
  const [error, setError] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);


  // Clear error message after 5 seconds
  useEffect(() => {
    if (error) {
      const timeout = setTimeout(() => setError(null), 5000); // 5 seconds
      return () => clearTimeout(timeout); // cleanup
    }
  }, [error]);


  // Fetch scan history
  const fetchScans = async () => {
    try {
      setHistoryLoading(true);
      const res = await axios.get(`${API_BASE}/scans`);
      setScans(res.data);
    } catch (err) {
      console.error("Failed to fetch scans:", err);
      setError("⚠️ Could not load scan history.");
    } finally {
      setHistoryLoading(false);
    }
  };


  // Fetch scan history on component mount
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

      const res = await axios.post(`${API_BASE}/scan`, { domain });
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
      setDetailsLoading(true);
      const res = await axios.get(`${API_BASE}/scan/${id}`);
      setSelectedScan(res.data);
    } catch (err) {
      console.error("Failed to fetch scan details:", err);
      setSelectedScan(null);
      setError("❌ Could not load scan details.");
    } finally {
      setDetailsLoading(false);
    }
  };


  return (
    <div style={{
      backgroundColor: "#333",   // dark background
      color: "#ffffff",
      minHeight: "100vh",
      width: "100vw",
      boxSizing: "border-box",
      padding: "2rem",
      display: "flex",
      justifyContent: "center",
      alignItems: "flex-start"
    }}>
      <div style={{ width: "100%", maxWidth: "800px" }}>
        <h1>PTBOX OSINT Scanner</h1>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          <input
            type="text"
            placeholder="Enter domain (e.g. example.com)"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            style={{ flex: "1 1 200px", minWidth: "0", padding: "0.5rem", border: "1px solid #555", borderRadius: "4px", backgroundColor: "#1e1e1e", color: "#ffffff", }}
          />
          <button type="submit" disabled={loading}>
            {loading ? "Scanning..." : "Start Scan"}
          </button>
        </form>


        {scanStatus === "running" && (
          <p style={{ color: "#dcefb0", marginTop: "1rem" }}>
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

        <div style={{ marginTop: "2rem" }}>
          <h2>Scan History</h2>

          {historyLoading ? (
            <p style={{ color: "#00BFF" }}>Loading scan history...</p>
          ) : scans.length === 0 ? (
            <p>No scans yet.</p>
          ) : (
            <ul>
              {scans.map((scan) => (
                <li
                  key={scan.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "0.5rem",
                    gap: "1rem"
                  }}
                >
                  <div>
                    <strong>{scan.domain}</strong> – {new Date(scan.started_at).toLocaleString()}
                  </div>
                  <button style={{
                    flexShrink: 0,
                    minWidth: "70px",
                    textAlign: "center"
                  }}
                    onClick={() => handleViewDetails(scan.id)}
                  > View
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {detailsLoading && (
          <p style={{ marginTop: "1rem", color: "#00BFF" }}>
            Loading scan details...
          </p>
        )}

        {!detailsLoading && selectedScan && (
          <div style={{ marginTop: "2rem", minHeight: "400px" }}>
            <h2>Scan #{selectedScan.id}: {selectedScan.domain}</h2>
            <a
              href={`${API_BASE}/scan/${selectedScan.id}/export`}
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
    </div>
  );
}

export default App;
