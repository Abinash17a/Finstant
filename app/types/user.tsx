export interface UserProfile {
  first_name?: string;
  last_name?: string;
  email?: string;
  avatar_url?: string;
  position?: string;
  base_salary?: string;
  monthly_budget?: string;
  address?: string;
  zip_code?: string;
  country?: string;
  created_at?: string;
  department?: string;
  phone_number?: string;
}

export interface EditedProfile {
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  position?: string;
  base_salary?: string;
  monthly_budget?: string;
  address?: string;
  zip_code?: string;
  country?: string;
  department?: string;
  phone_number?: string;
}