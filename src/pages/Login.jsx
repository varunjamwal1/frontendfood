import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Please enter email and password');
      return;
    }

    setLoading(true);

    try {
      const result = await login(email, password);

      if (result.success) {
        toast.success('Login successful!');
        if (result.role === 'owner') navigate('/owner');
        else if (result.role === 'staff') navigate('/staff');
        else navigate('/');
      } else {
        toast.error(result.message || 'Invalid credentials');
      }
    } catch (error) {
      toast.error('Server error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-[#fcf9f4]">
      {/* LEFT SIDE */}
      <div className="hidden lg:flex flex-col justify-between p-16 bg-[#4e342e] text-white">
        <div>
          <h1 className="text-2xl italic font-serif">Varun Cafe</h1>
        </div>

        <div className="max-w-md">
          <span className="text-xs tracking-widest uppercase bg-green-900/30 px-3 py-1 rounded-full">
            Estate Selection
          </span>
          <h2 className="text-5xl font-serif mt-6 leading-tight">
            A sanctuary for the sensory.
          </h2>
          <p className="mt-4 text-gray-200">
            Experience curated coffee and reads tailored to your taste.
          </p>
        </div>

        <div className="text-sm opacity-70">
          EST. 2024 · SINGLE ORIGIN FOCUS
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <h2 className="text-4xl font-serif text-[#361f1a] mb-2">Sign In</h2>
          <p className="text-gray-500 mb-8">
            Enter your credentials to access your account.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* EMAIL */}
            <div>
              <label className="text-xs uppercase tracking-widest text-gray-500">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="curator@tactile.com"
                className="w-full mt-2 px-4 py-4 bg-gray-200 rounded-xl focus:ring-2 focus:ring-[#361f1a] outline-none"
                required
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label className="text-xs uppercase tracking-widest text-gray-500">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full mt-2 px-4 py-4 bg-gray-200 rounded-xl focus:ring-2 focus:ring-[#361f1a] outline-none"
                required
              />
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#361f1a] text-white rounded-xl font-bold hover:opacity-90 transition"
            >
              {loading ? 'Logging in...' : 'Log In'}
            </button>
          </form>

          
        </div>
      </div>
    </div>
  );
}