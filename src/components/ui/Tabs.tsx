import React, { useState } from 'react';
import { cn } from '../../lib/utils';

interface Tab {
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: number;
  onTabChange?: (index: number) => void;
  activeTab?: number;
}

export function Tabs({ tabs, defaultTab = 0, onTabChange, activeTab: controlledActiveTab }: TabsProps) {
  const [internalActiveTab, setInternalActiveTab] = useState(defaultTab);
  
  const activeTab = controlledActiveTab !== undefined ? controlledActiveTab : internalActiveTab;
  
  const handleTabChange = (e: React.MouseEvent, index: number) => {
    // Prevent form submission when clicking tab buttons
    e.preventDefault();
    
    if (onTabChange) {
      onTabChange(index);
    } else {
      setInternalActiveTab(index);
    }
  };

  return (
    <div>
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-8 px-6" aria-label="Tabs">
          {tabs.map((tab, index) => (
            <button
              key={tab.label}
              type="button"
              onClick={(e) => handleTabChange(e, index)}
              className={cn(
                'py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap',
                activeTab === index
                  ? 'border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'
              )}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
      <div className="p-6">
        {tabs[activeTab].content}
      </div>
    </div>
  );
}