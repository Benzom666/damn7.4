import { createClient } from "@/lib/supabase/server"
import type { Route, Order } from "@/lib/types"
import OrdersBoard from "./orders-board"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function DispatchPage() {
  const supabase = createClient()

  // Fetch active routes first
  const { data: routes, error: routesError } = await supabase
    .from("routes")
    .select("*")
    .eq("status", "active")

  if (routesError) {
    throw new Error(`Failed to load routes: ${routesError.message}`)
  }

  const routeIds: string[] = (routes ?? []).map((r: Route) => r.id) || []

  let orders: Order[] = []
  if (routeIds.length > 0) {
    const { data: ordersData, error: ordersError } = await supabase
      .from("orders")
      .select("*")
      .in("route_id", routeIds)

    if (ordersError) {
      throw new Error(`Failed to load orders: ${ordersError.message}`)
    }

    orders = (ordersData ?? []) as Order[]
  }

  return <OrdersBoard routes={(routes ?? []) as Route[]} orders={orders} />
}
