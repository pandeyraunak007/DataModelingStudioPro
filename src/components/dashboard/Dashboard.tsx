'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Database,
  GitCompare,
  Users,
  Settings,
  Search,
  Bell,
  User,
  Plus,
  FolderOpen,
  RefreshCw,
  Star,
  Clock,
  Eye,
  Lock,
  CheckCircle,
  AlertCircle,
  Home,
  FileText,
  GitBranch,
  ChevronDown,
  Menu
} from 'lucide-react'
import DiagramView from '@/components/diagram/DiagramView'
import CompareView from '@/components/compare/CompareView'
import ReverseEngineeringView from '@/components/reverse-engineering/ReverseEngineeringView'

type ViewType = 'dashboard' | 'models' | 'reverse-engineering' | 'compare' | 'users' | 'settings' | 'diagram'

export default function Dashboard() {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  // Sample data
  const recentModels = [
    { id: 1, name: 'CustomerDB v2.1', type: 'ERD', lastModified: '2 hours ago', status: 'active', entities: 12 },
    { id: 2, name: 'E-commerce Platform', type: 'Logical', lastModified: '1 day ago', status: 'locked', entities: 25 },
    { id: 3, name: 'Inventory System', type: 'Physical', lastModified: '3 days ago', status: 'checked-out', entities: 8 },
    { id: 4, name: 'CRM Database', type: 'ERD', lastModified: '1 week ago', status: 'active', entities: 18 },
    { id: 5, name: 'Analytics Warehouse', type: 'Logical', lastModified: '2 weeks ago', status: 'active', entities: 35 }
  ]

  const favoriteModels = [
    { id: 1, name: 'Core Banking System', entities: 45, type: 'Production' },
    { id: 2, name: 'User Management', entities: 12, type: 'Development' },
    { id: 3, name: 'Payment Gateway', entities: 20, type: 'Staging' }
  ]

  const notifications = [
    { id: 1, type: 'info', message: 'Model "CustomerDB v2.1" has been updated', time: '5 min ago' },
    { id: 2, type: 'warning', message: 'Compare operation completed with conflicts', time: '1 hour ago' },
    { id: 3, type: 'success', message: 'Reverse engineering completed successfully', time: '2 hours ago' }
  ]

  // Navigation items
  const navItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard', active: currentView === 'dashboard' },
    { id: 'models', icon: Database, label: 'Model Explorer', active: currentView === 'models' },
    { id: 'reverse-engineering', icon: RefreshCw, label: 'Reverse Engineering', active: currentView === 'reverse-engineering' },
    { id: 'compare', icon: GitCompare, label: 'Complete Compare', active: currentView === 'compare' },
    { id: 'users', icon: Users, label: 'Users', active: currentView === 'users' },
    { id: 'settings', icon: Settings, label: 'Settings', active: currentView === 'settings' }
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'locked': return <Lock className="h-4 w-4 text-red-600" />
      case 'checked-out': return <Eye className="h-4 w-4 text-yellow-600" />
      default: return <AlertCircle className="h-4 w-4 text-gray-400" />
    }
  }

  const handleNavigation = (viewId: string) => {
    if (viewId === 'models') {
      setCurrentView('diagram')
    } else {
      setCurrentView(viewId as ViewType)
    }
  }

  const handleNewModel = () => {
    setCurrentView('diagram')
  }

  const handleOpenModel = () => {
    // TODO: Implement model selection dialog
    setCurrentView('diagram')
  }

  const handleCompare = () => {
    setCurrentView('compare')
  }

  const handleReverseEngineering = () => {
    setCurrentView('reverse-engineering')
  }

  if (currentView === 'diagram') {
    return <DiagramView onBack={() => setCurrentView('dashboard')} />
  }

  if (currentView === 'compare') {
    return <CompareView onBack={() => setCurrentView('dashboard')} />
  }

  if (currentView === 'reverse-engineering') {
    return <ReverseEngineeringView onBack={() => setCurrentView('dashboard')} />
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left: Logo and Title */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex items-center space-x-3">
              <Database className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Data Modeling Studio</h1>
                <p className="text-sm text-gray-500">Professional Edition</p>
              </div>
            </div>
          </div>

          {/* Center: Search Bar */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search models, diagrams, or users..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Right: Profile and Notifications */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-5 w-5" />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {notifications.length}
                </span>
              )}
            </Button>
            <div className="flex items-center space-x-2 cursor-pointer">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-gray-900">John Doe</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Navigation */}
        <nav className={`bg-white border-r border-gray-200 transition-all duration-300 ${
          sidebarCollapsed ? 'w-16' : 'w-64'
        }`}>
          <div className="p-4">
            <div className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Button
                    key={item.id}
                    variant={item.active ? "default" : "ghost"}
                    className={`w-full justify-start ${sidebarCollapsed ? 'px-2' : 'px-3'}`}
                    onClick={() => handleNavigation(item.id)}
                  >
                    <Icon className={`h-5 w-5 ${sidebarCollapsed ? '' : 'mr-3'}`} />
                    {!sidebarCollapsed && <span>{item.label}</span>}
                  </Button>
                )
              })}
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            {/* Dashboard Title */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
              <p className="text-gray-600">Welcome back! Here's what's happening with your data models.</p>
            </div>

            {/* Quick Actions */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={handleNewModel}>
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Plus className="h-6 w-6 text-blue-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-1">New Model</h4>
                    <p className="text-sm text-gray-600">Start from scratch</p>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={handleOpenModel}>
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <FolderOpen className="h-6 w-6 text-green-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-1">Open Model</h4>
                    <p className="text-sm text-gray-600">From repository</p>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={handleReverseEngineering}>
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <RefreshCw className="h-6 w-6 text-purple-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-1">Reverse Engineering</h4>
                    <p className="text-sm text-gray-600">MS Fabric supported</p>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={handleCompare}>
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <GitCompare className="h-6 w-6 text-orange-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-1">Complete Compare</h4>
                    <p className="text-sm text-gray-600">Model comparison</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Models */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Recent Models</span>
                      <Button variant="ghost" size="sm">
                        View All
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {recentModels.map((model) => (
                        <div key={model.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                          <div className="flex items-center space-x-3">
                            <Database className="h-8 w-8 text-blue-600" />
                            <div>
                              <h4 className="font-medium text-gray-900">{model.name}</h4>
                              <div className="flex items-center space-x-2 text-sm text-gray-600">
                                <span>{model.type}</span>
                                <span>•</span>
                                <span>{model.entities} entities</span>
                                <span>•</span>
                                <Clock className="h-3 w-3" />
                                <span>{model.lastModified}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(model.status)}
                            <span className="text-sm text-gray-600 capitalize">{model.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar Content */}
              <div className="space-y-6">
                {/* Favorite Models */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Star className="h-5 w-5 text-yellow-500" />
                      <span>Favorites</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {favoriteModels.map((model) => (
                        <div key={model.id} className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                          <h4 className="font-medium text-gray-900 text-sm">{model.name}</h4>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-xs text-gray-600">{model.entities} entities</span>
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">{model.type}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* System Insights */}
                <Card>
                  <CardHeader>
                    <CardTitle>System Insights</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Active Models</span>
                        <span className="font-semibold">24</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Total Entities</span>
                        <span className="font-semibold">387</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Active Users</span>
                        <span className="font-semibold">12</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">License Usage</span>
                        <span className="font-semibold">75%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Notifications */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Notifications</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {notifications.map((notification) => (
                        <div key={notification.id} className="flex items-start space-x-3">
                          <div className={`w-2 h-2 rounded-full mt-2 ${
                            notification.type === 'success' ? 'bg-green-500' :
                            notification.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                          }`} />
                          <div className="flex-1">
                            <p className="text-sm text-gray-900">{notification.message}</p>
                            <p className="text-xs text-gray-500">{notification.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}