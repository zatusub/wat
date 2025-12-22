'use client';

import { useAuthenticator } from '@aws-amplify/ui-react';
import { fetchAuthSession } from 'aws-amplify/auth';

export function useAIModel() {
  const { authStatus } = useAuthenticator();
  
  // 認証状態でモデルを切り替え
  const getModel = () => {
    if (authStatus === 'authenticated') {
      return 'amazon-nova-pro';  // 認証済み
    }
    return 'amazon-nova-micro';   // 未認証
  };
  
  // APIリクエスト時にJWTを取得
  const getAuthToken = async () => {
    try {
      const session = await fetchAuthSession();
      // Access Tokenを取得（API認証用）
      return session.tokens?.accessToken?.toString();
    } catch {
      return null;
    }
  };
  
  return { getModel, getAuthToken, authStatus };
}
