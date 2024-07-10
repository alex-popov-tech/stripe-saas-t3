import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { createClient } from "~/utils/supabase/server";

export async function POST() {
  const supabase = createClient();
  const signoutResult = await supabase.auth.signOut();
  if (signoutResult?.error) {
    return NextResponse.json(
      { message: signoutResult.error.message },
      { status: 500 },
    );
  }
  revalidatePath("/", "layout");
  return new Response(null, { status: 200 });
}
