import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { getActionLabel, getActionIcon } from '@/hooks/useActivityLogger';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { 
  Newspaper, 
  FolderKanban, 
  Eye, 
  FileEdit, 
  Plus, 
  Images, 
  MessageSquareQuote,
  ArrowRight,
  Clock
} from 'lucide-react';

interface ActivityLog {
  id: string;
  action: string;
  created_at: string;
  details: Record<string, any> | null;
  user_id: string;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalArticles: 0,
    publishedArticles: 0,
    totalProjects: 0,
    publishedProjects: 0,
  });
  const [recentActivities, setRecentActivities] = useState<ActivityLog[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      const [articlesRes, projectsRes] = await Promise.all([
        supabase.from('articles').select('published'),
        supabase.from('projects').select('published'),
      ]);

      if (articlesRes.data && projectsRes.data) {
        setStats({
          totalArticles: articlesRes.data.length,
          publishedArticles: articlesRes.data.filter(a => a.published).length,
          totalProjects: projectsRes.data.length,
          publishedProjects: projectsRes.data.filter(p => p.published).length,
        });
      }
    };

    const fetchRecentActivities = async () => {
      const { data } = await supabase
        .from('activity_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (data) {
        setRecentActivities(data as ActivityLog[]);
      }
    };

    fetchStats();
    fetchRecentActivities();
  }, []);

  const statCards = [
    {
      title: 'Total Actualités',
      value: stats.totalArticles,
      icon: Newspaper,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
    },
    {
      title: 'Actualités Publiées',
      value: stats.publishedArticles,
      icon: Eye,
      color: 'text-green-500',
      bg: 'bg-green-500/10',
    },
    {
      title: 'Total Projets',
      value: stats.totalProjects,
      icon: FolderKanban,
      color: 'text-purple-500',
      bg: 'bg-purple-500/10',
    },
    {
      title: 'Projets Publiés',
      value: stats.publishedProjects,
      icon: FileEdit,
      color: 'text-orange-500',
      bg: 'bg-orange-500/10',
    },
  ];

  const quickActions = [
    {
      label: 'Nouvel article',
      icon: Newspaper,
      href: '/admin/articles/new',
      color: 'bg-blue-500 hover:bg-blue-600',
    },
    {
      label: 'Nouveau projet',
      icon: FolderKanban,
      href: '/admin/projects/new',
      color: 'bg-purple-500 hover:bg-purple-600',
    },
    {
      label: 'Nouveau slide',
      icon: Images,
      href: '/admin/slides/new',
      color: 'bg-green-500 hover:bg-green-600',
    },
    {
      label: 'Nouveau témoignage',
      icon: MessageSquareQuote,
      href: '/admin/testimonials/new',
      color: 'bg-orange-500 hover:bg-orange-600',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Tableau de bord</h1>
        <p className="text-muted-foreground mt-1">
          Bienvenue dans l'espace d'administration
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${card.bg}`}>
                <card.icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{card.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Actions rapides
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action) => (
                <Button
                  key={action.label}
                  asChild
                  className={`${action.color} text-white h-auto py-4 flex-col gap-2`}
                >
                  <Link to={action.href}>
                    <action.icon className="h-5 w-5" />
                    <span className="text-sm">{action.label}</span>
                  </Link>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Activités récentes
            </CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/admin/settings" className="text-xs text-muted-foreground">
                Voir tout <ArrowRight className="h-3 w-3 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentActivities.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-8">
                Aucune activité récente
              </p>
            ) : (
              <div className="space-y-3">
                {recentActivities.slice(0, 5).map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <span className="text-lg">{getActionIcon(activity.action)}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {getActionLabel(activity.action)}
                      </p>
                      {activity.details?.title && (
                        <p className="text-xs text-muted-foreground truncate">
                          {activity.details.title}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(activity.created_at), {
                          addSuffix: true,
                          locale: fr,
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}