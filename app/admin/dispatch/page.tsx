import { createClient } from "@/lib/supabase/server"
import type { Route, Order } from "@/lib/types"
import OrdersBoard from "./orders-board"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function DispatchPage() {
  const supabase = createClient()

  // 1) Load active routes (typed)
  const { data: routesData, error: routesError } = await supabase
    .from("routes")
    .select("*")
    .eq("status", "active")

  if (routesError) {
    throw new Error(`Failed to load routes: ${routesError.message}`)
  }

  const routes: Route[] = (routesData ?? []) as Route[]
  const routeIds: string[] = routes.map((r) => r.id)

  // 2) Load orders for those routes (typed)
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

  // 3) Hand off to UI
  return <OrdersBoard routes={routes} orders={orders} />
}
