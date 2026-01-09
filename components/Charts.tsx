
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend, LineChart, Line 
} from 'recharts';

const COLORS = ['#10b981', '#3b82f6', '#6366f1', '#8b5cf6', '#f43f5e', '#f59e0b'];

interface ChartProps {
  data: any[];
  title: string;
}

export const BOCWPieChart: React.FC<ChartProps> = ({ data, title }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-[400px]">
    <h3 className="text-slate-800 font-semibold mb-6">{title}</h3>
    <ResponsiveContainer width="100%" height="85%">
      <PieChart>
        <Pie
          data={data}
          dataKey="pending"
          nameKey="scheme"
          cx="50%"
          cy="50%"
          outerRadius={100}
          innerRadius={60}
          paddingAngle={5}
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend verticalAlign="bottom" height={36}/>
      </PieChart>
    </ResponsiveContainer>
  </div>
);

export const ComplianceBarChart: React.FC<ChartProps> = ({ data, title }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-[400px]">
    <h3 className="text-slate-800 font-semibold mb-6">{title}</h3>
    <ResponsiveContainer width="100%" height="85%">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
        <XAxis dataKey="category" axisLine={false} tickLine={false} />
        <YAxis axisLine={false} tickLine={false} />
        <Tooltip cursor={{fill: '#f8fafc'}} />
        <Bar dataKey="returnsCompliance" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Compliance %" />
      </BarChart>
    </ResponsiveContainer>
  </div>
);
