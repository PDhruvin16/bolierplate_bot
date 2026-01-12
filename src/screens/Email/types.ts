export interface EmailsItem {
  id: string;
  subject: string;
  from: string;
  to: string;
  regarding: string;
  priority?: { value: string; label: string };
  status: { value: string; label: string };
  selected?: boolean;
  icon?: string;
}
