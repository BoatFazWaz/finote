'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useCurrency } from '@/hooks/useCurrency';
import { Calculator, DollarSign, TrendingUp, TrendingDown, Info, RefreshCw } from 'lucide-react';

interface TaxBracket {
  min: number;
  max: number | null;
  rate: number;
  description: string;
}

interface TaxCalculation {
  grossIncome: number;
  netIncome: number;
  totalTax: number;
  effectiveTaxRate: number;
  brackets: Array<{
    bracket: TaxBracket;
    taxableAmount: number;
    taxAmount: number;
  }>;
}

export default function TaxCalculator() {
  const { currency, formatAmount } = useCurrency();
  const [income, setIncome] = useState<string>('');
  const [isPreTax, setIsPreTax] = useState<boolean>(true);
  const [calculation, setCalculation] = useState<TaxCalculation | null>(null);
  const [showDetails, setShowDetails] = useState<boolean>(false);

  // Tax brackets for different currencies
  const taxBrackets = useMemo<Record<string, TaxBracket[]>>(() => ({
    THB: [
      { min: 0, max: 150000, rate: 0, description: '0% - Up to 150,000 THB' },
      { min: 150000, max: 300000, rate: 5, description: '5% - 150,001 to 300,000 THB' },
      { min: 300000, max: 500000, rate: 10, description: '10% - 300,001 to 500,000 THB' },
      { min: 500000, max: 750000, rate: 15, description: '15% - 500,001 to 750,000 THB' },
      { min: 750000, max: 1000000, rate: 20, description: '20% - 750,001 to 1,000,000 THB' },
      { min: 1000000, max: 2000000, rate: 25, description: '25% - 1,000,001 to 2,000,000 THB' },
      { min: 2000000, max: 5000000, rate: 30, description: '30% - 2,000,001 to 5,000,000 THB' },
      { min: 5000000, max: null, rate: 35, description: '35% - Over 5,000,000 THB' }
    ],
    USD: [
      { min: 0, max: 11600, rate: 10, description: '10% - Up to $11,600' },
      { min: 11600, max: 47150, rate: 12, description: '12% - $11,601 to $47,150' },
      { min: 47150, max: 100525, rate: 22, description: '22% - $47,151 to $100,525' },
      { min: 100525, max: 191950, rate: 24, description: '24% - $100,526 to $191,950' },
      { min: 191950, max: 243725, rate: 32, description: '32% - $191,951 to $243,725' },
      { min: 243725, max: 609350, rate: 35, description: '35% - $243,726 to $609,350' },
      { min: 609350, max: null, rate: 37, description: '37% - Over $609,350' }
    ]
  }), []);

  // Thai tax calculation with proper progressive formula
  const calculateThaiTax = useCallback((incomeAmount: number): TaxCalculation => {
    // Personal allowance deduction (60,000 THB for single person)
    const personalAllowance = 60000;
    const taxableIncome = Math.max(0, incomeAmount - personalAllowance);
    
    let totalTax = 0;
    const bracketCalculations: Array<{
      bracket: TaxBracket;
      taxableAmount: number;
      taxAmount: number;
    }> = [];

    // Progressive tax calculation
    let remainingTaxableIncome = taxableIncome;
    
    for (let i = 0; i < taxBrackets.THB.length; i++) {
      const bracket = taxBrackets.THB[i];
      
      if (remainingTaxableIncome <= 0) break;
      
      let taxableInThisBracket = 0;
      
      if (bracket.max === null) {
        // Highest bracket - tax all remaining income
        taxableInThisBracket = remainingTaxableIncome;
      } else {
        // Calculate how much income falls in this bracket
        const bracketRange = bracket.max - bracket.min;
        taxableInThisBracket = Math.min(remainingTaxableIncome, bracketRange);
      }
      
      if (taxableInThisBracket > 0) {
        const taxInThisBracket = (taxableInThisBracket * bracket.rate) / 100;
        totalTax += taxInThisBracket;
        
        bracketCalculations.push({
          bracket,
          taxableAmount: taxableInThisBracket,
          taxAmount: taxInThisBracket
        });
        
        remainingTaxableIncome -= taxableInThisBracket;
      }
    }

    const effectiveTaxRate = incomeAmount > 0 ? (totalTax / incomeAmount) * 100 : 0;
    const netIncome = incomeAmount - totalTax;

    return {
      grossIncome: incomeAmount,
      netIncome,
      totalTax,
      effectiveTaxRate,
      brackets: bracketCalculations
    };
  }, [taxBrackets.THB]);

  const calculateTax = useCallback((incomeAmount: number): TaxCalculation => {
    if (currency === 'THB') {
      return calculateThaiTax(incomeAmount);
    }
    
    // For USD, use the original calculation method
    const brackets = taxBrackets[currency];
    let remainingIncome = incomeAmount;
    let totalTax = 0;
    const bracketCalculations: Array<{
      bracket: TaxBracket;
      taxableAmount: number;
      taxAmount: number;
    }> = [];

    for (const bracket of brackets) {
      if (remainingIncome <= 0) break;

      const taxableInThisBracket = bracket.max 
        ? Math.min(remainingIncome, bracket.max - bracket.min)
        : remainingIncome;

      if (taxableInThisBracket > 0) {
        const taxInThisBracket = (taxableInThisBracket * bracket.rate) / 100;
        totalTax += taxInThisBracket;
        bracketCalculations.push({
          bracket,
          taxableAmount: taxableInThisBracket,
          taxAmount: taxInThisBracket
        });
        remainingIncome -= taxableInThisBracket;
      }
    }

    const effectiveTaxRate = incomeAmount > 0 ? (totalTax / incomeAmount) * 100 : 0;
    const netIncome = incomeAmount - totalTax;

    return {
      grossIncome: incomeAmount,
      netIncome,
      totalTax,
      effectiveTaxRate,
      brackets: bracketCalculations
    };
  }, [currency, calculateThaiTax, taxBrackets]);

  const handleCalculate = useCallback(() => {
    const incomeAmount = parseFloat(income);
    if (isNaN(incomeAmount) || incomeAmount <= 0) {
      setCalculation(null);
      return;
    }

    let calculation: TaxCalculation;
    
    if (isPreTax) {
      // Income is pre-tax, calculate net income
      calculation = calculateTax(incomeAmount);
    } else {
      // Income is post-tax, need to reverse calculate gross income
      // This is an approximation using iterative calculation
      let estimatedGross = incomeAmount;
      let iterations = 0;
      const maxIterations = 10;
      
      while (iterations < maxIterations) {
        const tempCalculation = calculateTax(estimatedGross);
        const calculatedNet = tempCalculation.netIncome;
        
        if (Math.abs(calculatedNet - incomeAmount) < 1) {
          break;
        }
        
        // Adjust estimated gross income
        const difference = incomeAmount - calculatedNet;
        estimatedGross += difference;
        iterations++;
      }
      
      calculation = calculateTax(estimatedGross);
    }

    setCalculation(calculation);
  }, [income, isPreTax, calculateTax]);

  const handleReset = () => {
    setIncome('');
    setIsPreTax(true);
    setCalculation(null);
    setShowDetails(false);
  };

  useEffect(() => {
    if (income) {
      handleCalculate();
    }
  }, [income, isPreTax, currency, handleCalculate]);

  return (
    <div className="card p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
          <Calculator className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            Tax Calculator
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Calculate your tax liability based on income
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Income Amount ({currency})
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              <input
                type="number"
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                placeholder="Enter your income"
                className="input-modern w-full pl-10"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Income Type
            </label>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  checked={isPreTax}
                  onChange={() => setIsPreTax(true)}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <div>
                  <span className="font-medium text-gray-900 dark:text-white">Pre-tax Income</span>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Calculate tax from gross income</p>
                </div>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  checked={!isPreTax}
                  onChange={() => setIsPreTax(false)}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <div>
                  <span className="font-medium text-gray-900 dark:text-white">Post-tax Income</span>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Calculate gross income from net income</p>
                </div>
              </label>
            </div>
          </div>

          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Reset Calculator
          </button>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          {calculation ? (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                    <span className="text-sm font-medium text-green-700 dark:text-green-300">
                      {isPreTax ? 'Gross Income' : 'Calculated Gross'}
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-green-800 dark:text-green-200">
                    {formatAmount(calculation.grossIncome)}
                  </p>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingDown className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                      {isPreTax ? 'Net Income' : 'Your Income'}
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-blue-800 dark:text-blue-200">
                    {formatAmount(calculation.netIncome)}
                  </p>
                </div>
              </div>

              {/* Tax Details */}
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-red-600 dark:text-red-400" />
                    <span className="font-medium text-red-800 dark:text-red-200">Total Tax</span>
                  </div>
                  <span className="text-sm text-red-600 dark:text-red-400">
                    {calculation.effectiveTaxRate.toFixed(1)}% effective rate
                  </span>
                </div>
                <p className="text-2xl font-bold text-red-800 dark:text-red-200">
                  {formatAmount(calculation.totalTax)}
                </p>
              </div>

              {/* Personal Allowance Info for Thai Tax */}
              {currency === 'THB' && (
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Info className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <span className="font-medium text-amber-800 dark:text-amber-200">Personal Allowance Deduction</span>
                  </div>
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    A personal allowance of <span className="font-semibold">60,000 THB</span> has been deducted from your gross income before calculating tax.
                  </p>
                </div>
              )}

              {/* Tax Brackets Details */}
              <div>
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <Info className="w-4 h-4" />
                  {showDetails ? 'Hide' : 'Show'} Tax Bracket Details
                </button>
                
                {showDetails && (
                  <div className="mt-4 space-y-3">
                    {calculation.brackets.map((bracketCalc, index) => (
                      <div key={index} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {bracketCalc.bracket.description}
                          </span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {bracketCalc.bracket.rate}%
                          </span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                          <span>Taxable: {formatAmount(bracketCalc.taxableAmount)}</span>
                          <span>Tax: {formatAmount(bracketCalc.taxAmount)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <Calculator className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                Enter your income to calculate taxes
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
          <div className="text-sm text-yellow-800 dark:text-yellow-200">
            <p className="font-medium mb-1">Disclaimer</p>
            <p>
              This calculator provides estimates based on standard tax brackets. Actual tax liability may vary due to deductions, 
              credits, and other factors. Please consult with a tax professional for accurate calculations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 