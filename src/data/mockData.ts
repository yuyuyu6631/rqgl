// 模拟数据 - 所有数据仅存在内存中，刷新页面后恢复初始状态

export interface StatCardData {
  lpg: {
    enterprise: number;
    station: number;
    staff: number;
    deliveryStaff: number;
  };
  ng: {
    enterprise: number;
    station: number;
    staff: number;
    repairStaff: number;
  };
}

export interface SevenDayCheckData {
  lpg: number[];
  ng: number[];
  dates: string[];
}

export interface HiddenDanger {
  id: number;
  name: string;
  level: "一般隐患" | "重大隐患";
  enterprise: string;
  discoverTime: string;
  status: "未整改" | "整改中" | "已整改";
  description?: string;
  photos?: string[];
  rectifyPerson?: string;
  rectifyTime?: string;
}

export interface Enterprise {
  id: number;
  name: string;
  type: "液化气企业" | "天然气企业" | "燃气充装站" | "燃气配送站";
  contact: string;
  phone: string;
  address: string;
  establishTime: string;
  qualification: "有效" | "已过期" | "待审核";
  remark: string;
  qualificationImages?: string[];
}

export interface DailyRecord {
  id: number;
  name: string;
  type: "调研督导" | "教育培训" | "安全检查" | "会议记录" | "其他";
  time: string;
  creator: string;
  content: string;
}

export interface ChartData {
  lpgUserType: {
    labels: string[];
    values: number[];
  };
  dangerLevel: {
    labels: string[];
    values: number[];
  };
  annualRectify: {
    months: string[];
    numbers: number[];
  };
}

// 统计卡片数据
export const statCardData: StatCardData = {
  lpg: { enterprise: 3, station: 1, staff: 25, deliveryStaff: 18 },
  ng: { enterprise: 2, station: 1, staff: 30, repairStaff: 8 }
};

// 七日安检数据
export const sevenDayCheckData: SevenDayCheckData = {
  lpg: [12, 15, 10, 18, 16, 20, 17],
  ng: [8, 10, 12, 9, 15, 13, 11],
  dates: ["01-01", "01-02", "01-03", "01-04", "01-05", "01-06", "01-07"]
};

// 隐患初始数据
export const initialHiddenDangers: HiddenDanger[] = [
  {
    id: 1,
    name: "钢瓶阀门泄漏",
    level: "重大隐患",
    enterprise: "测试液化气企业",
    discoverTime: "2026-01-10",
    status: "未整改",
    description: "发现3号钢瓶阀门存在轻微泄漏，需立即更换",
    rectifyPerson: "张三"
  },
  {
    id: 2,
    name: "管道接口松动",
    level: "一般隐患",
    enterprise: "测试天然气企业",
    discoverTime: "2026-01-12",
    status: "整改中",
    description: "主管道接口处螺栓松动，正在进行紧固处理",
    rectifyPerson: "李四",
    rectifyTime: "2026-01-13"
  },
  {
    id: 3,
    name: "报警器未通电",
    level: "一般隐患",
    enterprise: "测试液化气企业",
    discoverTime: "2026-01-13",
    status: "已整改",
    description: "配送站内燃气报警器未接通电源",
    rectifyPerson: "王五",
    rectifyTime: "2026-01-14"
  }
];

// 企业初始数据
export const initialEnterprises: Enterprise[] = [
  {
    id: 1,
    name: "测试液化气企业",
    type: "液化气企业",
    contact: "张三",
    phone: "13800138000",
    address: "XX市XX区XX路1号",
    establishTime: "2020-01-15",
    qualification: "有效",
    remark: "主营液化气配送，拥有配送车辆5台"
  },
  {
    id: 2,
    name: "测试天然气企业",
    type: "天然气企业",
    contact: "李四",
    phone: "13900139000",
    address: "XX市XX区XX路2号",
    establishTime: "2019-05-20",
    qualification: "有效",
    remark: "主营天然气管道铺设与维护"
  },
  {
    id: 3,
    name: "安全燃气充装站",
    type: "燃气充装站",
    contact: "王五",
    phone: "13700137000",
    address: "XX市XX区XX路3号",
    establishTime: "2021-03-10",
    qualification: "有效",
    remark: "液化气充装服务"
  }
];

// 日常记录初始数据
export const initialDailyRecords: DailyRecord[] = [
  {
    id: 1,
    name: "液化气企业安全调研",
    type: "调研督导",
    time: "2026-01-05",
    creator: "管理员",
    content: "对辖区内3家液化气企业进行安全调研，检查企业钢瓶存储情况、配送车辆安全状况、从业人员资质等。总体情况良好，无重大隐患。"
  },
  {
    id: 2,
    name: "天然气安全培训",
    type: "教育培训",
    time: "2026-01-08",
    creator: "管理员",
    content: "组织辖区内天然气企业员工进行管道安全操作培训，共计30人参加。培训内容包括：管道巡检规范、应急处置流程、安全操作规程等。"
  },
  {
    id: 3,
    name: "春节前安全检查",
    type: "安全检查",
    time: "2026-01-15",
    creator: "管理员",
    content: "开展春节前燃气安全专项检查，重点检查企业值班安排、应急预案准备、安全设施运行情况。发现2处一般隐患，已要求企业限期整改。"
  }
];

// 可视化图表数据
export const chartData: ChartData = {
  lpgUserType: {
    labels: ["居民用户", "商业用户", "工业用户"],
    values: [75, 20, 5]
  },
  dangerLevel: {
    labels: ["一般隐患", "重大隐患"],
    values: [80, 20]
  },
  annualRectify: {
    months: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
    numbers: [12, 8, 15, 10, 20, 18, 25, 16, 13, 19, 22, 28]
  }
};
