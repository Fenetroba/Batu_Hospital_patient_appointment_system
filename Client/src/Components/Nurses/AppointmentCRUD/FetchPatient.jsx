import React, { useMemo, useState } from "react";

const FetchPatient = ({ patients = [], onSelect, onClose }) => {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return patients;
    return patients.filter(
      (p) =>
        (p.fullName || p.name || "").toLowerCase().includes(term) ||
        (p.cardId || p.medicalId || "").toLowerCase().includes(term)
    );
  }, [q, patients]);

  const formatPatientName = (patient) => {
    return (
      patient.fullName ||
      patient.name ||
      `${patient.firstName || ""} ${patient.lastName || ""}`.trim() ||
      "Unnamed Patient"
    );
  };

  return (
    <div className="bg-[var(--five)] rounded-xl p-4 text-white w-full max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">Select Patient</h3>
          <p className="text-sm text-gray-400">
            {filtered.length} patient(s) found
          </p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded bg-white/10 hover:bg-white/20 cursor-pointer text-sm transition-colors"
          >
            Close
          </button>
        )}
      </div>

      <div className="relative mb-4">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            className="h-4 w-4 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by name or ID..."
          className="w-full bg-black/30 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="max-h-80 overflow-auto divide-y divide-white/10 rounded-lg border border-white/10">
        {filtered.length === 0 ? (
          <div className="py-6 text-center">
            <div className="text-white/60 mb-2">No patients found</div>
            {q && (
              <button
                onClick={() => setQ("")}
                className="text-blue-400 hover:text-blue-300 text-sm cursor-pointer"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          filtered.map((patient) => (
            <button
              type="button"
              key={patient._id}
              onClick={() => onSelect?.(patient)}
              className="w-full text-left p-4 hover:bg-white/5 transition-colors flex items-center"
            >
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                {formatPatientName(patient).charAt(0).toUpperCase()}
              </div>
              <div className="ml-4 flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <p className="text-sm font-medium text-white truncate">
                    {formatPatientName(patient)}
                  </p>
                  {patient.gender && (
                    <span className="ml-2 text-xs text-gray-400">
                      {patient.gender}
                    </span>
                  )}
                </div>
                <div className="mt-1 flex items-center text-xs text-gray-400">
                  <span className="truncate">
                    ID: {patient._id || patient.id || "N/A"}
                  </span>
                  {patient.cardId && (
                    <span className="ml-2 px-2 py-0.5 bg-white/10 rounded-full">
                      Card: {patient.cardId}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default FetchPatient;
