"use client"

import type React from "react"

import { useState } from "react"
import useSWR, { mutate } from "swr"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Trash2, Users, Mail, Tag, Pencil } from "lucide-react"
import type { Vendor } from "@/lib/types"

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error("Failed to fetch data")
  }
  return res.json()
}

export default function VendorsPage() {
  const { data: vendors = [], isLoading } = useSWR<Vendor[]>("/api/vendors", fetcher)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    category: "",
    notes: "",
  })

  const handleOpenDialog = (vendor?: Vendor) => {
    if (vendor) {
      setEditingVendor(vendor)
      setFormData({
        name: vendor.name,
        email: vendor.email,
        category: vendor.category || "",
        notes: vendor.notes || "",
      })
    } else {
      setEditingVendor(null)
      setFormData({ name: "", email: "", category: "", notes: "" })
    }
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingVendor(null)
    setFormData({ name: "", email: "", category: "", notes: "" })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (editingVendor) {
        const response = await fetch(`/api/vendors/${editingVendor.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        })

        if (response.ok) {
          mutate("/api/vendors")
          handleCloseDialog()
        }
      } else {
        // Create new vendor
        const response = await fetch("/api/vendors", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        })

        if (response.ok) {
          mutate("/api/vendors")
          handleCloseDialog()
        }
      }
    } catch (error) {
      console.error("Error saving vendor:", error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this vendor?")) return

    try {
      await fetch(`/api/vendors/${id}`, { method: "DELETE" })
      mutate("/api/vendors")
    } catch (error) {
      console.error("Error deleting vendor:", error)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header title="Vendor Management" description="Manage your vendor database" />

      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-muted-foreground">
              {vendors.length} vendor{vendors.length !== 1 ? "s" : ""} in database
            </p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={(open) => (open ? handleOpenDialog() : handleCloseDialog())}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Vendor
              </Button>
            </DialogTrigger>
            <DialogContent>
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>{editingVendor ? "Edit Vendor" : "Add New Vendor"}</DialogTitle>
                  <DialogDescription>
                    {editingVendor
                      ? "Update the vendor information below"
                      : "Add a new vendor to your database for RFP distribution"}
                  </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Company Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="Acme Corporation"
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                      placeholder="sales@acme.com"
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                      placeholder="Electronics, Office Supplies, etc."
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                      placeholder="Additional notes about this vendor..."
                      className="resize-none"
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={handleCloseDialog}>
                    Cancel
                  </Button>
                  <Button type="submit">{editingVendor ? "Save Changes" : "Add Vendor"}</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : vendors.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Users className="mb-4 h-12 w-12 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">No vendors yet</p>
              <Button variant="link" className="mt-2" onClick={() => handleOpenDialog()}>
                Add your first vendor
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {vendors.map((vendor) => (
              <Card key={vendor.id} className="relative">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{vendor.name}</CardTitle>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-primary"
                        onClick={() => handleOpenDialog(vendor)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => handleDelete(vendor.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <CardDescription className="flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    {vendor.email}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Tag className="h-3 w-3 text-muted-foreground" />
                    <Badge variant="secondary">{vendor.category || "General"}</Badge>
                  </div>
                  {vendor.notes && <p className="mt-2 text-sm text-muted-foreground">{vendor.notes}</p>}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
