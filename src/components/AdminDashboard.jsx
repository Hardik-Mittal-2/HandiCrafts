import { useEffect, useMemo, useState } from 'react';
import { Users, UserCheck } from 'lucide-react';
import { adminAPI } from '../lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('users');

  const [users, setUsers] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [isLoadingTickets, setIsLoadingTickets] = useState(false);
  const [error, setError] = useState('');

  const buyers = useMemo(() => users.filter((u) => u.role === 'buyer'), [users]);
  const sellers = useMemo(() => users.filter((u) => u.role === 'seller'), [users]);

  const loadUsers = async () => {
    setIsLoadingUsers(true);
    setError('');
    try {
      const result = await adminAPI.getUsers('all');
      setUsers(Array.isArray(result) ? result : []);
    } catch (e) {
      setError(e?.message || 'Failed to load users');
      setUsers([]);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const loadTickets = async () => {
    setIsLoadingTickets(true);
    setError('');
    try {
      const result = await adminAPI.getTickets();
      setTickets(Array.isArray(result) ? result : []);
    } catch (e) {
      setError(e?.message || 'Failed to load tickets');
      setTickets([]);
    } finally {
      setIsLoadingTickets(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    if (activeTab === 'tickets') {
      loadTickets();
    }
  }, [activeTab]);

  const handleBlockToggle = async (user) => {
    setError('');
    try {
      if (!user.isBlocked) {
        const reason = window.prompt('Enter block reason (required):');
        if (!reason || !reason.trim()) return;
        await adminAPI.blockUser(user._id || user.id, true, reason.trim());
      } else {
        await adminAPI.blockUser(user._id || user.id, false);
      }
      await loadUsers();
    } catch (e) {
      setError(e?.message || 'Failed to update user status');
    }
  };

  const handleTicketReview = async (ticket, nextStatus) => {
    setError('');
    try {
      if (nextStatus === 'Rejected') {
        const rejectionReason = window.prompt('Enter rejection reason (required):');
        if (!rejectionReason || !rejectionReason.trim()) return;
        await adminAPI.reviewTicket(ticket._id, 'Rejected', rejectionReason.trim());
      } else {
        await adminAPI.reviewTicket(ticket._id, 'Approved');
      }
      await loadTickets();
      await loadUsers();
    } catch (e) {
      setError(e?.message || 'Failed to review ticket');
    }
  };

  const consultants = users.filter(u => u.role === 'consultant');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">Platform overview and management</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-2xl" style={{ fontWeight: 600, color: '#B8860B' }}>
                  {users.length}
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
                <p className="text-sm text-muted-foreground">Blocked Accounts</p>
                <p className="text-2xl" style={{ fontWeight: 600, color: '#B8860B' }}>
                  {users.filter((u) => u.isBlocked).length}
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
                <p className="text-sm text-muted-foreground">Active Sellers</p>
                <p className="text-2xl" style={{ fontWeight: 600, color: '#B8860B' }}>
                  {sellers.filter(s => !s.isBlocked).length}
                </p>
              </div>
              <UserCheck className="h-8 w-8" style={{ color: '#C19A6B', opacity: 0.5 }} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Buyers</p>
              <p className="text-3xl" style={{ fontWeight: 600, color: '#B8860B' }}>{buyers.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Sellers</p>
              <p className="text-3xl" style={{ fontWeight: 600, color: '#B8860B' }}>{sellers.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Consultants</p>
              <p className="text-3xl" style={{ fontWeight: 600, color: '#B8860B' }}>{consultants.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="tickets">Support Tickets</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>View and block/unblock customer and artisan accounts</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingUsers ? (
                <div className="text-center py-8 text-muted-foreground">Loading users...</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Account Status</TableHead>
                      <TableHead>Registration Date</TableHead>
                      <TableHead>Block Reason</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users
                      .filter((u) => u.role === 'buyer' || u.role === 'seller')
                      .map((user) => (
                        <TableRow key={user._id || user.id}>
                          <TableCell>{user.name}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{user.email}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{user.phone || '-'}</TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {user.role === 'buyer'
                                ? 'Customer'
                                : user.role === 'seller'
                                  ? 'Artisan'
                                  : user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={user.isBlocked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}>
                              {user.isBlocked ? 'Blocked' : 'Active'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {user.isBlocked ? (user.blockReason || '-') : '-'}
                          </TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              variant={user.isBlocked ? 'default' : 'destructive'}
                              onClick={() => handleBlockToggle(user)}
                            >
                              {user.isBlocked ? 'Unblock' : 'Block'}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tickets" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Support Tickets</CardTitle>
              <CardDescription>Review unblock requests from blocked users</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingTickets ? (
                <div className="text-center py-8 text-muted-foreground">Loading tickets...</div>
              ) : tickets.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No tickets found.</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Message</TableHead>
                      <TableHead>Proof</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tickets.map((t) => (
                      <TableRow key={t._id}>
                        <TableCell className="text-sm">{t.email || '-'}</TableCell>
                        <TableCell className="text-sm text-muted-foreground" style={{ maxWidth: 320 }}>
                          <div className="line-clamp-3">{t.message}</div>
                        </TableCell>
                        <TableCell>
                          {t.proofFileName && t.proofDataUrl ? (
                            <a 
                              href={t.proofDataUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-sm text-bronze-gold hover:underline cursor-pointer"
                            >
                              📎 {t.proofFileName}
                            </a>
                          ) : t.proofFileName ? (
                            <span className="text-sm text-bronze-gold">{t.proofFileName}</span>
                          ) : (
                            <span className="text-sm text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {t.createdAt ? new Date(t.createdAt).toLocaleDateString() : '-'}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              t.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : t.status === 'Approved'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                            }
                          >
                            {t.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="space-x-2">
                          <Button
                            size="sm"
                            disabled={t.status !== 'pending'}
                            onClick={() => handleTicketReview(t, 'Approved')}
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            disabled={t.status !== 'pending'}
                            onClick={() => handleTicketReview(t, 'Rejected')}
                          >
                            Reject
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
