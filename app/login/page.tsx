'use client';

import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import '@aws-amplify/ui-react/styles.css';

export default function LoginPage() {
  const { authStatus } = useAuthenticator();
  const router = useRouter();

  useEffect(() => {
    if (authStatus === 'authenticated') {
      router.push('/');
    }
  }, [authStatus, router]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-black tracking-tighter bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
            wat!?
          </h1>
          <p className="mt-2 text-gray-500 font-medium">ログインして高度な解析機能を利用する</p>
        </div>
        <Authenticator hideSignUp={false} />

        <div className="mt-8 text-center">
          <button
            onClick={() => router.push('/')}
            className="text-sm font-medium text-gray-400 hover:text-primary transition-colors flex items-center justify-center gap-2 mx-auto"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6" />
            </svg>
            トップページに戻る
          </button>
        </div>
      </div>
    </div>
  );
}
