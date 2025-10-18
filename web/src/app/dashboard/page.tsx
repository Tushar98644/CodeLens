'use client';

import { useUser } from '@clerk/nextjs';
import { useState } from 'react';

export default function GitHubIntegration() {
  const { user, isLoaded } = useUser();
  const [loading, setLoading] = useState(false);

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  const githubAccount = user?.externalAccounts.find(
    (account) => account.provider === 'github'
  );

  const isConnected = !!githubAccount;

  const connectGitHub = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      await user.createExternalAccount({
        strategy: 'oauth_github',
        redirectUrl: '/dashboard',
        additionalScopes: ['repo', 'read:user']
      });
    } catch (error) {
      console.error('Failed to connect GitHub:', error);
      setLoading(false);
    }
  };

  return (
    <div className="p-6 border rounded-lg">
      {isConnected ? (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">✅ GitHub Connected</h3>
          <p>Username: {githubAccount.username}</p>
          <p>Email: {githubAccount.emailAddress}</p>
        </div>
      ) : (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Connect GitHub</h3>
          <p className="text-sm text-muted-foreground">
            Connect your GitHub account to review PRs from private repositories
          </p>
          <button
            onClick={connectGitHub}
            disabled={loading}
            className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
          >
            {loading ? 'Connecting...' : 'Connect GitHub Account'}
          </button>
        </div>
      )}
    </div>
  );
}
