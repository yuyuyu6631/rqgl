import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { statCardData, sevenDayCheckData, initialHiddenDangers, HiddenDanger } from "@/data/mockData";
import { Building2, Users, UserCheck, TrendingUp } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function Dashboard() {
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const [enlargedChart, setEnlargedChart] = useState<"lpg" | "ng" | null>(null);
  
  const filteredDangers = selectedLevel === "all" 
    ? initialHiddenDangers 
    : initialHiddenDangers.filter(d => d.level === selectedLevel);

  const chartData = sevenDayCheckData.dates.map((date, index) => ({
    date,
    液化气: sevenDayCheckData.lpg[index],
    天然气: sevenDayCheckData.ng[index],
  }));

  const statusColorMap = {
    "未整改": "destructive",
    "整改中": "warning",
    "已整改": "success",
  } as const;

  const levelColorMap = {
    "一般隐患": "default",
    "重大隐患": "destructive",
  } as const;

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-foreground">数据汇总</h2>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 液化气统计 */}
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              液化气统计
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">企业数量：</span>
              <span className="font-semibold">{statCardData.lpg.enterprise} 家</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">充装站：</span>
              <span className="font-semibold">{statCardData.lpg.station} 个</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">从业人员：</span>
              <span className="font-semibold">{statCardData.lpg.staff} 人</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">配送人员：</span>
              <span className="font-semibold">{statCardData.lpg.deliveryStaff} 人</span>
            </div>
          </CardContent>
        </Card>

        {/* 天然气统计 */}
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-success" />
              天然气统计
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">企业数量：</span>
              <span className="font-semibold">{statCardData.ng.enterprise} 家</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">管网站：</span>
              <span className="font-semibold">{statCardData.ng.station} 个</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">从业人员：</span>
              <span className="font-semibold">{statCardData.ng.staff} 人</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">维修人员：</span>
              <span className="font-semibold">{statCardData.ng.repairStaff} 人</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 折线图 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-md cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setEnlargedChart("lpg")}>
          <CardHeader>
            <CardTitle className="text-lg">近7日液化气安检数据</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="液化气" stroke="hsl(var(--primary))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-md cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setEnlargedChart("ng")}>
          <CardHeader>
            <CardTitle className="text-lg">近7日天然气安检数据</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="天然气" stroke="hsl(var(--success))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* 隐患统计表格 */}
      <Card className="shadow-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">隐患统计</CardTitle>
            <Select value={selectedLevel} onValueChange={setSelectedLevel}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="筛选等级" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部隐患</SelectItem>
                <SelectItem value="一般隐患">一般隐患</SelectItem>
                <SelectItem value="重大隐患">重大隐患</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>隐患名称</TableHead>
                <TableHead>隐患等级</TableHead>
                <TableHead>所属企业</TableHead>
                <TableHead>发现时间</TableHead>
                <TableHead>整改状态</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDangers.map((danger) => (
                <TableRow key={danger.id}>
                  <TableCell className="font-medium">{danger.name}</TableCell>
                  <TableCell>
                    <Badge variant={levelColorMap[danger.level]}>{danger.level}</Badge>
                  </TableCell>
                  <TableCell>{danger.enterprise}</TableCell>
                  <TableCell>{danger.discoverTime}</TableCell>
                  <TableCell>
                    <Badge variant={statusColorMap[danger.status]}>{danger.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 放大图表弹窗 */}
      <Dialog open={enlargedChart !== null} onOpenChange={() => setEnlargedChart(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              {enlargedChart === "lpg" ? "近7日液化气安检数据" : "近7日天然气安检数据"}
            </DialogTitle>
          </DialogHeader>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey={enlargedChart === "lpg" ? "液化气" : "天然气"} 
                stroke={enlargedChart === "lpg" ? "hsl(var(--primary))" : "hsl(var(--success))"} 
                strokeWidth={2} 
              />
            </LineChart>
          </ResponsiveContainer>
        </DialogContent>
      </Dialog>
    </div>
  );
}
