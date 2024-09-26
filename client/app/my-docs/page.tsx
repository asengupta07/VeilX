'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, Star, Edit2, Check } from 'lucide-react'
import { TextHoverEffect } from '@/components/ui/text-hover-effect'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from '../contexts/authContext'

export default function MyDocuments() {
  const [documents, setDocuments] = useState<any[]>([]) 
  const [filteredDocuments, setFilteredDocuments] = useState<any[]>([]) 
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDocuments, setSelectedDocuments] = useState<number[]>([])
  const [showPreview, setShowPreview] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [previewTop, setPreviewTop] = useState(60)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [selectedType, setSelectedType] = useState<string | null>("All")
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editingName, setEditingName] = useState('')
  const { email } = useAuth()

  const documentTypes = ['Original Document', 'Redacted Document']

  useEffect(() => {
    if (!email) return
    const fetchDocuments = async () => {
      try {
        const response = await fetch('/api/getDocs',
            {
                method: 'POST',
                body: JSON.stringify({ email: email }),
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        )
        const data = await response.json()
        setDocuments(data.files)
        setFilteredDocuments(data.files)
      } catch (error) {
        console.error('Failed to fetch documents', error)
      }
    }

    fetchDocuments()
  }, [email])

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY

      if (scrollY > lastScrollY) {
        setPreviewTop(0)
      } else {
        setPreviewTop(60)
      }

      setLastScrollY(scrollY)
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [lastScrollY])

  useEffect(() => {
    const filteredDocs = documents.filter(doc =>
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (selectedType !== "All" ? doc.documentType === selectedType : true)
    )
    setFilteredDocuments(filteredDocs)
  }, [searchQuery, selectedType, documents])

  const handleSelect = (id: number) => {
    setSelectedDocuments(prev =>
      prev.includes(id) ? prev.filter(docId => docId !== id) : [...prev, id]
    )
  }

  const handlePreview = (id: number) => {
    const doc = filteredDocuments.find(d => d.id === id)
    setPreviewUrl(doc ? doc.url : null)
    setShowPreview(true)
  }

  const handleDownloadSelected = () => {
    selectedDocuments.forEach(id => {
      const doc = filteredDocuments.find(d => d.id === id)
      if (doc && doc.url) {
        const link = document.createElement('a')
        link.href = doc.url
        link.download = doc.name
        link.target = '_blank'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    })
  }

  const handleToggleFavorite = (id: number) => {
    setDocuments(prev =>
      prev.map(doc =>
        doc.id === id ? { ...doc, favorite: !doc.favorite } : doc
      )
    )
  }

  const handleEditClick = (id: number, name: string) => {
    setEditingId(id)
    setEditingName(name)
  }

  const handleEditSave = (id: number) => {
    setDocuments(prev =>
      prev.map(doc =>
        doc.id === id ? { ...doc, name: editingName } : doc
      )
    )
    setEditingId(null)
  }

  return (
    <div className="flex p-6">
        <div className="absolute h-screen flex items-center justify-center">
        <TextHoverEffect text="Docs" />
      </div>
      <Card className={`flex-grow shadow-xl bg-transparent z-20 border-purple-500 overflow-auto ${showPreview ? 'mr-[512px]' : ''}`}>
        <CardHeader className="border-b border-purple-500">
          <CardTitle className="text-2xl font-bold text-center text-purple-800">My Documents</CardTitle>
        </CardHeader>
        <CardContent className={`p-0`}>
          <div className="flex">
            <div className={`flex-1 flex flex-col`}>
              <div className="p-4 flex space-x-2">
                <Input
                  type="text"
                  placeholder="Search here..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 border-purple-500"
                />
                <Select onValueChange={(value) => setSelectedType(value)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Types</SelectItem>
                    {documentTypes.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1 overflow-auto p-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-purple-800">Directories</h2>
                  <div className="flex items-center space-x-2">
                    <span className="text-purple-600">{selectedDocuments.length} Items Selected</span>
                    <Button variant="outline" className="text-purple-600 border-purple-500" onClick={handleDownloadSelected}>
                      Download Selected
                    </Button>
                  </div>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[300px] text-purple-800">Name</TableHead>
                      <TableHead className="text-purple-800">Type</TableHead>
                      <TableHead className="text-purple-800">Size</TableHead>
                      <TableHead className="text-purple-800">Favorite</TableHead>
                      <TableHead className="text-purple-800">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDocuments.map((doc) => (
                      <TableRow key={doc.id} className="cursor-pointer hover:bg-purple-50 dark:hover:bg-slate-900">
                        <TableCell className="font-medium text-purple-700">
                          <div className="flex items-center">
                            <FileText className="mr-2 h-4 w-4 text-purple-500" />
                            {editingId === doc.id ? (
                              <Input
                                value={editingName}
                                onChange={(e) => setEditingName(e.target.value)}
                                className="mr-2"
                              />
                            ) : (
                              <span onClick={() => handlePreview(doc.id)}>{doc.name}</span>
                            )}
                            {editingId === doc.id ? (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditSave(doc.id)}
                              >
                                <Check className="h-4 w-4 text-green-500" />
                              </Button>
                            ) : (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditClick(doc.id, doc.name)}
                              >
                                <Edit2 className="h-4 w-4 text-purple-500" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-purple-600">{doc.type}</TableCell>
                        <TableCell className="text-purple-600">{doc.size}</TableCell>
                        <TableCell>
                          <Star
                            className={`h-4 w-4 cursor-pointer ${doc.favorite ? 'text-yellow-400 fill-yellow-400' : 'text-purple-300'}`}
                            onClick={() => handleToggleFavorite(doc.id)}
                          />
                        </TableCell>
                        <TableCell>
                          <Checkbox
                            checked={selectedDocuments.includes(doc.id)}
                            onCheckedChange={() => handleSelect(doc.id)}
                            className="border-purple-500 text-purple-500"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            <AnimatePresence>
              {showPreview && previewUrl && (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 512, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  style={{ top: `${previewTop}px` }}
                  className="fixed right-0 bottom-0 w-[512px] rounded-s-md border-purple-500 p-4 overflow-auto"
                >
                  <div className="flex justify-between items-center mb-4 border-purple-500">
                    <h3 className="text-lg font-bold text-purple-800">Preview</h3>
                    <Button variant="ghost" onClick={() => setShowPreview(false)} className="text-purple-600">Close</Button>
                  </div>
                  <iframe
                    src={previewUrl}
                    className="w-full h-[70vh] border-0 rounded-lg"
                    title="Preview"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}