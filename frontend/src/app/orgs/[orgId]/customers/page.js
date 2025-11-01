import AuthGuard from "@/app/pages/AuthGuard";
import CustomerClient from "./CustomerClient";

export default async function CustomersPage({ params }) {
  const { orgId } = await params;
  return <AuthGuard> <CustomerClient orgId={orgId} /> </AuthGuard>;
}
