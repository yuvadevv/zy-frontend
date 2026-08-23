import { redirect } from 'next/navigation';
import { APP_ROUTES } from '@/constants/routes';

export default function ManualsPage() {
  redirect(APP_ROUTES.MANUALS_WORKFLOW.FIND);
}

