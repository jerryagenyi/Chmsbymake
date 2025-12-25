import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Input } from '../ui/input';
import { 
  Building2, 
  MapPin, 
  Users, 
  Settings, 
  Plus, 
  Search,
  Edit,
  Trash2,
  Eye,
  Calendar,
  TrendingUp,
  Church,
  ArrowLeft
} from 'lucide-react';
import { mockOrganization, mockCampuses, mockCampusServices } from '../../lib/mock-organization-data';
import { OrganizationSetup } from './OrganizationSetup';
import { OrganizationSettings } from '../settings/OrganizationSettings';
import { PageHeader, StatCard } from '../layout/PageHeader';

export function OrganizationManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSetup, setShowSetup] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  if (showSetup) {
    return <OrganizationSetup />;
  }

  if (showSettings) {
    return (
      <div className="space-y-6">
        <Button 
          variant="ghost" 
          onClick={() => setShowSettings(false)}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Organisation Management
        </Button>
        <OrganizationSettings />
      </div>
    );
  }

  const filteredCampuses = mockCampuses.filter(campus =>
    campus.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    campus.location.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Prepare stats for PageHeader
  const statCards: StatCard[] = [
    {
      label: 'Total Campuses',
      value: mockCampuses.length,
      icon: Building2,
      iconColor: 'text-primary',
      valueColor: 'text-primary',
    },
    {
      label: 'Total Members',
      value: mockCampuses.reduce((sum, c) => sum + c.metadata.memberCount, 0),
      icon: Users,
      iconColor: 'text-blue-400',
      valueColor: 'text-blue-400',
    },
    {
      label: 'Total Services',
      value: mockCampusServices.length,
      icon: Calendar,
      iconColor: 'text-green-400',
      valueColor: 'text-green-400',
    },
    {
      label: 'Founded',
      value: new Date(mockOrganization.foundedDate).getFullYear(),
      icon: Church,
      iconColor: 'text-purple-400',
      valueColor: 'text-purple-400',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <PageHeader
        title="Organisation Management"
        description="Manage your church organisation, branches, and services"
        stats={statCards}
      >
        {/* Organization Overview */}
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Building2 className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-xl">{mockOrganization.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline">{mockOrganization.type}</Badge>
                    <Badge variant="secondary" className="bg-primary/20">
                      {mockOrganization.subscription.plan}
                    </Badge>
                  </div>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => setShowSettings(true)}>
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-background/50 rounded-lg">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>
                  {mockOrganization.headquarters.address}, {mockOrganization.headquarters.city}, {mockOrganization.headquarters.country}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm mt-2">
                <span className="text-muted-foreground">Contact:</span>
                <span>{mockOrganization.headquarters.email}</span>
                <span>•</span>
                <span>{mockOrganization.headquarters.phone}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </PageHeader>

      {/* Tabs for Branches and Services */}
      <Tabs defaultValue="branches">
        <TabsList>
          <TabsTrigger value="branches" className="gap-2">
            <Church className="h-4 w-4" />
            Branches ({mockCampuses.length})
          </TabsTrigger>
          <TabsTrigger value="services" className="gap-2">
            <Calendar className="h-4 w-4" />
            Services ({mockCampusServices.length})
          </TabsTrigger>
          <TabsTrigger value="analytics" className="gap-2">
            <TrendingUp className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* Branches Tab */}
        <TabsContent value="branches" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search branches..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button onClick={() => setShowSetup(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Campus
            </Button>
          </div>

          <div className="grid gap-4">
            {filteredCampuses.map((campus) => {
              const campusServices = mockCampusServices.filter(s => s.campusId === campus.id);
              
              return (
                <Card key={campus.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Church className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">{campus.name}</h4>
                            {campus.isHeadquarters && (
                              <Badge variant="default">Headquarters</Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            <span>{campus.location.city}, {campus.location.country}</span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {campus.location.address}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" disabled={campus.isHeadquarters}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-4 gap-4 mb-4">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Members</p>
                        <p className="text-lg font-semibold">{campus.metadata.memberCount}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Avg Attendance</p>
                        <p className="text-lg font-semibold">{campus.metadata.averageAttendance}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Capacity</p>
                        <p className="text-lg font-semibold">{campus.facilities.mainAuditoriumCapacity}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Services</p>
                        <p className="text-lg font-semibold">{campusServices.length}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground">Contact:</span>
                      <span>{campus.contact.email}</span>
                      <span>•</span>
                      <span>{campus.contact.phone}</span>
                    </div>

                    <div className="flex gap-2 mt-3">
                      {campus.facilities.hasChildrenChurch && (
                        <Badge variant="secondary" className="text-xs">Children's Church</Badge>
                      )}
                      {campus.facilities.hasMediaEquipment && (
                        <Badge variant="secondary" className="text-xs">Media Equipment</Badge>
                      )}
                      {campus.facilities.parkingSpaces && (
                        <Badge variant="secondary" className="text-xs">
                          {campus.facilities.parkingSpaces} Parking Spaces
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Services Tab */}
        <TabsContent value="services" className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              All services across all branches
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Service
            </Button>
          </div>

          <div className="grid gap-4">
            {mockCampuses.map((campus) => {
              const campusServices = mockCampusServices.filter(s => s.campusId === campus.id);
              
              if (campusServices.length === 0) return null;

              return (
                <Card key={campus.id}>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Church className="h-5 w-5 text-primary" />
                      <h4 className="font-semibold">{campus.name}</h4>
                      <Badge variant="outline" className="text-xs">{campusServices.length} services</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {campusServices.map((service) => (
                        <div
                          key={service.id}
                          className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{service.name}</span>
                              <Badge variant="outline" className="text-xs">
                                {service.type}
                              </Badge>
                              {service.location.venueType === 'hybrid' && (
                                <Badge variant="secondary" className="text-xs">Hybrid</Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                              <span>
                                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][service.schedule.dayOfWeek]}day
                              </span>
                              <span>{service.schedule.startTime}</span>
                              <span>{service.location.venue}</span>
                              <span>{service.expectedAttendance} expected</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Organization Analytics</CardTitle>
              <CardDescription>
                Performance metrics across all branches
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-6">
                <div className="p-6 bg-accent/50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">Total Capacity</p>
                  <p className="text-3xl font-semibold">
                    {mockCampuses.reduce((sum, b) => sum + b.facilities.mainAuditoriumCapacity, 0)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Across {mockCampuses.length} branches
                  </p>
                </div>

                <div className="p-6 bg-accent/50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">Average Attendance</p>
                  <p className="text-3xl font-semibold">
                    {Math.round(mockCampuses.reduce((sum, b) => sum + b.metadata.averageAttendance, 0) / mockCampuses.length)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Per branch average
                  </p>
                </div>

                <div className="p-6 bg-accent/50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">Weekly Services</p>
                  <p className="text-3xl font-semibold">
                    {mockCampusServices.filter(s => s.recurrence.frequency === 'weekly').length}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Regular weekly services
                  </p>
                </div>
              </div>

              <div className="mt-6 p-4 border rounded-lg">
                <h4 className="font-semibold mb-4">Branch Comparison</h4>
                <div className="space-y-3">
                  {mockCampuses.map((campus) => {
                    const utilizationPercent = Math.round(
                      (campus.metadata.averageAttendance / campus.facilities.mainAuditoriumCapacity) * 100
                    );
                    
                    return (
                      <div key={campus.id}>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span>{campus.name}</span>
                          <span className="text-muted-foreground">
                            {campus.metadata.averageAttendance} / {campus.facilities.mainAuditoriumCapacity} ({utilizationPercent}%)
                          </span>
                        </div>
                        <div className="h-2 bg-accent rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary transition-all"
                            style={{ width: `${utilizationPercent}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}