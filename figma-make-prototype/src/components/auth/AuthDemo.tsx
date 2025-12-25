/**
 * ChurchAfrica ChMS - Auth Demo Component
 * Demonstrates authentication features and user info
 */

import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { User, Mail, Shield, Calendar, CheckCircle2 } from 'lucide-react';

export function AuthDemo() {
  const { user, profile, session } = useAuth();

  if (!user || !profile) {
    return null;
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'pastor':
        return 'default';
      case 'staff':
        return 'secondary';
      case 'volunteer':
        return 'outline';
      default:
        return 'outline';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-success" />
          Authenticated User
        </CardTitle>
        <CardDescription>
          Your current session information
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* User Profile */}
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={profile.avatar_url} alt={profile.name} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {profile.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4>{profile.name}</h4>
                <Badge variant={getRoleBadgeVariant(profile.role)}>
                  {profile.role}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{profile.email}</p>
            </div>
          </div>

          {/* User Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">User ID:</span>
                <code className="text-xs bg-muted px-2 py-1 rounded">
                  {user.id.substring(0, 8)}...
                </code>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Email Verified:</span>
                <Badge variant={user.email_confirmed_at ? 'default' : 'secondary'} className="h-5">
                  {user.email_confirmed_at ? 'Yes' : 'No'}
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Role:</span>
                <span className="capitalize">{profile.role}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Joined:</span>
                <span>
                  {new Date(profile.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Session Info */}
          {session && (
            <div className="mt-4 p-3 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground mb-2">Session Information</p>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Provider:</span>
                  <span>{session.user.app_metadata.provider || 'email'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Expires:</span>
                  <span>
                    {session.expires_at 
                      ? new Date(session.expires_at * 1000).toLocaleString()
                      : 'Never'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Church Info */}
          {profile.church_name && (
            <div className="mt-4 p-3 bg-primary/5 border border-primary/20 rounded-lg">
              <p className="text-sm font-medium mb-1">Church Assignment</p>
              <p className="text-sm text-muted-foreground">{profile.church_name}</p>
              {profile.church_id && (
                <p className="text-xs text-muted-foreground mt-1">
                  ID: {profile.church_id}
                </p>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
