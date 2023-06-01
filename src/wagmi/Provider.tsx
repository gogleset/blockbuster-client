import * as React from 'react';
import { WagmiConfig } from 'wagmi';

import { config } from './config';

export default function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  return <WagmiConfig config={config}>{mounted && children}</WagmiConfig>;
}
