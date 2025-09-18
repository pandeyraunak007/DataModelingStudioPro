'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ArrowLeft,
  Square,
  MousePointer2,
  GitBranch,
  Eye,
  ZoomIn,
  ZoomOut,
  Move,
  Save,
  Download,
  Upload
} from 'lucide-react'
import DiagramCanvas from './DiagramCanvas'

interface DiagramViewProps {
  onBack: () => void
}

export default function DiagramView({ onBack }: DiagramViewProps) {
  const [selectedTool, setSelectedTool] = useState<'select' | 'entity' | 'relationship' | 'view'>('select')
  const [entities, setEntities] = useState<any[]>([])

  const tools = [
    { id: 'select', icon: MousePointer2, label: 'Select' },
    { id: 'entity', icon: Square, label: 'Entity' },
    { id: 'relationship', icon: GitBranch, label: 'Relationship' },
    { id: 'view', icon: Eye, label: 'View' },
  ]

  const handleAddEntity = (x: number, y: number) => {
    const newEntity = {
      id: `entity_${Date.now()}`,
      name: 'NewEntity',
      x,
      y,
      width: 180,
      height: 120,
      attributes: [
        {
          id: `attr_${Date.now()}`,
          name: 'id',
          dataType: 'INTEGER',
          isPrimaryKey: true,
          isForeignKey: false,
          isNullable: false,
        }
      ]
    }
    setEntities(prev => [...prev, newEntity])
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
            <h1 className="text-xl font-semibold">Diagram View</h1>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex">
        {/* Left Sidebar - Tools */}
        <div className="w-64 bg-white border-r p-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Tools</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {tools.map((tool) => {
                const Icon = tool.icon
                return (
                  <Button
                    key={tool.id}
                    variant={selectedTool === tool.id ? "default" : "outline"}
                    className="w-full justify-start"
                    onClick={() => setSelectedTool(tool.id as any)}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {tool.label}
                  </Button>
                )
              })}
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-sm">Zoom</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" size="sm" className="w-full">
                <ZoomIn className="h-4 w-4 mr-2" />
                Zoom In
              </Button>
              <Button variant="outline" size="sm" className="w-full">
                <ZoomOut className="h-4 w-4 mr-2" />
                Zoom Out
              </Button>
              <Button variant="outline" size="sm" className="w-full">
                <Move className="h-4 w-4 mr-2" />
                Fit to Screen
              </Button>
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-sm">Model Objects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-600">
                <div>Entities: {entities.length}</div>
                <div>Relationships: 0</div>
                <div>Views: 0</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Canvas */}
        <div className="flex-1 relative">
          <DiagramCanvas
            selectedTool={selectedTool}
            entities={entities}
            onAddEntity={handleAddEntity}
          />
        </div>

        {/* Right Sidebar - Properties */}
        <div className="w-80 bg-white border-l p-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Properties</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-600">
                Select an entity to view its properties
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}