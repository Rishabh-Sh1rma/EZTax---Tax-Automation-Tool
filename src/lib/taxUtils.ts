// // lib/taxUtils.ts

// export type TaxCalculationForm = {
//     basic_salary: number;
//     other_income: number;
//     hra_received: number;
//     lta: number;
//     da_received: number;
//     special_allowance: number;
//     rent_paid: number;
//     metro_city: boolean;
//     education_loan_interest: number;
//     home_loan_interest: number;
//     investment_amount: number;
//     insurance_amount_below_60: number;
//     insurance_amount_above_60: number;
//     regime: 'old' | 'new';
//   };
  
//   export type TaxSlabBreakdown = {
//     range: string;
//     rate: string;
//     amount: number;
//   };
  
//   export type TaxCalculationResult = {
//     totalIncome: number;
//     deductions: number;
//     hraExemption: number;
//     taxableIncome: number;
//     tax: number;
//     slabs: TaxSlabBreakdown[];
//   };
  
//   export function calculateTaxBreakdown(form: TaxCalculationForm): TaxCalculationResult {
//     const totalIncome =
//       form.basic_salary +
//       form.other_income +
//       form.special_allowance +
//       form.lta +
//       form.da_received;
  
//     const hraExemption = form.metro_city
//       ? Math.min(0.5 * form.basic_salary, form.rent_paid - 0.1 * form.basic_salary, form.hra_received)
//       : Math.min(0.4 * form.basic_salary, form.rent_paid - 0.1 * form.basic_salary, form.hra_received);
  
//     const deductions =
//       form.education_loan_interest +
//       form.home_loan_interest +
//       form.investment_amount +
//       form.insurance_amount_below_60 +
//       form.insurance_amount_above_60;
  
//     const taxableIncome = Math.max(0, totalIncome - hraExemption - deductions);
  
//     let tax = 0;
//     const slabs: TaxSlabBreakdown[] = [];
  
//     if (form.regime === 'old') {
//       const slabLimits = [250000, 250000, 500000]; // segments: 0-2.5L, 2.5–5L, 5–10L, >10L
//       const slabRates = [0, 0.05, 0.2, 0.3];
  
//       let remaining = taxableIncome;
//       let lower = 0;
  
//       for (let i = 0; i < slabRates.length; i++) {
//         const slab = i < slabLimits.length ? slabLimits[i] : Infinity;
//         const incomeInSlab = Math.min(remaining, slab);
  
//         const amount = incomeInSlab * slabRates[i];
//         if (incomeInSlab > 0) {
//           slabs.push({
//             range: `₹${lower.toLocaleString()} – ₹${(lower + incomeInSlab).toLocaleString()}`,
//             rate: `${(slabRates[i] * 100).toFixed(0)}%`,
//             amount,
//           });
//         }
  
//         tax += amount;
//         remaining -= incomeInSlab;
//         lower += incomeInSlab;
  
//         if (remaining <= 0) break;
//       }
//     } else {
//       const slabLimits = [300000, 300000, 300000, 300000, 300000]; // segments for new regime
//       const slabRates = [0, 0.05, 0.1, 0.15, 0.2, 0.3];
  
//       let remaining = taxableIncome;
//       let lower = 0;
  
//       for (let i = 0; i < slabRates.length; i++) {
//         const slab = i < slabLimits.length ? slabLimits[i] : Infinity;
//         const incomeInSlab = Math.min(remaining, slab);
  
//         const amount = incomeInSlab * slabRates[i];
//         if (incomeInSlab > 0) {
//           slabs.push({
//             range: `₹${lower.toLocaleString()} – ₹${(lower + incomeInSlab).toLocaleString()}`,
//             rate: `${(slabRates[i] * 100).toFixed(0)}%`,
//             amount,
//           });
//         }
  
//         tax += amount;
//         remaining -= incomeInSlab;
//         lower += incomeInSlab;
  
//         if (remaining <= 0) break;
//       }
//     }
  
//     return {
//       totalIncome,
//       hraExemption,
//       deductions,
//       taxableIncome,
//       tax,
//       slabs,
//     };
//   }
  

export type TaxCalculationForm = {
  basic_salary: number;
  other_income: number;
  hra_received: number;
  lta: number;
  da_received: number;
  special_allowance: number;
  rent_paid: number;
  metro_city: boolean;
  education_loan_interest: number;
  home_loan_interest: number;
  investment_amount: number;
  insurance_amount_below_60: number;
  insurance_amount_above_60: number;
  tax_year: string;
  regime: 'old' | 'new';
};

export type TaxSlabBreakdown = {
  range: string;
  rate: string;
  amount: number;
};

export type TaxCalculationResult = {
  totalIncome: number;
  deductions: number;
  hraExemption: number;
  taxableIncome: number;
  tax: number;
  slabs: TaxSlabBreakdown[];
  stepByStep?: StepByStepCalculation;
};

export type StepByStepCalculation = {
  grossIncome: {
    basic: number;
    other: number;
    special: number;
    hra: number;
    lta: number;
    da: number;
    total: number;
  };
  deductions: {
    educationLoan: number;
    homeLoan: number;
    investment: number;
    insurance: number;
    hra: number;
    total: number;
  };
  taxableIncome: number;
  applicableSlabs: TaxSlabBreakdown[];
  totalTax: number;
};

