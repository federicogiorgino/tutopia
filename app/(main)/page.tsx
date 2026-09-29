import { redirect } from "next/navigation";

import { getServerSession } from "@/lib/get-server-session";
import { HomePageClient } from "./client";

export default async function HomePage() {
  return <HomePageClient />;
}
