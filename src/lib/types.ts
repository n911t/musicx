export interface Project {
  id: string
  serial: number
  project_name: string
  project_location: string
  building_type: 'عمودي' | 'افقي' | null
  building_count: number | null
  apartment_count: number | null
  floor_count: number | null
  approved_plans: boolean | null
  bidder: string
  bid_issue_date: string | null
  bid_validity_date: string | null
  new_bid_issue: string
  authorized_person: string
  phone: string
  result: string
  notes: string
  has_notes: boolean
  bid_link: string
  user_id: string
  created_at: string
  updated_at: string
  created_by_name: string
}

export type ProjectFormData = Omit<Project, 'id' | 'serial' | 'user_id' | 'created_at' | 'updated_at' | 'created_by_name'>
