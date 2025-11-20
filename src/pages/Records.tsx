import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { initialDailyRecords, DailyRecord } from "@/data/mockData";
import { Plus, Search, Eye, Trash2 } from "lucide-react";

export default function Records() {
  const [records, setRecords] = useState<DailyRecord[]>(initialDailyRecords);
  const [filteredRecords, setFilteredRecords] = useState<DailyRecord[]>(initialDailyRecords);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<DailyRecord | null>(null);
  const [searchText, setSearchText] = useState("");
  const { toast } = useToast();

  const [formData, setFormData] = useState<Partial<DailyRecord>>({
    name: "",
    type: "调研督导",
    time: "",
    creator: "管理员",
    content: "",
  });

  const handleSearch = () => {
    if (!searchText.trim()) {
      setFilteredRecords(records);
      return;
    }
    
    const filtered = records.filter(r => r.name.includes(searchText.trim()));
    setFilteredRecords(filtered);
    toast({
      title: "搜索完成",
      description: `找到 ${filtered.length} 条记录`,
    });
  };

  const handleAdd = () => {
    if (!formData.name?.trim()) {
      toast({ variant: "destructive", title: "错误", description: "记录名称不能为空" });
      return;
    }
    if (!formData.time) {
      toast({ variant: "destructive", title: "错误", description: "请选择记录时间" });
      return;
    }
    if (!formData.content?.trim()) {
      toast({ variant: "destructive", title: "错误", description: "记录内容不能为空" });
      return;
    }

    const newRecord: DailyRecord = {
      id: Date.now(),
      name: formData.name!,
      type: formData.type as DailyRecord["type"],
      time: formData.time!,
      creator: formData.creator!,
      content: formData.content!,
    };

    setRecords([newRecord, ...records]);
    setFilteredRecords([newRecord, ...records]);
    setShowAddDialog(false);
    setFormData({
      name: "",
      type: "调研督导",
      time: "",
      creator: "管理员",
      content: "",
    });
    toast({ title: "操作成功", description: "记录添加成功" });
  };

  const handleDelete = (id: number) => {
    if (!confirm("确定要删除该记录吗？")) return;
    
    const updated = records.filter(r => r.id !== id);
    setRecords(updated);
    setFilteredRecords(updated.filter(r => !searchText.trim() || r.name.includes(searchText.trim())));
    toast({ title: "操作成功", description: "记录删除成功" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">日常记录</h2>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          新增记录
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>记录搜索</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input
              placeholder="输入记录名称搜索"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleSearch}>
              <Search className="h-4 w-4 mr-2" />
              搜索
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>记录名称</TableHead>
                <TableHead>记录类型</TableHead>
                <TableHead>记录时间</TableHead>
                <TableHead>创建人</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">{record.name}</TableCell>
                  <TableCell>{record.type}</TableCell>
                  <TableCell>{record.time}</TableCell>
                  <TableCell>{record.creator}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedRecord(record);
                          setShowDetailDialog(true);
                        }}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        查看
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(record.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        删除
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 新增记录弹窗 */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>新增记录</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>记录名称 *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="请输入记录名称"
                />
              </div>
              <div className="space-y-2">
                <Label>记录类型 *</Label>
                <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v as DailyRecord["type"] })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="调研督导">调研督导</SelectItem>
                    <SelectItem value="教育培训">教育培训</SelectItem>
                    <SelectItem value="安全检查">安全检查</SelectItem>
                    <SelectItem value="会议记录">会议记录</SelectItem>
                    <SelectItem value="其他">其他</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>记录时间 *</Label>
                <Input
                  type="date"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>创建人 *</Label>
                <Input
                  value={formData.creator}
                  onChange={(e) => setFormData({ ...formData, creator: e.target.value })}
                  placeholder="请输入创建人"
                />
              </div>
              <div className="space-y-2 col-span-2">
                <Label>记录内容 *</Label>
                <Textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="请输入详细记录内容"
                  rows={6}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>取消</Button>
            <Button onClick={handleAdd}>确定</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 详情弹窗 */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>记录详情</DialogTitle>
          </DialogHeader>
          {selectedRecord && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">记录名称</Label>
                  <p className="mt-1 font-medium">{selectedRecord.name}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">记录类型</Label>
                  <p className="mt-1 font-medium">{selectedRecord.type}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">记录时间</Label>
                  <p className="mt-1 font-medium">{selectedRecord.time}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">创建人</Label>
                  <p className="mt-1 font-medium">{selectedRecord.creator}</p>
                </div>
                <div className="col-span-2">
                  <Label className="text-muted-foreground">记录内容</Label>
                  <p className="mt-2 font-medium whitespace-pre-wrap">{selectedRecord.content}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setShowDetailDialog(false)}>关闭</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
