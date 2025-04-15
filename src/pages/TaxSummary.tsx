// import React, { useEffect, useState, useRef } from 'react';
// import { supabase } from '../lib/supabase';
// import jsPDF from 'jspdf';
// import html2canvas from 'html2canvas';
// import Navbar from '../components/Navbar';
// import { useNavigate } from 'react-router-dom';
// import { calculateTaxBreakdown, TaxCalculationForm } from '../lib/taxUtils';

// export default function TaxSummary() {
//   const [taxData, setTaxData] = useState<any>(null);
//   const pdfRef = useRef<HTMLDivElement>(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchTaxData = async () => {
//       const { data: { user } } = await supabase.auth.getUser();
//       if (!user) {
//         navigate('/login');
//         return;
//       }

//       const { data, error } = await supabase
//         .from('tax_calculations')
//         .select('*')
//         .eq('user_id', user.id)
//         .order('created_at', { ascending: false })
//         .limit(1)
//         .single();

//       if (error) {
//         console.error(error);
//         return;
//       }

//       const formData = data as TaxCalculationForm;

//       setTaxData({
//         ...data,
//         breakdown: calculateTaxBreakdown({ ...formData, regime: data.regime }),
//         comparison: {
//           old: calculateTaxBreakdown({ ...formData, regime: 'old' }),
//           new: calculateTaxBreakdown({ ...formData, regime: 'new' }),
//         },
//       });
//     };

//     fetchTaxData();
//   }, [navigate]);

//   const generatePDF = async () => {
//     const input = pdfRef.current;
//     if (input) {
//       const canvas = await html2canvas(input);
//       const imgData = canvas.toDataURL('image/png');
//       const pdf = new jsPDF('p', 'mm', 'a4');
//       const imgProps = pdf.getImageProperties(imgData);
//       const pdfWidth = pdf.internal.pageSize.getWidth();
//       const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
//       pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
//       pdf.save('tax-summary.pdf');
//     }
//   };

//   if (!taxData) return <p className="text-center mt-10">Loading summary...</p>;

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Navbar />
//       <div className="max-w-4xl mx-auto py-8 px-4" ref={pdfRef}>
//         <h1 className="text-3xl font-bold text-gray-900 mb-6">Tax Summary</h1>

//         <div className="space-y-4 text-gray-800">
//           <p><strong>Tax Year:</strong> {taxData.tax_year}</p>
//           <p><strong>Regime:</strong> {taxData.regime}</p>
//           <p><strong>Total Income:</strong> ₹{(taxData.basic_salary + taxData.other_income).toLocaleString()}</p>
//           <p><strong>Allowances (Special + LTA + DA + HRA):</strong> ₹{(taxData.special_allowance + taxData.lta + taxData.da_received + taxData.hra_received).toLocaleString()}</p>
//           <p><strong>Deductions (Loans + Insurance):</strong> ₹{(taxData.education_loan_interest + taxData.home_loan_interest + taxData.investment_amount + taxData.insurance_amount_below_60 + taxData.insurance_amount_above_60).toLocaleString()}</p>
//           <p><strong>Metro City:</strong> {taxData.metro_city ? 'Yes' : 'No'}</p>

//           {taxData.breakdown?.slabs?.length > 0 && (
//             <div className="mt-6 border-t pt-4">
//               <h2 className="text-xl font-semibold mb-2">🧾 Tax Computation Breakdown ({taxData.regime.toUpperCase()} Regime)</h2>
//               <div className="overflow-x-auto">
//                 <table className="min-w-full bg-white border border-gray-200 text-sm">
//                   <thead>
//                     <tr>
//                       <th className="px-4 py-2 border-b text-left">Income Range</th>
//                       <th className="px-4 py-2 border-b text-left">Rate</th>
//                       <th className="px-4 py-2 border-b text-left">Tax Amount</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {taxData.breakdown.slabs.map((slab: any, index: number) => (
//                       <tr key={index}>
//                         <td className="px-4 py-2 border-b">{slab.range}</td>
//                         <td className="px-4 py-2 border-b">{slab.rate}</td>
//                         <td className="px-4 py-2 border-b">₹{(slab.amount ?? 0).toLocaleString()}</td>
//                       </tr>
//                     ))}
//                     <tr className="font-semibold bg-gray-100">
//                       <td className="px-4 py-2 border-t">Total</td>
//                       <td className="px-4 py-2 border-t">—</td>
//                       <td className="px-4 py-2 border-t">₹{(taxData.breakdown.tax ?? 0).toLocaleString()}</td>
//                     </tr>
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           )}

