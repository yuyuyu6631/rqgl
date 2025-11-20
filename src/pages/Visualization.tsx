import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { chartData } from "@/data/mockData";

const COLORS = {
  primary: "hsl(var(--primary))",
  success: "hsl(var(--success))",
  warning: "hsl(var(--warning))",
  accent: "hsl(var(--accent))",
  secondary: "hsl(var(--secondary))",
  destructive: "hsl(var(--destructive))",
};

export default function Visualization() {
  const [selectedPieData, setSelectedPieData] = useState<{ name: string; value: number } | null>(null);

  const lpgUserData = chartData.lpgUserType.labels.map((label, index) => ({
    name: label,
    value: chartData.lpgUserType.values[index],
  }));

  const dangerLevelData = chartData.dangerLevel.labels.map((label, index) => ({
    name: label,
    value: chartData.dangerLevel.values[index],
  }));

  const annualRectifyData = chartData.annualRectify.months.map((month, index) => ({
    month,
    数量: chartData.annualRectify.numbers[index],
  }));

  const handlePieClick = (data: any) => {
    setSelectedPieData(data);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">数据可视化</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 液化气用户类型分布 */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-lg">液化气用户类型分布</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={lpgUserData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  onClick={handlePieClick}
                  style={{ cursor: "pointer" }}
                >
                  {lpgUserData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={[COLORS.primary, COLORS.success, COLORS.accent][index % 3]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* 隐患等级分布 */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-lg">隐患等级分布</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={dangerLevelData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  onClick={handlePieClick}
                  style={{ cursor: "pointer" }}
                >
                  {dangerLevelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={[COLORS.success, COLORS.destructive][index % 2]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* 年度隐患治理数量 */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-lg">年度隐患治理数量统计</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={annualRectifyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="数量" fill={COLORS.primary} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 饼图点击详情弹窗 */}
      <Dialog open={selectedPieData !== null} onOpenChange={() => setSelectedPieData(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>详细信息</DialogTitle>
          </DialogHeader>
          {selectedPieData && (
            <div className="space-y-2">
              <p>
                <span className="font-semibold">类型：</span>
                {selectedPieData.name}
              </p>
              <p>
                <span className="font-semibold">数量：</span>
                {selectedPieData.value}
              </p>
              <p>
                <span className="font-semibold">占比：</span>
                {((selectedPieData.value / (lpgUserData.reduce((acc, curr) => acc + curr.value, 0) || dangerLevelData.reduce((acc, curr) => acc + curr.value, 0))) * 100).toFixed(2)}%
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
