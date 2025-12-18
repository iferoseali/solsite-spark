import { useState, useCallback } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { 
  Transaction, 
  SystemProgram, 
  PublicKey,
  LAMPORTS_PER_SOL
} from '@solana/web3.js';
import {
  getAssociatedTokenAddress,
  createTransferCheckedInstruction,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// USDC Mainnet mint address
const USDC_MINT = new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v');
const USDC_DECIMALS = 6;

// Treasury wallet address (same as in edge function)
const TREASURY_WALLET = new PublicKey(import.meta.env.VITE_TREASURY_WALLET || '11111111111111111111111111111111');

export type PaymentCurrency = 'SOL' | 'USDC';
export type PaymentType = 'website' | 'domain';

interface PaymentResult {
  success: boolean;
  paymentId?: string;
  transactionSignature?: string;
  error?: string;
}

export function usePayment() {
  const { publicKey, sendTransaction, signTransaction } = useWallet();
  const { connection } = useConnection();
  const [isProcessing, setIsProcessing] = useState(false);

  const createPaymentRecord = useCallback(async (
    userId: string,
    walletAddress: string,
    paymentType: PaymentType,
    currency: PaymentCurrency,
    amount: number,
    usdAmount: number,
    projectId?: string
  ): Promise<string> => {
    const { data, error } = await supabase
      .from('payments')
      .insert({
        user_id: userId,
        wallet_address: walletAddress,
        payment_type: paymentType,
        currency: currency,
        sol_amount: amount,
        usd_amount: usdAmount,
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

    const lamports = Math.ceil(amount * LAMPORTS_PER_SOL);
    
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: TREASURY_WALLET,
        lamports,
      })
    );

    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = publicKey;

    const signature = await sendTransaction(transaction, connection);
    
    // Wait for confirmation
    await connection.confirmTransaction({
      signature,
      blockhash,
      lastValidBlockHeight
    });

    return signature;
  }, [publicKey, signTransaction, sendTransaction, connection]);

  const sendUSDCPayment = useCallback(async (
    amount: number
  ): Promise<string> => {
    if (!publicKey || !signTransaction) {
      throw new Error('Wallet not connected');
    }

    // Get sender's USDC token account
    const senderATA = await getAssociatedTokenAddress(USDC_MINT, publicKey);
    
    // Get treasury's USDC token account
    const treasuryATA = await getAssociatedTokenAddress(USDC_MINT, TREASURY_WALLET);
    
    // Convert to token amount (USDC has 6 decimals)
    const tokenAmount = BigInt(Math.ceil(amount * Math.pow(10, USDC_DECIMALS)));

    const transaction = new Transaction().add(
      createTransferCheckedInstruction(
        senderATA,           // from
        USDC_MINT,           // mint
        treasuryATA,         // to
        publicKey,           // owner
        tokenAmount,         // amount
        USDC_DECIMALS        // decimals
      )
    );

    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = publicKey;

    const signature = await sendTransaction(transaction, connection);
    
    await connection.confirmTransaction({
      signature,
      blockhash,
      lastValidBlockHeight
    });

    return signature;
  }, [publicKey, signTransaction, sendTransaction, connection]);

  const verifyPayment = useCallback(async (
    paymentId: string,
    transactionSignature: string,
    currency: PaymentCurrency,
    paymentType: PaymentType,
    expectedAmount: number
  ): Promise<boolean> => {
    const { data, error } = await supabase.functions.invoke('verify-payment', {
      body: {
        paymentId,
        transactionSignature,
        currency,
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
    currency: PaymentCurrency,
    amount: number,
    usdAmount: number,
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
        currency,
        amount,
        usdAmount,
        projectId
      );

      // 2. Send payment transaction
      let signature: string;
      if (currency === 'SOL') {
        signature = await sendSOLPayment(amount);
      } else {
        signature = await sendUSDCPayment(amount);
      }

      toast.success('Transaction sent! Verifying...');

      // 3. Verify payment on server
      const verified = await verifyPayment(
        paymentId,
        signature,
        currency,
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
  }, [publicKey, createPaymentRecord, sendSOLPayment, sendUSDCPayment, verifyPayment]);

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