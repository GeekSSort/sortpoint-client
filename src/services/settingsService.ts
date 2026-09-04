import { CompanyProfile } from "@/types/settings";
import { initialCompanyProfile } from "@/lib/services/settings.service";
import { toCompanyProfile, toOrganizationPayload, organizationId } from "./mappers/settings";
import { apiFetch } from "./apiClient";

export class SettingsService {
  /**
   * Fetch company profile settings
   */
  static async getCompanyProfile(): Promise<CompanyProfile> {
    // A list of one, with organization field names. Mapped, so every input
    // gets a string and stays controlled.
    const rows = await apiFetch<any>("/organizations/", { method: "GET" }, null);
    return toCompanyProfile(rows, initialCompanyProfile);
  }

  /**
   * Update company profile settings
   */
  static async updateCompanyProfile(payload: Partial<CompanyProfile>): Promise<CompanyProfile> {
    const rows = await apiFetch<any>("/organizations/", { method: "GET" }, null);
    const id = organizationId(rows);
    if (!id) return { ...initialCompanyProfile, ...payload };

    const saved = await apiFetch<any>(`/organizations/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(toOrganizationPayload(payload)),
    });
    return toCompanyProfile(saved, { ...initialCompanyProfile, ...payload } as CompanyProfile);
  }
}
