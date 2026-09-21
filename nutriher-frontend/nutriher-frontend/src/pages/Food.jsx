import React, { useState } from "react";
import { Upload, Camera, Sparkles, Utensils, ChevronRight, Plus, CheckCircle2, ChevronDown, ChevronUp, Scan } from "lucide-react";
import { C, FONT_HEAD } from "../styles/tokens";
import { Card, Eyebrow, H, Body, GhostButton, PrimaryButton } from "../components/ui";
import { FOOD_DB } from "../data/foodDb";
import { predictFood, getNutrients } from "../services/foodService";
import { PastelBadge, BotanicalBranch, CherryBlossomPetal } from "../components/Decorations";

function NutrientCell({ label, value, subtext, highlight, variant = "cream" }) {
  const styles = {
    blush: { bg: C.blushLight, text: C.plum, border: C.blush, valueColor: C.blushDeep },
    blue: { bg: C.babyBlueLight, text: C.plum, border: C.babyBlue, valueColor: C.babyBlueDeep },
    butter: { bg: C.butterLight, text: C.plum, border: C.butter, valueColor: C.butterDeep },
    sage: { bg: C.sageLight, text: C.plum, border: C.sage, valueColor: C.sageDeep },
    cream: { bg: C.cream, text: C.plum, border: C.line, valueColor: C.plum },
  }[variant] || { bg: C.cream, text: C.plum, border: C.line, valueColor: C.plum };

  return (
    <div
      className="rounded-2xl p-4 transition-all duration-200 hover:scale-[1.02]"
      style={{
        background: styles.bg,
        border: `1.5px solid ${styles.border}`,
        boxShadow: "0 2px 8px -2px rgba(42,29,45,0.04)",
      }}
    >
      <div className="text-[11px] font-semibold mb-1" style={{ color: C.plumSoft }}>
        {label}
      </div>
      <div style={{ fontFamily: FONT_HEAD, fontSize: 22, color: styles.valueColor, fontWeight: 700 }}>
        {value}
      </div>
      {subtext && (
        <div className="text-[11px] mt-1 font-medium" style={{ color: C.plumMuted }}>
          {subtext}
        </div>
      )}
    </div>
  );
}

