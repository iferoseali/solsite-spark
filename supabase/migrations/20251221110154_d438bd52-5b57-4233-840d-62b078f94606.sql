-- Address linter: add minimal RLS policies for users and payments

-- USERS table policies (wallet-address scoped)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own user record" ON public.users;
DROP POLICY IF EXISTS "Users can update their own user record" ON public.users;

CREATE POLICY "Users can view their own user record"
ON public.users
FOR SELECT
USING (
  wallet_address = ((current_setting('request.jwt.claims'::text, true))::json ->> 'wallet_address'::text)
);

CREATE POLICY "Users can update their own user record"
ON public.users
FOR UPDATE
USING (
  wallet_address = ((current_setting('request.jwt.claims'::text, true))::json ->> 'wallet_address'::text)
)
WITH CHECK (
  wallet_address = ((current_setting('request.jwt.claims'::text, true))::json ->> 'wallet_address'::text)
);

-- PAYMENTS table policies (wallet-address scoped)
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own payments" ON public.payments;

CREATE POLICY "Users can view their own payments"
ON public.payments
FOR SELECT
USING (
  wallet_address = ((current_setting('request.jwt.claims'::text, true))::json ->> 'wallet_address'::text)
);
