
import { Card, CardContent } from "@/components/ui/card";
import AdminUsersHeader from "./AdminUsersHeader";
import AdminUsersSearch from "./AdminUsersSearch";
import AdminUsersFilters from "./AdminUsersFilters";
import AdminUsersStats from "./AdminUsersStats";
import AdminUsersActions from "./AdminUsersActions";
import AdminUsersQuickActions from "./AdminUsersQuickActions";
import AdminUsersLoading from "./AdminUsersLoading";
import AdminUsersTableContent from "./AdminUsersTableContent";
import AdminUsersPagination from "./AdminUsersPagination";
import UserBlockingNotification from "./UserBlockingNotification";
import UserRoleNotification from "./UserRoleNotification";
import { useUsersManagement } from "@/hooks/useUsersManagement";
import { useNotificationHandlers } from "@/hooks/useNotificationHandlers";

const AdminUsersTable = () => {
  const {
    users,
    userStats,
    totalCount,
    totalPages,
    isLoading,
    searchTerm,
    roleFilter,
    statusFilter,
    currentPage,
    pageSize,
    selectedUsers,
    allUsers,
    setSearchTerm,
    setRoleFilter,
    setStatusFilter,
    handleClearFilters,
    handlePageChange,
    handlePageSizeChange,
    handleUserSelection,
    handleSelectAll,
    setSelectedUsers,
    refetch
  } = useUsersManagement();

  const { handleNotificationSent } = useNotificationHandlers();

  const handleUserUpdated = () => {
    refetch();
  };

  if (isLoading && !users.length) {
    return <AdminUsersLoading />;
  }

  return (
    <div className="space-y-6">
      {/* Компоненты уведомлений */}
      <UserBlockingNotification 
        onNotificationSent={(type, email) => handleNotificationSent(type, email)} 
      />
      <UserRoleNotification 
        onNotificationSent={(email, oldRole, newRole) => handleNotificationSent('role_change', email, oldRole, newRole)} 
      />
      
      <Card>
        <AdminUsersHeader />
        <CardContent>
          <AdminUsersStats stats={userStats} />
          
          <AdminUsersActions onUserCreated={handleUserUpdated} />
          
          <AdminUsersSearch 
            searchTerm={searchTerm} 
            onSearchChange={setSearchTerm} 
          />
          
          <AdminUsersFilters
            onRoleFilter={setRoleFilter}
            onStatusFilter={setStatusFilter}
            onClearFilters={handleClearFilters}
            totalUsers={allUsers.length}
            filteredUsers={totalCount}
          />

          <AdminUsersQuickActions
            selectedUsers={selectedUsers}
            onActionComplete={handleUserUpdated}
            onClearSelection={() => setSelectedUsers([])}
          />
          
          <AdminUsersTableContent 
            users={users} 
            selectedUsers={selectedUsers}
            onUserUpdated={handleUserUpdated}
            onUserSelection={handleUserSelection}
            onSelectAll={handleSelectAll}
            isLoading={isLoading}
          />
          
          <AdminUsersPagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalUsers={totalCount}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUsersTable;
