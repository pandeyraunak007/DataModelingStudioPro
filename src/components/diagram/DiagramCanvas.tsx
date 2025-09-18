'use client'

import { useRef, useEffect, useState } from 'react'

interface Entity {
  id: string
  name: string
  x: number
  y: number
  width: number
  height: number
  attributes: Array<{
    id: string
    name: string
    dataType: string
    isPrimaryKey: boolean
    isForeignKey: boolean
    isNullable: boolean
  }>
}

interface DiagramCanvasProps {
  selectedTool: 'select' | 'entity' | 'relationship' | 'view'
  entities: Entity[]
  onAddEntity: (x: number, y: number) => void
}

export default function DiagramCanvas({ selectedTool, entities, onAddEntity }: DiagramCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null)
  const [selectedEntity, setSelectedEntity] = useState<string | null>(null)

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (selectedTool === 'entity') {
      const rect = canvasRef.current?.getBoundingClientRect()
      if (rect) {
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        onAddEntity(x, y)
      }
    }
  }

  const handleEntityClick = (entityId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedEntity(entityId)
  }

  return (
    <div className="h-full relative">
      {/* Canvas */}
      <div
        ref={canvasRef}
        className="w-full h-full diagram-canvas bg-white cursor-crosshair"
        onClick={handleCanvasClick}
        style={{
          cursor: selectedTool === 'entity' ? 'crosshair' : 'default'
        }}
      >
        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,0,0,.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,0,0,.1) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px'
          }}
        />

        {/* Entities */}
        {entities.map((entity) => (
          <div
            key={entity.id}
            className={`absolute bg-white border-2 rounded-lg shadow-lg entity-box cursor-move ${
              selectedEntity === entity.id ? 'border-blue-500' : 'border-gray-300'
            }`}
            style={{
              left: entity.x,
              top: entity.y,
              width: entity.width,
              minHeight: entity.height,
            }}
            onClick={(e) => handleEntityClick(entity.id, e)}
          >
            {/* Entity Header */}
            <div className="bg-gray-100 px-3 py-2 border-b border-gray-300 rounded-t-lg">
              <h3 className="font-semibold text-sm text-center">{entity.name}</h3>
            </div>

            {/* Entity Attributes */}
            <div className="p-2">
              {entity.attributes.map((attr, index) => (
                <div key={attr.id} className="flex items-center text-xs py-1">
                  {attr.isPrimaryKey && (
                    <span className="text-yellow-600 mr-1">🔑</span>
                  )}
                  {attr.isForeignKey && (
                    <span className="text-blue-600 mr-1">🔗</span>
                  )}
                  <span className="font-medium">{attr.name}</span>
                  <span className="text-gray-500 ml-1">: {attr.dataType}</span>
                </div>
              ))}
            </div>

            {/* Resize Handle */}
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-gray-400 cursor-se-resize" />
          </div>
        ))}

        {/* Instructions */}
        {entities.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <div className="text-lg mb-2">Welcome to Diagram View</div>
              <div className="text-sm">
                {selectedTool === 'entity'
                  ? 'Click anywhere on the canvas to create an entity'
                  : 'Select the Entity tool from the sidebar and click to create entities'
                }
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t px-4 py-2 text-sm text-gray-600">
        Tool: {selectedTool.charAt(0).toUpperCase() + selectedTool.slice(1)} |
        Entities: {entities.length} |
        Selected: {selectedEntity || 'None'}
      </div>
    </div>
  )
}