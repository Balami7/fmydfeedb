"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Step = 1 | 2 | 3 | 4;


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
  "Lack of Skills",
  "Limited Access to Funding",
  "Poor Education",
  "Drug Abuse",
  "Insecurity",
  "Mental Health Challenges",
  "Other",
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

const MINISTRY_PROGRAMMES = [
  "Nigerian Youth Academy (NiYA)",
  "Nigerian Youth Help Desk",
  "Corpreneur Support Scheme",
  "Credicorp",
  "Youth Investment Fund",
  "National Youth Development Bank",
  "Youth Skills and Entrepreneurship Programmes",
  "National Youth Confab",
  "Circular Economy Youth Empowerment Initiative (Waste to Wealth)",
];

const VISITOR_CATEGORIES = [
  "Civil Servant",
  "Youth",
  "Student",
  "Development Partner",
  "Private Sector",
  "NGO/CSO",
  "General Public",
  "Other",
];

const NIGERIAN_STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue",
  "Borno", "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu",
  "FCT - Abuja", "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina",
  "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo",
  "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara",
];


function ProgressBar({ step }: { step: Step }) {
  const steps = [
    { n: 1, label: "Visitor Info" },
    { n: 2, label: "Awareness" },
    { n: 3, label: "Feedback" },
    { n: 4, label: "Inclusion" },
  ];
  const pct = ((step - 1) / (steps.length - 1)) * 100;

  return (
    <div className="w-full mb-10">
      <div className="flex justify-between mb-3">
        {steps.map(({ n, label }) => (
          <div key={n} className="flex flex-col items-center gap-1">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black border-2 transition-all duration-500
                ${step > n ? "bg-emerald-600 border-emerald-600 text-white"
                  : step === n ? "bg-emerald-600 border-emerald-600 text-white"
                  : "bg-white border-black/30 text-black/60"}`}
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

function Input({ className = "", ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full bg-white border border-black/70 text-black text-sm px-4 py-3 outline-none 
        focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-all 
        placeholder:text-black/40 rounded-sm ${className}`}
    />
  );
}

function Select({ className = "", children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={`w-full bg-white border border-black/70 text-black text-sm px-4 py-3 outline-none 
        focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-all rounded-sm 
        appearance-none cursor-pointer ${className}`}
    >
      {children}
    </select>
  );
}

function Textarea({ className = "", ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`w-full bg-white border border-black/70 text-black text-sm px-4 py-3 outline-none 
        focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-all 
        placeholder:text-black/40 resize-none rounded-sm ${className}`}
    />
  );
}

function RadioGroup({
  name, options, value, onChange,
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
            ${value === o.value
              ? "border-emerald-600 bg-emerald-50 text-emerald-700"
              : "border-black/70 hover:border-black text-black"}`}
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
              ${value === n
                ? "border-emerald-600 bg-emerald-600 text-white scale-110"
                : "border-black/70 text-black hover:border-emerald-600 hover:text-emerald-600"}`}
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
  options, selected, onChange, max,
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
              ${active
                ? "border-emerald-600 bg-emerald-50 text-emerald-700"
                : disabled
                ? "border-black/30 text-black/30 cursor-not-allowed"
                : "border-black/70 hover:border-black text-black hover:bg-white/70"}`}
          >
            {active && "✓ "}{opt}
          </button>
        );
      })}
    </div>
  );
}

function ErrorBanner({ message }: { message: string }) {
  if (!message) return null;
  return (
    <div role="alert" className="mt-6 p-4 bg-red-50 border border-red-300 text-red-700 text-sm rounded flex items-start gap-2">
      <span className="mt-0.5 shrink-0">⚠</span>
      <span>{message}</span>
    </div>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-xs text-red-600">{message}</p>;
}


export default function SurveyPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [visitDate, setVisitDate] = useState("");
  const [visitorCategory, setVisitorCategory] = useState("");
  const [visitorCategoryOther, setVisitorCategoryOther] = useState("");
  const [occupation, setOccupation] = useState("");
  const [ageRange, setAgeRange] = useState("");
  const [gender, setGender] = useState("");
  const [stateOfResidence, setStateOfResidence] = useState("");
  const [lga, setLga] = useState("");
  const [homeAddress, setHomeAddress] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");


  const [heardOfMinistry, setHeardOfMinistry] = useState("");
  const [awareProgrammes, setAwareProgrammes] = useState<string[]>([]);
  const [awareProgrammesOther, setAwareProgrammesOther] = useState("");
  const [familiarity, setFamiliarity] = useState("");
  const [priorities, setPriorities] = useState<string[]>([]);

 
  const [opportunitiesOpinion, setOpportunitiesOpinion] = useState("");
  const [opportunitiesOther, setOpportunitiesOther] = useState("");
  const [mostInterestingProgramme, setMostInterestingProgramme] = useState("");
  const [programmeToExpand, setProgrammeToExpand] = useState("");
  const [improvements, setImprovements] = useState("");
  const [newInitiatives, setNewInitiatives] = useState("");
  const [biggestChallenge, setBiggestChallenge] = useState("");
  const [biggestChallengeOther, setBiggestChallengeOther] = useState("");
  const [challengeSolutions, setChallengeSolutions] = useState("");
  const [programTypes, setProgramTypes] = useState<string[]>([]);


  const [wouldParticipate, setWouldParticipate] = useState("");
  const [hasDisability, setHasDisability] = useState("");
  const [disabilityDetails, setDisabilityDetails] = useState("");
  const [accommodationSupport, setAccommodationSupport] = useState("");
  const [anythingElse, setAnythingElse] = useState("");
  const [comments, setComments] = useState("");

  

  const validateStep1 = (): Record<string, string> => {
    const errs: Record<string, string> = {};
    if (!visitDate) errs.visitDate = "Date is required";
    if (!visitorCategory) errs.visitorCategory = "Visitor category is required";
    if (visitorCategory === "Other" && !visitorCategoryOther.trim())
      errs.visitorCategoryOther = "Please specify your category";
    if (!occupation.trim()) errs.occupation = "Occupation is required";
    if (!ageRange) errs.ageRange = "Age range is required";
    if (!gender) errs.gender = "Gender is required";
    if (!stateOfResidence) errs.stateOfResidence = "State of residence is required";
    if (!lga.trim()) errs.lga = "LGA is required";
    if (!homeAddress.trim()) errs.homeAddress = "Home address is required";
    if (!fullName.trim()) errs.fullName = "Full name is required";
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) errs.email = "A valid email address is required";
    if (!phone.trim() || !/^[0-9+\s\-()]{7,15}$/.test(phone))
      errs.phone = "A valid phone number is required";
    return errs;
  };

  const validateStep2 = (): Record<string, string> => {
    const errs: Record<string, string> = {};
    if (!heardOfMinistry) errs.heardOfMinistry = "Please answer this question";
    if (awareProgrammes.length === 0) errs.awareProgrammes = "Please select at least one programme";
    if (!familiarity) errs.familiarity = "Please rate your familiarity";
    if (priorities.length === 0) errs.priorities = "Please select at least one priority area";
    return errs;
  };

  const validateStep3 = (): Record<string, string> => {
    const errs: Record<string, string> = {};
    if (!opportunitiesOpinion) errs.opportunitiesOpinion = "Please answer this question";
    if (opportunitiesOpinion === "Other" && !opportunitiesOther.trim())
      errs.opportunitiesOther = "Please specify your answer";
    if (!mostInterestingProgramme.trim())
      errs.mostInterestingProgramme = "Please enter a programme";
    if (!programmeToExpand.trim()) errs.programmeToExpand = "Please enter a programme";
    if (!improvements.trim()) errs.improvements = "Please describe the improvements you'd like";
    if (!newInitiatives.trim()) errs.newInitiatives = "Please share your ideas for new initiatives";
    if (!biggestChallenge) errs.biggestChallenge = "Please select the biggest challenge";
    if (biggestChallenge === "Other" && !biggestChallengeOther.trim())
      errs.biggestChallengeOther = "Please specify the challenge";
    if (!challengeSolutions.trim()) errs.challengeSolutions = "Please share your recommended solutions";
    if (programTypes.length === 0) errs.programTypes = "Please select at least one program type";
    return errs;
  };

  const validateStep4 = (): Record<string, string> => {
    const errs: Record<string, string> = {};
    if (!wouldParticipate) errs.wouldParticipate = "Please answer this question";
    if (!hasDisability) errs.hasDisability = "Please answer this question";
    if (hasDisability === "Yes" && !disabilityDetails.trim())
      errs.disabilityDetails = "Please specify your disability or support needs";
    return errs;
  };


  const submitRegistration = async (): Promise<boolean> => {
    try {
      const payload = {
        full_name: fullName,
        email,
        phone,
        age_range: ageRange,
        occupation,
        visitor_category: visitorCategory === "Other" ? visitorCategoryOther : visitorCategory,
        state_of_residence: stateOfResidence,
        lga,
        home_address: homeAddress,
        gender,
        visit_date: visitDate,
        registration_date: new Date().toISOString(),
      };
      const res = await fetch("/api/registration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || `Server error: ${res.status}`);
      }
      return true;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setSubmitError(`Registration failed: ${message}. Please try again.`);
      return false;
    }
  };

  const submitFullSurvey = async (): Promise<boolean> => {
    try {
      const payload = {
        
        full_name: fullName,
        email,
        phone,
        age_range: ageRange,
        occupation,
        visitor_category: visitorCategory === "Other" ? visitorCategoryOther : visitorCategory,
        state_of_residence: stateOfResidence,
        lga,
        home_address: homeAddress,
        gender,
        visit_date: visitDate,
        
        heard_of_ministry: heardOfMinistry,
        aware_programmes: awareProgrammes.includes("Other")
          ? [...awareProgrammes.filter((p) => p !== "Other"), awareProgrammesOther].filter(Boolean)
          : awareProgrammes,
        familiarity_score: Number(familiarity),
        priority_areas: priorities,
        
        opportunities_opinion:
          opportunitiesOpinion === "Other" ? opportunitiesOther : opportunitiesOpinion,
        most_interesting_programme: mostInterestingProgramme,
        programme_to_expand: programmeToExpand,
        improvements,
        new_initiatives: newInitiatives,
        biggest_challenge:
          biggestChallenge === "Other" ? biggestChallengeOther : biggestChallenge,
        challenge_solutions: challengeSolutions,
        program_types_interest: programTypes,
        
        would_participate: wouldParticipate,
        has_disability: hasDisability,
        disability_details: hasDisability === "Yes" ? disabilityDetails : "",
        accommodation_support: accommodationSupport,
        anything_else: anythingElse,
        comments,
        submitted_at: new Date().toISOString(),
      };

      const res = await fetch("/api/survey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || `Server error: ${res.status}`);
      }
      return true;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setSubmitError(`Submission failed: ${message}. Please try again.`);
      return false;
    }
  };

  

  const scrollUp = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const handleNext = async () => {
    setSubmitError("");

    if (step === 1) {
      const errs = validateStep1();
      if (Object.keys(errs).length) { setFieldErrors(errs); scrollUp(); return; }
      setFieldErrors({});
      setLoading(true);
      const ok = await submitRegistration();
      setLoading(false);
      if (ok) { setStep(2); scrollUp(); }

    } else if (step === 2) {
      const errs = validateStep2();
      if (Object.keys(errs).length) { setFieldErrors(errs); scrollUp(); return; }
      setFieldErrors({});
      setStep(3); scrollUp();

    } else if (step === 3) {
      const errs = validateStep3();
      if (Object.keys(errs).length) { setFieldErrors(errs); scrollUp(); return; }
      setFieldErrors({});
      setStep(4); scrollUp();
    }
  };

  const handleSubmit = async () => {
    setSubmitError("");
    const errs = validateStep4();
    if (Object.keys(errs).length) { setFieldErrors(errs); scrollUp(); return; }
    setFieldErrors({});
    setLoading(true);
    const ok = await submitFullSurvey();
    setLoading(false);
    if (ok) router.push("/pre");
  };

  const goBack = () => {
    setSubmitError("");
    setFieldErrors({});
    setStep((s) => (s - 1) as Step);
    scrollUp();
  };

  

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(26,71,42,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(26,71,42,0.04)_1px,transparent_1px)] bg-[size:48px_48px]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-900/10 blur-[120px] rounded-full pointer-events-none" />

      <header className="relative z-10 border-b border-black bg-white backdrop-blur-sm">
  <div className="max-w-3xl mx-auto px-6 py-5 flex items-center gap-4">
    
    <img 
      src="/fmyd.png" 
      alt="FMYD Logo" 
      className="h-20 w-auto" 
    />
    
    <img 
      src="/6.jpeg" 
      alt="Civil Service Conference" 
      className="h-20 w-auto" 
    />

  </div>
</header>

      <main className="relative z-10 max-w-3xl mx-auto px-6 py-12">
        <div className="mb-10">
          {step === 1 ? (
            <h1 className="text-4xl font-black text-black uppercase tracking-tight">
              Registration
            </h1>
          ) : (
            <>
              <div className="inline-flex items-center gap-2 bg-white/90 border border-black px-4 py-2 mb-6 backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                <span className="text-emerald-700 text-xs font-black uppercase tracking-widest">
                  Civil Service Week · Feedback Survey
                </span>
              </div>
              <h1 className="text-4xl font-black text-black uppercase tracking-tight leading-tight mb-3">
                Your Voice <span className="text-emerald-600">Matters</span>
              </h1>
              <p className="text-black/80 text-[15px] leading-relaxed">
                Help shape the future of youth development in Nigeria. Your responses are confidential.
              </p>
            </>
          )}
        </div>

        <ProgressBar step={step} />

        <div className="bg-white border border-black p-8 sm:p-10">

          {step === 1 && (
            <div className="space-y-6">
              <div className="pb-6 border-b border-black/10">
                <h2 className="text-xl font-bold">Section A: Visitor Information</h2>
                <p className="text-sm text-black/60 mt-1">Fields marked <span className="text-emerald-600">*</span> are required.</p>
              </div>

              {/* Date */}
              <div>
                <Label required>Date of Visit</Label>
                <Input
                  type="date"
                  value={visitDate}
                  onChange={(e) => setVisitDate(e.target.value)}
                />
                <FieldError message={fieldErrors.visitDate} />
              </div>

              {/* Visitor Category */}
              <div>
                <Label required>Visitor Category</Label>
                <div className="flex flex-wrap gap-2">
                  {VISITOR_CATEGORIES.map((cat) => (
                    <label
                      key={cat}
                      className={`flex items-center gap-2 px-5 py-3 border cursor-pointer transition-all text-sm font-medium
                        ${visitorCategory === cat
                          ? "border-emerald-600 bg-emerald-50 text-emerald-700"
                          : "border-black/70 hover:border-black text-black"}`}
                    >
                      <input
                        type="radio"
                        name="visitor_category"
                        value={cat}
                        checked={visitorCategory === cat}
                        onChange={() => setVisitorCategory(cat)}
                        className="sr-only"
                      />
                      {cat}
                    </label>
                  ))}
                </div>
                {visitorCategory === "Other" && (
                  <div className="mt-2">
                    <Input
                      value={visitorCategoryOther}
                      onChange={(e) => setVisitorCategoryOther(e.target.value)}
                      placeholder="Please specify..."
                    />
                    <FieldError message={fieldErrors.visitorCategoryOther} />
                  </div>
                )}
                <FieldError message={fieldErrors.visitorCategory} />
              </div>

              {/* Occupation */}
              <div>
                <Label required>Occupation</Label>
                <Input
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)}
                  placeholder="e.g. Software Engineer, Teacher, Student"
                />
                <FieldError message={fieldErrors.occupation} />
              </div>

              {/* Age Range */}
              <div>
                <Label required>Age Range</Label>
                <RadioGroup
                  name="age_range"
                  value={ageRange}
                  onChange={setAgeRange}
                  options={[
                    { value: "Under 18", label: "Under 18" },
                    { value: "18–24", label: "18–24" },
                    { value: "25–35", label: "25–35" },
                    { value: "36–45", label: "36–45" },
                    { value: "Above 45", label: "Above 45" },
                  ]}
                />
                <FieldError message={fieldErrors.ageRange} />
              </div>

              {/* Gender */}
              <div>
                <Label required>Gender</Label>
                <RadioGroup
                  name="gender"
                  value={gender}
                  onChange={setGender}
                  options={[
                    { value: "Male", label: "Male" },
                    { value: "Female", label: "Female" },
                    { value: "Prefer not to say", label: "Prefer not to say" },
                  ]}
                />
                <FieldError message={fieldErrors.gender} />
              </div>

              {/* State of Residence */}
              <div>
                <Label required>State of Residence</Label>
                <div className="relative">
                  <Select
                    value={stateOfResidence}
                    onChange={(e) => setStateOfResidence(e.target.value)}
                  >
                    <option value="">-- Select a state --</option>
                    {NIGERIAN_STATES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </Select>
                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-black/60">▾</span>
                </div>
                <FieldError message={fieldErrors.stateOfResidence} />
              </div>

              {/* LGA */}
              <div>
                <Label required>Local Government Area (LGA)</Label>
                <Input
                  value={lga}
                  onChange={(e) => setLga(e.target.value)}
                  placeholder="e.g. Ikeja, Wuse, Nassarawa"
                />
                <FieldError message={fieldErrors.lga} />
              </div>

              {/* Home Address */}
              <div>
                <Label required>Home Address</Label>
                <Textarea
                  rows={2}
                  value={homeAddress}
                  onChange={(e) => setHomeAddress(e.target.value)}
                  placeholder="Enter your full home address"
                />
                <FieldError message={fieldErrors.homeAddress} />
              </div>

              {/* Contact Info */}
              <div className="pt-4 border-t border-black/10">
                <h3 className="text-base font-bold mb-4">Contact Details</h3>
                <div className="space-y-4">
                  <div>
                    <Label required>Full Name</Label>
                    <Input
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Amaka Okonkwo"
                    />
                    <FieldError message={fieldErrors.fullName} />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label required>Phone Number</Label>
                      <Input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="08012345678"
                      />
                      <FieldError message={fieldErrors.phone} />
                    </div>
                    <div>
                      <Label required>Email Address</Label>
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                      />
                      <FieldError message={fieldErrors.email} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ══════════════ STEP 2 · PROGRAMME AWARENESS ══════════════ */}
          {step === 2 && (
            <div className="space-y-8">
              <div className="pb-6 border-b border-black/10">
                <h2 className="text-xl font-bold">Section A (cont.) · Programme Awareness</h2>
              </div>

              {/* Heard of Ministry */}
              <div>
                <Label required>
                  Have you heard of the Federal Ministry of Youth Development before today?
                </Label>
                <RadioGroup
                  name="heard_ministry"
                  value={heardOfMinistry}
                  onChange={setHeardOfMinistry}
                  options={[
                    { value: "Yes", label: "Yes" },
                    { value: "No", label: "No" },
                  ]}
                />
                <FieldError message={fieldErrors.heardOfMinistry} />
              </div>

              {/* Aware programmes */}
              <div>
                <Label required>
                  Which Ministry programme(s) are you aware of?{" "}
                  <span className="text-black/60 font-normal">(Tick all that apply)</span>
                </Label>
                <div className="flex flex-wrap gap-2">
                  {[...MINISTRY_PROGRAMMES, "Other"].map((prog) => {
                    const active = awareProgrammes.includes(prog);
                    return (
                      <button
                        key={prog}
                        type="button"
                        onClick={() => {
                          setAwareProgrammes(
                            active
                              ? awareProgrammes.filter((p) => p !== prog)
                              : [...awareProgrammes, prog]
                          );
                        }}
                        className={`px-4 py-2.5 border text-sm font-medium transition-all text-left
                          ${active
                            ? "border-emerald-600 bg-emerald-50 text-emerald-700"
                            : "border-black/70 hover:border-black text-black"}`}
                      >
                        {active && "✓ "}{prog}
                      </button>
                    );
                  })}
                </div>
                {awareProgrammes.includes("Other") && (
                  <div className="mt-2">
                    <Input
                      value={awareProgrammesOther}
                      onChange={(e) => setAwareProgrammesOther(e.target.value)}
                      placeholder="Please specify other programme..."
                    />
                  </div>
                )}
                <FieldError message={fieldErrors.awareProgrammes} />
              </div>

              {/* Familiarity */}
              <div>
                <Label required>
                  How familiar are you with the programs and initiatives of the Ministry?
                </Label>
                <FamiliarityScale value={familiarity} onChange={setFamiliarity} />
                <FieldError message={fieldErrors.familiarity} />
              </div>

              {/* Priorities */}
              <div>
                <Label required>
                  Which areas should the Ministry prioritize the most?{" "}
                  <span className="text-black/60 font-normal">(Select up to 3)</span>
                </Label>
                <MultiSelect
                  options={PRIORITY_OPTIONS}
                  selected={priorities}
                  onChange={setPriorities}
                  max={3}
                />
                <FieldError message={fieldErrors.priorities} />
              </div>
            </div>
          )}

          {/* ══════════════ STEP 3 · PROGRAMME FEEDBACK ══════════════ */}
          {step === 3 && (
            <div className="space-y-8">
              <div className="pb-6 border-b border-black/10">
                <h2 className="text-xl font-bold">Section B: Programme Feedback</h2>
              </div>

              {/* Opportunities opinion */}
              <div>
                <Label required>
                  Do you believe current youth programs are creating enough opportunities for young people?
                </Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {["Yes", "No", "Other"].map((opt) => (
                    <label
                      key={opt}
                      className={`flex items-center gap-2 px-5 py-3 border cursor-pointer transition-all text-sm font-medium
                        ${opportunitiesOpinion === opt
                          ? "border-emerald-600 bg-emerald-50 text-emerald-700"
                          : "border-black/70 hover:border-black text-black"}`}
                    >
                      <input
                        type="radio"
                        name="opportunities"
                        value={opt}
                        checked={opportunitiesOpinion === opt}
                        onChange={() => setOpportunitiesOpinion(opt)}
                        className="sr-only"
                      />
                      {opt}
                    </label>
                  ))}
                </div>
                {opportunitiesOpinion === "Other" && (
                  <>
                    <Input
                      value={opportunitiesOther}
                      onChange={(e) => setOpportunitiesOther(e.target.value)}
                      placeholder="Please specify..."
                    />
                    <FieldError message={fieldErrors.opportunitiesOther} />
                  </>
                )}
                <FieldError message={fieldErrors.opportunitiesOpinion} />
              </div>

              {/* Most interesting programme */}
              <div>
                <Label required>Which Ministry programme interests you the most?</Label>
                <Input
                  value={mostInterestingProgramme}
                  onChange={(e) => setMostInterestingProgramme(e.target.value)}
                  placeholder="e.g. Nigerian Youth Academy (NiYA)"
                />
                <FieldError message={fieldErrors.mostInterestingProgramme} />
              </div>

              {/* Programme to expand */}
              <div>
                <Label required>Which programme would you like the Federal Government to expand?</Label>
                <Input
                  value={programmeToExpand}
                  onChange={(e) => setProgrammeToExpand(e.target.value)}
                  placeholder="e.g. Youth Investment Fund, N-Power..."
                />
                <FieldError message={fieldErrors.programmeToExpand} />
              </div>

              {/* Improvements */}
              <div>
                <Label required>What improvements would you like to see in our programmes and services?</Label>
                <Textarea
                  rows={4}
                  value={improvements}
                  onChange={(e) => setImprovements(e.target.value)}
                  placeholder="Share your suggestions for improvement..."
                />
                <FieldError message={fieldErrors.improvements} />
              </div>

              {/* New initiatives */}
              <div>
                <Label required>What new initiatives would you like the Ministry to introduce for Nigerian youth?</Label>
                <Textarea
                  rows={3}
                  value={newInitiatives}
                  onChange={(e) => setNewInitiatives(e.target.value)}
                  placeholder="Share your ideas for new programmes or initiatives..."
                />
                <FieldError message={fieldErrors.newInitiatives} />
              </div>

              {/* Biggest challenge */}
              <div>
                <Label required>In your opinion, what is the biggest challenge facing Nigerian youth today?</Label>
                <div className="flex flex-wrap gap-2">
                  {CHALLENGE_OPTIONS.map((ch) => (
                    <label
                      key={ch}
                      className={`flex items-center gap-2 px-5 py-3 border cursor-pointer transition-all text-sm font-medium
                        ${biggestChallenge === ch
                          ? "border-emerald-600 bg-emerald-50 text-emerald-700"
                          : "border-black/70 hover:border-black text-black"}`}
                    >
                      <input
                        type="radio"
                        name="biggest_challenge"
                        value={ch}
                        checked={biggestChallenge === ch}
                        onChange={() => setBiggestChallenge(ch)}
                        className="sr-only"
                      />
                      {ch}
                    </label>
                  ))}
                </div>
                {biggestChallenge === "Other" && (
                  <div className="mt-2">
                    <Input
                      value={biggestChallengeOther}
                      onChange={(e) => setBiggestChallengeOther(e.target.value)}
                      placeholder="Please specify..."
                    />
                    <FieldError message={fieldErrors.biggestChallengeOther} />
                  </div>
                )}
                <FieldError message={fieldErrors.biggestChallenge} />
              </div>

              {/* Solutions */}
              <div>
                <Label required>What solutions do you recommend to address this challenge?</Label>
                <Textarea
                  rows={4}
                  value={challengeSolutions}
                  onChange={(e) => setChallengeSolutions(e.target.value)}
                  placeholder="Describe practical solutions you would recommend..."
                />
                <FieldError message={fieldErrors.challengeSolutions} />
              </div>

              {/* Program types */}
              <div>
                <Label required>
                  What type of youth programs interest you the most?{" "}
                  <span className="text-black/60 font-normal">(Select up to 3)</span>
                </Label>
                <MultiSelect
                  options={PROGRAM_TYPES}
                  selected={programTypes}
                  onChange={setProgramTypes}
                  max={3}
                />
                <FieldError message={fieldErrors.programTypes} />
              </div>
            </div>
          )}

          {/* ══════════════ STEP 4 · VOLUNTEER & INCLUSION ══════════════ */}
          {step === 4 && (
            <div className="space-y-8">
              <div className="pb-6 border-b border-black/10">
                <h2 className="text-xl font-bold">Section C: Volunteer Interest & Inclusion</h2>
              </div>

              {/* Would participate */}
              <div>
                <Label required>
                  Would you like to volunteer or participate in future Ministry programmes and projects?
                </Label>
                <RadioGroup
                  name="participate"
                  value={wouldParticipate}
                  onChange={setWouldParticipate}
                  options={[
                    { value: "Yes", label: "Yes" },
                    { value: "No", label: "No" },
                  ]}
                />
                <FieldError message={fieldErrors.wouldParticipate} />
              </div>

              {/* Disability */}
              <div>
                <Label required>Do you have any disability or special support needs?</Label>
                <RadioGroup
                  name="has_disability"
                  value={hasDisability}
                  onChange={setHasDisability}
                  options={[
                    { value: "No", label: "No" },
                    { value: "Yes", label: "Yes" },
                  ]}
                />
                {hasDisability === "Yes" && (
                  <div className="mt-3">
                    <Label>Please specify your disability or support needs</Label>
                    <Input
                      value={disabilityDetails}
                      onChange={(e) => setDisabilityDetails(e.target.value)}
                      placeholder="e.g. Visual impairment, mobility needs..."
                    />
                    <FieldError message={fieldErrors.disabilityDetails} />
                  </div>
                )}
                <FieldError message={fieldErrors.hasDisability} />
              </div>

              
              <div>
                <Label>
                  What support or accommodation would help you participate fully in our programmes?
                </Label>
                <Textarea
                  rows={3}
                  value={accommodationSupport}
                  onChange={(e) => setAccommodationSupport(e.target.value)}
                  placeholder="e.g. Sign language interpreter, wheelchair access, online participation option..."
                />
              </div>

              {/* Section D — anything else */}
              <div className="pt-6 border-t border-black/10">
                <h2 className="text-xl font-bold mb-6">Section D: Final Thoughts</h2>

                <div className="space-y-6">
                  <div>
                    <Label>
                      Is there anything else you would like us to know about you or your interests?
                    </Label>
                    <Textarea
                      rows={3}
                      value={anythingElse}
                      onChange={(e) => setAnythingElse(e.target.value)}
                      placeholder="Anything additional you'd like to share..."
                    />
                  </div>

                  <div>
                    <Label>Additional comments or suggestions</Label>
                    <Textarea
                      rows={4}
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                      placeholder="Any other thoughts or feedback for the Ministry..."
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          
          <ErrorBanner message={submitError} />

          
          <div className="flex gap-4 mt-10">
            {step > 1 && (
              <button
                type="button"
                onClick={goBack}
                className="flex-1 border border-black py-4 text-black font-bold hover:bg-black hover:text-white transition-all disabled:opacity-50"
                disabled={loading}
              >
                ← Back
              </button>
            )}

            {step < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                disabled={loading}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 py-4 text-white font-bold transition-all disabled:opacity-70"
              >
                {loading ? "Saving…" : "Continue →"}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 py-4 text-white font-bold transition-all disabled:opacity-70"
              >
                {loading ? "Submitting…" : "Submit Survey ✓"}
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}