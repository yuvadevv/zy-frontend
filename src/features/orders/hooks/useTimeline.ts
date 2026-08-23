import { useOrderContext } from '../providers/OrderProvider';

export const useTimeline = () => {
  const { timeline, isLoading, error } = useOrderContext();
  return { timeline, isLoading, error };
};
