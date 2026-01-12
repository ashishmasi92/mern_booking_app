import { Link } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import SignOutButton from "./SignOutButton";

export default function Header() {
  let { isLoggedIn } = useAppContext();

  console.log(isLoggedIn);

  return (
    <div className="bg-blue-800 py-3 ">
      <div className="container mx-auto flex justify-between items-center">
        <span className="text-2xl text-white font-bold tracking-tight">
          <Link to="/">MernHoliday.com</Link>
        </span>
        <span className="flex space-x-1">
          {isLoggedIn ? (
            <>
              <Link
                className="flex items-center text-white px-2 py-1 hover:bg-blue-600"
                to="/my-bookiings"
              >
                My Bookings
              </Link>
              <Link
                className="flex items-center text-white px-2 py-1 hover:bg-blue-600 "
                to="/my-hotels"
              >
                My Hotels
              </Link>
              <SignOutButton />
            </>
          ) : (
            <Link
              to="/sign-in"
              className="flex bg-white items-center text-blue-600 px-2 font-bold hover:bg-gray-100 "
            >
              Sign In
            </Link>
          )}
        </span>
      </div>
    </div>
  );
}
