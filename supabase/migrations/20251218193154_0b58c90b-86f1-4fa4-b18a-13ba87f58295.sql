-- Add currency and verification columns to payments table
ALTER TABLE public.payments 
ADD COLUMN IF NOT EXISTS currency text DEFAULT 'SOL',
ADD COLUMN IF NOT EXISTS usd_amount numeric,
ADD COLUMN IF NOT EXISTS verified_at timestamp with time zone;

-- Add constraint for valid currencies
ALTER TABLE public.payments 
DROP CONSTRAINT IF EXISTS payments_currency_check;
ALTER TABLE public.payments 
ADD CONSTRAINT payments_currency_check CHECK (currency IN ('SOL', 'USDC'));

-- Add constraint for valid payment types
ALTER TABLE public.payments 
DROP CONSTRAINT IF EXISTS payments_payment_type_check;
ALTER TABLE public.payments 
ADD CONSTRAINT payments_payment_type_check CHECK (payment_type IN ('website', 'domain'));

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_payments_transaction_signature ON public.payments(transaction_signature);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON public.payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_project_id ON public.payments(project_id);

-- Enable RLS on payments table
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can insert their own pending payments" ON public.payments;
DROP POLICY IF EXISTS "Users can view their own payments" ON public.payments;

-- Users can insert pending payments (only pending status allowed)
CREATE POLICY "Users can insert their own pending payments"
ON public.payments
FOR INSERT
WITH CHECK (status = 'pending');

-- Users can view their own payments
CREATE POLICY "Users can view their own payments"
ON public.payments
FOR SELECT
USING (true);