//           {taxData.breakdown && (
//             <div className="mt-6 border-t pt-4">
//               <h2 className="text-xl font-semibold mb-2">Tax Breakdown</h2>
//               <p><strong>Total Income:</strong> ₹{(taxData.breakdown.totalIncome ?? 0).toLocaleString()}</p>
//               <p><strong>HRA Exemption:</strong> ₹{(taxData.breakdown.hraExemption ?? 0).toLocaleString()}</p>
//               <p><strong>Total Deductions:</strong> ₹{(taxData.breakdown.deductions ?? 0).toLocaleString()}</p>
//               <p><strong>Taxable Income:</strong> ₹{(taxData.breakdown.taxableIncome ?? 0).toLocaleString()}</p>
//               <p className="flex items-center gap-2 text-lg">
//                 <strong>Tax Payable:</strong> ₹{(taxData.breakdown.tax ?? 0).toLocaleString()}
//                 <span className="relative group">
//                   <span className="cursor-pointer text-blue-600">❓</span>
//                   <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
//                     This is the total tax calculated slab-by-slab based on your taxable income. See the breakdown table above to understand how each slab contributed to this amount.
//                   </span>
//                 </span>
//               </p>
//             </div>
//           )}

//           {taxData.comparison && taxData.comparison.old && taxData.comparison.new && (
//             <div className="mt-6 border-t pt-4">
//               <h2 className="text-xl font-semibold mb-2">Old vs New Regime Comparison</h2>
//               <div className="overflow-x-auto">
//                 <table className="min-w-full bg-white border border-gray-200">
//                   <thead>
//                     <tr>
//                       <th className="px-4 py-2 border-b"></th>
//                       <th className="px-4 py-2 border-b text-left">Old Regime</th>
//                       <th className="px-4 py-2 border-b text-left">New Regime</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     <tr>
//                       <td className="px-4 py-2 border-b font-medium">Total Income</td>
//                       <td className="px-4 py-2 border-b">₹{(taxData.comparison.old.totalIncome ?? 0).toLocaleString()}</td>
//                       <td className="px-4 py-2 border-b">₹{(taxData.comparison.new.totalIncome ?? 0).toLocaleString()}</td>
//                     </tr>
//                     <tr>
//                       <td className="px-4 py-2 border-b font-medium">Deductions</td>
//                       <td className="px-4 py-2 border-b">₹{(taxData.comparison.old.deductions ?? 0).toLocaleString()}</td>
//                       <td className="px-4 py-2 border-b">₹{(taxData.comparison.new.deductions ?? 0).toLocaleString()}</td>
//                     </tr>
//                     <tr>
//                       <td className="px-4 py-2 border-b font-medium">Taxable Income</td>
//                       <td className="px-4 py-2 border-b">₹{(taxData.comparison.old.taxableIncome ?? 0).toLocaleString()}</td>
//                       <td className="px-4 py-2 border-b">₹{(taxData.comparison.new.taxableIncome ?? 0).toLocaleString()}</td>
//                     </tr>
//                     <tr>
//                       <td className="px-4 py-2 border-b font-medium">Tax Payable</td>
//                       <td className="px-4 py-2 border-b text-green-700 font-semibold">₹{(taxData.comparison.old.tax ?? 0).toLocaleString()}</td>
//                       <td className="px-4 py-2 border-b text-green-700 font-semibold">₹{(taxData.comparison.new.tax ?? 0).toLocaleString()}</td>
//                     </tr>
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           )}
//         </div>

//         <button
//           onClick={generatePDF}
//           className="mt-6 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
//         >
//           Download PDF
//         </button>
//       </div>
//     </div>
//   );
// }





