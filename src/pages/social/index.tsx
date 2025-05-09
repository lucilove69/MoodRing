import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import SocialConnections from '../../components/Social/SocialConnections';
import ShareContent from '../../components/Social/ShareContent';
import ScheduledContent from '../../components/Social/ScheduledContent';

export default function SocialPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<'connections' | 'share' | 'scheduled'>('connections');

  if (!session?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please sign in to access social features</h1>
          <p className="text-gray-600">
            You need to be signed in to connect social accounts and share content.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('connections')}
                className={`${
                  activeTab === 'connections'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Connected Accounts
              </button>
              <button
                onClick={() => setActiveTab('share')}
                className={`${
                  activeTab === 'share'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Share Content
              </button>
              <button
                onClick={() => setActiveTab('scheduled')}
                className={`${
                  activeTab === 'scheduled'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Scheduled Posts
              </button>
            </nav>
          </div>

          <div className="mt-6">
            {activeTab === 'connections' && <SocialConnections />}
            {activeTab === 'share' && (
              <div className="bg-white shadow rounded-lg p-6">
                <ShareContent />
              </div>
            )}
            {activeTab === 'scheduled' && <ScheduledContent />}
          </div>
        </div>
      </div>
    </div>
  );
} 