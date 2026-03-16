import { useEffect, useState } from "react";
import Card from "../../components/Card";
import LoadingSpinner from "../../components/LoadingSpinner";
import { approveUser, fetchUsers } from "../../services/api";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const load = () =>
    fetchUsers()
      .then((res) => setUsers(res.data))
      .finally(() => setLoading(false));

  useEffect(() => {
    load();
  }, []);

  const setApproval = async (id, status) => {
    await approveUser(id, status);
    load();
  };

  if (loading) return <LoadingSpinner />;

  return (
    <main className="max-w-5xl mx-auto px-4 py-10 space-y-6">
      <h1 className="text-2xl font-bold">User Approvals</h1>
      <Card className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              {["Name", "Grade", "Governorate", "School", "Status", "Actions"].map((h) => (
                <th key={h} className="text-left px-3 py-2 font-semibold">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-b last:border-0">
                <td className="px-3 py-2 font-semibold">{u.name}</td>
                <td className="px-3 py-2">{u.grade}</td>
                <td className="px-3 py-2">{u.governorate}</td>
                <td className="px-3 py-2">{u.schoolName}</td>
                <td className="px-3 py-2">
                  {u.isApproved ? (
                    <span className="text-green-600 font-semibold">Approved</span>
                  ) : (
                    <span className="text-amber-600 font-semibold">Pending</span>
                  )}
                </td>
                <td className="px-3 py-2 space-x-2">
                  <button
                    onClick={() => setApproval(u._id, true)}
                    className="px-3 py-1 rounded-md bg-primary text-primary-foreground text-xs font-semibold"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => setApproval(u._id, false)}
                    className="px-3 py-1 rounded-md bg-destructive text-white text-xs font-semibold"
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </main>
  );
}
