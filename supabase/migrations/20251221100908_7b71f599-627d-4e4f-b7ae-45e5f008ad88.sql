-- Add subdomain_changes_count column to domains table to track number of subdomain changes
ALTER TABLE public.domains 
ADD COLUMN subdomain_changes_count integer NOT NULL DEFAULT 0;