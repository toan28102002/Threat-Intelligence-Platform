/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import Chart from 'chart.js/auto';

type Threat = {
    name: string;
    vulnerability: string;
    risk_score: number;
};

const ThreatDashboard: React.FC = () => {
    // State to store threats fetched from the API
    const [threats, setThreats] = useState<Threat[]>([]);
    
    // Fetch threats from the API
    useEffect(() => {
        const fetchThreats = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/threats');
                const data = await response.json();
                setThreats(data); // Update the state with fetched data
            } catch (error) {
                console.error('Error fetching threat data:', error);
            }
        };

        fetchThreats();
    }, []); // Run this effect only once when the component mounts

    // useEffect to render chart after data is fetched
    useEffect(() => {
        const ctx = (document.getElementById('riskChart') as HTMLCanvasElement).getContext('2d');
        if (ctx) {
            // Chart.js chart configuration
            const config = {
                type: 'line' as const,
                data: {
                    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                    datasets: [
                        {
                            label: 'Risk Score Trend',
                            data: threats.map(threat => threat.risk_score), // Use the real risk scores from the state
                            borderColor: 'red',
                            fill: false,
                        },
                    ],
                },
                options: {
                    responsive: true,
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Weeks',
                            },
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Risk Score',
                            },
                            min: 0,
                        },
                    },
                },
            };

            // Initialize chart with the config
            const riskChart = new Chart(ctx, config);

            // Cleanup chart on component unmount
            return () => {
                riskChart.destroy();
            };
        }
    }, [threats]); // Re-render chart when `threats` state changes
    
    return (
        <div className="ThreatDashboard">
            <header className="ThreatDashboard-header">
                <h1>Real-Time Threat Intelligence</h1>
                <p>Live Threat Updates will be displayed here.</p>
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
                <div>
                    {/* Canvas for Chart.js */}
                    <canvas id="riskChart"></canvas>
                </div>
                <p>
                    Edit <code>src/components/ThreatDashboard.tsx</code> and save to reload.
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
};

export default ThreatDashboard;
