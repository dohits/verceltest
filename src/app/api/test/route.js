import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';
const sql = neon(process.env.DATABASE_URL);

const [post] = await sql`
INSERT INTO h_users
  (username, password_hash, is_active, last_login_at)
VALUES 
  ('alice', '$2b$12$abcdefghijkLHashedExample1', TRUE, NOW()),
  ('bob',   '$2b$12$mnopqrstuvwxYHashedExample2', FALSE, NULL);
`;

return NextResponse.json({ post });