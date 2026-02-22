/* eslint-disable react/jsx-no-comment-textnodes */
import logo from './logo.svg';
import './ThreatDashboard.css';
function ThreatDashboard() {
    const threats = ['DDos', 'SQL Injection', 'Brute Force']
    return (
    <div className="ThreatDashboard">
        <header className="ThreatDashboard-header">
            <h1>Real-Time Threat Intelligence</h1>
            <p>Live Threat Updates will be displayed here.</p>
            <img src={logo} className="ThreatDashboard-logo" alt="logo" />
            <h2>Threat Intelligence Overview</h2>
            <table>
                <thead>
                    <tr>
                        <th>Threat</th>
                        <th>Vulnerability</th>
                        <th>Risk Score</th>
                    </tr>
                </thead>
                <tbody>
                    {threats.map((threat, index) => (
                        <tr key={index}>
                            <td>{threat.name}</td>
                            <td>{threat.vulnerability}</td>
                            <td>{threat.risk_score}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <p>
                Edit <code>src/ThreatDashboard.js</code> and save to reload.
            </p>
            <a
                className="ThreatDashboard-link"
                href="https://reactjs.org"
                target="_blank"
                rel="noopener noreferrer"
            >
                Learn React
            </a>
        </header>
    </div>
    );
}
export default ThreatDashboard;

// hello world