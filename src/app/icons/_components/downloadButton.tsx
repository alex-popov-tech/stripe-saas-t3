"use client";

import toast from "react-hot-toast";
import { createClient } from "~/utils/supabase/client";

export function DownloadButton() {
  const onClickHandler = async () => {
    const supabase = createClient();
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) {
      console.error(userError);
      toast.error("You need to have account to download those! 🤷‍♂️");
      return;
    }

    const { data: customerData, error: customerError } = await supabase
      .from("stripe_customers")
      .select("*")
      .eq("user_id", userData.user.id)
      .single();
    if (customerError ?? customerData?.plan_active === false) {
      console.error(customerError);
      toast.error("You need to have active subscription to download those! 🤷‍♂️");
      return;
    }

    toast.success("Congrats! Your image will be downloaded shortly...");
    setTimeout(() => {
      toast.success(
        "Still here? Lol your download as real as money you paid earlier ;) ",
      );
    }, 3000);
    setTimeout(() => {
      toast.success("Get out of here, its DEMO for god's sake!");
    }, 5000);
  };

  return (
    <button onClick={onClickHandler} className="btn btn-primary">
      Download
    </button>
  );
}
