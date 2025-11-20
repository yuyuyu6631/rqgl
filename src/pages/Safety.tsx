import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { initialHiddenDangers, HiddenDanger } from "@/data/mockData";
import { Plus, FileDown, Eye, Upload } from "lucide-react";
import * as XLSX from "xlsx";

export default function Safety() {
  const [dangers, setDangers] = useState<HiddenDanger[]>(initialHiddenDangers);
  const [filteredDangers, setFilteredDangers] = useState<HiddenDanger[]>(initialHiddenDangers);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [selectedDanger, setSelectedDanger] = useState<HiddenDanger | null>(null);
  const [filterLevel, setFilterLevel] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterDateStart, setFilterDateStart] = useState("");
  const [filterDateEnd, setFilterDateEnd] = useState("");
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
  const { toast } = useToast();

  const [formData, setFormData] = useState<Partial<HiddenDanger>>({
    name: "",
    level: "一般隐患",
    enterprise: "",
    discoverTime: "",
    status: "未整改",
    description: "",
    rectifyPerson: "",
    rectifyTime: "",
  });

  const handleFilter = () => {
    let filtered = dangers;
    
    if (filterLevel !== "all") {
      filtered = filtered.filter(d => d.level === filterLevel);
    }
    
    if (filterStatus !== "all") {
      filtered = filtered.filter(d => d.status === filterStatus);
    }
    
    if (filterDateStart) {
      filtered = filtered.filter(d => d.discoverTime >= filterDateStart);
    }
    
    if (filterDateEnd) {
      filtered = filtered.filter(d => d.discoverTime <= filterDateEnd);
    }
    
    setFilteredDangers(filtered);
    toast({
      title: "筛选完成",
      description: `找到 ${filtered.length} 条记录`,
    });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setUploadedPhotos(prev => [...prev, event.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAdd = () => {
    if (!formData.name?.trim()) {
      toast({ variant: "destructive", title: "错误", description: "隐患名称不能为空" });
      return;
    }
    if (!formData.enterprise?.trim()) {
      toast({ variant: "destructive", title: "错误", description: "所属企业不能为空" });
      return;
    }
    if (!formData.discoverTime) {
      toast({ variant: "destructive", title: "错误", description: "请选择发现时间" });
      return;
    }

    const newDanger: HiddenDanger = {
      id: Date.now(),
      name: formData.name!,
      level: formData.level as HiddenDanger["level"],
      enterprise: formData.enterprise!,
      discoverTime: formData.discoverTime!,
      status: formData.status as HiddenDanger["status"],
      description: formData.description,
      rectifyPerson: formData.rectifyPerson,
      rectifyTime: formData.rectifyTime,
      photos: uploadedPhotos,
    };

    setDangers([...dangers, newDanger]);
    setFilteredDangers([...dangers, newDanger]);
    setShowAddDialog(false);
    setUploadedPhotos([]);
    setFormData({
      name: "",
      level: "一般隐患",
      enterprise: "",
      discoverTime: "",
      status: "未整改",
      description: "",
      rectifyPerson: "",
      rectifyTime: "",
    });
    toast({ title: "操作成功", description: "隐患记录添加成功" });
  };

  const handleExport = () => {
    const exportData = filteredDangers.map(d => ({
      隐患名称: d.name,
      隐患等级: d.level,
      所属企业: d.enterprise,
      发现时间: d.discoverTime,
      整改状态: d.status,
      整改负责人: d.rectifyPerson || "",
      整改时间: d.rectifyTime || "",
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "隐患记录");
    XLSX.writeFile(wb, `隐患记录_${new Date().toLocaleDateString()}.xlsx`);
    
    toast({ title: "导出成功", description: "Excel文件已下载" });
  };

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
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">安全监管</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}>
            <FileDown className="h-4 w-4 mr-2" />
            批量导出
          </Button>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            新增隐患
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>隐患筛选</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Select value={filterLevel} onValueChange={setFilterLevel}>
              <SelectTrigger>
                <SelectValue placeholder="隐患等级" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部等级</SelectItem>
                <SelectItem value="一般隐患">一般隐患</SelectItem>
                <SelectItem value="重大隐患">重大隐患</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="整改状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="未整改">未整改</SelectItem>
                <SelectItem value="整改中">整改中</SelectItem>
                <SelectItem value="已整改">已整改</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="date"
              value={filterDateStart}
              onChange={(e) => setFilterDateStart(e.target.value)}
              placeholder="开始日期"
            />
            <Input
              type="date"
              value={filterDateEnd}
              onChange={(e) => setFilterDateEnd(e.target.value)}
              placeholder="结束日期"
            />
          </div>
          <div className="mt-4">
            <Button onClick={handleFilter}>筛选</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>隐患名称</TableHead>
                <TableHead>隐患等级</TableHead>
                <TableHead>所属企业</TableHead>
                <TableHead>发现时间</TableHead>
                <TableHead>整改状态</TableHead>
                <TableHead>操作</TableHead>
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
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedDanger(danger);
                        setShowDetailDialog(true);
                      }}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      查看
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 新增隐患弹窗 */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>新增隐患</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>隐患名称 *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="请输入隐患名称"
                />
              </div>
              <div className="space-y-2">
                <Label>隐患等级 *</Label>
                <Select value={formData.level} onValueChange={(v) => setFormData({ ...formData, level: v as HiddenDanger["level"] })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="一般隐患">一般隐患</SelectItem>
                    <SelectItem value="重大隐患">重大隐患</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>所属企业 *</Label>
                <Input
                  value={formData.enterprise}
                  onChange={(e) => setFormData({ ...formData, enterprise: e.target.value })}
                  placeholder="请输入所属企业"
                />
              </div>
              <div className="space-y-2">
                <Label>发现时间 *</Label>
                <Input
                  type="date"
                  value={formData.discoverTime}
                  onChange={(e) => setFormData({ ...formData, discoverTime: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>整改状态 *</Label>
                <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v as HiddenDanger["status"] })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="未整改">未整改</SelectItem>
                    <SelectItem value="整改中">整改中</SelectItem>
                    <SelectItem value="已整改">已整改</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>整改负责人</Label>
                <Input
                  value={formData.rectifyPerson}
                  onChange={(e) => setFormData({ ...formData, rectifyPerson: e.target.value })}
                  placeholder="请输入整改负责人"
                />
              </div>
              <div className="space-y-2 col-span-2">
                <Label>隐患描述</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="请输入隐患详细描述"
                  rows={3}
                />
              </div>
              <div className="space-y-2 col-span-2">
                <Label>上传照片</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoUpload}
                    className="flex-1"
                  />
                  <Upload className="h-5 w-5 text-muted-foreground" />
                </div>
                {uploadedPhotos.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {uploadedPhotos.map((photo, index) => (
                      <img
                        key={index}
                        src={photo}
                        alt={`预览 ${index + 1}`}
                        className="w-full h-24 object-cover rounded border"
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowAddDialog(false);
              setUploadedPhotos([]);
            }}>取消</Button>
            <Button onClick={handleAdd}>确定</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 详情弹窗 */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>隐患详情</DialogTitle>
          </DialogHeader>
          {selectedDanger && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">隐患名称</Label>
                  <p className="mt-1 font-medium">{selectedDanger.name}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">隐患等级</Label>
                  <p className="mt-1">
                    <Badge variant={levelColorMap[selectedDanger.level]}>{selectedDanger.level}</Badge>
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">所属企业</Label>
                  <p className="mt-1 font-medium">{selectedDanger.enterprise}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">发现时间</Label>
                  <p className="mt-1 font-medium">{selectedDanger.discoverTime}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">整改状态</Label>
                  <p className="mt-1">
                    <Badge variant={statusColorMap[selectedDanger.status]}>{selectedDanger.status}</Badge>
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">整改负责人</Label>
                  <p className="mt-1 font-medium">{selectedDanger.rectifyPerson || "未指定"}</p>
                </div>
                {selectedDanger.rectifyTime && (
                  <div>
                    <Label className="text-muted-foreground">整改时间</Label>
                    <p className="mt-1 font-medium">{selectedDanger.rectifyTime}</p>
                  </div>
                )}
                <div className="col-span-2">
                  <Label className="text-muted-foreground">隐患描述</Label>
                  <p className="mt-1 font-medium">{selectedDanger.description || "无"}</p>
                </div>
              </div>
              {selectedDanger.photos && selectedDanger.photos.length > 0 && (
                <div>
                  <Label className="text-muted-foreground">隐患照片</Label>
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {selectedDanger.photos.map((photo, index) => (
                      <img
                        key={index}
                        src={photo}
                        alt={`照片 ${index + 1}`}
                        className="w-full h-32 object-cover rounded border"
                      />
                    ))}
                  </div>
                </div>
              )}
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
