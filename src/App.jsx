
import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  // Estado para el valor neto (input principal)
  const [netEarnings, setNetEarnings] = useState(850);
  const [animateValues, setAnimateValues] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(true);

  // Constantes fijas
  const regularHours = 40;
  const overtimeHours = 5;
  const creditCardTips = 208; // Valor fijo
  
  // Porcentajes de deducciones (aproximados del recibo original)
  const federalRate = 0.095; // ~9.5%
  const socialSecurityRate = 0.062; // 6.2%
  const medicareRate = 0.0145; // 1.45%
  
  // Cálculo inverso: desde netEarnings calcular hourlyRate
  // netEarnings = (regularPay + overtimePay) * (1 - federalRate - socialSecurityRate - medicareRate)
  // regularPay = hourlyRate * regularHours
  // overtimePay = (hourlyRate * 1.5) * overtimeHours
  // totalEarnings = hourlyRate * regularHours + (hourlyRate * 1.5) * overtimeHours
  // totalEarnings = hourlyRate * (regularHours + 1.5 * overtimeHours)
  
  const totalDeductionRate = federalRate + socialSecurityRate + medicareRate;
  const totalHours = regularHours + (1.5 * overtimeHours); // 40 + (1.5 * 9.06) = 53.59
  const grossEarningsFromWork = netEarnings / (1 - totalDeductionRate);
  const hourlyRate = grossEarningsFromWork / totalHours;
  
  // Cálculos para mostrar
  const overtimeRate = hourlyRate * 1.5;
  const regularPay = +(hourlyRate * regularHours).toFixed(2);
  const overtimePay = +(overtimeRate * overtimeHours).toFixed(2);
  const grossPay = +(regularPay + overtimePay + creditCardTips).toFixed(2);
  
  // Deducciones calculadas
  const federalIncome = +((regularPay + overtimePay) * -federalRate).toFixed(2);
  const socialSecurity = +((regularPay + overtimePay) * -socialSecurityRate).toFixed(2);
  const medicare = +((regularPay + overtimePay) * -medicareRate).toFixed(2);
  const netPay = +(grossPay + federalIncome + socialSecurity + medicare).toFixed(2);

  // Efecto para activar animaciones cuando cambian los valores
  useEffect(() => {
    setAnimateValues(true);
    const timer = setTimeout(() => setAnimateValues(false), 600);
    return () => clearTimeout(timer);
  }, [netEarnings]);

  // Efecto para manejar la animación de entrada fullscreen
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFullscreen(false);
    }, 3000); // Cambia a normal después de 3 segundos
    return () => clearTimeout(timer);
  }, []);

  const handleNetEarningsChange = (e) => {
    setNetEarnings(Number(e.target.value));
  };

  return (
    <>
      <div className={`don-pan-banner ${isFullscreen ? 'fullscreen' : ''}`}>
        🍞 DON PAN 🍞
      </div>
      <div className="payroll-container" style={{opacity: isFullscreen ? 0 : 1, transition: 'opacity 1s ease-in-out'}}>
        <h2>Earnings Statement</h2>
      <div className="input-group">
        <label htmlFor="netEarnings">Net Pay Regular+Overtime:</label>
        <input
          id="netEarnings"
          type="number"
          step="0.01"
          value={netEarnings}
          onChange={handleNetEarningsChange}
          placeholder="Enter net earnings"
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
            <td>${creditCardTips}</td>
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
