import { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

function calculateTargets(age, weight, height, gender, goal) {
  const heightM = height / 100;
  const bmi = weight / (heightM * heightM);

  let bmr = gender === "female"
    ? 10 * weight + 6.25 * height - 5 * age - 161
    : 10 * weight + 6.25 * height - 5 * age + 5;

  let calories =
    goal === "lose_weight"    ? bmr * 1.2 * 0.85 :
    goal === "build_muscle"   ? bmr * 1.4 * 1.1  :
    bmr * 1.3;

  return {
    bmi:           parseFloat(bmi.toFixed(1)),
    daily_calories: Math.round(calories),
    daily_protein:  parseFloat((weight * 0.8).toFixed(1)),
    daily_fibre:    gender === "female" ? 25 : 38,
    daily_iron:     gender === "female" && age < 50 ? 18 : 8,
    daily_calcium:  age < 50 ? 1000 : 1200,
    daily_vitamin_d: 600,
  };
}

export default function Profile() {
  const navigate = useNavigate();
  const [age, setAge]       = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [gender, setGender] = useState("female");
  const [goal, setGoal]     = useState("stay_healthy");
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState("");

  const preview = age && weight && height
    ? calculateTargets(+age, +weight, +height, gender, goal)
    : null;

  const handleSave = async () => {
    if (!age || !weight || !height) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    setError("");

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError("Not logged in.");
      setLoading(false);
      return;
    }

    const targets = calculateTargets(+age, +weight, +height, gender, goal);

    const { error } = await supabase
      .from("users")
      .update({
        age: +age, weight: +weight, height: +height,
        gender, health_goal: goal, ...targets
      })
      .eq("id", user.id);

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setLoading(false);
    navigate("/dashboard");
  };

  return (
    <div className="page-wrapper">

      <div className="page-header">
        <div>
          <div className="page-header-title">Your Profile</div>
          <div className="page-header-subtitle">We'll calculate your personal nutrition targets</div>
        </div>
      </div>

      <div className="profile-form card">

        <label className="input-label">Age</label>
        <input
          className="input"
          type="number"
          placeholder="e.g. 21"
          value={age}
          onChange={e => setAge(e.target.value)}
        />

        <div className="profile-two-col">
          <div>
            <label className="input-label">Weight (kg)</label>
            <input
              className="input"
              type="number"
              placeholder="e.g. 58"
              value={weight}
              onChange={e => setWeight(e.target.value)}
            />
          </div>
          <div>
            <label className="input-label">Height (cm)</label>
            <input
              className="input"
              type="number"
              placeholder="e.g. 162"
              value={height}
              onChange={e => setHeight(e.target.value)}
            />
          </div>
        </div>

        <label className="input-label">Gender</label>
        <select className="input" value={gender} onChange={e => setGender(e.target.value)}>
          <option value="female">Female</option>
          <option value="male">Male</option>
          <option value="other">Other</option>
        </select>

        <label className="input-label">Health Goal</label>
        <select className="input" value={goal} onChange={e => setGoal(e.target.value)}>
          <option value="lose_weight">Lose Weight</option>
          <option value="build_muscle">Build Muscle</option>
          <option value="stay_healthy">Stay Healthy</option>
          <option value="manage_condition">Manage a Condition (Diabetes / PCOS)</option>
        </select>

        {preview && (
          <div className="targets-preview">
            <p className="targets-label">Your daily targets</p>
            <div className="targets-grid">
              <div className="nutrient-pill">
                <span className="nutrient-pill-value" style={{ color: "var(--color-calories)" }}>
                  {preview.daily_calories}
                </span>
                <span className="nutrient-pill-label">kcal</span>
              </div>
              <div className="nutrient-pill">
                <span className="nutrient-pill-value" style={{ color: "var(--color-protein)" }}>
                  {preview.daily_protein}g
                </span>
                <span className="nutrient-pill-label">Protein</span>
              </div>
              <div className="nutrient-pill">
                <span className="nutrient-pill-value" style={{ color: "var(--color-iron)" }}>
                  {preview.daily_iron}mg
                </span>
                <span className="nutrient-pill-label">Iron</span>
              </div>
              <div className="nutrient-pill">
                <span className="nutrient-pill-value" style={{ color: "var(--color-calcium)" }}>
                  {preview.daily_calcium}mg
                </span>
                <span className="nutrient-pill-label">Calcium</span>
              </div>
              <div className="nutrient-pill">
                <span className="nutrient-pill-value" style={{ color: "var(--color-vitamin-d)" }}>
                  {preview.daily_vitamin_d} IU
                </span>
                <span className="nutrient-pill-label">Vit D</span>
              </div>
              <div className="nutrient-pill">
                <span className="nutrient-pill-value" style={{ color: "var(--color-fibre)" }}>
                  {preview.daily_fibre}g
                </span>
                <span className="nutrient-pill-label">Fibre</span>
              </div>
            </div>
            <p className="bmi-note">BMI: <strong>{preview.bmi}</strong></p>
          </div>
        )}

        {error && <div className="auth-error">{error}</div>}

        <button
          className="btn-primary btn-full"
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? <span className="spinner" /> : "Save & Continue →"}
        </button>

      </div>
    </div>
  );
}
