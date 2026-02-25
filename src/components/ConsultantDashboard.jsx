import { useEffect, useMemo, useState } from 'react';
import { TrendingUp, Users, Package, CheckCircle, Pencil, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../lib/context';
import { exhibitionsAPI } from '../lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner';

export function ConsultantDashboard() {
  const { users, products, orders, user } = useApp();
  const [activeTab, setActiveTab] = useState('exhibitions');

  const [exhibitions, setExhibitions] = useState([]);
  const [isLoadingExhibitions, setIsLoadingExhibitions] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingExhibition, setEditingExhibition] = useState(null);
  const [createForm, setCreateForm] = useState({
    title: '',
    description: '',
    location: '',
    mode: 'offline',
    onlineLink: '',
    startDate: '',
    endDate: '',
    contactPhone: '',
  });

  const buyers = users.filter(u => u.role === 'buyer');
  const sellers = users.filter(u => u.role === 'seller');

  // Mock cultural trends
  const culturalTrends = [
    { name: 'Traditional Pottery Revival', growth: '+45%', category: 'Pottery' },
    { name: 'Handwoven Textiles Demand', growth: '+32%', category: 'Textiles' },
    { name: 'Brass Crafts Popularity', growth: '+28%', category: 'Metalwork' },
  ];

  // Products pending approval (mock - products from new sellers)
  const pendingProducts = products.slice(0, 2);

  const myBulkOrders = useMemo(() => {
    const myId = user?.id;
    if (!myId) return [];
    return (orders || []).filter((o) => o?.buyerId === myId);
  }, [orders, user?.id]);

  const loadExhibitions = async () => {
    setIsLoadingExhibitions(true);
    try {
      const result = await exhibitionsAPI.getAll();
      setExhibitions(Array.isArray(result) ? result : []);
    } catch (e) {
      setExhibitions([]);
    } finally {
      setIsLoadingExhibitions(false);
    }
  };

  useEffect(() => {
    loadExhibitions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreateExhibition = async () => {
    if (!createForm.title.trim()) {
      toast.error('Title is required');
      return;
    }
    if (!createForm.description.trim()) {
      toast.error('Description is required');
      return;
    }
    if (!createForm.location.trim()) {
      toast.error('Venue is required');
      return;
    }
    if (!createForm.startDate || !createForm.endDate) {
      toast.error('Start and end date/time are required');
      return;
    }
    if (createForm.mode === 'online' && !createForm.onlineLink.trim()) {
      toast.error('Online link is required for online mode');
      return;
    }

    try {
      await exhibitionsAPI.create({
        title: createForm.title.trim(),
        description: createForm.description.trim(),
        location: createForm.location.trim(),
        startDate: new Date(createForm.startDate).toISOString(),
        endDate: new Date(createForm.endDate).toISOString(),
        mode: createForm.mode,
        onlineLink: createForm.mode === 'online' ? createForm.onlineLink.trim() : '',
        contactPhone: createForm.contactPhone.trim() || undefined,
      });
      toast.success('Exhibition created');
      setIsCreateOpen(false);
      setCreateForm({
        title: '',
        description: '',
        location: '',
        mode: 'offline',
        onlineLink: '',
        startDate: '',
        endDate: '',
        contactPhone: '',
      });
      await loadExhibitions();
    } catch (e) {
      toast.error(e?.message || 'Failed to create exhibition');
    }
  };

  const handleEditExhibition = async () => {
    if (!editingExhibition) return;
    if (!editingExhibition.title?.trim()) {
      toast.error('Title is required');
      return;
    }
    if (!editingExhibition.description?.trim()) {
      toast.error('Description is required');
      return;
    }
    if (!editingExhibition.location?.trim()) {
      toast.error('Venue is required');
      return;
    }
    if (!editingExhibition.startDate || !editingExhibition.endDate) {
      toast.error('Start and end date/time are required');
      return;
    }
    if (editingExhibition.mode === 'online' && !editingExhibition.onlineLink?.trim()) {
      toast.error('Online link is required for online mode');
      return;
    }

    try {
      await exhibitionsAPI.update(editingExhibition._id, {
        title: editingExhibition.title.trim(),
        description: editingExhibition.description.trim(),
        location: editingExhibition.location.trim(),
        startDate: new Date(editingExhibition.startDate).toISOString(),
        endDate: new Date(editingExhibition.endDate).toISOString(),
        mode: editingExhibition.mode,
        onlineLink: editingExhibition.mode === 'online' ? editingExhibition.onlineLink?.trim() : '',
        contactPhone: editingExhibition.contactPhone?.trim() || undefined,
        status: editingExhibition.status,
      });
      toast.success('Exhibition updated');
      setIsEditOpen(false);
      setEditingExhibition(null);
      await loadExhibitions();
    } catch (e) {
      toast.error(e?.message || 'Failed to update exhibition');
    }
  };

  const handleDeleteExhibition = async (id) => {
    if (!confirm('Are you sure you want to delete this exhibition?')) return;
    try {
      await exhibitionsAPI.delete(id);
      toast.success('Exhibition deleted');
      await loadExhibitions();
    } catch (e) {
      toast.error(e?.message || 'Failed to delete exhibition');
    }
  };

  const openEditDialog = (ex) => {
    // Convert ISO dates to datetime-local format
    const formatDateForInput = (dateStr) => {
      if (!dateStr) return '';
      const d = new Date(dateStr);
      return d.toISOString().slice(0, 16);
    };
    setEditingExhibition({
      ...ex,
      startDate: formatDateForInput(ex.startDate),
      endDate: formatDateForInput(ex.endDate),
    });
    setIsEditOpen(true);
  };

  const sendBillToPhone = (order) => {
    const phone = (order?.shippingDetails?.phone || '').toString().trim();
    if (!phone) {
      toast.error('No phone number on this order');
      return;
    }
    const total = typeof order?.total === 'number' ? order.total : 0;
    const message = `HaandiCrafts Bill\nOrder: ${order?.id}\nTotal: ₹${total}`;
    const url = `sms:${encodeURIComponent(phone)}?body=${encodeURIComponent(message)}`;
    window.location.href = url;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2">Cultural Consultant Dashboard</h1>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-muted-foreground">Plan exhibitions and support artisans</p>
          <Link to="/products">
            <Button className="gradient-gold">Buy Products for Exhibition</Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Buyers</p>
                <p className="text-2xl" style={{ fontWeight: 600, color: '#B8860B' }}>
                  {buyers.length}
                </p>
              </div>
              <Users className="h-8 w-8" style={{ color: '#C19A6B', opacity: 0.5 }} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Artisans</p>
                <p className="text-2xl" style={{ fontWeight: 600, color: '#B8860B' }}>
                  {sellers.length}
                </p>
              </div>
              <Package className="h-8 w-8" style={{ color: '#C19A6B', opacity: 0.5 }} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Products</p>
                <p className="text-2xl" style={{ fontWeight: 600, color: '#B8860B' }}>
                  {products.length}
                </p>
              </div>
              <TrendingUp className="h-8 w-8" style={{ color: '#C19A6B', opacity: 0.5 }} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Approvals</p>
                <p className="text-2xl" style={{ fontWeight: 600, color: '#B8860B' }}>
                  {pendingProducts.length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8" style={{ color: '#C19A6B', opacity: 0.5 }} />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="exhibitions">Exhibitions</TabsTrigger>
          <TabsTrigger value="trends">Cultural Trends</TabsTrigger>
          <TabsTrigger value="approvals">Artisan Approvals</TabsTrigger>
        </TabsList>

        <TabsContent value="exhibitions" className="mt-6">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <CardTitle>Exhibitions</CardTitle>
                    <CardDescription>Create and manage exhibitions (online/offline)</CardDescription>
                  </div>
                  <Button className="gradient-gold" onClick={() => setIsCreateOpen(true)}>
                    Create Exhibition
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {isLoadingExhibitions ? (
                  <div className="text-center py-8 text-muted-foreground">Loading exhibitions...</div>
                ) : exhibitions.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">No exhibitions found.</div>
                ) : (
                  <div className="space-y-4">
                    {exhibitions.slice(0, 6).map((ex) => (
                      <div key={ex._id || ex.id} className="flex flex-col gap-2 p-4 border rounded-lg">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <div className="min-w-0">
                            <h3 className="mb-1 truncate">{ex.title}</h3>
                            <p className="text-sm text-muted-foreground">{ex.location}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{(ex.mode || 'offline') === 'online' ? 'Online' : 'Offline'}</Badge>
                            <Badge variant="outline">{ex.status || 'upcoming'}</Badge>
                            <Button size="sm" variant="outline" onClick={() => openEditDialog(ex)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" className="text-red-500 hover:text-red-700" onClick={() => handleDeleteExhibition(ex._id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {ex.startDate ? new Date(ex.startDate).toLocaleString() : '-'} — {ex.endDate ? new Date(ex.endDate).toLocaleString() : '-'}
                        </div>
                        {ex.mode === 'online' && ex.onlineLink && (
                          <a className="text-sm text-bronze-gold underline" href={ex.onlineLink} target="_blank" rel="noreferrer">
                            Join link
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Bulk Orders (for exhibitions)</CardTitle>
                <CardDescription>Send a bill to the customer phone number</CardDescription>
              </CardHeader>
              <CardContent>
                {myBulkOrders.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">No orders yet.</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {myBulkOrders.slice(0, 8).map((o) => (
                        <TableRow key={o.id}>
                          <TableCell className="text-sm">{o.id}</TableCell>
                          <TableCell style={{ color: '#B8860B', fontWeight: 600 }}>₹{(o.total || 0).toLocaleString()}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{o.shippingDetails?.phone || '-'}</TableCell>
                          <TableCell>
                            <Button size="sm" variant="outline" onClick={() => sendBillToPhone(o)}>
                              Send Bill
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>

          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create Exhibition</DialogTitle>
                <DialogDescription>Add date/time, venue, and online/offline mode</DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-2">
                <div>
                  <Label htmlFor="ex-title">Title *</Label>
                  <Input
                    id="ex-title"
                    value={createForm.title}
                    onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
                    placeholder="e.g., Tribal Pottery Exhibition"
                  />
                </div>

                <div>
                  <Label htmlFor="ex-desc">Description *</Label>
                  <Textarea
                    id="ex-desc"
                    value={createForm.description}
                    onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                    placeholder="What is this exhibition about?"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="ex-location">Venue / Location *</Label>
                  <Input
                    id="ex-location"
                    value={createForm.location}
                    onChange={(e) => setCreateForm({ ...createForm, location: e.target.value })}
                    placeholder="e.g., Mumbai Craft Hall"
                  />
                </div>

                <div>
                  <Label htmlFor="ex-mode">Mode *</Label>
                  <select
                    id="ex-mode"
                    value={createForm.mode}
                    onChange={(e) => setCreateForm({ ...createForm, mode: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md bg-background"
                  >
                    <option value="offline">Offline</option>
                    <option value="online">Online</option>
                  </select>
                </div>

                {createForm.mode === 'online' && (
                  <div>
                    <Label htmlFor="ex-link">Online Link *</Label>
                    <Input
                      id="ex-link"
                      value={createForm.onlineLink}
                      onChange={(e) => setCreateForm({ ...createForm, onlineLink: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="ex-start">Start Date & Time *</Label>
                    <Input
                      id="ex-start"
                      type="datetime-local"
                      value={createForm.startDate}
                      onChange={(e) => setCreateForm({ ...createForm, startDate: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="ex-end">End Date & Time *</Label>
                    <Input
                      id="ex-end"
                      type="datetime-local"
                      value={createForm.endDate}
                      onChange={(e) => setCreateForm({ ...createForm, endDate: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="ex-phone">Phone (for bill/queries)</Label>
                  <Input
                    id="ex-phone"
                    value={createForm.contactPhone}
                    onChange={(e) => setCreateForm({ ...createForm, contactPhone: e.target.value })}
                    placeholder="+91..."
                  />
                </div>

                <Button className="w-full gradient-gold" onClick={handleCreateExhibition}>
                  Create
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Edit Exhibition Dialog */}
          <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Exhibition</DialogTitle>
                <DialogDescription>Update exhibition details</DialogDescription>
              </DialogHeader>

              {editingExhibition && (
                <div className="space-y-4 py-2">
                  <div>
                    <Label htmlFor="edit-title">Title *</Label>
                    <Input
                      id="edit-title"
                      value={editingExhibition.title || ''}
                      onChange={(e) => setEditingExhibition({ ...editingExhibition, title: e.target.value })}
                      placeholder="e.g., Tribal Pottery Exhibition"
                    />
                  </div>

                  <div>
                    <Label htmlFor="edit-desc">Description *</Label>
                    <Textarea
                      id="edit-desc"
                      value={editingExhibition.description || ''}
                      onChange={(e) => setEditingExhibition({ ...editingExhibition, description: e.target.value })}
                      placeholder="What is this exhibition about?"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="edit-location">Venue / Location *</Label>
                    <Input
                      id="edit-location"
                      value={editingExhibition.location || ''}
                      onChange={(e) => setEditingExhibition({ ...editingExhibition, location: e.target.value })}
                      placeholder="e.g., Mumbai Craft Hall"
                    />
                  </div>

                  <div>
                    <Label htmlFor="edit-status">Status</Label>
                    <select
                      id="edit-status"
                      value={editingExhibition.status || 'upcoming'}
                      onChange={(e) => setEditingExhibition({ ...editingExhibition, status: e.target.value })}
                      className="w-full px-3 py-2 border rounded-md bg-background"
                    >
                      <option value="upcoming">Upcoming</option>
                      <option value="ongoing">Ongoing</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="edit-mode">Mode *</Label>
                    <select
                      id="edit-mode"
                      value={editingExhibition.mode || 'offline'}
                      onChange={(e) => setEditingExhibition({ ...editingExhibition, mode: e.target.value })}
                      className="w-full px-3 py-2 border rounded-md bg-background"
                    >
                      <option value="offline">Offline</option>
                      <option value="online">Online</option>
                    </select>
                  </div>

                  {editingExhibition.mode === 'online' && (
                    <div>
                      <Label htmlFor="edit-link">Online Link *</Label>
                      <Input
                        id="edit-link"
                        value={editingExhibition.onlineLink || ''}
                        onChange={(e) => setEditingExhibition({ ...editingExhibition, onlineLink: e.target.value })}
                        placeholder="https://..."
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="edit-start">Start Date & Time *</Label>
                      <Input
                        id="edit-start"
                        type="datetime-local"
                        value={editingExhibition.startDate || ''}
                        onChange={(e) => setEditingExhibition({ ...editingExhibition, startDate: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-end">End Date & Time *</Label>
                      <Input
                        id="edit-end"
                        type="datetime-local"
                        value={editingExhibition.endDate || ''}
                        onChange={(e) => setEditingExhibition({ ...editingExhibition, endDate: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="edit-phone">Phone (for bill/queries)</Label>
                    <Input
                      id="edit-phone"
                      value={editingExhibition.contactPhone || ''}
                      onChange={(e) => setEditingExhibition({ ...editingExhibition, contactPhone: e.target.value })}
                      placeholder="+91..."
                    />
                  </div>

                  <Button className="w-full gradient-gold" onClick={handleEditExhibition}>
                    Update
                  </Button>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </TabsContent>

        <TabsContent value="trends" className="mt-6">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Cultural Trends & Insights</CardTitle>
                <CardDescription>Emerging trends in traditional handicrafts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {culturalTrends.map((trend, index) => (
                    <div key={index} className="flex items-center justify-between p-4 rounded-lg border">
                      <div className="flex-1">
                        <h3 className="mb-1">{trend.name}</h3>
                        <Badge variant="outline">{trend.category}</Badge>
                      </div>
                      <div className="text-right">
                        <div className="text-green-600" style={{ fontWeight: 600, fontSize: '1.25rem' }}>
                          {trend.growth}
                        </div>
                        <p className="text-xs text-muted-foreground">Growth Rate</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recommended Products to Promote</CardTitle>
                <CardDescription>Culturally significant items to highlight for buyers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {products.slice(0, 3).map((product) => (
                    <div key={product.id} className="border rounded-lg overflow-hidden">
                      <div className="aspect-square overflow-hidden">
                        <ImageWithFallback
                          src={product.image}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <h4 className="mb-1">{product.name}</h4>
                        <p className="text-sm text-muted-foreground mb-2">by {product.artisan}</p>
                        <div className="flex items-center justify-between">
                          <span style={{ color: '#B8860B', fontWeight: 600 }}>
                            ₹{product.price.toLocaleString()}
                          </span>
                          <Button size="sm" variant="outline">
                            Recommend
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="approvals" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>New Artisan Listings</CardTitle>
              <CardDescription>Review and approve new artisan product listings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingProducts.map((product) => (
                  <div key={product.id} className="flex gap-4 p-4 border rounded-lg">
                    <div className="w-24 h-24 rounded overflow-hidden flex-shrink-0">
                      <ImageWithFallback
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="mb-1">{product.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{product.description}</p>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">{product.category}</Badge>
                        <span className="text-sm text-muted-foreground">by {product.artisan}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span style={{ color: '#B8860B', fontWeight: 600 }}>
                          ₹{product.price.toLocaleString()}
                        </span>
                        <div className="flex gap-2">
                          <Button size="sm" className="gradient-gold">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Approve
                          </Button>
                          <Button size="sm" variant="outline">
                            Request Changes
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
