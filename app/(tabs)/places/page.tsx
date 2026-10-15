import type { Metadata } from "next";
import { MyPlaces } from "@/components/MyPlaces";

export const metadata: Metadata = { title: "My places · RdThrd" };

export default function PlacesPage() {
  return <MyPlaces />;
}