export function calculateTaxBreakdown(form: TaxCalculationForm, userAge?: number): TaxCalculationResult {
  // Calculate gross income (Step 1)
  const grossIncome = {
    basic: form.basic_salary,
    other: form.other_income,
    special: form.special_allowance,
    hra: form.hra_received,
    lta: form.lta,
    da: form.da_received,
    total: form.basic_salary + form.other_income + form.special_allowance + form.lta + form.da_received + form.hra_received
  };
  
  // Calculate HRA exemption based on metro city status
  const hraExemption = calculateHRAExemption(form.basic_salary, form.hra_received, form.rent_paid, form.metro_city);
  
  // Calculate deductions considering age and tax regime (Step 2)
  const deductions = calculateDeductions(form, userAge || 35);
  
  // Calculate taxable income (Step 3)
  const taxableIncome = Math.max(0, grossIncome.total - hraExemption - deductions.total);
  
  // Calculate tax based on applicable slabs (Step 4)
  const taxResult = calculateTaxBySlabs(taxableIncome, form.regime);
  
  // Create step by step calculation result
  const stepByStep: StepByStepCalculation = {
    grossIncome,
    deductions: {
      ...deductions,
      hra: hraExemption,
      total: deductions.total + hraExemption
    },
    taxableIncome,
    applicableSlabs: taxResult.slabs,
    totalTax: taxResult.tax
  };
  
  return {
    totalIncome: grossIncome.total,
    hraExemption,
    deductions: deductions.total,
    taxableIncome,
    tax: taxResult.tax,
    slabs: taxResult.slabs,
    stepByStep
  };
}

function calculateHRAExemption(basicSalary: number, hraReceived: number, rentPaid: number, isMetroCity: boolean): number {
  // Calculate HRA exemption based on three conditions
  const actualHRA = hraReceived;
  const rentMinusBasic = rentPaid - (0.1 * basicSalary);
  const basicPercentage = isMetroCity ? 0.5 * basicSalary : 0.4 * basicSalary;
  
  // HRA exemption is minimum of the three
  const exemption = Math.min(
    actualHRA,
    rentMinusBasic > 0 ? rentMinusBasic : 0,
    basicPercentage
  );
  
  return Math.max(0, exemption);
}

function calculateDeductions(form: TaxCalculationForm, userAge: number): {
  educationLoan: number;
  homeLoan: number;
  investment: number;
  insurance: number;
  total: number;
} {
  // Education loan interest is deductible in both regimes
  const educationLoan = form.education_loan_interest;
  
  // Other deductions depend on regime
  let homeLoan = 0;
  let investment = 0;
  let insurance = 0;
  
  if (form.regime === 'old') {
    // Old regime allows all deductions
    homeLoan = form.home_loan_interest;
    investment = Math.min(form.investment_amount, 150000); // Section 80C limit
    
    // Insurance deduction varies based on age
    const insuranceBelow60 = form.insurance_amount_below_60;
    const insuranceAbove60 = form.insurance_amount_above_60;
    
    // Apply higher limits for senior citizens
    insurance = (userAge >= 60) ? 
      Math.min(insuranceBelow60 + insuranceAbove60, 50000) : // Higher limit for seniors
      Math.min(insuranceBelow60 + insuranceAbove60, 25000);  // Regular limit
  }
  
  // Calculate total deductions
  const totalDeductions = educationLoan + homeLoan + investment + insurance;
  
  return {
    educationLoan,
    homeLoan,
    investment,
    insurance,
    total: totalDeductions
  };
}

function calculateTaxBySlabs(taxableIncome: number, regime: 'old' | 'new'): {
  tax: number;
  slabs: TaxSlabBreakdown[];
} {
  let tax = 0;
  const slabs: TaxSlabBreakdown[] = [];
  
  if (regime === 'old') {
    // Old regime tax slabs (2024-25)
    const slabLimits = [250000, 250000, 500000]; // segments: 0-2.5L, 2.5-5L, 5-10L, >10L
    const slabRates = [0, 0.05, 0.2, 0.3];
    
    let remaining = taxableIncome;
    let lower = 0;
    
    for (let i = 0; i < slabRates.length; i++) {
      const slab = i < slabLimits.length ? slabLimits[i] : Infinity;
      const incomeInSlab = Math.min(remaining, slab);
      
      const amount = incomeInSlab * slabRates[i];
      if (incomeInSlab > 0) {
        slabs.push({
          range: `₹${lower.toLocaleString()} – ₹${(lower + incomeInSlab).toLocaleString()}`,
          rate: `${(slabRates[i] * 100).toFixed(0)}%`,
          amount,
        });
      }
      
      tax += amount;
      remaining -= incomeInSlab;
      lower += slab;
      
      if (remaining <= 0) break;
    }
  } else {
    // New regime tax slabs (2024-25)
    const slabLimits = [300000, 300000, 300000, 300000, 300000]; // segments for new regime
    const slabRates = [0, 0.05, 0.1, 0.15, 0.2, 0.3];
    
    let remaining = taxableIncome;
    let lower = 0;
    
    for (let i = 0; i < slabRates.length; i++) {
      const slab = i < slabLimits.length ? slabLimits[i] : Infinity;
      const incomeInSlab = Math.min(remaining, slab);
      
      const amount = incomeInSlab * slabRates[i];
      if (incomeInSlab > 0) {
        slabs.push({
          range: `₹${lower.toLocaleString()} – ₹${(lower + incomeInSlab).toLocaleString()}`,
          rate: `${(slabRates[i] * 100).toFixed(0)}%`,
          amount,
        });
      }
      
      tax += amount;
      remaining -= incomeInSlab;
      lower += slab;
      
      if (remaining <= 0) break;
    }
  }
  
  return { tax, slabs };
}