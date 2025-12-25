/**
 * ChurchAfrica ChMS - Landing Page
 * Modern, full-screen hero with Africa-First design philosophy
 */

import React from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Logo } from '../branding';
import { 
  ArrowRight, 
  Wifi, 
  WifiOff, 
  Smartphone, 
  Zap, 
  Users, 
  TrendingUp,
  Calendar,
  MessageSquare,
  BarChart3,
  Shield,
  Globe,
  CheckCircle2,
  PlayCircle,
  ChevronRight,
  Sparkles,
  Brain,
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  onWatchDemo: () => void;
}

export function LandingPage({ onGetStarted, onWatchDemo }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section - Full Screen */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1717201611909-0f75ee9b0b1e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwY2h1cmNoJTIwd29yc2hpcCUyMHBlb3BsZXxlbnwxfHx8fDE3NjMwMjk0MTZ8MA&ixlib=rb-4.1.0&q=80&w=1080)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* Dark overlay for readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/90" />
          
          {/* Accent gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#1CE479]/20 via-transparent to-purple-500/20" />
        </div>

        {/* Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          {/* Logo */}
          <div className="flex items-center justify-center mb-12">
            <Logo size="md" showTagline={true} />
          </div>

          {/* Hero Content */}
          <div className="text-center space-y-8 max-w-4xl mx-auto">
            <Badge 
              variant="outline" 
              className="bg-[#1CE479]/10 text-[#1CE479] border-[#1CE479]/30 px-4 py-1.5 text-sm"
            >
              <Sparkles className="h-3.5 w-3.5 mr-1.5" />
              Africa's First Offline-Capable ChMS
            </Badge>

            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-light leading-tight">
              Church Management
              <br />
              <span className="text-[#1CE479]">Made Simple</span>
            </h2>

            <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Built for African churches with offline-first functionality, mobile-first interfaces, 
              and low-bandwidth optimisation for real-world ministry contexts.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button 
                size="lg" 
                onClick={onGetStarted}
                className="bg-[#1CE479] hover:bg-[#1CE479]/90 text-black gap-2 px-8 h-14 text-lg"
              >
                Get Started Free
                <ArrowRight className="h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={onWatchDemo}
                className="border-white/20 hover:bg-white/10 gap-2 px-8 h-14 text-lg"
              >
                <PlayCircle className="h-5 w-5" />
                Watch Demo
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-8 pt-8 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#1CE479]" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#1CE479]" />
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#1CE479]" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2">
              <div className="w-1.5 h-3 bg-[#1CE479] rounded-full" />
            </div>
          </div>
        </div>
      </section>

      {/* Built for African Churches Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#0F0F12]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge 
              variant="outline" 
              className="bg-[#1CE479]/10 text-[#1CE479] border-[#1CE479]/30 mb-4"
            >
              AFRICA-FIRST DESIGN
            </Badge>
            <h2 className="text-4xl sm:text-5xl mb-4">
              Built for African Churches
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to manage your church, even without internet
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Works Offline */}
            <Card className="bg-[#1A1A20] border-border/50 hover:border-[#1CE479]/30 transition-all group">
              <CardHeader>
                <div className="w-16 h-16 rounded-xl bg-[#1CE479]/10 flex items-center justify-center mb-4 group-hover:bg-[#1CE479]/20 transition-colors">
                  <WifiOff className="h-8 w-8 text-[#1CE479]" />
                </div>
                <CardTitle>Works Offline</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Full functionality without internet. Sync when connected. 
                  Perfect for unreliable connectivity contexts.
                </p>
              </CardContent>
            </Card>

            {/* Mobile-First */}
            <Card className="bg-[#1A1A20] border-border/50 hover:border-purple-500/30 transition-all group">
              <CardHeader>
                <div className="w-16 h-16 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4 group-hover:bg-purple-500/20 transition-colors">
                  <Smartphone className="h-8 w-8 text-purple-400" />
                </div>
                <CardTitle>Mobile-First</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Optimised for Android phones and touch interfaces. 
                  Works beautifully on any device.
                </p>
              </CardContent>
            </Card>

            {/* Simple & Powerful */}
            <Card className="bg-[#1A1A20] border-border/50 hover:border-blue-500/30 transition-all group">
              <CardHeader>
                <div className="w-16 h-16 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-colors">
                  <Zap className="h-8 w-8 text-blue-400" />
                </div>
                <CardTitle>Simple & Powerful</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Intuitive interface with enterprise-grade features. 
                  Easy to learn, powerful to use.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Overview Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl mb-4">
              Everything You Need to Manage Your Church
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive tools for modern church administration
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Users,
                title: 'Member Management',
                description: 'Track member information, families, and groups with comprehensive profiles.',
                color: 'text-[#1CE479]',
              },
              {
                icon: Calendar,
                title: 'Attendance Tracking',
                description: 'QR code check-in, kiosk mode, and detailed attendance analytics.',
                color: 'text-blue-400',
              },
              {
                icon: MessageSquare,
                title: 'Real-Time Chat',
                description: 'Group messaging, announcements, and prayer request coordination.',
                color: 'text-purple-400',
              },
              {
                icon: BarChart3,
                title: 'Giving & Donations',
                description: 'Track offerings, generate receipts, and manage campaigns.',
                color: 'text-green-400',
              },
              {
                icon: TrendingUp,
                title: 'Analytics & Reports',
                description: 'Comprehensive insights into church health and growth trends.',
                color: 'text-orange-400',
              },
              {
                icon: Brain,
                title: 'AI Intelligence',
                description: 'ML-powered predictions, churn analysis, and smart recommendations.',
                color: 'text-pink-400',
              },
            ].map((feature, index) => (
              <div 
                key={index}
                className="p-6 rounded-xl border border-border/50 hover:border-border transition-all group"
              >
                <feature.icon className={`h-10 w-10 ${feature.color} mb-4 group-hover:scale-110 transition-transform`} />
                <h3 className="text-xl mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#0F0F12]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl mb-4">
              See ChMS in Action
            </h2>
            <p className="text-lg text-muted-foreground">
              Watch how easy it is to manage your church
            </p>
          </div>

          {/* Video Placeholder */}
          <Card className="bg-[#1A1A20] border-border/50 overflow-hidden">
            <CardContent className="p-0">
              <div className="relative aspect-video bg-gradient-to-br from-[#1A1A20] to-[#0F0F12] flex items-center justify-center">
                <button
                  onClick={onWatchDemo}
                  className="group"
                >
                  <div className="w-20 h-20 rounded-full bg-[#1CE479] flex items-center justify-center group-hover:scale-110 transition-transform">
                    <PlayCircle className="h-10 w-10 text-black" />
                  </div>
                </button>
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                  <p className="text-sm text-gray-300">
                    See member management, attendance tracking, and offline-sync in action
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl mb-6">
            Ready to Transform Your Church Management?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join churches across Africa using ChMS to grow their communities
          </p>
          <Button 
            size="lg" 
            onClick={onGetStarted}
            className="bg-[#1CE479] hover:bg-[#1CE479]/90 text-black gap-2 px-10 h-16 text-xl"
          >
            Start Your Free Trial
            <ArrowRight className="h-6 w-6" />
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Logo & Description */}
            <div className="md:col-span-2">
              <div className="mb-4">
                <Logo size="sm" />
              </div>
              <p className="text-sm text-muted-foreground max-w-md">
                Africa-First Church Management System built with offline-first functionality, 
                mobile-first interfaces, and low-bandwidth optimisation.
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-medium mb-3">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#features" className="hover:text-foreground transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a></li>
                <li><a href="#demo" className="hover:text-foreground transition-colors">Demo</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-3">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#about" className="hover:text-foreground transition-colors">About Us</a></li>
                <li><a href="#contact" className="hover:text-foreground transition-colors">Contact</a></li>
                <li><a href="#support" className="hover:text-foreground transition-colors">Support</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>&copy; 2025 ChurchAfrica ChMS. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <a href="#privacy" className="hover:text-foreground transition-colors">Privacy Policy</a>
              <a href="#terms" className="hover:text-foreground transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
