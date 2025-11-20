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
import { initialEnterprises, Enterprise } from "@/data/mockData";
import { Plus, Search, Eye, Trash2 } from "lucide-react";

export default function Enterprises() {
  const [enterprises, setEnterprises] = useState<Enterprise[]>(initialEnterprises);
  const [filteredEnterprises, setFilteredEnterprises] = useState<Enterprise[]>(initialEnterprises);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [selectedEnterprise, setSelectedEnterprise] = useState<Enterprise | null>(null);
  const [searchName, setSearchName] = useState("");
  const [searchType, setSearchType] = useState("all");
  const { toast } = useToast();

  const [formData, setFormData] = useState<Partial<Enterprise>>({
    name: "",
    type: "液化气企业",
    contact: "",
    phone: "",
    address: "",
    establishTime: "",
    qualification: "有效",
    remark: "",
  });

  const handleSearch = () => {
    let filtered = enterprises;
    
    if (searchType !== "all") {
      filtered = filtered.filter(e => e.type === searchType);
    }
    
    if (searchName.trim()) {
      filtered = filtered.filter(e => e.name.includes(searchName.trim()));
    }
    
    setFilteredEnterprises(filtered);
    toast({
      title: "筛选完成",
      description: `找到 ${filtered.length} 条记录`,
    });
  };

  const handleAdd = () => {
    if (!formData.name?.trim()) {
      toast({ variant: "destructive", title: "错误", description: "企业名称不能为空" });
      return;
    }
    if (!formData.phone?.match(/^\d{11}$/)) {
      toast({ variant: "destructive", title: "错误", description: "请输入11位手机号码" });
      return;
    }
    if (!formData.establishTime) {
      toast({ variant: "destructive", title: "错误", description: "请选择成立时间" });
      return;
    }

    const newEnterprise: Enterprise = {
      id: Date.now(),
      name: formData.name!,
      type: formData.type as Enterprise["type"],
      contact: formData.contact!,
      phone: formData.phone!,
      address: formData.address!,
      establishTime: formData.establishTime!,
      qualification: formData.qualification as Enterprise["qualification"],
      remark: formData.remark!,
    };

    setEnterprises([...enterprises, newEnterprise]);
    setFilteredEnterprises([...enterprises, newEnterprise]);
    setShowAddDialog(false);
    setFormData({
      name: "",
      type: "液化气企业",
      contact: "",
      phone: "",
      address: "",
      establishTime: "",
      qualification: "有效",
      remark: "",
    });
    toast({ title: "操作成功", description: "企业添加成功" });
  };

  const handleDelete = (id: number) => {
    if (!confirm("确定要删除该企业吗？")) return;
    
    const updated = enterprises.filter(e => e.id !== id);
    setEnterprises(updated);
    setFilteredEnterprises(updated.filter(e => {
      const typeMatch = searchType === "all" || e.type === searchType;
      const nameMatch = !searchName.trim() || e.name.includes(searchName.trim());
      return typeMatch && nameMatch;
    }));
    toast({ title: "操作成功", description: "企业删除成功" });
  };

  const qualificationColorMap = {
    "有效": "success",
    "已过期": "destructive",
    "待审核": "warning",
  } as const;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">基础数据管理</h2>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          新增企业
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>企业筛选</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Select value={searchType} onValueChange={setSearchType}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部类型</SelectItem>
                <SelectItem value="液化气企业">液化气企业</SelectItem>
                <SelectItem value="天然气企业">天然气企业</SelectItem>
                <SelectItem value="燃气充装站">燃气充装站</SelectItem>
                <SelectItem value="燃气配送站">燃气配送站</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder="输入企业名称搜索"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleSearch}>
              <Search className="h-4 w-4 mr-2" />
              筛选
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>企业名称</TableHead>
                <TableHead>企业类型</TableHead>
                <TableHead>联系人</TableHead>
                <TableHead>联系电话</TableHead>
                <TableHead>资质状态</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEnterprises.map((enterprise) => (
                <TableRow key={enterprise.id}>
                  <TableCell className="font-medium">{enterprise.name}</TableCell>
                  <TableCell>{enterprise.type}</TableCell>
                  <TableCell>{enterprise.contact}</TableCell>
                  <TableCell>{enterprise.phone}</TableCell>
                  <TableCell>
                    <Badge variant={qualificationColorMap[enterprise.qualification]}>
                      {enterprise.qualification}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedEnterprise(enterprise);
                          setShowDetailDialog(true);
                        }}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        详情
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(enterprise.id)}
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

      {/* 新增企业弹窗 */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>新增企业</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>企业名称 *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="请输入企业名称"
              />
            </div>
            <div className="space-y-2">
              <Label>企业类型 *</Label>
              <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v as Enterprise["type"] })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="液化气企业">液化气企业</SelectItem>
                  <SelectItem value="天然气企业">天然气企业</SelectItem>
                  <SelectItem value="燃气充装站">燃气充装站</SelectItem>
                  <SelectItem value="燃气配送站">燃气配送站</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>联系人 *</Label>
              <Input
                value={formData.contact}
                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                placeholder="请输入联系人"
              />
            </div>
            <div className="space-y-2">
              <Label>联系电话 *</Label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="请输入11位手机号"
              />
            </div>
            <div className="space-y-2 col-span-2">
              <Label>企业地址 *</Label>
              <Input
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="请输入企业地址"
              />
            </div>
            <div className="space-y-2">
              <Label>成立时间 *</Label>
              <Input
                type="date"
                value={formData.establishTime}
                onChange={(e) => setFormData({ ...formData, establishTime: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>资质状态 *</Label>
              <Select value={formData.qualification} onValueChange={(v) => setFormData({ ...formData, qualification: v as Enterprise["qualification"] })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="有效">有效</SelectItem>
                  <SelectItem value="已过期">已过期</SelectItem>
                  <SelectItem value="待审核">待审核</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 col-span-2">
              <Label>备注</Label>
              <Textarea
                value={formData.remark}
                onChange={(e) => setFormData({ ...formData, remark: e.target.value })}
                placeholder="请输入备注信息"
              />
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
            <DialogTitle>企业详情</DialogTitle>
          </DialogHeader>
          {selectedEnterprise && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">企业名称</Label>
                  <p className="mt-1 font-medium">{selectedEnterprise.name}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">企业类型</Label>
                  <p className="mt-1 font-medium">{selectedEnterprise.type}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">联系人</Label>
                  <p className="mt-1 font-medium">{selectedEnterprise.contact}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">联系电话</Label>
                  <p className="mt-1 font-medium">{selectedEnterprise.phone}</p>
                </div>
                <div className="col-span-2">
                  <Label className="text-muted-foreground">企业地址</Label>
                  <p className="mt-1 font-medium">{selectedEnterprise.address}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">成立时间</Label>
                  <p className="mt-1 font-medium">{selectedEnterprise.establishTime}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">资质状态</Label>
                  <p className="mt-1">
                    <Badge variant={qualificationColorMap[selectedEnterprise.qualification]}>
                      {selectedEnterprise.qualification}
                    </Badge>
                  </p>
                </div>
                <div className="col-span-2">
                  <Label className="text-muted-foreground">备注</Label>
                  <p className="mt-1 font-medium">{selectedEnterprise.remark || "无"}</p>
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground">资质图片</Label>
                <div className="mt-2 grid grid-cols-2 gap-4">
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center text-muted-foreground">
                    资质图片占位
                  </div>
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center text-muted-foreground">
                    资质图片占位
                  </div>
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
