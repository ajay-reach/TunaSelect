import { Link } from 'react-router';
import { useAuth } from '@getmocha/users-service/react';
import { Fish, User, ShoppingBag, LogOut } from 'lucide-react';

export default function Header() {
  const { user, redirectToLogin, logout } = useAuth();

  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Fish className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              TunaSelect
            </span>
          </Link>

          <nav className="flex items-center space-x-6">
            {user ? (
              <>
                <Link 
                  to="/orders" 
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>My Orders</span>
                </Link>
                
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    {user.google_user_data.picture && (
                      <img 
                        src={user.google_user_data.picture} 
                        alt="Profile" 
                        className="w-8 h-8 rounded-full border-2 border-blue-200"
                      />
                    )}
                    <span className="text-sm font-medium text-gray-700">
                      {user.google_user_data.given_name || user.email}
                    </span>
                  </div>
                  
                  <button
                    onClick={logout}
                    className="flex items-center space-x-1 text-gray-500 hover:text-red-600 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm">Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <button
                onClick={redirectToLogin}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full transition-colors font-medium"
              >
                <User className="w-4 h-4" />
                <span>Sign In</span>
              </button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
