import { UserAvatar } from "@/components/atoms/user-avatar"
import { Button } from "@/components/ui/button"
import type { User } from "@/types/user-management"

interface NewUserProfileTabProps {
  tabName: string
  user: User
}

export function NewUserProfileTab({ user }: NewUserProfileTabProps) {
  return (
    <div className="p-8 h-full overflow-auto">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Profile Section */}
        <div>
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Profile</h2>
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-4">
              <UserAvatar name={user.name} src={user.profileImage} size="lg" />
              <div>
                <h3 className="font-semibold text-xl text-gray-900">{user.name}</h3>
                <p className="text-gray-600">{user.email}</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <Button className="bg-green-500 hover:bg-green-600 text-white rounded-full px-6 py-2">See Image</Button>
              <Button className="bg-green-500 hover:bg-green-600 text-white rounded-full px-6 py-2">
                Remove Image
              </Button>
              <Button className="bg-green-500 hover:bg-green-600 text-white rounded-full px-6 py-2">
                Change Image
              </Button>
            </div>
          </div>
        </div>

        {/* Account Details */}
        <div>
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Account Details</h2>
          <div className="space-y-0">
            {/* Email */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h4 className="font-medium text-gray-900 text-lg">Email</h4>
                <p className="text-gray-600">{user.email}</p>
              </div>
              <Button className="bg-green-500 hover:bg-green-600 text-white rounded-full px-6 py-2">Change</Button>
            </div>

            {/* Password */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h4 className="font-medium text-gray-900 text-lg">Password</h4>
                <p className="text-gray-600">••••••••••••</p>
              </div>
              <Button className="bg-green-500 hover:bg-green-600 text-white rounded-full px-6 py-2">Change</Button>
            </div>

            {/* Name */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h4 className="font-medium text-gray-900 text-lg">Name</h4>
                <p className="text-gray-600">{user.name}</p>
              </div>
              <Button className="bg-green-500 hover:bg-green-600 text-white rounded-full px-6 py-2">Change</Button>
            </div>

            {/* Role */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h4 className="font-medium text-gray-900 text-lg">Role</h4>
                <p className="text-gray-600">{user.role.name}</p>
              </div>
              <Button className="bg-green-500 hover:bg-green-600 text-white rounded-full px-6 py-2">Change</Button>
            </div>
          </div>
        </div>

        {/* Newsletter Preferences */}
        <div>
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Newsletter Preferences</h2>
          <div className="p-6 border border-gray-200 rounded-lg">
            <p className="text-gray-600">Newsletter preferences settings will be displayed here.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
