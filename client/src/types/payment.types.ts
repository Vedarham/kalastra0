export interface PaymentMethod {
  id: string;
  brand: string;
  last4: string;
  expiryMonth: number;
  expiryYear: number;
  isDefault: boolean;
}
 
export interface NewCardForm {
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  name: string;
}
 
export interface CardFormProps {
  newCard: NewCardForm;
  onChange: (updated: NewCardForm) => void;
  onSubmit: () => void;
  loading: boolean;
  error: string | null;
}

export interface PaymentOptionsProps {
  total: number;
  orderId: string;
  currency?: "INR" | "USD";
  onBack: () => void;
  onSuccess?: () => void;
}
 
export const EMPTY_CARD: NewCardForm = {
  cardNumber: "",
  expiryMonth: "",
  expiryYear: "",
  cvv: "",
  name: "",
};