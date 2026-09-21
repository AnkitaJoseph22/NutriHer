import React from "react";
import { Droplet, PieChart as PieIcon, Moon, Sparkles, Info, Heart, Leaf } from "lucide-react";
import { Card, Eyebrow, H, Body } from "../components/ui";
import { C } from "../styles/tokens";
import { PastelBadge, CherryBlossomPetal, BotanicalBranch } from "../components/Decorations";

export default function InsightsScreen({ insight }) {
  const cards = [
    {
      title: "Dietary Iron Intake",
      text: insight.iron,
      icon: Droplet,
      color: C.blushDeep,
      bg: C.blushLight,
      variant: "blush",
    },
    {
      title: "Bioavailability Estimate",
      text: insight.absorption,
      icon: PieIcon,
      color: C.lavenderDeep,
      bg: C.lavenderLight,
      variant: "lavender",
    },
    {
      title: "Cycle Phase Context",
      text: insight.cycle,
      icon: Moon,
      color: C.babyBlueDeep,
      bg: C.babyBlueLight,
      variant: "blue",
    },
    {
      title: "Nutritional Suggestion",
      text: insight.suggestion,
      icon: Sparkles,
      color: C.butterDeep,
      bg: C.butterLight,
      variant: "butter",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <PastelBadge variant="butter">
            <Sparkles size={13} color={C.butterDeep} />
            <span>Context-Aware Suggestions</span>
          </PastelBadge>
          <PastelBadge variant="sage">Wellness Advisory</PastelBadge>
        </div>
        <H size="text-3xl">Your Personalized Insights</H>
        <Body className="mt-0.5 text-sm">
          Nutritional guidance synchronized with your meal data, bioavailability, and cycle rhythm.
        </Body>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        {cards.map((c) => (
          <Card key={c.title} hover style={{ background: c.bg, border: `1.5px solid ${c.color}44` }}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center shadow-xs"
                  style={{ background: C.white }}
                >
                  <c.icon size={16} color={c.color} />
                </div>
                <Eyebrow color={c.color} className="mb-0">{c.title}</Eyebrow>
              </div>
              <PastelBadge variant={c.variant}>Insight</PastelBadge>
            </div>
            <p className="text-xs md:text-sm leading-relaxed" style={{ color: C.plum }}>
              {c.text}
            </p>
          </Card>
        ))}
      </div>

      {/* Academic Disclaimer Notice */}
      <Card style={{ background: C.lavenderLight + "55" }}>
        <div className="flex gap-3">
          <Info size={18} color={C.lavenderDeep} className="shrink-0 mt-0.5" />
          <Body className="text-xs leading-relaxed">
            NutriHer's personalized insights are rule-based educational observations. They are designed for demonstration and nutritional awareness and do not substitute for clinical medical advice or diagnose anemia.
          </Body>
        </div>
      </Card>
    </div>
  );
}
