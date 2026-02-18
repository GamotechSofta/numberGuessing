export function parseHtmlChart(htmlContent) {
  const parser = new DOMParser()
  const doc = parser.parseFromString(htmlContent, 'text/html')
  
  const table = doc.querySelector('table.page_optionSec__TETXb')
  if (!table) return []
  
  const rows = table.querySelectorAll('tbody tr')
  const charts = []
  
  rows.forEach((row) => {
    const cells = row.querySelectorAll('td')
    if (cells.length === 0) return
    
    // First cell is the date
    const dateCell = cells[0]
    const dateText = dateCell.textContent.trim().replace(/\s+/g, ' ')
    
    // Each day has 3 cells: left numbers, main number, right numbers
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    const chartData = {
      Date: dateText,
      Mon: null,
      Tue: null,
      Wed: null,
      Thu: null,
      Fri: null,
      Sat: null,
      Sun: null
    }
    
    // Start from cell 1 (skip date cell)
    for (let i = 0; i < days.length; i++) {
      const dayIndex = i * 3 + 1
      
      if (dayIndex + 2 < cells.length) {
        // Left numbers cell
        const leftCell = cells[dayIndex]
        const leftNumbers = Array.from(leftCell.querySelectorAll('div'))
          .map(div => div.textContent.trim())
          .filter(text => text)
        
        // Main number cell (middle) - has class page_middleH___jsAc
        const mainCell = cells[dayIndex + 1]
        const mainNumber = mainCell.textContent.trim()
        // Check if main cell has red class (page_redDigit__Dv9A8)
        const isHighlighted = mainCell.classList.contains('page_redDigit__Dv9A8')
        
        // Right numbers cell
        const rightCell = cells[dayIndex + 2]
        const rightNumbers = Array.from(rightCell.querySelectorAll('div'))
          .map(div => div.textContent.trim())
          .filter(text => text)
        
        // Check for asterisks
        const hasAsterisk = mainNumber === '**' || mainNumber.includes('*')
        const asteriskCount = (mainNumber.match(/\*/g) || []).length
        
        chartData[days[i]] = {
          mainNumber: mainNumber || '-',
          isHighlighted: isHighlighted,
          leftNumbers: leftNumbers,
          rightNumbers: rightNumbers,
          hasAsterisk: hasAsterisk,
          asteriskCount: asteriskCount
        }
      }
    }
    
    charts.push(chartData)
  })
  
  return charts
}
