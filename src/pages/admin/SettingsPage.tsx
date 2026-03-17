import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { Loader2, Save, User, Lock, Users, Camera, Trash2, Shield, UserCog, History, RefreshCw, Check, X, Clock, Crown } from 'lucide-react';
import { logActivity, getActionLabel, getActionIcon } from '@/hooks/useActivityLogger';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  avatar_url: string | null;
}

interface UserWithRole {
  id: string;
  email: string | null;
  full_name: string | null;
  role: 'admin' | 'moderator' | 'super_admin' | null;
  is_approved: boolean;
  created_at: string;
}

interface ActivityLog {
  id: string;
  user_id: string;
  action: string;
  details: any;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
  user_email?: string | null;
  user_name?: string | null;
}

export default function SettingsPage() {
  const { user, isAdmin, isSuperAdmin } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Profile state
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  
  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);
  
  // Users state
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Activity logs state
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [loadingActivity, setLoadingActivity] = useState(false);

  useEffect(() => {
    fetchProfile();
    fetchActivityLogs();
    if (isAdmin || isSuperAdmin) {
      fetchUsers();
    }
  }, [user, isAdmin, isSuperAdmin]);

  const fetchProfile = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error) throw error;

      setProfile(data);
      setFirstName(data?.first_name || '');
      setLastName(data?.last_name || '');
      setEmail(data?.email || user.email || '');
      setPhone(data?.phone || '');
      setAvatarUrl(data?.avatar_url || null);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Erreur lors du chargement du profil');
    } finally {
      setLoading(false);
    }
  };

  const fetchActivityLogs = async () => {
    if (!user) return;
    
    setLoadingActivity(true);
    try {
      // For admins, fetch all activity with user info
      if (isAdmin) {
        const { data: logs, error } = await supabase
          .from('activity_logs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(100);

        if (error) throw error;

        // Fetch profiles to get user names
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, email, full_name');

        const logsWithUsers = (logs || []).map(log => {
          const profile = profiles?.find(p => p.id === log.user_id);
          return {
            ...log,
            user_email: profile?.email,
            user_name: profile?.full_name,
          };
        });

        setActivityLogs(logsWithUsers);
      } else {
        // For non-admins, fetch only their own activity
        const { data: logs, error } = await supabase
          .from('activity_logs')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(50);

        if (error) throw error;
        setActivityLogs(logs || []);
      }
    } catch (error) {
      console.error('Error fetching activity logs:', error);
    } finally {
      setLoadingActivity(false);
    }
  };

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      // Fetch all profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, email, full_name, created_at');

      if (profilesError) throw profilesError;

      // Fetch all roles with is_approved status
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role, is_approved');

      if (rolesError) throw rolesError;

      // Combine profiles with roles
      const usersWithRoles: UserWithRole[] = (profiles || []).map(p => {
        const userRole = roles?.find(r => r.user_id === p.id);
        return {
          id: p.id,
          email: p.email,
          full_name: p.full_name,
          role: userRole?.role || null,
          is_approved: userRole?.is_approved ?? true, // Default to true if no role
          created_at: p.created_at,
        };
      });

      setUsers(usersWithRoles);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Erreur lors du chargement des utilisateurs');
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    try {
      const fullName = `${firstName} ${lastName}`.trim();
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: firstName,
          last_name: lastName,
          full_name: fullName,
          email: email,
          phone: phone,
          avatar_url: avatarUrl,
        })
        .eq('id', user.id);

      if (error) throw error;

      await logActivity({ userId: user.id, action: 'profile_updated' });
      toast.success('Profil mis à jour avec succès');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Erreur lors de la mise à jour du profil');
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Veuillez sélectionner une image');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('L\'image ne doit pas dépasser 2 Mo');
      return;
    }

    setUploadingAvatar(true);
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/avatar.${fileExt}`;

      // Upload file
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      setAvatarUrl(`${publicUrl}?t=${Date.now()}`);
      await logActivity({ userId: user.id, action: 'avatar_updated' });
      toast.success('Avatar mis à jour');
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error('Erreur lors du téléchargement de l\'avatar');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleRemoveAvatar = async () => {
    if (!user || !avatarUrl) return;

    setUploadingAvatar(true);
    try {
      // Remove from storage
      const { error } = await supabase.storage
        .from('avatars')
        .remove([`${user.id}/avatar.png`, `${user.id}/avatar.jpg`, `${user.id}/avatar.jpeg`, `${user.id}/avatar.webp`]);

      if (error) console.warn('Error removing avatar files:', error);

      setAvatarUrl(null);
      await logActivity({ userId: user.id, action: 'avatar_removed' });
      toast.success('Avatar supprimé');
    } catch (error) {
      console.error('Error removing avatar:', error);
      toast.error('Erreur lors de la suppression de l\'avatar');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setChangingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      await logActivity({ userId: user!.id, action: 'password_changed' });
      toast.success('Mot de passe modifié avec succès');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      console.error('Error changing password:', error);
      toast.error(error.message || 'Erreur lors du changement de mot de passe');
    } finally {
      setChangingPassword(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: 'admin' | 'moderator' | 'super_admin' | 'none') => {
    try {
      // First, remove existing role
      await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId);

      // Then add new role if not 'none'
      if (newRole !== 'none') {
        // Super admin roles are auto-approved, others need approval by super_admin
        const needsApproval = !isSuperAdmin && newRole !== 'super_admin';
        const { error } = await supabase
          .from('user_roles')
          .insert({ 
            user_id: userId, 
            role: newRole,
            is_approved: isSuperAdmin ? true : false // Super admin can approve immediately
          });

        if (error) throw error;
      }

      // Get target user info for logging
      const targetUser = users.find(u => u.id === userId);
      await logActivity({ 
        userId: user!.id, 
        action: 'role_changed',
        details: {
          target_user: targetUser?.email,
          new_role: newRole === 'none' ? 'utilisateur' : newRole
        }
      });

      toast.success('Rôle mis à jour');
      fetchUsers();
    } catch (error) {
      console.error('Error updating role:', error);
      toast.error('Erreur lors de la mise à jour du rôle');
    }
  };

  const handleApproveRole = async (userId: string, approve: boolean) => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .update({ is_approved: approve })
        .eq('user_id', userId);

      if (error) throw error;

      const targetUser = users.find(u => u.id === userId);
      await logActivity({ 
        userId: user!.id, 
        action: approve ? 'role_approved' : 'role_rejected',
        details: {
          target_user: targetUser?.email,
          role: targetUser?.role
        }
      });

      toast.success(approve ? 'Rôle approuvé' : 'Rôle rejeté');
      fetchUsers();
    } catch (error) {
      console.error('Error approving role:', error);
      toast.error('Erreur lors de l\'approbation du rôle');
    }
  };

  const getInitials = () => {
    if (firstName || lastName) {
      return `${firstName[0] || ''}${lastName[0] || ''}`.toUpperCase();
    }
    return email?.[0]?.toUpperCase() || 'U';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Paramètres</h1>
        <p className="text-muted-foreground mt-2">
          Gérez votre compte et vos préférences
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className={`grid w-full ${isAdmin || isSuperAdmin ? 'grid-cols-4' : 'grid-cols-3'}`}>
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Profil</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            <span className="hidden sm:inline">Sécurité</span>
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            <span className="hidden sm:inline">Activité</span>
          </TabsTrigger>
          {(isAdmin || isSuperAdmin) && (
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Utilisateurs</span>
            </TabsTrigger>
          )}
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Informations personnelles
              </CardTitle>
              <CardDescription>
                Mettez à jour vos informations de profil
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveProfile} className="space-y-6">
                {/* Avatar Section */}
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={avatarUrl || undefined} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                        {getInitials()}
                      </AvatarFallback>
                    </Avatar>
                    {uploadingAvatar && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                        <Loader2 className="h-6 w-6 animate-spin text-white" />
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingAvatar}
                      >
                        <Camera className="h-4 w-4 mr-2" />
                        Changer l'avatar
                      </Button>
                      {avatarUrl && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleRemoveAvatar}
                          disabled={uploadingAvatar}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      JPG, PNG ou WebP. Max 2 Mo.
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarUpload}
                    />
                  </div>
                </div>

                {/* Name Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Prénom</Label>
                    <Input
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Votre prénom"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Nom</Label>
                    <Input
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Votre nom"
                    />
                  </div>
                </div>

                {/* Contact Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="votre@email.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+225 XX XX XX XX XX"
                    />
                  </div>
                </div>

                <Button type="submit" disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enregistrement...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Enregistrer les modifications
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Modifier le mot de passe
              </CardTitle>
              <CardDescription>
                Changez votre mot de passe pour sécuriser votre compte
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
                <div className="space-y-2">
                  <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                </div>
                <Button type="submit" disabled={changingPassword}>
                  {changingPassword ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Modification...
                    </>
                  ) : (
                    <>
                      <Lock className="mr-2 h-4 w-4" />
                      Modifier le mot de passe
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <History className="h-5 w-5" />
                    Historique des activités
                  </CardTitle>
                  <CardDescription>
                    {isAdmin ? 'Toutes les activités des utilisateurs' : 'Vos activités récentes'}
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchActivityLogs}
                  disabled={loadingActivity}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${loadingActivity ? 'animate-spin' : ''}`} />
                  Actualiser
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loadingActivity ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : activityLogs.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Aucune activité enregistrée
                </div>
              ) : (
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-4">
                    {activityLogs.map((log) => (
                      <div key={log.id} className="flex items-start gap-4 p-3 rounded-lg bg-muted/50">
                        <div className="text-2xl">{getActionIcon(log.action)}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-medium">{getActionLabel(log.action)}</span>
                            {isAdmin && log.user_name && (
                              <Badge variant="outline" className="text-xs">
                                {log.user_name}
                              </Badge>
                            )}
                            {isAdmin && !log.user_name && log.user_email && (
                              <Badge variant="outline" className="text-xs">
                                {log.user_email}
                              </Badge>
                            )}
                          </div>
                          {log.details && Object.keys(log.details).length > 0 && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {log.details.title && `"${log.details.title}"`}
                              {log.details.target_user && ` pour ${log.details.target_user}`}
                              {log.details.new_role && ` → ${log.details.new_role}`}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground mt-1">
                            {format(new Date(log.created_at), "d MMMM yyyy 'à' HH:mm", { locale: fr })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Users Tab (Admin/Super Admin Only) */}
        {(isAdmin || isSuperAdmin) && (
          <TabsContent value="users">
            {/* Pending Approvals Section - Only for Super Admin */}
            {isSuperAdmin && users.filter(u => u.role && !u.is_approved).length > 0 && (
              <Card className="mb-6 border-orange-200 bg-orange-50/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-orange-700">
                    <Clock className="h-5 w-5" />
                    Approbations en attente
                  </CardTitle>
                  <CardDescription className="text-orange-600">
                    Ces utilisateurs ont demandé un rôle administratif
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {users.filter(u => u.role && !u.is_approved).map((u) => (
                      <div key={u.id} className="flex items-center justify-between p-3 rounded-lg bg-background border">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="text-sm">
                              {u.full_name?.[0]?.toUpperCase() || u.email?.[0]?.toUpperCase() || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{u.full_name || 'Sans nom'}</p>
                            <p className="text-sm text-muted-foreground">{u.email}</p>
                          </div>
                          <Badge variant="outline" className="ml-2">
                            Demande: {u.role === 'admin' ? 'Admin' : u.role === 'moderator' ? 'Modérateur' : u.role === 'super_admin' ? 'Super Admin' : u.role}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-green-600 border-green-600 hover:bg-green-50"
                            onClick={() => handleApproveRole(u.id, true)}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Approuver
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 border-red-600 hover:bg-red-50"
                            onClick={() => handleApproveRole(u.id, false)}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Rejeter
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Gestion des utilisateurs
                </CardTitle>
                <CardDescription>
                  Gérez les rôles et permissions des utilisateurs
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadingUsers ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Utilisateur</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Rôle</TableHead>
                          <TableHead>Statut</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users.map((u) => (
                          <TableRow key={u.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarFallback className="text-xs">
                                    {u.full_name?.[0]?.toUpperCase() || u.email?.[0]?.toUpperCase() || 'U'}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="font-medium">
                                  {u.full_name || 'Sans nom'}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {u.email}
                            </TableCell>
                            <TableCell>
                              {u.role === 'super_admin' && (
                                <Badge className="bg-amber-500">
                                  <Crown className="h-3 w-3 mr-1" />
                                  Super Admin
                                </Badge>
                              )}
                              {u.role === 'admin' && (
                                <Badge className="bg-primary">
                                  <Shield className="h-3 w-3 mr-1" />
                                  Admin
                                </Badge>
                              )}
                              {u.role === 'moderator' && (
                                <Badge variant="secondary">
                                  <UserCog className="h-3 w-3 mr-1" />
                                  Modérateur
                                </Badge>
                              )}
                              {!u.role && (
                                <Badge variant="outline">Utilisateur</Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              {u.role ? (
                                u.is_approved ? (
                                  <Badge variant="outline" className="text-green-600 border-green-600">
                                    <Check className="h-3 w-3 mr-1" />
                                    Approuvé
                                  </Badge>
                                ) : (
                                  <Badge variant="outline" className="text-orange-600 border-orange-600">
                                    <Clock className="h-3 w-3 mr-1" />
                                    En attente
                                  </Badge>
                                )
                              ) : (
                                <span className="text-muted-foreground text-sm">-</span>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              {u.id !== user?.id ? (
                                <Select
                                  value={u.role || 'none'}
                                  onValueChange={(value) => handleRoleChange(u.id, value as any)}
                                >
                                  <SelectTrigger className="w-36">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="none">Utilisateur</SelectItem>
                                    <SelectItem value="moderator">Modérateur</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                    {isSuperAdmin && (
                                      <SelectItem value="super_admin">Super Admin</SelectItem>
                                    )}
                                  </SelectContent>
                                </Select>
                              ) : (
                                <span className="text-xs text-muted-foreground">Vous</span>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
