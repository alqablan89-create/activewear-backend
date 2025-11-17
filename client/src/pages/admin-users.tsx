import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, ShoppingBag, MapPin, Calendar, Mail, Shield } from "lucide-react";
import { format } from "date-fns";
import { apiRequest } from "@/lib/queryClient";

interface User {
  id: string;
  username: string;
  fullName: string | null;
  isAdmin: boolean;
  createdAt: string;
  orderCount: number;
}

interface Order {
  id: string;
  status: string;
  total: string;
  discountAmount: string;
  customerName: string;
  customerEmail: string | null;
  customerPhone: string | null;
  shippingAddress: string;
  createdAt: string;
}

interface ShippingAddress {
  id: string;
  fullName: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string | null;
  isDefault: boolean;
  createdAt: string;
}

interface UserDetails extends User {
  orders: Order[];
  addresses: ShippingAddress[];
}

export default function AdminUsers() {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const { data: users, isLoading: isLoadingUsers } = useQuery<User[]>({
    queryKey: ["/api/admin/users"],
  });

  const { data: selectedUser, isLoading: isLoadingUser, isError, error } = useQuery<UserDetails>({
    queryKey: ["/api/admin/users", selectedUserId || ""],
    queryFn: async ({ queryKey }) => {
      const userId = queryKey[1] as string;
      if (!userId) throw new Error("User ID is required");
      const res = await apiRequest("GET", `/api/admin/users/${userId}`);
      return res.json();
    },
    enabled: !!selectedUserId,
    retry: false,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "shipped":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "processing":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2" data-testid="text-page-title">Users Management</h1>
        <p className="text-muted-foreground">View and manage registered users</p>
      </div>

      {isLoadingUsers ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {users?.map((user) => (
            <Card key={user.id} className="hover-elevate">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      {user.fullName || "No Name"}
                      {user.isAdmin && (
                        <Badge variant="secondary" className="text-xs">
                          <Shield className="w-3 h-3 mr-1" />
                          Admin
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <Mail className="w-3 h-3" />
                      {user.username}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <ShoppingBag className="w-4 h-4" />
                    <span>{user.orderCount} orders</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    {format(new Date(user.createdAt), "MMM d, yyyy")}
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setSelectedUserId(user.id)}
                  data-testid={`button-view-user-${user.id}`}
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!selectedUserId} onOpenChange={() => setSelectedUserId(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>Complete user information and order history</DialogDescription>
          </DialogHeader>

          {isLoadingUser ? (
            <div className="space-y-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-40 w-full" />
              <Skeleton className="h-40 w-full" />
            </div>
          ) : isError ? (
            <div className="p-8 text-center">
              <p className="text-destructive">
                Failed to load user details. {error instanceof Error ? error.message : 'Please try again.'}
              </p>
            </div>
          ) : selectedUser ? (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">User Information</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Full Name</p>
                    <p className="font-medium" data-testid="text-user-fullname">
                      {selectedUser.fullName || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email/Phone</p>
                    <p className="font-medium" data-testid="text-user-username">
                      {selectedUser.username}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Account Type</p>
                    <p className="font-medium">
                      {selectedUser.isAdmin ? (
                        <Badge variant="secondary">
                          <Shield className="w-3 h-3 mr-1" />
                          Administrator
                        </Badge>
                      ) : (
                        <Badge variant="outline">Customer</Badge>
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Member Since</p>
                    <p className="font-medium">
                      {format(new Date(selectedUser.createdAt), "MMMM d, yyyy")}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5" />
                  Order History ({selectedUser.orders.length})
                </h3>
                {selectedUser.orders.length === 0 ? (
                  <Card>
                    <CardContent className="py-8 text-center text-muted-foreground">
                      No orders yet
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-3">
                    {selectedUser.orders.map((order) => (
                      <Card key={order.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <p className="font-medium" data-testid={`text-order-id-${order.id}`}>
                                Order #{order.id.slice(0, 8)}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {format(new Date(order.createdAt), "MMM d, yyyy 'at' h:mm a")}
                              </p>
                            </div>
                            <div className="text-right space-y-1">
                              <Badge className={getStatusColor(order.status)}>
                                {order.status}
                              </Badge>
                              <p className="font-semibold">${parseFloat(order.total).toFixed(2)}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Saved Addresses ({selectedUser.addresses.length})
                </h3>
                {selectedUser.addresses.length === 0 ? (
                  <Card>
                    <CardContent className="py-8 text-center text-muted-foreground">
                      No saved addresses
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-3">
                    {selectedUser.addresses.map((address) => (
                      <Card key={address.id}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <p className="font-medium">{address.fullName}</p>
                                {address.isDefault && (
                                  <Badge variant="secondary" className="text-xs">Default</Badge>
                                )}
                              </div>
                              <p className="text-sm">{address.phone}</p>
                              <p className="text-sm text-muted-foreground">
                                {address.address}, {address.city}
                                {address.postalCode && `, ${address.postalCode}`}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
