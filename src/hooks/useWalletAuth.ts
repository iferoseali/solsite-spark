import { useState, useCallback, useEffect } from 'react';
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

export const useWalletAuth = () => {
  const { publicKey, signMessage, connected } = useWallet();
  const [user, setUser] = useState<WalletUser | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  // Generate a message to sign for authentication
  const generateAuthMessage = useCallback((nonce: string) => {
    return `Sign this message to verify your wallet ownership on Solsite.\n\nNonce: ${nonce}\nTimestamp: ${Date.now()}`;
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
      
      console.log('Wallet verified with signature:', signatureBase58.slice(0, 20) + '...');
      
      // Check if user exists in database
      const walletAddress = publicKey.toBase58();
      
      const { data: existingUser, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('wallet_address', walletAddress)
        .maybeSingle();

      if (fetchError) {
        console.error('Error fetching user:', fetchError);
      }

      if (existingUser) {
        setUser(existingUser);
        setIsVerified(true);
        toast.success('Wallet verified successfully!');
        return true;
      }

      // Create new user if doesn't exist
      const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert({
          wallet_address: walletAddress,
          subscription_status: 'free'
        })
        .select()
        .single();

      if (insertError) {
        console.error('Error creating user:', insertError);
        toast.error('Failed to create user account');
        return false;
      }

      setUser(newUser);
      setIsVerified(true);
      toast.success('Wallet verified! Welcome to Solsite!');
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
  }, [publicKey, signMessage, generateAuthMessage]);

  // Reset state when wallet disconnects
  useEffect(() => {
    if (!connected) {
      setUser(null);
      setIsVerified(false);
    }
  }, [connected]);

  // Auto-fetch user data when wallet connects
  useEffect(() => {
    const fetchUser = async () => {
      if (publicKey && connected) {
        const walletAddress = publicKey.toBase58();
        
        const { data: existingUser } = await supabase
          .from('users')
          .select('*')
          .eq('wallet_address', walletAddress)
          .maybeSingle();

        if (existingUser) {
          setUser(existingUser);
          setIsVerified(true);
        }
      }
    };

    fetchUser();
  }, [publicKey, connected]);

  return {
    user,
    isVerifying,
    isVerified,
    verifyWallet,
    walletAddress: publicKey?.toBase58() || null,
    connected
  };
};
