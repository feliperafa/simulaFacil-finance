import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  House,
  ChartNoAxesCombined,
  Users,
  CarFront,
  Wallet,
  Sprout,
} from "lucide-react";
import { simulators } from "@/data/simulators";

const iconMap = {
  home: House,
  chart: ChartNoAxesCombined,
  users: Users,
  car: CarFront,
  wallet: Wallet,
  sprout: Sprout,
};
export function SimulatorCards() {
  return (
    <div className="sim-grid">
      {simulators.map((sim, i) => {
        const Icon = iconMap[sim.icon];
        return (
          <Link
            href={"/" + sim.slug}
            key={sim.kind}
            className={"sim-card " + sim.color}
          >
            <div className="card-top">
              <span className="sim-icon">
                <Icon size={25} />
              </span>
              {i === 1 && (
                <span className="popular">
                  <span /> MAIS POPULAR
                </span>
              )}
              <ArrowUpRight className="card-arrow" size={20} />
            </div>
            <h3>{sim.name}</h3>
            <p>{sim.description}</p>
            <div className="card-benefit">
              <Check size={15} />
              {sim.benefit}
            </div>
            <div className="card-link">
              Simular agora <ArrowRight size={17} />
            </div>
          </Link>
        );
      })}
    </div>
  );
}
