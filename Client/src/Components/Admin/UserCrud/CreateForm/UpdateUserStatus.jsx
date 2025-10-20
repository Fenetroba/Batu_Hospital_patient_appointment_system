import React, { useState, useEffect } from 'react';
import { Switch } from "@/components/ui/switch";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { UpdateUser, fetchUserById } from "@/Stores/UserSlice";

const UpdateUserStatus = ({ userId, onStatusUpdate }) => {
  const [isActive, setIsActive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const { users } = useSelector(state => state.user);

  // Fetch user data when component mounts or userId changes
  useEffect(() => {
    const fetchUserStatus = async () => {
      if (!userId) {
        setIsLoading(false);
        return;
      }

      try {
        // First check if user exists in the users array from Redux
        const existingUser = users?.find(user => user._id === userId);
        
        if (existingUser) {
          // If user exists in Redux, use that data
          setIsActive(existingUser.isActive || existingUser.status === 'Active');
        } else {
          // If not found in Redux, try to fetch the user
          const response = await dispatch(fetchUserById(userId)).unwrap();
          if (response?.user) {
            setIsActive(response.user.isActive || response.user.status === 'Active');
          }
        }
      } catch (error) {
        console.error("Failed to fetch user status:", error);
        toast.error("Failed to load user status");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserStatus();
  }, [userId, users, dispatch]);

  const handleStatusChange = async (newStatus) => {
    if (!userId) {
      toast.error("User ID is missing");
      return;
    }

    setIsLoading(true);
    try {
      const result = await dispatch(
        UpdateUser({ 
          id: userId, 
          userData: { isActive: newStatus } 
        })
      ).unwrap();

      if (result?.success) {
        setIsActive(newStatus);
        if (onStatusUpdate) {
          onStatusUpdate(newStatus);
        }
        toast.success("User status updated successfully");
      } else {
        // Revert the switch if update fails
        setIsActive(!newStatus);
        toast.error(result?.message || "Failed to update status");
      }
    } catch (error) {
      // Revert the switch on error
      setIsActive(!newStatus);
      toast.error(error?.message || "An error occurred while updating status");
      console.error("Update status error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Switch 
        checked={isActive}
        onCheckedChange={handleStatusChange}
        disabled={!userId || isLoading}
      />
    </div>
  );
};

export default UpdateUserStatus;
