import { FC, useState, useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Wallet,
  LogOut,
  Copy,
  Check,
  ExternalLink,
  User,
} from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

interface WalletButtonProps {
  className?: string;
}

export const WalletButton: FC<WalletButtonProps> = ({ className }) => {
  const { publicKey, wallet, disconnect, connected } = useWallet();
  const { setVisible } = useWalletModal();
  const [copied, setCopied] = useState(false);

  const handleConnect = useCallback(() => {
    setVisible(true);
  }, [setVisible]);

  const handleDisconnect = useCallback(async () => {
    await disconnect();
    toast.success('Wallet disconnected');
  }, [disconnect]);

  const handleCopyAddress = useCallback(() => {
    if (publicKey) {
      navigator.clipboard.writeText(publicKey.toBase58());
      setCopied(true);
      toast.success('Address copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    }
  }, [publicKey]);

  const formatAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  if (!connected || !publicKey) {
    return (
      <Button
        variant="glow"
        size="sm"
        className={`gap-2 ${className}`}
        onClick={handleConnect}
      >
        <Wallet className="w-4 h-4" />
        Connect Wallet
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="glass" size="sm" className={`gap-2 ${className}`}>
          {wallet?.adapter.icon && (
            <img
              src={wallet.adapter.icon}
              alt={wallet.adapter.name}
              className="w-4 h-4"
            />
          )}
          {formatAddress(publicKey.toBase58())}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 glass-strong border-border">
        <DropdownMenuItem className="gap-2 cursor-pointer" onClick={handleCopyAddress}>
          {copied ? (
            <Check className="w-4 h-4 text-accent" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
          Copy Address
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-2 cursor-pointer" asChild>
          <a
            href={`https://solscan.io/account/${publicKey.toBase58()}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalLink className="w-4 h-4" />
            View on Solscan
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-2 cursor-pointer" asChild>
          <Link to="/dashboard">
            <User className="w-4 h-4" />
            My Projects
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="gap-2 cursor-pointer text-destructive focus:text-destructive"
          onClick={handleDisconnect}
        >
          <LogOut className="w-4 h-4" />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
