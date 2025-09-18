'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ArrowLeft,
  GitCompare,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Plus,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Download,
  FileText,
  Settings,
  Search,
  Filter,
  Eye,
  Database,
  Home,
  Users,
  RefreshCw,
  MoreHorizontal
} from 'lucide-react'

interface CompareViewProps {
  onBack: () => void
}

const sampleModels = [
  {
    id: 'customer_v12',
    name: 'CustomerDB v1.2',
    version: '1.2',
    entities: ['Customer', 'Order', 'OrderItem'],
    description: 'Basic customer and order management system',
    lastModified: '2024-01-15',
    author: 'John Doe'
  },
  {
    id: 'customer_v13',
    name: 'CustomerDB v1.3',
    version: '1.3',
    entities: ['Customer', 'Order', 'OrderItem', 'Product'],
    description: 'Enhanced with product catalog functionality',
    lastModified: '2024-01-20',
    author: 'Jane Smith'
  },
  {
    id: 'inventory_v1',
    name: 'Inventory System v1.0',
    version: '1.0',
    entities: ['Product', 'Category', 'Supplier', 'Stock'],
    description: 'Complete inventory management system',
    lastModified: '2024-01-18',
    author: 'Mike Johnson'
  }
]

const comparisonResults = [
  {
    type: 'Entity',
    name: 'Customer',
    leftModel: {
      exists: true,
      properties: {
        'CustomerID': 'INT PRIMARY KEY',
        'FirstName': 'VARCHAR(50)',
        'LastName': 'VARCHAR(50)',
        'Email': 'VARCHAR(100)'
      }
    },
    rightModel: {
      exists: true,
      properties: {
        'CustomerID': 'INT PRIMARY KEY',
        'FirstName': 'VARCHAR(50)',
        'LastName': 'VARCHAR(50)',
        'Email': 'VARCHAR(100)',
        'PhoneNumber': 'VARCHAR(20)'
      }
    },
    status: 'different',
    conflicts: ['PhoneNumber field added in right model']
  },
  {
    type: 'Entity',
    name: 'Order',
    leftModel: {
      exists: true,
      properties: {
        'OrderID': 'INT PRIMARY KEY',
        'CustomerID': 'INT FOREIGN KEY',
        'OrderDate': 'DATETIME',
        'TotalAmount': 'DECIMAL(10,2)'
      }
    },
    rightModel: {
      exists: true,
      properties: {
        'OrderID': 'INT PRIMARY KEY',
        'CustomerID': 'INT FOREIGN KEY',
        'OrderDate': 'DATETIME',
        'TotalAmount': 'DECIMAL(12,2)',
        'Status': 'VARCHAR(20)'
      }
    },
    status: 'different',
    conflicts: ['TotalAmount precision changed', 'Status field added']
  },
  {
    type: 'Entity',
    name: 'Product',
    leftModel: {
      exists: false,
      properties: {}
    },
    rightModel: {
      exists: true,
      properties: {
        'ProductID': 'INT PRIMARY KEY',
        'ProductName': 'VARCHAR(100)',
        'Price': 'DECIMAL(10,2)'
      }
    },
    status: 'new',
    conflicts: ['Entity only exists in right model']
  }
]

