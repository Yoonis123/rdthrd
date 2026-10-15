import type { Metadata } from "next";
import { ProfilePreview } from "@/components/ProfilePreview";

export const metadata: Metadata = { title: "Profile · RdThrd" };

export default function ProfilePage() {
  return <ProfilePreview />;
}
