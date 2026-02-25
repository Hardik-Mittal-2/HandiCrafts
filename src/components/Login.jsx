import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useApp } from '../lib/context';

export function Login({ onLogin }) {
  const { setUser, users } = useApp();
  const [selectedRole, setSelectedRole] = useState('buyer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const handleLogin = () => {
    // Mock login - in a real app, validate credentials
    if (!email || !password) {
      alert('Please enter email and password');
      return;
    }
    
    // Find or create user
    let user = users.find(u => u.email === email && u.role === selectedRole);
    if (!user) {
      user = {
        id: `user-${Date.now()}`,
        name: email.split('@')[0],
        email,
        role: selectedRole,
      };
    }
    setUser(user);
    onLogin();
  };

  const handleRegister = () => {
    if (!name || !email || !password || !phone || !address) {
      alert('Please fill in all fields');
      return;
    }

    const newUser = {
      id: `user-${Date.now()}`,
      name,
      email,
      role: selectedRole,
    };
    setUser(newUser);
    onLogin();
  };

  const roleOptions = [
    { value: 'buyer', label: 'Buyer', description: 'Shop for authentic handicrafts' },
    { value: 'seller', label: 'Seller', description: 'Sell your handcrafted items' },
    { value: 'consultant', label: 'Cultural Consultant', description: 'Guide and recommend products' },
    { value: 'admin', label: 'Admin', description: 'Manage the platform' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 
            className="mb-2" 
            style={{ 
              fontFamily: 'Cormorant Garamond, serif', 
              fontSize: '3rem', 
              fontWeight: 700,
              color: '#B8860B'
            }}
          >
            HaandiCrafts
          </h1>
          <p className="text-muted-foreground">Welcome to the Heritage Marketplace</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{isRegister ? 'Create Account' : 'Welcome Back'}</CardTitle>
            <CardDescription>
              {isRegister ? 'Register to start your journey' : 'Sign in to continue'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={selectedRole} onValueChange={(v) => setSelectedRole(v)} className="mb-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="buyer">Buyer</TabsTrigger>
                <TabsTrigger value="seller">Seller</TabsTrigger>
              </TabsList>
              <TabsList className="grid w-full grid-cols-2 mt-2">
                <TabsTrigger value="consultant">Consultant</TabsTrigger>
                <TabsTrigger value="admin">Admin</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="space-y-4">
              {isRegister && (
                <>
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+91 XXXXX XXXXX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </>
              )}

              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full"
                />
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {isRegister && (
                <div>
                  <Label htmlFor="address">Shipping Address</Label>
                  <Input
                    id="address"
                    type="text"
                    placeholder="Enter your address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
              )}

              <Button
                className="w-full gradient-gold rounded-2xl"
                onClick={() => isRegister ? handleRegister() : handleLogin()}
              >
                {isRegister ? 'Create Account' : 'Sign In'}
              </Button>

              <div className="text-center">
                <button
                  className="text-sm text-muted-foreground hover:underline"
                  onClick={() => setIsRegister(!isRegister)}
                >
                  {isRegister ? 'Already have an account? Sign in' : "Don't have an account? Register"}
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}