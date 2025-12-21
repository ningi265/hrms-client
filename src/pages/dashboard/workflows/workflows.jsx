// Remove the problematic imports and replace with available icons
import React, { useState, useEffect } from 'react';
import {
  Settings,
  Users,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  Plus,
  Trash2,
  Edit,
  Save,
  X,
  ArrowUp,
  ArrowDown,
  DollarSign,
  Building,
  Shield,
  FileText,
  Lock,
  Unlock,
  Eye,
  Copy,
  Download,
  Upload,
  Search,
  Filter,
  Calendar,
  Clock,
  UserCheck,
  UserPlus,
  Zap,
  TrendingUp,
  BarChart3,
  History,
  RefreshCw,
  MoreVertical,
  ExternalLink,
  Link,
  Folder,
  Layers,
  Target,
  Award,
  Star,
  Bell,
  Mail,
  MessageSquare,
  Phone,
  Globe,
  Cpu,
  Database,
  Server,
  HardDrive,
  Smartphone,
  Monitor,
  Printer,
  Keyboard,
  Mouse,
  Headphones,
  Camera,
  Truck,
  Package,
  Tag,
  CreditCard,
  FileCheck,
  GitMerge,
  GitBranch,
  Play,
  StopCircle,
  AlertTriangle,
  CheckSquare,
  Thermometer,
  Wind,
  ZoomIn,
  ZoomOut,
  Move,
  RotateCcw,
  RotateCw,
  Grid,
  Menu,
  Code,
  Quote,
  Sigma,
  Infinity,
  Command,
  Delete,
  Archive,
  Inbox,
  FolderPlus,
  FilePlus,
  FileCode,
  Book,
  BookOpen,
  Bookmark,
  Timer,
  Volume,
  Mic,
  Video,
  Paperclip,
  AtSign,
  Hash,
  HelpCircle,
  Info,
  Key,
  User,
  UserMinus,
  UserX,
  Heart,
  ThumbsUp,
  ThumbsDown,
  Navigation,
  Map,
  MapPin,
  Home,
  Store,
  Hospital,
  School,
  Briefcase,
  Medal,
  Trophy,
  Crown,
  Columns,
  ChevronUp,
  ChevronDown,
  ChevronsUp,
  ChevronsDown,
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  ArrowDownLeft,
  ArrowUpLeft,
  ShoppingCart,
  ShoppingBag,
  Gift,
  Box,
  Tv,
  Tablet,
  Speaker,
  Gamepad,
  Bluetooth,
  Cloud,
  Sun,
  Moon,
  Umbrella,
  Droplet,
  Flag,
  Compass,
  // Icons that don't exist in lucide-react are removed
} from 'lucide-react';

// For any missing icons, we can create simple text alternatives or use existing ones
// Remove all the problematic imports and just use the ones above

const backendUrl = import.meta.env.VITE_ENV === 'production'
  ? import.meta.env.VITE_BACKEND_URL_PROD
  : import.meta.env.VITE_BACKEND_URL_DEV;


// For icons that don't exist, let's create simple components
const Plane = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>
  </svg>
);

const Forward = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 17 20 12 15 7"/>
    <path d="M4 18v-5a3 3 0 0 1 3-3h11"/>
  </svg>
);

// Sample department data structure
const sampleDepartments = [
  { id: 'dept-001', name: 'Finance', code: 'FIN', head: 'Jane Doe', email: 'jane.doe@company.com' },
  { id: 'dept-002', name: 'Human Resources', code: 'HR', head: 'John Smith', email: 'john.smith@company.com' },
  { id: 'dept-003', name: 'Information Technology', code: 'IT', head: 'Mike Johnson', email: 'mike.johnson@company.com' },
  { id: 'dept-004', name: 'Operations', code: 'OPS', head: 'Sarah Williams', email: 'sarah.williams@company.com' },
  { id: 'dept-005', name: 'Marketing', code: 'MKT', head: 'David Brown', email: 'david.brown@company.com' },
  { id: 'dept-006', name: 'Procurement', code: 'PROC', head: 'Lisa Miller', email: 'lisa.miller@company.com' },
  { id: 'dept-007', name: 'Legal', code: 'LEGAL', head: 'Robert Taylor', email: 'robert.taylor@company.com' },
];

// Sample approvers/users
const sampleApprovers = [
  { id: 'user-001', name: 'Alex Johnson', email: 'alex.johnson@company.com', role: 'CFO', department: 'Finance', avatar: 'AJ' },
  { id: 'user-002', name: 'Maria Garcia', email: 'maria.garcia@company.com', role: 'Procurement Manager', department: 'Procurement', avatar: 'MG' },
  { id: 'user-003', name: 'James Wilson', email: 'james.wilson@company.com', role: 'IT Director', department: 'Information Technology', avatar: 'JW' },
  { id: 'user-004', name: 'Emma Davis', email: 'emma.davis@company.com', role: 'Operations Manager', department: 'Operations', avatar: 'ED' },
  { id: 'user-005', name: 'Tom Brown', email: 'tom.brown@company.com', role: 'Department Head', department: 'Marketing', avatar: 'TB' },
  { id: 'user-006', name: 'Sophie Chen', email: 'sophie.chen@company.com', role: 'Legal Counsel', department: 'Legal', avatar: 'SC' },
  { id: 'user-007', name: 'Michael Lee', email: 'michael.lee@company.com', role: 'Procurement Officer', department: 'Procurement', avatar: 'ML' },
  { id: 'user-008', name: 'Olivia Martin', email: 'olivia.martin@company.com', role: 'Finance Officer', department: 'Finance', avatar: 'OM' },
];

// Sample categories
const sampleCategories = [
  { id: 'cat-001', name: 'Computing Hardware', color: 'blue', icon: <Cpu size={14} /> },
  { id: 'cat-002', name: 'Office Equipment', color: 'green', icon: <Printer size={14} /> },
  { id: 'cat-003', name: 'Furniture', color: 'purple', icon: <Building size={14} /> },
  { id: 'cat-004', name: 'Software & Licenses', color: 'amber', icon: <FileCode size={14} /> },
  { id: 'cat-005', name: 'Networking', color: 'teal', icon: <Globe size={14} /> },
  { id: 'cat-006', name: 'Audio/Visual', color: 'rose', icon: <Camera size={14} /> },
  { id: 'cat-007', name: 'Travel & Accommodation', color: 'indigo', icon: <Plane size={14} /> },
];



// Workflow node types
const nodeTypes = [
  { id: 'start', name: 'Start Node', icon: <Play size={16} />, color: 'emerald' },
  { id: 'approval', name: 'Approval Step', icon: <UserCheck size={16} />, color: 'blue' },
  { id: 'condition', name: 'Condition', icon: <GitBranch size={16} />, color: 'amber' },
  { id: 'parallel', name: 'Parallel Approval', icon: <GitMerge size={16} />, color: 'purple' },
  { id: 'notification', name: 'Notification', icon: <Bell size={16} />, color: 'teal' },
  { id: 'end', name: 'End Node', icon: <StopCircle size={16} />, color: 'red' },
];

