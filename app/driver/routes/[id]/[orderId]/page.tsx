import { createServerClient } from "@/lib/supabase/server"
import { notFound, redirect } from "next/navigation"
import { StopDetail } from "./stop-detail"

export default async function StopPage({
  params,
}: {
  params: Promise<{ id: string; orderId: string }>
}) {
  const { id: routeId, orderId } = await params
  const supabase = await createServerClient()

  // Check auth
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

  if (profile?.role !== "driver") redirect("/admin")

  // Get order details
  const { data: order, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .eq("route_id", routeId)
    .single()

  if (error || !order) notFound()

  // Get route info
  const { data: route } = await supabase.from("routes").select("name").eq("id", routeId).single()

  // Get existing POD if any
  const { data: existingPod } = await supabase.from("pods").select("*").eq("order_id", orderId).maybeSingle()

  return <StopDetail order={order} routeName={route?.name || "Route"} routeId={routeId} existingPod={existingPod} />
}
