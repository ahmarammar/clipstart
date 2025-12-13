"use client";

import { useState, useTransition } from "react";
import { updateProfileAction } from "@/lib/actions/auth.actions";
import { useRouter } from "next/navigation";

interface MyInformationFormProps {
  initialName: string;
  email: string;
  role: string;
}

export function MyInformationForm({ initialName, email, role }: MyInformationFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState(initialName);
  const [isEditingName, setIsEditingName] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const hasChanges = name !== initialName;

  const handleSave = () => {
    if (!hasChanges) return;

    setError(null);
    setSuccess(false);

    startTransition(async () => {
      const result = await updateProfileAction(name);

      if (result.success) {
        setSuccess(true);
        setIsEditingName(false);
        router.refresh();
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(result.error || "Failed to update profile");
      }
    });
  };

  const formatRole = (role: string) => {
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  return (
    <div className="p-8">
      <h1 className="text-[1.625rem] leading-none font-bold text-white mb-10">My Information</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5.5 gap-y-6">
        <div className="flex flex-col gap-2.5">
          <label className="text-[1.125rem] font-medium leading-[1.688rem] text-white">Name</label>
          <div className="relative">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={!isEditingName}
              className="w-full h-13.5 px-3.5 py-3 bg-[#1A2336] border font-normal border-[#2C3751] rounded-xl text-[#939292] text-[1.125rem] leading-[1.406rem] focus:outline-none focus:border-[#5079F0] disabled:cursor-default transition-colors"
            />
            <button
              type="button"
              onClick={() => setIsEditingName(!isEditingName)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-[#5079F0] hover:bg-[#5079F0]/80 rounded-md transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M10.0779 1.16699L12.8337 3.92283L11.0112 5.74533L8.25537 2.98949L10.0779 1.16699Z"
                  fill="white"
                />
                <path
                  d="M1.16699 10.0781L7.37866 3.86644L10.1345 6.62228L3.92283 12.8339H1.16699V10.0781Z"
                  fill="white"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-2.5">
          <label className="text-[1.125rem] font-medium leading-[1.688rem] text-white">E-Mail</label>
          <div className="relative">
            <input
              type="email"
              value={email}
              disabled
              className="w-full h-13.5 px-3.5 py-3 bg-[#1A2336] border font-normal border-[#2C3751] rounded-xl text-[#939292] text-[1.125rem] leading-[1.406rem] focus:outline-none focus:border-[#5079F0] disabled:cursor-default transition-colors"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2.5">
          <label className="text-[1.125rem] font-medium leading-[1.688rem] text-white">Role</label>
          <div className="relative">
            <input
              type="text"
              value={formatRole(role)}
              disabled
              className="w-full h-13.5 px-3.5 py-3 bg-[#1A2336] border font-normal border-[#2C3751] rounded-xl text-[#939292] text-[1.125rem] leading-[1.406rem] focus:outline-none focus:border-[#5079F0] disabled:cursor-default transition-colors"
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-6">
          <p className="text-sm text-[#FFBABE]">{error}</p>
        </div>
      )}
      {success && (
        <div className="mt-6">
          <p className="text-sm text-[#B6D8F5]">Profile updated successfully!</p>
        </div>
      )}

      <div className="mt-8 flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          disabled={!hasChanges || isPending}
          className="h-9.75 px-3 py-1.5 bg-[linear-gradient(135deg,#1C0E4C_0%,#1C0E4C_70.71%)] border border-[#2D3A5A3B] disabled:opacity-50 disabled:cursor-not-allowed text-white/40 leading-[1.688rem] text-base font-bold rounded-lg transition-colors"
        >
          {isPending ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
