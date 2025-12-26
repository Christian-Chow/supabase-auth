"use client";

import { User } from "@supabase/supabase-js"

type EmailPasswordDemoProps = {
  user: User | null;
}


export function EmailPasswordDemo({ user }: EmailPasswordDemoProps) {
  return <div>EmailPasswordDemo</div>;
}