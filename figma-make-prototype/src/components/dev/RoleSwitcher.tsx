/**
 * Role Switcher - Developer tool for testing different user roles
 */

import React from 'react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../ui/popover';
import { UserCircle, Shield, Building2, CheckCircle2 } from 'lucide-react';
import { useUser } from '../../contexts/UserContext';
import { mockUsers } from '../../lib/mock-user-data';
import { getRoleDisplayName, getRoleColor } from '../../types/user';

export function RoleSwitcher() {
  const { currentUser, switchUser } = useUser();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 border-[#1CE479]/30 hover:border-[#1CE479]/50"
        >
          <UserCircle className="h-4 w-4" />
          <span className="hidden sm:inline">{currentUser.firstName} {currentUser.lastName}</span>
          <Badge variant="outline" className={`${getRoleColor(currentUser.role)} border-current`}>
            {currentUser.role === 'super_admin' ? 'Super Admin' : 
             currentUser.role === 'branch_admin' ? 'Branch Admin' :
             currentUser.role === 'staff' ? 'Staff' :
             currentUser.role === 'volunteer' ? 'Volunteer' : 'Member'}
          </Badge>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <Card className="border-0 shadow-none">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Shield className="h-4 w-4 text-[#1CE479]" />
              Switch User Role
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Test different user perspectives
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Current User Info */}
            <div className="p-3 rounded-lg bg-[#1A1A20] border border-[#1CE479]/20">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-medium">{currentUser.firstName} {currentUser.lastName}</p>
                  <p className="text-xs text-muted-foreground">{currentUser.email}</p>
                </div>
                <CheckCircle2 className="h-4 w-4 text-[#1CE479]" />
              </div>
              <div className="flex items-center gap-2 text-xs">
                <Badge variant="outline" className={`${getRoleColor(currentUser.role)} border-current`}>
                  {getRoleDisplayName(currentUser.role)}
                </Badge>
                {currentUser.assignedBranchIds.length > 0 ? (
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Building2 className="h-3 w-3" />
                    {currentUser.assignedBranchIds.length === 1 ? '1 branch' : `${currentUser.assignedBranchIds.length} branches`}
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-[#1CE479]">
                    <Building2 className="h-3 w-3" />
                    All branches
                  </div>
                )}
              </div>
            </div>

            {/* User Selector */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">
                Switch to:
              </label>
              <Select
                value={currentUser.id}
                onValueChange={switchUser}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {mockUsers.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      <div className="flex items-center gap-2">
                        <span>{user.firstName} {user.lastName}</span>
                        <span className="text-xs text-muted-foreground">
                          ({user.role === 'super_admin' ? 'Super Admin' : 
                            user.role === 'branch_admin' ? 'Branch Admin' :
                            user.role === 'staff' ? 'Staff' :
                            user.role === 'volunteer' ? 'Volunteer' : 'Member'})
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Quick Role Buttons */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">
                Quick switch:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => switchUser('user_super_1')}
                  className={currentUser.id === 'user_super_1' ? 'border-[#1CE479]' : ''}
                >
                  Super Admin
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => switchUser('user_admin_kubwa')}
                  className={currentUser.id === 'user_admin_kubwa' ? 'border-blue-500' : ''}
                >
                  Kubwa Admin
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => switchUser('user_admin_wuse2')}
                  className={currentUser.id === 'user_admin_wuse2' ? 'border-blue-500' : ''}
                >
                  Wuse 2 Admin
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => switchUser('user_staff_kubwa')}
                  className={currentUser.id === 'user_staff_kubwa' ? 'border-purple-500' : ''}
                >
                  Staff
                </Button>
              </div>
            </div>

            {/* Permissions Info */}
            <div className="pt-2 border-t border-border/50">
              <p className="text-xs text-muted-foreground mb-1">Permissions:</p>
              <p className="text-xs">
                {currentUser.permissions.length} permissions active
              </p>
              {currentUser.assignedBranchIds.length > 0 && (
                <p className="text-xs text-muted-foreground mt-1">
                  Restricted to: {currentUser.assignedBranchIds.join(', ')}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
}
