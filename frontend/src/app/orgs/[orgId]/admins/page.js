import AuthGuard from "@/app/pages/AuthGuard";
import AdminClient from "./AdminClient";

export default async function AdminsPage({ params }) {
  const { orgId } = await params; // await to unwrap

  return <AuthGuard> <AdminClient orgId={orgId} /> </AuthGuard>;
}
