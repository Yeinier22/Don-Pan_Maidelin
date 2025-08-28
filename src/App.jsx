
import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  // Estado para el valor neto (input principal)
  const [netEarnings, setNetEarnings] = useState(705);
  const [inputValue, setInputValue] = useState('705');
  const [creditCardTips, setCreditCardTips] = useState(172);
  const [creditCardInputValue, setCreditCardInputValue] = useState('172');
  const [animateValues, setAnimateValues] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(true);
  const [showBanner, setShowBanner] = useState(true);
  const [calculationMode, setCalculationMode] = useState('netPay'); // 'netPay' o 'hourlyRate'
  const [hourlyRateInput, setHourlyRateInput] = useState('15.5');
  const [hourlyRateValue, setHourlyRateValue] = useState(15.5);

  // Constantes fijas
  const regularHours = 40;
  const overtimeHours = 5;
  
    // Tasas de impuestos basadas en colilla original ($922.90)
  const federalRate = 0.08829; // 8.829% ($81.47 / $922.90)
  const socialSecurityRate = 0.06201; // 6.201% ($57.22 / $922.90)
  const medicareRate = 0.01450; // 1.450% ($13.38 / $922.90)
  
  // Lógica de cálculo según el modo seleccionado
  let hourlyRate, overtimeRate, regularPay, overtimePay, grossPay, federalIncome, socialSecurity, medicare, netPay;
  
  if (calculationMode === 'netPay') {
    // Cálculo inverso: desde netEarnings calcular hourlyRate
    const totalDeductionRate = federalRate + socialSecurityRate + medicareRate;
    const totalHours = regularHours + (1.5 * overtimeHours);
    const grossEarningsFromWork = netEarnings / (1 - totalDeductionRate);
    hourlyRate = grossEarningsFromWork / totalHours;
    
    overtimeRate = hourlyRate * 1.5;
    regularPay = +(hourlyRate * regularHours).toFixed(2);
    overtimePay = +(overtimeRate * overtimeHours).toFixed(2);
    grossPay = +(regularPay + overtimePay + creditCardTips).toFixed(2);
    
    federalIncome = +(grossPay * -federalRate).toFixed(2);
    socialSecurity = +(grossPay * -socialSecurityRate).toFixed(2);
    medicare = +(grossPay * -medicareRate).toFixed(2);
    netPay = +(grossPay + federalIncome + socialSecurity + medicare).toFixed(2);
  } else {
    // Cálculo directo: desde hourlyRate calcular todo
    hourlyRate = hourlyRateValue;
    overtimeRate = hourlyRate * 1.5;
    regularPay = +(hourlyRate * regularHours).toFixed(2);
    overtimePay = +(overtimeRate * overtimeHours).toFixed(2);
    grossPay = +(regularPay + overtimePay + creditCardTips).toFixed(2);
    
    federalIncome = +(grossPay * -federalRate).toFixed(2);
    socialSecurity = +(grossPay * -socialSecurityRate).toFixed(2);
    medicare = +(grossPay * -medicareRate).toFixed(2);
    netPay = +(grossPay + federalIncome + socialSecurity + medicare).toFixed(2);
  }

  // Efecto para activar animaciones cuando cambian los valores
  useEffect(() => {
    setAnimateValues(true);
    const timer = setTimeout(() => setAnimateValues(false), 600);
    return () => clearTimeout(timer);
  }, [inputValue, creditCardInputValue, hourlyRateInput, calculationMode]);

  // Efecto para manejar la animación de entrada fullscreen
  useEffect(() => {
    const fullscreenTimer = setTimeout(() => {
      setIsFullscreen(false);
    }, 3000); // Cambia a normal después de 3 segundos
    
    const hideTimer = setTimeout(() => {
      setShowBanner(false);
    }, 6000); // Oculta completamente después de 6 segundos
    
    return () => {
      clearTimeout(fullscreenTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  const handleNetEarningsChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    
    // Solo actualizar netEarnings si hay un valor válido
    if (value === '' || value === null || value === undefined) {
      setNetEarnings(0);
    } else {
      const numValue = Number(value);
      setNetEarnings(isNaN(numValue) ? 0 : numValue);
    }
  };

  const handleCreditCardTipsChange = (e) => {
    const value = e.target.value;
    setCreditCardInputValue(value);
    
    // Solo actualizar creditCardTips si hay un valor válido
    if (value === '' || value === null || value === undefined) {
      setCreditCardTips(0);
    } else {
      const numValue = Number(value);
      setCreditCardTips(isNaN(numValue) ? 0 : numValue);
    }
  };

  const handleHourlyRateChange = (e) => {
    const value = e.target.value;
    setHourlyRateInput(value);
    
    // Solo actualizar hourlyRateValue si hay un valor válido
    if (value === '' || value === null || value === undefined) {
      setHourlyRateValue(0);
    } else {
      const numValue = Number(value);
      setHourlyRateValue(isNaN(numValue) ? 0 : numValue);
    }
  };

  const handleModeChange = () => {
    setCalculationMode(calculationMode === 'netPay' ? 'hourlyRate' : 'netPay');
  };

  return (
    <>
      {showBanner && (
        <div className={`don-pan-banner ${isFullscreen ? 'fullscreen' : ''}`}>
          🍞 DON PAN 🍞
        </div>
      )}
      <div className="payroll-container" style={{opacity: isFullscreen ? 0 : 1, transition: 'opacity 1s ease-in-out'}}>
        <h2>Earnings Statement</h2>
        
        {/* Switch para cambiar modo de cálculo */}
        <div className="mode-switch">
          <label className="switch-label">
            <span className={calculationMode === 'netPay' ? 'active' : ''}>Net Pay Mode</span>
            <label className="switch">
              <input 
                type="checkbox" 
                checked={calculationMode === 'hourlyRate'} 
                onChange={handleModeChange}
              />
              <span className="slider"></span>
            </label>
            <span className={calculationMode === 'hourlyRate' ? 'active' : ''}>Hourly Rate Mode</span>
          </label>
        </div>

        {/* Input condicional según el modo */}
        {calculationMode === 'netPay' ? (
          <div className="input-group">
            <label htmlFor="netEarnings">Net Pay Regular+Overtime:</label>
            <input
              id="netEarnings"
              type="number"
              step="0.01"
              value={inputValue}
              onChange={handleNetEarningsChange}
              placeholder="Enter net earnings"
              inputMode="decimal"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
            />
          </div>
        ) : (
          <div className="input-group">
            <label htmlFor="hourlyRate">Hourly Rate:</label>
            <input
              id="hourlyRate"
              type="number"
              step="0.01"
              value={hourlyRateInput}
              onChange={handleHourlyRateChange}
              placeholder="Enter hourly rate"
              inputMode="decimal"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
            />
          </div>
        )}
      <div className="input-group">
        <label htmlFor="creditCardTips">Credit Card Tips:</label>
        <input
          id="creditCardTips"
          type="number"
          step="0.01"
          value={creditCardInputValue}
          onChange={handleCreditCardTipsChange}
          placeholder="Enter credit card tips"
          inputMode="decimal"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
        />
      </div>
      <table className="payroll-table">
        <thead>
          <tr>
            <th>Earnings</th>
            <th>Rate</th>
            <th>Hours/Units</th>
            <th>This Period</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Regular</td>
            <td className={animateValues ? 'positive-value' : ''}>{hourlyRate.toFixed(3)}</td>
            <td>{regularHours}</td>
            <td className={animateValues ? 'positive-value' : ''}>${regularPay}</td>
          </tr>
          <tr>
            <td>Overtime</td>
            <td>{overtimeRate.toFixed(3)}</td>
            <td>{overtimeHours}</td>
            <td className={animateValues ? 'positive-value' : ''}>${overtimePay}</td>
          </tr>
          <tr className="blink-row" style={{fontWeight: 'bold'}}>
            <td>Regular + Overtime</td>
            <td>-</td>
            <td>-</td>
            <td className={animateValues ? 'positive-value' : ''}>${(regularPay + overtimePay).toFixed(2)}</td>
          </tr>
          <tr>
            <td>Credit card tips owed</td>
            <td>-</td>
            <td>-</td>
            <td className={animateValues ? 'positive-value' : ''}>${creditCardTips}</td>
          </tr>
        </tbody>
      </table>
      <div className="summary">
        <p className={animateValues ? 'positive-value' : ''}><strong>Gross Pay:</strong> ${grossPay}</p>
        <p className={animateValues ? 'negative-value' : ''}><strong>Federal Income:</strong> ${federalIncome}</p>
        <p className={animateValues ? 'negative-value' : ''}><strong>Social Security:</strong> ${socialSecurity}</p>
        <p className={animateValues ? 'negative-value' : ''}><strong>Medicare:</strong> ${medicare}</p>
        <p className={animateValues ? 'positive-value' : ''}><strong>Net Pay:</strong> ${netPay}</p>
      </div>
    </div>
    </>
  );
}

export default App;
