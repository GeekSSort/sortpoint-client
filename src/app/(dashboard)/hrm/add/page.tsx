"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { CloudUpload, ChevronDown, CheckCircle2 } from "lucide-react";
import { HrmService } from "@/lib/services/hrm.service";

export default function AddEmployeePage() {
  const router = useRouter();

  // Form State
  const [employeeName, setEmployeeName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [department, setDepartment] = useState("");
  const [isDepartmentOpen, setIsDepartmentOpen] = useState(false);
  const [designation, setDesignation] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);

  const departments = ["Management", "HR", "Sales", "Accounts", "IT"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!employeeName) return;

    setIsSubmitting(true);
    try {
      await HrmService.createEmployee({
        name: employeeName,
        department: (department as any) || "Management",
        designation: designation || "Sales Executive",
        status: "Present",
      });

      setSuccessMessage(true);
      setTimeout(() => {
        router.push("/hrm");
      }, 1400);
    } catch (err) {
      console.error("Failed to add employee:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 pb-12 select-none">
      {/* Top Title & Subtitle */}
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
          Add Employees
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
          Create a new employee profile and add their information to the HRM system.
        </p>
      </div>

      {/* Centered Form Container */}
      <div className="mx-auto w-full max-w-[560px] flex flex-col gap-5 pt-2">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Card Form Box */}
          <div className="bg-white rounded-2xl border border-gray-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.03)] overflow-hidden">
            {/* Header */}
            <div className="py-3 px-4 text-center border-b border-gray-100 bg-white">
              <h3 className="text-xs sm:text-sm font-semibold text-gray-800">
                Add Employee
              </h3>
            </div>

            {/* Form Fields with Exact Spacing */}
            <div className="p-6 flex flex-col gap-4">
              {/* 1. Employee Name */}
              <div>
                <label className="text-xs font-bold text-gray-800 block mb-1.5">
                  Employee Name
                </label>
                <input
                  type="text"
                  required
                  value={employeeName}
                  onChange={(e) => setEmployeeName(e.target.value)}
                  placeholder="Enter employee name"
                  className="w-full border border-gray-200 focus:border-amber-400 rounded-xl px-4 py-2.5 text-xs text-gray-800 placeholder:text-gray-400 bg-white focus:outline-none transition-colors"
                />
              </div>

              {/* 2. Phone Number */}
              <div>
                <label className="text-xs font-bold text-gray-800 block mb-1.5">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Enter supplier phone number"
                  className="w-full border border-gray-200 focus:border-amber-400 rounded-xl px-4 py-2.5 text-xs text-gray-800 placeholder:text-gray-400 bg-white focus:outline-none transition-colors"
                />
              </div>

              {/* 3. Email Address */}
              <div>
                <label className="text-xs font-bold text-gray-800 block mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                  placeholder="Enter email address"
                  className="w-full border border-gray-200 focus:border-amber-400 rounded-xl px-4 py-2.5 text-xs text-gray-800 placeholder:text-gray-400 bg-white focus:outline-none transition-colors"
                />
              </div>

              {/* 4. Department */}
              <div className="relative">
                <label className="text-xs font-bold text-gray-800 block mb-1.5">
                  Department
                </label>
                <button
                  type="button"
                  onClick={() => setIsDepartmentOpen(!isDepartmentOpen)}
                  className="w-full border border-gray-200 hover:border-gray-300 rounded-xl px-4 py-2.5 text-xs bg-white flex items-center justify-between transition-colors cursor-pointer"
                >
                  <span className={department ? "text-gray-800 font-medium" : "text-gray-400"}>
                    {department || "Select employee department"}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>

                {isDepartmentOpen && (
                  <div className="absolute top-full mt-1 left-0 right-0 bg-white border border-gray-100 rounded-xl shadow-lg py-1 z-30">
                    {departments.map((dept) => (
                      <button
                        key={dept}
                        type="button"
                        onClick={() => {
                          setDepartment(dept);
                          setIsDepartmentOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-xs hover:bg-amber-50 hover:text-[#F4B41A] ${
                          department === dept ? "font-bold text-[#F4B41A]" : "text-gray-700"
                        }`}
                      >
                        {dept}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* 5. Designation */}
              <div>
                <label className="text-xs font-bold text-gray-800 block mb-1.5">
                  Designation
                </label>
                <input
                  type="text"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  placeholder="Select employee designation"
                  className="w-full border border-gray-200 focus:border-amber-400 rounded-xl px-4 py-2.5 text-xs text-gray-800 placeholder:text-gray-400 bg-white focus:outline-none transition-colors"
                />
              </div>

              {/* 6. Upload Image Box */}
              <div>
                <label className="w-full border border-gray-200 hover:border-gray-300 rounded-xl py-6 flex items-center justify-center gap-2.5 text-xs font-medium text-gray-700 hover:bg-gray-50/70 transition-colors cursor-pointer">
                  <input type="file" accept="image/*" className="hidden" />
                  <CloudUpload className="w-5 h-5 text-gray-700" />
                  <span>Upload Image</span>
                </label>
              </div>
            </div>
          </div>

          {/* Success Alert */}
          {successMessage && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-700 flex items-center justify-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Employee added successfully! Redirecting to employee list...</span>
            </div>
          )}

          {/* Action Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-[#F4B41A] hover:bg-[#E5A612] text-white font-bold rounded-xl text-xs sm:text-sm transition-all shadow-xs text-center cursor-pointer disabled:opacity-60"
          >
            {isSubmitting ? "Adding Employee..." : "Add Employee"}
          </button>
        </form>
      </div>
    </div>
  );
}

