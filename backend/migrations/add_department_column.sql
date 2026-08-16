-- Migration: Add department column to users table
-- Date: 2026-08-16
-- Description: Adds department column to support officer department assignment

-- Add department column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'users' 
        AND column_name = 'department'
    ) THEN
        ALTER TABLE users ADD COLUMN department VARCHAR(100);
        RAISE NOTICE 'Added department column to users table';
    ELSE
        RAISE NOTICE 'Department column already exists';
    END IF;
END $$;
