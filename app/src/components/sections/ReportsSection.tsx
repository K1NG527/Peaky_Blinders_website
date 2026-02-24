import { useEffect, useState } from 'react';
import { 
  Download, 
  FileText, 
  TrendingUp, 
  AlertTriangle,
  Calendar,
  Filter
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import type { WhiskeyItem } from '@/types';

interface ReportsSectionProps {
  inventory: WhiskeyItem[];
}

const monthlyData = [
  { month: 'Jan', sales: 4500, purchases: 6200 },
  { month: 'Feb', sales: 5200, purchases: 4800 },
  { month: 'Mar', sales: 4800, purchases: 5500 },
  { month: 'Apr', sales: 6100, purchases: 4200 },
  { month: 'May', sales: 5500, purchases: 3800 },
  { month: 'Jun', sales: 6700, purchases: 5100 },
];

const territoryData = [
  { name: 'Small Heath', value: 35, color: '#c9a86c' },
  { name: 'Birmingham Central', value: 25, color: '#a0804a' },
  { name: 'London Camden', value: 20, color: '#b87333' },
  { name: 'London Docks', value: 15, color: '#666666' },
  { name: 'Other', value: 5, color: '#404040' },
];

const reportTypes = [
  { id: 'inventory', name: 'Inventory Report', description: 'Complete stock overview', icon: FileText },
  { id: 'sales', name: 'Sales Analysis', description: 'Revenue and trends', icon: TrendingUp },
  { id: 'territory', name: 'Territory Report', description: 'Location breakdown', icon: Filter },
  { id: 'alerts', name: 'Alert Summary', description: 'Low stock and issues', icon: AlertTriangle },
];

export function ReportsSection({ inventory }: ReportsSectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedReport, setSelectedReport] = useState('inventory');
  const [dateRange, setDateRange] = useState('30d');

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const lowStockItems = inventory.filter(item => item.status === 'low' || item.status === 'out');
  const inStockItems = inventory.filter(item => item.status === 'in-stock');

  const inventoryByLocation = inventory.reduce((acc, item) => {
    acc[item.location] = (acc[item.location] || 0) + item.quantity;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.6s ease-out'
        }}
      >
        <div>
          <h2 className="font-cinzel text-2xl text-paper tracking-[0.15em] uppercase">
            Reports
          </h2>
          <p className="text-paper/60 text-sm mt-2">
            Business intelligence and analytics
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="ledger-input text-sm"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last Quarter</option>
            <option value="1y">Last Year</option>
          </select>
          <button className="btn-brass flex items-center gap-2">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Report Type Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {reportTypes.map((report, index) => {
          const Icon = report.icon;
          const isSelected = selectedReport === report.id;
          return (
            <button
              key={report.id}
              onClick={() => setSelectedReport(report.id)}
              className={`
                ledger-card text-left transition-all duration-300
                ${isSelected ? 'border-brass bg-brass/5' : 'hover:border-paper/20'}
              `}
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                transition: `all 0.4s ease-out ${0.1 * (index + 1)}s`
              }}
            >
              <Icon className={`w-5 h-5 mb-3 ${isSelected ? 'text-brass' : 'text-paper/60'}`} />
              <p className={`font-cinzel text-sm ${isSelected ? 'text-brass' : 'text-paper'}`}>
                {report.name}
              </p>
              <p className="text-paper/40 text-xs mt-1">{report.description}</p>
            </button>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales vs Purchases Chart */}
        <div
          className="ledger-card"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.6s ease-out 0.3s'
          }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-cinzel text-sm text-paper tracking-[0.15em] uppercase">
              Sales vs Purchases
            </h3>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-brass" />
                Sales
              </span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-paper/40" />
                Purchases
              </span>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2d2d2d" />
                <XAxis 
                  dataKey="month" 
                  stroke="#666" 
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis 
                  stroke="#666" 
                  fontSize={12}
                  tickLine={false}
                  tickFormatter={(value) => `£${value / 1000}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a1a1a',
                    border: '1px solid #404040',
                    borderRadius: 0,
                  }}
                  labelStyle={{ color: '#c9a86c', fontFamily: 'Cinzel' }}
                  itemStyle={{ color: '#e5e5e5' }}
                  formatter={(value: number) => [`£${value.toLocaleString()}`, '']}
                />
                <Bar dataKey="sales" fill="#c9a86c" />
                <Bar dataKey="purchases" fill="#666666" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Territory Distribution */}
        <div
          className="ledger-card"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.6s ease-out 0.4s'
          }}
        >
          <h3 className="font-cinzel text-sm text-paper tracking-[0.15em] uppercase mb-6">
            Inventory by Territory
          </h3>
          <div className="h-64 flex items-center">
            <ResponsiveContainer width="60%" height="100%">
              <PieChart>
                <Pie
                  data={territoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  dataKey="value"
                >
                  {territoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a1a1a',
                    border: '1px solid #404040',
                    borderRadius: 0,
                  }}
                  itemStyle={{ color: '#e5e5e5' }}
                  formatter={(value: number) => [`${value}%`, '']}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2">
              {territoryData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-xs text-paper/80">{item.name}</span>
                  <span className="text-xs text-paper/40 ml-auto">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.6s ease-out 0.5s'
        }}
      >
        {[
          { 
            label: 'Total Items', 
            value: inventory.length,
            subtext: `${inStockItems.length} in stock`,
            icon: FileText,
            color: 'brass'
          },
          { 
            label: 'Low Stock Alerts', 
            value: lowStockItems.length,
            subtext: 'Requires attention',
            icon: AlertTriangle,
            color: 'crimson'
          },
          { 
            label: 'Monthly Growth', 
            value: '+12.5%',
            subtext: 'vs last month',
            icon: TrendingUp,
            color: 'green'
          },
          { 
            label: 'Avg Turnover', 
            value: '18 days',
            subtext: 'Per item',
            icon: Calendar,
            color: 'paper'
          },
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="ledger-card"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'scale(1)' : 'scale(0.95)',
                transition: `all 0.4s ease-out ${0.6 + index * 0.1}s`
              }}
            >
              <Icon className={`w-5 h-5 mb-3 ${
                stat.color === 'brass' ? 'text-brass' :
                stat.color === 'crimson' ? 'text-crimson' :
                stat.color === 'green' ? 'text-green-400' :
                'text-paper'
              }`} />
              <p className="text-paper/60 text-xs uppercase tracking-wider">{stat.label}</p>
              <p className="font-cinzel text-xl text-paper mt-1">{stat.value}</p>
              <p className="text-paper/40 text-xs mt-1">{stat.subtext}</p>
            </div>
          );
        })}
      </div>

      {/* Location Breakdown Table */}
      <div
        className="ledger-card"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.6s ease-out 0.7s'
        }}
      >
        <h3 className="font-cinzel text-sm text-paper tracking-[0.15em] uppercase mb-6">
          Location Breakdown
        </h3>
        <div className="overflow-x-auto">
          <table className="ledger-table">
            <thead>
              <tr>
                <th>Location</th>
                <th>Total Bottles</th>
                <th>Items</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(inventoryByLocation)
                .sort(([,a], [,b]) => b - a)
                .map(([location, quantity]) => {
                  const itemsAtLocation = inventory.filter(item => item.location === location).length;
                  const hasLowStock = inventory.some(item => 
                    item.location === location && (item.status === 'low' || item.status === 'out')
                  );
                  return (
                    <tr key={location}>
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-brass" />
                          <span className="text-paper">{location}</span>
                        </div>
                      </td>
                      <td className="font-cinzel">{quantity}</td>
                      <td>{itemsAtLocation}</td>
                      <td>
                        <span className={`px-2 py-1 text-xs font-cinzel tracking-wider ${
                          hasLowStock ? 'status-low' : 'status-in-stock'
                        }`}>
                          {hasLowStock ? 'Attention Needed' : 'Optimal'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
