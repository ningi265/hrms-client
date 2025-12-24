"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import {
  ChevronRight,
  Plus,
  Trash2,
  Edit,
  Save,
  X,
  DollarSign,
  Building,
  Copy,
  Download,
  Search,
  UserCheck,
  Zap,
  RefreshCw,
  Layers,
  Bell,
  Package,
  CreditCard,
  GitMerge,
  GitBranch,
  Play,
  StopCircle,
  ZoomIn,
  ZoomOut,
  Move,
  RotateCcw,
  AlertTriangle,
  AlertCircle,
} from "lucide-react"

// For icons that don't exist, let's create simple components
const Plane = (props) => (
  <svg
    {...props}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
  </svg>
)

const Forward = (props) => (
  <svg
    {...props}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="15 17 20 12 15 7" />
    <path d="M4 18v-5a3 3 0 0 1 3-3h11" />
  </svg>
)

const backendUrl =
  import.meta.env.VITE_ENV === "production"
    ? import.meta.env.VITE_BACKEND_URL_PROD
    : import.meta.env.VITE_BACKEND_URL_DEV

export default function ApprovalWorkflowConfig() {
  const [workflows, setWorkflows] = useState([])
  const [departments, setDepartments] = useState([])
  const [approvers, setApprovers] = useState([])
  const [categories, setCategories] = useState([])
  const [activeWorkflow, setActiveWorkflow] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showNodeModal, setShowNodeModal] = useState(false)
  const [selectedNode, setSelectedNode] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [isLoading, setIsLoading] = useState(false)
  const [saveStatus, setSaveStatus] = useState("")

  // Drag and Drop state
  const [draggedNodeId, setDraggedNodeId] = useState(null)
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 })
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragMovement, setDragMovement] = useState({ x: 0, y: 0 })
  const [dragThreshold] = useState(5) // Minimum pixels moved to consider it a drag

  // Connection creation state
  const [connectionMode, setConnectionMode] = useState({
    active: false,
    from: null,
    fromX: 0,
    fromY: 0,
    to: null,
    toX: 0,
    toY: 0,
  })

  const [hoverTarget, setHoverTarget] = useState(null)

  // Zoom state
  const [zoomLevel, setZoomLevel] = useState(1)

  // Confirmation modal state
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [confirmConfig, setConfirmConfig] = useState({
    title: "",
    message: "",
    type: "delete", // 'delete', 'warning', 'info'
    onConfirm: () => {},
    onCancel: () => {},
    confirmText: "Delete",
    cancelText: "Cancel",
    destructive: true,
  })

  // Workflow node types
  const nodeTypes = [
    { id: "start", name: "Start Node", icon: <Play size={16} />, color: "emerald" },
    { id: "approval", name: "Approval Step", icon: <UserCheck size={16} />, color: "blue" },
    { id: "condition", name: "Condition", icon: <GitBranch size={16} />, color: "amber" },
    { id: "parallel", name: "Parallel Approval", icon: <GitMerge size={16} />, color: "purple" },
    { id: "notification", name: "Notification", icon: <Bell size={16} />, color: "teal" },
    { id: "end", name: "End Node", icon: <StopCircle size={16} />, color: "red" },
  ]

  // Workflow Condition Operators
  const conditionOperators = [
    { id: "eq", name: "Equals", symbol: "=" },
    { id: "neq", name: "Not Equals", symbol: "≠" },
    { id: "gt", name: "Greater Than", symbol: ">" },
    { id: "gte", name: "Greater Than or Equal", symbol: "≥" },
    { id: "lt", name: "Less Than", symbol: "<" },
    { id: "lte", name: "Less Than or Equal", symbol: "≤" },
    { id: "contains", name: "Contains", symbol: "⊃" },
    { id: "in", name: "In List", symbol: "∈" },
    { id: "not-in", name: "Not In List", symbol: "∉" },
  ]

  // New workflow form state
  const [newWorkflow, setNewWorkflow] = useState({
    name: "",
    description: "",
    isActive: true,
    priority: 5,
    applyToAll: false,
    departments: [],
    categories: [],
    minAmount: 0,
    maxAmount: null,
    triggerConditions: [],
    nodes: [],
    connections: [],
    slaHours: 72,
    autoApproveBelow: null,
    requireCFOAbove: 500000,
    requireLegalReview: false,
    requireITReview: false,
    allowDelegation: true,
    notifications: [],
    version: "1.0",
    isDraft: false,
  })

  // Node form state
  const [nodeForm, setNodeForm] = useState({
    id: "",
    type: "approval",
    name: "",
    description: "",
    position: { x: 0, y: 0 },
    approvers: [],
    approvalType: "sequential",
    minApprovals: 1,
    conditions: [],
    trueBranch: "",
    falseBranch: "",
    timeoutHours: 24,
    escalationTo: "",
    isMandatory: true,
    canDelegate: true,
    actions: [],
  })

  // Condition form state
  const [conditionForm, setConditionForm] = useState({
    field: "",
    operator: "gt",
    value: "",
    logicalOperator: "AND",
  })

  // Available conditions/filters for workflows
  const [availableConditions, setAvailableConditions] = useState([
    {
      id: "estimatedCost",
      name: "Estimated Cost",
      type: "number",
      field: "estimatedCost",
      description: "Total cost of the requisition",
      unit: "MWK",
      icon: <DollarSign size={14} />,
    },
    {
      id: "department",
      name: "Department",
      type: "select",
      field: "department",
      description: "Requesting department",
      icon: <Building size={14} />,
    },
    {
      id: "category",
      name: "Item Category",
      type: "select",
      field: "category",
      description: "Category of requested items",
      icon: <Package size={14} />,
    },
    {
      id: "urgency",
      name: "Urgency Level",
      type: "select",
      field: "urgency",
      description: "Priority level of the request",
      icon: <Zap size={14} />,
    },
    {
      id: "budgetCode",
      name: "Budget Code",
      type: "text",
      field: "budgetCode",
      description: "Specific budget code",
      icon: <CreditCard size={14} />,
    },
  ])

  const workflowContainerRef = useRef(null)
  const workflowContentRef = useRef(null)

  // Load initial data from backend
  useEffect(() => {
    fetchWorkflows()
    fetchDepartments()
    fetchApprovers()
  }, [])

  // Auto-save when workflow configuration changes
  useEffect(() => {
    if (activeWorkflow && isEditing) {
      // Debounce auto-save to prevent too many API calls
      const timeoutId = setTimeout(() => {
        saveWorkflow(activeWorkflow)
      }, 1000) // Save after 1 second of no changes

      return () => clearTimeout(timeoutId)
    }
  }, [activeWorkflow, isEditing])

  // Confirmation Modal Functions
  const showConfirmation = (config) => {
    setConfirmConfig({
      title: config.title || "Are you sure?",
      message: config.message || "This action cannot be undone.",
      type: config.type || "delete",
      onConfirm: config.onConfirm || (() => {}),
      onCancel: config.onCancel || (() => {}),
      confirmText: config.confirmText || "Confirm",
      cancelText: config.cancelText || "Cancel",
      destructive: config.destructive !== false,
    })
    setShowConfirmModal(true)
  }

  const handleConfirm = () => {
    confirmConfig.onConfirm()
    setShowConfirmModal(false)
  }

  const handleCancel = () => {
    confirmConfig.onCancel()
    setShowConfirmModal(false)
  }

  const handleCancelConnection = () => {
    setConnectionMode({
      active: false,
      from: null,
      fromX: 0,
      fromY: 0,
      to: null,
      toX: 0,
      toY: 0,
    })
    setHoverTarget(null)
  }

  // Handle keyboard shortcuts for zoom and modal close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        if (connectionMode.active) {
          e.preventDefault()
          handleCancelConnection()
        } else if (showConfirmModal) {
          e.preventDefault()
          handleCancel()
        }
        return
      }

      // Ctrl/Cmd + = for zoom in
      if ((e.ctrlKey || e.metaKey) && (e.key === "=" || e.key === "+")) {
        e.preventDefault()
        handleZoomIn()
      }
      // Ctrl/Cmd + - for zoom out
      if ((e.ctrlKey || e.metaKey) && e.key === "-") {
        e.preventDefault()
        handleZoomOut()
      }
      // Ctrl/Cmd + 0 for reset zoom
      if ((e.ctrlKey || e.metaKey) && e.key === "0") {
        e.preventDefault()
        handleZoomReset()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [connectionMode.active, showConfirmModal])

  const fetchWorkflows = async () => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        console.error("No authentication token found")
        return
      }

      const response = await fetch(`${backendUrl}/api/workflows`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        const data = await response.json()
        setWorkflows(data.data || data)
      } else {
        console.error("Failed to fetch workflows")
      }
    } catch (error) {
      console.error("Error fetching workflows:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchDepartments = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${backendUrl}/api/departments`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        const data = await response.json()
        setDepartments(data.data || data)

        setAvailableConditions((prev) =>
          prev.map((condition) => {
            if (condition.id === "department") {
              return {
                ...condition,
                options: (data.data || data).map((dept) => ({
                  value: dept._id || dept.id,
                  label: dept.name,
                })),
              }
            }
            return condition
          }),
        )
      }
    } catch (error) {
      console.error("Error fetching departments:", error)
    }
  }

  const fetchApprovers = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${backendUrl}/api/users?role=approver`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        const data = await response.json()
        setApprovers(data.data || data)
      }
    } catch (error) {
      console.error("Error fetching approvers:", error)
    }
  }

  const saveWorkflow = async (workflow) => {
    setIsLoading(true)
    setSaveStatus("Saving...")

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("No authentication token found")
      }

      const userStr = localStorage.getItem("user")
      let userId = null
      let companyId = null

      if (userStr) {
        try {
          const user = JSON.parse(userStr)
          userId = user.id || user._id
          companyId = user.company
        } catch (e) {
          console.error("Error parsing user data:", e)
        }
      }

      // Prepare workflow data for backend
      const workflowToSave = {
        ...workflow,
        nodes: (workflow.nodes || []).map((node) => ({
          ...node,
          approvers: (node.approvers || []).map((approver) => ({
            userId: approver._id || approver.id || approver.userId,
            name: approver.name || approver.firstName + " " + approver.lastName,
            email: approver.email,
            role: approver.role || "Approver",
          })),
        })),
        departments: (workflow.departments || []).map((dept) => dept._id || dept.id || dept),
        company: companyId || workflow.company,
        createdBy: userId || workflow.createdBy,
        _id: workflow._id ? workflow._id : undefined,
      }

      const url = workflow._id ? `${backendUrl}/api/workflows/${workflow._id}` : `${backendUrl}/api/workflows`

      const method = workflow._id ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(workflowToSave),
      })

      if (response.ok) {
        const savedWorkflow = await response.json()
        setSaveStatus("Saved successfully!")

        // Update the workflows list
        await fetchWorkflows()

        // Update active workflow with server response
        if (activeWorkflow?._id === workflow._id) {
          setActiveWorkflow(savedWorkflow.data || savedWorkflow)
        }

        setTimeout(() => setSaveStatus(""), 3000)
        return true
      } else {
        const errorData = await response.json().catch(() => ({ message: "Unknown error" }))
        console.error("Error response:", errorData)
        setSaveStatus(`Error: ${errorData.message || "Failed to save"}`)
        return false
      }
    } catch (error) {
      console.error("Save error:", error)
      setSaveStatus(`Error: ${error.message}`)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const publishWorkflow = async (workflowId) => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${backendUrl}/api/workflows/${workflowId}/publish`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        setSaveStatus("Published successfully!")
        fetchWorkflows()
        setTimeout(() => setSaveStatus(""), 3000)
      } else {
        const error = await response.json()
        setSaveStatus(`Publish failed: ${error.message}`)
      }
    } catch (error) {
      setSaveStatus(`Error: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const deleteWorkflow = async (workflowId) => {
    showConfirmation({
      title: "Delete Workflow",
      message: "Are you sure you want to delete this workflow? This action cannot be undone.",
      type: "delete",
      onConfirm: async () => {
        try {
          const token = localStorage.getItem("token")
          const response = await fetch(`${backendUrl}/api/workflows/${workflowId}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          })

          if (response.ok) {
            setWorkflows((prev) => prev.filter((w) => w._id !== workflowId))
            if (activeWorkflow?._id === workflowId) {
              setActiveWorkflow(null)
            }
          } else {
            const error = await response.json()
            alert(`Delete failed: ${error.message}`)
          }
        } catch (error) {
          alert(`Error: ${error.message}`)
        }
      },
      onCancel: () => {},
      confirmText: "Delete",
      cancelText: "Cancel",
      destructive: true,
    })
  }

  const cloneWorkflow = async (workflowId) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${backendUrl}/api/workflows/${workflowId}/clone`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: `${activeWorkflow.name} (Copy)`,
          description: activeWorkflow.description,
        }),
      })

      if (response.ok) {
        const cloned = await response.json()
        fetchWorkflows()
        setActiveWorkflow(cloned.data || cloned)
      }
    } catch (error) {
      console.error("Error cloning workflow:", error)
    }
  }

  const handleCreateWorkflow = async () => {
    if (!newWorkflow.name) {
      showConfirmation({
        title: "Missing Information",
        message: "Please enter a workflow name before creating.",
        type: "warning",
        onConfirm: () => {},
        onCancel: () => {},
        confirmText: "OK",
        cancelText: "",
        destructive: false,
      })
      return
    }

    const userStr = localStorage.getItem("user")
    let userId = null
    let companyId = null

    if (userStr) {
      try {
        const user = JSON.parse(userStr)
        userId = user.id || user._id
        companyId = user.company
      } catch (e) {
        console.error("Error parsing user data:", e)
      }
    }

    const workflowToCreate = {
      ...newWorkflow,
      createdBy: userId,
      company: companyId,
      nodes: [
        {
          id: `start-${Date.now()}`,
          type: "start",
          name: "Start",
          description: "Workflow start point",
          position: { x: 100, y: 100 },
          approvers: [],
          approvalType: "sequential",
          minApprovals: 1,
          conditions: [],
          trueBranch: "",
          falseBranch: "",
          timeoutHours: 24,
          escalationTo: "",
          isMandatory: true,
          canDelegate: true,
          actions: [],
        },
        {
          id: `end-${Date.now() + 1}`,
          type: "end",
          name: "End",
          description: "Workflow end point",
          position: { x: 400, y: 100 },
          approvers: [],
          approvalType: "sequential",
          minApprovals: 1,
          conditions: [],
          trueBranch: "",
          falseBranch: "",
          timeoutHours: 24,
          escalationTo: "",
          isMandatory: true,
          canDelegate: true,
          actions: [],
        },
      ],
      connections: [],
      isDraft: true,
    }

    const created = await saveWorkflow(workflowToCreate)
    if (created) {
      setShowCreateModal(false)
      setNewWorkflow({
        name: "",
        description: "",
        isActive: true,
        priority: 5,
        applyToAll: false,
        departments: [],
        categories: [],
        minAmount: 0,
        maxAmount: null,
        triggerConditions: [],
        nodes: [],
        connections: [],
        slaHours: 72,
        autoApproveBelow: null,
        requireCFOAbove: 500000,
        requireLegalReview: false,
        requireITReview: false,
        allowDelegation: true,
        notifications: [],
        version: "1.0",
        isDraft: true,
      })
    }
  }

  const handleAddNode = (type) => {
    const centerX = 400
    const centerY = 300
    const radius = 200
    const angle = Math.random() * Math.PI * 2

    const newNode = {
      id: `${type}-${Date.now()}`,
      type,
      name: `New ${nodeTypes.find((t) => t.id === type)?.name || "Node"}`,
      description: "",
      position: {
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
      },
      approvers: [],
      approvalType: "sequential",
      minApprovals: 1,
      conditions: [],
      trueBranch: "",
      falseBranch: "",
      timeoutHours: 24,
      escalationTo: "",
      isMandatory: true,
      canDelegate: true,
      actions: [],
    }

    setNodeForm(newNode)
    setSelectedNode(newNode)
    setShowNodeModal(true)
  }

  const handleSaveNode = async () => {
    if (!activeWorkflow) return

    const updatedNodes = [...(activeWorkflow.nodes || [])]
    const existingIndex = updatedNodes.findIndex((n) => n.id === nodeForm.id)

    if (existingIndex >= 0) {
      updatedNodes[existingIndex] = nodeForm
    } else {
      updatedNodes.push(nodeForm)
    }

    // Create updated workflow object
    const updatedWorkflow = {
      ...activeWorkflow,
      nodes: updatedNodes,
    }

    // Update frontend state immediately for responsiveness
    setActiveWorkflow(updatedWorkflow)

    // Save to backend
    const saveSuccessful = await saveWorkflow(updatedWorkflow)

    if (saveSuccessful) {
      setShowNodeModal(false)
      setNodeForm({
        id: "",
        type: "approval",
        name: "",
        description: "",
        position: { x: 0, y: 0 },
        approvers: [],
        approvalType: "sequential",
        minApprovals: 1,
        conditions: [],
        trueBranch: "",
        falseBranch: "",
        timeoutHours: 24,
        escalationTo: "",
        isMandatory: true,
        canDelegate: true,
        actions: [],
      })
      setSelectedNode(null)
    } else {
      // Revert frontend state if save failed
      setActiveWorkflow(activeWorkflow)
      showConfirmation({
        title: "Save Failed",
        message: "Failed to save node. Please try again.",
        type: "warning",
        onConfirm: () => {},
        onCancel: () => {},
        confirmText: "OK",
        cancelText: "",
        destructive: false,
      })
    }
  }

  const handleAddCondition = () => {
    if (!nodeForm.conditions) {
      setNodeForm((prev) => ({ ...prev, conditions: [] }))
    }

    const newCondition = {
      field: conditionForm.field,
      operator: conditionForm.operator,
      value: conditionForm.value,
      logicalOperator: conditionForm.logicalOperator,
    }

    setNodeForm((prev) => ({
      ...prev,
      conditions: [...prev.conditions, newCondition],
    }))

    setConditionForm({
      field: "",
      operator: "gt",
      value: "",
      logicalOperator: "AND",
    })
  }

  // DRAG AND DROP FUNCTIONS
  const handleNodeDragStart = (e, nodeId) => {
    e.stopPropagation()
    setIsDragging(true)
    setDraggedNodeId(nodeId)
    // Reset drag movement
    setDragMovement({ x: 0, y: 0 })

    const containerRect = workflowContainerRef.current?.getBoundingClientRect()
    if (containerRect) {
      const clientX = e.clientX || e.touches[0].clientX
      const clientY = e.clientY || e.touches[0].clientY
      // Normalize by zoom level
      setDragStartPos({
        x: (clientX - containerRect.left) / zoomLevel,
        y: (clientY - containerRect.top) / zoomLevel,
      })
      setDragOffset({ x: 0, y: 0 })
    }
  }

  const handleNodeDragMove = useCallback(
    (clientX, clientY) => {
      if (!isDragging || !draggedNodeId || !workflowContainerRef.current) return

      const containerRect = workflowContainerRef.current.getBoundingClientRect()
      const containerX = (clientX - containerRect.left) / zoomLevel
      const containerY = (clientY - containerRect.top) / zoomLevel

      const deltaX = containerX - dragStartPos.x
      const deltaY = containerY - dragStartPos.y

      // Update drag movement
      setDragMovement((prev) => ({
        x: prev.x + Math.abs(deltaX),
        y: prev.y + Math.abs(deltaY),
      }))

      setDragOffset({ x: deltaX, y: deltaY })

      const updatedNodes = activeWorkflow.nodes.map((node) => {
        if (node.id === draggedNodeId) {
          return {
            ...node,
            position: {
              x: Math.max(0, node.position.x + deltaX),
              y: Math.max(0, node.position.y + deltaY),
            },
          }
        }
        return node
      })

      setActiveWorkflow((prev) => ({ ...prev, nodes: updatedNodes }))
      setDragStartPos({ x: containerX, y: containerY })
    },
    [isDragging, draggedNodeId, dragStartPos, zoomLevel, activeWorkflow],
  )

  const handleNodeDragEnd = async () => {
    // Reset dragging state first
    setIsDragging(false)
    setDraggedNodeId(null)

    // Only save if there was actual movement
    if (dragOffset.x !== 0 || dragOffset.y !== 0) {
      // Auto-save after drag ends
      await saveWorkflow(activeWorkflow)
    }

    // Reset movement tracking
    setDragMovement({ x: 0, y: 0 })
    setDragOffset({ x: 0, y: 0 })
  }

  // CONNECTION FUNCTIONS
  const handleStartConnection = (nodeId, nodeX, nodeY) => {
    setHoverTarget(null)
    setConnectionMode({
      active: true,
      from: nodeId,
      fromX: nodeX,
      fromY: nodeY,
      to: nodeX, // Initialize 'to' position to 'from' for the visual line
      toY: nodeY,
    })
  }

  const handleCompleteConnection = async (nodeId, nodeX, nodeY) => {
    if (!connectionMode.active || !connectionMode.from) {
      handleCancelConnection()
      return
    }

    // Prevent self-connections
    if (connectionMode.from === nodeId) {
      handleCancelConnection()
      return
    }

    const isDuplicate = activeWorkflow.connections?.some(
      (conn) => conn.from === connectionMode.from && conn.to === nodeId,
    )

    if (isDuplicate) {
      showConfirmation({
        title: "Duplicate Connection",
        message: "A connection already exists between these nodes.",
        type: "info",
        onConfirm: () => handleCancelConnection(),
        onCancel: () => {},
        confirmText: "OK",
        cancelText: "",
        destructive: false,
      })
      return
    }

    const connectionId = `conn-${Date.now()}`
    const newConnection = {
      id: connectionId,
      from: connectionMode.from,
      to: nodeId,
    }

    const updatedConnections = [...(activeWorkflow.connections || []), newConnection]

    const updatedWorkflow = {
      ...activeWorkflow,
      connections: updatedConnections,
    }

    setActiveWorkflow(updatedWorkflow)

    // Save connection to backend
    await saveWorkflow(updatedWorkflow)

    handleCancelConnection()
  }

  const handleDeleteConnection = async (connectionId) => {
    if (!activeWorkflow?.connections) return

    showConfirmation({
      title: "Delete Connection",
      message: "Are you sure you want to delete this connection?",
      type: "delete",
      onConfirm: async () => {
        const updatedConnections = activeWorkflow.connections.filter((conn) => conn.id !== connectionId)

        const updatedWorkflow = {
          ...activeWorkflow,
          connections: updatedConnections,
        }

        setActiveWorkflow(updatedWorkflow)

        // Save to backend
        await saveWorkflow(updatedWorkflow)
      },
      onCancel: () => {},
      confirmText: "Delete",
      cancelText: "Keep",
      destructive: true,
    })
  }

  // ZOOM FUNCTIONS
  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev * 1.2, 3))
  }

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev / 1.2, 0.3))
  }

  const handleZoomReset = () => {
    setZoomLevel(1)
  }

  const handleWheel = (e) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault()
      if (e.deltaY < 0) {
        handleZoomIn()
      } else {
        handleZoomOut()
      }
    }
  }

  const handleDeleteNode = async (nodeId) => {
    if (!activeWorkflow) return

    showConfirmation({
      title: "Delete Node",
      message: "Are you sure you want to delete this node? All connections to this node will also be removed.",
      type: "delete",
      onConfirm: async () => {
        // Remove the node
        const updatedNodes = activeWorkflow.nodes.filter((node) => node.id !== nodeId)

        // Remove all connections that reference this node
        const updatedConnections = (activeWorkflow.connections || []).filter(
          (conn) => conn.from !== nodeId && conn.to !== nodeId,
        )

        const updatedWorkflow = {
          ...activeWorkflow,
          nodes: updatedNodes,
          connections: updatedConnections,
        }

        setActiveWorkflow(updatedWorkflow)

        // Save to backend
        const saveSuccessful = await saveWorkflow(updatedWorkflow)

        if (!saveSuccessful) {
          // Revert on failure
          setActiveWorkflow(activeWorkflow)
          showConfirmation({
            title: "Delete Failed",
            message: "Failed to delete node. Please try again.",
            type: "warning",
            onConfirm: () => {},
            onCancel: () => {},
            confirmText: "OK",
            cancelText: "",
            destructive: false,
          })
        }
      },
      onCancel: () => {},
      confirmText: "Delete",
      cancelText: "Keep",
      destructive: true,
    })
  }

  // Mouse event handlers for drag and drop
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging) {
        handleNodeDragMove(e.clientX, e.clientY)
      }
    }

    const handleMouseUp = () => {
      if (isDragging) {
        handleNodeDragEnd()
      }
    }

    const handleTouchMove = (e) => {
      if (isDragging && e.touches.length === 1) {
        e.preventDefault()
        handleNodeDragMove(e.touches[0].clientX, e.touches[0].clientY)
      }
    }

    const handleTouchEnd = () => {
      if (isDragging) {
        handleNodeDragEnd()
      }
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)
    document.addEventListener("touchmove", handleTouchMove, { passive: false })
    document.addEventListener("touchend", handleTouchEnd)

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
      document.removeEventListener("touchmove", handleTouchMove)
      document.removeEventListener("touchend", handleTouchEnd)
    }
  }, [isDragging, handleNodeDragMove])

  const renderWorkflowVisualizer = () => {
    if (!activeWorkflow?.nodes?.length) {
      return (
        <div className="flex flex-col items-center justify-center h-full min-h-[400px] bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300 p-8">
          <Layers size={48} className="text-gray-400 mb-4" />
          <h3 className="text-lg font-bold text-gray-900 mb-2">No Workflow Nodes</h3>
          <p className="text-gray-600 text-center mb-4">Start building your approval workflow by adding nodes</p>
          <button
            onClick={() => handleAddNode("start")}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200 font-medium"
          >
            <Plus size={16} className="inline mr-2" />
            Add Start Node
          </button>
        </div>
      )
    }

    return (
      <div className="relative h-[600px] bg-gray-50 rounded-2xl border border-gray-300 overflow-hidden">
        {/* Zoom Controls Only */}
        <div className="absolute top-4 left-4 z-30">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-gray-300 shadow-sm p-2 flex items-center space-x-2">
            <button
              onClick={handleZoomOut}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              title="Zoom Out (Ctrl/Cmd + -)"
            >
              <ZoomOut size={16} className="text-gray-700" />
            </button>
            <div className="flex items-center space-x-1">
              <span className="text-sm font-medium w-12 text-center">{Math.round(zoomLevel * 100)}%</span>
              <button
                onClick={handleZoomReset}
                className="p-1 hover:bg-gray-100 rounded transition-colors duration-200"
                title="Reset Zoom (Ctrl/Cmd + 0)"
              >
                <RotateCcw size={12} className="text-gray-600" />
              </button>
            </div>
            <button
              onClick={handleZoomIn}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              title="Zoom In (Ctrl/Cmd + +)"
            >
              <ZoomIn size={16} className="text-gray-700" />
            </button>
            <div className="w-px h-6 bg-gray-300 mx-1"></div>
            <div className="text-xs text-gray-500">Ctrl/Cmd + Scroll to zoom</div>
          </div>
        </div>

        {/* Connection creation overlay */}
        {connectionMode.active && (
          <div className="absolute inset-0 z-40 pointer-events-none">
            <svg
              className="w-full h-full"
              style={{
                transform: `scale(${zoomLevel})`,
                transformOrigin: "top left",
              }}
            >
              <defs>
                <marker id="arrowhead-preview" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill="#3b82f6" />
                </marker>
              </defs>
              <line
                x1={connectionMode.fromX}
                y1={connectionMode.fromY}
                x2={connectionMode.toX}
                y2={connectionMode.toY}
                stroke="#3b82f6"
                strokeWidth="2"
                strokeDasharray="5,5"
                markerEnd="url(#arrowhead-preview)"
              />
            </svg>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-3 pointer-events-auto">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg shadow-lg">
                <span className="text-sm font-semibold">Click on a node to complete the connection</span>
              </div>
              <button
                onClick={handleCancelConnection}
                className="flex items-center gap-2 bg-white text-gray-700 px-4 py-2 rounded-lg shadow-md hover:bg-gray-50 hover:shadow-lg transition-all duration-200 border border-gray-200"
              >
                <X size={16} />
                <span className="text-sm font-medium">Cancel (Esc)</span>
              </button>
            </div>
          </div>
        )}

        {/* WORKFLOW VIEWPORT (Never scaled) */}
        <div
          ref={workflowContainerRef}
          className="relative w-full h-full overflow-auto"
          onWheel={handleWheel}
          onMouseMove={(e) => {
            if (connectionMode.active && workflowContainerRef.current) {
              const containerRect = workflowContainerRef.current.getBoundingClientRect()
              const scrollLeft = workflowContainerRef.current.scrollLeft
              const scrollTop = workflowContainerRef.current.scrollTop

              // Convert viewport coordinates to scaled content coordinates
              const contentX = (e.clientX - containerRect.left + scrollLeft) / zoomLevel
              const contentY = (e.clientY - containerRect.top + scrollTop) / zoomLevel

              setConnectionMode((prev) => ({
                ...prev,
                toX: contentX,
                toY: contentY,
              }))
            }
          }}
          onClick={(e) => {
            if (connectionMode.active && e.target === workflowContainerRef.current) {
              handleCancelConnection()
            }
          }}
        >
          {/* GRID LAYER (Fixed scale, NOT scaled with zoom) */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `
                linear-gradient(rgba(0, 0, 0, 0.05) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0, 0, 0, 0.05) 1px, transparent 1px)
              `,
              backgroundSize: "20px 20px", // Fixed size, independent of zoom
            }}
          />

          {/* CONTENT LAYER (Scaled content) */}
          <div
            ref={workflowContentRef}
            className="absolute inset-0 origin-top-left"
            style={{
              transform: `scale(${zoomLevel})`,
            }}
          >
            {/* Connections SVG - SIMPLIFIED, no delete buttons here */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill="#3b82f6" />
                </marker>
              </defs>

              {activeWorkflow.connections?.map((conn, index) => {
                const fromNode = activeWorkflow.nodes.find((n) => n.id === conn.from)
                const toNode = activeWorkflow.nodes.find((n) => n.id === conn.to)

                if (!fromNode || !toNode) return null

                const x1 = fromNode.position.x + 100
                const y1 = fromNode.position.y + 50
                const x2 = toNode.position.x
                const y2 = toNode.position.y + 50

                // Calculate control points for curve
                const ctrlX1 = x1 + 100
                const ctrlX2 = x2 - 100

                return (
                  <g key={conn.id || index} className="connection-group">
                    {/* Connection path - still in SVG for smooth curves */}
                    <path
                      d={`M ${x1} ${y1} C ${ctrlX1} ${y1}, ${ctrlX2} ${y2}, ${x2} ${y2}`}
                      stroke="#3b82f6"
                      strokeWidth="2"
                      fill="none"
                      markerEnd="url(#arrowhead)"
                      className="pointer-events-none"
                    />

                    {/* Connection label if exists */}
                    {conn.condition && (
                      <text
                        x={x1 + (x2 - x1) / 2}
                        y={y1 + (y2 - y1) / 2 - 15}
                        textAnchor="middle"
                        fill="#6b7280"
                        fontSize="10"
                        fontWeight="500"
                        className="pointer-events-none"
                      >
                        {conn.condition}
                      </text>
                    )}
                  </g>
                )
              })}
            </svg>

            {/* Render nodes */}
            {activeWorkflow.nodes.map((node) => {
              const isBeingDragged = draggedNodeId === node.id
              const currentPosition = {
                x: node.position.x + (isBeingDragged ? dragOffset.x : 0),
                y: node.position.y + (isBeingDragged ? dragOffset.y : 0),
              }

              return (
                <div
                  key={node.id}
                  className={`absolute cursor-${isDragging ? "grabbing" : connectionMode.active ? "pointer" : "grab"}`}
                  style={{
                    left: `${currentPosition.x}px`,
                    top: `${currentPosition.y}px`,
                    transition: isDragging ? "none" : "transform 0.2s ease",
                    transform: hoverTarget === node.id ? "scale(1.05)" : "scale(1)",
                    zIndex: isBeingDragged ? 50 : hoverTarget === node.id ? 40 : 30,
                  }}
                  onMouseDown={(e) => handleNodeDragStart(e, node.id)}
                  onTouchStart={(e) => {
                    // For touch devices, prevent default to avoid scrolling while dragging
                    e.preventDefault()
                    handleNodeDragStart(e, node.id)
                  }}
                  onMouseEnter={() => {
                    if (connectionMode.active && connectionMode.from !== node.id) {
                      setHoverTarget(node.id)
                    }
                  }}
                  onMouseLeave={() => {
                    if (connectionMode.active) {
                      setHoverTarget(null)
                    }
                  }}
                  onClick={(e) => {
                    if (connectionMode.active && connectionMode.from !== node.id) {
                      e.stopPropagation()
                      handleCompleteConnection(node.id, currentPosition.x + 100, currentPosition.y + 50)
                      return
                    }

                    // Only open modal if:
                    // 1. Not currently dragging
                    // 2. Not in connection mode
                    // 3. Drag movement was below threshold (wasn't actually a drag, just a click)
                    if (
                      !isDragging &&
                      !connectionMode.active &&
                      dragMovement.x < dragThreshold &&
                      dragMovement.y < dragThreshold
                    ) {
                      e.stopPropagation()
                      setSelectedNode(node)
                      setNodeForm(node)
                      setShowNodeModal(true)
                    }
                  }}
                >
                  <div
                    className={`w-48 p-3 rounded-xl border-2 transition-all duration-200 shadow-md ${
                      hoverTarget === node.id
                        ? "border-blue-500 shadow-lg shadow-blue-500/50 ring-2 ring-blue-400"
                        : node.type === "start"
                          ? "bg-emerald-50 border-emerald-300 hover:border-emerald-400"
                          : node.type === "approval"
                            ? "bg-blue-50 border-blue-300 hover:border-blue-400"
                            : node.type === "condition"
                              ? "bg-amber-50 border-amber-300 hover:border-amber-400"
                              : node.type === "parallel"
                                ? "bg-purple-50 border-purple-300 hover:border-purple-400"
                                : node.type === "notification"
                                  ? "bg-teal-50 border-teal-300 hover:border-teal-400"
                                  : "bg-red-50 border-red-300 hover:border-red-400"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {node.type === "start" && <Play size={16} className="text-emerald-600" />}
                        {node.type === "approval" && <UserCheck size={16} className="text-blue-600" />}
                        {node.type === "condition" && <GitBranch size={16} className="text-amber-600" />}
                        {node.type === "parallel" && <GitMerge size={16} className="text-purple-600" />}
                        {node.type === "notification" && <Bell size={16} className="text-teal-600" />}
                        {node.type === "end" && <StopCircle size={16} className="text-red-600" />}
                        <span className="font-bold text-sm">{node.name}</span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteNode(node.id)
                        }}
                        className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors duration-200"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>

                    <div className="text-xs text-gray-600 space-y-1">
                      {node.type === "approval" && (
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
                      {node.type === "condition" && node.conditions?.length > 0 && (
                        <div className="text-xs">
                          {node.conditions[0].field}: {node.conditions[0].operator} {node.conditions[0].value}
                        </div>
                      )}
                    </div>

                    <div className="mt-2 pt-2 border-t border-gray-200">
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>ID: {node.id.slice(0, 8)}</span>
                        <Move size={10} className={isBeingDragged ? "animate-pulse" : ""} />
                      </div>
                    </div>
                  </div>

                  {!connectionMode.active && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleStartConnection(node.id, currentPosition.x + 100, currentPosition.y + 50)
                      }}
                      className="absolute -right-3 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full hover:from-blue-600 hover:to-blue-700 hover:scale-110 transition-all duration-200 flex items-center justify-center z-20 shadow-lg"
                      title="Create connection"
                    >
                      <Plus size={14} strokeWidth={3} />
                    </button>
                  )}

                  {connectionMode.active && connectionMode.from === node.id && (
                    <div className="absolute -inset-1 border-2 border-blue-500 rounded-xl animate-pulse pointer-events-none" />
                  )}

                  {/* Drag handle overlay */}
                  <div className="absolute inset-0 cursor-grab active:cursor-grabbing"></div>
                </div>
              )
            })}
          </div>

          {/* Connection delete buttons - OUTSIDE scaled content layer, fixed position */}
          {activeWorkflow.connections?.map((conn, index) => {
            const fromNode = activeWorkflow.nodes.find((n) => n.id === conn.from)
            const toNode = activeWorkflow.nodes.find((n) => n.id === conn.to)

            if (!fromNode || !toNode) return null

            // Calculate midpoint in world coordinates
            const midX = fromNode.position.x + (toNode.position.x - fromNode.position.x) / 2 + 50 // +50 to adjust for node width
            const midY = fromNode.position.y + (toNode.position.y - fromNode.position.y) / 2 + 50 // +50 to adjust for node height/2

            // Apply zoom to position for correct placement
            const scaledMidX = midX * zoomLevel
            const scaledMidY = midY * zoomLevel

            return (
              <div
                key={`delete-${conn.id || index}`}
                className="absolute z-30"
                style={{
                  left: `${scaledMidX - 12}px`, // -12 to center the 24px button
                  top: `${scaledMidY - 12}px`,
                }}
              >
                <button
                  onClick={() => handleDeleteConnection(conn.id || index)}
                  className="w-6 h-6 bg-white border-2 border-red-300 rounded-full hover:bg-red-50 hover:border-red-400 hover:scale-110 transition-all duration-200 flex items-center justify-center shadow-sm"
                  title="Delete connection"
                >
                  <X size={12} className="text-red-500" />
                </button>
              </div>
            )
          })}

          {/* Add node button - OUTSIDE content layer, stays fixed */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-gray-300 shadow-sm p-2">
              <div className="text-xs font-medium text-gray-700 mb-2 text-center">Add Node</div>
              <div className="flex flex-wrap gap-1 justify-center">
                {nodeTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => handleAddNode(type.id)}
                    className={`p-1.5 rounded-lg border text-xs font-medium flex items-center gap-1 ${
                      type.id === "start"
                        ? "border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                        : type.id === "approval"
                          ? "border-blue-200 text-blue-700 hover:bg-blue-50"
                          : type.id === "condition"
                            ? "border-amber-200 text-amber-700 hover:bg-amber-50"
                            : type.id === "parallel"
                              ? "border-purple-200 text-purple-700 hover:bg-purple-50"
                              : type.id === "notification"
                                ? "border-teal-200 text-teal-700 hover:bg-teal-50"
                                : "border-red-200 text-red-700 hover:bg-red-50"
                    }`}
                  >
                    {type.icon}
                    <span>{type.name.split(" ")[0]}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Status indicator - also stays fixed outside content layer */}
          <div className="absolute top-4 right-4 z-20">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-gray-300 shadow-sm px-3 py-1.5">
              <div className="flex items-center space-x-2 text-xs text-gray-600">
                <span>Zoom: {Math.round(zoomLevel * 100)}%</span>
                <span>•</span>
                <span>Nodes: {activeWorkflow.nodes.length}</span>
                <span>•</span>
                <span>Connections: {activeWorkflow.connections?.length || 0}</span>
                {connectionMode.active && (
                  <>
                    <span>•</span>
                    <span className="text-blue-600 font-medium">Connection Mode Active</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderNodeConfigForm = () => {
    const selectedCondition = availableConditions.find((c) => c.id === conditionForm.field)

    return (
      <div className="space-y-4">
        {/* Basic Info */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Node Name *</label>
            <input
              type="text"
              value={nodeForm.name}
              onChange={(e) => setNodeForm((prev) => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-1.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              placeholder="e.g., Department Head Approval"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Node Type</label>
            <div className="flex items-center space-x-2 p-1.5 bg-gray-100 rounded-xl text-sm">
              {nodeTypes.find((t) => t.id === nodeForm.type)?.icon}
              <span className="font-medium">{nodeTypes.find((t) => t.id === nodeForm.type)?.name}</span>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
          <textarea
            value={nodeForm.description}
            onChange={(e) => setNodeForm((prev) => ({ ...prev, description: e.target.value }))}
            rows={2}
            className="w-full px-3 py-1.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            placeholder="Describe what this approval step entails..."
          />
        </div>

        {/* Approval-specific settings */}
        {["approval", "parallel"].includes(nodeForm.type) && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Approval Type</label>
                <select
                  value={nodeForm.approvalType}
                  onChange={(e) => setNodeForm((prev) => ({ ...prev, approvalType: e.target.value }))}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  <option value="sequential">Sequential (One after another)</option>
                  <option value="parallel">Parallel (All at once)</option>
                  <option value="any">Any One (First responder)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Minimum Approvals Required</label>
                <input
                  type="number"
                  min="1"
                  value={nodeForm.minApprovals}
                  onChange={(e) =>
                    setNodeForm((prev) => ({ ...prev, minApprovals: Number.parseInt(e.target.value) || 1 }))
                  }
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Select Approvers</label>
              <div className="border border-gray-300 rounded-xl p-2 max-h-40 overflow-y-auto">
                {approvers.map((approver) => (
                  <label key={approver._id} className="flex items-center space-x-2 p-1.5 hover:bg-gray-50 rounded">
                    <input
                      type="checkbox"
                      checked={nodeForm.approvers.some((a) => a._id === approver._id || a.id === approver._id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setNodeForm((prev) => ({
                            ...prev,
                            approvers: [...prev.approvers, approver],
                          }))
                        } else {
                          setNodeForm((prev) => ({
                            ...prev,
                            approvers: prev.approvers.filter((a) => a._id !== approver._id),
                          }))
                        }
                      }}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-sm">
                        {approver.firstName} {approver.lastName}
                      </div>
                      <div className="text-xs text-gray-500">
                        {approver.role} • {approver.email}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Timeout (Hours)</label>
                <input
                  type="number"
                  min="1"
                  value={nodeForm.timeoutHours}
                  onChange={(e) =>
                    setNodeForm((prev) => ({ ...prev, timeoutHours: Number.parseInt(e.target.value) || 24 }))
                  }
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="24"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Escalate To</label>
                <select
                  value={nodeForm.escalationTo}
                  onChange={(e) => setNodeForm((prev) => ({ ...prev, escalationTo: e.target.value }))}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  <option value="">None</option>
                  {approvers.map((approver) => (
                    <option key={approver._id} value={approver._id}>
                      {approver.firstName} {approver.lastName} ({approver.role})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </>
        )}

        {/* Condition-specific settings */}
        {nodeForm.type === "condition" && (
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

            {nodeForm.conditions?.length > 0 ? (
              <div className="space-y-2">
                {nodeForm.conditions.map((condition, index) => (
                  <div key={index} className="p-2 bg-gray-50 border border-gray-200 rounded-xl">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm">{condition.field}</span>
                      <button
                        onClick={() => {
                          setNodeForm((prev) => ({
                            ...prev,
                            conditions: prev.conditions.filter((_, i) => i !== index),
                          }))
                        }}
                        className="p-0.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors duration-200"
                      >
                        <Trash2 size={10} />
                      </button>
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
                <p className="text-sm text-gray-600">
                  No conditions defined. Add conditions to create decision branches.
                </p>
              </div>
            )}

            {/* Add condition form */}
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
              <h5 className="text-xs font-bold text-blue-900 mb-2">Add New Condition</h5>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Field</label>
                  <select
                    value={conditionForm.field}
                    onChange={(e) => {
                      const field = availableConditions.find((f) => f.id === e.target.value)
                      setConditionForm((prev) => ({
                        ...prev,
                        field: e.target.value,
                        valueType: field?.type || "text",
                      }))
                    }}
                    className="w-full px-2 py-1 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs"
                  >
                    <option value="">Select field</option>
                    {availableConditions.map((condition) => (
                      <option key={condition.id} value={condition.id}>
                        {condition.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Operator</label>
                  <select
                    value={conditionForm.operator}
                    onChange={(e) => setConditionForm((prev) => ({ ...prev, operator: e.target.value }))}
                    className="w-full px-2 py-1 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs"
                  >
                    {conditionOperators.map((op) => (
                      <option key={op.id} value={op.id}>
                        {op.symbol} {op.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Value</label>
                  {selectedCondition?.type === "select" ? (
                    <select
                      value={conditionForm.value}
                      onChange={(e) => setConditionForm((prev) => ({ ...prev, value: e.target.value }))}
                      className="w-full px-2 py-1 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs"
                    >
                      <option value="">Select value</option>
                      {selectedCondition.options?.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={selectedCondition?.type || "text"}
                      value={conditionForm.value}
                      onChange={(e) => setConditionForm((prev) => ({ ...prev, value: e.target.value }))}
                      className="w-full px-2 py-1 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs"
                      placeholder="Enter value"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Position information (read-only) */}
        <div className="p-2 bg-gray-50 border border-gray-200 rounded-xl">
          <div className="text-xs font-medium text-gray-700 mb-1">Current Position</div>
          <div className="flex items-center justify-between text-xs text-gray-600">
            <span>X: {Math.round(nodeForm.position.x)}px</span>
            <span>Y: {Math.round(nodeForm.position.y)}px</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">Position is set by dragging the node in the workflow designer</p>
        </div>
      </div>
    )
  }

  // Render Confirmation Modal
  const renderConfirmationModal = () => {
    const getIcon = () => {
      switch (confirmConfig.type) {
        case "delete":
          return <AlertTriangle className="w-12 h-12 text-red-500" />
        case "warning":
          return <AlertTriangle className="w-12 h-12 text-amber-500" />
        case "info":
          return <AlertCircle className="w-12 h-12 text-blue-500" />
        default:
          return <AlertCircle className="w-12 h-12 text-blue-500" />
      }
    }

    const getButtonStyles = () => {
      if (confirmConfig.destructive) {
        return {
          confirm: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
          cancel: "bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500",
        }
      }
      return {
        confirm: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
        cancel: "bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500",
      }
    }

    const buttonStyles = getButtonStyles()

    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
        <div className="bg-white rounded-2xl max-w-md w-full animate-scaleIn">
          <div className="p-6">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4">{getIcon()}</div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {confirmConfig.title}
              </h3>
              
              <p className="text-gray-600 mb-6">
                {confirmConfig.message}
              </p>
              
              <div className="flex w-full gap-3">
                {confirmConfig.cancelText && (
                  <button
                    onClick={handleCancel}
                    className={`flex-1 px-4 py-3 rounded-xl font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${buttonStyles.cancel}`}
                  >
                    {confirmConfig.cancelText}
                  </button>
                )}
                
                <button
                  onClick={handleConfirm}
                  className={`flex-1 px-4 py-3 text-white rounded-xl font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${buttonStyles.confirm}`}
                >
                  {confirmConfig.confirmText}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

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
                Design custom approval processes with drag-and-drop interface and zoom controls
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
                    <button
                      onClick={fetchWorkflows}
                      className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors duration-200"
                      title="Refresh"
                    >
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
                ) : workflows.filter(
                    (wf) =>
                      wf.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      wf.description.toLowerCase().includes(searchQuery.toLowerCase()),
                  ).length === 0 ? (
                  <div className="p-8 text-center">
                    <Layers size={32} className="mx-auto text-gray-300 mb-3" />
                    <p className="text-gray-500 text-sm">No workflows found</p>
                  </div>
                ) : (
                  workflows
                    .filter(
                      (wf) =>
                        wf.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        wf.description.toLowerCase().includes(searchQuery.toLowerCase()),
                    )
                    .map((workflow) => (
                      <div
                        key={workflow._id}
                        className={`p-3 border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors duration-200 ${
                          activeWorkflow?._id === workflow._id ? "bg-blue-50 border-blue-200" : ""
                        }`}
                        onClick={() => setActiveWorkflow(workflow)}
                      >
                        <div className="flex items-start justify-between mb-1">
                          <div className="flex items-center space-x-2">
                            <div
                              className={`w-2 h-2 rounded-full ${workflow.isActive ? "bg-emerald-500" : "bg-gray-400"}`}
                            ></div>
                            <h4 className="font-bold text-gray-900 text-sm">{workflow.name}</h4>
                          </div>
                          <div className="flex items-center space-x-2">
                            {workflow.priority === 1 && (
                              <span className="px-1.5 py-0.5 bg-blue-100 text-blue-800 text-xs rounded">High</span>
                            )}
                          </div>
                        </div>
                        <p className="text-gray-600 text-xs mb-2 line-clamp-2">{workflow.description}</p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{workflow.nodes?.length || 0} steps</span>
                          <div className="flex items-center space-x-2">
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
                  <span className="font-bold text-gray-900">{workflows.filter((w) => w.isActive).length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Steps</span>
                  <span className="font-bold text-gray-900">
                    {workflows.reduce((sum, w) => sum + (w.nodes?.length || 0), 0)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Drafts</span>
                  <span className="font-bold text-gray-900">{workflows.filter((w) => w.isDraft).length}</span>
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
                        <span
                          className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                            activeWorkflow.isActive ? "bg-emerald-100 text-emerald-800" : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {activeWorkflow.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                      <p className="text-gray-600">{activeWorkflow.description}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => saveWorkflow(activeWorkflow)}
                        disabled={isLoading}
                        className="px-3 py-1.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors duration-200 text-sm font-medium flex items-center gap-1"
                      >
                        {isLoading ? (
                          <div className="animate-spin w-3 h-3 border-2 border-white border-t-transparent rounded-full"></div>
                        ) : (
                          <>
                            <Save size={14} />
                            Save
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="px-3 py-1.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
                      >
                        {isEditing ? (
                          <Save size={14} className="mr-1 inline" />
                        ) : (
                          <Edit size={14} className="mr-1 inline" />
                        )}
                        {isEditing ? "Save Changes" : "Edit Workflow"}
                      </button>
                      {activeWorkflow.isDraft && (
                        <button
                          onClick={() => publishWorkflow(activeWorkflow._id)}
                          disabled={isLoading}
                          className="px-3 py-1.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 disabled:opacity-50 transition-colors duration-200 text-sm font-medium"
                        >
                          {isLoading ? (
                            <div className="animate-spin w-3 h-3 border-2 border-white border-t-transparent rounded-full mx-2"></div>
                          ) : (
                            "Publish"
                          )}
                        </button>
                      )}
                      <button
                        onClick={() => cloneWorkflow(activeWorkflow._id)}
                        className="px-3 py-1.5 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors duration-200 text-sm font-medium"
                      >
                        <Copy size={14} className="mr-1 inline" />
                        Clone
                      </button>
                      <button
                        onClick={() => deleteWorkflow(activeWorkflow._id)}
                        className="px-3 py-1.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors duration-200 text-sm font-medium"
                      >
                        <Trash2 size={14} className="mr-1 inline" />
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
                        {activeWorkflow.autoApproveBelow
                          ? `MWK ${activeWorkflow.autoApproveBelow.toLocaleString()}`
                          : "Disabled"}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-2">
                      <span className="text-xs text-gray-600">CFO Required Above</span>
                      <p className="font-bold text-gray-900">
                        {activeWorkflow.requireCFOAbove
                          ? `MWK ${activeWorkflow.requireCFOAbove.toLocaleString()}`
                          : "N/A"}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-2">
                      <span className="text-xs text-gray-600">Created By</span>
                      <p className="font-bold text-gray-900">{activeWorkflow.createdBy?.name || "Admin"}</p>
                    </div>
                  </div>
                </div>

                {/* Workflow Visualizer with Drag & Drop */}
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-gray-900">Workflow Designer</h3>
                      <div className="flex items-center space-x-2">
                        <div className="text-xs text-gray-500">
                          Drag nodes to move • Click + button to create connections • Click red X to delete connection •
                          Ctrl+Scroll to zoom
                        </div>
                        <button className="px-2 py-1 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors duration-200 text-xs font-medium">
                          <Download size={12} className="mr-1 inline" />
                          Export
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="p-0">{renderWorkflowVisualizer()}</div>
                </div>

                {/* Workflow Settings */}
                {isEditing && (
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
                                checked={activeWorkflow.applyToAll || false}
                                onChange={(e) =>
                                  setActiveWorkflow((prev) => ({ ...prev, applyToAll: e.target.checked }))
                                }
                                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                              />
                            </div>

                            {!activeWorkflow.applyToAll && (
                              <>
                                <div>
                                  <label className="block text-sm text-gray-700 mb-1">Departments</label>
                                  <div className="flex flex-wrap gap-1">
                                    {departments.map((dept) => (
                                      <label key={dept._id} className="inline-flex items-center">
                                        <input
                                          type="checkbox"
                                          checked={activeWorkflow.departments?.some(
                                            (d) => d._id === dept._id || d === dept._id,
                                          )}
                                          onChange={(e) => {
                                            const departmentIds = activeWorkflow.departments || []
                                            const updatedDepts = e.target.checked
                                              ? [...departmentIds, dept._id]
                                              : departmentIds.filter((id) => id !== dept._id)
                                            setActiveWorkflow((prev) => ({ ...prev, departments: updatedDepts }))
                                          }}
                                          className="w-3 h-3 text-blue-600 rounded focus:ring-blue-500"
                                        />
                                        <span className="ml-1 text-xs text-gray-700">{dept.name}</span>
                                      </label>
                                    ))}
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                  <div>
                                    <label className="block text-sm text-gray-700 mb-1">Min Amount (MWK)</label>
                                    <input
                                      type="number"
                                      value={activeWorkflow.minAmount || 0}
                                      onChange={(e) =>
                                        setActiveWorkflow((prev) => ({ ...prev, minAmount: Number(e.target.value) }))
                                      }
                                      className="w-full px-3 py-1.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm text-gray-700 mb-1">Max Amount (MWK)</label>
                                    <input
                                      type="number"
                                      value={activeWorkflow.maxAmount || ""}
                                      onChange={(e) =>
                                        setActiveWorkflow((prev) => ({
                                          ...prev,
                                          maxAmount: e.target.value ? Number(e.target.value) : null,
                                        }))
                                      }
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
                                onChange={(e) =>
                                  setActiveWorkflow((prev) => ({
                                    ...prev,
                                    slaHours: Number.parseInt(e.target.value) || 72,
                                  }))
                                }
                                className="w-full px-3 py-1.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                              />
                            </div>

                            <div>
                              <label className="block text-sm text-gray-700 mb-1">Auto-approve Below (MWK)</label>
                              <input
                                type="number"
                                value={activeWorkflow.autoApproveBelow || ""}
                                onChange={(e) =>
                                  setActiveWorkflow((prev) => ({
                                    ...prev,
                                    autoApproveBelow: e.target.value ? Number.parseInt(e.target.value) : null,
                                  }))
                                }
                                className="w-full px-3 py-1.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                placeholder="Disable auto-approval"
                              />
                            </div>

                            <div>
                              <label className="block text-sm text-gray-700 mb-1">Require CFO Above (MWK)</label>
                              <input
                                type="number"
                                value={activeWorkflow.requireCFOAbove || 500000}
                                onChange={(e) =>
                                  setActiveWorkflow((prev) => ({
                                    ...prev,
                                    requireCFOAbove: Number.parseInt(e.target.value) || 500000,
                                  }))
                                }
                                className="w-full px-3 py-1.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                              />
                            </div>

                            <div className="space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-700">Require Legal Review</span>
                                <input
                                  type="checkbox"
                                  checked={activeWorkflow.requireLegalReview || false}
                                  onChange={(e) =>
                                    setActiveWorkflow((prev) => ({ ...prev, requireLegalReview: e.target.checked }))
                                  }
                                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                />
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-700">Require IT Review</span>
                                <input
                                  type="checkbox"
                                  checked={activeWorkflow.requireITReview || false}
                                  onChange={(e) =>
                                    setActiveWorkflow((prev) => ({ ...prev, requireITReview: e.target.checked }))
                                  }
                                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                />
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-700">Allow Delegation</span>
                                <input
                                  type="checkbox"
                                  checked={activeWorkflow.allowDelegation !== false}
                                  onChange={(e) =>
                                    setActiveWorkflow((prev) => ({ ...prev, allowDelegation: e.target.checked }))
                                  }
                                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
                <Layers size={64} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">No Workflow Selected</h3>
                <p className="text-gray-600 mb-6">
                  Select a workflow from the list or create a new one to start configuring approval processes.
                </p>
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

      {/* Confirmation Modal */}
      {showConfirmModal && renderConfirmationModal()}

      {/* Create Workflow Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full">
            <div className="px-4 py-3 border-b border-gray-200 bg-blue-50">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Create New Approval Workflow</h2>
                  <p className="text-gray-600 text-sm mt-1">
                    Define a new approval process with custom rules and thresholds
                  </p>
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Workflow Name *</label>
                    <input
                      type="text"
                      value={newWorkflow.name}
                      onChange={(e) => setNewWorkflow((prev) => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., Standard Procurement Workflow"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                    <select
                      value={newWorkflow.priority}
                      onChange={(e) =>
                        setNewWorkflow((prev) => ({ ...prev, priority: Number.parseInt(e.target.value) }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="1">High (1)</option>
                      <option value="3">Medium (3)</option>
                      <option value="5">Low (5)</option>
                      <option value="10">Very Low (10)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={newWorkflow.description}
                    onChange={(e) => setNewWorkflow((prev) => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Describe what this workflow is for and when it should be used..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Auto-approve Below (MWK)</label>
                    <input
                      type="number"
                      value={newWorkflow.autoApproveBelow || ""}
                      onChange={(e) =>
                        setNewWorkflow((prev) => ({
                          ...prev,
                          autoApproveBelow: e.target.value ? Number.parseInt(e.target.value) : null,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Leave empty to disable"
                    />
                    <p className="text-xs text-gray-500 mt-1">Requests below this amount will auto-approve</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">CFO Required Above (MWK)</label>
                    <input
                      type="number"
                      value={newWorkflow.requireCFOAbove}
                      onChange={(e) =>
                        setNewWorkflow((prev) => ({
                          ...prev,
                          requireCFOAbove: Number.parseInt(e.target.value) || 500000,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="applyToAll"
                    checked={newWorkflow.applyToAll}
                    onChange={(e) => setNewWorkflow((prev) => ({ ...prev, applyToAll: e.target.checked }))}
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
                        {departments.map((dept) => (
                          <label key={dept._id} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={newWorkflow.departments.includes(dept._id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setNewWorkflow((prev) => ({ ...prev, departments: [...prev.departments, dept._id] }))
                                } else {
                                  setNewWorkflow((prev) => ({
                                    ...prev,
                                    departments: prev.departments.filter((id) => id !== dept._id),
                                  }))
                                }
                              }}
                              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">{dept.name}</span>
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
                    onChange={(e) => setNewWorkflow((prev) => ({ ...prev, isActive: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="isActive" className="text-sm text-gray-700">
                    Activate workflow immediately after creation
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isDraft"
                    checked={newWorkflow.isDraft}
                    onChange={(e) => setNewWorkflow((prev) => ({ ...prev, isDraft: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="isDraft" className="text-sm text-gray-700">
                    Save as draft (requires publishing later)
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200 bg-blue-50">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    {nodeForm.type === "start" && <Play size={20} className="text-emerald-600" />}
                    {nodeForm.type === "approval" && <UserCheck size={20} className="text-blue-600" />}
                    {nodeForm.type === "condition" && <GitBranch size={20} className="text-amber-600" />}
                    {nodeForm.type === "parallel" && <GitMerge size={20} className="text-purple-600" />}
                    {nodeForm.type === "notification" && <Bell size={20} className="text-teal-600" />}
                    {nodeForm.type === "end" && <StopCircle size={20} className="text-red-600" />}
                    {selectedNode ? "Edit" : "Add"} {nodeTypes.find((t) => t.id === nodeForm.type)?.name}
                  </h2>
                  <p className="text-gray-600 text-sm mt-1">Configure this step in your approval workflow</p>
                </div>
                <button
                  onClick={() => {
                    setShowNodeModal(false)
                    setSelectedNode(null)
                    setNodeForm({
                      id: "",
                      type: "approval",
                      name: "",
                      description: "",
                      position: { x: 0, y: 0 },
                      approvers: [],
                      approvalType: "sequential",
                      minApprovals: 1,
                      conditions: [],
                      trueBranch: "",
                      falseBranch: "",
                      timeoutHours: 24,
                      escalationTo: "",
                      isMandatory: true,
                      canDelegate: true,
                      actions: [],
                    })
                  }}
                  className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors duration-200"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="p-4 max-h-[70vh] overflow-y-auto">{renderNodeConfigForm()}</div>

            <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 flex justify-end space-x-2">
              <button
                onClick={() => {
                  setShowNodeModal(false)
                  setSelectedNode(null)
                  setNodeForm({
                    id: "",
                    type: "approval",
                    name: "",
                    description: "",
                    position: { x: 0, y: 0 },
                    approvers: [],
                    approvalType: "sequential",
                    minApprovals: 1,
                    conditions: [],
                    trueBranch: "",
                    falseBranch: "",
                    timeoutHours: 24,
                    escalationTo: "",
                    isMandatory: true,
                    canDelegate: true,
                    actions: [],
                  })
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
  )
}