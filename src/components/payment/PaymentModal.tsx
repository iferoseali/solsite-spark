import { FC, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, Wallet } from 'lucide-react';
import { getPrices, formatSOL, type PriceData } from '@/lib/priceService';
import { usePayment, type PaymentType } from '@/hooks/usePayment';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (paymentId: string) => void;
  paymentType: PaymentType;
  userId: string;
  walletAddress: string;
  projectId?: string;
}

export const PaymentModal: FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  paymentType,
  userId,
  walletAddress,
  projectId
}) => {
  const prices: PriceData = getPrices();
  const { processPayment, isProcessing } = usePayment();

  const solPrice = paymentType === 'website' ? prices.websitePriceSOL : prices.domainPriceSOL;
  const title = paymentType === 'website' ? 'Generate Website' : 'Add Custom Domain';

  const handlePayment = async () => {
    const result = await processPayment(
      userId,
      walletAddress,
      paymentType,
      solPrice,
      projectId
    );

    if (result.success && result.paymentId) {
      onSuccess(result.paymentId);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md glass border-border/50">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{title}</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Confirm your payment to continue
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Price Display */}
          <div className="text-center p-6 rounded-xl bg-primary/10 border border-primary/20">
            <p className="text-sm text-muted-foreground mb-2">Total Price</p>
            <p className="text-4xl font-bold text-primary">{formatSOL(solPrice)} SOL</p>
          </div>

          {/* Pay Button */}
          <Button
            className="w-full h-14 text-lg font-semibold gap-3"
            onClick={handlePayment}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Wallet className="w-5 h-5" />
                Pay {formatSOL(solPrice)} SOL
              </>
            )}
          </Button>

          {/* Info */}
          <p className="text-xs text-center text-muted-foreground">
            Payment processed on Solana mainnet. Transaction verified on-chain.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
