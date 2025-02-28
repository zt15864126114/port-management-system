import React, { useState } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Input,
  Select,
  DatePicker,
  Modal,
  Form,
  Row,
  Col,
  Tabs,
  Alert,
  Badge,
  Statistic,
  Steps,
  Upload,
  message,
  Descriptions,
  Timeline
} from 'antd';
import {
  FileTextOutlined,
  UploadOutlined,
  DownloadOutlined,
  SearchOutlined,
  PlusOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  IdcardOutlined,
  SafetyCertificateOutlined
} from '@ant-design/icons';
import type { TabsProps } from 'antd';

// 类型定义
type DocumentStatus = '待审核' | '审核中' | '已通过' | '已拒绝' | '待补充';
type DocumentType = '临时通行证' | '年度通行证' | '车辆通行证' | '特种作业证' | '外来人员证' | '常驻人员证';
type ApplicantType = '个人' | '企业' | '车辆';

interface DocumentRecord {
  key: string;
  docNumber: string;
  type: DocumentType;
  applicantType: ApplicantType;
  applicantName: string;
  applicantId: string;
  company?: string;
  contactPhone: string;
  applyDate: string;
  validityPeriod: string;
  purpose: string;
  status: DocumentStatus;
  urgentLevel: '普通' | '加急';
  notes?: string;
  attachments?: string[];
  approver?: string;
  approveDate?: string;
}

// 状态颜色映射
const statusColors: Record<DocumentStatus, string> = {
  '待审核': 'warning',
  '审核中': 'processing',
  '已通过': 'success',
  '已拒绝': 'error',
  '待补充': 'default'
};

const OperationManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  // 示例数据
  const documentData: DocumentRecord[] = [
    {
      key: '1',
      docNumber: 'LSXK2024031501',
      type: '临时通行证',
      applicantType: '个人',
      applicantName: '张三',
      applicantId: '310123199001011234',
      contactPhone: '13812345678',
      applyDate: '2024-03-15 09:00',
      validityPeriod: '2024-03-15至2024-03-17',
      purpose: '设备维修',
      status: '待审核',
      urgentLevel: '加急',
      notes: '需要当天完成审批',
      attachments: ['身份证.pdf', '申请表.pdf']
    },
    {
      key: '2',
      docNumber: 'NDXK2024031502',
      type: '年度通行证',
      applicantType: '企业',
      applicantName: '远洋航运有限公司',
      company: '远洋航运有限公司',
      applicantId: '91310000XXXXXXXX1X',
      contactPhone: '021-12345678',
      applyDate: '2024-03-14 14:30',
      validityPeriod: '2024-04-01至2025-03-31',
      purpose: '长期商务合作',
      status: '审核中',
      urgentLevel: '普通',
      attachments: ['营业执照.pdf', '合作协议.pdf'],
      approver: '李科长'
    },
    {
      key: '3',
      docNumber: 'CLXK2024031503',
      type: '车辆通行证',
      applicantType: '车辆',
      applicantName: '沪A12345',
      company: '联运物流有限公司',
      applicantId: '91310000XXXXXXXX2X',
      contactPhone: '13987654321',
      applyDate: '2024-03-13 16:00',
      validityPeriod: '2024-03-20至2024-09-19',
      purpose: '货物运输',
      status: '已通过',
      urgentLevel: '普通',
      attachments: ['行驶证.pdf', '营业执照.pdf'],
      approver: '王经理',
      approveDate: '2024-03-14 10:30'
    }
  ];

  // 表格列定义
  const columns = [
    {
      title: '证件编号',
      dataIndex: 'docNumber',
      key: 'docNumber',
      width: 150,
    },
    {
      title: '证件类型',
      dataIndex: 'type',
      key: 'type',
      width: 120,
    },
    {
      title: '申请人/单位',
      dataIndex: 'applicantName',
      key: 'applicantName',
      width: 150,
      render: (text: string, record: DocumentRecord) => (
        <span>
          {text}
          {record.company && <div style={{ color: '#999', fontSize: '12px' }}>{record.company}</div>}
        </span>
      ),
    },
    {
      title: '申请类型',
      dataIndex: 'applicantType',
      key: 'applicantType',
      width: 100,
    },
    {
      title: '申请日期',
      dataIndex: 'applyDate',
      key: 'applyDate',
      width: 150,
    },
    {
      title: '有效期',
      dataIndex: 'validityPeriod',
      key: 'validityPeriod',
      width: 200,
    },
    {
      title: '用途',
      dataIndex: 'purpose',
      key: 'purpose',
      width: 150,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: DocumentStatus) => (
        <Tag color={statusColors[status]}>
          {status}
        </Tag>
      ),
    },
    {
      title: '紧急程度',
      dataIndex: 'urgentLevel',
      key: 'urgentLevel',
      width: 100,
      render: (level: string) => (
        <Tag color={level === '加急' ? 'red' : 'default'}>{level}</Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_: unknown, record: DocumentRecord) => (
        <Space>
          <Button type="link">查看</Button>
          {record.status === '待审核' && <Button type="link">审批</Button>}
          {record.status === '待补充' && <Button type="link">补充材料</Button>}
        </Space>
      ),
    },
  ];

  const items: TabsProps['items'] = [
    {
      key: 'pending',
      label: (
        <span>
          <ClockCircleOutlined />
          待审核
          <Badge count={5} offset={[5, -5]} />
        </span>
      ),
      children: (
        <>
          <Space style={{ marginBottom: 16 }}>
            <Input
              placeholder="搜索证件编号/申请人"
              prefix={<SearchOutlined />}
              style={{ width: 200 }}
            />
            <Select defaultValue="all" style={{ width: 120 }}>
              <Select.Option value="all">全部类型</Select.Option>
              <Select.Option value="temp">临时通行证</Select.Option>
              <Select.Option value="annual">年度通行证</Select.Option>
              <Select.Option value="vehicle">车辆通行证</Select.Option>
              <Select.Option value="special">特种作业证</Select.Option>
            </Select>
            <Select defaultValue="all" style={{ width: 120 }}>
              <Select.Option value="all">全部申请类型</Select.Option>
              <Select.Option value="personal">个人</Select.Option>
              <Select.Option value="company">企业</Select.Option>
              <Select.Option value="vehicle">车辆</Select.Option>
            </Select>
            <DatePicker.RangePicker style={{ width: 300 }} />
            <Button type="primary" icon={<SearchOutlined />}>搜索</Button>
          </Space>
          <Table 
            columns={columns} 
            dataSource={documentData}
            scroll={{ x: 1500 }}
            expandable={{
              expandedRowRender: (record) => (
                <Descriptions size="small" column={3}>
                  <Descriptions.Item label="申请人证件号">{record.applicantId}</Descriptions.Item>
                  <Descriptions.Item label="联系电话">{record.contactPhone}</Descriptions.Item>
                  {record.approver && <Descriptions.Item label="审批人">{record.approver}</Descriptions.Item>}
                  {record.approveDate && <Descriptions.Item label="审批时间">{record.approveDate}</Descriptions.Item>}
                  {record.notes && <Descriptions.Item label="备注">{record.notes}</Descriptions.Item>}
                  {record.attachments && (
                    <Descriptions.Item label="附件">
                      {record.attachments.map((file, index) => (
                        <Button key={index} type="link" size="small">{file}</Button>
                      ))}
                    </Descriptions.Item>
                  )}
                </Descriptions>
              ),
            }}
          />
        </>
      ),
    },
    {
      key: 'approved',
      label: (
        <span>
          <CheckCircleOutlined />
          已审批
        </span>
      ),
      children: '已审批内容',
    },
    {
      key: 'templates',
      label: (
        <span>
          <FileTextOutlined />
          证件模板
        </span>
      ),
      children: (
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <Card title="临时通行证申请表">
              <Space direction="vertical">
                <div>适用范围：临时来访人员</div>
                <div>有效期限：最长7天</div>
                <Button icon={<DownloadOutlined />}>下载模板</Button>
              </Space>
            </Card>
          </Col>
          <Col span={8}>
            <Card title="年度通行证申请表">
              <Space direction="vertical">
                <div>适用范围：长期合作单位</div>
                <div>有效期限：1年</div>
                <Button icon={<DownloadOutlined />}>下载模板</Button>
              </Space>
            </Card>
          </Col>
          <Col span={8}>
            <Card title="特种作业证申请表">
              <Space direction="vertical">
                <div>适用范围：特种作业人员</div>
                <div>有效期限：3年</div>
                <Button icon={<DownloadOutlined />}>下载模板</Button>
              </Space>
            </Card>
          </Col>
        </Row>
      ),
    },
  ];

  return (
    <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
      {/* 重要提醒 */}
      <Alert
        message="证件审批提醒"
        description="您有5份待审核的证件申请，其中2份为加急申请，请及时处理。"
        type="warning"
        showIcon
      />

      {/* 统计数据 */}
      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic
              title="待审核"
              value={5}
              prefix={<ClockCircleOutlined />}
              suffix="份"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="本月已审批"
              value={28}
              prefix={<CheckCircleOutlined />}
              suffix="份"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="有效证件总数"
              value={156}
              prefix={<IdcardOutlined />}
              suffix="份"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="审批通过率"
              value={92.5}
              prefix={<SafetyCertificateOutlined />}
              suffix="%"
              precision={1}
            />
          </Card>
        </Col>
      </Row>

      {/* 主要内容区 */}
      <Card
        title="证件办理"
        extra={
          <Space>
            <Button icon={<UploadOutlined />}>批量导入</Button>
            <Button type="primary" icon={<PlusOutlined />}>新增申请</Button>
          </Space>
        }
      >
        <Tabs
          defaultActiveKey="pending"
          items={items}
          onChange={(key) => setActiveTab(key)}
        />
      </Card>

      {/* 新增/编辑表单弹窗 */}
      <Modal
        title="证件申请"
        open={isModalVisible}
        onOk={() => setIsModalVisible(false)}
        onCancel={() => setIsModalVisible(false)}
        width={800}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="type"
                label="证件类型"
                rules={[{ required: true }]}
              >
                <Select>
                  <Select.Option value="temp">临时通行证</Select.Option>
                  <Select.Option value="annual">年度通行证</Select.Option>
                  <Select.Option value="vehicle">车辆通行证</Select.Option>
                  <Select.Option value="special">特种作业证</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="applicantType"
                label="申请类型"
                rules={[{ required: true }]}
              >
                <Select>
                  <Select.Option value="personal">个人</Select.Option>
                  <Select.Option value="company">企业</Select.Option>
                  <Select.Option value="vehicle">车辆</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          {/* 更多表单项... */}
        </Form>
      </Modal>
    </Space>
  );
};

export default OperationManagement; 