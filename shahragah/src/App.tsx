import React from 'react';
import { useApp, AppProvider } from './context/AppContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './views/DashboardView';
import { IssuesManagementView } from './views/IssuesManagementView';
import { AnalyticsView } from './views/AnalyticsView';
import { CitizenPortalView } from './views/CitizenPortalView';
import { IssueDetailsDrawer } from './components/IssueDetailsDrawer';
import { ReferralModal } from './components/ReferralModal';
import { ToastContainer } from './components/ToastContainer';
import { SplashScreen } from './components/SplashScreen';

const MainLayout: React.FC = () => {
  const { viewMode, activePage, showSplash, setShowSplash } = useApp();

  return (
    <div className="min-h-screen bg-ivory-warm text-darkText flex flex-col font-sans selection:bg-forest selection:text-white" dir="rtl">
      {/* صفحه لودینگ / پیش‌نمایش آغازین با هویت بصری تکاپوگران سپهر مانا */}
      {showSplash && (
        <SplashScreen onComplete={() => setShowSplash(false)} />
      )}

      {/* هدر بالایی */}
      <Header />

      {/* بخش اصلی اپلیکیشن */}
      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        {/* منوی کناری مخصوص مدیران */}
        {viewMode === 'admin' && <Sidebar />}

        {/* محتوای صفحات */}
        <main className="flex-1 p-3 sm:p-4 lg:p-6 overflow-y-auto max-w-full">
          {viewMode === 'citizen' ? (
            <CitizenPortalView />
          ) : activePage === 'dashboard' ? (
            <DashboardView />
          ) : activePage === 'issues' ? (
            <IssuesManagementView />
          ) : activePage === 'analytics' ? (
            <AnalyticsView />
          ) : (
            <DashboardView />
          )}
        </main>
      </div>

      {/* Slide-over Detail Drawer & Modals */}
      <IssueDetailsDrawer />
      <ReferralModal />
      <ToastContainer />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}

export default App;
