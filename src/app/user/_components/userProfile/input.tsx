"use client";

import { type ChangeEventHandler, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import autoAnimate from "@formkit/auto-animate";
import { toast } from "react-hot-toast";
import { createClient } from "~/utils/supabase/client";
import { loadStripe } from "@stripe/stripe-js";
import { env } from "~/env";

const signup = async ({ refresh }: { refresh: () => void }) => {
  const email = `${Math.random().toString(36).substring(7)}@example.com`;
  const password = "somecomplicatedpassword";
  const supabase = createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  if (error) {
    toast.error(error.message);
    console.error(error);
  } else {
    toast.success("You successfully signed up and logged in!");
    console.log(data);
    refresh();
  }
};

const signout = async ({ refresh }: { refresh: () => void }) => {
  const response = await fetch("/api/logout", { method: "POST" });
  if (response.status !== 200) {
    toast.error("Something went wrong!");
  } else {
    toast.success("You successfully signed out!");
    refresh();
  }
};

const startSubscription = async (args: {
  userId: string;
  userEmail: string;
  items: { price: string; quantity: number }[];
}) => {
  const res = await fetch("/api/subscription", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(args),
  });

  if (res.status !== 201) {
    toast.error("Something went wrong!");
    return;
  }

  const body: { sessionId: string } = await res.json().catch((error: Error) => {
    toast.error("Something went wrong!");
    throw error;
  });

  const stripe = await loadStripe(env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
  const redirect = await stripe?.redirectToCheckout({
    sessionId: body.sessionId,
  });

  if (redirect?.error && redirect?.error instanceof Error) {
    toast.error(redirect?.error.message);
    console.error(redirect?.error);
  }
};

const cancelSubscription = async ({
  subscriptionId,
}: {
  subscriptionId: string;
}) => {
  const res = await fetch(`/api/subscription/${subscriptionId}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
  if (res.status !== 200) {
    toast.error("Something went wrong!");
  } else {
    toast.success(
      "Subscription cancel scheduled, please wait a few seconds and try refreshing the page",
    );
  }
};

const commandsByState = {
  loggedOut: ["signup"],
  loggedIn: ["signout"],
  subscribed: ["cancel_subscription"],
  notsubscribed: ["start_subscription"],
};

export function Input({
  isLoggedIn,
  isSubscribed,
  userId,
  userEmail,
  subscriptionId,
}: {
  isLoggedIn: boolean;
  isSubscribed: boolean;
  userId: string;
  userEmail: string;
  subscriptionId: string;
}) {
  const router = useRouter();

  const parent = useRef(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [inputValue, setInputValue] = useState("");
  const clearInput = () => setInputValue("");

  const [wrongInputs, setWrongInputs] = useState<string[]>([]);
  const addWrongInput = (value: string) =>
    setWrongInputs((prev) => [...prev, value]);

  const handleOnChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setInputValue(event.target.value);
  };

  const handleKeyDown = async (event: KeyboardEvent) => {
    if (event.key !== "Enter") {
      return;
    }

    const value = inputValue.trim();
    clearInput();

    if (value === "/home") {
      router.push("/");
      return;
    }

    const allowedCommands = [
      ...commandsByState[isLoggedIn ? "loggedIn" : "loggedOut"],
      ...(isLoggedIn
        ? commandsByState[isSubscribed ? "subscribed" : "notsubscribed"]
        : []),
    ];

    if (!allowedCommands.includes(value)) {
      addWrongInput(value);
      return;
    }

    switch (value) {
      case "signout":
        await signout({ refresh: () => router.refresh() });
        return;
      case "signup":
        await signup({ refresh: () => router.refresh() });
        return;
      case "start_subscription":
        await startSubscription({
          userId,
          userEmail,
          items: [
            {
              price: "price_1PXs0105aaltdvBbYi9hZj1K",
              quantity: 1,
            },
          ],
        });
        return;
      case "cancel_subscription":
        await cancelSubscription({ subscriptionId });
        return;
    }
  };

  useEffect(() => {
    parent.current && autoAnimate(parent.current);
  }, [parent]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <>
      {wrongInputs.map((wrongInput) => (
        <pre key={wrongInput} data-prefix=">">
          <code className="text-error">Command not found: </code>
          <code className="text-error">{wrongInput}</code>
        </pre>
      ))}
      <pre data-prefix=">">
        <>
          <code key="available-commands">Available commands: </code>
          {[
            ...commandsByState[isLoggedIn ? "loggedIn" : "loggedOut"],
            ...(isLoggedIn
              ? commandsByState[isSubscribed ? "subscribed" : "notsubscribed"]
              : []),
          ].map((cmd) => (
            <code className="text-teal-500" key={cmd}>
              {cmd}{" "}
            </code>
          ))}
        </>
      </pre>
      <pre data-prefix="$">
        <code>
          <input
            value={inputValue}
            onChange={handleOnChange}
            // @ts-expect-error i have no idea what do you want go away
            onKeyDown={handleKeyDown}
            ref={inputRef}
            className="w-full bg-inherit outline-none"
            type="text"
          />
        </code>
      </pre>
    </>
  );
}
