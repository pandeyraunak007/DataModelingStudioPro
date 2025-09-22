'use client'

import React, { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import {
  ArrowLeft,
  Database,
  GitBranch,
  FileText,
  Search,
  Bell,
  User,
  ChevronDown,
  ChevronRight,
  MoreVertical,
  Plus,
  Folder,
  Key,
  Eye,
  BookOpen,
  Shield,
  Move,
  Square,
  Link2,
  StickyNote,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Grid3x3,
  Layout,
  Trash2,
  MoreHorizontal,
  X,
  Edit2,
  KeyRound,
  Columns,
  PenTool,
  Package,
  Monitor,
  Hand,
  Minus,
  Circle,
  Diamond,
  Hexagon,
  ToggleLeft,
  Trash,
  Copy,
  Edit3,
  GripVertical,
  Save,
  FolderOpen,
  Download,
  Upload,
  FileCode,
  Undo,
  Redo,
  Clipboard,
  Settings,
  HelpCircle,
  Share2,
  GitMerge,
  RefreshCw,
  Code,
  Table,
  Users,
  Layers,
  Check,
  Clock,
  Type,
  AlertCircle,
  Scissors,
  AlertTriangle,
  ArrowRight,
  BarChart,
  CheckCircle,
  GitCompare,
  Info,
  Keyboard,
  Maximize,
  MessageCircle,
  MessageSquare,
  PlayCircle,
  Replace,
  RotateCcw,
  Shuffle,
  Home
} from 'lucide-react'

interface DiagramViewProps {
  onBack?: () => void
}

interface ToolbarItem {
  icon: React.ComponentType<any>
  label: string
  action: () => void
  tooltip: string
  hasSubmenu?: boolean
  isToggle?: boolean
  isActive?: boolean
}

interface ToolbarGroup {
  name: string
  items: ToolbarItem[]
}

interface ToolbarTab {
  label: string
  icon: React.ComponentType<any>
  groups: ToolbarGroup[]
}

interface Entity {
  id: string
  name: string
  x: number
  y: number
  color: string
  attributes: Array<{
    name: string
    type: string
    constraints: string[]
    nullable?: boolean
    domain?: string
  }>
}

interface Relationship {
  id: string
  from: string
  to: string
  type: string
  cardinality: string
}

interface Diagram {
  id: string
  name: string
  entities: Entity[]
  relationships: Relationship[]
}

interface Model {
  id: string
  name: string
  diagrams: Diagram[]
  currentDiagramId: string
}

export default function DiagramView({ onBack }: DiagramViewProps) {
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null)
  const [selectedTool, setSelectedTool] = useState<string>('pan')
  const [viewMode, setViewMode] = useState<'logical' | 'physical' | 'conceptual'>('logical')
  const [activeTab, setActiveTab] = useState<string>('file')
  const [expandedSections, setExpandedSections] = useState<string[]>(['model', 'diagrams', 'entities', 'relationships'])
  const [showDataTypes, setShowDataTypes] = useState(true)
  const [dragState, setDragState] = useState<{
    isDragging: boolean
    entityId: string | null
    offset: { x: number; y: number }
  }>({ isDragging: false, entityId: null, offset: { x: 0, y: 0 } })
  const [showKeyIcons, setShowKeyIcons] = useState(true)
  const [showViewDropdown, setShowViewDropdown] = useState(false)
  const [globalSearch, setGlobalSearch] = useState('')
  const [showGlobalSearchResults, setShowGlobalSearchResults] = useState(false)
  const [showRelationshipSubmenu, setShowRelationshipSubmenu] = useState(false)
  const [collapsedGroups, setCollapsedGroups] = useState<string[]>([])
  const [selectedAttribute, setSelectedAttribute] = useState<any>(null)
  const [selectedRelationship, setSelectedRelationship] = useState<any>(null)
  const [selectedDiagram, setSelectedDiagram] = useState<any>(null)
  const [propertiesPaneSections, setPropertiesPaneSections] = useState<string[]>(['general'])
  const [propertiesPaneWidth, setPropertiesPaneWidth] = useState(320)
  const [isResizing, setIsResizing] = useState(false)
  const [contextMenu, setContextMenu] = useState<{
    show: boolean;
    x: number;
    y: number;
    type: 'entity' | 'attribute' | null;
    target: any;
  }>({ show: false, x: 0, y: 0, type: null, target: null })
  const canvasRef = useRef<HTMLDivElement>(null)

  // Multi-model state
  const [models, setModels] = useState<Model[]>([
    {
      id: 'model1',
      name: 'Simple Test Model',
      currentDiagramId: 'diagram1',
      diagrams: [
        {
          id: 'diagram1',
          name: 'Test Diagram',
          entities: [
            {
              id: 'customer',
              name: 'Customer',
              x: 100,
              y: 100,
              color: '#3B82F6',
              attributes: [
                { name: 'CustomerID', type: 'bigint', constraints: ['PK'], nullable: false, domain: 'ID' },
                { name: 'FirstName', type: 'varchar(50)', constraints: [], nullable: false, domain: 'PersonName' },
                { name: 'LastName', type: 'varchar(50)', constraints: [], nullable: false, domain: 'PersonName' },
                { name: 'Email', type: 'varchar(100)', constraints: ['UNIQUE'], nullable: true, domain: 'EmailAddress' },
                { name: 'DateOfBirth', type: 'date', constraints: [], nullable: true, domain: 'Date' }
              ]
            },
            {
              id: 'order',
              name: 'Order',
              x: 400,
              y: 100,
              color: '#10B981',
              attributes: [
                { name: 'OrderID', type: 'bigint', constraints: ['PK'], nullable: false, domain: 'ID' },
                { name: 'CustomerID', type: 'bigint', constraints: ['FK'], nullable: false, domain: 'ID' },
                { name: 'OrderDate', type: 'datetime', constraints: [], nullable: false, domain: 'Date' },
                { name: 'TotalAmount', type: 'decimal(10,2)', constraints: [], nullable: true, domain: 'Money' },
                { name: 'Status', type: 'varchar(20)', constraints: [], nullable: false, domain: 'Status' }
              ]
            }
          ],
          relationships: [
            { id: 'r1', from: 'customer', to: 'order', type: 'one-to-many', cardinality: '1:N' }
          ]
        }
      ]
    }
  ])

  const [currentModelId, setCurrentModelId] = useState('model1')

  const currentModel = models.find(m => m.id === currentModelId)
  const currentDiagram = currentModel?.diagrams.find(d => d.id === currentModel.currentDiagramId)

  // Enhanced Ribbon-Style Toolbar Configuration
  const toolbarTabs: Record<string, ToolbarTab> = {
    file: {
      label: 'File',
      icon: FileText,
      groups: [
        {
          name: 'Model',
          items: [
            { icon: FileText, label: 'New Model', action: () => console.log('New Model'), tooltip: 'Create a new data model' },
            { icon: FolderOpen, label: 'Open Model', action: () => console.log('Open Model'), tooltip: 'Open existing model' },
            { icon: Save, label: 'Save', action: () => console.log('Save'), tooltip: 'Save current model' },
            { icon: Save, label: 'Save As', action: () => console.log('Save As'), tooltip: 'Save model with new name' }
          ]
        },
        {
          name: 'Import',
          items: [
            { icon: Upload, label: 'Import File', action: () => handleFileImport(), tooltip: 'Import file (DDL, JSON, XML)' }
          ]
        },
      ]
    },
    home: {
      label: 'Home',
      icon: Home,
      groups: [
        {
          name: 'History',
          items: [
            { icon: Undo, label: 'Undo', action: () => console.log('Undo'), tooltip: 'Undo last action' },
            { icon: Redo, label: 'Redo', action: () => console.log('Redo'), tooltip: 'Redo last undone action' }
          ]
        },
        {
          name: 'Clipboard',
          items: [
            { icon: Scissors, label: 'Cut', action: () => console.log('Cut'), tooltip: 'Cut selected items' },
            { icon: Copy, label: 'Copy', action: () => console.log('Copy'), tooltip: 'Copy selected items' },
            { icon: Clipboard, label: 'Paste', action: () => console.log('Paste'), tooltip: 'Paste from clipboard' },
            { icon: Trash2, label: 'Delete', action: () => console.log('Delete'), tooltip: 'Delete selected items' }
          ]
        },
        {
          name: 'Find',
          items: [
            { icon: Search, label: 'Search', action: () => console.log('Search'), tooltip: 'Search model objects' },
            { icon: Replace, label: 'Replace', action: () => console.log('Replace'), tooltip: 'Find and replace' },
            { icon: RefreshCw, label: 'Refresh', action: () => console.log('Refresh'), tooltip: 'Refresh diagram' }
          ]
        }
      ]
    },
    diagram: {
      label: 'Diagram',
      icon: Layout,
      groups: [
        {
          name: 'Objects',
          items: [
            { icon: Plus, label: 'Entity', action: () => console.log('Add Entity'), tooltip: 'Add new entity to diagram' },
            { icon: Link2, label: 'Relation', action: () => console.log('Add Relationship'), tooltip: 'Add relationship between entities', hasSubmenu: true },
            { icon: Eye, label: 'View', action: () => console.log('Add View'), tooltip: 'Add database view' },
            { icon: BookOpen, label: 'Domain', action: () => console.log('Add Domain'), tooltip: 'Add data domain' }
          ]
        },
        {
          name: 'Annotations',
          items: [
            { icon: MessageSquare, label: 'Note', action: () => console.log('Add Note'), tooltip: 'Add text annotation' },
            { icon: Square, label: 'Shape', action: () => console.log('Add Shape'), tooltip: 'Add comment box' }
          ]
        },
        {
          name: 'Layout',
          items: [
            { icon: Shuffle, label: 'Auto', action: () => console.log('Auto Layout'), tooltip: 'Automatically arrange entities' },
            { icon: Grid3x3, label: 'Align', action: () => console.log('Align'), tooltip: 'Align selected objects' }
          ]
        }
      ]
    },
    view: {
      label: 'View',
      icon: Eye,
      groups: [
        {
          name: 'Zoom',
          items: [
            { icon: ZoomIn, label: 'In', action: () => console.log('Zoom In'), tooltip: 'Zoom in on diagram' },
            { icon: ZoomOut, label: 'Out', action: () => console.log('Zoom Out'), tooltip: 'Zoom out from diagram' },
            { icon: RotateCcw, label: 'Reset', action: () => console.log('Reset Zoom'), tooltip: 'Reset zoom to 100%' },
            { icon: Maximize2, label: 'Fit', action: () => console.log('Fit Screen'), tooltip: 'Fit diagram to screen' }
          ]
        },
        {
          name: 'Navigation',
          items: [
            { icon: Move, label: 'Pan', action: () => console.log('Pan'), tooltip: 'Pan around diagram' },
            { icon: Maximize, label: 'Full', action: () => console.log('Full Screen'), tooltip: 'Enter full screen mode' }
          ]
        },
        {
          name: 'Display',
          items: [
            { icon: Type, label: 'Types', action: () => setShowDataTypes(!showDataTypes), tooltip: 'Show/hide data types', isToggle: true, isActive: showDataTypes },
            { icon: AlertCircle, label: 'Nulls', action: () => console.log('Toggle Nullability'), tooltip: 'Show/hide null indicators', isToggle: true },
            { icon: Key, label: 'Keys', action: () => setShowKeyIcons(!showKeyIcons), tooltip: 'Show/hide key icons', isToggle: true, isActive: showKeyIcons },
            { icon: BookOpen, label: 'Domains', action: () => console.log('Toggle Domains'), tooltip: 'Show/hide domains', isToggle: true }
          ]
        }
      ]
    },
    tools: {
      label: 'Tools',
      icon: Settings,
      groups: [
        {
          name: 'Engineering',
          items: [
            { icon: RefreshCw, label: 'Reverse', action: () => console.log('Reverse Engineering'), tooltip: 'Generate model from database' },
            { icon: ArrowRight, label: 'Forward', action: () => console.log('Forward Engineering'), tooltip: 'Generate database from model' },
            { icon: GitCompare, label: 'Compare', action: () => console.log('Complete Compare'), tooltip: 'Compare models or databases' }
          ]
        },
        {
          name: 'Validation',
          items: [
            { icon: CheckCircle, label: 'Validate', action: () => console.log('Validate Model'), tooltip: 'Check model for errors' },
            { icon: AlertTriangle, label: 'Check', action: () => console.log('Check Model'), tooltip: 'Validate model integrity' }
          ]
        },
        {
          name: 'Reports',
          items: [
            { icon: FileText, label: 'Report', action: () => console.log('Generate Report'), tooltip: 'Create model documentation' },
            { icon: BarChart, label: 'Analytics', action: () => console.log('Analytics'), tooltip: 'Model analytics and metrics' }
          ]
        }
      ]
    },
    help: {
      label: 'Help',
      icon: HelpCircle,
      groups: [
        {
          name: 'Documentation',
          items: [
            { icon: HelpCircle, label: 'Docs', action: () => console.log('Documentation'), tooltip: 'Open user documentation' },
            { icon: PlayCircle, label: 'Tutorials', action: () => console.log('Tutorials'), tooltip: 'View video tutorials' },
            { icon: Keyboard, label: 'Shortcuts', action: () => console.log('Shortcuts'), tooltip: 'Keyboard shortcuts reference' }
          ]
        },
        {
          name: 'Support',
          items: [
            { icon: MessageCircle, label: 'Support', action: () => console.log('Support'), tooltip: 'Contact technical support' },
            { icon: Users, label: 'Community', action: () => console.log('Community'), tooltip: 'Join user community' }
          ]
        },
        {
          name: 'About',
          items: [
            { icon: Info, label: 'About', action: () => console.log('About'), tooltip: 'About this application' }
          ]
        }
      ]
    }
  }

  const toggleSection = (section: string) => {
    setExpandedSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    )
  }

  const handleEntityDragStart = (e: React.DragEvent, entityId: string) => {
    e.dataTransfer.setData('entityId', entityId)
  }

  const handleCanvasDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const entityId = e.dataTransfer.getData('entityId')
    const rect = canvasRef.current?.getBoundingClientRect()
    if (rect && entityId && currentModel && currentDiagram) {
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      setModels(prev => prev.map(model => {
        if (model.id === currentModelId) {
          return {
            ...model,
            diagrams: model.diagrams.map(diagram => {
              if (diagram.id === currentModel.currentDiagramId) {
                return {
                  ...diagram,
                  entities: diagram.entities.map(entity =>
                    entity.id === entityId ? { ...entity, x, y } : entity
                  )
                }
              }
              return diagram
            })
          }
        }
        return model
      }))
    }
  }

  const handleCanvasDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  // Entity mouse drag handlers
  const handleEntityMouseDown = (e: React.MouseEvent, entity: Entity) => {
    // Only handle left mouse button
    if (e.button !== 0) return

    e.preventDefault()
    e.stopPropagation()

    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return

    setDragState({
      isDragging: true,
      entityId: entity.id,
      offset: {
        x: e.clientX - rect.left - entity.x,
        y: e.clientY - rect.top - entity.y
      }
    })

    setSelectedEntity(entity)
  }

  const handleEntityMouseMove = (e: React.MouseEvent) => {
    if (!dragState.isDragging || !dragState.entityId || !currentModel || !currentDiagram) return

    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return

    const newX = e.clientX - rect.left - dragState.offset.x
    const newY = e.clientY - rect.top - dragState.offset.y

    // Constrain to canvas bounds
    const constrainedX = Math.max(0, Math.min(newX, 2000 - 200)) // 200 is entity width
    const constrainedY = Math.max(0, Math.min(newY, 2000 - 100)) // approximate entity height

    updateEntityPosition(dragState.entityId, constrainedX, constrainedY)
  }

  const updateEntityPosition = (entityId: string, x: number, y: number) => {
    setModels(prev => prev.map(model => {
      if (model.id === currentModelId) {
        return {
          ...model,
          diagrams: model.diagrams.map(diagram => {
            if (diagram.id === model.currentDiagramId) {
              return {
                ...diagram,
                entities: diagram.entities.map(entity =>
                  entity.id === entityId ? { ...entity, x, y } : entity
                )
              }
            }
            return diagram
          })
        }
      }
      return model
    }))
  }

  const handleEntityMouseUp = () => {
    setDragState({ isDragging: false, entityId: null, offset: { x: 0, y: 0 } })
  }

  const handleModelChange = (modelId: string) => {
    setCurrentModelId(modelId)
    setSelectedEntity(null)
  }

  const handleDiagramChange = (diagramId: string) => {
    setModels(prev => prev.map(model => {
      if (model.id === currentModelId) {
        return { ...model, currentDiagramId: diagramId }
      }
      return model
    }))
    setSelectedEntity(null)
  }

  const handleAddDiagram = () => {
    const newDiagram: Diagram = {
      id: `diagram_${Date.now()}`,
      name: `Diagram ${(currentModel?.diagrams.length || 0) + 1}`,
      entities: [],
      relationships: []
    }

    setModels(prev => prev.map(model => {
      if (model.id === currentModelId) {
        return {
          ...model,
          diagrams: [...model.diagrams, newDiagram],
          currentDiagramId: newDiagram.id
        }
      }
      return model
    }))
  }

  const handleCloseModel = (modelId: string) => {
    if (models.length > 1) {
      const remainingModels = models.filter(m => m.id !== modelId)
      if (currentModelId === modelId) {
        setCurrentModelId(remainingModels[0].id)
      }
      setModels(remainingModels)
    }
  }

  const handleFileImport = () => {
    // Create a hidden file input element
    const fileInput = document.createElement('input')
    fileInput.type = 'file'
    fileInput.accept = '.ddl,.sql,.json,.xml'
    fileInput.style.display = 'none'

    fileInput.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const content = e.target?.result as string
          console.log('File imported:', {
            name: file.name,
            type: file.type,
            size: file.size,
            content: content.substring(0, 100) + '...' // Log first 100 chars
          })

          // TODO: Implement actual file parsing logic based on file type
          // For now, just show a success message
          alert(`File "${file.name}" imported successfully!\nFile type: ${file.type}\nSize: ${file.size} bytes`)
        }
        reader.readAsText(file)
      }
    }

    // Trigger file dialog
    document.body.appendChild(fileInput)
    fileInput.click()
    document.body.removeChild(fileInput)
  }

  // Floating toolbar groups
  const toolbarGroups = [
    {
      id: 'modeling',
      title: 'Modeling',
      icon: PenTool,
      tools: [
        { id: 'entity', icon: Square, label: 'Add Entity', description: 'Create new entity' },
        { id: 'attribute', icon: Columns, label: 'Add Attribute', description: 'Add attribute to entity' },
        {
          id: 'relationship',
          icon: Link2,
          label: 'Add Relationship',
          description: 'Create entity relationships',
          hasSubmenu: true,
          submenu: [
            {
              id: 'identifying',
              icon: Diamond,
              label: 'Identifying Relationship',
              description: 'Strong entity relationship',
              style: 'solid'
            },
            {
              id: 'non-identifying',
              icon: Hexagon,
              label: 'Non-Identifying Relationship',
              description: 'Weak entity relationship',
              style: 'dashed'
            },
            {
              id: 'other',
              icon: Circle,
              label: 'Other Relationship',
              description: 'Generic relationship',
              style: 'neutral'
            }
          ]
        },
        { id: 'note', icon: StickyNote, label: 'Add Annotation', description: 'Add notes and comments' },
        { id: 'subject-area', icon: Package, label: 'Subject Area', description: 'Group related entities' }
      ]
    },
    {
      id: 'view',
      title: 'View Controls',
      icon: Eye,
      tools: [
        { id: 'zoom-in', icon: ZoomIn, label: 'Zoom In', description: 'Increase zoom level' },
        { id: 'zoom-out', icon: ZoomOut, label: 'Zoom Out', description: 'Decrease zoom level' },
        { id: 'fit-screen', icon: Maximize2, label: 'Fit to Screen', description: 'Fit all content in view' },
        { id: 'full-screen', icon: Monitor, label: 'Full Screen', description: 'Toggle full screen mode' },
        { id: 'pan', icon: Hand, label: 'Pan Tool', description: 'Navigate around diagram' }
      ]
    }
  ]

  const toggleGroup = (groupId: string) => {
    setCollapsedGroups(prev =>
      prev.includes(groupId)
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    )
  }

  const colorPalette = [
    '#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444',
    '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1'
  ]

  // Calculate model objects for the explorer
  const modelObjects = {
    diagrams: currentModel?.diagrams.length || 0,
    entities: currentDiagram?.entities.length || 0,
    relationships: currentDiagram?.relationships.length || 0,
    keys: 12,
    views: 3,
    domains: 5,
    businessRules: 8
  }

  // Global search functionality
  const performGlobalSearch = (searchTerm: string) => {
    if (!searchTerm.trim()) return []

    const results: Array<{
      type: 'model' | 'diagram' | 'entity' | 'attribute' | 'relationship'
      modelId: string
      modelName: string
      diagramId?: string
      diagramName?: string
      name: string
      description?: string
      icon: any
    }> = []

    models.forEach(model => {
      // Search in model names
      if (model.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        results.push({
          type: 'model',
          modelId: model.id,
          modelName: model.name,
          name: model.name,
          description: `Model with ${model.diagrams.length} diagrams`,
          icon: Database
        })
      }

      model.diagrams.forEach(diagram => {
        // Search in diagram names
        if (diagram.name.toLowerCase().includes(searchTerm.toLowerCase())) {
          results.push({
            type: 'diagram',
            modelId: model.id,
            modelName: model.name,
            diagramId: diagram.id,
            diagramName: diagram.name,
            name: diagram.name,
            description: `Diagram in ${model.name}`,
            icon: FileText
          })
        }

        diagram.entities.forEach(entity => {
          // Search in entity names
          if (entity.name.toLowerCase().includes(searchTerm.toLowerCase())) {
            results.push({
              type: 'entity',
              modelId: model.id,
              modelName: model.name,
              diagramId: diagram.id,
              diagramName: diagram.name,
              name: entity.name,
              description: `Entity in ${diagram.name}`,
              icon: Square
            })
          }

          // Search in attribute names
          entity.attributes.forEach(attr => {
            if (attr.name.toLowerCase().includes(searchTerm.toLowerCase())) {
              results.push({
                type: 'attribute',
                modelId: model.id,
                modelName: model.name,
                diagramId: diagram.id,
                diagramName: diagram.name,
                name: `${entity.name}.${attr.name}`,
                description: `Attribute in ${entity.name}`,
                icon: Key
              })
            }
          })
        })

        // Search in relationships
        diagram.relationships.forEach(rel => {
          const relName = `${rel.from} → ${rel.to}`
          if (relName.toLowerCase().includes(searchTerm.toLowerCase())) {
            results.push({
              type: 'relationship',
              modelId: model.id,
              modelName: model.name,
              diagramId: diagram.id,
              diagramName: diagram.name,
              name: relName,
              description: `${rel.cardinality} relationship`,
              icon: Link2
            })
          }
        })
      })
    })

    return results.slice(0, 20) // Limit to 20 results
  }

  const globalSearchResults = performGlobalSearch(globalSearch)

  const handleGlobalSearchSelect = (result: any) => {
    // Navigate to the selected item
    if (result.modelId !== currentModelId) {
      setCurrentModelId(result.modelId)
    }

    if (result.diagramId) {
      setModels(prev => prev.map(model => {
        if (model.id === result.modelId) {
          return { ...model, currentDiagramId: result.diagramId }
        }
        return model
      }))
    }

    // If it's an entity, select it
    if (result.type === 'entity') {
      const targetModel = models.find(m => m.id === result.modelId)
      const targetDiagram = targetModel?.diagrams.find(d => d.id === result.diagramId)
      const targetEntity = targetDiagram?.entities.find(e => e.name === result.name)
      if (targetEntity) {
        setSelectedEntity(targetEntity)
      }
    }

    setGlobalSearch('')
    setShowGlobalSearchResults(false)
  }

  // Properties pane section management
  const togglePropertiesSection = (section: string) => {
    setPropertiesPaneSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [section] // Only one section expanded at a time
    )
  }

  // Get context-aware properties content
  const getPropertiesContext = () => {
    console.log('Getting properties context:', {
      selectedAttribute,
      selectedRelationship,
      selectedEntity,
      selectedDiagram
    })

    if (selectedAttribute) {
      console.log('Context: attribute')
      return 'attribute'
    } else if (selectedRelationship) {
      console.log('Context: relationship')
      return 'relationship'
    } else if (selectedEntity) {
      console.log('Context: entity')
      return 'entity'
    } else if (selectedDiagram) {
      console.log('Context: diagram')
      return 'diagram'
    } else {
      console.log('Context: model')
      return 'model'
    }
  }

  // Handle resize functionality
  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsResizing(true)

    const handleMouseMove = (e: MouseEvent) => {
      const newWidth = window.innerWidth - e.clientX
      setPropertiesPaneWidth(Math.max(280, Math.min(600, newWidth)))
    }

    const handleMouseUp = () => {
      setIsResizing(false)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Two-Layer Header Bar */}
      <div className="bg-white border-b border-gray-200">
        {/* Layer 1: Main Tabs and Actions */}
        <div className="h-12 px-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Back Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Dashboard</span>
            </Button>

            {/* Main Tabs */}
            <nav className="flex items-center">
              {Object.entries(toolbarTabs).map(([key, tab]) => {
                const TabIcon = tab.icon
                return (
                  <Button
                    key={key}
                    variant={activeTab === key ? 'default' : 'ghost'}
                    size="sm"
                    className="text-xs px-3 py-1 h-7 rounded-none flex items-center space-x-1"
                    onClick={() => setActiveTab(key)}
                  >
                    <TabIcon className="h-3 w-3" />
                    <span>{tab.label}</span>
                  </Button>
                )
              })}
            </nav>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Global Search */}
            <div className="relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search models, diagrams, entities..."
                  value={globalSearch}
                  onChange={(e) => {
                    setGlobalSearch(e.target.value)
                    setShowGlobalSearchResults(e.target.value.trim().length > 0)
                  }}
                  onFocus={() => {
                    if (globalSearch.trim().length > 0) {
                      setShowGlobalSearchResults(true)
                    }
                  }}
                  onBlur={() => {
                    // Delay hiding to allow clicking on results
                    setTimeout(() => setShowGlobalSearchResults(false), 200)
                  }}
                  className="w-80 pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Search Results Dropdown */}
              {showGlobalSearchResults && globalSearchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-80 overflow-y-auto">
                  <div className="p-2">
                    <div className="text-xs font-medium text-gray-500 mb-2">
                      Found {globalSearchResults.length} results
                    </div>
                    {globalSearchResults.map((result, idx) => (
                      <div
                        key={idx}
                        className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded cursor-pointer"
                        onClick={() => handleGlobalSearchSelect(result)}
                      >
                        <result.icon className="h-4 w-4 text-gray-400" />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900 truncate">
                            {result.name}
                          </div>
                          <div className="text-xs text-gray-500 truncate">
                            {result.description}
                          </div>
                        </div>
                        <div className="text-xs text-gray-400 capitalize">
                          {result.type}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* No Results */}
              {showGlobalSearchResults && globalSearch.trim().length > 0 && globalSearchResults.length === 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                  <div className="p-4 text-center text-gray-500 text-sm">
                    No results found for "{globalSearch}"
                  </div>
                </div>
              )}
            </div>

            {/* View Mode Dropdown */}
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                className="text-xs flex items-center space-x-1"
                onClick={() => setShowViewDropdown(!showViewDropdown)}
              >
                <Layers className="h-3 w-3" />
                <span>{viewMode.charAt(0).toUpperCase() + viewMode.slice(1)}</span>
                <ChevronDown className="h-3 w-3" />
              </Button>
              {showViewDropdown && (
                <div className="absolute right-0 mt-1 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                  <button
                    className="w-full text-left px-3 py-2 text-xs hover:bg-gray-50 flex items-center justify-between"
                    onClick={() => {
                      setViewMode('logical')
                      setShowViewDropdown(false)
                    }}
                  >
                    Logical
                    {viewMode === 'logical' && <Check className="h-3 w-3 text-blue-600" />}
                  </button>
                  <button
                    className="w-full text-left px-3 py-2 text-xs hover:bg-gray-50 flex items-center justify-between"
                    onClick={() => {
                      setViewMode('physical')
                      setShowViewDropdown(false)
                    }}
                  >
                    Physical
                    {viewMode === 'physical' && <Check className="h-3 w-3 text-blue-600" />}
                  </button>
                  <button
                    className="w-full text-left px-3 py-2 text-xs hover:bg-gray-50 text-gray-400 flex items-center justify-between"
                    disabled
                  >
                    Conceptual
                    <span className="text-xs">(coming soon)</span>
                  </button>
                </div>
              )}
            </div>

            {/* Integration Selector */}
            <Button variant="outline" size="sm" className="text-xs">
              <Database className="h-3 w-3 mr-1" />
              MS Fabric
              <ChevronDown className="h-3 w-3 ml-1" />
            </Button>

            {/* Notifications & Profile */}
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <ChevronDown className="h-3 w-3 text-gray-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Layer 2: Clean Toolbar Actions */}
        <div className="h-20 px-4 bg-white border-t border-gray-200">
          <div className="flex items-start h-full space-x-1 pt-2">
            {toolbarTabs[activeTab as keyof typeof toolbarTabs].groups.map((group, groupIdx) => (
              <React.Fragment key={groupIdx}>
                {/* Group Items */}
                <div className="flex items-center h-full">
                  {group.items.map((item, itemIdx) => (
                    <div key={itemIdx} className="relative group">
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`flex flex-col items-center justify-center h-16 w-16 rounded hover:bg-gray-100 transition-all px-1 ${
                          item.isToggle && item.isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                        }`}
                        onClick={item.action}
                      >
                        <div className="flex items-center">
                          <item.icon className="h-5 w-5" />
                          {item.hasSubmenu && (
                            <ChevronDown className="h-3 w-3 ml-0.5" />
                          )}
                        </div>
                        <span className="text-xs mt-1 text-center leading-tight max-w-full break-words">
                          {item.label}
                        </span>
                      </Button>

                      {/* Tooltip on Hover */}
                      {item.tooltip && (
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                          <div className="bg-gray-800 text-white text-xs px-2 py-1.5 rounded shadow-lg whitespace-nowrap">
                            {item.tooltip}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Group Separator */}
                {groupIdx < toolbarTabs[activeTab as keyof typeof toolbarTabs].groups.length - 1 && (
                  <div className="h-8 w-px bg-gray-300 mx-2" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Model Explorer */}
        <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-3 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search objects..."
                className="w-full pl-7 pr-3 py-1.5 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="p-2">
              {/* ERwin-Style Model Root Node - Updated Structure */}
              <div className="mb-1">
                <div
                  className="flex items-center justify-between p-2 bg-blue-50 border border-blue-200 rounded cursor-pointer"
                  onClick={() => toggleSection('model')}
                >
                  <div className="flex items-center space-x-2">
                    <ChevronDown className={`h-4 w-4 text-blue-600 transition-transform ${expandedSections.includes('model') ? 'rotate-0' : '-rotate-90'}`} />
                    <Database className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-semibold text-blue-800">Customer_Order_Model</span>
                  </div>
                  <Button variant="ghost" size="sm" className="h-5 w-5 p-0">
                    <MoreVertical className="h-3 w-3 text-blue-600" />
                  </Button>
                </div>

                {expandedSections.includes('model') && (
                  <div className="ml-4 mt-1 space-y-1">

                    {/* Diagrams Section */}
                    <div>
                      <div
                        className="flex items-center justify-between p-1.5 hover:bg-gray-50 rounded cursor-pointer group"
                        onClick={() => toggleSection('diagrams')}
                      >
                        <div className="flex items-center space-x-1">
                          <ChevronDown className={`h-3 w-3 text-gray-500 transition-transform ${expandedSections.includes('diagrams') ? 'rotate-0' : '-rotate-90'}`} />
                          <FileText className="h-3 w-3 text-orange-500" />
                          <span className="text-xs font-medium text-gray-700">Diagrams</span>
                          <span className="text-xs text-gray-500">({currentModel?.diagrams.length || 0})</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0 opacity-0 group-hover:opacity-100"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleAddDiagram()
                            }}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-4 w-4 p-0 opacity-0 group-hover:opacity-100">
                            <MoreVertical className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      {expandedSections.includes('diagrams') && currentModel && (
                        <div className="ml-5 mt-1">
                          <div
                            className={`flex items-center justify-between p-1.5 hover:bg-gray-50 rounded cursor-pointer group ${
                              currentModel.currentDiagramId === 'main' ? 'bg-blue-50 border border-blue-200' : ''
                            }`}
                            onClick={() => handleDiagramChange('main')}
                          >
                            <div className="flex items-center space-x-1">
                              <Square className="h-3 w-3 text-orange-400" />
                              <span className="text-xs text-gray-700">Main Diagram</span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-4 w-4 p-0 opacity-0 group-hover:opacity-100"
                              onClick={(e) => {
                                e.stopPropagation()
                                console.log('Diagram context menu: Main Diagram')
                              }}
                            >
                              <MoreVertical className="h-3 w-3" />
                            </Button>
                          </div>
                          <div
                            className={`flex items-center justify-between p-1.5 hover:bg-gray-50 rounded cursor-pointer group ${
                              currentModel.currentDiagramId === 'user' ? 'bg-blue-50 border border-blue-200' : ''
                            }`}
                            onClick={() => handleDiagramChange('user')}
                          >
                            <div className="flex items-center space-x-1">
                              <Square className="h-3 w-3 text-orange-400" />
                              <span className="text-xs text-gray-700">User Management</span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-4 w-4 p-0 opacity-0 group-hover:opacity-100"
                              onClick={(e) => {
                                e.stopPropagation()
                                console.log('Diagram context menu: User Management')
                              }}
                            >
                              <MoreVertical className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Entities Section */}
                    <div>
                      <div
                        className="flex items-center justify-between p-1.5 hover:bg-gray-50 rounded cursor-pointer group"
                        onClick={() => toggleSection('entities')}
                      >
                        <div className="flex items-center space-x-1">
                          <ChevronDown className={`h-3 w-3 text-gray-500 transition-transform ${expandedSections.includes('entities') ? 'rotate-0' : '-rotate-90'}`} />
                          <Table className="h-3 w-3 text-blue-500" />
                          <span className="text-xs font-medium text-gray-700">Entities</span>
                          <span className="text-xs text-gray-500">({currentDiagram?.entities.length || 0})</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0 opacity-0 group-hover:opacity-100"
                            onClick={(e) => {
                              e.stopPropagation()
                              // Create new entity directly from tree
                              const newEntityId = `entity_${Date.now()}`
                              const newEntity: Entity = {
                                id: newEntityId,
                                name: 'NewEntity',
                                x: 200 + (Math.random() * 200),
                                y: 200 + (Math.random() * 200),
                                color: '#6366F1',
                                attributes: [
                                  { name: 'ID', type: 'int', constraints: ['PK', 'NOT NULL'] },
                                  { name: 'Name', type: 'varchar(100)', constraints: ['NOT NULL'] }
                                ]
                              }

                              // Add to current diagram
                              setModels(prev => prev.map(model => {
                                if (model.id === currentModelId) {
                                  return {
                                    ...model,
                                    diagrams: model.diagrams.map(diagram => {
                                      if (diagram.id === model.currentDiagramId) {
                                        return {
                                          ...diagram,
                                          entities: [...diagram.entities, newEntity]
                                        }
                                      }
                                      return diagram
                                    })
                                  }
                                }
                                return model
                              }))

                              // Select the new entity
                              setSelectedEntity(newEntity)
                              setSelectedAttribute(null)
                              setSelectedRelationship(null)
                              setSelectedDiagram(null)

                              console.log('Created new entity:', newEntity.name)
                            }}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-4 w-4 p-0 opacity-0 group-hover:opacity-100">
                            <MoreVertical className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      {expandedSections.includes('entities') && currentDiagram && (
                        <div className="ml-5 mt-1">
                          <div
                            className={`flex items-center justify-between p-1.5 hover:bg-gray-50 rounded cursor-pointer group ${
                              selectedEntity?.name === 'Customer' ? 'bg-blue-50 border border-blue-200' : ''
                            }`}
                            onClick={() => {
                              const customerEntity = currentDiagram.entities.find(e => e.name === 'Customer')
                              if (customerEntity) {
                                setSelectedEntity(customerEntity)
                                setSelectedAttribute(null)
                                setSelectedRelationship(null)
                                setSelectedDiagram(null)
                              }
                            }}
                          >
                            <div className="flex items-center space-x-1">
                              <Square className="h-3 w-3 text-blue-500" />
                              <span className="text-xs text-gray-700">Customer</span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-4 w-4 p-0 opacity-0 group-hover:opacity-100"
                              onClick={(e) => {
                                e.stopPropagation()
                                console.log('Entity context menu: Customer')
                              }}
                            >
                              <MoreVertical className="h-3 w-3" />
                            </Button>
                          </div>
                          <div
                            className={`flex items-center justify-between p-1.5 hover:bg-gray-50 rounded cursor-pointer group ${
                              selectedEntity?.name === 'Order' ? 'bg-blue-50 border border-blue-200' : ''
                            }`}
                            onClick={() => {
                              const orderEntity = currentDiagram.entities.find(e => e.name === 'Order')
                              if (orderEntity) {
                                setSelectedEntity(orderEntity)
                                setSelectedAttribute(null)
                                setSelectedRelationship(null)
                                setSelectedDiagram(null)
                              }
                            }}
                          >
                            <div className="flex items-center space-x-1">
                              <Square className="h-3 w-3 text-green-500" />
                              <span className="text-xs text-gray-700">Order</span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-4 w-4 p-0 opacity-0 group-hover:opacity-100"
                              onClick={(e) => {
                                e.stopPropagation()
                                console.log('Entity context menu: Order')
                              }}
                            >
                              <MoreVertical className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Relationships Section */}
                    <div>
                      <div
                        className="flex items-center justify-between p-1.5 hover:bg-gray-50 rounded cursor-pointer group"
                        onClick={() => toggleSection('relationships')}
                      >
                        <div className="flex items-center space-x-1">
                          <ChevronDown className={`h-3 w-3 text-gray-500 transition-transform ${expandedSections.includes('relationships') ? 'rotate-0' : '-rotate-90'}`} />
                          <Link2 className="h-3 w-3 text-green-500" />
                          <span className="text-xs font-medium text-gray-700">Relationships</span>
                          <span className="text-xs text-gray-500">({currentDiagram?.relationships.length || 0})</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0 opacity-0 group-hover:opacity-100"
                            onClick={(e) => {
                              e.stopPropagation()
                              console.log('Add new relationship')
                            }}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-4 w-4 p-0 opacity-0 group-hover:opacity-100">
                            <MoreVertical className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      {expandedSections.includes('relationships') && currentDiagram && (
                        <div className="ml-5 mt-1">
                          <div
                            className="flex items-center justify-between p-1.5 hover:bg-gray-50 rounded cursor-pointer group"
                            onClick={() => {
                              const customerOrderRel = currentDiagram.relationships.find(r => r.from === 'customer' && r.to === 'order')
                              if (customerOrderRel) {
                                setSelectedRelationship(customerOrderRel)
                                setSelectedEntity(null)
                                setSelectedAttribute(null)
                                setSelectedDiagram(null)
                              }
                            }}
                          >
                            <div className="flex items-center space-x-1">
                              <GitBranch className="h-3 w-3 text-green-400" />
                              <span className="text-xs text-gray-700">Customer → Order</span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-4 w-4 p-0 opacity-0 group-hover:opacity-100"
                              onClick={(e) => {
                                e.stopPropagation()
                                console.log('Relationship context menu: Customer → Order')
                              }}
                            >
                              <MoreVertical className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Keys Section */}
                    <div>
                      <div
                        className="flex items-center justify-between p-1.5 hover:bg-gray-50 rounded cursor-pointer group"
                        onClick={() => toggleSection('keys')}
                      >
                        <div className="flex items-center space-x-1">
                          <ChevronDown className={`h-3 w-3 text-gray-500 transition-transform ${expandedSections.includes('keys') ? 'rotate-0' : '-rotate-90'}`} />
                          <KeyRound className="h-3 w-3 text-yellow-500" />
                          <span className="text-xs font-medium text-gray-700">Keys</span>
                          <span className="text-xs text-gray-500">(3)</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0 opacity-0 group-hover:opacity-100"
                            onClick={(e) => {
                              e.stopPropagation()
                              console.log('Add new key constraint')
                            }}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-4 w-4 p-0 opacity-0 group-hover:opacity-100">
                            <MoreVertical className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      {expandedSections.includes('keys') && (
                        <div className="ml-5 mt-1">
                          <div className="flex items-center justify-between p-1.5 hover:bg-gray-50 rounded cursor-pointer group">
                            <div className="flex items-center space-x-1">
                              <Key className="h-3 w-3 text-yellow-400" />
                              <span className="text-xs text-gray-700">(PK) CustomerID</span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-4 w-4 p-0 opacity-0 group-hover:opacity-100"
                              onClick={(e) => {
                                e.stopPropagation()
                                console.log('Key context menu: CustomerID')
                              }}
                            >
                              <MoreVertical className="h-3 w-3" />
                            </Button>
                          </div>
                          <div className="flex items-center justify-between p-1.5 hover:bg-gray-50 rounded cursor-pointer group">
                            <div className="flex items-center space-x-1">
                              <Key className="h-3 w-3 text-orange-400" />
                              <span className="text-xs text-gray-700">(FK) Order.CustomerID</span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-4 w-4 p-0 opacity-0 group-hover:opacity-100"
                              onClick={(e) => {
                                e.stopPropagation()
                                console.log('Key context menu: Order.CustomerID')
                              }}
                            >
                              <MoreVertical className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Views Section */}
                    <div>
                      <div
                        className="flex items-center justify-between p-1.5 hover:bg-gray-50 rounded cursor-pointer group"
                        onClick={() => toggleSection('views')}
                      >
                        <div className="flex items-center space-x-1">
                          <ChevronDown className={`h-3 w-3 text-gray-500 transition-transform ${expandedSections.includes('views') ? 'rotate-0' : '-rotate-90'}`} />
                          <Eye className="h-3 w-3 text-purple-500" />
                          <span className="text-xs font-medium text-gray-700">Views</span>
                          <span className="text-xs text-gray-500">(0)</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0 opacity-0 group-hover:opacity-100"
                            onClick={(e) => {
                              e.stopPropagation()
                              console.log('Add new view')
                            }}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-4 w-4 p-0 opacity-0 group-hover:opacity-100">
                            <MoreVertical className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Domains Section */}
                    <div>
                      <div
                        className="flex items-center justify-between p-1.5 hover:bg-gray-50 rounded cursor-pointer group"
                        onClick={() => toggleSection('domains')}
                      >
                        <div className="flex items-center space-x-1">
                          <ChevronDown className={`h-3 w-3 text-gray-500 transition-transform ${expandedSections.includes('domains') ? 'rotate-0' : '-rotate-90'}`} />
                          <BookOpen className="h-3 w-3 text-indigo-500" />
                          <span className="text-xs font-medium text-gray-700">Domains</span>
                          <span className="text-xs text-gray-500">(0)</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0 opacity-0 group-hover:opacity-100"
                            onClick={(e) => {
                              e.stopPropagation()
                              console.log('Add new domain')
                            }}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-4 w-4 p-0 opacity-0 group-hover:opacity-100">
                            <MoreVertical className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Business Rules Section */}
                    <div>
                      <div
                        className="flex items-center justify-between p-1.5 hover:bg-gray-50 rounded cursor-pointer group"
                        onClick={() => toggleSection('businessRules')}
                      >
                        <div className="flex items-center space-x-1">
                          <ChevronDown className={`h-3 w-3 text-gray-500 transition-transform ${expandedSections.includes('businessRules') ? 'rotate-0' : '-rotate-90'}`} />
                          <Shield className="h-3 w-3 text-red-500" />
                          <span className="text-xs font-medium text-gray-700">Business Rules</span>
                          <span className="text-xs text-gray-500">(0)</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0 opacity-0 group-hover:opacity-100"
                            onClick={(e) => {
                              e.stopPropagation()
                              console.log('Add new business rule')
                            }}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-4 w-4 p-0 opacity-0 group-hover:opacity-100">
                            <MoreVertical className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>

                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Center Panel - Diagram Canvas */}
        <div className="flex-1 bg-gray-100 relative flex flex-col">
          {/* Model Tabs (Top) */}
          <div className="bg-white border-b border-gray-200 px-4 py-1.5 flex items-center space-x-2">
            {models.map(model => (
              <div
                key={model.id}
                className={`flex items-center space-x-2 px-3 py-1 rounded-t-md cursor-pointer border-t border-l border-r ${
                  currentModelId === model.id
                    ? 'bg-white text-blue-600 border-gray-200'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border-transparent'
                }`}
                onClick={() => handleModelChange(model.id)}
              >
                <Database className="h-3 w-3" />
                <span className="text-xs font-medium">{model.name}</span>
                {models.length > 1 && (
                  <X
                    className="h-3 w-3 hover:text-red-500"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleCloseModel(model.id)
                    }}
                  />
                )}
              </div>
            ))}
            <Button variant="ghost" size="sm" className="h-6 px-2">
              <Plus className="h-3 w-3" />
              <span className="text-xs ml-1">New Model</span>
            </Button>
          </div>

          {/* Floating Toolbar Groups */}
          <div className="absolute right-4 top-12 z-10 flex flex-col space-y-2">
            {toolbarGroups.map(group => (
              <div key={group.id} className="bg-white rounded-lg shadow-lg border border-gray-200">
                {/* Group Header - Icon Only */}
                <div
                  className="flex items-center justify-center p-2 border-b border-gray-100 cursor-pointer hover:bg-gray-50 group"
                  onClick={() => toggleGroup(group.id)}
                  title={group.title}
                >
                  <group.icon className="h-4 w-4 text-gray-600" />
                  <ChevronRight
                    className={`h-3 w-3 text-gray-400 transition-transform ml-1 ${
                      !collapsedGroups.includes(group.id) ? 'rotate-90' : ''
                    }`}
                  />
                </div>

                {/* Group Tools - Icon Only */}
                {!collapsedGroups.includes(group.id) && (
                  <div className="p-1">
                    {group.tools.map(tool => (
                      <div key={tool.id} className="relative">
                        <Button
                          variant={selectedTool === tool.id ? 'default' : 'ghost'}
                          size="sm"
                          className="w-8 h-8 p-0 mb-1 relative group"
                          onClick={() => {
                            if (tool.hasSubmenu) {
                              setShowRelationshipSubmenu(!showRelationshipSubmenu)
                            } else {
                              setSelectedTool(tool.id)
                              setShowRelationshipSubmenu(false)
                            }
                          }}
                        >
                          <tool.icon className="h-4 w-4" />
                          {tool.hasSubmenu && (
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center">
                              <ChevronRight className="h-2 w-2 text-white" />
                            </div>
                          )}

                          {/* Tooltip */}
                          <div className="absolute right-full mr-2 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                            {tool.label}
                            <div className="absolute left-full top-1/2 transform -translate-y-1/2 border-l-4 border-l-gray-900 border-y-2 border-y-transparent"></div>
                          </div>
                        </Button>

                        {/* Relationship Submenu - Icon Only */}
                        {tool.hasSubmenu && showRelationshipSubmenu && (
                          <div className="absolute left-full top-0 ml-1 bg-white border border-gray-200 rounded-lg shadow-lg p-1 z-50">
                            {tool.submenu?.map(subTool => (
                              <Button
                                key={subTool.id}
                                variant={selectedTool === subTool.id ? 'default' : 'ghost'}
                                size="sm"
                                className="w-8 h-8 p-0 mb-1 group relative"
                                onClick={() => {
                                  setSelectedTool(subTool.id)
                                  setShowRelationshipSubmenu(false)
                                }}
                              >
                                <subTool.icon
                                  className={`h-4 w-4 ${
                                    subTool.style === 'solid'
                                      ? 'text-blue-600'
                                      : subTool.style === 'dashed'
                                      ? 'text-green-600'
                                      : 'text-gray-600'
                                  }`}
                                  style={{
                                    strokeDasharray: subTool.style === 'dashed' ? '2,2' : 'none'
                                  }}
                                />

                                {/* Submenu Tooltip */}
                                <div className="absolute right-full mr-2 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                                  {subTool.label}
                                  <div className="absolute left-full top-1/2 transform -translate-y-1/2 border-l-4 border-l-gray-900 border-y-2 border-y-transparent"></div>
                                </div>
                              </Button>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Canvas */}
          <div
            ref={canvasRef}
            className="flex-1 relative overflow-auto"
            onDrop={handleCanvasDrop}
            onDragOver={handleCanvasDragOver}
            onMouseMove={handleEntityMouseMove}
            onMouseUp={handleEntityMouseUp}
            onClick={() => setContextMenu({ show: false, x: 0, y: 0, type: null, target: null })}
          >
            <div className="absolute inset-0" style={{ width: '2000px', height: '2000px' }}>
              {/* ERwin-Style Entity Cards */}
              {currentDiagram?.entities.map(entity => (
                <div
                  key={entity.id}
                  className={`absolute bg-white border-2 border-black overflow-hidden transition-all duration-200 hover:shadow-md cursor-move select-none ${
                    selectedEntity?.id === entity.id ? 'ring-2 ring-blue-400' : ''
                  } ${
                    dragState.isDragging && dragState.entityId === entity.id ? 'opacity-75 scale-105 shadow-2xl' : ''
                  }`}
                  style={{ left: entity.x, top: entity.y, width: '200px' }}
                  onMouseDown={(e) => handleEntityMouseDown(e, entity)}
                  onClick={() => {
                    if (!dragState.isDragging) {
                      console.log('Entity clicked on canvas:', entity.name)
                      setSelectedEntity(entity)
                      setSelectedAttribute(null)
                      setSelectedRelationship(null)
                      setSelectedDiagram(null)
                    }
                  }}
                  onContextMenu={(e) => {
                    e.preventDefault()
                    setContextMenu({
                      show: true,
                      x: e.clientX,
                      y: e.clientY,
                      type: 'entity',
                      target: entity
                    })
                  }}
                >
                  {/* Entity Header - Classic ERwin Style */}
                  <div className="px-2 py-1 bg-white border-b-2 border-black text-center">
                    <h3 className="font-bold text-sm text-black">
                      {entity.name}
                    </h3>
                  </div>

                  {/* Attributes Section - ERwin Layout */}
                  <div className="bg-white text-xs">
                    {/* Primary Key Attributes - Top Section */}
                    {entity.attributes
                      .filter(attr => attr.constraints.includes('PK'))
                      .map((attr, idx) => (
                      <div
                        key={`pk-${idx}`}
                        className="flex items-center justify-between px-2 py-0.5 border-b border-gray-300 hover:bg-gray-50 transition-colors cursor-pointer group"
                        onContextMenu={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          setContextMenu({
                            show: true,
                            x: e.clientX,
                            y: e.clientY,
                            type: 'attribute',
                            target: { entity, attribute: attr }
                          })
                        }}
                      >
                        <div className="flex items-center space-x-1 flex-1 min-w-0">
                          <span className="font-bold text-black truncate">
                            {attr.name}
                          </span>
                        </div>

                        {/* Data Type and Constraints */}
                        <div className="flex flex-col items-end text-right">
                          <div className="flex items-center space-x-1">
                            <span className="font-mono text-xs text-black">
                              {attr.type}
                            </span>
                            <span className="font-bold text-black">PK</span>
                          </div>
                          {attr.domain && (
                            <div className="text-xs text-gray-600 italic">
                              {attr.domain}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}

                    {/* Separator Line between PKs and Non-PKs */}
                    {entity.attributes.filter(attr => attr.constraints.includes('PK')).length > 0 &&
                     entity.attributes.filter(attr => !attr.constraints.includes('PK')).length > 0 && (
                      <div className="border-t-2 border-black"></div>
                    )}

                    {/* Non-Primary Key Attributes - Bottom Section */}
                    {entity.attributes
                      .filter(attr => !attr.constraints.includes('PK'))
                      .map((attr, idx) => (
                      <div
                        key={`attr-${idx}`}
                        className="flex items-center justify-between px-2 py-0.5 border-b border-gray-300 last:border-0 hover:bg-gray-50 transition-colors cursor-pointer group"
                        onContextMenu={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          setContextMenu({
                            show: true,
                            x: e.clientX,
                            y: e.clientY,
                            type: 'attribute',
                            target: { entity, attribute: attr }
                          })
                        }}
                      >
                        <div className="flex items-center space-x-1 flex-1 min-w-0">
                          <span className="text-black truncate">
                            {attr.name}
                          </span>
                        </div>

                        {/* Data Type and Constraints */}
                        <div className="flex flex-col items-end text-right">
                          <div className="flex items-center space-x-1">
                            <span className="font-mono text-xs text-black">
                              {attr.type}
                            </span>
                            {attr.constraints.includes('FK') && (
                              <span className="font-bold text-black">FK</span>
                            )}
                            {!attr.nullable && !attr.constraints.includes('PK') && (
                              <span className="text-red-600 font-bold text-xs">*</span>
                            )}
                          </div>
                          {attr.domain && (
                            <div className="text-xs text-gray-600 italic">
                              {attr.domain}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Relationship Lines */}
              <svg className="absolute inset-0" width="2000" height="2000">
                {currentDiagram?.relationships.map(rel => {
                  const fromEntity = currentDiagram.entities.find(e => e.id === rel.from)
                  const toEntity = currentDiagram.entities.find(e => e.id === rel.to)
                  if (!fromEntity || !toEntity) return null

                  return (
                    <g key={rel.id}>
                      <line
                        x1={fromEntity.x + 120}
                        y1={fromEntity.y + 50}
                        x2={toEntity.x + 120}
                        y2={toEntity.y + 50}
                        stroke="#94A3B8"
                        strokeWidth="2"
                      />
                      <text
                        x={(fromEntity.x + toEntity.x) / 2 + 120}
                        y={(fromEntity.y + toEntity.y) / 2 + 50}
                        fill="#64748B"
                        fontSize="11"
                        textAnchor="middle"
                      >
                        {rel.cardinality}
                      </text>
                    </g>
                  )
                })}
              </svg>
            </div>
          </div>

          {/* Diagram Tabs (Bottom) */}
          <div className="bg-white border-t border-gray-200 px-4 py-2 flex items-center space-x-2">
            {currentModel?.diagrams.map(diagram => (
              <div
                key={diagram.id}
                className={`flex items-center space-x-2 px-3 py-1 rounded-md cursor-pointer ${
                  currentModel.currentDiagramId === diagram.id
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
                onClick={() => handleDiagramChange(diagram.id)}
              >
                <span className="text-xs">{diagram.name}</span>
                {currentModel.diagrams.length > 1 && (
                  <X className="h-3 w-3 hover:text-red-500" onClick={(e) => e.stopPropagation()} />
                )}
              </div>
            ))}
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2"
              onClick={handleAddDiagram}
            >
              <Plus className="h-3 w-3" />
              <span className="text-xs ml-1">New Diagram</span>
            </Button>
          </div>
        </div>

        {/* Right Panel - Enhanced Properties Pane */}
        <div
          className="bg-white border-l border-gray-200 flex flex-col relative"
          style={{ width: `${propertiesPaneWidth}px` }}
        >
          {/* Resize Handle */}
          <div
            className="absolute left-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-blue-500 transition-colors"
            onMouseDown={handleResizeStart}
          >
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-3 h-8 flex items-center justify-center">
              <GripVertical className="h-4 w-4 text-gray-400" />
            </div>
          </div>

          {/* Header with Contextual Actions */}
          <div className="px-4 py-3 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900">Properties</h3>
              {(selectedEntity || selectedAttribute || selectedRelationship) && (
                <div className="flex items-center space-x-1">
                  <Button variant="ghost" size="sm" className="h-7 px-2" title="Edit">
                    <Edit3 className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-7 px-2" title="Duplicate">
                    <Copy className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-7 px-2 text-red-600 hover:text-red-700" title="Delete">
                    <Trash className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
            {/* Context indicator */}
            <div className="text-xs text-gray-500 mt-1 capitalize">
              {(() => {
                const context = getPropertiesContext()
                console.log('Properties Pane rendering with context:', context)
                console.log('Current state values:', {
                  selectedEntity: selectedEntity?.name,
                  selectedAttribute: selectedAttribute?.name,
                  selectedRelationship: selectedRelationship?.id,
                  selectedDiagram: selectedDiagram?.name
                })
                return context
              })()} {selectedEntity?.name || selectedAttribute?.name || 'Properties'}
            </div>

            {/* Test Buttons for Context Switching */}
            <div className="mt-2 flex flex-col gap-1">
              <button
                onClick={() => {
                  console.log('TEST: Setting Customer entity')
                  const customerEntity = currentDiagram?.entities.find(e => e.name === 'Customer')
                  if (customerEntity) {
                    setSelectedEntity(customerEntity)
                    setSelectedAttribute(null)
                    setSelectedRelationship(null)
                    setSelectedDiagram(null)
                  }
                }}
                className="text-xs bg-blue-100 hover:bg-blue-200 px-2 py-1 rounded"
              >
                Test: Select Customer
              </button>
              <button
                onClick={() => {
                  console.log('TEST: Setting CustomerID attribute')
                  const customerEntity = currentDiagram?.entities.find(e => e.name === 'Customer')
                  const customerIdAttr = customerEntity?.attributes.find(a => a.name === 'CustomerID')
                  if (customerIdAttr) {
                    setSelectedAttribute(customerIdAttr)
                    setSelectedEntity(null)
                    setSelectedRelationship(null)
                    setSelectedDiagram(null)
                  }
                }}
                className="text-xs bg-green-100 hover:bg-green-200 px-2 py-1 rounded"
              >
                Test: Select CustomerID Attr
              </button>
              <button
                onClick={() => {
                  console.log('TEST: Clearing all selections')
                  setSelectedEntity(null)
                  setSelectedAttribute(null)
                  setSelectedRelationship(null)
                  setSelectedDiagram(null)
                }}
                className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded"
              >
                Test: Clear All
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto">
            {/* Model Properties */}
            {getPropertiesContext() === 'model' && (
              <div className="p-4 space-y-4">
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="text-sm font-semibold text-blue-800">📊 MODEL PROPERTIES</h3>
                  <p className="text-xs text-blue-600">Currently viewing model-level settings</p>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Model Name</label>
                    <input
                      type="text"
                      value={currentModel?.name || ''}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter model name"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Type</label>
                    <select className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="logical">Logical</option>
                      <option value="physical">Physical</option>
                      <option value="conceptual">Conceptual</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Database Target</label>
                    <select className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option>SQL Server</option>
                      <option>PostgreSQL</option>
                      <option>MySQL</option>
                      <option>Oracle</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Version</label>
                    <input
                      type="text"
                      defaultValue="1.0.0"
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      rows={3}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Model description..."
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Entity Properties */}
            {getPropertiesContext() === 'entity' && selectedEntity && (
              <div className="space-y-0">
                <div className="m-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <h3 className="text-sm font-semibold text-green-800">🗃️ ENTITY PROPERTIES</h3>
                  <p className="text-xs text-green-600">Currently editing: {selectedEntity.name}</p>
                </div>
                {/* General Section */}
                <div className="border-b border-gray-200">
                  <button
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:outline-none"
                    onClick={() => togglePropertiesSection('general')}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium uppercase tracking-wide text-gray-700">General</span>
                      <ChevronRight
                        className={`h-3 w-3 text-gray-400 transition-transform ${
                          propertiesPaneSections.includes('general') ? 'rotate-90' : ''
                        }`}
                      />
                    </div>
                  </button>
                  {propertiesPaneSections.includes('general') && (
                    <div className="px-4 pb-4 space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Entity Name</label>
                        <input
                          type="text"
                          value={selectedEntity.name}
                          onChange={(e) => {
                            const newName = e.target.value
                            setModels(prev => prev.map(model => {
                              if (model.id === currentModelId) {
                                return {
                                  ...model,
                                  diagrams: model.diagrams.map(diagram => {
                                    if (diagram.id === currentModel?.currentDiagramId) {
                                      return {
                                        ...diagram,
                                        entities: diagram.entities.map(entity =>
                                          entity.id === selectedEntity.id
                                            ? { ...entity, name: newName }
                                            : entity
                                        )
                                      }
                                    }
                                    return diagram
                                  })
                                }
                              }
                              return model
                            }))
                            setSelectedEntity({ ...selectedEntity, name: newName })
                          }}
                          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Schema</label>
                        <input
                          type="text"
                          defaultValue="dbo"
                          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Type</label>
                        <select className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                          <option>Entity</option>
                          <option>Subject Area</option>
                          <option>View</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>

                {/* Attributes Section */}
                <div className="border-b border-gray-200">
                  <button
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:outline-none"
                    onClick={() => togglePropertiesSection('attributes')}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium uppercase tracking-wide text-gray-700">
                        Attributes ({selectedEntity.attributes.length})
                      </span>
                      <ChevronRight
                        className={`h-3 w-3 text-gray-400 transition-transform ${
                          propertiesPaneSections.includes('attributes') ? 'rotate-90' : ''
                        }`}
                      />
                    </div>
                  </button>
                  {propertiesPaneSections.includes('attributes') && (
                    <div className="px-4 pb-4">
                      {/* Search for attributes */}
                      <div className="mb-3">
                        <div className="relative">
                          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
                          <input
                            type="text"
                            placeholder="Search attributes..."
                            className="w-full pl-7 pr-3 py-1.5 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        {selectedEntity.attributes.map((attr, idx) => (
                          <div
                            key={idx}
                            className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                            onClick={() => {
                              console.log('Attribute clicked:', attr.name)
                              setSelectedAttribute(attr)
                              setSelectedEntity(null)
                              setSelectedRelationship(null)
                              setSelectedDiagram(null)
                            }}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-sm">{attr.name}</span>
                              <span className="text-xs text-gray-500">{attr.type}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              {attr.constraints.map((constraint, cIdx) => (
                                <span
                                  key={cIdx}
                                  className="px-2 py-0.5 text-xs bg-gray-100 text-gray-700 rounded"
                                >
                                  {constraint}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}

                        {/* Add Attribute Button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full h-10 border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Attribute
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Appearance Section */}
                <div className="border-b border-gray-200">
                  <button
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:outline-none"
                    onClick={() => togglePropertiesSection('appearance')}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium uppercase tracking-wide text-gray-700">Appearance</span>
                      <ChevronRight
                        className={`h-3 w-3 text-gray-400 transition-transform ${
                          propertiesPaneSections.includes('appearance') ? 'rotate-90' : ''
                        }`}
                      />
                    </div>
                  </button>
                  {propertiesPaneSections.includes('appearance') && (
                    <div className="px-4 pb-4 space-y-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-2">Header Color</label>
                        <div className="grid grid-cols-5 gap-2">
                          {colorPalette.map(color => (
                            <button
                              key={color}
                              className={`w-8 h-8 rounded border-2 ${
                                selectedEntity.color === color ? 'border-gray-800' : 'border-gray-300'
                              }`}
                              style={{ backgroundColor: color }}
                              onClick={() => {
                                setModels(prev => prev.map(model => {
                                  if (model.id === currentModelId) {
                                    return {
                                      ...model,
                                      diagrams: model.diagrams.map(diagram => {
                                        if (diagram.id === currentModel?.currentDiagramId) {
                                          return {
                                            ...diagram,
                                            entities: diagram.entities.map(entity =>
                                              entity.id === selectedEntity.id
                                                ? { ...entity, color }
                                                : entity
                                            )
                                          }
                                        }
                                        return diagram
                                      })
                                    }
                                  }
                                  return model
                                }))
                                setSelectedEntity({ ...selectedEntity, color })
                              }}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Supabase-style toggles */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-medium text-gray-700">Show Data Types</label>
                          <button
                            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                              showDataTypes ? 'bg-blue-600' : 'bg-gray-200'
                            }`}
                            onClick={() => setShowDataTypes(!showDataTypes)}
                          >
                            <span
                              className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                                showDataTypes ? 'translate-x-5' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-medium text-gray-700">Show Key Icons</label>
                          <button
                            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                              showKeyIcons ? 'bg-blue-600' : 'bg-gray-200'
                            }`}
                            onClick={() => setShowKeyIcons(!showKeyIcons)}
                          >
                            <span
                              className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                                showKeyIcons ? 'translate-x-5' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Attribute Properties */}
            {getPropertiesContext() === 'attribute' && selectedAttribute && (
              <div className="p-4 space-y-4">
                <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                  <h3 className="text-sm font-semibold text-purple-800">🏷️ ATTRIBUTE PROPERTIES</h3>
                  <p className="text-xs text-purple-600">Currently editing: {selectedAttribute.name} ({selectedAttribute.type})</p>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Attribute Name</label>
                    <input
                      type="text"
                      value={selectedAttribute.name}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Data Type</label>
                    <select className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option>{selectedAttribute.type}</option>
                      <option>varchar(255)</option>
                      <option>int</option>
                      <option>decimal(10,2)</option>
                      <option>datetime</option>
                      <option>bit</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Default Value</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter default value"
                    />
                  </div>

                  {/* Toggles for attribute properties */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-medium text-gray-700">Primary Key</label>
                      <button
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                          selectedAttribute.constraints.includes('PK') ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                            selectedAttribute.constraints.includes('PK') ? 'translate-x-5' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-medium text-gray-700">Foreign Key</label>
                      <button
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                          selectedAttribute.constraints.includes('FK') ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                            selectedAttribute.constraints.includes('FK') ? 'translate-x-5' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-medium text-gray-700">Not Null</label>
                      <button
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                          selectedAttribute.constraints.includes('NOT NULL') ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                            selectedAttribute.constraints.includes('NOT NULL') ? 'translate-x-5' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-medium text-gray-700">Unique</label>
                      <button
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                          selectedAttribute.constraints.includes('UNIQUE') ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                            selectedAttribute.constraints.includes('UNIQUE') ? 'translate-x-5' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Default empty state */}
            {!selectedEntity && !selectedAttribute && !selectedRelationship && !selectedDiagram && (
              <div className="flex-1 flex items-center justify-center text-gray-500 text-sm p-8 text-center">
                <div>
                  <Database className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p>Select an object to view its properties</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Context Menu */}
      {contextMenu.show && (
        <div
          className="fixed bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50 min-w-48"
          style={{ left: contextMenu.x, top: contextMenu.y }}
          onClick={(e) => e.stopPropagation()}
        >
          {contextMenu.type === 'entity' && (
            <>
              <div className="px-4 py-2 text-xs font-semibold text-gray-500 border-b border-gray-100">
                Entity: {contextMenu.target?.name}
              </div>
              <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Add Attribute</span>
              </button>
              <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center space-x-2">
                <KeyRound className="h-4 w-4" />
                <span>Add Primary Key</span>
              </button>
              <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center space-x-2">
                <Link2 className="h-4 w-4" />
                <span>Add Foreign Key</span>
              </button>
              <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center space-x-2">
                <BookOpen className="h-4 w-4" />
                <span>Add Domain</span>
              </button>
              <div className="border-t border-gray-100 mt-1 pt-1">
                <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center space-x-2">
                  <Edit2 className="h-4 w-4" />
                  <span>Edit Entity</span>
                </button>
                <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center space-x-2">
                  <Copy className="h-4 w-4" />
                  <span>Duplicate Entity</span>
                </button>
                <button className="w-full text-left px-4 py-2 text-sm hover:bg-red-50 text-red-600 flex items-center space-x-2">
                  <Trash2 className="h-4 w-4" />
                  <span>Delete Entity</span>
                </button>
              </div>
            </>
          )}

          {contextMenu.type === 'attribute' && (
            <>
              <div className="px-4 py-2 text-xs font-semibold text-gray-500 border-b border-gray-100">
                Attribute: {contextMenu.target?.attribute?.name}
              </div>
              <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center space-x-2">
                <Edit2 className="h-4 w-4" />
                <span>Edit Name/Type</span>
              </button>
              <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center space-x-2">
                <ToggleLeft className="h-4 w-4" />
                <span>Toggle Null/Not Null</span>
              </button>
              <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center space-x-2">
                <BookOpen className="h-4 w-4" />
                <span>Assign Domain</span>
              </button>
              <div className="border-t border-gray-100 mt-1 pt-1">
                <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center space-x-2">
                  <KeyRound className="h-4 w-4" />
                  <span>Convert to PK</span>
                </button>
                <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center space-x-2">
                  <Link2 className="h-4 w-4" />
                  <span>Convert to FK</span>
                </button>
                <button className="w-full text-left px-4 py-2 text-sm hover:bg-red-50 text-red-600 flex items-center space-x-2">
                  <Trash2 className="h-4 w-4" />
                  <span>Delete Attribute</span>
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}