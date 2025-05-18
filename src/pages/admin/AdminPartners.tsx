
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Plus, MoreHorizontal, Mail, User, Dumbbell } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock partner data
const mock_partners = [
  {
    id: "partner-1",
    name: "John Smith",
    email: "john.smith@example.com",
    created_at: "2023-04-15T14:32:17Z",
    gym_count: 2,
    status: "active"
  },
  {
    id: "partner-2",
    name: "Emily Johnson",
    email: "emily.johnson@example.com",
    created_at: "2023-05-22T09:15:43Z",
    gym_count: 1,
    status: "active"
  },
  {
    id: "partner-3",
    name: "Michael Brown",
    email: "michael.brown@example.com",
    created_at: "2023-06-10T16:28:05Z",
    gym_count: 3,
    status: "active"
  },
  {
    id: "partner-4",
    name: "Sarah Wilson",
    email: "sarah.wilson@example.com",
    created_at: "2023-07-03T11:42:19Z",
    gym_count: 1,
    status: "inactive"
  },
  {
    id: "partner-5",
    name: "David Lee",
    email: "david.lee@example.com",
    created_at: "2023-08-18T15:09:37Z",
    gym_count: 2,
    status: "pending"
  }
];

const AdminPartners = () => {
  const [partners, set_partners] = useState(mock_partners);
  const [search_query, set_search_query] = useState("");
  const [filter_status, set_filter_status] = useState("all");
  const [is_add_dialog_open, set_is_add_dialog_open] = useState(false);
  const [new_partner, set_new_partner] = useState({
    name: "",
    email: "",
  });
  const { toast } = useToast();

  const handle_search = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const filtered = mock_partners.filter(
      (partner) =>
        partner.name.toLowerCase().includes(search_query.toLowerCase()) ||
        partner.email.toLowerCase().includes(search_query.toLowerCase())
    );
    set_partners(filtered);
  };

  const handle_status_filter = (status: string) => {
    set_filter_status(status);
    if (status === "all") {
      set_partners(mock_partners);
    } else {
      const filtered = mock_partners.filter((partner) => partner.status === status);
      set_partners(filtered);
    }
  };

  const handle_add_partner = () => {
    // In a real application, this would connect to Supabase to create a partner
    const new_id = `partner-${Date.now()}`;
    const new_created = new Date().toISOString();
    
    const new_partner_record = {
      id: new_id,
      name: new_partner.name,
      email: new_partner.email,
      created_at: new_created,
      gym_count: 0,
      status: "pending"
    };
    
    set_partners([new_partner_record, ...partners]);
    set_new_partner({ name: "", email: "" });
    set_is_add_dialog_open(false);
    
    toast({
      title: "Partner Invitation Sent",
      description: `Invitation email sent to ${new_partner.email}`,
    });
  };

  const handle_send_invitation = (partner_id: string) => {
    const partner = partners.find((p) => p.id === partner_id);
    if (partner) {
      toast({
        title: "Invitation Resent",
        description: `Invitation email resent to ${partner.email}`,
      });
    }
  };

  const format_date = (date_string: string) => {
    const date = new Date(date_string);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const get_status_badge = (status: string) => {
    switch (status) {
      case "active":
        return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Active</span>;
      case "inactive":
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">Inactive</span>;
      case "pending":
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">Pending</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">{status}</span>;
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Partner Management</h1>
        <Dialog open={is_add_dialog_open} onOpenChange={set_is_add_dialog_open}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" /> Add Partner
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Partner</DialogTitle>
              <DialogDescription>
                Invite a new gym owner to join as a partner. They'll receive an email invitation.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Full Name
                </label>
                <Input
                  id="name"
                  value={new_partner.name}
                  onChange={(e) => set_new_partner({ ...new_partner, name: e.target.value })}
                  placeholder="Enter full name"
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  value={new_partner.email}
                  onChange={(e) => set_new_partner({ ...new_partner, email: e.target.value })}
                  placeholder="partner@example.com"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => set_is_add_dialog_open(false)}>
                Cancel
              </Button>
              <Button onClick={handle_add_partner} disabled={!new_partner.name || !new_partner.email}>
                Send Invitation
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <form onSubmit={handle_search} className="relative sm:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                type="text"
                placeholder="Search partners..."
                value={search_query}
                onChange={(e) => set_search_query(e.target.value)}
                className="pl-10"
              />
            </form>
            <div className="flex gap-2">
              <Select value={filter_status} onValueChange={handle_status_filter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Partners</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={() => {
                set_search_query("");
                set_filter_status("all");
                set_partners(mock_partners);
              }}>
                Reset
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {partners.length > 0 ? (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Gyms</TableHead>
                  <TableHead>Added</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {partners.map((partner) => (
                  <TableRow key={partner.id}>
                    <TableCell className="font-medium">{partner.name}</TableCell>
                    <TableCell>{partner.email}</TableCell>
                    <TableCell>{get_status_badge(partner.status)}</TableCell>
                    <TableCell>{partner.gym_count}</TableCell>
                    <TableCell>{format_date(partner.created_at)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handle_send_invitation(partner.id)}>
                            <Mail className="h-4 w-4 mr-2" />
                            Send Invitation
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <User className="h-4 w-4 mr-2" />
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Dumbbell className="h-4 w-4 mr-2" />
                            Manage Gyms
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            Deactivate Partner
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="flex items-center justify-between border-t p-4">
            <div className="text-sm text-gray-500">
              Showing {partners.length} of {mock_partners.length} partners
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm" disabled>
                Next
              </Button>
            </div>
          </CardFooter>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-8 flex flex-col items-center justify-center">
            <User className="h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-xl font-medium mb-2">No partners found</h3>
            <p className="text-gray-500 text-center mb-4">
              No partners match your current search or filter criteria.
            </p>
            <Button onClick={() => {
              set_search_query("");
              set_filter_status("all");
              set_partners(mock_partners);
            }}>
              Reset Filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminPartners;
