import { useState, useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import {
  Transaction,
  SystemProgram,
  PublicKey,
  LAMPORTS_PER_SOL,
  Connection,
} from '@solana/web3.js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Public RPC (no API key)
const SOLANA_RPC = 'https://rpc.ankr.com/solana';

// Treasury wallet address
const TREASURY_WALLET = new PublicKey(import.meta.env.VITE_TREASURY_WALLET || '11111111111111111111111111111111');

export type PaymentType = 'website' | 'domain';

interface PaymentResult {
  success: boolean;
  paymentId?: string;
  transactionSignature?: string;
  error?: string;
}

export function usePayment() {
  const { publicKey, sendTransaction, signTransaction } = useWallet();
  const [isProcessing, setIsProcessing] = useState(false);

  const createPaymentRecord = useCallback(async (
    userId: string,
    walletAddress: string,
    paymentType: PaymentType,
    amount: number,
    projectId?: string
  ): Promise<string> => {
    const { data, error } = await supabase
      .from('payments')
      .insert({
        user_id: userId,
        wallet_address: walletAddress,
        payment_type: paymentType,
        currency: 'SOL',
        sol_amount: amount,
        usd_amount: null,
        project_id: projectId || null,
        status: 'pending'
      })
      .select('id')
      .single();

    if (error) {
      console.error('Error creating payment record:', error);
      throw new Error('Failed to create payment record');
    }

    return data.id;
  }, []);

  const sendSOLPayment = useCallback(async (
    amount: number
  ): Promise<string> => {
    if (!publicKey || !signTransaction) {
      throw new Error('Wallet not connected');
    }

    // Use reliable RPC connection
    const reliableConnection = new Connection(SOLANA_RPC, 'confirmed');

    const lamports = Math.ceil(amount * LAMPORTS_PER_SOL);
    
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: TREASURY_WALLET,
        lamports,
      })
    );

    const { blockhash, lastValidBlockHeight } = await reliableConnection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = publicKey;

    const signature = await sendTransaction(transaction, reliableConnection);
    
    // Wait for confirmation
    await reliableConnection.confirmTransaction({
      signature,
      blockhash,
      lastValidBlockHeight
    });

    return signature;
  }, [publicKey, signTransaction, sendTransaction]);

  const verifyPayment = useCallback(async (
    paymentId: string,
    transactionSignature: string,
    paymentType: PaymentType,
    expectedAmount: number
  ): Promise<boolean> => {
    const { data, error } = await supabase.functions.invoke('verify-payment', {
      body: {
        paymentId,
        transactionSignature,
        currency: 'SOL',
        paymentType,
        expectedAmount
      }
    });

    if (error) {
      console.error('Verification error:', error);
      return false;
    }

    return data?.success === true;
  }, []);

  const processPayment = useCallback(async (
    userId: string,
    walletAddress: string,
    paymentType: PaymentType,
    amount: number,
    projectId?: string
  ): Promise<PaymentResult> => {
    if (!publicKey) {
      return { success: false, error: 'Wallet not connected' };
    }

    setIsProcessing(true);

    try {
      // 1. Create pending payment record
      const paymentId = await createPaymentRecord(
        userId,
        walletAddress,
        paymentType,
        amount,
        projectId
      );

      // 2. Send SOL payment transaction
      const signature = await sendSOLPayment(amount);

      toast.success('Transaction sent! Verifying...');

      // 3. Verify payment on server
      const verified = await verifyPayment(
        paymentId,
        signature,
        paymentType,
        amount
      );

      if (!verified) {
        toast.error('Payment verification failed');
        return { 
          success: false, 
          paymentId, 
          transactionSignature: signature,
          error: 'Verification failed' 
        };
      }

      toast.success('Payment verified!');
      return { 
        success: true, 
        paymentId, 
        transactionSignature: signature 
      };

    } catch (error: any) {
      console.error('Payment error:', error);
      const errorMessage = error.message || 'Payment failed';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsProcessing(false);
    }
  }, [publicKey, createPaymentRecord, sendSOLPayment, verifyPayment]);

  const checkExistingPayment = useCallback(async (
    userId: string,
    paymentType: PaymentType,
    projectId?: string
  ): Promise<boolean> => {
    let query = supabase
      .from('payments')
      .select('id')
      .eq('user_id', userId)
      .eq('payment_type', paymentType)
      .eq('status', 'confirmed');

    if (projectId) {
      query = query.eq('project_id', projectId);
    }

    const { data } = await query.limit(1);
    return (data?.length || 0) > 0;
  }, []);

  return {
    processPayment,
    checkExistingPayment,
    isProcessing,
  };
}
