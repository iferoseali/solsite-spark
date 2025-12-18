import { useState, useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import {
  Transaction,
  SystemProgram,
  PublicKey,
  LAMPORTS_PER_SOL,
} from '@solana/web3.js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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

    // Get blockhash via Edge Function to bypass CORS issues
    const { data: rpcData, error: rpcError } = await supabase.functions.invoke('solana-rpc', {
      body: { method: 'getLatestBlockhash', params: [{ commitment: 'confirmed' }] }
    });

    if (rpcError || !rpcData?.result?.value) {
      console.error('Failed to get blockhash:', rpcError, rpcData);
      throw new Error('Failed to get recent blockhash');
    }

    const { blockhash, lastValidBlockHeight } = rpcData.result.value;

    const lamports = Math.ceil(amount * LAMPORTS_PER_SOL);
    
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: TREASURY_WALLET,
        lamports,
      })
    );

    transaction.recentBlockhash = blockhash;
    transaction.feePayer = publicKey;

    // Sign and send using the wallet (wallet handles its own RPC)
    const signedTx = await signTransaction(transaction);
    
    // Send raw transaction via Edge Function
    const { data: sendData, error: sendError } = await supabase.functions.invoke('solana-rpc', {
      body: { 
        method: 'sendRawTransaction', 
        params: [Buffer.from(signedTx.serialize()).toString('base64'), { encoding: 'base64' }] 
      }
    });

    if (sendError || sendData?.error || !sendData?.result) {
      console.error('Failed to send transaction:', sendError, sendData);
      throw new Error(sendData?.error || 'Failed to send transaction');
    }

    const signature = sendData.result;

    // Confirm transaction via Edge Function
    let confirmed = false;
    let attempts = 0;
    while (!confirmed && attempts < 30) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const { data: statusData } = await supabase.functions.invoke('solana-rpc', {
        body: { method: 'getSignatureStatuses', params: [[signature]] }
      });

      const status = statusData?.result?.value?.[0];
      if (status?.confirmationStatus === 'confirmed' || status?.confirmationStatus === 'finalized') {
        confirmed = true;
      }
      attempts++;
    }

    if (!confirmed) {
      throw new Error('Transaction confirmation timeout');
    }

    return signature;
  }, [publicKey, signTransaction]);

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
