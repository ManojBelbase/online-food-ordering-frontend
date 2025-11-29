import { User, Lock, LogOut } from "lucide-react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { selectUser } from "@/features/auth/selectors";

const UserInfo = () => {
  const user = useSelector(selectUser);

  return (
    <div className="p-6">
      <div className="text-xs font-bold mb-2">MY PROFILE</div>
      <div className="flex flex-col items-center mb-4">
        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-2">
          <User className="w-10 h-10 text-blue-900" />
        </div>
        <div className="font-semibold">{user?.name}</div>
        <div className="text-xs text-gray-500">{user?.email}</div>
        <Link
          href="/profile/edit"
          className="text-green-600 text-xs mt-1 hover:underline"
        >
          Edit Profile
        </Link>
      </div>
      <hr className="my-3" />
      <div className="flex flex-col gap-3">
        <Link
          href="/orders"
          className="flex items-center gap-2 text-gray-700 hover:text-orange-600"
        >
          <Lock className="w-4 h-4" /> Order History
        </Link>
        {/* <Link
          href="/favourites"
          className="flex items-center gap-2 text-gray-700 hover:text-orange-600"
        >
          <Heart className="w-4 h-4" /> Favourites
        </Link>
        <Link
          href="/addresses"
          className="flex items-center gap-2 text-gray-700 hover:text-orange-600"
        >
          <Map className="w-4 h-4" /> Saved Addresses
        </Link> */}
      </div>
      <hr className="my-3" />
      <Link
        href="/logout"
        className="block text-center text-green-600 font-semibold hover:underline"
      >
        <div className="flex items-center justify-center gap-2">
          <LogOut className="w-4 h-4" /> Logout
        </div>
      </Link>
    </div>
  );
};

export default UserInfo;
