import { ONCHAIN_KIT_CONFIG } from './OnchainKitConfig';

/**
 * Access the RPC URL for OnchainKit.
 * Defaults to using Coinbase Developer Platform if a RPC URL is not provided.
 */
export const getRPCUrl = () => {
  if (!ONCHAIN_KIT_CONFIG.rpcUrl && !ONCHAIN_KIT_CONFIG.apiKey) {
    throw new Error(
      'RPC URL Unset: You can use the Coinbase Developer Platform RPC by providing an API key in `setOnchainKitConfig`: https://portal.cdp.coinbase.com/products/templates',
    );
  }
  return (
    ONCHAIN_KIT_CONFIG.rpcUrl ||
    `https://api.developer.coinbase.com/rpc/v1/${ONCHAIN_KIT_CONFIG.chain.name.replace(' ', '-').toLowerCase()}/${ONCHAIN_KIT_CONFIG.apiKey}`
  );
};
