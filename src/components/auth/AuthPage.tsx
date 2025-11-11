/**
 * ChurchAfrica ChMS - Authentication Page
 * Combined login/register page with tab switching
 */

import React, { useState } from 'react';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

interface AuthPageProps {
  onSuccess?: () => void;
  defaultTab?: 'login' | 'register';
}

export function AuthPage({ onSuccess, defaultTab = 'login' }: AuthPageProps) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'login' | 'register')}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login">Sign In</TabsTrigger>
            <TabsTrigger value="register">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <LoginForm
              onSuccess={onSuccess}
              onSwitchToRegister={() => setActiveTab('register')}
            />
          </TabsContent>

          <TabsContent value="register">
            <RegisterForm
              onSuccess={onSuccess}
              onSwitchToLogin={() => setActiveTab('login')}
            />
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>ChurchAfrica ChMS</p>
          <p className="mt-1">Africa-First Church Management System</p>
        </div>
      </div>
    </div>
  );
}

/**
 * Vue Migration Notes:
 * 
 * // Vue 3 + Quasar equivalent - as a separate route/page:
 * // views/AuthView.vue
 * <template>
 *   <q-page class="flex flex-center bg-grey-1">
 *     <div class="auth-container" style="width: 100%; max-width: 500px;">
 *       <q-card>
 *         <q-tabs
 *           v-model="activeTab"
 *           class="text-grey"
 *           active-color="primary"
 *           indicator-color="primary"
 *           align="justify"
 *         >
 *           <q-tab name="login" label="Sign In" />
 *           <q-tab name="register" label="Sign Up" />
 *         </q-tabs>
 * 
 *         <q-separator />
 * 
 *         <q-tab-panels v-model="activeTab" animated>
 *           <q-tab-panel name="login">
 *             <LoginForm @success="handleSuccess" @switch-to-register="activeTab = 'register'" />
 *           </q-tab-panel>
 * 
 *           <q-tab-panel name="register">
 *             <RegisterForm @success="handleSuccess" @switch-to-login="activeTab = 'login'" />
 *           </q-tab-panel>
 *         </q-tab-panels>
 *       </q-card>
 * 
 *       <div class="text-center q-mt-md text-grey">
 *         <div>ChurchAfrica ChMS</div>
 *         <div class="text-caption q-mt-xs">Africa-First Church Management System</div>
 *       </div>
 *     </div>
 *   </q-page>
 * </template>
 * 
 * <script setup lang="ts">
 * import { ref } from 'vue';
 * import { useRouter } from 'vue-router';
 * import LoginForm from '@/components/auth/LoginForm.vue';
 * import RegisterForm from '@/components/auth/RegisterForm.vue';
 * 
 * const router = useRouter();
 * const activeTab = ref('login');
 * 
 * const handleSuccess = () => {
 *   router.push('/dashboard');
 * };
 * </script>
 */
