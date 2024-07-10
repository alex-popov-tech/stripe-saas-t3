import { createClient } from "~/utils/supabase/server";
import { Input } from "./input";

export async function UserProfile() {
  const supabase = createClient();
  const me = await supabase.auth.getUser();
  const userId: string | undefined = me?.data?.user?.id;
  const userEmail: string | undefined = me?.data?.user?.email;
  const customer = await supabase
    .from("stripe_customers")
    .select("*")
    .eq("user_id", userId)
    .single();

  const subscriptionId: string | undefined = customer.data?.subscription_id;
  const isSubscriptionActive: boolean | undefined = customer.data?.plan_active;
  const totalDownloads: number | undefined = customer.data?.total_downloads;

  return (
    <div className="mockup-code w-fit overflow-hidden">
      <pre data-prefix="$">
        <code className="text-teal-500">get_info</code>
        <code> </code>
        <code>$(</code>
        <code className="text-warning">whoami</code>
        <code>)</code>
      </pre>
      <pre data-prefix=">">
        <code>Loading...</code>
      </pre>
      <pre data-prefix=">">
        <code>Your account status is </code>
        <code className={!!userId ? "text-success" : "text-error"}>
          {!!userId ? "logged in" : "logged out"}
        </code>
      </pre>
      <pre data-prefix=">">
        <code>Your subscription status is </code>
        <code className={isSubscriptionActive ? "text-success" : "text-error"}>
          {isSubscriptionActive ? "active" : "not active"}
        </code>
      </pre>
      {!!totalDownloads && (
        <pre data-prefix=">">
          <code>
            Interesting fact: You have downloaded {totalDownloads} files so far
          </code>
        </pre>
      )}
      <Input
        isLoggedIn={!!userId}
        isSubscribed={!!isSubscriptionActive}
        userId={userId ?? ""}
        userEmail={userEmail ?? ""}
        subscriptionId={subscriptionId ?? ""}
      />
    </div>
  );
}
