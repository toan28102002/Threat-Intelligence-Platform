import { render, screen } from '@testing-library/react';
import ThreatDashboard from './ThreatDashboard';

test('renders learn react link', () => {
    render(<ThreatDashboard />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
