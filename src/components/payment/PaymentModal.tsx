import { FC, useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, Wallet, DollarSign, RefreshCw } from 'lucide-react';
import { getPrices, formatSOL, WEBSITE_PRICE_USD, DOMAIN_PRICE_USD, type PriceData } from '@/lib/priceService';
import { usePayment, type PaymentCurrency, type PaymentType } from '@/hooks/usePayment';

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
  const [prices, setPrices] = useState<PriceData | null>(null);
  const [isLoadingPrices, setIsLoadingPrices] = useState(true);
  const [selectedCurrency, setSelectedCurrency] = useState<PaymentCurrency | null>(null);
  const { processPayment, isProcessing } = usePayment();

  const usdPrice = paymentType === 'website' ? WEBSITE_PRICE_USD : DOMAIN_PRICE_USD;
  const title = paymentType === 'website' ? 'Generate Website' : 'Add Custom Domain';

  useEffect(() => {
    if (isOpen) {
      loadPrices();
    }
  }, [isOpen]);

  const loadPrices = async () => {
    setIsLoadingPrices(true);
    try {
      const data = await getPrices();
      setPrices(data);
    } catch (error) {
      console.error('Failed to load prices:', error);
    } finally {
      setIsLoadingPrices(false);
    }
  };

  const handlePayment = async (currency: PaymentCurrency) => {
    if (!prices) return;
    
    setSelectedCurrency(currency);
    
    const amount = currency === 'SOL' 
      ? (paymentType === 'website' ? prices.websitePriceSOL : prices.domainPriceSOL)
      : (paymentType === 'website' ? prices.websitePriceUSDC : prices.domainPriceUSDC);

    const result = await processPayment(
      userId,
      walletAddress,
      paymentType,
      currency,
      amount,
      usdPrice,
      projectId
    );

    if (result.success && result.paymentId) {
      onSuccess(result.paymentId);
      onClose();
    }
    
    setSelectedCurrency(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md glass border-border/50">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{title}</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Choose your preferred payment method
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Price Display */}
          <div className="text-center p-4 rounded-xl bg-primary/10 border border-primary/20">
            <p className="text-sm text-muted-foreground mb-1">Total Price</p>
            <p className="text-3xl font-bold text-primary">${usdPrice}</p>
          </div>

          {/* Loading State */}
          {isLoadingPrices ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">Loading prices...</span>
            </div>
          ) : prices ? (
            <div className="space-y-3">
              {/* SOL Payment Option */}
              <Button
                variant="outline"
                className="w-full h-auto py-4 flex items-center justify-between hover:border-primary/50 transition-all"
                onClick={() => handlePayment('SOL')}
                disabled={isProcessing}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                    <Wallet className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold">Pay with SOL</p>
                    <p className="text-sm text-muted-foreground">
                      ≈ {formatSOL(paymentType === 'website' ? prices.websitePriceSOL : prices.domainPriceSOL)} SOL
                    </p>
                  </div>
                </div>
                {isProcessing && selectedCurrency === 'SOL' ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <span className="text-xs text-muted-foreground">@ ${prices.solPrice.toFixed(2)}/SOL</span>
                )}
              </Button>

              {/* USDC Payment Option */}
              <Button
                variant="outline"
                className="w-full h-auto py-4 flex items-center justify-between hover:border-primary/50 transition-all"
                onClick={() => handlePayment('USDC')}
                disabled={isProcessing}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold">Pay with USDC</p>
                    <p className="text-sm text-muted-foreground">
                      {paymentType === 'website' ? prices.websitePriceUSDC : prices.domainPriceUSDC} USDC
                    </p>
                  </div>
                </div>
                {isProcessing && selectedCurrency === 'USDC' ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <span className="text-xs text-muted-foreground">Stable</span>
                )}
              </Button>

              {/* Refresh Prices */}
              <button
                onClick={loadPrices}
                className="w-full flex items-center justify-center gap-2 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                disabled={isLoadingPrices || isProcessing}
              >
                <RefreshCw className={`w-4 h-4 ${isLoadingPrices ? 'animate-spin' : ''}`} />
                Refresh prices
              </button>
            </div>
          ) : (
            <div className="text-center py-4 text-destructive">
              Failed to load prices. Please try again.
            </div>
          )}

          {/* Info */}
          <p className="text-xs text-center text-muted-foreground">
            Payments are processed on Solana mainnet. Transaction will be verified on-chain.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};