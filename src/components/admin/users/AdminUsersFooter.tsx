
interface AdminUsersFooterProps {
  userCount: number;
}

const AdminUsersFooter = ({ userCount }: AdminUsersFooterProps) => {
  return (
    <div className="mt-4 text-sm text-gray-500">
      Всего пользователей: {userCount}
    </div>
  );
};

export default AdminUsersFooter;
