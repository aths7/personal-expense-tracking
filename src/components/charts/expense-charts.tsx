'use client';

import { useMemo } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  Legend,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/currency';
import type { DashboardStats } from '@/types';

interface ExpenseChartsProps {
  stats: DashboardStats;
}

// Dark Moonlight color palette for better contrast
const DARK_MOONLIGHT_COLORS = ['#292966', '#5c5c99', '#4a4a88', '#3d3d77', '#6666b3', '#474788', '#333366', '#555599'];

export function ExpenseCharts({ stats }: ExpenseChartsProps) {
  const pieData = useMemo(() => {
    return stats.categoryBreakdown.slice(0, 5).map((item, index) => ({
      name: item.category,
      value: item.amount,
      color: DARK_MOONLIGHT_COLORS[index % DARK_MOONLIGHT_COLORS.length],
    }));
  }, [stats.categoryBreakdown]);

  const monthlyTrendData = useMemo(() => {
    return stats.monthlyTrend.map((item) => ({
      month: item.month,
      amount: item.amount,
    }));
  }, [stats.monthlyTrend]);

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-morphism dark:glass-morphism-dark border border-border/30 rounded-lg shadow-elegant p-3 backdrop-blur-xl">
          <p className="font-medium text-foreground">{label}</p>
          <p className="text-primary font-semibold">
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  const PieTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number }> }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="glass-morphism dark:glass-morphism-dark border border-border/30 rounded-lg shadow-elegant p-3 backdrop-blur-xl">
          <p className="font-medium text-foreground">{data.name}</p>
          <p className="text-primary font-semibold">
            {formatCurrency(data.value)}
          </p>
        </div>
      );
    }
    return null;
  };

  if (stats.totalExpenses === 0) {
    return (
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="glass-morphism dark:glass-morphism-dark border border-border/30 shadow-elegant">
          <CardHeader>
            <CardTitle className="text-foreground">Category Distribution</CardTitle>
            <CardDescription>Expenses by category</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-64">
            <div className="text-center text-muted-foreground">
              <p>No data to display</p>
              <p className="text-sm">Add some expenses to see charts</p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-morphism dark:glass-morphism-dark border border-border/30 shadow-elegant">
          <CardHeader>
            <CardTitle className="text-foreground">Monthly Trend</CardTitle>
            <CardDescription>Spending over time</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-64">
            <div className="text-center text-muted-foreground">
              <p>No data to display</p>
              <p className="text-sm">Add some expenses to see trends</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Category Distribution Pie Chart */}
      <Card className="glass-morphism dark:glass-morphism-dark border border-border/30 shadow-elegant">
        <CardHeader>
          <CardTitle className="text-foreground">Category Distribution</CardTitle>
          <CardDescription>Expenses by category</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="45%"
                labelLine={false}
                outerRadius={80}
                innerRadius={40}
                fill="#292966"
                dataKey="value"
              >
                {pieData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<PieTooltip />} />
              <Legend 
                verticalAlign="bottom" 
                height={60}
                wrapperStyle={{ 
                  paddingTop: '20px',
                  fontSize: '12px',
                  color: '#292966',
                  fontWeight: '500'
                }}
                formatter={(value) => `${value}`}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Monthly Trend Line Chart */}
      <Card className="glass-morphism dark:glass-morphism-dark border border-border/30 shadow-elegant">
        <CardHeader>
          <CardTitle className="text-foreground">Monthly Trend</CardTitle>
          <CardDescription>Spending over the last 6 months</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
              <XAxis 
                dataKey="month" 
                stroke="currentColor" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="currentColor" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `₹${value}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#5c5c99"
                strokeWidth={3}
                dot={{ fill: '#ccccff', strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8, fill: '#292966', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

interface CategoryBarChartProps {
  categoryBreakdown: Array<{
    category: string;
    amount: number;
    color: string;
  }>;
}

export function CategoryBarChart({ categoryBreakdown }: CategoryBarChartProps) {
  const chartData = useMemo(() => {
    return categoryBreakdown.slice(0, 8).map((item, index) => ({
      name: item.category.length > 12 ? item.category.substring(0, 12) + '...' : item.category,
      amount: item.amount,
      fullName: item.category,
      color: DARK_MOONLIGHT_COLORS[index % DARK_MOONLIGHT_COLORS.length],
    }));
  }, [categoryBreakdown]);

  if (categoryBreakdown.length === 0) {
    return (
      <Card className="glass-morphism dark:glass-morphism-dark border border-border/30 shadow-elegant">
        <CardHeader>
          <CardTitle className="text-foreground">Top Categories</CardTitle>
          <CardDescription>Your highest spending categories</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center text-muted-foreground">
            <p>No data to display</p>
            <p className="text-sm">Add some expenses to see categories</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const CustomBarTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: { fullName: string; amount: number } }> }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="glass-morphism dark:glass-morphism-dark border border-border/30 rounded-lg shadow-elegant p-3 backdrop-blur-xl">
          <p className="font-medium text-foreground">{data.fullName}</p>
          <p className="text-primary font-semibold">
            {formatCurrency(data.amount)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="glass-morphism dark:glass-morphism-dark border border-border/30 shadow-elegant">
      <CardHeader>
        <CardTitle className="text-foreground">Top Categories</CardTitle>
        <CardDescription>Your highest spending categories</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12, fill: 'currentColor' }}
              interval={0}
              angle={-45}
              textAnchor="end"
              height={60}
              stroke="currentColor"
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              tick={{ fontSize: 12, fill: 'currentColor' }}
              stroke="currentColor"
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `₹${value}`}
            />
            <Tooltip content={<CustomBarTooltip />} />
            <Bar dataKey="amount" fill="#292966" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}