import { Link } from 'react-router-dom';
import { Calculator, UserCircle, FileText, ArrowDownToLine, Info } from 'lucide-react';
import Navbar from '../components/Navbar';
import taxSlabImage from '../assets/image.jpg'; // Make sure this image is in /src/assets/

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to EZTax!
          </h1>
          <p className="text-xl text-gray-600">
            Simplify Your Taxes, Maximize Your Savings!
          </p>
        </div>

        {/* Navigation Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
          <Link
            to="/calculator"
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center mb-4">
              <Calculator className="w-8 h-8 text-emerald-500 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-900">Tax Calculator</h2>
            </div>
            <p className="text-gray-600">
              Calculate your taxes under both new (2025) and old regimes. Get detailed breakdowns
              and analysis.
            </p>
          </Link>

          <Link
            to="/profile"
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center mb-4">
              <UserCircle className="w-8 h-8 text-emerald-500 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-900">Profile</h2>
            </div>
            <p className="text-gray-600">
              Update your personal details, manage your account settings.
            </p>
          </Link>
        </div>

                {/* How to Use Section */}
                <div className="bg-white p-8 rounded-lg shadow max-w-5xl mx-auto mb-12">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">How to Use EZTax</h2>
          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div>
              <UserCircle className="w-10 h-10 mx-auto text-emerald-600 mb-2" />
              <p className="font-semibold">1. Complete Profile</p>
              <p className="text-sm text-gray-600">Enter your age, location, and basic details.</p>
            </div>
            <div>
              <Calculator className="w-10 h-10 mx-auto text-emerald-600 mb-2" />
              <p className="font-semibold">2. Add Income Info</p>
              <p className="text-sm text-gray-600">Enter salary, deductions, and allowances.</p>
            </div>
            <div>
              <FileText className="w-10 h-10 mx-auto text-emerald-600 mb-2" />
              <p className="font-semibold">3. View Tax Summary</p>
              <p className="text-sm text-gray-600">See your total tax, regime-wise breakdown.</p>
            </div>
            <div>
              <ArrowDownToLine className="w-10 h-10 mx-auto text-emerald-600 mb-2" />
              <p className="font-semibold">4. Download PDF</p>
              <p className="text-sm text-gray-600">Get a downloadable tax summary instantly.</p>
            </div>
          </div>
        </div>

      <div className="max-w-4xl mx-auto mt-12">
  <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
    Tax Slabs Comparison (Old vs New Regime)
  </h2>
  <div className="overflow-x-auto">
    <table className="min-w-full bg-white rounded-lg shadow overflow-hidden">
      <thead>
        <tr className="bg-emerald-100 text-gray-700 text-left">
          <th className="px-6 py-4">Income Range</th>
          <th className="px-6 py-4">Old Regime</th>
          <th className="px-6 py-4">New Regime (2025)</th>
        </tr>
      </thead>
      <tbody className="text-gray-700">
        <tr className="border-b">
          <td className="px-6 py-3">0 – ₹2.5 Lakh</td>
          <td className="px-6 py-3">0%</td>
          <td className="px-6 py-3">0%</td>
        </tr>
        <tr className="border-b bg-gray-50">
          <td className="px-6 py-3">₹2.5 – ₹5 Lakh</td>
          <td className="px-6 py-3">5%</td>
          <td className="px-6 py-3">5%</td>
        </tr>
        <tr className="border-b">
          <td className="px-6 py-3">₹5 – ₹7.5 Lakh</td>
          <td className="px-6 py-3">20%</td>
          <td className="px-6 py-3">10%</td>
        </tr>
        <tr className="border-b bg-gray-50">
          <td className="px-6 py-3">₹7.5 – ₹10 Lakh</td>
          <td className="px-6 py-3">20%</td>
          <td className="px-6 py-3">15%</td>
        </tr>
        <tr className="border-b">
          <td className="px-6 py-3">₹10 – ₹12.5 Lakh</td>
          <td className="px-6 py-3">30%</td>
          <td className="px-6 py-3">20%</td>
        </tr>
        <tr className="border-b bg-gray-50">
          <td className="px-6 py-3">₹12.5 – ₹15 Lakh</td>
          <td className="px-6 py-3">30%</td>
          <td className="px-6 py-3">25%</td>
        </tr>
        <tr>
          <td className="px-6 py-3">Above ₹15 Lakh</td>
          <td className="px-6 py-3">30%</td>
          <td className="px-6 py-3">30%</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>

        {/* Learn More */}
        <div className="text-center mt-16">
          <p className="text-lg text-gray-700 mb-2 flex items-center justify-center gap-2">
            <Info className="inline-block text-blue-500" />
            Want to learn more about taxes?
          </p>
          <a
            href="https://incometaxindia.gov.in/Pages/tutorials.aspx"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline hover:text-blue-800"
          >
            Visit the official Income Tax Department Website
          </a>
        </div>
      </main>
    </div>
  );
}
