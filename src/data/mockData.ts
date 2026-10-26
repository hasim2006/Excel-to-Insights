export const revenueData = [
  { name: 'Jan', revenue: 0.45, target: 0.50 },
  { name: 'Feb', revenue: 0.55, target: 0.60 },
  { name: 'Mar', revenue: 0.70, target: 0.65 },
  { name: 'Apr', revenue: 0.65, target: 0.70 },
  { name: 'May', revenue: 0.85, target: 0.75 },
  { name: 'Jun', revenue: 0.95, target: 0.80 },
  { name: 'Jul', revenue: 1.05, target: 0.85 },
  { name: 'Aug', revenue: 1.15, target: 0.90 },
  { name: 'Sep', revenue: 1.25, target: 0.95 },
  { name: 'Oct', revenue: 1.10, target: 1.00 },
  { name: 'Nov', revenue: 1.20, target: 1.10 },
  { name: 'Dec', revenue: 1.32, target: 1.20 },
];

export const regionData = [
  { name: 'North America', value: 45 },
  { name: 'Europe', value: 30 },
  { name: 'Asia Pacific', value: 15 },
  { name: 'Latin America', value: 7 },
  { name: 'Middle East', value: 3 },
];

export const forecastData = [
  { name: 'Q1', actual: 1.70, forecast: 1.70, upper: 1.70, lower: 1.70 },
  { name: 'Q2', actual: 2.45, forecast: 2.45, upper: 2.45, lower: 2.45 },
  { name: 'Q3', actual: 3.45, forecast: 3.45, upper: 3.45, lower: 3.45 },
  { name: 'Q4', actual: 3.62, forecast: 3.62, upper: 3.62, lower: 3.62 },
  { name: 'Q1 Next', actual: null, forecast: 4.10, upper: 4.50, lower: 3.80 },
  { name: 'Q2 Next', actual: null, forecast: 4.80, upper: 5.20, lower: 4.20 },
];

export const kpiData = [
  { label: 'Revenue', value: '11.22 Lakhs', trend: 28.4, color: 'text-accent-emerald' },
  { label: 'Profit', value: '2.45 Lakhs', trend: 15.2, color: 'text-accent-blue' },
  { label: 'Orders', value: '1,420', trend: 12.5, color: 'text-accent-purple' },
  { label: 'Customers', value: '384', trend: 8.4, color: 'text-accent-cyan' },
  { label: 'Inventory', value: '4.2 Lakhs', trend: -2.1, color: 'text-accent-orange' },
  { label: 'Forecast Acc.', value: '97.3%', trend: 1.2, color: 'text-accent-pink' },
];

export const recentActivity = [
  { id: 1, action: 'Anomaly Detected', details: 'Unusual spike in APAC region sales (+45%)', time: '2m ago', type: 'alert' },
  { id: 2, action: 'Report Generated', details: 'Q3 Executive Summary compiled by AI', time: '15m ago', type: 'info' },
  { id: 3, action: 'Data Synced', details: 'Snowflake Warehouse (1.2M rows)', time: '1h ago', type: 'success' },
  { id: 4, action: 'Forecast Updated', details: 'Predictive model adjusted for Q4', time: '2h ago', type: 'info' },
  { id: 5, action: 'New Insight', details: 'Supply chain bottleneck predicted in 14 days', time: '3h ago', type: 'warning' },
];

export const dataSources = [
  { name: 'Snowflake', type: 'Warehouse', status: 'Connected', health: 100, lastSync: '1m ago', size: '4.2 TB', icon: 'Database' },
  { name: 'PostgreSQL', type: 'Database', status: 'Connected', health: 98, lastSync: '5m ago', size: '850 GB', icon: 'Server' },
  { name: 'Salesforce', type: 'CRM', status: 'Connected', health: 100, lastSync: '10m ago', size: '120 GB', icon: 'Cloud' },
  { name: 'SAP ERP', type: 'Enterprise', status: 'Connected', health: 95, lastSync: '15m ago', size: '2.1 TB', icon: 'Briefcase' },
  { name: 'Google Analytics', type: 'API', status: 'Connected', health: 100, lastSync: '1h ago', size: '45 GB', icon: 'BarChart' },
  { name: 'Excel Imports', type: 'File', status: 'Idle', health: 100, lastSync: '1d ago', size: '1.2 GB', icon: 'FileSpreadsheet' },
];
