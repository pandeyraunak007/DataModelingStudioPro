'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Database, GitCompare, Users, Zap } from 'lucide-react'
import DiagramView from '@/components/diagram/DiagramView'
import CompareView from '@/components/compare/CompareView'

export default function HomePage() {
  const [currentView, setCurrentView] = useState<'landing' | 'diagram' | 'compare'>('landing')

  if (currentView === 'diagram') {
    return <DiagramView onBack={() => setCurrentView('landing')} />
  }

  if (currentView === 'compare') {
    return <CompareView onBack={() => setCurrentView('landing')} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Database className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Data Modeling Studio Pro</h1>
            </div>
            <div className="flex space-x-4">
              <Button variant="outline">Sign In</Button>
              <Button>Get Started</Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            Professional Data Modeling
            <span className="text-blue-600"> Made Simple</span>
          </h2>
          <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-500">
            Design, compare, and manage your database models with our intuitive drag-and-drop interface.
            Built for developers, designed for professionals.
          </p>
          <div className="mt-10 flex justify-center space-x-6">
            <Button
              size="lg"
              onClick={() => setCurrentView('diagram')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Database className="mr-2 h-5 w-5" />
              Start Modeling
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => setCurrentView('compare')}
            >
              <GitCompare className="mr-2 h-5 w-5" />
              Compare Models
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-3xl font-extrabold text-gray-900">
              Everything you need for data modeling
            </h3>
            <p className="mt-4 text-lg text-gray-500">
              Professional tools for database design and management
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader>
                <Database className="h-8 w-8 text-blue-600" />
                <CardTitle>Visual Modeling</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Drag-and-drop interface for creating entities, relationships, and complex database schemas
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <GitCompare className="h-8 w-8 text-green-600" />
                <CardTitle>Complete Compare</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Advanced model comparison with conflict detection and resolution capabilities
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Users className="h-8 w-8 text-purple-600" />
                <CardTitle>Team Collaboration</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Share models with your team, manage permissions, and collaborate in real-time
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Zap className="h-8 w-8 text-yellow-600" />
                <CardTitle>Export & Deploy</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Generate SQL scripts, documentation, and deploy directly to your database
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-extrabold text-gray-900">
              Try it now
            </h3>
            <p className="mt-4 text-lg text-gray-500">
              No signup required. Start modeling immediately.
            </p>
          </div>

          <Tabs defaultValue="diagram" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="diagram">Diagram View</TabsTrigger>
              <TabsTrigger value="compare">Compare View</TabsTrigger>
            </TabsList>
            <TabsContent value="diagram" className="mt-8">
              <Card>
                <CardContent className="p-6">
                  <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
                    <div className="text-center">
                      <Database className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 mb-4">Interactive diagram canvas with drag-and-drop entities</p>
                      <Button onClick={() => setCurrentView('diagram')}>
                        Launch Diagram View
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="compare" className="mt-8">
              <Card>
                <CardContent className="p-6">
                  <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
                    <div className="text-center">
                      <GitCompare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 mb-4">Side-by-side model comparison with conflict resolution</p>
                      <Button onClick={() => setCurrentView('compare')}>
                        Launch Compare View
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-6">
            <Database className="h-8 w-8 text-blue-400 mr-3" />
            <span className="text-xl font-bold">Data Modeling Studio Pro</span>
          </div>
          <p className="text-gray-400">
            Professional data modeling for modern applications
          </p>
        </div>
      </footer>
    </div>
  )
}