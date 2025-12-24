import { FC, useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletReadyState } from '@solana/wallet-adapter-base';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Wallet, ExternalLink, Smartphone } from 'lucide-react';

interface MobileWalletModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Wallet deep links for mobile
const WALLET_DEEP_LINKS = {
  phantom: {
    name: 'Phantom',
    icon: 'https://phantom.app/img/phantom-icon-purple.svg',
    deepLink: (url: string) => `https://phantom.app/ul/browse/${encodeURIComponent(url)}`,
    appStore: 'https://apps.apple.com/app/phantom-solana-wallet/id1598432977',
    playStore: 'https://play.google.com/store/apps/details?id=app.phantom',
  },
  solflare: {
    name: 'Solflare',
    icon: 'https://solflare.com/favicon.ico',
    deepLink: (url: string) => `https://solflare.com/ul/v1/browse/${encodeURIComponent(url)}`,
    appStore: 'https://apps.apple.com/app/solflare/id1580902717',
    playStore: 'https://play.google.com/store/apps/details?id=com.solflare.mobile',
  },
};

export const MobileWalletModal: FC<MobileWalletModalProps> = ({ open, onOpenChange }) => {
  const { wallets, select, connect, connecting } = useWallet();
  const isMobile = useIsMobile();
  const [isPhantomInstalled, setIsPhantomInstalled] = useState(false);
  const [isSolflareInstalled, setIsSolflareInstalled] = useState(false);

  // Detect installed wallets
  useEffect(() => {
    const phantomWallet = wallets.find(w => w.adapter.name === 'Phantom');
    const solflareWallet = wallets.find(w => w.adapter.name === 'Solflare');
    
    setIsPhantomInstalled(
      phantomWallet?.readyState === WalletReadyState.Installed ||
      phantomWallet?.readyState === WalletReadyState.Loadable
    );
    setIsSolflareInstalled(
      solflareWallet?.readyState === WalletReadyState.Installed ||
      solflareWallet?.readyState === WalletReadyState.Loadable
    );
  }, [wallets]);

  // Auto-open Phantom if detected on mobile
  useEffect(() => {
    if (isMobile && open && isPhantomInstalled) {
      const phantomWallet = wallets.find(w => w.adapter.name === 'Phantom');
      if (phantomWallet) {
        handleWalletSelect('Phantom');
      }
    }
  }, [isMobile, open, isPhantomInstalled]);

  const handleWalletSelect = async (walletName: string) => {
    const wallet = wallets.find(w => w.adapter.name === walletName);
    if (wallet) {
      try {
        select(wallet.adapter.name);
        await connect();
        onOpenChange(false);
      } catch (error) {
        console.error('Failed to connect wallet:', error);
      }
    }
  };

  const handleDeepLink = (walletKey: 'phantom' | 'solflare') => {
    const wallet = WALLET_DEEP_LINKS[walletKey];
    const currentUrl = window.location.href;
    window.location.href = wallet.deepLink(currentUrl);
  };

  const handleGetWallet = (walletKey: 'phantom' | 'solflare') => {
    const wallet = WALLET_DEEP_LINKS[walletKey];
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    window.open(isIOS ? wallet.appStore : wallet.playStore, '_blank');
  };

  // Sort wallets: Phantom first, then Solflare, then others
  const sortedWallets = [...wallets].sort((a, b) => {
    if (a.adapter.name === 'Phantom') return -1;
    if (b.adapter.name === 'Phantom') return 1;
    if (a.adapter.name === 'Solflare') return -1;
    if (b.adapter.name === 'Solflare') return 1;
    return 0;
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <Wallet className="w-5 h-5" />
            Connect Wallet
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 py-4">
          {/* Primary wallets with big touch targets */}
          <div className="space-y-3">
            {/* Phantom */}
            <div className="border border-border rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <img 
                  src={WALLET_DEEP_LINKS.phantom.icon} 
                  alt="Phantom" 
                  className="w-10 h-10 rounded-lg"
                />
                <div>
                  <h3 className="font-semibold text-foreground">Phantom</h3>
                  <p className="text-xs text-muted-foreground">Recommended for Solana</p>
                </div>
              </div>
              
              {isPhantomInstalled ? (
                <Button
                  onClick={() => handleWalletSelect('Phantom')}
                  disabled={connecting}
                  className="w-full h-14 text-base touch-manipulation"
                  variant="default"
                >
                  {connecting ? 'Connecting...' : 'Connect Phantom'}
                </Button>
              ) : isMobile ? (
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleDeepLink('phantom')}
                    className="flex-1 h-14 text-base touch-manipulation"
                    variant="default"
                  >
                    <Smartphone className="w-4 h-4 mr-2" />
                    Open in App
                  </Button>
                  <Button
                    onClick={() => handleGetWallet('phantom')}
                    className="h-14 px-4 touch-manipulation"
                    variant="outline"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => handleGetWallet('phantom')}
                  className="w-full h-12 touch-manipulation"
                  variant="outline"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Get Phantom
                </Button>
              )}
            </div>

            {/* Solflare */}
            <div className="border border-border rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <img 
                  src={WALLET_DEEP_LINKS.solflare.icon} 
                  alt="Solflare" 
                  className="w-10 h-10 rounded-lg bg-muted p-1"
                />
                <div>
                  <h3 className="font-semibold text-foreground">Solflare</h3>
                  <p className="text-xs text-muted-foreground">Multi-platform wallet</p>
                </div>
              </div>
              
              {isSolflareInstalled ? (
                <Button
                  onClick={() => handleWalletSelect('Solflare')}
                  disabled={connecting}
                  className="w-full h-14 text-base touch-manipulation"
                  variant="secondary"
                >
                  {connecting ? 'Connecting...' : 'Connect Solflare'}
                </Button>
              ) : isMobile ? (
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleDeepLink('solflare')}
                    className="flex-1 h-14 text-base touch-manipulation"
                    variant="secondary"
                  >
                    <Smartphone className="w-4 h-4 mr-2" />
                    Open in App
                  </Button>
                  <Button
                    onClick={() => handleGetWallet('solflare')}
                    className="h-14 px-4 touch-manipulation"
                    variant="outline"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => handleGetWallet('solflare')}
                  className="w-full h-12 touch-manipulation"
                  variant="outline"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Get Solflare
                </Button>
              )}
            </div>
          </div>

          {/* Other detected wallets */}
          {sortedWallets.filter(w => 
            w.adapter.name !== 'Phantom' && 
            w.adapter.name !== 'Solflare' &&
            (w.readyState === WalletReadyState.Installed || w.readyState === WalletReadyState.Loadable)
          ).length > 0 && (
            <div className="pt-3 border-t border-border">
              <p className="text-xs text-muted-foreground mb-2">Other Wallets</p>
              <div className="space-y-2">
                {sortedWallets
                  .filter(w => 
                    w.adapter.name !== 'Phantom' && 
                    w.adapter.name !== 'Solflare' &&
                    (w.readyState === WalletReadyState.Installed || w.readyState === WalletReadyState.Loadable)
                  )
                  .map(wallet => (
                    <Button
                      key={wallet.adapter.name}
                      onClick={() => handleWalletSelect(wallet.adapter.name)}
                      disabled={connecting}
                      className="w-full h-12 justify-start gap-3 touch-manipulation"
                      variant="ghost"
                    >
                      <img 
                        src={wallet.adapter.icon} 
                        alt={wallet.adapter.name} 
                        className="w-6 h-6"
                      />
                      {wallet.adapter.name}
                    </Button>
                  ))}
              </div>
            </div>
          )}
        </div>

        <p className="text-xs text-center text-muted-foreground">
          By connecting, you agree to our Terms of Service
        </p>
      </DialogContent>
    </Dialog>
  );
};