// Workflow Condition Operators
const conditionOperators = [
  { id: 'eq', name: 'Equals', symbol: '=' },
  { id: 'neq', name: 'Not Equals', symbol: '≠' },
  { id: 'gt', name: 'Greater Than', symbol: '>' },
  { id: 'gte', name: 'Greater Than or Equal', symbol: '≥' },
  { id: 'lt', name: 'Less Than', symbol: '<' },
  { id: 'lte', name: 'Less Than or Equal', symbol: '≤' },
  { id: 'contains', name: 'Contains', symbol: '⊃' },
  { id: 'in', name: 'In List', symbol: '∈' },
  { id: 'not-in', name: 'Not In List', symbol: '∉' },
];

// Available conditions/filters for workflows
const availableConditions = [
  { 
    id: 'amount', 
    name: 'Request Amount', 
    type: 'number',
    field: 'estimatedCost',
    description: 'Total cost of the requisition',
    unit: 'MWK',
    icon: <DollarSign size={14} />
  },
  { 
    id: 'department', 
    name: 'Department', 
    type: 'select',
    field: 'department',
    description: 'Requesting department',
    options: sampleDepartments.map(dept => ({ value: dept.id, label: dept.name })),
    icon: <Building size={14} />
  },
  { 
    id: 'category', 
    name: 'Item Category', 
    type: 'select',
    field: 'category',
    description: 'Category of requested items',
    options: sampleCategories.map(cat => ({ value: cat.id, label: cat.name })),
    icon: <Package size={14} />
  },
  { 
    id: 'urgency', 
    name: 'Urgency Level', 
    type: 'select',
    field: 'urgency',
    description: 'Priority level of the request',
    options: [
      { value: 'low', label: 'Low' },
      { value: 'medium', label: 'Medium' },
      { value: 'high', label: 'High' },
      { value: 'critical', label: 'Critical' }
    ],
    icon: <Zap size={14} />
  },
  { 
    id: 'budget-code', 
    name: 'Budget Code', 
    type: 'text',
    field: 'budgetCode',
    description: 'Specific budget code',
    icon: <CreditCard size={14} />
  },
  { 
    id: 'supplier', 
    name: 'Preferred Supplier', 
    type: 'text',
    field: 'preferredSupplier',
    description: 'Designated supplier preference',
    icon: <Truck size={14} />
  },
  { 
    id: 'custom-item', 
    name: 'Custom Item Request', 
    type: 'boolean',
    field: 'isCustomItem',
    description: 'Whether this is a custom item request',
    icon: <Settings size={14} />
  },
  { 
    id: 'quarter', 
    name: 'Fiscal Quarter', 
    type: 'select',
    field: 'fiscalQuarter',
    description: 'Quarter of the fiscal year',
    options: [
      { value: 'Q1', label: 'Q1' },
      { value: 'Q2', label: 'Q2' },
      { value: 'Q3', label: 'Q3' },
      { value: 'Q4', label: 'Q4' }
    ],
    icon: <Calendar size={14} />
  },
];

