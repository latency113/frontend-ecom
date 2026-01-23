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
    if (!response.data.data) {
      throw new Error("Dashboard stats data is missing from the API response.");
    }
    const stats: DashboardStats = response.data.data; // Enforce type here
    cachedStats = stats;
    return stats;
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



export const getRevenueReport = async () => {

  try {

    const response = await api.get("/admin/dashboard/revenue");

    return response.data.data;

  } catch (error: any) {

    throw error.response?.data?.message || error.message;

  }

};
