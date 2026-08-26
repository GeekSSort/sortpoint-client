"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, CheckCircle2 } from "lucide-react";
import { RoleService } from "@/services";

export default function AddUserPage() {
  const router = useRouter();

  // Form State
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [isEmployeeOpen, setIsEmployeeOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [role, setRole] = useState("");
  const [isRoleOpen, setIsRoleOpen] = useState(false);
  const [department, setDepartment] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);

  const employeeList = [
    { name: "Ahmed Rahman", phone: "+880 1712-456 890", email: "info@abctraders.com", dept: "Management" },
    { name: "Hasan Mahmud", phone: "+880 1712-456 890", email: "info@abctraders.com", dept: "HR" },
    { name: "Imran Hossain", phone: "+880 1712-456 890", email: "info@abctraders.com", dept: "Sales" },
  ];

  const roleList = [
    "CEO",
    "GM",
    "Manager",
    "Branch Manager",
    "Cashier",
    "HR",
    "Technical",
  ];

  const handleSelectEmployee = (emp: { name: string; phone: string; email: string; dept: string }) => {
    setSelectedEmployee(emp.name);
    setPhoneNumber(emp.phone);
    setEmailAddress(emp.email);
    setDepartment(emp.dept);
    setIsEmployeeOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmployee && !emailAddress) return;

    setIsSubmitting(true);
    try {
      await RoleService.createUser({
        name: selectedEmployee || "New User",
        phone: phoneNumber || "+880 1712-456 890",
        mail: emailAddress || "info@abctraders.com",
        role: role || "Cashier",
        status: "Active",
      });

      setSuccessMessage(true);
      setTimeout(() => {
        router.push("/roles-permissions");
      }, 1400);
    } catch (err) {
      console.error("Failed to add user:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 pb-12 select-none">
      {/* Top Title & Subtitle */}
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
          Add User
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
          Create a new user account and assign their role, branch, and system access.
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
                Add User
              </h3>
            </div>

            {/* Form Fields with Exact Spacing */}
            <div className="p-6 flex flex-col gap-4">
              {/* 1. Select Employee */}
              <div className="relative">
                <label className="text-xs font-bold text-gray-800 block mb-1.5">
                  Select Employee
                </label>
                <button
                  type="button"
                  onClick={() => setIsEmployeeOpen(!isEmployeeOpen)}
                  className="w-full border border-gray-200 hover:border-gray-300 rounded-xl px-4 py-2.5 text-xs bg-white flex items-center justify-between transition-colors cursor-pointer"
                >
                  <span className={selectedEmployee ? "text-gray-800 font-medium" : "text-gray-400"}>
                    {selectedEmployee || "Select Employee"}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>

                {isEmployeeOpen && (
                  <div className="absolute top-full mt-1 left-0 right-0 bg-white border border-gray-100 rounded-xl shadow-lg py-1 z-30">
                    {employeeList.map((emp) => (
                      <button
                        key={emp.name}
                        type="button"
                        onClick={() => handleSelectEmployee(emp)}
                        className={`w-full text-left px-4 py-2 text-xs hover:bg-amber-50 hover:text-[#F4B41A] ${
                          selectedEmployee === emp.name ? "font-bold text-[#F4B41A]" : "text-gray-700"
                        }`}
                      >
                        {emp.name}
                      </button>
                    ))}
                  </div>
                )}
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

              {/* 4. Role */}
              <div className="relative">
                <label className="text-xs font-bold text-gray-800 block mb-1.5">
                  Role
                </label>
                <button
                  type="button"
                  onClick={() => setIsRoleOpen(!isRoleOpen)}
                  className="w-full border border-gray-200 hover:border-gray-300 rounded-xl px-4 py-2.5 text-xs bg-white flex items-center justify-between transition-colors cursor-pointer"
                >
                  <span className={role ? "text-gray-800 font-medium" : "text-gray-400"}>
                    {role || "Select Role"}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>

                {isRoleOpen && (
                  <div className="absolute top-full mt-1 left-0 right-0 bg-white border border-gray-100 rounded-xl shadow-lg py-1 z-30">
                    {roleList.map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => {
                          setRole(r);
                          setIsRoleOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-xs hover:bg-amber-50 hover:text-[#F4B41A] ${
                          role === r ? "font-bold text-[#F4B41A]" : "text-gray-700"
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* 5. Department */}
              <div>
                <label className="text-xs font-bold text-gray-800 block mb-1.5">
                  Department
                </label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="Select department"
                  className="w-full border border-gray-200 focus:border-amber-400 rounded-xl px-4 py-2.5 text-xs text-gray-800 placeholder:text-gray-400 bg-white focus:outline-none transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Success Alert */}
          {successMessage && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-700 flex items-center justify-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>User added successfully! Redirecting to user list...</span>
            </div>
          )}

          {/* Action Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-[#F4B41A] hover:bg-[#E5A612] text-white font-bold rounded-xl text-xs sm:text-sm transition-all shadow-xs text-center cursor-pointer disabled:opacity-60"
          >
            {isSubmitting ? "Adding User..." : "Add User"}
          </button>
        </form>
      </div>
    </div>
  );
}

