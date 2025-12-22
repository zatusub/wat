'use client';

import { Authenticator } from '@aws-amplify/ui-react';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Authenticator.Provider>
      {children}
    </Authenticator.Provider>
  );
}
