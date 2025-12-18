import { FC } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Button } from '@/components/ui/button';
import { useWalletAuth } from '@/hooks/useWalletAuth';
import { ShieldCheck, Loader2, AlertCircle } from 'lucide-react';

interface WalletVerificationProps {
  onVerified?: () => void;
}

export const WalletVerification: FC<WalletVerificationProps> = ({ onVerified }) => {
  const { connected } = useWallet();
  const { isVerifying, isVerified, verifyWallet, walletAddress } = useWalletAuth();

  const handleVerify = async () => {
    const success = await verifyWallet();
    if (success && onVerified) {
      onVerified();
    }
  };

  if (!connected) {
    return (
      <div className="p-6 rounded-2xl glass text-center">
        <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Wallet Not Connected</h3>
        <p className="text-sm text-muted-foreground">
          Please connect your wallet to continue.
        </p>
      </div>
    );
  }

  if (isVerified) {
    return (
      <div className="p-6 rounded-2xl glass text-center border border-accent/30">
        <ShieldCheck className="w-12 h-12 text-accent mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Wallet Verified</h3>
        <p className="text-sm text-muted-foreground font-mono">
          {walletAddress?.slice(0, 8)}...{walletAddress?.slice(-8)}
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-2xl glass text-center">
      <ShieldCheck className="w-12 h-12 text-primary mx-auto mb-4" />
      <h3 className="text-lg font-semibold mb-2">Verify Ownership</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Sign a message to verify you own this wallet. This doesn't cost any SOL.
      </p>
      <Button 
        variant="glow" 
        onClick={handleVerify}
        disabled={isVerifying}
        className="w-full"
      >
        {isVerifying ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Verifying...
          </>
        ) : (
          <>
            <ShieldCheck className="w-4 h-4 mr-2" />
            Sign & Verify
          </>
        )}
      </Button>
    </div>
  );
};
