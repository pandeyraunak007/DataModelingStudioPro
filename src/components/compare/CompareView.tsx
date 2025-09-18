'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, GitCompare, CheckCircle, AlertTriangle, XCircle, Plus } from 'lucide-react'

interface CompareViewProps {
  onBack: () => void
}

const sampleModels = [
  {
    id: 'customer_v12',
    name: 'CustomerDB v1.2',
    version: '1.2',
    entities: ['Customer', 'Order', 'OrderItem'],
    description: 'Basic customer and order management system'
  },
  {
    id: 'customer_v13',
    name: 'CustomerDB v1.3',
    version: '1.3',
    entities: ['Customer', 'Order', 'OrderItem', 'Product'],
    description: 'Enhanced with product catalog functionality'
  }
]

const sampleResults = [
  { type: 'Entity', name: 'Customer', status: 'same', icon: CheckCircle, color: 'text-green-600' },
  { type: 'Entity', name: 'Order', status: 'different', icon: AlertTriangle, color: 'text-yellow-600' },
  { type: 'Entity', name: 'OrderItem', status: 'different', icon: AlertTriangle, color: 'text-yellow-600' },
  { type: 'Entity', name: 'Product', status: 'new', icon: Plus, color: 'text-blue-600' },
  { type: 'Relationship', name: 'Customer_Order', status: 'same', icon: CheckCircle, color: 'text-green-600' },
  { type: 'Index', name: 'IDX_Order_Date', status: 'different', icon: AlertTriangle, color: 'text-yellow-600' },
]

export default function CompareView({ onBack }: CompareViewProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [leftModel, setLeftModel] = useState('')
  const [rightModel, setRightModel] = useState('')
  const [isComparing, setIsComparing] = useState(false)
  const [selectedResult, setSelectedResult] = useState<number | null>(null)

  const handleStartComparison = () => {
    if (leftModel && rightModel) {
      setIsComparing(true)
      setTimeout(() => {
        setIsComparing(false)
        setStep(3)
      }, 2000)
    }
  }

  const renderStep1 = () => (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Select Models to Compare</h2>
        <p className="text-gray-600">Choose the source and target models for comparison</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Left Model */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-blue-600">Source Model</CardTitle>
          </CardHeader>
          <CardContent>
            <select
              value={leftModel}
              onChange={(e) => setLeftModel(e.target.value)}
              className="w-full p-2 border rounded-md mb-4"
            >
              <option value="">Select source model...</option>
              {sampleModels.map(model => (
                <option key={model.id} value={model.id}>{model.name}</option>
              ))}
            </select>
            {leftModel && (
              <div className="text-sm text-gray-600">
                <div>Entities: {sampleModels.find(m => m.id === leftModel)?.entities.join(', ')}</div>
                <div className="mt-2">{sampleModels.find(m => m.id === leftModel)?.description}</div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Right Model */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-red-600">Target Model</CardTitle>
          </CardHeader>
          <CardContent>
            <select
              value={rightModel}
              onChange={(e) => setRightModel(e.target.value)}
              className="w-full p-2 border rounded-md mb-4"
            >
              <option value="">Select target model...</option>
              {sampleModels.map(model => (
                <option key={model.id} value={model.id}>{model.name}</option>
              ))}
            </select>
            {rightModel && (
              <div className="text-sm text-gray-600">
                <div>Entities: {sampleModels.find(m => m.id === rightModel)?.entities.join(', ')}</div>
                <div className="mt-2">{sampleModels.find(m => m.id === rightModel)?.description}</div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="text-center mt-8">
        <Button
          onClick={() => setStep(2)}
          disabled={!leftModel || !rightModel || leftModel === rightModel}
          size="lg"
        >
          <GitCompare className="mr-2 h-5 w-5" />
          Compare Models
        </Button>
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="max-w-4xl mx-auto text-center">
      <h2 className="text-2xl font-bold mb-8">Running Comparison</h2>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-blue-600">
              {sampleModels.find(m => m.id === leftModel)?.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-gray-600">
              Version: {sampleModels.find(m => m.id === leftModel)?.version}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">
              {sampleModels.find(m => m.id === rightModel)?.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-gray-600">
              Version: {sampleModels.find(m => m.id === rightModel)?.version}
            </div>
          </CardContent>
        </Card>
      </div>

      {isComparing ? (
        <div>
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Analyzing model differences...</p>
        </div>
      ) : (
        <div>
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">Comparison completed successfully!</p>
          <Button onClick={() => setStep(3)} size="lg">
            View Results
          </Button>
        </div>
      )}

      <Button
        variant="outline"
        onClick={handleStartComparison}
        disabled={isComparing}
        className="mt-4"
      >
        {isComparing ? 'Comparing...' : 'Start Comparison'}
      </Button>
    </div>
  )

  const renderStep3 = () => (
    <div className="h-full flex">
      {/* Results List */}
      <div className="w-1/2 border-r">
        <div className="p-4 border-b">
          <h3 className="font-semibold">Comparison Results</h3>
          <div className="text-sm text-gray-600 mt-1">
            Found {sampleResults.length} objects to review
          </div>
        </div>
        <div className="overflow-auto">
          {sampleResults.map((result, index) => {
            const Icon = result.icon
            return (
              <div
                key={index}
                className={`p-3 border-b cursor-pointer hover:bg-gray-50 ${
                  selectedResult === index ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                }`}
                onClick={() => setSelectedResult(index)}
              >
                <div className="flex items-center">
                  <Icon className={`h-4 w-4 mr-2 ${result.color}`} />
                  <div>
                    <div className="font-medium text-sm">{result.name}</div>
                    <div className="text-xs text-gray-500">{result.type}</div>
                  </div>
                  <div className="ml-auto">
                    <span className={`text-xs px-2 py-1 rounded ${
                      result.status === 'same' ? 'bg-green-100 text-green-800' :
                      result.status === 'different' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {result.status === 'same' ? 'Identical' :
                       result.status === 'different' ? 'Modified' : 'New'}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Details Panel */}
      <div className="w-1/2 p-4">
        {selectedResult !== null ? (
          <div>
            <h3 className="font-semibold mb-4">
              {sampleResults[selectedResult].name} Details
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Status:</label>
                <div className={`mt-1 ${sampleResults[selectedResult].color}`}>
                  {sampleResults[selectedResult].status === 'same' ? 'Identical in both models' :
                   sampleResults[selectedResult].status === 'different' ? 'Differences found' :
                   'Only exists in target model'}
                </div>
              </div>

              {sampleResults[selectedResult].status === 'different' && (
                <div>
                  <label className="text-sm font-medium">Changes:</label>
                  <ul className="mt-1 text-sm text-gray-600 list-disc list-inside">
                    <li>Structure modified</li>
                    <li>New attributes added</li>
                  </ul>
                </div>
              )}

              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full">
                  Accept Target Version
                </Button>
                <Button variant="outline" size="sm" className="w-full">
                  Keep Source Version
                </Button>
                <Button variant="outline" size="sm" className="w-full">
                  Merge Changes
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-gray-500 text-center">
            Select an object from the results to view details
          </div>
        )}
      </div>
    </div>
  )

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
            <h1 className="text-xl font-semibold">Complete Compare</h1>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center space-x-2">
            {[1, 2, 3].map((stepNum) => (
              <div
                key={stepNum}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                  step >= stepNum ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
                }`}
              >
                {stepNum}
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 p-6">
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
      </div>
    </div>
  )
}