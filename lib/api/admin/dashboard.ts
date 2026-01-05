import api from "../index";

interface DashboardStats {
  totalProducts: number;
  totalUsers: number;
  ordersToday: number;
  pendingOrders: number;
}

let cachedStats: DashboardStats | null = null;

const fetchDashboardStats = async (): Promise<DashboardStats> => {
  if (cachedStats) {
    return cachedStats;
  }
  try {
    const response = await api.get("/admin/dashboard/stats");
    cachedStats = response.data.data; // Assuming data is nested under 'data' key
    return cachedStats;
  } catch (error: any) {
    throw error.response?.data?.message || error.message;
  }
};

export const getTotalProducts = async (): Promise<number> => {
  const stats = await fetchDashboardStats();
  return stats.totalProducts;
};

export const getOrdersToday = async (): Promise<number> => {
  const stats = await fetchDashboardStats();
  return stats.ordersToday;
};

export const getPendingOrders = async (): Promise<number> => {
  const stats = await fetchDashboardStats();
  return stats.pendingOrders;
};

export const getTotalUsers = async (): Promise<number> => {
  const stats = await fetchDashboardStats();
  return stats.totalUsers;
};

// Function to clear cached stats, useful for re-fetching data when needed
export const clearCachedDashboardStats = () => {
  cachedStats = null;
};