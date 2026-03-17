import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { logActivity } from '@/hooks/useActivityLogger';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isRolesLoading: boolean;
  isAdmin: boolean;
  isModerator: boolean;
  isSuperAdmin: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRolesLoading, setIsRolesLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isModerator, setIsModerator] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  const checkUserRoles = async (userId: string) => {
    setIsRolesLoading(true);
    try {
      // Check for super_admin role
      const { data: superAdminData } = await supabase.rpc('is_super_admin', {
        _user_id: userId
      });
      setIsSuperAdmin(!!superAdminData);

      const { data: adminData } = await supabase.rpc('has_role', {
        _user_id: userId,
        _role: 'admin'
      });
      setIsAdmin(!!adminData);

      const { data: modData } = await supabase.rpc('has_role', {
        _user_id: userId,
        _role: 'moderator'
      });
      setIsModerator(!!modData);
    } catch (error) {
      console.error('Error checking roles:', error);
      setIsAdmin(false);
      setIsModerator(false);
      setIsSuperAdmin(false);
    } finally {
      setIsRolesLoading(false);
    }
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);

        if (session?.user) {
          setTimeout(() => {
            checkUserRoles(session.user.id);
          }, 0);
        } else {
          setIsAdmin(false);
          setIsModerator(false);
          setIsSuperAdmin(false);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);

      if (session?.user) {
        checkUserRoles(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (!error && data.user) {
      // Log login activity
      await logActivity({ userId: data.user.id, action: 'login' });
    }
    return { error };
  };

  const signUp = async (email: string, password: string) => {
    const redirectUrl = `${window.location.origin}/`;
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: redirectUrl }
    });
    return { error };
  };

  const signOut = async () => {
    // Log logout activity before signing out
    if (user) {
      await logActivity({ userId: user.id, action: 'logout' });
    }
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setIsAdmin(false);
    setIsModerator(false);
    setIsSuperAdmin(false);
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      isLoading,
      isRolesLoading,
      isAdmin,
      isModerator,
      isSuperAdmin,
      signIn,
      signUp,
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
