import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Edit } from 'lucide-react';

const Profile = () => {
  const { currentUser } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get user initials for avatar fallback
  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Card className="overflow-hidden">
          {/* Profile Header */}
          <div className="h-32 bg-gradient-to-r from-[var(--four)] to-[var(--six)] relative">
            <div className="absolute -bottom-16 left-6">
              <Avatar className="h-32 w-32 border-4 border-white">
                <AvatarImage 
                  src={currentUser?.profileImage} 
                  alt={currentUser?.fullName || 'User'} 
                />
                <AvatarFallback className="text-2xl font-semibold bg-blue-100 text-blue-600">
                  {getInitials(currentUser?.fullName)}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>

          {/* Profile Content */}
          <CardHeader className="pt-20">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  {currentUser?.fullName || 'User Name'}
                </CardTitle>
                <p className="text-blue-600 font-medium capitalize">
                  {currentUser?.role?.toLowerCase() || 'User Role'}
                </p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2"
                onClick={() => navigate('/settings')}
              >
                <Edit className="h-4 w-4" />
                Edit Profile
              </Button>
            </div>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-gray-900">{currentUser?.email || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="text-gray-900">{currentUser?.phone || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Member Since</p>
                    <p className="text-gray-900">
                      {currentUser?.createdAt 
                        ? new Date(currentUser.createdAt).toLocaleDateString() 
                        : 'N/A'
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Department</p>
                    <p className="text-gray-900">
                      {currentUser?.department || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      currentUser?.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {currentUser?.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;