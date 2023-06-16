import { configureChains, createConfig } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';

const { publicClient, webSocketPublicClient } = configureChains(
  [mainnet, ...(process.env.NODE_ENV === 'development' ? [sepolia] : [])],
  [publicProvider()]
);

export const config = createConfig({
  autoConnect: false,
  publicClient,
  webSocketPublicClient,
});
