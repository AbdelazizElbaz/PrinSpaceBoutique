import {
  Banknote,
  ClipboardList,
  LayoutDashboard,
  Printer,
  ShieldCheck,
  Store,
  Truck,
  Users,
  type LucideProps,
} from "lucide-react"

const map = { Banknote, ClipboardList, LayoutDashboard, Printer, ShieldCheck, Store, Truck, Users }

export type IconName = keyof typeof map

export function Icon({ name, ...props }: { name: string } & LucideProps) {
  const C = map[name as IconName] ?? ClipboardList
  return <C {...props} />
}
