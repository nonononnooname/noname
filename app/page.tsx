import { redirect } from "next/navigation";

// The presentation opens on the ATQM stage.
export default function Home() {
  redirect("/atqm");
}
