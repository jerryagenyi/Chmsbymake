/**
 * Organization Settings Component
 * Complete branding and organization management
 */

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
import { useOrganization, Campus } from '../../contexts/OrganizationContext';
import {
  Building2,
  MapPin,
  Heart,
  Image as ImageIcon,
  Palette,
  Globe,
  Mail,
  Phone,
  Plus,
  Trash2,
  Save,
  Upload,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  CheckCircle2,
  Crown,
} from 'lucide-react';

export function OrganizationSettings() {
  const { organization, updateOrganization, updateCampus, addCampus, removeCampus } = useOrganization();
  const [editMode, setEditMode] = useState(false);
  const [campusToDelete, setCampusToDelete] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: organization.name,
    acronym: organization.acronym,
    mission: organization.mission,
    vision: organization.vision || '',
    website: organization.website || '',
    email: organization.email || '',
    phone: organization.phone || '',
    facebook: organization.socialMedia?.facebook || '',
    twitter: organization.socialMedia?.twitter || '',
    instagram: organization.socialMedia?.instagram || '',
    youtube: organization.socialMedia?.youtube || '',
  });

  const handleSave = () => {
    updateOrganization({
      name: formData.name,
      acronym: formData.acronym,
      mission: formData.mission,
      vision: formData.vision,
      website: formData.website,
      email: formData.email,
      phone: formData.phone,
      socialMedia: {
        facebook: formData.facebook,
        twitter: formData.twitter,
        instagram: formData.instagram,
        youtube: formData.youtube,
      },
    });
    setEditMode(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleCancel = () => {
    setFormData({
      name: organization.name,
      acronym: organization.acronym,
      mission: organization.mission,
      vision: organization.vision || '',
      website: organization.website || '',
      email: organization.email || '',
      phone: organization.phone || '',
      facebook: organization.socialMedia?.facebook || '',
      twitter: organization.socialMedia?.twitter || '',
      instagram: organization.socialMedia?.instagram || '',
      youtube: organization.socialMedia?.youtube || '',
    });
    setEditMode(false);
  };

  const handleDeleteCampus = (campusId: string) => {
    removeCampus(campusId);
    setCampusToDelete(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-light mb-2">Organisation Settings</h1>
          <p className="text-sm text-muted-foreground">
            Manage your church branding, mission, and campus locations
          </p>
        </div>
        {showSuccess && (
          <Badge variant="default" className="gap-2 bg-green-600">
            <CheckCircle2 className="h-4 w-4" />
            Changes saved successfully
          </Badge>
        )}
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general" className="gap-2">
            <Building2 className="h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="branding" className="gap-2">
            <Palette className="h-4 w-4" />
            Branding
          </TabsTrigger>
          <TabsTrigger value="branches" className="gap-2">
            <MapPin className="h-4 w-4" />
            Campuses
          </TabsTrigger>
          <TabsTrigger value="contact" className="gap-2">
            <Globe className="h-4 w-4" />
            Contact & Social
          </TabsTrigger>
        </TabsList>

        {/* General Information Tab */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>General Information</CardTitle>
              <CardDescription>
                Basic information about your church or organisation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Church Name */}
              <div className="space-y-2">
                <Label htmlFor="organizationName">Organisation Name *</Label>
                <Input
                  id="organizationName"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={!editMode}
                  placeholder="Victory Chapel Ministry"
                />
                <p className="text-xs text-muted-foreground">
                  Full legal or official name of your church
                </p>
              </div>

              {/* Abbreviation */}
              <div className="space-y-2">
                <Label htmlFor="acronym">Acronym *</Label>
                <Input
                  id="acronym"
                  value={formData.acronym}
                  onChange={(e) => setFormData({ ...formData, acronym: e.target.value })}
                  disabled={!editMode}
                  placeholder="VCM"
                  className="max-w-xs"
                />
                <p className="text-xs text-muted-foreground">
                  Short name or acronym (used in header and compact views)
                </p>
              </div>

              <Separator />

              {/* Mission Statement */}
              <div className="space-y-2">
                <Label htmlFor="mission" className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-primary" />
                  Mission Statement *
                </Label>
                <Textarea
                  id="mission"
                  value={formData.mission}
                  onChange={(e) => setFormData({ ...formData, mission: e.target.value })}
                  disabled={!editMode}
                  placeholder="Making everyone who comes in contact with us be who God has created them to be."
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">
                  Your church's core purpose and calling
                </p>
              </div>

              {/* Vision Statement */}
              <div className="space-y-2">
                <Label htmlFor="vision">Vision Statement (Optional)</Label>
                <Textarea
                  id="vision"
                  value={formData.vision}
                  onChange={(e) => setFormData({ ...formData, vision: e.target.value })}
                  disabled={!editMode}
                  placeholder="A thriving community of believers living out their God-given purpose"
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">
                  Your church's aspirational future state
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-4">
                {!editMode ? (
                  <Button onClick={() => setEditMode(true)}>
                    Edit Information
                  </Button>
                ) : (
                  <>
                    <Button onClick={handleSave} className="gap-2">
                      <Save className="h-4 w-4" />
                      Save Changes
                    </Button>
                    <Button variant="outline" onClick={handleCancel}>
                      Cancel
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Branding Tab */}
        <TabsContent value="branding" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Church Logo & Colours</CardTitle>
              <CardDescription>
                Visual identity and branding elements
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Logo Upload */}
              <div className="space-y-4">
                <Label className="flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" />
                  Church Logo
                </Label>
                <div className="flex items-center gap-6">
                  <div className="h-24 w-24 rounded-lg border-2 border-dashed border-border flex items-center justify-center bg-muted/30">
                    <img
                      src={organization.logo}
                      alt={organization.name}
                      className="h-20 w-20 object-contain"
                    />
                  </div>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Upload className="h-4 w-4" />
                      Upload New Logo
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      Recommended: Square image, 512x512px minimum
                    </p>
                  </div>
                </div>
              </div>

              {/* Brand Colours section removed - will be added in future when AI customisation or organisation-managed UI tokens are implemented */}

              <Separator />

              {/* Contact Information */}
              <div className="space-y-4">
                <Label>Social Media</Label>
                
                <div className="space-y-2">
                  <Label htmlFor="facebook" className="flex items-center gap-2 text-sm">
                    <Facebook className="h-4 w-4" />
                    Facebook
                  </Label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">facebook.com/</span>
                    <Input
                      id="facebook"
                      value={formData.facebook}
                      onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                      disabled={!editMode}
                      placeholder="victorychapel"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="instagram" className="flex items-center gap-2 text-sm">
                    <Instagram className="h-4 w-4" />
                    Instagram
                  </Label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">instagram.com/</span>
                    <Input
                      id="instagram"
                      value={formData.instagram}
                      onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                      disabled={!editMode}
                      placeholder="victorychapel"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="twitter" className="flex items-center gap-2 text-sm">
                    <Twitter className="h-4 w-4" />
                    Twitter/X
                  </Label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">twitter.com/</span>
                    <Input
                      id="twitter"
                      value={formData.twitter}
                      onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                      disabled={!editMode}
                      placeholder="victorychapel"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="youtube" className="flex items-center gap-2 text-sm">
                    <Youtube className="h-4 w-4" />
                    YouTube
                  </Label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">youtube.com/</span>
                    <Input
                      id="youtube"
                      value={formData.youtube}
                      onChange={(e) => setFormData({ ...formData, youtube: e.target.value })}
                      disabled={!editMode}
                      placeholder="victorychapel"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-4">
                {!editMode ? (
                  <Button onClick={() => setEditMode(true)}>
                    Edit Contact Information
                  </Button>
                ) : (
                  <>
                    <Button onClick={handleSave} className="gap-2">
                      <Save className="h-4 w-4" />
                      Save Changes
                    </Button>
                    <Button variant="outline" onClick={handleCancel}>
                      Cancel
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Branches Tab */}
        <TabsContent value="branches" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold mb-1">Campus Locations</h3>
              <p className="text-sm text-muted-foreground">
                Manage your church campuses and meeting locations
              </p>
            </div>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Campus
            </Button>
          </div>

          <div className="grid gap-4">
            {organization.campuses.map((campus) => (
              <Card key={campus.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold">{campus.name}</h4>
                        {campus.isHeadquarters && (
                          <Badge variant="default" className="gap-1">
                            <Crown className="h-3 w-3" />
                            Headquarters
                          </Badge>
                        )}
                      </div>
                      <div className="space-y-1.5 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3.5 w-3.5" />
                          <span>{campus.address}, {campus.city}, {campus.country}</span>
                        </div>
                        {campus.contactEmail && (
                          <div className="flex items-center gap-2">
                            <Mail className="h-3.5 w-3.5" />
                            <span>{campus.contactEmail}</span>
                          </div>
                        )}
                        {campus.contactPhone && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-3.5 w-3.5" />
                            <span>{campus.contactPhone}</span>
                          </div>
                        )}
                        {campus.capacity && (
                          <div className="flex items-center gap-2">
                            <Building2 className="h-3.5 w-3.5" />
                            <span>Capacity: {campus.capacity} people</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                      {!campus.isHeadquarters && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setCampusToDelete(campus.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Contact & Social Tab */}
        <TabsContent value="contact" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>
                Website, email, phone, and social media links
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Website */}
              <div className="space-y-2">
                <Label htmlFor="website" className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Website
                </Label>
                <Input
                  id="website"
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  disabled={!editMode}
                  placeholder="https://victorychapel.org"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={!editMode}
                  placeholder="info@victorychapel.org"
                />
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Phone
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  disabled={!editMode}
                  placeholder="+234 XXX XXXX XXXX"
                />
              </div>

              <Separator />

              {/* Social Media */}
              <div className="space-y-4">
                <Label>Social Media</Label>
                
                <div className="space-y-2">
                  <Label htmlFor="facebook" className="flex items-center gap-2 text-sm">
                    <Facebook className="h-4 w-4" />
                    Facebook
                  </Label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">facebook.com/</span>
                    <Input
                      id="facebook"
                      value={formData.facebook}
                      onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                      disabled={!editMode}
                      placeholder="victorychapel"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="instagram" className="flex items-center gap-2 text-sm">
                    <Instagram className="h-4 w-4" />
                    Instagram
                  </Label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">instagram.com/</span>
                    <Input
                      id="instagram"
                      value={formData.instagram}
                      onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                      disabled={!editMode}
                      placeholder="victorychapel"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="twitter" className="flex items-center gap-2 text-sm">
                    <Twitter className="h-4 w-4" />
                    Twitter/X
                  </Label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">twitter.com/</span>
                    <Input
                      id="twitter"
                      value={formData.twitter}
                      onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                      disabled={!editMode}
                      placeholder="victorychapel"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="youtube" className="flex items-center gap-2 text-sm">
                    <Youtube className="h-4 w-4" />
                    YouTube
                  </Label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">youtube.com/</span>
                    <Input
                      id="youtube"
                      value={formData.youtube}
                      onChange={(e) => setFormData({ ...formData, youtube: e.target.value })}
                      disabled={!editMode}
                      placeholder="victorychapel"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-4">
                {!editMode ? (
                  <Button onClick={() => setEditMode(true)}>
                    Edit Contact Information
                  </Button>
                ) : (
                  <>
                    <Button onClick={handleSave} className="gap-2">
                      <Save className="h-4 w-4" />
                      Save Changes
                    </Button>
                    <Button variant="outline" onClick={handleCancel}>
                      Cancel
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Delete Campus Confirmation Dialog */}
      <AlertDialog open={!!campusToDelete} onOpenChange={() => setCampusToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Campus Location?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this campus location. All associated data will remain but will need to be reassigned to another campus.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => campusToDelete && handleDeleteCampus(campusToDelete)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Campus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}