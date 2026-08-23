import { useOrderContext } from '../providers/OrderProvider';

export const useOrder = () => {
  const { order, isLoading, isRefreshing, error, fetchOrder, refreshOrder } = useOrderContext();
  return { order, isLoading, isRefreshing, error, fetchOrder, refreshOrder };
};
