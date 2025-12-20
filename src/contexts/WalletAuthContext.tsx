import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import bs58 from 'bs58';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface WalletUser {
  id: string;
  wallet_address: string;
  subscription_status: string;
  created_at: string;
}

interface WalletAuthContextType {
  user: WalletUser | null;
  isVerifying: boolean;
  isVerified: boolean;
  isLoading: boolean;
  verifyWallet: () => Promise<boolean>;
  walletAddress: string | null;
  connected: boolean;
}

const WalletAuthContext = createContext<WalletAuthContextType | null>(null);

const WALLET_SESSION_KEY = 'solsite_wallet_session';

interface WalletSession {
  walletAddress: string;
  verifiedAt: number;
}

export const WalletAuthProvider = ({ children }: { children: ReactNode }) => {
  const { publicKey, signMessage, connected } = useWallet();
  const [user, setUser] = useState<WalletUser | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Generate a message to sign for authentication
  const generateAuthMessage = useCallback((nonce: string) => {
    return `Sign this message to verify your wallet ownership on Solsite.\n\nNonce: ${nonce}\nTimestamp: ${Date.now()}`;
  }, []);

  // Save session to localStorage
  const saveSession = useCallback((walletAddress: string) => {
    const session: WalletSession = {
      walletAddress,
      verifiedAt: Date.now(),
    };
    localStorage.setItem(WALLET_SESSION_KEY, JSON.stringify(session));
  }, []);

  // Clear session from localStorage
  const clearSession = useCallback(() => {
    localStorage.removeItem(WALLET_SESSION_KEY);
  }, []);

  // Get stored session
  const getStoredSession = useCallback((): WalletSession | null => {
    try {
      const stored = localStorage.getItem(WALLET_SESSION_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Invalid JSON, clear it
      localStorage.removeItem(WALLET_SESSION_KEY);
    }
    return null;
  }, []);

  // Fetch user from database
  const fetchUser = useCallback(async (walletAddress: string): Promise<WalletUser | null> => {
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('wallet_address', walletAddress)
      .maybeSingle();

    return existingUser;
  }, []);

  // Verify wallet ownership by signing a message
  const verifyWallet = useCallback(async () => {
    if (!publicKey || !signMessage) {
      toast.error('Wallet not connected or does not support message signing');
      return false;
    }

    setIsVerifying(true);

    try {
      // Generate a random nonce
      const nonce = Math.random().toString(36).substring(2, 15);
      const message = generateAuthMessage(nonce);
      
      // Request signature from wallet
      const encodedMessage = new TextEncoder().encode(message);
      const signature = await signMessage(encodedMessage);
      
      // Convert signature to base58 for verification
      const signatureBase58 = bs58.encode(signature);
      
      // Send to edge function for server-side verification
      const walletAddress = publicKey.toBase58();
      
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/wallet-auth`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            wallet_address: walletAddress,
            signature: signatureBase58,
            message: message
          })
        }
      );

      const result = await response.json();
      
      if (!response.ok || !result.success) {
        console.error('Auth failed:', result.error);
        toast.error(result.error || 'Failed to verify wallet');
        return false;
      }

      setUser(result.user);
      setIsVerified(true);
      saveSession(walletAddress);
      toast.success(result.message || 'Wallet verified successfully!');
      return true;
    } catch (error: any) {
      console.error('Verification error:', error);
      if (error.message?.includes('User rejected')) {
        toast.error('Signature request was rejected');
      } else {
        toast.error('Failed to verify wallet');
      }
      return false;
    } finally {
      setIsVerifying(false);
    }
  }, [publicKey, signMessage, generateAuthMessage, saveSession]);

  // Reset state when wallet disconnects
  useEffect(() => {
    if (!connected) {
      setUser(null);
      setIsVerified(false);
      clearSession();
      setIsLoading(false);
    }
  }, [connected, clearSession]);

  // Auto-fetch user data when wallet connects
  useEffect(() => {
    const checkSession = async () => {
      if (!publicKey || !connected) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      const walletAddress = publicKey.toBase58();
      
      try {
        // Check if we have a stored session for this wallet
        const storedSession = getStoredSession();
        
        // Fetch user from database
        const existingUser = await fetchUser(walletAddress);

        if (existingUser) {
          setUser(existingUser);
          setIsVerified(true);
          
          // Update session if it was for a different wallet or missing
          if (!storedSession || storedSession.walletAddress !== walletAddress) {
            saveSession(walletAddress);
          }
        } else if (storedSession && storedSession.walletAddress === walletAddress) {
          // Session exists but user not in DB (edge case - maybe user was deleted)
          clearSession();
          setIsVerified(false);
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, [publicKey, connected, fetchUser, getStoredSession, saveSession, clearSession]);

  const value: WalletAuthContextType = {
    user,
    isVerifying,
    isVerified,
    isLoading,
    verifyWallet,
    walletAddress: publicKey?.toBase58() || null,
    connected,
  };

  return (
    <WalletAuthContext.Provider value={value}>
      {children}
    </WalletAuthContext.Provider>
  );
};

export const useWalletAuthContext = () => {
  const context = useContext(WalletAuthContext);
  if (!context) {
    throw new Error('useWalletAuthContext must be used within WalletAuthProvider');
  }
  return context;
};
