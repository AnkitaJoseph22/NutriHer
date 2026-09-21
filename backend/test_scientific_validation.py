"""
NutriHer Comprehensive Scientific & Mathematical Validation Test Suite
======================================================================
Automated verification of:
1. ICMR-NIN 2020 lifecycle RDA & EAR bracket thresholds
2. Basal obligatory iron loss (0.80 mg/day) derivation
3. Menstrual blood-loss increments and flow multipliers
4. 28-Day cycle mathematical integration & average daily requirement
5. Bioavailability tiers (8% Indian plant, 12% pregnancy, 14% mixed, 25% heme)
6. Modulator heuristics (Vitamin C +2%/+5%, Calcium -2%) and biological clamping
7. IFCT 2017 portion scaling and nutrient retrieval
"""

import sys
import os
import unittest

# Ensure NutriHer root is on sys.path
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(CURRENT_DIR)
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

from backend.cycle import calculate_cycle_phase, calculate_dynamic_iron_target
from backend.absorption import calculate_absorption
from backend.nutrition import get_nutrition_data, NUTRITION_DATABASE, normalize_food_key
from backend.model import predict_food_image


class TestNutriHerScientificValidation(unittest.TestCase):

    def test_01_lifecycle_age_brackets_icmr_2020(self):
        """Test ICMR-NIN 2020 RDA & EAR alignment across all published age brackets."""
        # 1. Adolescent Girls 10-12 yrs: 16 mg RDA, 11 mg EAR
        res_11 = calculate_dynamic_iron_target({"age": 11})
        self.assertEqual(res_11["official_baseline_rda_mg"], 16.0)
        self.assertEqual(res_11["official_ear_mg"], 11.0)
        self.assertEqual(res_11["age_category"], "Adolescent Girls (10–12 years)")

        # 2. Adolescent Girls 13-15 yrs: 29 mg RDA, 16.5 mg EAR
        res_14 = calculate_dynamic_iron_target({"age": 14})
        self.assertEqual(res_14["official_baseline_rda_mg"], 29.0)
        self.assertEqual(res_14["official_ear_mg"], 16.5)
        self.assertEqual(res_14["age_category"], "Adolescent Girls (13–15 years)")

        # 3. Adolescent Girls 16-17 yrs: 26 mg RDA, 15 mg EAR
        res_17 = calculate_dynamic_iron_target({"age": 17})
        self.assertEqual(res_17["official_baseline_rda_mg"], 26.0)
        self.assertEqual(res_17["official_ear_mg"], 15.0)
        self.assertEqual(res_17["age_category"], "Adolescent Girls (16–17 years)")

        # 4. Adult Reproductive 18-59 yrs: 29 mg RDA, 15 mg EAR
        res_25 = calculate_dynamic_iron_target({"age": 25})
        self.assertEqual(res_25["official_baseline_rda_mg"], 29.0)
        self.assertEqual(res_25["official_ear_mg"], 15.0)
        self.assertEqual(res_25["age_category"], "Adult Reproductive-Age Women (18–59 years)")

        # 5. Older / Post-Menopausal 60+ yrs: 15 mg RDA, 11 mg EAR
        res_65 = calculate_dynamic_iron_target({"age": 65})
        self.assertEqual(res_65["official_baseline_rda_mg"], 15.0)
        self.assertEqual(res_65["official_ear_mg"], 11.0)
        self.assertIn("Post-Menopausal", res_65["age_category"])

    def test_02_special_lifecycle_modes(self):
        """Test Pregnancy, Lactation, and Post-Menopausal explicit overrides."""
        # Pregnancy: 27 mg dietary RDA, 12% bioavailability, 3.24 mg absorbed need
        res_preg = calculate_dynamic_iron_target({
            "age": 25,
            "lifecycle_status": "Pregnant"
        })
        self.assertEqual(res_preg["official_baseline_rda_mg"], 27.0)
        self.assertEqual(res_preg["official_ear_mg"], 21.0)
        self.assertEqual(res_preg["bioavailability_pct"], 12.0)
        self.assertEqual(res_preg["total_modelled_absorbed_need_mg"], 3.24)
        self.assertEqual(res_preg["phase_loss_increment_mg"], 0.0)
        self.assertEqual(res_preg["modelled_dietary_target_mg"], 27.0)

        # Lactation: 23 mg dietary RDA, 8% bioavailability, 1.84 mg absorbed need
        res_lact = calculate_dynamic_iron_target({
            "age": 26,
            "lifecycle_status": "Lactating"
        })
        self.assertEqual(res_lact["official_baseline_rda_mg"], 23.0)
        self.assertEqual(res_lact["official_ear_mg"], 16.0)
        self.assertEqual(res_lact["bioavailability_pct"], 8.0)
        self.assertEqual(res_lact["total_modelled_absorbed_need_mg"], 1.84)
        self.assertEqual(res_lact["modelled_dietary_target_mg"], 23.0)

        # Post-Menopausal mode: 15 mg dietary RDA, 8% bioavailability, 1.20 mg absorbed need
        res_post = calculate_dynamic_iron_target({
            "age": 52,
            "lifecycle_status": "Post-Menopausal"
        })
        self.assertEqual(res_post["official_baseline_rda_mg"], 15.0)
        self.assertEqual(res_post["official_ear_mg"], 11.0)
        self.assertEqual(res_post["bioavailability_pct"], 8.0)
        self.assertEqual(res_post["total_modelled_absorbed_need_mg"], 1.20)
        self.assertEqual(res_post["modelled_dietary_target_mg"], 15.0)

    def test_03_basal_loss_and_phase_increments(self):
        """Verify basal obligatory loss and phase increments across flow intensities."""
        # Basal loss must be 0.80 mg/day (Green et al. 14 ug/kg/day * 55 kg = 0.77 ~ 0.80 mg)
        res_base = calculate_dynamic_iron_target({"age": 23}, {"phase": "Follicular"})
        self.assertEqual(res_base["basal_absorbed_need_mg"], 0.80)
        self.assertIn("standardized reference benchmark", res_base["basal_loss_source"])
        self.assertIn("not an individualized measurement scaled by user body weight", res_base["basal_loss_source"])

        # Menstruation moderate: 0.80 + 1.90 = 2.70 mg absorbed -> 2.70 / 0.08 = 33.8 mg dietary
        res_m_mod = calculate_dynamic_iron_target({"age": 23, "intensity": "Moderate"}, {"phase": "Menstruation"})
        self.assertEqual(res_m_mod["phase_loss_increment_mg"], 1.90)
        self.assertEqual(res_m_mod["total_modelled_absorbed_need_mg"], 2.70)
        self.assertEqual(res_m_mod["modelled_dietary_target_mg"], 33.8)

        # Menstruation heavy (1.35x): 0.80 + 1.90 * 1.35 = 0.80 + 2.565 = 3.365 ~ 3.37 mg -> 3.365 / 0.08 = 42.1 mg dietary
        res_m_hvy = calculate_dynamic_iron_target({"age": 23, "intensity": "Heavy"}, {"phase": "Menstruation"})
        self.assertAlmostEqual(res_m_hvy["phase_loss_increment_mg"], 2.565, places=2)
        self.assertEqual(res_m_hvy["total_modelled_absorbed_need_mg"], 3.37)
        self.assertEqual(res_m_hvy["modelled_dietary_target_mg"], 42.1)

        # Menstruation light (0.75x): 0.80 + 1.90 * 0.75 = 0.80 + 1.425 = 2.225 ~ 2.23 mg -> 27.8 mg dietary
        res_m_lgt = calculate_dynamic_iron_target({"age": 23, "intensity": "Light"}, {"phase": "Menstruation"})
        self.assertAlmostEqual(res_m_lgt["total_modelled_absorbed_need_mg"], 2.23, places=1)
        self.assertEqual(res_m_lgt["modelled_dietary_target_mg"], 27.8)

        # Follicular moderate: 0.80 + 0.90 = 1.70 mg absorbed -> 1.70 / 0.08 = 21.2 mg dietary
        res_foll = calculate_dynamic_iron_target({"age": 23, "intensity": "Moderate"}, {"phase": "Follicular"})
        self.assertEqual(res_foll["phase_loss_increment_mg"], 0.90)
        self.assertEqual(res_foll["total_modelled_absorbed_need_mg"], 1.70)
        self.assertEqual(res_foll["modelled_dietary_target_mg"], 21.2)

        # Ovulation moderate: 0.80 + 0.40 = 1.20 mg absorbed -> 1.20 / 0.08 = 15.0 mg dietary
        res_ovul = calculate_dynamic_iron_target({"age": 23, "intensity": "Moderate"}, {"phase": "Ovulation"})
        self.assertEqual(res_ovul["phase_loss_increment_mg"], 0.40)
        self.assertEqual(res_ovul["total_modelled_absorbed_need_mg"], 1.20)
        self.assertEqual(res_ovul["modelled_dietary_target_mg"], 15.0)

        # Luteal moderate: 0.80 + 0.60 = 1.40 mg absorbed -> 1.40 / 0.08 = 17.5 mg dietary
        res_lute = calculate_dynamic_iron_target({"age": 23, "intensity": "Moderate"}, {"phase": "Luteal"})
        self.assertEqual(res_lute["phase_loss_increment_mg"], 0.60)
        self.assertEqual(res_lute["total_modelled_absorbed_need_mg"], 1.40)
        self.assertEqual(res_lute["modelled_dietary_target_mg"], 17.5)

    def test_04_28_day_cycle_mathematical_integration(self):
        """
        Verify the 28-day cycle integration:
        - 5 days Menstruation (2.70 mg absorbed)
        - 8 days Follicular (1.70 mg absorbed)
        - 3 days Ovulation (1.20 mg absorbed)
        - 12 days Luteal (1.40 mg absorbed)
        Total absorbed = 47.50 mg -> Average daily absorbed = 1.696 mg/day -> At 8% = 21.21 mg/day.
        Confirm it is correctly documented and not falsely claimed as averaging 29 mg.
        """
        m_absorbed = 0.80 + 1.90   # 2.70 mg
        f_absorbed = 0.80 + 0.90   # 1.70 mg
        o_absorbed = 0.80 + 0.40   # 1.20 mg
        l_absorbed = 0.80 + 0.60   # 1.40 mg

        cycle_28_absorbed_sum = (5 * m_absorbed) + (8 * f_absorbed) + (3 * o_absorbed) + (12 * l_absorbed)
        self.assertAlmostEqual(cycle_28_absorbed_sum, 47.50, places=2)

        avg_daily_absorbed = cycle_28_absorbed_sum / 28.0
        self.assertAlmostEqual(avg_daily_absorbed, 1.6964, places=3)

        avg_daily_dietary_8pct = avg_daily_absorbed / 0.08
        self.assertAlmostEqual(avg_daily_dietary_8pct, 21.205, places=2)

        # Check documentation note in returned target object
        res = calculate_dynamic_iron_target({"age": 23})
        self.assertIn("21.2 mg/day", res["cycle_model_note"])
        self.assertIn("97.5th percentile", res["cycle_model_note"])

    def test_05_dietary_bioavailability_tiers(self):
        """Test dietary bioavailability factors: Vegetarian (8%), Non-veg/Mixed (14%), Egg (10%), Vegan (8%)."""
        # Vegetarian: 8%
        res_veg = calculate_dynamic_iron_target({"diet": "Vegetarian"}, {"phase": "Follicular"})
        self.assertEqual(res_veg["bioavailability_pct"], 8.0)
        self.assertEqual(res_veg["modelled_dietary_target_mg"], 21.2)
        self.assertIn("8% reference bioavailability assumption used by the ICMR-NIN framework", res_veg["bioavailability_source"])

        # Non-Vegetarian: 14%
        res_nonveg = calculate_dynamic_iron_target({"diet": "Non-Vegetarian"}, {"phase": "Follicular"})
        self.assertEqual(res_nonveg["bioavailability_pct"], 14.0)
        self.assertEqual(res_nonveg["modelled_dietary_target_mg"], 12.1)
        self.assertIn("FAO/WHO (2004) Chapter 13", res_nonveg["bioavailability_source"])

        # Eggetarian: 10%
        res_egg = calculate_dynamic_iron_target({"diet": "Eggetarian"}, {"phase": "Follicular"})
        self.assertEqual(res_egg["bioavailability_pct"], 10.0)
        self.assertEqual(res_egg["modelled_dietary_target_mg"], 17.0)

        # Vegan: 8%
        res_vegan = calculate_dynamic_iron_target({"diet": "Vegan"}, {"phase": "Follicular"})
        self.assertEqual(res_vegan["bioavailability_pct"], 8.0)
        self.assertEqual(res_vegan["modelled_dietary_target_mg"], 21.2)

    def test_06_absorption_modulators_and_clamping(self):
        """Test absorption calculation, Vitamin C and Calcium modulators, and boundary clamping."""
        # Non-heme baseline: pongal (plant-based, ~8% baseline)
        abs_base = calculate_absorption(
            food_name="pongal",
            portion_grams=100.0,
            iron_mg=2.0,
            vitamin_c_mg=0.0,
            calcium_mg=20.0,
            iron_type="non-heme",
        )
        self.assertEqual(abs_base["absorption_rate_percent"], 8.0)
        self.assertEqual(abs_base["estimated_absorbed_iron_mg"], 0.16)

        # Moderate Vitamin C (> 5 mg): +2% -> 10.0%
        abs_vitc_mod = calculate_absorption(
            food_name="pongal",
            portion_grams=100.0,
            iron_mg=2.0,
            vitamin_c_mg=10.0,
            calcium_mg=20.0,
            iron_type="non-heme",
        )
        self.assertEqual(abs_vitc_mod["absorption_rate_percent"], 10.0)

        # High Vitamin C (> 20 mg): +5% -> 13.0%
        abs_vitc_hi = calculate_absorption(
            food_name="pongal",
            portion_grams=100.0,
            iron_mg=2.0,
            vitamin_c_mg=30.0,
            calcium_mg=20.0,
            iron_type="non-heme",
        )
        self.assertEqual(abs_vitc_hi["absorption_rate_percent"], 13.0)

        # High Calcium (> 150 mg): -2% -> 6.0%
        abs_ca_hi = calculate_absorption(
            food_name="paneer masala",
            portion_grams=100.0,
            iron_mg=2.0,
            vitamin_c_mg=0.0,
            calcium_mg=250.0,
            iron_type="non-heme",
        )
        self.assertEqual(abs_ca_hi["absorption_rate_percent"], 6.0)

        # Non-heme minimum biological clamp: base 8% - 2% (Ca) = 6%, if we simulate extreme inhibition -> clamped >= 3.0%
        abs_clamped_low = calculate_absorption(
            food_name="paneer masala",
            portion_grams=100.0,
            iron_mg=2.0,
            vitamin_c_mg=0.0,
            calcium_mg=1000.0,
            iron_type="non-heme",
        )
        self.assertGreaterEqual(abs_clamped_low["absorption_rate_percent"], 3.0)

        # Non-heme maximum biological clamp: clamped <= 18.0%
        abs_clamped_hi = calculate_absorption(
            food_name="pongal",
            portion_grams=100.0,
            iron_mg=2.0,
            vitamin_c_mg=500.0,
            calcium_mg=0.0,
            iron_type="non-heme",
        )
        self.assertLessEqual(abs_clamped_hi["absorption_rate_percent"], 18.0)

        # Heme baseline (25%) and bounds (15% to 35%)
        abs_heme = calculate_absorption(
            food_name="biryani",
            portion_grams=100.0,
            iron_mg=3.0,
            vitamin_c_mg=0.0,
            calcium_mg=20.0,
            iron_type="heme",
        )
        self.assertEqual(abs_heme["absorption_rate_percent"], 25.0)
        self.assertGreaterEqual(abs_heme["absorption_rate_percent"], 15.0)
        self.assertLessEqual(abs_heme["absorption_rate_percent"], 35.0)

    def test_07_nutrition_portion_scaling_ifct(self):
        """Verify IFCT 2017 portion scaling arithmetic and database validity."""
        self.assertGreater(len(NUTRITION_DATABASE), 10)

        p100 = get_nutrition_data("pongal", portion_grams=100.0)
        p200 = get_nutrition_data("pongal", portion_grams=200.0)

        self.assertAlmostEqual(p200["iron"], p100["iron"] * 2.0, places=1)
        self.assertAlmostEqual(p200["protein"], p100["protein"] * 2.0, places=1)
        self.assertAlmostEqual(p200["energy"], p100["energy"] * 2.0, places=1)
        self.assertAlmostEqual(p200["calcium"], p100["calcium"] * 2.0, places=1)

    def test_08_phase_flow_multipliers_monotonicity(self):
        """
        Phase 9 Audit: Verify Light (0.75), Moderate (1.00), and Heavy (1.35) multipliers
        across every menstrual phase. Verify strict monotonicity and biologically reasonable outputs.
        """
        phases = ["Menstruation", "Follicular", "Ovulation", "Luteal"]
        intensities = ["Light", "Moderate", "Heavy"]

        # 1. Menstruation phase tests
        m_light = calculate_dynamic_iron_target({"intensity": "Light"}, {"phase": "Menstruation"})
        m_mod = calculate_dynamic_iron_target({"intensity": "Moderate"}, {"phase": "Menstruation"})
        m_heavy = calculate_dynamic_iron_target({"intensity": "Heavy"}, {"phase": "Menstruation"})

        self.assertEqual(m_light["modelled_dietary_target_mg"], 27.8)
        self.assertEqual(m_mod["modelled_dietary_target_mg"], 33.8)
        self.assertEqual(m_heavy["modelled_dietary_target_mg"], 42.1)
        self.assertTrue(m_light["modelled_dietary_target_mg"] < m_mod["modelled_dietary_target_mg"] < m_heavy["modelled_dietary_target_mg"])

        # 2. Follicular phase tests
        f_light = calculate_dynamic_iron_target({"intensity": "Light"}, {"phase": "Follicular"})
        f_mod = calculate_dynamic_iron_target({"intensity": "Moderate"}, {"phase": "Follicular"})
        f_heavy = calculate_dynamic_iron_target({"intensity": "Heavy"}, {"phase": "Follicular"})

        self.assertEqual(f_light["modelled_dietary_target_mg"], 18.5)
        self.assertEqual(f_mod["modelled_dietary_target_mg"], 21.2)
        self.assertEqual(f_heavy["modelled_dietary_target_mg"], 25.2)
        self.assertTrue(f_light["modelled_dietary_target_mg"] < f_mod["modelled_dietary_target_mg"] < f_heavy["modelled_dietary_target_mg"])

        # 3. Mid-cycle (Ovulation & Luteal) baseline stability
        o_mod = calculate_dynamic_iron_target({"intensity": "Moderate"}, {"phase": "Ovulation"})
        l_mod = calculate_dynamic_iron_target({"intensity": "Moderate"}, {"phase": "Luteal"})
        self.assertEqual(o_mod["modelled_dietary_target_mg"], 15.0)  # Matches 15 mg ICMR EAR
        self.assertEqual(l_mod["modelled_dietary_target_mg"], 17.5)

        # 4. Verify no phase/intensity combo produces negative or extreme targets (> 60 mg)
        for ph in phases:
            for it in intensities:
                res = calculate_dynamic_iron_target({"intensity": it}, {"phase": ph})
                target = res["modelled_dietary_target_mg"]
                self.assertGreater(target, 10.0, f"Target too low for {ph} / {it}: {target}")
                self.assertLess(target, 50.0, f"Target extreme for {ph} / {it}: {target}")

    def test_09_phase_11_mathematical_validation_and_edge_cases(self):
        """
        Phase 11 Mathematical Validation:
        - Absorbed Iron = Dietary Iron * Assumed Bioavailability
        - Modelled Dietary Target = Modelled Absorbed Need / Assumed Bioavailability
        - Exact user test: 2.70 mg * 0.081 = 0.2187 ~ 0.22 mg absorbed
        - Edge cases: zero values, missing values, large values, negative values, 8 vs 0.08 bioavailability.
        """
        # 1. Exact mathematical relationship: Dietary iron 2.70 mg at 8.1% bioavailability
        dietary_fe = 2.70
        bioavailability = 0.081
        calculated_absorbed = round(dietary_fe * bioavailability, 3)
        self.assertEqual(calculated_absorbed, 0.219)
        self.assertEqual(round(calculated_absorbed, 2), 0.22)

        # 2. Dietary target division: Absorbed need 2.70 mg / 0.08 bioavailability
        absorbed_need = 2.70
        target = round(absorbed_need / 0.08, 1)
        self.assertEqual(target, 33.8)

        # 3. Zero values in absorption engine
        res_zero = calculate_absorption(food_name="pongal", portion_grams=0.0, iron_mg=0.0)
        self.assertEqual(res_zero["iron_consumed_mg"], 0.0)
        self.assertEqual(res_zero["estimated_absorbed_iron_mg"], 0.0)

        # 4. Missing / None values in absorption engine
        res_none = calculate_absorption(food_name="pongal", portion_grams=100.0, iron_mg=None, vitamin_c_mg=None, calcium_mg=None)
        self.assertGreater(res_none["iron_consumed_mg"], 0.0)
        self.assertGreater(res_none["estimated_absorbed_iron_mg"], 0.0)

        # 5. Very large values (500 mg iron input)
        res_large = calculate_absorption(food_name="pongal", portion_grams=100.0, iron_mg=500.0)
        self.assertEqual(res_large["iron_consumed_mg"], 500.0)
        self.assertEqual(res_large["estimated_absorbed_iron_mg"], 40.0)  # 500 * 0.08 = 40.0 mg

        # 6. Invalid negative values: safely clamped to 0.0
        res_neg = calculate_absorption(food_name="pongal", portion_grams=-100.0, iron_mg=-5.0, vitamin_c_mg=-10.0, calcium_mg=-50.0)
        self.assertEqual(res_neg["iron_consumed_mg"], 0.0)
        self.assertEqual(res_neg["estimated_absorbed_iron_mg"], 0.0)

        # 7. Bioavailability percentage entered as 8 vs 0.08
        res_pct_8 = calculate_dynamic_iron_target({"bioavailability": 8}, {"phase": "Follicular"})
        res_dec_008 = calculate_dynamic_iron_target({"bioavailability": 0.08}, {"phase": "Follicular"})
        self.assertEqual(res_pct_8["bioavailability_pct"], 8.0)
        self.assertEqual(res_dec_008["bioavailability_pct"], 8.0)
        self.assertEqual(res_pct_8["modelled_dietary_target_mg"], res_dec_008["modelled_dietary_target_mg"])

        # 8. Post-menopausal test: must be 15.0 mg official RDA, not 0.80 / 0.08 = 10 mg fake value
        res_post = calculate_dynamic_iron_target({"age": 62, "lifecycle_status": "Post-Menopausal"})
        self.assertEqual(res_post["official_baseline_rda_mg"], 15.0)
        self.assertEqual(res_post["modelled_dietary_target_mg"], 15.0)
        self.assertNotEqual(res_post["modelled_dietary_target_mg"], 10.0)

    def test_10_phase_12_edge_cases(self):
        """
        Phase 12 Comprehensive Edge Case Testing:
        - Ages: 13, 17, 18, 19, 59, 60, 65
        - Cycle Days: Day 1, Day 5, Day 14, Day 15, Day 21, Day 28, Day 29
        - Flow: Light, Moderate, Heavy
        - Diet: Vegetarian, Vegan, Mixed/Non-vegetarian
        - Pregnancy: Yes/No
        - Lactation: 0-6m, 7-12m
        Verify no crashes, NaN, infinity, or negative targets.
        """
        # 1. Age thresholds test
        expected_rdas = {
            13: 29.0,
            17: 26.0,
            18: 29.0,
            19: 29.0,
            59: 29.0,
            60: 15.0,
            65: 15.0,
        }
        for test_age, exp_rda in expected_rdas.items():
            res = calculate_dynamic_iron_target({"age": test_age})
            self.assertEqual(res["official_baseline_rda_mg"], exp_rda, f"Failed at age {test_age}")
            self.assertGreater(res["modelled_dietary_target_mg"], 0.0)

        # 2. Cycle day boundaries test (from Last Period Date offset)
        from datetime import date, timedelta
        today = date.today()
        test_days = [1, 5, 14, 15, 21, 28, 29]
        for d in test_days:
            # diff_days = d - 1
            lpd = (today - timedelta(days=d - 1)).isoformat()
            cycle_res = calculate_cycle_phase(lpd, cycle_length=28, period_length=5)
            self.assertIn("phase", cycle_res)
            self.assertIn(cycle_res["phase"], ["Menstruation", "Follicular", "Ovulation", "Luteal"])
            self.assertGreaterEqual(cycle_res["day"], 1)
            self.assertLessEqual(cycle_res["day"], 28)

        # 3. Diet options test
        for diet_choice in ["Vegetarian", "Vegan", "Mixed", "Non-Vegetarian"]:
            res = calculate_dynamic_iron_target({"diet": diet_choice})
            self.assertGreater(res["bioavailability_pct"], 0.0)
            self.assertGreater(res["modelled_dietary_target_mg"], 0.0)

        # 4. Pregnancy and Lactation transitions
        preg = calculate_dynamic_iron_target({"lifecycle_status": "Pregnant"})
        self.assertEqual(preg["official_baseline_rda_mg"], 27.0)
        self.assertEqual(preg["phase_loss_increment_mg"], 0.0)

        lact_0_6 = calculate_dynamic_iron_target({"lifecycle_status": "Lactating (0–6 months)"})
        self.assertEqual(lact_0_6["official_baseline_rda_mg"], 23.0)
        self.assertEqual(lact_0_6["phase_loss_increment_mg"], 0.0)

        lact_7_12 = calculate_dynamic_iron_target({"lifecycle_status": "Lactating (7–12 months)"})
        self.assertEqual(lact_7_12["official_baseline_rda_mg"], 23.0)
        self.assertEqual(lact_7_12["phase_loss_increment_mg"], 0.0)

    def test_11_phase_13_food_recognition_and_portion_scaling(self):
        """
        Phase 13 Food Recognition & Portion Scaling:
        - None/Empty image bytes returns graceful fallback
        - Corrupted bytes returns safe fallback with error key
        - All 80 classes map cleanly to NUTRITION_DATABASE
        - Portion scaling: 100g -> X, 150g -> 1.5X, 200g -> 2X, 0g -> 0.0.
        """
        # 1. Fallback predictions
        pred_empty = predict_food_image(None)
        self.assertIn("food", pred_empty)
        self.assertEqual(pred_empty["food"], "pongal")
        self.assertGreater(pred_empty["confidence"], 0.0)
        self.assertGreater(len(pred_empty["alternatives"]), 0)

        pred_corrupt = predict_food_image(b"this_is_corrupt_binary_data")
        self.assertIn("food", pred_corrupt)
        self.assertIn("error", pred_corrupt)

        # 2. Database mapping for 80 classes
        classes_path = os.path.join(PROJECT_ROOT, "training", "classes.json")
        if os.path.exists(classes_path):
            import json
            with open(classes_path, "r", encoding="utf-8") as f:
                classes = json.load(f)
            for c in classes:
                norm = normalize_food_key(c)
                self.assertIn(norm, NUTRITION_DATABASE, f"Class {c} ({norm}) missing from database")

        # 3. Portion scaling validation for 3 foods
        test_foods = ["pongal", "aloo gobi", "palak paneer"]
        for food in test_foods:
            d0 = get_nutrition_data(food, portion_grams=0.0)
            d100 = get_nutrition_data(food, portion_grams=100.0)
            d150 = get_nutrition_data(food, portion_grams=150.0)
            d200 = get_nutrition_data(food, portion_grams=200.0)

            # 0g portion = 0 iron
            self.assertEqual(d0["iron"], 0.0)
            self.assertEqual(d0["portion_g"], 0.0)

            # 150g portion = 1.5 * 100g
            self.assertAlmostEqual(d150["iron"], round(d100["iron"] * 1.5, 2), places=1)
            self.assertAlmostEqual(d150["protein"], round(d100["protein"] * 1.5, 1), places=1)

            # 200g portion = 2.0 * 100g
            self.assertAlmostEqual(d200["iron"], round(d100["iron"] * 2.0, 2), places=1)

    def test_12_phase_14_database_provenance(self):
        """
        Phase 14 Database Provenance:
        - Verify all items in NUTRITION_DATABASE have complete macronutrient, micronutrient,
          and authoritative source provenance fields.
        """
        self.assertGreater(len(NUTRITION_DATABASE), 20)
        required_fields = [
            "food_name",
            "iron_mg_per_100g",
            "iron_type",
            "vitamin_c_mg_per_100g",
            "calcium_mg_per_100g",
            "protein_g_per_100g",
            "energy_kcal_per_100g",
            "source_type",
        ]
        for key, item in NUTRITION_DATABASE.items():
            for field in required_fields:
                self.assertIn(field, item, f"Missing field '{field}' in food item '{key}'")
            self.assertGreaterEqual(item["iron_mg_per_100g"], 0.0)
            self.assertIn(item["iron_type"], ["heme", "non-heme"])
            self.assertGreater(len(item["source_type"]), 0)

    def test_13_authentication_and_session_flow(self):
        """
        Verify Authentication & User Session Lifecycle:
        - Demo login succeeds with standard profile
        - Password verification blocks invalid credentials
        - Registration creates and preserves custom profile parameters
        - Profile retrieval across session restores exact user values
        - Accounts listing excludes raw password hashes/strings
        """
        from fastapi.testclient import TestClient
        from backend.main import app
        client = TestClient(app)

        # 1. Demo login
        login_res = client.post("/auth/login", json={"email": "ananya@nutriher.ai", "password": "password123"})
        self.assertEqual(login_res.status_code, 200)
        data = login_res.json()
        self.assertEqual(data["status"], "ok")
        self.assertEqual(data["user"]["name"], "Ananya")
        self.assertIn("token", data)

        # 2. Incorrect password check
        bad_res = client.post("/auth/login", json={"email": "ananya@nutriher.ai", "password": "wrong_password"})
        self.assertEqual(bad_res.status_code, 200)
        bad_data = bad_res.json()
        self.assertEqual(bad_data["status"], "error")
        self.assertIn("Incorrect password", bad_data["message"])

        # 3. New user registration
        reg_res = client.post("/auth/register", json={
            "name": "Sunita",
            "email": "sunita@example.com",
            "password": "sunita_password",
            "age": 29,
            "diet": "Non-Vegetarian",
            "lifecycle_status": "Lactating",
        })
        self.assertEqual(reg_res.status_code, 200)
        reg_data = reg_res.json()
        self.assertEqual(reg_data["status"], "ok")
        self.assertEqual(reg_data["user"]["diet"], "Non-Vegetarian")
        self.assertEqual(reg_data["user"]["age"], 29)

        # 4. Subsequent login retrieves exact custom profile
        login_sunita = client.post("/auth/login", json={"email": "sunita@example.com", "password": "sunita_password"})
        self.assertEqual(login_sunita.status_code, 200)
        sunita_user = login_sunita.json()["user"]
        self.assertEqual(sunita_user["name"], "Sunita")
        self.assertEqual(sunita_user["age"], 29)
        self.assertEqual(sunita_user["lifecycle_status"], "Lactating")

        # 5. Accounts list contains no passwords
        accounts_res = client.get("/auth/accounts")
        self.assertEqual(accounts_res.status_code, 200)
        accounts = accounts_res.json()
        self.assertGreaterEqual(len(accounts), 2)
        for acc in accounts:
            self.assertNotIn("password", acc)

        # 6. Non-existent user login returns error
        no_user_res = client.post("/auth/login", json={"email": "nobody_exists@nutriher.ai", "password": "any"})
        self.assertEqual(no_user_res.status_code, 200)
        self.assertEqual(no_user_res.json()["status"], "error")
        self.assertIn("Account not found", no_user_res.json()["message"])

        # 7. Duplicate email registration returns error
        dup_res = client.post("/auth/register", json={"email": "sunita@example.com", "name": "Sunita 2"})
        self.assertEqual(dup_res.status_code, 200)
        self.assertEqual(dup_res.json()["status"], "error")
        self.assertIn("already exists", dup_res.json()["message"])


if __name__ == "__main__":
    suite = unittest.TestLoader().loadTestsFromTestCase(TestNutriHerScientificValidation)
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)
    sys.exit(0 if result.wasSuccessful() else 1)
