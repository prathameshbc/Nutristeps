import React, { useState } from 'react';
import { AppProvider, useAppContext } from './store/AppContext';
import { BottomNav } from './components/BottomNav';
import { TopBar } from './components/TopBar';
import { HomeScreen } from './screens/HomeScreen';
import { ScannerScreen } from './screens/ScannerScreen';
import { ActivityScreen } from './screens/ActivityScreen';
import { InsightsScreen } from './screens/InsightsScreen';
import { DiaryScreen } from './screens/DiaryScreen';
import { SettingsScreen } from './screens/SettingsScreen';

type Tab = 'home' | 'scanner' | 'activity' | 'insights' | 'diary' | 'settings';

function MainApp() {
  const [currentTab, setCurrentTab] = useState<Tab>('home');
  const { settings } = useAppContext();

  const renderScreen = () => {
    switch (currentTab) {
      case 'home': return <HomeScreen onNavigate={setCurrentTab} />;
      case 'scanner': return <ScannerScreen onNavigate={setCurrentTab} />;
      case 'activity': return <ActivityScreen />;
      case 'insights': return <InsightsScreen />;
      case 'diary': return <DiaryScreen />;
      case 'settings': return <SettingsScreen onNavigate={setCurrentTab} />;
      default: return <HomeScreen onNavigate={setCurrentTab} />;
    }
  };

  return (
    <div className={`flex justify-center h-screen bg-gray-50 dark:bg-slate-900 overflow-hidden ${settings.highContrast ? 'contrast-125' : ''}`}>
      <div className="w-full max-w-md h-full bg-white dark:bg-slate-950 shadow-2xl relative flex flex-col">
        <TopBar currentTab={currentTab} onNavigate={setCurrentTab} />
        <main className="flex-1 overflow-y-auto pb-20">
          {renderScreen()}
        </main>
        {currentTab !== 'scanner' && currentTab !== 'settings' && (
          <BottomNav currentTab={currentTab} onNavigate={setCurrentTab} />
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
