'use client';

import { authClient } from '@/lib/auth-client';
import { useState, useEffect } from 'react';

export default function GitHubIntegration() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const { data: accountsList, error } = await authClient.listAccounts();
        if (accountsList) {
          console.log('Accounts:', accountsList);
          setAccounts(accountsList);
        }
        if (error) {
            console.error('Failed to fetch accounts:', error);
        }
      } catch (error) {
        console.error('Failed to fetch accounts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  const githubAccount = accounts.find(
    (account) => account.providerId === 'github'
  );
  const isConnected = !!githubAccount;

  const connectGitHub = async () => {
    try {
      await authClient.linkSocial({
        provider: 'github',
        callbackURL: '/dashboard',
      });
    } catch (error) {
      console.error('Failed to connect GitHub:', error);
    }
  };

  if (loading) {
    return <div className="p-6">Loading accounts...</div>;
  }

  return (
    <div className="p-6 border rounded-lg">
      {isConnected && githubAccount ? (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">✅ GitHub Connected</h3>
          <p>Account ID: {githubAccount.accountId}</p>
          <p>Provider: {githubAccount.providerId}</p>
        </div>
      ) : (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Connect GitHub</h3>
          <p className="text-sm text-muted-foreground">
            Connect your GitHub account to access private repositories
          </p>
          <button
            onClick={connectGitHub}
            className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
          >
            Connect GitHub Account
          </button>
        </div>
      )}
    </div>
  );
}
