import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * POST /api/user/sync
 *
 * Called client-side immediately after Google Sign-In (or any Firebase auth event).
 * Creates or updates the customer row in Supabase so there is always a user record
 * before the customer places their first order.
 *
 * Uses the service-role key to bypass RLS — this route is server-side only.
 */
export async function POST(req: Request) {
  try {
    const { uid, email, displayName, photoURL } = await req.json();

    if (!uid) {
      return NextResponse.json({ success: false, message: 'Missing uid' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('[user/sync] Supabase env vars missing');
      return NextResponse.json({ success: false, message: 'Server configuration error' }, { status: 500 });
    }

    const adminClient = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false },
    });

    const { error } = await adminClient.from('customers').upsert(
      {
        firebase_uid: uid,
        full_name: displayName || null,
        email: email || null,
        photo_url: photoURL || null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'firebase_uid' }
    );

    if (error) {
      // photo_url column may not exist yet — retry without it
      if (error.message?.includes('photo_url')) {
        const { error: retryErr } = await adminClient.from('customers').upsert(
          {
            firebase_uid: uid,
            full_name: displayName || null,
            email: email || null,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'firebase_uid' }
        );
        if (retryErr) {
          console.error('[user/sync] ❌ Supabase upsert error (retry):', retryErr);
          return NextResponse.json({ success: false, message: retryErr.message }, { status: 500 });
        }
      } else {
        console.error('[user/sync] ❌ Supabase upsert error:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
      }
    }

    console.log(`[user/sync] ✅ Customer synced: uid=${uid}, email=${email}`);
    return NextResponse.json({ success: true });

  } catch (err) {
    console.error('[user/sync] Unhandled error:', err);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
