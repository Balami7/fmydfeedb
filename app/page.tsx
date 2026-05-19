"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Step = 1 | 2 | 3;

const PRIORITY_OPTIONS = [
  "Employment & Job Creation",
  "Education & Skills Training",
  "Mental Health & Wellbeing",
  "Entrepreneurship Support",
  "Digital Inclusion & Tech Access",
  "Sports & Recreation",
  "Civic Engagement & Leadership",
  "Financial Literacy",
  "Healthcare Access",
  "Gender Equality & Inclusion",
];

const CHALLENGE_OPTIONS = [
  "Unemployment",
  "Lack of quality education",
  "Poverty",
  "Insecurity & violence",
  "Drug abuse & addiction",
  "Poor infrastructure",
  "Limited access to capital",
  "Political marginalisation",
  "Gender-based discrimination",
  "Mental health stigma",
];

const PROGRAM_TYPES = [
  "Mentorship & Coaching",
  "Vocational & Skills Training",
  "Entrepreneurship & Business",
  "Digital & Technology",
  "Sports & Creative Arts",
  "Leadership & Governance",
  "Health & Wellness",
  "Agriculture & Rural Development",
];

function ProgressBar({ step }: { step: Step }) {
  const pct = step === 1 ? 33 : step === 2 ? 66 : 100;
  return (
    <div className="w-full mb-10">
      <div className="flex justify-between mb-3">
        {[
          { n: 1, label: "Registration" },
          { n: 2, label: "Survey" },
          { n: 3, label: "Programs" },
        ].map(({ n, label }) => (
          <div key={n} className="flex flex-col items-center gap-1">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black border-2 transition-all duration-500
                ${step >= n ? "bg-emerald-600 border-emerald-600 text-white" : "bg-white border-black/30 text-black/60"}`}
            >
              {step > n ? "✓" : n}
            </div>
            <span className={`text-[10px] uppercase tracking-widest font-bold ${step >= n ? "text-black" : "text-black/40"}`}>
              {label}
            </span>
          </div>
        ))}
      </div>
      <div className="h-0.5 bg-gray-200 rounded-full overflow-hidden">
        <div className="h-full bg-emerald-600 transition-all duration-700 ease-out" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-sm font-bold text-black mb-2">
      {children} {required && <span className="text-emerald-600">*</span>}
    </label>
  );
}

function Input({ ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full bg-white border border-black/70 text-black text-sm px-4 py-3 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-all placeholder:text-black/40 rounded-sm"
    />
  );
}

function Textarea({ ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className="w-full bg-white border border-black/70 text-black text-sm px-4 py-3 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-all placeholder:text-black/40 resize-none rounded-sm"
    />
  );
}

function RadioGroup({
  name,
  options,
  value,
  onChange,
}: {
  name: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <label
          key={o.value}
          className={`flex items-center gap-2 px-5 py-3 border cursor-pointer transition-all text-sm font-medium
            ${value === o.value ? "border-emerald-600 bg-emerald-50 text-emerald-700" : "border-black/70 hover:border-black text-black"}`}
        >
          <input
            type="radio"
            name={name}
            value={o.value}
            checked={value === o.value}
            onChange={() => onChange(o.value)}
            className="sr-only"
          />
          {o.label}
        </label>
      ))}
    </div>
  );
}

function FamiliarityScale({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <div className="flex items-center gap-3 flex-wrap">
        {["1", "2", "3", "4", "5"].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            className={`w-14 h-14 border-2 font-black text-lg transition-all duration-200
              ${value === n ? "border-emerald-600 bg-emerald-600 text-white scale-110" : "border-black/70 text-black hover:border-emerald-600 hover:text-emerald-600"}`}
          >
            {n}
          </button>
        ))}
      </div>
      <div className="flex justify-between mt-2 px-1 text-xs text-black/60">
        <span>Not Familiar</span>
        <span>Very Familiar</span>
      </div>
    </div>
  );
}

function MultiSelect({
  options,
  selected,
  onChange,
  max,
}: {
  options: string[];
  selected: string[];
  onChange: (v: string[]) => void;
  max: number;
}) {
  const toggle = (opt: string) => {
    if (selected.includes(opt)) {
      onChange(selected.filter((s) => s !== opt));
    } else if (selected.length < max) {
      onChange([...selected, opt]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const active = selected.includes(opt);
        const disabled = !active && selected.length >= max;
        return (
          <button
            key={opt}
            type="button"
            disabled={disabled}
            onClick={() => toggle(opt)}
            className={`px-4 py-2.5 border text-sm font-medium transition-all
              ${active ? "border-emerald-600 bg-emerald-50 text-emerald-700" 
                : disabled ? "border-black/30 text-black/30 cursor-not-allowed" 
                : "border-black/70 hover:border-black text-black hover:bg-white/70"}`}
          >
            {active && "✓ "}{opt}
          </button>
        );
      })}
    </div>
  );
}

export default function SurveyPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Step 1 Fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [ageRange, setAgeRange] = useState("");
  const [sector, setSector] = useState("");
  const [profession, setProfession] = useState("");
  const [expertise, setExpertise] = useState("");

  // Step 2 Fields
  const [ministryFeelings, setMinistryFeelings] = useState("");
  const [familiarity, setFamiliarity] = useState("");
  const [priorities, setPriorities] = useState<string[]>([]);
  const [opportunitiesOpinion, setOpportunitiesOpinion] = useState("");
  const [opportunitiesOther, setOpportunitiesOther] = useState("");
  const [majorChallenge, setMajorChallenge] = useState("");

  // Step 3 Fields
  const [nigeriaChallenges, setNigeriaChallenges] = useState<string[]>([]);
  const [additionalSupport, setAdditionalSupport] = useState("");
  const [initiativeExpand, setInitiativeExpand] = useState("");
  const [wouldParticipate, setWouldParticipate] = useState("");
  const [programTypes, setProgramTypes] = useState<string[]>([]);
  const [comments, setComments] = useState("");

  // New Age Ranges
  const ageOptions = [
    { value: "15-35", label: "15 – 35" },
    { value: "36-44", label: "36 – 44" },
    { value: "45-60", label: "45 – 60" },
  ];

  const validateStep1 = () => {
    if (!fullName.trim()) return "Full name is required";
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) return "Valid email is required";
    if (!phone.trim()) return "Phone number is required";
    if (!ageRange) return "Age range is required";
    if (!sector.trim()) return "Sector is required";
    if (!profession.trim()) return "Profession is required";
    if (!expertise.trim()) return "Area of expertise is required";
    return "";
  };

  const validateStep2 = () => {
    if (!ministryFeelings.trim()) return "Please share your feelings about the Ministry";
    if (!familiarity) return "Please rate your familiarity";
    if (priorities.length === 0) return "Please select at least one priority area";
    if (!opportunitiesOpinion) return "Please answer the opportunities question";
    if (opportunitiesOpinion === "Other" && !opportunitiesOther.trim()) return "Please specify your answer";
    if (!majorChallenge.trim()) return "Please describe the major challenge";
    return "";
  };

  const validateStep3 = () => {
    if (nigeriaChallenges.length === 0) return "Please select at least one challenge";
    if (!additionalSupport.trim()) return "Please share what additional support you'd like";
    if (!initiativeExpand.trim()) return "Please share which initiative you'd like expanded";
    if (!wouldParticipate) return "Please answer whether you'd participate";
    if (programTypes.length === 0) return "Please select at least one program type";
    if (!comments.trim()) return "Please add your comments or suggestions";
    return "";
  };

  const submitRegistration = async () => {
    const payload = {
      full_name: fullName,
      email,
      phone,
      age_range: ageRange,
      sector,
      profession,
      area_of_expertise: expertise,
      registration_date: new Date().toISOString(),
    };

    const res = await fetch("/api/registration", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return res.ok;
  };

  const submitFullSurvey = async () => {
    const payload = {
      full_name: fullName,
      email,
      phone,
      age_range: ageRange,
      sector,
      profession,
      area_of_expertise: expertise,

      ministry_feelings: ministryFeelings,
      familiarity_score: Number(familiarity),
      priority_areas: priorities,
      opportunities_opinion: opportunitiesOpinion === "Other" ? opportunitiesOther : opportunitiesOpinion,
      major_challenge: majorChallenge,
      nigeria_challenges: nigeriaChallenges,
      additional_support: additionalSupport,
      initiative_to_expand: initiativeExpand,
      would_participate: wouldParticipate,
      program_types_interest: programTypes,
      comments,
      submitted_at: new Date().toISOString(),
    };

    const res = await fetch("/api/survey", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return res.ok;
  };

  const handleNext = async () => {
    setError("");
    if (step === 1) {
      const err = validateStep1();
      if (err) return setError(err);

      setLoading(true);
      const success = await submitRegistration();
      setLoading(false);

      if (success) {
        setStep(2);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setError("Failed to save registration. Please try again.");
      }
    } else if (step === 2) {
      const err = validateStep2();
      if (err) return setError(err);
      setStep(3);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmit = async () => {
    setError("");
    const err = validateStep3();
    if (err) return setError(err);

    setLoading(true);
    const success = await submitFullSurvey();
    setLoading(false);

    if (success) {
      router.push("/marketplace");
    } else {
      setError("Failed to submit survey. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(26,71,42,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(26,71,42,0.04)_1px,transparent_1px)] bg-[size:48px_48px]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-900/10 blur-[120px] rounded-full pointer-events-none" />

      <header className="relative z-10 border-b border-black bg-white backdrop-blur-sm">
        <div className="max-w-3xl mx-auto px-6 py-5 flex items-center gap-4">
          <img src="/fmyd.png" alt="FMYD Logo" className="h-20 w-auto" />
        </div>
      </header>

      <main className="relative z-10 max-w-3xl mx-auto px-6 py-12">
        {step === 1 && (
          <div className="mb-10">
            <h1 className="text-4xl font-black text-black uppercase tracking-tight">Registration</h1>
          </div>
        )}

        {(step === 2 || step === 3) && (
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 bg-white/90 border border-black px-4 py-2 mb-6 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              <span className="text-emerald-700 text-xs font-black uppercase tracking-widest">Youth Engagement Survey</span>
            </div>
            <h1 className="text-4xl font-black text-black uppercase tracking-tight leading-tight mb-3">
              Your Voice <span className="text-emerald-600">Matters</span>
            </h1>
            <p className="text-black/80 text-[15px] leading-relaxed">
              Help shape the future of youth development in Nigeria. Your responses are confidential.
            </p>
          </div>
        )}

        <ProgressBar step={step} />

        <div className="bg-white border border-black p-8 sm:p-10">

          {/* ====================== STEP 1 ====================== */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="pb-6 border-b border-black/10">
                <h2 className="text-xl font-bold">Personal Information</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="sm:col-span-2">
                  <Label required>Full Name</Label>
                  <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="e.g. Amaka Okonkwo" />
                </div>
                <div>
                  <Label required>Email Address</Label>
                  <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
                </div>
                <div>
                  <Label required>Phone Number</Label>
                  <Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="08012345678" />
                </div>
              </div>

              <div>
                <Label required>Age Range</Label>
                <RadioGroup
                  name="age_range"
                  value={ageRange}
                  onChange={setAgeRange}
                  options={ageOptions}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <Label required>Sector</Label>
                  <Input value={sector} onChange={(e) => setSector(e.target.value)} placeholder="e.g. Technology, Agriculture" />
                </div>
                <div>
                  <Label required>Profession</Label>
                  <Input value={profession} onChange={(e) => setProfession(e.target.value)} placeholder="e.g. Software Engineer" />
                </div>
              </div>

              <div>
                <Label required>Area of Expertise</Label>
                <Input value={expertise} onChange={(e) => setExpertise(e.target.value)} placeholder="e.g. Data Science, Education, Policy" />
              </div>
            </div>
          )}

          {/* ====================== STEP 2 ====================== */}
          {step === 2 && (
            <div className="space-y-8">
              <div>
                <Label required>What do you feel about the Ministry of Youth Development?</Label>
                <Textarea rows={4} value={ministryFeelings} onChange={(e) => setMinistryFeelings(e.target.value)} placeholder="Share your honest thoughts and feelings..." />
              </div>

              <div>
                <Label required>How familiar are you with the programs and initiatives of the Ministry?</Label>
                <FamiliarityScale value={familiarity} onChange={setFamiliarity} />
              </div>

              <div>
                <Label required>Which areas should the Ministry prioritize the most? <span className="text-black/60">(Select up to 3)</span></Label>
                <MultiSelect options={PRIORITY_OPTIONS} selected={priorities} onChange={setPriorities} max={3} />
              </div>

              <div>
                <Label required>Do you believe current youth programs are creating enough opportunities?</Label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {["Yes", "No", "Other"].map((opt) => (
                    <label
                      key={opt}
                      className={`flex items-center gap-2 px-5 py-3 border cursor-pointer transition-all text-sm font-medium
                        ${opportunitiesOpinion === opt ? "border-emerald-600 bg-emerald-50 text-emerald-700" : "border-black/70 hover:border-black text-black"}`}
                    >
                      <input type="radio" name="opportunities" value={opt} checked={opportunitiesOpinion === opt} onChange={() => setOpportunitiesOpinion(opt)} className="sr-only" />
                      {opt}
                    </label>
                  ))}
                </div>
                {opportunitiesOpinion === "Other" && (
                  <Input value={opportunitiesOther} onChange={(e) => setOpportunitiesOther(e.target.value)} placeholder="Please specify..." />
                )}
              </div>

              <div>
                <Label required>What major challenge affects young people the most?</Label>
                <Textarea rows={3} value={majorChallenge} onChange={(e) => setMajorChallenge(e.target.value)} placeholder="Describe the most pressing challenge..." />
              </div>
            </div>
          )}

          {/* ====================== STEP 3 ====================== */}
          {step === 3 && (
            <div className="space-y-8">
              <div>
                <Label required>What challenges do young people currently face the most in Nigeria? <span className="text-black/60">(Select up to 3)</span></Label>
                <MultiSelect options={CHALLENGE_OPTIONS} selected={nigeriaChallenges} onChange={setNigeriaChallenges} max={3} />
              </div>

              <div>
                <Label required>What additional support would you like to see from the Ministry?</Label>
                <Textarea rows={3} value={additionalSupport} onChange={(e) => setAdditionalSupport(e.target.value)} placeholder="e.g. More funding, better mentorship..." />
              </div>

              <div>
                <Label required>Which Ministry initiative would you most like to see expanded?</Label>
                <Input value={initiativeExpand} onChange={(e) => setInitiativeExpand(e.target.value)} placeholder="e.g. N-Power, Youth Enterprise..." />
              </div>

              <div>
                <Label required>Would you participate in future Ministry programs?</Label>
                <RadioGroup
                  name="participate"
                  value={wouldParticipate}
                  onChange={setWouldParticipate}
                  options={[
                    { value: "Yes", label: "Yes" },
                    { value: "No", label: "No" },
                  ]}
                />
              </div>

              <div>
                <Label required>What type of youth programs interest you the most? <span className="text-black/60">(Select up to 3)</span></Label>
                <MultiSelect options={PROGRAM_TYPES} selected={programTypes} onChange={setProgramTypes} max={3} />
              </div>

              <div>
                <Label required>Additional comments or suggestions</Label>
                <Textarea rows={5} value={comments} onChange={(e) => setComments(e.target.value)} placeholder="Any other thoughts..." />
              </div>
            </div>
          )}

          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded">
              ⚠ {error}
            </div>
          )}

          <div className="flex gap-4 mt-10">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep((s) => (s - 1) as Step)}
                className="flex-1 border border-black py-4 text-black font-bold hover:bg-black hover:text-white transition-all"
                disabled={loading}
              >
                ← Back
              </button>
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                disabled={loading}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 py-4 text-white font-bold transition-all disabled:opacity-70"
              >
                {loading ? "Saving..." : "Continue"}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 py-4 text-white font-bold transition-all disabled:opacity-70"
              >
                {loading ? "Submitting Survey..." : "Submit Survey"}
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}