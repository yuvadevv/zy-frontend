import { useOrderContext } from '../providers/OrderProvider';

export const useTracking = () => {
  const { tracking, isLoading, error } = useOrderContext();
  return { tracking, isLoading, error };
};
