import { CompanyProfile } from "@/types/settings";
import { initialCompanyProfile } from "@/lib/services/settings.service";
import { apiFetch } from "./apiClient";

export class SettingsService {
  /**
   * Fetch company profile settings
   */
  static async getCompanyProfile(): Promise<CompanyProfile> {
    return apiFetch<CompanyProfile>(
      "/settings/company-profile",
      { method: "GET" },
      initialCompanyProfile
    );
  }

  /**
   * Update company profile settings
   */
  static async updateCompanyProfile(payload: Partial<CompanyProfile>): Promise<CompanyProfile> {
    const fallback = { ...initialCompanyProfile, ...payload };

    return apiFetch<CompanyProfile>(
      "/settings/company-profile",
      {
        method: "PUT",
        body: JSON.stringify(payload),
      },
      fallback
    );
  }
}
