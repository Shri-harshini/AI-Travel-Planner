import jsPDF from 'jspdf';

export const exportToPDF = async (itinerary, fileName = 'travel-itinerary.pdf') => {
  try {
    console.log('PDF Export - Itinerary data:', itinerary);
    
    if (!itinerary) {
      console.error('No itinerary data provided');
      return false;
    }

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    let yPosition = 20;

    // Title
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Travel Itinerary', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 15;

    // Destination
    pdf.setFontSize(16);
    pdf.text(itinerary.destination || 'Unknown Destination', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 15;

    // Total Cost
    pdf.setFontSize(14);
    const totalCost = itinerary.total_estimated_cost_inr || 0;
    console.log('PDF Export - Total Cost:', totalCost);
    pdf.text(`Total Budget: ₹${totalCost}`, pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 20;

    // Days
    if (itinerary.days && itinerary.days.length > 0) {
      console.log('PDF Export - Days count:', itinerary.days.length);
      
      itinerary.days.forEach((day) => {
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.text(`Day ${day.day}: ${day.theme}`, 20, yPosition);
        yPosition += 10;

        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'normal');
        
        if (day.schedule?.morning?.activities) {
          pdf.text('Morning:', 20, yPosition);
          yPosition += 6;
          day.schedule.morning.activities.forEach(activity => {
            pdf.text(`• ${activity}`, 25, yPosition);
            yPosition += 5;
          });
        }

        if (day.schedule?.afternoon?.activities) {
          pdf.text('Afternoon:', 20, yPosition);
          yPosition += 6;
          day.schedule.afternoon.activities.forEach(activity => {
            pdf.text(`• ${activity}`, 25, yPosition);
            yPosition += 5;
          });
        }

        if (day.schedule?.evening?.activities) {
          pdf.text('Evening:', 20, yPosition);
          yPosition += 6;
          day.schedule.evening.activities.forEach(activity => {
            pdf.text(`• ${activity}`, 25, yPosition);
            yPosition += 5;
          });
        }

        yPosition += 10;
      });
    }

    console.log('PDF Export - Saving file:', fileName);
    pdf.save(fileName);
    console.log('PDF Export - File saved successfully');
    return true;
  } catch (error) {
    console.error('PDF export error:', error);
    return false;
  }
};