import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '../lib/supabase';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import { calculateTaxBreakdown, TaxCalculationForm, StepByStepCalculation } from '../lib/taxUtils';

export default function TaxSummary() {
  const [taxData, setTaxData] = useState<any>(null);
  const [userAge, setUserAge] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const pdfRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTaxData = async () => {
      try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          navigate('/login');
          return;
        }

        // Fetch user details to get age
        const { data: userData, error: userError } = await supabase
          .from('user_details')
          .select('age')
          .eq('user_id', user.id)
          .single();

        if (userError && userError.code !== 'PGRST116') {
          console.error('Error fetching user age:', userError);
        } else if (userData) {
          setUserAge(userData.age);
        }

        // Fetch latest tax calculation
        const { data, error } = await supabase
          .from('tax_calculations')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (error) {
          console.error(error);
          setLoading(false);
          return;
        }

        const formData = data as TaxCalculationForm;
        const age = userData?.age || 35; // Default to 35 if age not found

        // Calculate tax breakdown for selected regime
        const currentRegimeBreakdown = calculateTaxBreakdown({ ...formData, regime: formData.regime }, age);

        // Calculate for comparison between regimes
        const oldRegimeBreakdown = calculateTaxBreakdown({ ...formData, regime: 'old' }, age);
        const newRegimeBreakdown = calculateTaxBreakdown({ ...formData, regime: 'new' }, age);

        setTaxData({
          ...data,
          userAge: age,
          breakdown: currentRegimeBreakdown,
          comparison: {
            old: oldRegimeBreakdown,
            new: newRegimeBreakdown,
          }
        });

        setLoading(false);
      } catch (error) {
        console.error('Error in fetchTaxData:', error);
        setLoading(false);
      }
    };

    fetchTaxData();
  }, [navigate]);

  
  const generatePDF = async () => {
    const input = document.getElementById("pdf-content");
    if (!input) return;
  
    const canvas = await html2canvas(input, { scale: 2.5 }); // slightly higher scale for better fit and clarity
    const imgData = canvas.toDataURL("image/png");
  
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
  
    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
  
    let heightLeft = imgHeight;
    let position = 0;
  
    // small top margin adjustment to allow tighter fit
    const marginTop = -5; // adjust as needed
  
    pdf.addImage(imgData, "PNG", 0, marginTop, imgWidth, imgHeight);
    heightLeft -= pdfHeight;
  
    while (heightLeft > 0) {
      position = heightLeft - imgHeight + marginTop;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
    }
  
    pdf.save("download.pdf");
  };
  

  if (loading) return <div className="flex justify-center items-center h-screen"><p className="text-lg">Loading summary...</p></div>;
  if (!taxData) return <p className="text-center mt-10">No tax calculation data found. Please complete a tax calculation first.</p>;

  const stepByStep = taxData.breakdown.stepByStep as StepByStepCalculation;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div id="pdf-content" className="p-4 bg-white">
      <div className="max-w-4xl mx-auto py-8 px-4" ref={pdfRef}>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Tax Summary</h1>
        
        {/* User and Tax Profile Information */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">User & Tax Profile</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-800">
            <p><strong>Tax Year:</strong> {taxData.tax_year}</p>
            <p><strong>Age:</strong> {taxData.userAge} years</p>
            <p><strong>Regime:</strong> {taxData.regime === 'old' ? 'Old' : 'New'} Regime</p>
            <p><strong>Metro City:</strong> {taxData.metro_city ? 'Yes' : 'No'}</p>
          </div>
        </div>
        
        {/* Step 1: Gross Income */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Step 1: Gross Income</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-4 py-2 text-left">Income Source</th>
                  <th className="px-4 py-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-2">Basic Salary</td>
                  <td className="px-4 py-2 text-right">₹{stepByStep.grossIncome.basic.toLocaleString()}</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Other Income</td>
                  <td className="px-4 py-2 text-right">₹{stepByStep.grossIncome.other.toLocaleString()}</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Special Allowance</td>
                  <td className="px-4 py-2 text-right">₹{stepByStep.grossIncome.special.toLocaleString()}</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">HRA Received</td>
                  <td className="px-4 py-2 text-right">₹{stepByStep.grossIncome.hra.toLocaleString()}</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">LTA</td>
                  <td className="px-4 py-2 text-right">₹{stepByStep.grossIncome.lta.toLocaleString()}</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">DA Received</td>
                  <td className="px-4 py-2 text-right">₹{stepByStep.grossIncome.da.toLocaleString()}</td>
                </tr>
                <tr className="bg-gray-50 font-medium">
                  <td className="px-4 py-2">Total Gross Income</td>
                  <td className="px-4 py-2 text-right">₹{stepByStep.grossIncome.total.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Step 2: Deductions & Exemptions */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Step 2: Deductions & Exemptions</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-4 py-2 text-left">Deduction Type</th>
                  <th className="px-4 py-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-2">Education Loan Interest</td>
                  <td className="px-4 py-2 text-right">₹{stepByStep.deductions.educationLoan.toLocaleString()}</td>
                </tr>
                {taxData.regime === 'old' && (
                  <>
                    <tr>
                      <td className="px-4 py-2">Home Loan Interest</td>
                      <td className="px-4 py-2 text-right">₹{stepByStep.deductions.homeLoan.toLocaleString()}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2">Investment ({taxData.investment_funds})</td>
                      <td className="px-4 py-2 text-right">₹{stepByStep.deductions.investment.toLocaleString()}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2">Medical Insurance</td>
                      <td className="px-4 py-2 text-right">₹{stepByStep.deductions.insurance.toLocaleString()}</td>
                    </tr>
                  </>
                )}
                <tr>
                  <td className="px-4 py-2">HRA Exemption</td>
                  <td className="px-4 py-2 text-right">₹{stepByStep.deductions.hra.toLocaleString()}</td>
                </tr>
                <tr className="bg-gray-50 font-medium">
                  <td className="px-4 py-2">Total Deductions & Exemptions 
                    {taxData.regime === 'new' && (
                      <span className="text-xs font-normal text-gray-500 ml-2">(New regime allows limited deductions)</span>
                    )}
                  </td>
                  <td className="px-4 py-2 text-right">₹{stepByStep.deductions.total.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Step 3: Taxable Income */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Step 3: Calculate Taxable Income</h2>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">Gross Income:</span>
              <span>₹{stepByStep.grossIncome.total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">Total Deductions & Exemptions:</span>
              <span>₹{stepByStep.deductions.total.toLocaleString()}</span>
            </div>
            <div className="border-t pt-2 mt-2 flex justify-between items-center font-semibold text-lg">
              <span>Taxable Income:</span>
              <span>₹{stepByStep.taxableIncome.toLocaleString()}</span>
            </div>
          </div>
        </div>
        
        {/* Step 4: Tax Calculation Breakdown */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Step 4: Tax Calculation Breakdown ({taxData.regime === 'old' ? 'Old' : 'New'} Regime)</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-4 py-2 text-left">Income Range</th>
                  <th className="px-4 py-2 text-center">Rate</th>
                  <th className="px-4 py-2 text-right">Tax Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {stepByStep.applicableSlabs.map((slab, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2">{slab.range}</td>
                    <td className="px-4 py-2 text-center">{slab.rate}</td>
                    <td className="px-4 py-2 text-right">₹{slab.amount.toLocaleString()}</td>
                  </tr>
                ))}
                <tr className="bg-gray-50 font-medium">
                  <td colSpan={2} className="px-4 py-2">Total Tax Payable</td>
                  <td className="px-4 py-2 text-right text-lg font-bold">₹{stepByStep.totalTax.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Old vs New Regime Comparison */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Old vs New Regime Comparison</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-4 py-2 text-left"></th>
                  <th className="px-4 py-2 text-center">Old Regime</th>
                  <th className="px-4 py-2 text-center">New Regime</th>
                  <th className="px-4 py-2 text-center">Difference</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-2 font-medium">Total Income</td>
                  <td className="px-4 py-2 text-center">₹{taxData.comparison.old.totalIncome.toLocaleString()}</td>
                  <td className="px-4 py-2 text-center">₹{taxData.comparison.new.totalIncome.toLocaleString()}</td>
                  <td className="px-4 py-2 text-center">₹0</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-medium">Deductions & Exemptions</td>
                  <td className="px-4 py-2 text-center">₹{(taxData.comparison.old.deductions + taxData.comparison.old.hraExemption).toLocaleString()}</td>
                  <td className="px-4 py-2 text-center">₹{(taxData.comparison.new.deductions + taxData.comparison.new.hraExemption).toLocaleString()}</td>
                  <td className="px-4 py-2 text-center">
                    ₹{Math.abs((taxData.comparison.old.deductions + taxData.comparison.old.hraExemption) - 
                        (taxData.comparison.new.deductions + taxData.comparison.new.hraExemption)).toLocaleString()}
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-medium">Taxable Income</td>
                  <td className="px-4 py-2 text-center">₹{taxData.comparison.old.taxableIncome.toLocaleString()}</td>
                  <td className="px-4 py-2 text-center">₹{taxData.comparison.new.taxableIncome.toLocaleString()}</td>
                  <td className="px-4 py-2 text-center">
                    ₹{Math.abs(taxData.comparison.old.taxableIncome - taxData.comparison.new.taxableIncome).toLocaleString()}
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-4 py-2 font-medium">Tax Payable</td>
                  <td className={`px-4 py-2 text-center font-bold ${taxData.comparison.old.tax <= taxData.comparison.new.tax ? 'text-green-600' : ''}`}>
                    ₹{taxData.comparison.old.tax.toLocaleString()}
                  </td>
                  <td className={`px-4 py-2 text-center font-bold ${taxData.comparison.new.tax <= taxData.comparison.old.tax ? 'text-green-600' : ''}`}>
                    ₹{taxData.comparison.new.tax.toLocaleString()}
                  </td>
                  <td className="px-4 py-2 text-center font-bold">
                    ₹{Math.abs(taxData.comparison.old.tax - taxData.comparison.new.tax).toLocaleString()}
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-center font-medium" colSpan={4}>
                    {taxData.comparison.old.tax < taxData.comparison.new.tax ? (
                      <span className="text-green-600">Old Regime is better for you. You save ₹{(taxData.comparison.new.tax - taxData.comparison.old.tax).toLocaleString()}!</span>
                    ) : taxData.comparison.new.tax < taxData.comparison.old.tax ? (
                      <span className="text-green-600">New Regime is better for you. You save ₹{(taxData.comparison.old.tax - taxData.comparison.new.tax).toLocaleString()}!</span>
                    ) : (
                      <span>Both regimes result in the same tax amount.</span>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        
        {/* Recommendations */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Recommendations</h2>
          <div className="prose max-w-none">
            <p>Based on your tax profile and calculation, here are some recommendations:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              {taxData.comparison.old.tax < taxData.comparison.new.tax ? (
                <li>Consider switching to the <strong>Old Regime</strong> as it would save you ₹{(taxData.comparison.new.tax - taxData.comparison.old.tax).toLocaleString()}</li>
              ) : (
                <li>Continue with the <strong>New Regime</strong> as it's more beneficial for your tax situation</li>
              )}
              
              {taxData.investment_amount < 150000 && (
                <li>You have not maxed out your Section 80C investments (₹1.5 lakh limit). Consider investing more to reduce your tax burden.</li>
              )}
              
              {taxData.insurance_amount_below_60 < 25000 && (
                <li>Your medical insurance premium is below the maximum deduction limit. Consider enhancing your health coverage.</li>
              )}
              
              {taxData.home_loan_interest > 0 && (
                <li>You're paying home loan interest. Make sure you're claiming the full eligible deduction under Section 24b.</li>
              )}
              
              <li>Consult a tax professional for personalized tax planning strategies.</li>
            </ul>
          </div>
        </div>
        </div>


        {/* PDF Download Button */}
        <div className="text-center mt-6">
          <button
            onClick={generatePDF}
            className="inline-flex items-center justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download PDF
          </button>
        </div>
      </div>
    </div>
    
  );
}