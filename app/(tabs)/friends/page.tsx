import type { Metadata } from "next";
import { ComingSoon } from "@/components/ComingSoon";
import { FriendsIcon } from "@/components/icons";

export const metadata: Metadata = { title: "Friends · RdThrd" };

export default function FriendsPage() {
  return (
    <ComingSoon
      icon={<FriendsIcon className="size-8" />}
      title="Friends"
      blurb="Follow the people whose taste you trust and see their favourite spots on your map."
      bullets={[
        "Find friends and follow them",
        "See their pins alongside yours",
        "Share a place in one tap",
      ]}
    />
  );
}