export default function FoodScreen({ onLogMeal }) {
  const [stage, setStage] = useState("upload"); // upload -> predicting -> predicted -> nutrients
  const [prediction, setPrediction] = useState(null);
  const [selectedFood, setSelectedFood] = useState(null);
  const [portion, setPortion] = useState(150);
  const [nutrients, setNutrients] = useState(null);
  const [imgPreview, setImgPreview] = useState(null);
  const [showAlternatives, setShowAlternatives] = useState(false);

  const handleFile = async (file) => {
    if (file) setImgPreview(URL.createObjectURL(file));
    setStage("predicting");
    const result = await predictFood(file);
    setPrediction(result);
    setSelectedFood(result.food);
    setStage("predicted");
  };

  const handleDemoImage = () => handleFile(null);

  const selectAlternative = (foodKey) => {
    setSelectedFood(foodKey);
    setNutrients(null);
    setStage("predicted");
  };

  const confirmPortion = async () => {
    const foodKeyToFetch = selectedFood || prediction?.food || "pongal";
    const n = await getNutrients(foodKeyToFetch, portion);
    setNutrients(n);
    setStage("nutrients");
  };

  const addToIntake = () => {
    onLogMeal({
      label: nutrients.label,
      iron: nutrients.iron,
      portion,
      nutrients: {
        ...nutrients,
        portion_g: portion,
        portion,
      },
      prediction,
    });
    setStage("upload");
    setPrediction(null);
    setSelectedFood(null);
    setNutrients(null);
  };

  const activeFoodKey = selectedFood || prediction?.food;
  const activeLabel = FOOD_DB[activeFoodKey]?.label || prediction?.food_name || activeFoodKey?.replace(/_/g, " ") || "Dish";

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <PastelBadge variant="blue">
              <Scan size={12} color={C.babyBlueDeep} />
              <span>Computer Vision Food AI</span>
            </PastelBadge>
            <PastelBadge variant="sage">80 Indian Classes</PastelBadge>
          </div>
          <H size="text-3xl">What's on your plate?</H>
        </div>
      </div>

      {stage === "upload" && (
        <Card hover>
          <label
            className="flex flex-col items-center justify-center gap-3.5 rounded-3xl py-16 cursor-pointer border-2 border-dashed transition-all duration-300 relative overflow-hidden group"
            style={{
              borderColor: C.babyBlueDeep,
              background: `radial-gradient(circle at center, ${C.babyBlueLight} 0%, ${C.cream} 100%)`,
            }}
          >
            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center shadow-md transition-transform duration-300 group-hover:scale-110"
              style={{ background: C.white, border: `1.5px solid ${C.babyBlue}` }}
            >
              <Upload size={26} color={C.babyBlueDeep} />
            </div>
            <div className="text-center">
              <span className="block text-base font-bold" style={{ color: C.plum }}>
                Upload or capture a food photo
              </span>
              <span className="block text-xs mt-1" style={{ color: C.plumMuted }}>
                JPG, PNG or photo capture · Evaluated across 80 trained Indian dishes
              </span>
            </div>
          </label>

          <div className="flex justify-center mt-5">
            <button
              onClick={handleDemoImage}
              type="button"
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold shadow-sm transition-all hover:scale-105 active:scale-95"
              style={{ background: C.butterLight, border: `1.5px solid ${C.butter}`, color: C.plum }}
            >
              <Camera size={14} color={C.butterDeep} />
              <span>Use demo photo (Pongal)</span>
            </button>
          </div>
        </Card>
      )}

      {stage === "predicting" && (
        <Card style={{ textAlign: "center" }}>
          <div className="py-14 flex flex-col items-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 shadow-sm animate-pulse-glow" style={{ background: C.lavenderLight, border: `1px solid ${C.lavender}` }}>
              <Sparkles size={28} color={C.lavenderDeep} />
            </div>
            <H size="text-xl">Running EfficientNet-B0 Food Classifier…</H>
            <Body className="text-xs mt-2 max-w-sm" style={{ color: C.plumMuted }}>
              Extracting feature embeddings and matching across 80 Indian cuisine categories
            </Body>
          </div>
        </Card>
      )}

      {(stage === "predicted" || stage === "nutrients") && prediction && (
        <>
          <Card hover>
            <div className="flex gap-4 items-center">
              <div
                className="w-24 h-24 rounded-2xl flex items-center justify-center shrink-0 overflow-hidden shadow-inner"
                style={{ background: C.babyBlueLight, border: `1px solid ${C.babyBlue}` }}
              >
                {imgPreview ? (
                  <img src={imgPreview} alt="upload preview" className="w-full h-full object-cover" />
                ) : (
                  <Utensils size={28} color={C.babyBlueDeep} />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <PastelBadge variant="blush">Top Model Prediction</PastelBadge>
                  <PastelBadge variant="blue">{prediction.confidence}% confidence</PastelBadge>
                </div>
                <div style={{ fontFamily: FONT_HEAD, fontSize: 26, color: C.plum, fontWeight: 700 }}>
                  {activeLabel}
                </div>
                <Body className="text-xs mt-0.5" style={{ color: C.plumMuted }}>
                  Architecture: {prediction.model_version || "EfficientNet-B0 (80 Indian Classes)"}
                </Body>
              </div>
            </div>

            {/* Top-5 Alternative Candidates */}
            {prediction.alternatives && prediction.alternatives.length > 0 && (
              <div className="mt-5 pt-4 border-t" style={{ borderColor: C.line }}>
                <button
                  type="button"
                  onClick={() => setShowAlternatives(!showAlternatives)}
                  className="flex items-center justify-between w-full text-xs font-bold"
                  style={{ color: C.plumSoft }}
                >
                  <span className="flex items-center gap-1.5">
                    <span>Other Top-5 Candidate Predictions</span>
                    <PastelBadge variant="butter">{prediction.alternatives.length + 1} options</PastelBadge>
                  </span>
                  {showAlternatives ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                </button>

                {showAlternatives && (
                  <div className="space-y-2 mt-3.5">
                    <div
                      onClick={() => selectAlternative(prediction.food)}
                      className="flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all"
                      style={{
                        background: activeFoodKey === prediction.food ? C.blushLight : C.cream,
                        border: `1.5px solid ${activeFoodKey === prediction.food ? C.blushDeep : C.line}`,
                      }}
                    >
                      <span className="text-xs font-bold" style={{ color: C.plum }}>
                        {prediction.food_name || prediction.food.replace(/_/g, " ")} (Top 1)
                      </span>
                      <span className="text-xs font-bold" style={{ color: C.blushDeep }}>
                        {prediction.confidence}% {activeFoodKey === prediction.food && "✓ Active Selection"}
                      </span>
                    </div>

                    {prediction.alternatives.map((alt) => {
                      const altKey = alt.food.toLowerCase().replace(/ /g, "_");
                      const isSelected = activeFoodKey === altKey || activeFoodKey === alt.food;
                      return (
                        <div
                          key={alt.food}
                          onClick={() => selectAlternative(altKey)}
                          className="flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all"
                          style={{
                            background: isSelected ? C.blushLight : C.cream,
                            border: `1.5px solid ${isSelected ? C.blushDeep : C.line}`,
                          }}
                        >
                          <span className="text-xs font-medium" style={{ color: C.plum }}>
                            {alt.food_name || alt.food.replace(/_/g, " ")}
                          </span>
                          <span className="text-xs font-semibold" style={{ color: C.lavenderDeep }}>
                            {alt.confidence}% {isSelected && "✓ Active Selection"}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </Card>

          <Card hover>
            <div className="flex items-center justify-between mb-2">
              <Eyebrow color={C.peachDeep}>Portion Calibration</Eyebrow>
              <PastelBadge variant="peach">{portion} grams</PastelBadge>
            </div>
            <div className="flex items-center gap-4 mt-2">
              <input
                type="range"
                min={50}
                max={400}
                step={10}
                value={portion}
                onChange={(e) => setPortion(+e.target.value)}
                className="flex-1"
              />
              <div style={{ fontFamily: FONT_HEAD, fontSize: 22, color: C.plum, fontWeight: 700, minWidth: 70, textAlign: "right" }}>
                {portion} g
              </div>
            </div>
            {stage === "predicted" && (
              <div className="mt-5">
                <PrimaryButton onClick={confirmPortion} icon={ChevronRight} full variant="rose">
                  Calculate IFCT Nutrients for {portion}g
                </PrimaryButton>
              </div>
            )}
          </Card>

          {stage === "nutrients" && nutrients && (
            <Card hover>
              <div className="flex justify-between items-center mb-2">
                <Eyebrow color={C.blushDeep}>Nutritional Composition ({portion}g Portion)</Eyebrow>
                <PastelBadge variant="sage">{nutrients.iron_type || "Non-Heme"}</PastelBadge>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-3">
                <NutrientCell
                  label="Dietary Iron"
                  value={`${nutrients.iron} mg`}
                  subtext={`Base: ${(nutrients.iron / (portion / 100)).toFixed(1)} mg / 100g`}
                  variant="blush"
                  highlight
                />
                <NutrientCell
                  label="Vitamin C (Enhancer)"
                  value={`${nutrients.vitaminC} mg`}
                  subtext={`Base: ${(nutrients.vitaminC / (portion / 100)).toFixed(1)} mg / 100g`}
                  variant="sage"
                />
                <NutrientCell
                  label="Calcium (Inhibitor)"
                  value={`${nutrients.calcium} mg`}
                  subtext={`Base: ${(nutrients.calcium / (portion / 100)).toFixed(0)} mg / 100g`}
                  variant="butter"
                />
                <NutrientCell
                  label="Protein"
                  value={`${nutrients.protein} g`}
                  subtext={`Energy: ${nutrients.energy} kcal`}
                  variant="blue"
                />
              </div>

              {/* Data Citation & Academic Transparency */}
              <div className="mt-4 p-3.5 rounded-2xl text-xs space-y-1.5" style={{ background: C.cream, border: `1px solid ${C.line}`, color: C.plumSoft }}>
                <div>
                  <strong style={{ color: C.plum }}>Data Source:</strong> {nutrients.sourceType || "Composite Recipe Estimation (IFCT 2017 Ingredients)"}
                </div>
                {nutrients.notes && <div className="text-[11px]">{nutrients.notes}</div>}
                <div className="font-mono text-[11px] pt-1" style={{ color: C.lavenderDeep }}>
                  Formula: {nutrients.iron} mg iron = {(nutrients.iron / (portion / 100)).toFixed(1)} mg/100g × ({portion}g / 100)
                </div>
              </div>

              <div className="mt-5">
                <PrimaryButton onClick={addToIntake} icon={Plus} full variant="rose">
                  Add to Daily Log & Evaluate Absorption
                </PrimaryButton>
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
