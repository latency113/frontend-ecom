export interface Address {
  id: string;
  userId: string;
  label?: string;
  street: string;
  city: string;
  stateProvince?: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAddressPayload {
  label?: string;
  street: string;
  city: string;
  stateProvince?: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
}

export interface UpdateAddressPayload {
  label?: string;
  street?: string;
  city?: string;
  stateProvince?: string;
  postalCode?: string;
  country?: string;
  isDefault?: boolean;
}