export default function CompareView({ onBack }: CompareViewProps) {
  const [leftModel, setLeftModel] = useState('')
  const [rightModel, setRightModel] = useState('')
  const [enableMergeModel, setEnableMergeModel] = useState(false)
  const [comparisonType, setComparisonType] = useState('structure')
  const [isComparing, setIsComparing] = useState(false)
  const [hasCompared, setHasCompared] = useState(false)
  const [selectedConflict, setSelectedConflict] = useState<number | null>(null)
  const [filterType, setFilterType] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [showExportDrawer, setShowExportDrawer] = useState(false)
  const [mergeModelData, setMergeModelData] = useState<any>({})

  // Navigation items
  const navItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'models', icon: Database, label: 'Models' },
    { id: 'reverse-engineering', icon: RefreshCw, label: 'Reverse Engineering' },
    { id: 'compare', icon: GitCompare, label: 'Complete Compare', active: true },
    { id: 'users', icon: Users, label: 'Users' },
    { id: 'settings', icon: Settings, label: 'Settings' }
  ]

  const handleStartComparison = () => {
    if (leftModel && rightModel) {
      setIsComparing(true)
      setTimeout(() => {
        setIsComparing(false)
        setHasCompared(true)
      }, 2000)
    }
  }

  const handleConflictResolution = (index: number, action: 'take-left' | 'take-right' | 'add-to-merge' | 'skip') => {
    console.log(`Resolving conflict ${index} with action: ${action}`)
    // Update merge model data based on action
    if (action === 'add-to-merge') {
      setMergeModelData(prev => ({
        ...prev,
        [comparisonResults[index].name]: comparisonResults[index]
      }))
    }
  }

  const filteredResults = comparisonResults.filter(result => {
    const matchesFilter = filterType === 'all' || result.status === filterType
    const matchesSearch = result.name.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const renderConfigurationForm = () => (
    <div className="space-y-6">
      {/* Model Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Model Selection</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left Model */}
            <div>
              <label className="block text-sm font-medium mb-2 text-blue-600">Left Model (Source)</label>
              <select
                value={leftModel}
                onChange={(e) => setLeftModel(e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select left model...</option>
                {sampleModels.map(model => (
                  <option key={model.id} value={model.id}>{model.name}</option>
                ))}
              </select>
              {leftModel && (
                <div className="mt-2 p-3 bg-blue-50 rounded-lg text-sm">
                  <div className="font-medium">{sampleModels.find(m => m.id === leftModel)?.name}</div>
                  <div className="text-gray-600">{sampleModels.find(m => m.id === leftModel)?.description}</div>
                  <div className="text-gray-500">Modified: {sampleModels.find(m => m.id === leftModel)?.lastModified}</div>
                </div>
              )}
            </div>

            {/* Right Model */}
            <div>
              <label className="block text-sm font-medium mb-2 text-red-600">Right Model (Target)</label>
              <select
                value={rightModel}
                onChange={(e) => setRightModel(e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500"
              >
                <option value="">Select right model...</option>
                {sampleModels.map(model => (
                  <option key={model.id} value={model.id}>{model.name}</option>
                ))}
              </select>
              {rightModel && (
                <div className="mt-2 p-3 bg-red-50 rounded-lg text-sm">
                  <div className="font-medium">{sampleModels.find(m => m.id === rightModel)?.name}</div>
                  <div className="text-gray-600">{sampleModels.find(m => m.id === rightModel)?.description}</div>
                  <div className="text-gray-500">Modified: {sampleModels.find(m => m.id === rightModel)?.lastModified}</div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comparison Options */}
      <Card>
        <CardHeader>
          <CardTitle>Comparison Options</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Comparison Type</label>
              <select
                value={comparisonType}
                onChange={(e) => setComparisonType(e.target.value)}
                className="w-full p-3 border rounded-lg"
              >
                <option value="structure">Structure Only</option>
                <option value="data">Data Values</option>
                <option value="both">Structure + Data</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="enableMerge"
                checked={enableMergeModel}
                onChange={(e) => setEnableMergeModel(e.target.checked)}
                className="w-4 h-4 text-green-600"
              />
              <label htmlFor="enableMerge" className="text-sm font-medium text-green-600">
                Enable Merge Model Generation
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Button */}
      <div className="flex justify-center">
        <Button
          onClick={handleStartComparison}
          disabled={!leftModel || !rightModel || leftModel === rightModel || isComparing}
          size="lg"
          className="px-8"
        >
          {isComparing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Comparing Models...
            </>
          ) : (
            <>
              <GitCompare className="mr-2 h-5 w-5" />
              Start Comparison
            </>
          )}
        </Button>
      </div>
    </div>
  )

  const renderComparisonGrid = () => (
    <div className="flex-1 flex flex-col">
      {/* Filters and Search */}
      <div className="bg-white border-b p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="border rounded-md px-3 py-1 text-sm"
              >
                <option value="all">All Objects</option>
                <option value="different">Conflicts Only</option>
                <option value="new">New Objects</option>
                <option value="same">Identical Objects</option>
              </select>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search objects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-1 border rounded-md text-sm w-64"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">
              {filteredResults.length} of {comparisonResults.length} objects
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowExportDrawer(true)}
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Three-Column Comparison Grid */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full grid grid-cols-3 divide-x">
          {/* Left Model Column */}
          <div className="overflow-auto">
            <div className="bg-blue-50 p-3 border-b">
              <div className="text-sm font-medium text-blue-900">
                {sampleModels.find(m => m.id === leftModel)?.name}
              </div>
              <div className="text-xs text-blue-700">Left Model (Source)</div>
            </div>
            <div className="divide-y">
              {filteredResults.map((result, index) => (
                <div
                  key={index}
                  className={`p-3 cursor-pointer hover:bg-gray-50 ${
                    selectedConflict === index ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                  }`}
                  onClick={() => setSelectedConflict(index)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-sm">{result.name}</div>
                      <div className="text-xs text-gray-500">{result.type}</div>
                    </div>
                    {result.leftModel.exists ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                  {result.leftModel.exists && (
                    <div className="mt-2 text-xs text-gray-600">
                      {Object.keys(result.leftModel.properties).length} properties
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Merge Model Column (conditional) */}
          {enableMergeModel && (
            <div className="overflow-auto">
              <div className="bg-green-50 p-3 border-b">
                <div className="text-sm font-medium text-green-900">Merge Model</div>
                <div className="text-xs text-green-700">Generated Result</div>
              </div>
              <div className="divide-y">
                {filteredResults.map((result, index) => (
                  <div
                    key={index}
                    className={`p-3 cursor-pointer hover:bg-gray-50 ${
                      selectedConflict === index ? 'bg-green-50 border-l-4 border-l-green-500' : ''
                    }`}
                    onClick={() => setSelectedConflict(index)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-sm">{result.name}</div>
                        <div className="text-xs text-gray-500">{result.type}</div>
                      </div>
                      {mergeModelData[result.name] ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <div className="h-4 w-4 border-2 border-dashed border-gray-300 rounded" />
                      )}
                    </div>
                    {result.status !== 'same' && (
                      <div className="mt-2 flex space-x-1">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs px-2 py-1 h-6"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleConflictResolution(index, 'take-left')
                          }}
                        >
                          ← Take Left
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs px-2 py-1 h-6"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleConflictResolution(index, 'take-right')
                          }}
                        >
                          Take Right →
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs px-2 py-1 h-6"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleConflictResolution(index, 'add-to-merge')
                          }}
                        >
                          + Merge
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Right Model Column */}
          <div className="overflow-auto">
            <div className="bg-red-50 p-3 border-b">
              <div className="text-sm font-medium text-red-900">
                {sampleModels.find(m => m.id === rightModel)?.name}
              </div>
              <div className="text-xs text-red-700">Right Model (Target)</div>
            </div>
            <div className="divide-y">
              {filteredResults.map((result, index) => (
                <div
                  key={index}
                  className={`p-3 cursor-pointer hover:bg-gray-50 ${
                    selectedConflict === index ? 'bg-red-50 border-r-4 border-r-red-500' : ''
                  }`}
                  onClick={() => setSelectedConflict(index)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-sm">{result.name}</div>
                      <div className="text-xs text-gray-500">{result.type}</div>
                    </div>
                    {result.rightModel.exists ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                  {result.rightModel.exists && (
                    <div className="mt-2 text-xs text-gray-600">
                      {Object.keys(result.rightModel.properties).length} properties
                    </div>
                  )}
                  {result.status !== 'same' && (
                    <div className="mt-2">
                      <span className={`text-xs px-2 py-1 rounded ${
                        result.status === 'different' ? 'bg-yellow-100 text-yellow-800' :
                        result.status === 'new' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {result.status === 'different' ? 'Modified' :
                         result.status === 'new' ? 'New' : 'Identical'}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderPropertyPane = () => (
    <div className="h-64 bg-white border-t overflow-auto">
      <div className="p-4">
        {selectedConflict !== null ? (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">{filteredResults[selectedConflict].name} - Detailed Properties</h3>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline">
                  <Eye className="h-4 w-4 mr-1" />
                  Preview
                </Button>
                <Button size="sm" variant="outline">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {/* Left Model Properties */}
              <div>
                <h4 className="text-sm font-medium text-blue-600 mb-2">Left Model Properties</h4>
                {filteredResults[selectedConflict].leftModel.exists ? (
                  <div className="space-y-2">
                    {Object.entries(filteredResults[selectedConflict].leftModel.properties).map(([key, value]) => (
                      <div key={key} className="flex justify-between text-sm">
                        <span className="font-medium">{key}:</span>
                        <span className="text-gray-600">{value}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-gray-500 italic">Object does not exist in left model</div>
                )}
              </div>

              {/* Right Model Properties */}
              <div>
                <h4 className="text-sm font-medium text-red-600 mb-2">Right Model Properties</h4>
                {filteredResults[selectedConflict].rightModel.exists ? (
                  <div className="space-y-2">
                    {Object.entries(filteredResults[selectedConflict].rightModel.properties).map(([key, value]) => (
                      <div key={key} className="flex justify-between text-sm">
                        <span className="font-medium">{key}:</span>
                        <span className="text-gray-600">{value}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-gray-500 italic">Object does not exist in right model</div>
                )}
              </div>
            </div>

            {/* Conflicts Summary */}
            {filteredResults[selectedConflict].conflicts.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-yellow-600 mb-2">Detected Conflicts</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {filteredResults[selectedConflict].conflicts.map((conflict, index) => (
                    <li key={index} className="flex items-center">
                      <AlertTriangle className="h-3 w-3 text-yellow-500 mr-2" />
                      {conflict}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center text-gray-500 mt-8">
            Select an object from the comparison grid to view detailed properties
          </div>
        )}
      </div>
    </div>
  )

  const renderExportDrawer = () => {
    if (!showExportDrawer) return null

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
        <div className="w-96 bg-white h-full overflow-auto">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Export & Reports</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowExportDrawer(false)}>
                ✕
              </Button>
            </div>
          </div>

          <div className="p-4 space-y-4">
            <div>
              <h4 className="font-medium mb-2">Export Options</h4>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Comparison Report (PDF)
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  Differences Summary (CSV)
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Database className="h-4 w-4 mr-2" />
                  Merge Model (SQL)
                </Button>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Report Templates</h4>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  Executive Summary
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Technical Details
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Migration Guide
                </Button>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Share & Collaborate</h4>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  Generate Share Link
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Email Report
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-gray-50 flex">
      {/* Left Navigation */}
      <nav className="w-64 bg-white border-r border-gray-200">
        <div className="p-4">
          <div className="flex items-center space-x-3 mb-8">
            <Database className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-lg font-bold text-gray-900">Data Modeling Studio</h1>
              <p className="text-xs text-gray-500">Professional Edition</p>
            </div>
          </div>

          <div className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Button
                  key={item.id}
                  variant={item.active ? "default" : "ghost"}
                  className="w-full justify-start px-3"
                  onClick={() => item.id === 'dashboard' && onBack()}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  <span>{item.label}</span>
                </Button>
              )
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm border-b p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold">Complete Compare</h1>
              <div className="text-sm text-gray-500">
                Professional model comparison with inline conflict resolution
              </div>
            </div>

            {hasCompared && (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Comparison Complete</span>
                <span>•</span>
                <span>{filteredResults.filter(r => r.status === 'different').length} conflicts found</span>
              </div>
            )}
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {!hasCompared ? (
            <div className="flex-1 p-6 overflow-auto">
              {renderConfigurationForm()}
            </div>
          ) : (
            <>
              {renderComparisonGrid()}
              {renderPropertyPane()}
            </>
          )}
        </div>
      </div>

      {/* Export Drawer */}
      {renderExportDrawer()}
    </div>
  )
}