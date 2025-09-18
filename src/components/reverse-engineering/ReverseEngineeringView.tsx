'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ArrowLeft,
  RefreshCw,
  Database,
  CheckCircle,
  AlertCircle,
  Play,
  Save,
  Upload,
  RotateCcw,
  Eye,
  EyeOff,
  Info,
  CheckSquare,
  Square,
  FileText,
  Table,
  Layers,
  Zap,
  Settings,
  Globe,
  Lock,
  User,
  Key,
  AlertTriangle,
  Loader2
} from 'lucide-react'

interface ReverseEngineeringViewProps {
  onBack: () => void
}

type AuthType = 'userPassword' | 'oauth' | 'servicePrincipal'
type ModelType = 'logical' | 'physical' | 'both'
type LocationType = 'mart' | 'local'

export default function ReverseEngineeringView({ onBack }: ReverseEngineeringViewProps) {
  const [selectedDataSource, setSelectedDataSource] = useState<string>('')
  const [connectionDetails, setConnectionDetails] = useState({
    host: '',
    port: '',
    database: '',
    schema: ''
  })
  const [authType, setAuthType] = useState<AuthType>('userPassword')
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
    clientId: '',
    clientSecret: '',
    tenantId: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [extractionOptions, setExtractionOptions] = useState({
    tables: true,
    views: true,
    indexes: false,
    procedures: false,
    functions: false,
    includeDependencies: true,
    extractRelationships: true,
    extractConstraints: true,
    extractTriggers: false
  })
  const [targetModel, setTargetModel] = useState({
    name: '',
    location: 'mart' as LocationType,
    type: 'both' as ModelType
  })
  const [isRunning, setIsRunning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [logs, setLogs] = useState<string[]>([])
  const [step, setStep] = useState<'setup' | 'running' | 'completed'>('setup')

  const dataSources = [
    { id: 'fabric', name: 'Microsoft Fabric', supported: true, icon: '🔷' },
    { id: 'snowflake', name: 'Snowflake', supported: false, icon: '❄️' },
    { id: 'redshift', name: 'Amazon Redshift', supported: false, icon: '🔴' },
    { id: 'bigquery', name: 'Google BigQuery', supported: false, icon: '🔵' },
    { id: 'postgres', name: 'PostgreSQL', supported: false, icon: '🐘' },
    { id: 'mysql', name: 'MySQL', supported: false, icon: '🐬' },
    { id: 'oracle', name: 'Oracle Database', supported: false, icon: '🔺' },
    { id: 'sqlserver', name: 'SQL Server', supported: false, icon: '🟪' }
  ]

  const authTypes = [
    { id: 'userPassword', label: 'Username/Password', icon: User },
    { id: 'oauth', label: 'OAuth 2.0', icon: Key },
    { id: 'servicePrincipal', label: 'Service Principal', icon: Lock }
  ]

  const handleSelectAll = () => {
    const allSelected = Object.values(extractionOptions).slice(0, 5).every(v => v)
    setExtractionOptions(prev => ({
      ...prev,
      tables: !allSelected,
      views: !allSelected,
      indexes: !allSelected,
      procedures: !allSelected,
      functions: !allSelected
    }))
  }

  const handleRunReverseEngineering = async () => {
    setIsRunning(true)
    setStep('running')
    setProgress(0)
    setLogs([])

    // Simulate reverse engineering process
    const steps = [
      'Connecting to Microsoft Fabric...',
      'Authenticating with provided credentials...',
      'Scanning database schema...',
      'Extracting table definitions...',
      'Extracting view definitions...',
      'Analyzing relationships...',
      'Processing constraints...',
      'Generating model structure...',
      'Creating logical model...',
      'Creating physical model...',
      'Finalizing model...'
    ]

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800))
      setLogs(prev => [...prev, steps[i]])
      setProgress(((i + 1) / steps.length) * 100)
    }

    await new Promise(resolve => setTimeout(resolve, 1000))
    setLogs(prev => [...prev, '✅ Reverse engineering completed successfully!'])
    setStep('completed')
    setIsRunning(false)
  }

  const handleReset = () => {
    setSelectedDataSource('')
    setConnectionDetails({ host: '', port: '', database: '', schema: '' })
    setCredentials({ username: '', password: '', clientId: '', clientSecret: '', tenantId: '' })
    setTargetModel({ name: '', location: 'mart', type: 'both' })
    setExtractionOptions({
      tables: true,
      views: true,
      indexes: false,
      procedures: false,
      functions: false,
      includeDependencies: true,
      extractRelationships: true,
      extractConstraints: true,
      extractTriggers: false
    })
    setStep('setup')
    setProgress(0)
    setLogs([])
  }

  const canProceed = selectedDataSource && connectionDetails.host && connectionDetails.database &&
                   targetModel.name && (authType === 'userPassword' ? credentials.username && credentials.password : true)

  if (step === 'running') {
    return (
      <div className="h-screen bg-gray-50 flex flex-col">
        <header className="bg-white shadow-sm border-b p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={onBack} disabled={isRunning}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <h1 className="text-xl font-semibold">Reverse Engineering</h1>
            </div>
            <div className="flex items-center space-x-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm text-gray-600">Processing...</span>
            </div>
          </div>
        </header>

        <div className="flex-1 p-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <RefreshCw className="h-5 w-5 text-blue-600" />
                <span>Reverse Engineering in Progress</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Progress</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-96 overflow-y-auto">
                {logs.map((log, index) => (
                  <div key={index} className="mb-1">
                    <span className="text-gray-500">[{new Date().toLocaleTimeString()}]</span> {log}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (step === 'completed') {
    return (
      <div className="h-screen bg-gray-50 flex flex-col">
        <header className="bg-white shadow-sm border-b p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={onBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <h1 className="text-xl font-semibold">Reverse Engineering Complete</h1>
            </div>
          </div>
        </header>

        <div className="flex-1 p-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span>Reverse Engineering Successful</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Table className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-600">24</div>
                  <div className="text-sm text-gray-600">Tables</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <Eye className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-600">8</div>
                  <div className="text-sm text-gray-600">Views</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <Zap className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-purple-600">156</div>
                  <div className="text-sm text-gray-600">Relationships</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <Settings className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-orange-600">89</div>
                  <div className="text-sm text-gray-600">Constraints</div>
                </div>
              </div>

              <div className="flex space-x-4">
                <Button onClick={() => alert('Opening in diagram view...')}>
                  Open Model in Diagram
                </Button>
                <Button variant="outline" onClick={handleReset}>
                  Run Another Reverse Engineering
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-xl font-semibold">Reverse Engineering</h1>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Save className="h-4 w-4 mr-2" />
              Save Template
            </Button>
            <Button variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-2" />
              Load Template
            </Button>
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Main Setup Panel */}
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-4xl mx-auto space-y-6">

            {/* Data Source Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Database className="h-5 w-5" />
                  <span>Select Data Source</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {dataSources.map((source) => (
                    <div
                      key={source.id}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        selectedDataSource === source.id
                          ? 'border-blue-500 bg-blue-50'
                          : source.supported
                          ? 'border-gray-200 hover:border-gray-300'
                          : 'border-gray-100 bg-gray-50 cursor-not-allowed opacity-60'
                      }`}
                      onClick={() => source.supported && setSelectedDataSource(source.id)}
                    >
                      <div className="text-center">
                        <div className="text-2xl mb-2">{source.icon}</div>
                        <div className="font-medium text-sm">{source.name}</div>
                        {!source.supported && (
                          <div className="text-xs text-gray-500 mt-1">Coming Soon</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Connection Details */}
            {selectedDataSource && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Globe className="h-5 w-5" />
                    <span>Connection Details</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Host / Endpoint *
                      </label>
                      <input
                        type="text"
                        value={connectionDetails.host}
                        onChange={(e) => setConnectionDetails(prev => ({ ...prev, host: e.target.value }))}
                        placeholder="fabric.microsoft.com"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Port
                      </label>
                      <input
                        type="text"
                        value={connectionDetails.port}
                        onChange={(e) => setConnectionDetails(prev => ({ ...prev, port: e.target.value }))}
                        placeholder="1433"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Database *
                      </label>
                      <input
                        type="text"
                        value={connectionDetails.database}
                        onChange={(e) => setConnectionDetails(prev => ({ ...prev, database: e.target.value }))}
                        placeholder="MyDatabase"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Schema
                      </label>
                      <input
                        type="text"
                        value={connectionDetails.schema}
                        onChange={(e) => setConnectionDetails(prev => ({ ...prev, schema: e.target.value }))}
                        placeholder="dbo"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Authentication */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Authentication Method
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {authTypes.map((auth) => {
                        const Icon = auth.icon
                        return (
                          <div
                            key={auth.id}
                            className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                              authType === auth.id
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                            onClick={() => setAuthType(auth.id as AuthType)}
                          >
                            <div className="flex items-center space-x-2">
                              <Icon className="h-4 w-4" />
                              <span className="text-sm font-medium">{auth.label}</span>
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    {/* Authentication Fields */}
                    <div className="mt-4 space-y-3">
                      {authType === 'userPassword' && (
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Username *
                            </label>
                            <input
                              type="text"
                              value={credentials.username}
                              onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Password *
                            </label>
                            <div className="relative">
                              <input
                                type={showPassword ? 'text' : 'password'}
                                value={credentials.password}
                                onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                              >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {authType === 'servicePrincipal' && (
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Client ID
                            </label>
                            <input
                              type="text"
                              value={credentials.clientId}
                              onChange={(e) => setCredentials(prev => ({ ...prev, clientId: e.target.value }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Client Secret
                            </label>
                            <input
                              type="password"
                              value={credentials.clientSecret}
                              onChange={(e) => setCredentials(prev => ({ ...prev, clientSecret: e.target.value }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Tenant ID
                            </label>
                            <input
                              type="text"
                              value={credentials.tenantId}
                              onChange={(e) => setCredentials(prev => ({ ...prev, tenantId: e.target.value }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                        </div>
                      )}

                      {authType === 'oauth' && (
                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <Info className="h-4 w-4 text-blue-600" />
                            <span className="text-sm text-blue-800">
                              OAuth authentication will redirect you to Microsoft login page.
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Objects to Extract */}
            {selectedDataSource && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Layers className="h-5 w-5" />
                      <span>Objects to Extract</span>
                    </div>
                    <Button variant="outline" size="sm" onClick={handleSelectAll}>
                      <CheckSquare className="h-4 w-4 mr-2" />
                      Select All
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      {extractionOptions.tables ?
                        <CheckSquare className="h-4 w-4 text-blue-600" /> :
                        <Square className="h-4 w-4 text-gray-400" />
                      }
                      <span>Tables</span>
                      <input
                        type="checkbox"
                        checked={extractionOptions.tables}
                        onChange={(e) => setExtractionOptions(prev => ({ ...prev, tables: e.target.checked }))}
                        className="sr-only"
                      />
                    </label>

                    <label className="flex items-center space-x-2 cursor-pointer">
                      {extractionOptions.views ?
                        <CheckSquare className="h-4 w-4 text-blue-600" /> :
                        <Square className="h-4 w-4 text-gray-400" />
                      }
                      <span>Views</span>
                      <input
                        type="checkbox"
                        checked={extractionOptions.views}
                        onChange={(e) => setExtractionOptions(prev => ({ ...prev, views: e.target.checked }))}
                        className="sr-only"
                      />
                    </label>

                    <label className="flex items-center space-x-2 cursor-pointer">
                      {extractionOptions.indexes ?
                        <CheckSquare className="h-4 w-4 text-blue-600" /> :
                        <Square className="h-4 w-4 text-gray-400" />
                      }
                      <span>Indexes</span>
                      <input
                        type="checkbox"
                        checked={extractionOptions.indexes}
                        onChange={(e) => setExtractionOptions(prev => ({ ...prev, indexes: e.target.checked }))}
                        className="sr-only"
                      />
                    </label>

                    <label className="flex items-center space-x-2 cursor-pointer">
                      {extractionOptions.procedures ?
                        <CheckSquare className="h-4 w-4 text-blue-600" /> :
                        <Square className="h-4 w-4 text-gray-400" />
                      }
                      <span>Procedures</span>
                      <input
                        type="checkbox"
                        checked={extractionOptions.procedures}
                        onChange={(e) => setExtractionOptions(prev => ({ ...prev, procedures: e.target.checked }))}
                        className="sr-only"
                      />
                    </label>

                    <label className="flex items-center space-x-2 cursor-pointer">
                      {extractionOptions.functions ?
                        <CheckSquare className="h-4 w-4 text-blue-600" /> :
                        <Square className="h-4 w-4 text-gray-400" />
                      }
                      <span>Functions</span>
                      <input
                        type="checkbox"
                        checked={extractionOptions.functions}
                        onChange={(e) => setExtractionOptions(prev => ({ ...prev, functions: e.target.checked }))}
                        className="sr-only"
                      />
                    </label>
                  </div>

                  <div className="mt-6 space-y-3">
                    <h4 className="font-medium text-gray-900">Extraction Options</h4>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        {extractionOptions.includeDependencies ?
                          <CheckSquare className="h-4 w-4 text-blue-600" /> :
                          <Square className="h-4 w-4 text-gray-400" />
                        }
                        <span>Include Dependencies</span>
                        <input
                          type="checkbox"
                          checked={extractionOptions.includeDependencies}
                          onChange={(e) => setExtractionOptions(prev => ({ ...prev, includeDependencies: e.target.checked }))}
                          className="sr-only"
                        />
                      </label>

                      <label className="flex items-center space-x-2 cursor-pointer">
                        {extractionOptions.extractRelationships ?
                          <CheckSquare className="h-4 w-4 text-blue-600" /> :
                          <Square className="h-4 w-4 text-gray-400" />
                        }
                        <span>Extract Relationships (PK/FK detection)</span>
                        <input
                          type="checkbox"
                          checked={extractionOptions.extractRelationships}
                          onChange={(e) => setExtractionOptions(prev => ({ ...prev, extractRelationships: e.target.checked }))}
                          className="sr-only"
                        />
                      </label>

                      <label className="flex items-center space-x-2 cursor-pointer">
                        {extractionOptions.extractConstraints ?
                          <CheckSquare className="h-4 w-4 text-blue-600" /> :
                          <Square className="h-4 w-4 text-gray-400" />
                        }
                        <span>Extract Constraints</span>
                        <input
                          type="checkbox"
                          checked={extractionOptions.extractConstraints}
                          onChange={(e) => setExtractionOptions(prev => ({ ...prev, extractConstraints: e.target.checked }))}
                          className="sr-only"
                        />
                      </label>

                      <label className="flex items-center space-x-2 cursor-pointer">
                        {extractionOptions.extractTriggers ?
                          <CheckSquare className="h-4 w-4 text-blue-600" /> :
                          <Square className="h-4 w-4 text-gray-400" />
                        }
                        <span>Extract Triggers</span>
                        <input
                          type="checkbox"
                          checked={extractionOptions.extractTriggers}
                          onChange={(e) => setExtractionOptions(prev => ({ ...prev, extractTriggers: e.target.checked }))}
                          className="sr-only"
                        />
                      </label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Target Model Settings */}
            {selectedDataSource && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="h-5 w-5" />
                    <span>Target Model Settings</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Model Name *
                    </label>
                    <input
                      type="text"
                      value={targetModel.name}
                      onChange={(e) => setTargetModel(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="My Reverse Engineered Model"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Location
                      </label>
                      <div className="space-y-2">
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="radio"
                            value="mart"
                            checked={targetModel.location === 'mart'}
                            onChange={(e) => setTargetModel(prev => ({ ...prev, location: e.target.value as LocationType }))}
                            className="text-blue-600"
                          />
                          <span>Mart Repository</span>
                        </label>
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="radio"
                            value="local"
                            checked={targetModel.location === 'local'}
                            onChange={(e) => setTargetModel(prev => ({ ...prev, location: e.target.value as LocationType }))}
                            className="text-blue-600"
                          />
                          <span>Local Storage</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Model Type
                      </label>
                      <div className="space-y-2">
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="radio"
                            value="logical"
                            checked={targetModel.type === 'logical'}
                            onChange={(e) => setTargetModel(prev => ({ ...prev, type: e.target.value as ModelType }))}
                            className="text-blue-600"
                          />
                          <span>Logical Only</span>
                        </label>
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="radio"
                            value="physical"
                            checked={targetModel.type === 'physical'}
                            onChange={(e) => setTargetModel(prev => ({ ...prev, type: e.target.value as ModelType }))}
                            className="text-blue-600"
                          />
                          <span>Physical Only</span>
                        </label>
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="radio"
                            value="both"
                            checked={targetModel.type === 'both'}
                            onChange={(e) => setTargetModel(prev => ({ ...prev, type: e.target.value as ModelType }))}
                            className="text-blue-600"
                          />
                          <span>Both</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Action Button */}
            {selectedDataSource && (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex justify-center">
                    <Button
                      size="lg"
                      onClick={handleRunReverseEngineering}
                      disabled={!canProceed}
                      className="px-8"
                    >
                      <Play className="h-5 w-5 mr-2" />
                      Run Reverse Engineering
                    </Button>
                  </div>
                  {!canProceed && (
                    <div className="flex items-center justify-center mt-3 text-sm text-amber-600">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Please fill in all required fields to proceed
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Right Properties Panel */}
        <div className="w-80 bg-white border-l p-4 overflow-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Context Help</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-gray-600 space-y-3">
              {!selectedDataSource && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Getting Started</h4>
                  <p>Select a data source to begin the reverse engineering process. Currently, Microsoft Fabric is fully supported with other platforms coming soon.</p>
                </div>
              )}

              {selectedDataSource === 'fabric' && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Microsoft Fabric</h4>
                  <p>Connect to your Microsoft Fabric workspace and extract schema metadata to create a comprehensive data model.</p>

                  <h5 className="font-medium text-gray-900 mt-3 mb-1">Connection Tips:</h5>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>Use your Fabric workspace URL as the host</li>
                    <li>Database refers to your lakehouse or warehouse name</li>
                    <li>Schema is typically 'dbo' for most cases</li>
                  </ul>
                </div>
              )}

              {selectedDataSource && connectionDetails.host && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Extraction Options</h4>
                  <p>Choose which database objects to extract and include in your model. Relationships and constraints are automatically detected when available.</p>
                </div>
              )}

              <div className="pt-3 border-t">
                <h4 className="font-medium text-gray-900 mb-2">Best Practices</h4>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>Test connection with read-only credentials</li>
                  <li>Include relationships for better model accuracy</li>
                  <li>Use descriptive model names for organization</li>
                  <li>Save templates for repeated extractions</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}