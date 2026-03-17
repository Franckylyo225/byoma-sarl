import { supabase } from '@/integrations/supabase/client';

export type ActivityAction = 
  | 'login'
  | 'logout'
  | 'profile_updated'
  | 'password_changed'
  | 'avatar_updated'
  | 'avatar_removed'
  | 'article_created'
  | 'article_updated'
  | 'article_deleted'
  | 'project_created'
  | 'project_updated'
  | 'project_deleted'
  | 'slide_created'
  | 'slide_updated'
  | 'slide_deleted'
  | 'role_changed'
  | 'role_approved'
  | 'role_rejected';

interface LogActivityParams {
  userId: string;
  action: ActivityAction;
  details?: Record<string, any>;
}

export async function logActivity({ userId, action, details }: LogActivityParams) {
  try {
    const { error } = await supabase
      .from('activity_logs')
      .insert({
        user_id: userId,
        action,
        details,
        user_agent: navigator.userAgent,
      });

    if (error) {
      console.error('Error logging activity:', error);
    }
  } catch (error) {
    console.error('Error logging activity:', error);
  }
}

export function getActionLabel(action: string): string {
  const labels: Record<string, string> = {
    login: 'Connexion',
    logout: 'Déconnexion',
    profile_updated: 'Profil mis à jour',
    password_changed: 'Mot de passe modifié',
    avatar_updated: 'Avatar mis à jour',
    avatar_removed: 'Avatar supprimé',
    article_created: 'Article créé',
    article_updated: 'Article modifié',
    article_deleted: 'Article supprimé',
    project_created: 'Projet créé',
    project_updated: 'Projet modifié',
    project_deleted: 'Projet supprimé',
    slide_created: 'Slide créé',
    slide_updated: 'Slide modifié',
    slide_deleted: 'Slide supprimé',
    role_changed: 'Rôle modifié',
    role_approved: 'Rôle approuvé',
    role_rejected: 'Rôle rejeté',
  };
  return labels[action] || action;
}

export function getActionIcon(action: string): string {
  const icons: Record<string, string> = {
    login: '🔐',
    logout: '🚪',
    profile_updated: '👤',
    password_changed: '🔑',
    avatar_updated: '📷',
    avatar_removed: '🗑️',
    article_created: '📝',
    article_updated: '✏️',
    article_deleted: '🗑️',
    project_created: '📁',
    project_updated: '✏️',
    project_deleted: '🗑️',
    slide_created: '🖼️',
    slide_updated: '✏️',
    slide_deleted: '🗑️',
    role_changed: '👥',
    role_approved: '✅',
    role_rejected: '❌',
  };
  return icons[action] || '📋';
}
