import React from 'react';
import { Card } from '../components/ui/Card';
import { Tabs } from '../components/ui/Tabs';
import { UsersTab } from '../components/settings/UsersTab';
import { DocumentsTab } from '../components/settings/DocumentsTab';
import { EmailsTab } from '../components/settings/EmailsTab';

export default function SettingsPage() {
  const tabs = [
    {
      label: 'Users',
      content: <UsersTab />
    },
    {
      label: 'Documents',
      content: <DocumentsTab />
    },
    {
      label: 'Emails',
      content: <EmailsTab />
    }
  ];

  return (
    <div className="container mx-auto py-6">
      <Card>
        <Tabs tabs={tabs} />
      </Card>
    </div>
  );
}