export default function ApprovalWorkflowConfig() {
  const [workflows, setWorkflows] = useState([]);
  const [activeWorkflow, setActiveWorkflow] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showNodeModal, setShowNodeModal] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');
  const [dragOverId, setDragOverId] = useState(null);
  
  // New workflow form state
  const [newWorkflow, setNewWorkflow] = useState({
    name: '',
    description: '',
    isActive: true,
    priority: 1,
    applyToAll: true,
    departments: [],
    categories: [],
    minAmount: '',
    maxAmount: '',
    conditions: [],
    nodes: [],
    approvalActions: [],
    notifications: [],
    escalationRules: [],
    slaHours: 72,
    autoApproveBelow: '',
    requireCFOAbove: 500000,
    requireLegalReview: false,
    requireITReview: false,
    allowDelegation: true,
    version: '1.0',
  });

  // Node form state
  const [nodeForm, setNodeForm] = useState({
    id: '',
    name: '',
    type: 'approval',
    description: '',
    approvers: [],
    approvalType: 'sequential', // sequential, parallel, any
    minApprovals: 1,
    conditions: [],
    actions: [],
    timeoutHours: 24,
    escalationTo: '',
    isMandatory: true,
    canDelegate: true,
    position: { x: 0, y: 0 },
    nextNodes: [],
  });

  // Condition form state
  const [conditionForm, setConditionForm] = useState({
    field: '',
    operator: 'gt',
    value: '',
    valueType: 'number',
    valueOptions: [],
    logicalOperator: 'AND', // AND, OR
    groupWithNext: false,
  });

  // Load workflows from backend
  useEffect(() => {
    fetchWorkflows();
  }, []);

  const fetchWorkflows = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error('No authentication token found');
        return;
      }

      const response = await fetch(`${backendUrl}/api/approval-workflows`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setWorkflows(data.data || data);
      } else {
        console.error('Failed to fetch workflows, using sample data');
        // Load sample data for demonstration
        loadSampleWorkflows();
      }
    } catch (error) {
      console.error('Error fetching workflows:', error);
      loadSampleWorkflows();
    } finally {
      setIsLoading(false);
    }
  };

  const loadSampleWorkflows = () => {
    const sampleWorkflows = [
      {
        id: 'wf-001',
        name: 'Standard Procurement Workflow',
        description: 'Default workflow for all procurement requests',
        isActive: true,
        priority: 1,
        applyToAll: true,
        createdAt: '2024-01-15',
        updatedAt: '2024-01-15',
        createdBy: 'Admin User',
        triggerConditions: [
          { field: 'estimatedCost', operator: 'gte', value: 0 }
        ],
        nodes: [
          {
            id: 'start-001',
            type: 'start',
            name: 'Request Submitted',
            position: { x: 100, y: 100 }
          },
          {
            id: 'approval-001',
            type: 'approval',
            name: 'Department Head Approval',
            approvers: sampleApprovers.filter(a => a.role.includes('Department Head')),
            approvalType: 'sequential',
            minApprovals: 1,
            conditions: [],
            position: { x: 300, y: 100 }
          },
          {
            id: 'condition-001',
            type: 'condition',
            name: 'Amount Check',
            conditions: [
              { field: 'estimatedCost', operator: 'lt', value: 50000 }
            ],
            trueBranch: 'approval-002',
            falseBranch: 'approval-003',
            position: { x: 500, y: 100 }
          },
          {
            id: 'approval-002',
            type: 'approval',
            name: 'Procurement Officer Approval',
            approvers: sampleApprovers.filter(a => a.role.includes('Procurement Officer')),
            approvalType: 'sequential',
            minApprovals: 1,
            position: { x: 700, y: 50 }
          },
          {
            id: 'approval-003',
            type: 'approval',
            name: 'CFO Final Approval',
            approvers: sampleApprovers.filter(a => a.role === 'CFO'),
            approvalType: 'sequential',
            minApprovals: 1,
            position: { x: 700, y: 150 }
          },
          {
            id: 'end-001',
            type: 'end',
            name: 'Request Approved',
            position: { x: 900, y: 100 }
          }
        ],
        connections: [
          { from: 'start-001', to: 'approval-001' },
          { from: 'approval-001', to: 'condition-001' },
          { from: 'condition-001', to: 'approval-002', condition: 'true' },
          { from: 'condition-001', to: 'approval-003', condition: 'false' },
          { from: 'approval-002', to: 'end-001' },
          { from: 'approval-003', to: 'end-001' }
        ],
        slaHours: 72,
        autoApproveBelow: 10000,
        requireCFOAbove: 500000,
        statistics: {
          totalRequests: 1247,
          avgApprovalTime: '36h',
          completionRate: '92%'
        }
      },
      {
        id: 'wf-002',
        name: 'IT Hardware Workflow',
        description: 'Specialized workflow for IT equipment purchases',
        isActive: true,
        priority: 2,
        applyToAll: false,
        departments: ['dept-003'], // IT department
        categories: ['cat-001', 'cat-005'], // Computing Hardware & Networking
        createdAt: '2024-01-10',
        updatedAt: '2024-01-10',
        createdBy: 'IT Admin',
        triggerConditions: [
          { field: 'category', operator: 'in', value: ['cat-001', 'cat-005'] },
          { field: 'department', operator: 'eq', value: 'dept-003' }
        ],
        nodes: [
          {
            id: 'start-002',
            type: 'start',
            name: 'IT Request Submitted',
            position: { x: 100, y: 100 }
          },
          {
            id: 'parallel-001',
            type: 'parallel',
            name: 'IT & Security Review',
            approvers: [
              ...sampleApprovers.filter(a => a.department === 'Information Technology'),
              ...sampleApprovers.filter(a => a.role === 'Legal Counsel')
            ],
            approvalType: 'parallel',
            minApprovals: 2,
            position: { x: 300, y: 100 }
          },
          {
            id: 'approval-004',
            type: 'approval',
            name: 'Budget Committee Approval',
            approvers: sampleApprovers.filter(a => a.department === 'Finance'),
            approvalType: 'sequential',
            minApprovals: 1,
            position: { x: 500, y: 100 }
          },
          {
            id: 'end-002',
            type: 'end',
            name: 'IT Purchase Approved',
            position: { x: 700, y: 100 }
          }
        ],
        connections: [
          { from: 'start-002', to: 'parallel-001' },
          { from: 'parallel-001', to: 'approval-004' },
          { from: 'approval-004', to: 'end-002' }
        ],
        slaHours: 96,
        requireITReview: true,
        requireLegalReview: true,
        statistics: {
          totalRequests: 324,
          avgApprovalTime: '48h',
          completionRate: '88%'
        }
      },
      {
        id: 'wf-003',
        name: 'Low Value Quick Approve',
        description: 'Fast-track approval for low-value purchases',
        isActive: true,
        priority: 3,
        applyToAll: true,
        triggerConditions: [
          { field: 'estimatedCost', operator: 'lt', value: 10000 }
        ],
        nodes: [
          {
            id: 'start-003',
            type: 'start',
            name: 'Low Value Request',
            position: { x: 100, y: 100 }
          },
          {
            id: 'notification-001',
            type: 'notification',
            name: 'Auto-Approval Notification',
            recipients: sampleApprovers.slice(0, 3),
            position: { x: 300, y: 100 }
          },
          {
            id: 'end-003',
            type: 'end',
            name: 'Auto-Approved',
            position: { x: 500, y: 100 }
          }
        ],
        connections: [
          { from: 'start-003', to: 'notification-001' },
          { from: 'notification-001', to: 'end-003' }
        ],
        autoApproveBelow: 10000,
        slaHours: 24,
        statistics: {
          totalRequests: 892,
          avgApprovalTime: '1h',
          completionRate: '100%'
        }
      }
    ];
    setWorkflows(sampleWorkflows);
  };

  const saveWorkflow = async (workflow) => {
    setIsLoading(true);
    setSaveStatus('Saving...');
    
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error('No authentication token found');
      }

      const url = workflow.id 
        ? `${backendUrl}/api/approval-workflows/${workflow.id}`
        : `${backendUrl}/api/approval-workflows`;
      
      const method = workflow.id ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(workflow)
      });

      if (response.ok) {
        setSaveStatus('Saved successfully!');
        fetchWorkflows(); // Refresh list
        setTimeout(() => setSaveStatus(''), 3000);
        return true;
      } else {
        const error = await response.json();
        setSaveStatus(`Error: ${error.message}`);
        return false;
      }
    } catch (error) {
      setSaveStatus(`Error: ${error.message}`);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateWorkflow = () => {
    const workflowWithId = {
      ...newWorkflow,
      id: `wf-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'Current User',
    };
    
    setWorkflows(prev => [...prev, workflowWithId]);
    setActiveWorkflow(workflowWithId);
    setIsEditing(true);
    setShowCreateModal(false);
    setNewWorkflow({
      name: '',
      description: '',
      isActive: true,
      priority: 1,
      applyToAll: true,
      departments: [],
      categories: [],
      minAmount: '',
      maxAmount: '',
      conditions: [],
      nodes: [],
      approvalActions: [],
      notifications: [],
      escalationRules: [],
      slaHours: 72,
      autoApproveBelow: '',
      requireCFOAbove: 500000,
      requireLegalReview: false,
      requireITReview: false,
      allowDelegation: true,
      version: '1.0',
    });
  };

  const handleAddNode = (type) => {
    const newNode = {
      id: `${type}-${Date.now()}`,
      name: `New ${nodeTypes.find(t => t.id === type)?.name || 'Node'}`,
      type,
      description: '',
      approvers: [],
      approvalType: 'sequential',
      minApprovals: 1,
      conditions: [],
      actions: [],
      timeoutHours: 24,
      escalationTo: '',
      isMandatory: true,
      canDelegate: true,
      position: { 
        x: 100 + (activeWorkflow?.nodes.length || 0) * 200,
        y: 100
      },
      nextNodes: [],
    };
    
    setNodeForm(newNode);
    setSelectedNode(newNode);
    setShowNodeModal(true);
  };

  const handleSaveNode = () => {
    if (!activeWorkflow) return;
    
    const updatedNodes = [...activeWorkflow.nodes];
    const existingIndex = updatedNodes.findIndex(n => n.id === nodeForm.id);
    
    if (existingIndex >= 0) {
      updatedNodes[existingIndex] = nodeForm;
    } else {
      updatedNodes.push(nodeForm);
    }
    
    setActiveWorkflow(prev => ({
      ...prev,
      nodes: updatedNodes
    }));
    
    setShowNodeModal(false);
    setNodeForm({
      id: '',
      name: '',
      type: 'approval',
      description: '',
      approvers: [],
      approvalType: 'sequential',
      minApprovals: 1,
      conditions: [],
      actions: [],
      timeoutHours: 24,
      escalationTo: '',
      isMandatory: true,
      canDelegate: true,
      position: { x: 0, y: 0 },
      nextNodes: [],
    });
    setSelectedNode(null);
  };

  const handleAddCondition = () => {
    if (!selectedNode) return;
    
    const newCondition = {
      id: `cond-${Date.now()}`,
      ...conditionForm,
      value: conditionForm.valueType === 'number' ? Number(conditionForm.value) : conditionForm.value
    };
    
    setNodeForm(prev => ({
      ...prev,
      conditions: [...prev.conditions, newCondition]
    }));
    
    setConditionForm({
      field: '',
      operator: 'gt',
      value: '',
      valueType: 'number',
      valueOptions: [],
      logicalOperator: 'AND',
      groupWithNext: false,
    });
  };

  const handleDragStart = (e, nodeId) => {
    e.dataTransfer.setData('nodeId', nodeId);
  };

  const handleDragOver = (e, targetNodeId) => {
    e.preventDefault();
    setDragOverId(targetNodeId);
  };

  const handleDrop = (e, targetNodeId) => {
    e.preventDefault();
    const sourceNodeId = e.dataTransfer.getData('nodeId');
    
    if (sourceNodeId && targetNodeId && sourceNodeId !== targetNodeId) {
      // Create connection between nodes
      const updatedWorkflow = { ...activeWorkflow };
      if (!updatedWorkflow.connections) updatedWorkflow.connections = [];
      
      const connectionExists = updatedWorkflow.connections.some(
        conn => conn.from === sourceNodeId && conn.to === targetNodeId
      );
      
      if (!connectionExists) {
        updatedWorkflow.connections.push({
          from: sourceNodeId,
          to: targetNodeId,
          id: `conn-${Date.now()}`
        });
        
        setActiveWorkflow(updatedWorkflow);
      }
    }
    
    setDragOverId(null);
  };

  const handleDeleteConnection = (connectionId) => {
    if (!activeWorkflow?.connections) return;
    
    setActiveWorkflow(prev => ({
      ...prev,
      connections: prev.connections.filter(conn => conn.id !== connectionId)
    }));
  };

  const handleDeleteNode = (nodeId) => {
    if (!activeWorkflow) return;
    
    // Remove the node
    const updatedNodes = activeWorkflow.nodes.filter(node => node.id !== nodeId);
    
    // Remove connections involving this node
    const updatedConnections = (activeWorkflow.connections || []).filter(
      conn => conn.from !== nodeId && conn.to !== nodeId
    );
    
    setActiveWorkflow(prev => ({
      ...prev,
      nodes: updatedNodes,
      connections: updatedConnections
    }));
  };

  const renderWorkflowVisualizer = () => {
    if (!activeWorkflow?.nodes.length) {
      return (
        <div className="flex flex-col items-center justify-center h-full min-h-[400px] bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300 p-8">
          <Layers size={48} className="text-gray-400 mb-4" />
          <h3 className="text-lg font-bold text-gray-900 mb-2">No Workflow Nodes</h3>
          <p className="text-gray-600 text-center mb-4">Start building your approval workflow by adding nodes</p>
          <button
            onClick={() => handleAddNode('start')}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200 font-medium"
          >
            <Plus size={16} className="inline mr-2" />
            Add Start Node
          </button>
        </div>
      );
    }

    return (
      <div className="relative h-[600px] bg-gray-50 rounded-2xl border border-gray-300 overflow-auto p-4">
        {/* Grid background */}
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.05) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(0, 0, 0, 0.05) 1px, transparent 1px)`,
          backgroundSize: '20px 20px'
        }}></div>
        
        {/* Render connections first (behind nodes) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {activeWorkflow.connections?.map((conn, index) => {
            const fromNode = activeWorkflow.nodes.find(n => n.id === conn.from);
            const toNode = activeWorkflow.nodes.find(n => n.id === conn.to);
            
            if (!fromNode || !toNode) return null;
            
            const x1 = fromNode.position.x + 100;
            const y1 = fromNode.position.y + 50;
            const x2 = toNode.position.x;
            const y2 = toNode.position.y + 50;
            
            return (
              <g key={conn.id}>
                <path
                  d={`M ${x1} ${y1} C ${x1 + 100} ${y1}, ${x2 - 100} ${y2}, ${x2} ${y2}`}
                  stroke="#3b82f6"
                  strokeWidth="2"
                  fill="none"
                  markerEnd="url(#arrowhead)"
                />
                <circle cx={x1 + (x2 - x1) / 2} cy={y1 + (y2 - y1) / 2} r="4" fill="#3b82f6" />
                <text
                  x={x1 + (x2 - x1) / 2}
                  y={y1 + (y2 - y1) / 2 - 10}
                  textAnchor="middle"
                  fill="#6b7280"
                  fontSize="10"
                >
                  {conn.condition || ''}
                </text>
              </g>
            );
          })}
          
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="#3b82f6" />
            </marker>
          </defs>
        </svg>

        {/* Render nodes */}
        {activeWorkflow.nodes.map((node) => (
          <div
            key={node.id}
            draggable
            onDragStart={(e) => handleDragStart(e, node.id)}
            onDragOver={(e) => handleDragOver(e, node.id)}
            onDrop={(e) => handleDrop(e, node.id)}
            className={`absolute cursor-move transition-all duration-200 ${
              dragOverId === node.id ? 'scale-105 ring-2 ring-blue-500' : ''
            }`}
            style={{
              left: `${node.position.x}px`,
              top: `${node.position.y}px`,
            }}
            onClick={() => {
              setSelectedNode(node);
              setNodeForm(node);
              setShowNodeModal(true);
            }}
          >
            <div className={`w-48 p-3 rounded-xl border-2 shadow-sm ${
              node.type === 'start' ? 'bg-emerald-50 border-emerald-300' :
              node.type === 'approval' ? 'bg-blue-50 border-blue-300' :
              node.type === 'condition' ? 'bg-amber-50 border-amber-300' :
              node.type === 'parallel' ? 'bg-purple-50 border-purple-300' :
              node.type === 'notification' ? 'bg-teal-50 border-teal-300' :
              'bg-red-50 border-red-300'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  {node.type === 'start' && <Play size={16} className="text-emerald-600" />}
                  {node.type === 'approval' && <UserCheck size={16} className="text-blue-600" />}
                  {node.type === 'condition' && <GitBranch size={16} className="text-amber-600" />}
                  {node.type === 'parallel' && <GitMerge size={16} className="text-purple-600" />}
                  {node.type === 'notification' && <Bell size={16} className="text-teal-600" />}
                  {node.type === 'end' && <StopCircle size={16} className="text-red-600" />}
                  <span className="font-bold text-sm">{node.name}</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteNode(node.id);
                  }}
                  className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors duration-200"
                >
                  <Trash2 size={12} />
                </button>
              </div>
              
              <div className="text-xs text-gray-600 space-y-1">
                {node.type === 'approval' && (
                  <>
                    <div className="flex items-center justify-between">
                      <span>Approvers:</span>
                      <span className="font-medium">{node.approvers?.length || 0}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Type:</span>
                      <span className="font-medium capitalize">{node.approvalType}</span>
                    </div>
                  </>
                )}
                {node.type === 'condition' && node.conditions?.length > 0 && (
                  <div className="text-xs">
                    {node.conditions[0].field}: {node.conditions[0].operator} {node.conditions[0].value}
                  </div>
                )}
              </div>
              
              <div className="mt-2 pt-2 border-t border-gray-200">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>ID: {node.id.slice(0, 8)}</span>
                  <Move size={10} />
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Add node button */}
        <div className="absolute bottom-4 right-4">
          <div className="bg-white rounded-xl border border-gray-300 shadow-sm p-2">
            <div className="text-xs font-medium text-gray-700 mb-2">Add Node</div>
            <div className="flex flex-wrap gap-1">
              {nodeTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => handleAddNode(type.id)}
                  className={`p-1.5 rounded-lg border text-xs font-medium flex items-center gap-1 ${
                    type.id === 'start' ? 'border-emerald-200 text-emerald-700 hover:bg-emerald-50' :
                    type.id === 'approval' ? 'border-blue-200 text-blue-700 hover:bg-blue-50' :
                    type.id === 'condition' ? 'border-amber-200 text-amber-700 hover:bg-amber-50' :
                    type.id === 'parallel' ? 'border-purple-200 text-purple-700 hover:bg-purple-50' :
                    type.id === 'notification' ? 'border-teal-200 text-teal-700 hover:bg-teal-50' :
                    'border-red-200 text-red-700 hover:bg-red-50'
                  }`}
                >
                  {type.icon}
                  <span>{type.name.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderNodeConfigForm = () => {
    return (
      <div className="space-y-4">
        {/* Basic Info */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Node Name *
            </label>
            <input
              type="text"
              value={nodeForm.name}
              onChange={(e) => setNodeForm(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-1.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              placeholder="e.g., Department Head Approval"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Node Type
            </label>
            <div className="flex items-center space-x-2 p-1.5 bg-gray-100 rounded-xl text-sm">
              {nodeTypes.find(t => t.id === nodeForm.type)?.icon}
              <span className="font-medium">
                {nodeTypes.find(t => t.id === nodeForm.type)?.name}
              </span>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={nodeForm.description}
            onChange={(e) => setNodeForm(prev => ({ ...prev, description: e.target.value }))}
            rows={2}
            className="w-full px-3 py-1.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            placeholder="Describe what this approval step entails..."
          />
        </div>

        {/* Approval-specific settings */}
        {['approval', 'parallel'].includes(nodeForm.type) && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Approval Type
                </label>
                <select
                  value={nodeForm.approvalType}
                  onChange={(e) => setNodeForm(prev => ({ ...prev, approvalType: e.target.value }))}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  <option value="sequential">Sequential (One after another)</option>
                  <option value="parallel">Parallel (All at once)</option>
                  <option value="any">Any One (First responder)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Minimum Approvals Required
                </label>
                <input
                  type="number"
                  min="1"
                  value={nodeForm.minApprovals}
                  onChange={(e) => setNodeForm(prev => ({ ...prev, minApprovals: parseInt(e.target.value) || 1 }))}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Select Approvers
              </label>
              <div className="border border-gray-300 rounded-xl p-2 max-h-40 overflow-y-auto">
                {sampleApprovers.map((approver) => (
                  <label key={approver.id} className="flex items-center space-x-2 p-1.5 hover:bg-gray-50 rounded">
                    <input
                      type="checkbox"
                      checked={nodeForm.approvers.some(a => a.id === approver.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setNodeForm(prev => ({
                            ...prev,
                            approvers: [...prev.approvers, approver]
                          }));
                        } else {
                          setNodeForm(prev => ({
                            ...prev,
                            approvers: prev.approvers.filter(a => a.id !== approver.id)
                          }));
                        }
                      }}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-sm">{approver.name}</div>
                      <div className="text-xs text-gray-500">{approver.role} • {approver.department}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Timeout (Hours)
                </label>
                <input
                  type="number"
                  min="1"
                  value={nodeForm.timeoutHours}
                  onChange={(e) => setNodeForm(prev => ({ ...prev, timeoutHours: parseInt(e.target.value) || 24 }))}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="24"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Escalate To
                </label>
                <select
                  value={nodeForm.escalationTo}
                  onChange={(e) => setNodeForm(prev => ({ ...prev, escalationTo: e.target.value }))}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  <option value="">None</option>
                  {sampleApprovers.map(approver => (
                    <option key={approver.id} value={approver.id}>
                      {approver.name} ({approver.role})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </>
        )}

        {/* Condition-specific settings */}
        {nodeForm.type === 'condition' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-gray-900">Conditions</h4>
              <button
                type="button"
                onClick={handleAddCondition}
                className="px-2 py-1 bg-blue-600 text-white text-xs rounded-xl hover:bg-blue-700 transition-colors duration-200 flex items-center gap-1"
              >
                <Plus size={12} />
                Add Condition
              </button>
            </div>

            {nodeForm.conditions.length > 0 ? (
              <div className="space-y-2">
                {nodeForm.conditions.map((condition, index) => (
                  <div key={condition.id} className="p-2 bg-gray-50 border border-gray-200 rounded-xl">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm">{condition.field}</span>
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => {
                            setNodeForm(prev => ({
                              ...prev,
                              conditions: prev.conditions.filter((_, i) => i !== index)
                            }));
                          }}
                          className="p-0.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors duration-200"
                        >
                          <Trash2 size={10} />
                        </button>
                      </div>
                    </div>
                    <div className="text-xs text-gray-600">
                      {condition.operator} {condition.value}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 bg-gray-50 border border-dashed border-gray-300 rounded-xl text-center">
                <GitBranch size={24} className="mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">No conditions defined. Add conditions to create decision branches.</p>
              </div>
            )}

            {/* Add condition form */}
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
              <h5 className="text-xs font-bold text-blue-900 mb-2">Add New Condition</h5>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Field
                  </label>
                  <select
                    value={conditionForm.field}
                    onChange={(e) => {
                      const field = availableConditions.find(f => f.id === e.target.value);
                      setConditionForm(prev => ({
                        ...prev,
                        field: e.target.value,
                        valueType: field?.type || 'text',
                        valueOptions: field?.options || []
                      }));
                    }}
                    className="w-full px-2 py-1 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs"
                  >
                    <option value="">Select field</option>
                    {availableConditions.map(condition => (
                      <option key={condition.id} value={condition.id}>
                        {condition.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Operator
                  </label>
                  <select
                    value={conditionForm.operator}
                    onChange={(e) => setConditionForm(prev => ({ ...prev, operator: e.target.value }))}
                    className="w-full px-2 py-1 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs"
                  >
                    {conditionOperators.map(op => (
                      <option key={op.id} value={op.id}>
                        {op.symbol} {op.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Value
                  </label>
                  {conditionForm.valueType === 'select' ? (
                    <select
                      value={conditionForm.value}
                      onChange={(e) => setConditionForm(prev => ({ ...prev, value: e.target.value }))}
                      className="w-full px-2 py-1 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs"
                    >
                      <option value="">Select value</option>
                      {conditionForm.valueOptions?.map(opt => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  ) : conditionForm.valueType === 'boolean' ? (
                    <select
                      value={conditionForm.value}
                      onChange={(e) => setConditionForm(prev => ({ ...prev, value: e.target.value }))}
                      className="w-full px-2 py-1 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs"
                    >
                      <option value="true">True</option>
                      <option value="false">False</option>
                    </select>
                  ) : (
                    <input
                      type={conditionForm.valueType}
                      value={conditionForm.value}
                      onChange={(e) => setConditionForm(prev => ({ ...prev, value: e.target.value }))}
                      className="w-full px-2 py-1 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs"
                      placeholder="Enter value"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Notification-specific settings */}
        {nodeForm.type === 'notification' && (
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Notification Recipients
            </label>
            <div className="border border-gray-300 rounded-xl p-2 max-h-40 overflow-y-auto">
              {sampleApprovers.map((approver) => (
                <label key={approver.id} className="flex items-center space-x-2 p-1.5 hover:bg-gray-50 rounded">
                  <input
                    type="checkbox"
                    checked={nodeForm.approvers?.some(a => a.id === approver.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setNodeForm(prev => ({
                          ...prev,
                          approvers: [...(prev.approvers || []), approver]
                        }));
                      } else {
                        setNodeForm(prev => ({
                          ...prev,
                          approvers: (prev.approvers || []).filter(a => a.id !== approver.id)
                        }));
                      }
                    }}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-sm">{approver.name}</div>
                    <div className="text-xs text-gray-500">{approver.role}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Position settings */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              X Position
            </label>
            <input
              type="number"
              value={nodeForm.position.x}
              onChange={(e) => setNodeForm(prev => ({
                ...prev,
                position: { ...prev.position, x: parseInt(e.target.value) || 0 }
              }))}
              className="w-full px-3 py-1.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Y Position
            </label>
            <input
              type="number"
              value={nodeForm.position.y}
              onChange={(e) => setNodeForm(prev => ({
                ...prev,
                position: { ...prev.position, y: parseInt(e.target.value) || 0 }
              }))}
              className="w-full px-3 py-1.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                Approval Workflow Configuration
              </h1>
              <p className="text-gray-600 mt-1">
                Design custom approval processes with conditional routing, thresholds, and multi-level approvals
              </p>
            </div>
            <div className="flex items-center space-x-2">
              {saveStatus && (
                <div className="px-3 py-1.5 bg-emerald-100 text-emerald-800 rounded-xl text-sm font-medium">
                  {saveStatus}
                </div>
              )}
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200 font-medium flex items-center gap-2"
              >
                <Plus size={18} />
                Create Workflow
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Workflow List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-gray-900">Workflows ({workflows.length})</h3>
                  <div className="flex items-center space-x-1">
                    <button className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors duration-200">
                      <Filter size={14} />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors duration-200">
                      <RefreshCw size={14} />
                    </button>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search workflows..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="max-h-[600px] overflow-y-auto">
                {isLoading ? (
                  <div className="p-8 text-center">
                    <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
                    <p className="mt-2 text-gray-600 text-sm">Loading workflows...</p>
                  </div>
                ) : workflows.filter(wf => 
                  wf.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  wf.description.toLowerCase().includes(searchQuery.toLowerCase())
                ).length === 0 ? (
                  <div className="p-8 text-center">
                    <Layers size={32} className="mx-auto text-gray-300 mb-3" />
                    <p className="text-gray-500 text-sm">No workflows found</p>
                  </div>
                ) : (
                  workflows
                    .filter(wf => 
                      wf.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      wf.description.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((workflow) => (
                      <div
                        key={workflow.id}
                        className={`p-3 border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors duration-200 ${
                          activeWorkflow?.id === workflow.id ? 'bg-blue-50 border-blue-200' : ''
                        }`}
                        onClick={() => setActiveWorkflow(workflow)}
                      >
                        <div className="flex items-start justify-between mb-1">
                          <div className="flex items-center space-x-2">
                            <div className={`w-2 h-2 rounded-full ${
                              workflow.isActive ? 'bg-emerald-500' : 'bg-gray-400'
                            }`}></div>
                            <h4 className="font-bold text-gray-900 text-sm">{workflow.name}</h4>
                          </div>
                          <div className="flex items-center space-x-1">
                            {workflow.priority === 1 && (
                              <span className="px-1.5 py-0.5 bg-blue-100 text-blue-800 text-xs rounded">
                                High
                              </span>
                            )}
                            {workflow.applyToAll && (
                              <span className="px-1.5 py-0.5 bg-purple-100 text-purple-800 text-xs rounded">
                                All
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="text-gray-600 text-xs mb-2 line-clamp-2">
                          {workflow.description}
                        </p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{workflow.nodes?.length || 0} steps</span>
                          <div className="flex items-center space-x-2">
                            {workflow.statistics && (
                              <span className="text-emerald-600 font-medium">
                                {workflow.statistics.completionRate}
                              </span>
                            )}
                            <ChevronRight size={12} />
                          </div>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="mt-4 bg-white rounded-2xl border border-gray-200 p-4">
              <h4 className="font-bold text-gray-900 mb-3">Workflow Statistics</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Active Workflows</span>
                  <span className="font-bold text-gray-900">
                    {workflows.filter(w => w.isActive).length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Steps</span>
                  <span className="font-bold text-gray-900">
                    {workflows.reduce((sum, w) => sum + (w.nodes?.length || 0), 0)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Auto-approval Rules</span>
                  <span className="font-bold text-gray-900">
                    {workflows.filter(w => w.autoApproveBelow).length}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content - Workflow Editor */}
          <div className="lg:col-span-3">
            {activeWorkflow ? (
              <div className="space-y-6">
                {/* Workflow Header */}
                <div className="bg-white rounded-2xl border border-gray-200 p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="flex items-center space-x-3 mb-1">
                        <h2 className="text-xl font-bold text-gray-900">{activeWorkflow.name}</h2>
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                          activeWorkflow.isActive 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {activeWorkflow.isActive ? 'Active' : 'Inactive'}
                        </span>
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                          Priority: {activeWorkflow.priority}
                        </span>
                      </div>
                      <p className="text-gray-600">{activeWorkflow.description}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="px-3 py-1.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
                      >
                        {isEditing ? <Save size={14} className="mr-1 inline" /> : <Edit size={14} className="mr-1 inline" />}
                        {isEditing ? 'Save Changes' : 'Edit Workflow'}
                      </button>
                      <button
                        onClick={() => saveWorkflow(activeWorkflow)}
                        disabled={isLoading}
                        className="px-3 py-1.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 disabled:opacity-50 transition-colors duration-200 text-sm font-medium"
                      >
                        {isLoading ? (
                          <div className="animate-spin w-3 h-3 border-2 border-white border-t-transparent rounded-full mx-2"></div>
                        ) : (
                          'Publish'
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Workflow Metadata */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="bg-gray-50 rounded-xl p-2">
                      <span className="text-xs text-gray-600">SLA</span>
                      <p className="font-bold text-gray-900">{activeWorkflow.slaHours || 72}h</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-2">
                      <span className="text-xs text-gray-600">Auto-approve Below</span>
                      <p className="font-bold text-gray-900">
                        {activeWorkflow.autoApproveBelow ? `MWK ${activeWorkflow.autoApproveBelow.toLocaleString()}` : 'Disabled'}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-2">
                      <span className="text-xs text-gray-600">CFO Required Above</span>
                      <p className="font-bold text-gray-900">
                        {activeWorkflow.requireCFOAbove ? `MWK ${activeWorkflow.requireCFOAbove.toLocaleString()}` : 'N/A'}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-2">
                      <span className="text-xs text-gray-600">Created By</span>
                      <p className="font-bold text-gray-900">{activeWorkflow.createdBy || 'Admin'}</p>
                    </div>
                  </div>
                </div>

                {/* Workflow Visualizer */}
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-gray-900">Workflow Designer</h3>
                      <div className="flex items-center space-x-2">
                        <button className="px-2 py-1 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors duration-200 text-xs font-medium">
                          <ZoomIn size={12} className="mr-1 inline" />
                          Zoom In
                        </button>
                        <button className="px-2 py-1 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors duration-200 text-xs font-medium">
                          <ZoomOut size={12} className="mr-1 inline" />
                          Zoom Out
                        </button>
                        <button className="px-2 py-1 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors duration-200 text-xs font-medium">
                          <Download size={12} className="mr-1 inline" />
                          Export
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    {renderWorkflowVisualizer()}
                  </div>
                </div>

                {/* Workflow Settings (Collapsible) */}
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                    <h3 className="font-bold text-gray-900">Workflow Configuration</h3>
                  </div>
                  <div className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Trigger Conditions */}
                      <div className="space-y-3">
                        <h4 className="font-bold text-gray-900 text-sm">Trigger Conditions</h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-700">Apply to All Requests</span>
                            <input
                              type="checkbox"
                              checked={activeWorkflow.applyToAll}
                              onChange={(e) => setActiveWorkflow(prev => ({ ...prev, applyToAll: e.target.checked }))}
                              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                            />
                          </div>
                          
                          {!activeWorkflow.applyToAll && (
                            <>
                              <div>
                                <label className="block text-sm text-gray-700 mb-1">Departments</label>
                                <div className="flex flex-wrap gap-1">
                                  {sampleDepartments.map(dept => (
                                    <label key={dept.id} className="inline-flex items-center">
                                      <input
                                        type="checkbox"
                                        checked={activeWorkflow.departments?.includes(dept.id)}
                                        onChange={(e) => {
                                          const updatedDepts = e.target.checked
                                            ? [...(activeWorkflow.departments || []), dept.id]
                                            : (activeWorkflow.departments || []).filter(id => id !== dept.id);
                                          setActiveWorkflow(prev => ({ ...prev, departments: updatedDepts }));
                                        }}
                                        className="w-3 h-3 text-blue-600 rounded focus:ring-blue-500"
                                      />
                                      <span className="ml-1 text-xs text-gray-700">{dept.name}</span>
                                    </label>
                                  ))}
                                </div>
                              </div>
                              
                              <div>
                                <label className="block text-sm text-gray-700 mb-1">Categories</label>
                                <div className="flex flex-wrap gap-1">
                                  {sampleCategories.map(cat => (
                                    <label key={cat.id} className="inline-flex items-center">
                                      <input
                                        type="checkbox"
                                        checked={activeWorkflow.categories?.includes(cat.id)}
                                        onChange={(e) => {
                                          const updatedCats = e.target.checked
                                            ? [...(activeWorkflow.categories || []), cat.id]
                                            : (activeWorkflow.categories || []).filter(id => id !== cat.id);
                                          setActiveWorkflow(prev => ({ ...prev, categories: updatedCats }));
                                        }}
                                        className="w-3 h-3 text-blue-600 rounded focus:ring-blue-500"
                                      />
                                      <span className="ml-1 text-xs text-gray-700">{cat.name}</span>
                                    </label>
                                  ))}
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="block text-sm text-gray-700 mb-1">Min Amount (MWK)</label>
                                  <input
                                    type="number"
                                    value={activeWorkflow.minAmount || ''}
                                    onChange={(e) => setActiveWorkflow(prev => ({ ...prev, minAmount: e.target.value }))}
                                    className="w-full px-3 py-1.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                    placeholder="0"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm text-gray-700 mb-1">Max Amount (MWK)</label>
                                  <input
                                    type="number"
                                    value={activeWorkflow.maxAmount || ''}
                                    onChange={(e) => setActiveWorkflow(prev => ({ ...prev, maxAmount: e.target.value }))}
                                    className="w-full px-3 py-1.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                    placeholder="No limit"
                                  />
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Approval Settings */}
                      <div className="space-y-3">
                        <h4 className="font-bold text-gray-900 text-sm">Approval Settings</h4>
                        <div className="space-y-2">
                          <div>
                            <label className="block text-sm text-gray-700 mb-1">SLA Hours</label>
                            <input
                              type="number"
                              value={activeWorkflow.slaHours || 72}
                              onChange={(e) => setActiveWorkflow(prev => ({ ...prev, slaHours: parseInt(e.target.value) || 72 }))}
                              className="w-full px-3 py-1.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm text-gray-700 mb-1">Auto-approve Below (MWK)</label>
                            <input
                              type="number"
                              value={activeWorkflow.autoApproveBelow || ''}
                              onChange={(e) => setActiveWorkflow(prev => ({ ...prev, autoApproveBelow: e.target.value ? parseInt(e.target.value) : null }))}
                              className="w-full px-3 py-1.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                              placeholder="Disable auto-approval"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm text-gray-700 mb-1">Require CFO Above (MWK)</label>
                            <input
                              type="number"
                              value={activeWorkflow.requireCFOAbove || 500000}
                              onChange={(e) => setActiveWorkflow(prev => ({ ...prev, requireCFOAbove: parseInt(e.target.value) || 500000 }))}
                              className="w-full px-3 py-1.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                            />
                          </div>
                          
                          <div className="space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-700">Require Legal Review</span>
                              <input
                                type="checkbox"
                                checked={activeWorkflow.requireLegalReview || false}
                                onChange={(e) => setActiveWorkflow(prev => ({ ...prev, requireLegalReview: e.target.checked }))}
                                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-700">Require IT Review</span>
                              <input
                                type="checkbox"
                                checked={activeWorkflow.requireITReview || false}
                                onChange={(e) => setActiveWorkflow(prev => ({ ...prev, requireITReview: e.target.checked }))}
                                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-700">Allow Delegation</span>
                              <input
                                type="checkbox"
                                checked={activeWorkflow.allowDelegation !== false}
                                onChange={(e) => setActiveWorkflow(prev => ({ ...prev, allowDelegation: e.target.checked }))}
                                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
                <Layers size={64} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">No Workflow Selected</h3>
                <p className="text-gray-600 mb-6">Select a workflow from the list or create a new one to start configuring approval processes.</p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200 font-medium"
                >
                  <Plus size={18} className="inline mr-2" />
                  Create New Workflow
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Workflow Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full">
            <div className="px-4 py-3 border-b border-gray-200 bg-blue-50">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Create New Approval Workflow</h2>
                  <p className="text-gray-600 text-sm mt-1">Define a new approval process with custom rules and thresholds</p>
                </div>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors duration-200"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
            
            <div className="p-4 max-h-[70vh] overflow-y-auto">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Workflow Name *
                    </label>
                    <input
                      type="text"
                      value={newWorkflow.name}
                      onChange={(e) => setNewWorkflow(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., Standard Procurement Workflow"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Priority
                    </label>
                    <select
                      value={newWorkflow.priority}
                      onChange={(e) => setNewWorkflow(prev => ({ ...prev, priority: parseInt(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="1">High (1)</option>
                      <option value="2">Medium (2)</option>
                      <option value="3">Low (3)</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={newWorkflow.description}
                    onChange={(e) => setNewWorkflow(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Describe what this workflow is for and when it should be used..."
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Auto-approve Below (MWK)
                    </label>
                    <input
                      type="number"
                      value={newWorkflow.autoApproveBelow}
                      onChange={(e) => setNewWorkflow(prev => ({ ...prev, autoApproveBelow: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Leave empty to disable"
                    />
                    <p className="text-xs text-gray-500 mt-1">Requests below this amount will auto-approve</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CFO Required Above (MWK)
                    </label>
                    <input
                      type="number"
                      value={newWorkflow.requireCFOAbove}
                      onChange={(e) => setNewWorkflow(prev => ({ ...prev, requireCFOAbove: parseInt(e.target.value) || 500000 }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="applyToAll"
                    checked={newWorkflow.applyToAll}
                    onChange={(e) => setNewWorkflow(prev => ({ ...prev, applyToAll: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="applyToAll" className="text-sm text-gray-700">
                    Apply this workflow to all requisition requests
                  </label>
                </div>
                
                {!newWorkflow.applyToAll && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Apply to Specific Departments
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {sampleDepartments.map(dept => (
                          <label key={dept.id} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={newWorkflow.departments.includes(dept.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setNewWorkflow(prev => ({ ...prev, departments: [...prev.departments, dept.id] }));
                                } else {
                                  setNewWorkflow(prev => ({ ...prev, departments: prev.departments.filter(id => id !== dept.id) }));
                                }
                              }}
                              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">{dept.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Apply to Specific Categories
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {sampleCategories.map(cat => (
                          <label key={cat.id} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={newWorkflow.categories.includes(cat.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setNewWorkflow(prev => ({ ...prev, categories: [...prev.categories, cat.id] }));
                                } else {
                                  setNewWorkflow(prev => ({ ...prev, categories: prev.categories.filter(id => id !== cat.id) }));
                                }
                              }}
                              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">{cat.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={newWorkflow.isActive}
                    onChange={(e) => setNewWorkflow(prev => ({ ...prev, isActive: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="isActive" className="text-sm text-gray-700">
                    Activate workflow immediately after creation
                  </label>
                </div>
              </div>
            </div>
            
            <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 flex justify-end space-x-2">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateWorkflow}
                disabled={!newWorkflow.name}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors duration-200 font-medium"
              >
                Create Workflow
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Node Configuration Modal */}
      {showNodeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200 bg-blue-50">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    {nodeForm.type === 'start' && <Play size={20} className="text-emerald-600" />}
                    {nodeForm.type === 'approval' && <UserCheck size={20} className="text-blue-600" />}
                    {nodeForm.type === 'condition' && <GitBranch size={20} className="text-amber-600" />}
                    {nodeForm.type === 'parallel' && <GitMerge size={20} className="text-purple-600" />}
                    {nodeForm.type === 'notification' && <Bell size={20} className="text-teal-600" />}
                    {nodeForm.type === 'end' && <StopCircle size={20} className="text-red-600" />}
                    {selectedNode ? 'Edit' : 'Add'} {nodeTypes.find(t => t.id === nodeForm.type)?.name}
                  </h2>
                  <p className="text-gray-600 text-sm mt-1">
                    Configure this step in your approval workflow
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowNodeModal(false);
                    setSelectedNode(null);
                    setNodeForm({
                      id: '',
                      name: '',
                      type: 'approval',
                      description: '',
                      approvers: [],
                      approvalType: 'sequential',
                      minApprovals: 1,
                      conditions: [],
                      actions: [],
                      timeoutHours: 24,
                      escalationTo: '',
                      isMandatory: true,
                      canDelegate: true,
                      position: { x: 0, y: 0 },
                      nextNodes: [],
                    });
                  }}
                  className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors duration-200"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
            
            <div className="p-4 max-h-[70vh] overflow-y-auto">
              {renderNodeConfigForm()}
            </div>
            
            <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 flex justify-end space-x-2">
              <button
                onClick={() => {
                  setShowNodeModal(false);
                  setSelectedNode(null);
                  setNodeForm({
                    id: '',
                    name: '',
                    type: 'approval',
                    description: '',
                    approvers: [],
                    approvalType: 'sequential',
                    minApprovals: 1,
                    conditions: [],
                    actions: [],
                    timeoutHours: 24,
                    escalationTo: '',
                    isMandatory: true,
                    canDelegate: true,
                    position: { x: 0, y: 0 },
                    nextNodes: [],
                  });
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNode}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200 font-medium"
              >
                Save Node
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}