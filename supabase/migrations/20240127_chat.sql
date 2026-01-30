# Migration: Add Chat Infrastructure

```sql
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID REFERENCES auth.users,
  receiver_id UUID REFERENCES auth.users, -- If null, it's to "Support" broadcast
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Admins can see all messages
CREATE POLICY "Admins can see all messages" ON chat_messages
FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'super_admin'))
);

-- Users can see their own messages
CREATE POLICY "Users can see own messages" ON chat_messages
FOR SELECT USING (
  auth.uid() = sender_id OR auth.uid() = receiver_id
);

-- Users can send messages
CREATE POLICY "Users can insert messages" ON chat_messages
FOR INSERT WITH CHECK (
  auth.uid() = sender_id
);
```
